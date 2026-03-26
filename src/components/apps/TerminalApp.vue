<template>
  <div class="terminal-app" @click="handleTerminalClick">
    <!-- 终端内容区域 -->
    <div class="terminal-body" ref="terminalBody">
      <!-- 打字机效果提示 -->
      <div v-if="isTypewriting" class="typewriter-hint">
        按 ESC 或 Ctrl+C 跳过动画
      </div>
      <!-- 欢迎信息 -->
      <div v-if="false" class="terminal-line">Last login: {{ lastLogin }} on ttys000</div>
      <div v-if="false" class="terminal-line">Welcome to the macOS Terminal!</div>
      <div v-if="false" class="terminal-line">Type <span class="command">help</span> for a list of commands.</div>
      <div v-if="false" class="terminal-line"><br></div>

      <!-- 历史输出 -->
      <div v-for="(line, index) in outputLines" :key="index"
        :class="['terminal-line', line.className, { 'typing-line': line.isTyping }]">
        <span v-if="line.type === 'command'">
          <span class="prompt">{{ line.prompt }}</span>
          <span class="command">{{ line.text }}</span>
        </span>
        <span v-else v-html="line.text"></span>
        <!-- 为正在打字的行添加光标指示 -->
        <span v-if="line.isTyping && line.text" class="typing-cursor">_</span>
      </div>

      <!-- 欢迎动画行 -->
      <div v-if="showWelcomeAnimation && !welcomeAnimationComplete" class="terminal-line input-line welcome-animation">
        <span class="prompt">{{ currentPrompt }}</span>
        <span class="command">{{ currentAnimatedText }}</span>
        <span class="cursor">_</span>
      </div>

      <!-- 当前输入行 -->
      <div v-if="!showWelcomeAnimation || welcomeAnimationComplete" class="terminal-line input-line">
        <span class="prompt">{{ getDisplayPrompt() }}</span>
        <span>{{ getDisplayCommand() }}</span>
        <span class="cursor">_</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AuthAPI } from '../../api'

export default defineComponent({
  name: 'TerminalApp',
  props: {
    // 接收窗口配置参数
    window: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 基本状态
      currentCommand: '',
      currentPrompt: 'user@Macos_web:~$',
      outputLines: [] as any[],
      commandHistory: [] as string[],
      historyIndex: -1,
      showWelcome: true,
      lastLogin: new Date().toString().split(' ').slice(0, 5).join(' ') + ' on ttys000',

      // 欢迎动画状态
      showWelcomeAnimation: true, // 默认开启
      welcomeAnimationComplete: false,
      animatedCommand: 'welcome', // 默认自动输入 welcome
      currentAnimatedText: '',
      animationInterval: null as any,

      // 打字机效果状态
      typewriterQueue: [] as any[], // 等待显示的行队列
      isTypewriting: false, // 是否正在进行打字机效果
      typewriterSpeed: 60, // 每个字符的显示间隔(ms) - 更快的默认速度
      lineDelay: 500, // 每行之间的延迟(ms) - 更短的行间延迟

      // ========== 动画控制设置 ==========
      // 设置为 false 可以禁用欢迎动画，终端将直接启动
      // 设置为 true 可以启用欢迎动画（根据传参决定）
      enableWelcomeAnimation: true, // 默认true，自动演示welcome

      // 登录状态
      loginState: null as null | 'username' | 'password', // null, 'username', 'password'
      loginData: {
        username: '',
        password: ''
      },
      isLoggedIn: false,
      currentUser: 'guest',

      // ========== 开发配置 ==========
      // 备份命令权限配置
      devConfig: {
        skipAuth: true, // 🔧 开发模式：设置为true可跳过登录和权限检查
        allowedUsers: ['root', 'admin'] // 🔑 允许执行备份的用户名列表
      },

      // 文件系统模拟
      fileSystem: {
        home: {
          user: {
            Documents: {},
            Downloads: {},
            Desktop: {},
            'hello.txt': 'Hello, World!',
            'script.js': 'console.log("This is a sample script.");',
            'README.md': '# macOS Web Terminal\n\nWelcome to the web-based terminal!'
          }
        },
        usr: {
          bin: {},
          local: {}
        },
        etc: {},
        var: {}
      } as any,
      currentPath: ['home', 'user'],

      // 内置命令, 定义在methods中
    }
  },

  mounted() {
    // 处理传入的参数
    this.processInitialParams()

    // 初始化终端
    this.initTerminal()

    // 只有当窗口有焦点时才监听键盘事件
    if (this.window && this.window.focused) {
      document.addEventListener('keydown', this.handleKeyDown)
    } else {
        // 全局监听，但通过检查焦点元素来决定是否处理
        document.addEventListener('keydown', this.handleKeyDown)
    }

    // 聚焦终端
    this.focusTerminal()
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    // 清理动画定时器
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
    }
    // 清理打字机效果
    this.clearTypewriter()
  },

  watch: {
    // 监听窗口焦点状态变化
    'window.focused'(_newVal) {
        // 实际上我们不需要动态绑定/解绑事件，因为handleKeyDown内部会检查
    }
  },

  methods: {
    // 处理传入的初始参数
    processInitialParams() {
      // 获取URL参数和初始数据
      const urlParams = this.window.urlParams || {}
      const initialData = this.window.initialData || {}

      // 处理animatedCommand参数
      let animatedCommand = null

      // 优先使用URL参数中的command
      if (urlParams.command) {
        animatedCommand = urlParams.command
      }
      // 然后使用initialData中的initialCommand
      else if (initialData.initialCommand) {
        animatedCommand = initialData.initialCommand
      }
      // 最后使用workingDirectory作为显示内容
      else if (urlParams.workdir || initialData.workingDirectory) {
        animatedCommand = urlParams.workdir || initialData.workingDirectory
      }

      // 如果有动画命令，则启用动画
      if (animatedCommand) {
        this.animatedCommand = animatedCommand
        this.enableWelcomeAnimation = true
        this.showWelcomeAnimation = true
      }
      // 如果没有外部命令，保留 data 中的默认值 (welcome 动画)
      // else {
      //   this.enableWelcomeAnimation = false
      //   this.showWelcomeAnimation = false
      // }

      // 处理工作目录
      if (urlParams.workdir || initialData.workingDirectory) {
        const workdir = urlParams.workdir || initialData.workingDirectory
        this.currentPrompt = `guest@macos:${workdir}$ `
      }

      // 处理窗口标题
      if (urlParams.title || initialData.windowTitle) {
        const title = urlParams.title || initialData.windowTitle
        // 这里可以触发父组件更新窗口标题
        this.$emit('update-title', title)
      }
    },

    // 初始化终端
    initTerminal() {
      // 检查持久化登录状态
      const persistedUser = AuthAPI.getCurrentUser()
      if (persistedUser) {
          this.isLoggedIn = true
          this.currentUser = persistedUser
          if (this.currentUser === 'root') {
               this.currentPrompt = 'root@Macos_web:~# '
          }
      }

      // 根据设置决定是否启动欢迎动画
      if (this.showWelcome) {
        const welcomeLines = [
          `Last login: ${this.lastLogin} on ttys000`,
          'Welcome to the macOS Terminal!',
          'Type help for a list of commands.',
          ''
        ]
        this.addMultipleOutputLines(welcomeLines)
      }

      if (this.enableWelcomeAnimation) {
        this.startWelcomeAnimation()
      } else {
         this.showWelcomeAnimation = false
         this.welcomeAnimationComplete = true
      }
    },

    // 启动欢迎动画
    startWelcomeAnimation() {
      let index = 0
      const command = this.animatedCommand

      // 清空当前文本
      this.currentAnimatedText = ''

      // 逐字添加文本
      this.animationInterval = setInterval(() => {
        if (index < command.length) {
          this.currentAnimatedText += command[index]
          index++
        } else {
          // 动画完成
          clearInterval(this.animationInterval)
          setTimeout(() => {
            this.completeWelcomeAnimation()
          }, 100) // 完成后等待100ms
        }
      }, 60) // 使用更快的默认打字速度
    },

    // 完成欢迎动画
    completeWelcomeAnimation() {
      this.welcomeAnimationComplete = true
      // 执行动画命令
      setTimeout(() => {
        this.executeCommand(this.animatedCommand)
        this.showWelcomeAnimation = false
      }, 500)
    },

    // 跳过欢迎动画
    skipWelcomeAnimation() {
      // 停止所有打字机效果
      this.isTypewriting = false
      if (this.animationInterval) {
        clearInterval(this.animationInterval)
        this.animationInterval = null
      }
      
      // 快速完成当前所有待办
      this.skipTypewriterAnimation()

      // 直接设置为完成状态
      this.welcomeAnimationComplete = true
      this.showWelcomeAnimation = false
    },

    // 处理终端点击事件
    handleTerminalClick() {
        this.focusTerminal()
    },

    // 聚焦终端
    focusTerminal() {
        // 在Vue组件中，我们不需要显式聚焦div，因为我们监听document的keydown
        // 可以添加视觉反馈
    },

    // 处理键盘事件
    handleKeyDown(event: KeyboardEvent) {
      // 检查当前焦点是否在输入控件上
      const activeElement = document.activeElement
      const isInputElement = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).isContentEditable
      )

      // 如果当前有其他输入控件获得焦点，不处理键盘事件（除了ESC键）
      if (isInputElement && event.key !== 'Escape') {
        return
      }
      
      // 如果当前窗口没有焦点（虽然我们在全局监听，但通常只应响应最上层窗口）
      // 这里简化逻辑：只要不是在其他输入框，就响应
      
      // 如果欢迎动画正在进行，允许按 Escape 键跳过动画
      if (this.showWelcomeAnimation && !this.welcomeAnimationComplete) {
        if (event.key === 'Escape') {
          event.preventDefault()
          this.skipWelcomeAnimation()
          return
        }
        // 忽略其他所有键盘输入
        event.preventDefault()
        return
      }

      // 处理按键
      if (event.key === 'Enter') {
        event.preventDefault()
        if (this.loginState) {
           this.processLoginInput()
        } else {
           this.executeCommand(this.currentCommand)
        }
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        if (this.currentCommand.length > 0) {
          this.currentCommand = this.currentCommand.slice(0, -1)
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (this.loginState) return; // Disable history during login
        if (this.commandHistory.length > 0) {
          if (this.historyIndex > 0) {
            this.historyIndex--
          }
          this.currentCommand = this.commandHistory[this.historyIndex] || ''
        } else if (this.historyIndex === -1 && this.commandHistory.length > 0) {
             this.historyIndex = this.commandHistory.length - 1
             this.currentCommand = this.commandHistory[this.historyIndex] || ''
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (this.loginState) return; // Disable history during login
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++
          this.currentCommand = this.commandHistory[this.historyIndex] || ''
        } else {
          this.historyIndex = this.commandHistory.length
          this.currentCommand = ''
        }
      } else if (event.key === 'Escape' && this.isTypewriting) {
        // 按 Escape 键跳过Welcome命令的打字机动画
        event.preventDefault()
        this.skipTypewriterAnimation()
      } else if (event.ctrlKey && event.key === 'c') {
        event.preventDefault()
        if (this.isTypewriting) {
          this.skipTypewriterAnimation()
        } else if (this.loginState) {
          // Cancel login
          this.addOutputLine('^C')
          this.loginState = null
          this.currentCommand = ''
          this.scrollToBottom()
        } else {
          // Cancel current command
          this.outputLines.push({
            type: 'command',
            prompt: this.currentPrompt,
            text: this.currentCommand + '^C',
            className: ''
          })
          this.currentCommand = ''
          this.scrollToBottom()
        }
        return
      } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        this.currentCommand += event.key
      } else if (event.key === 'Tab') {
        event.preventDefault()
        // Simple autocomplete stub
        const cmds = ['help', 'clear', 'echo', 'date', 'whoami', 'ls', 'pwd', 'cd', 'welcome']
        const matches = cmds.filter(c => c.startsWith(this.currentCommand))
        if (matches.length === 1) {
          this.currentCommand = matches[0] + ' '
        }
      }

      // 滚动到底部
      this.scrollToBottom()
    },

    // 执行命令
    executeCommand(input: string) {
      const trimmedInput = input.trim()
      if (!trimmedInput) {
          this.addOutputLine('', 'output') // 空行
          this.currentCommand = '' // Reset
          return
      };

      // 添加命令到历史
      this.commandHistory.push(input)
      this.historyIndex = this.commandHistory.length

      // 添加命令行到输出
      this.outputLines.push({
        type: 'command',
        prompt: this.currentPrompt,
        text: input,
        className: ''
      })

      // 解析并执行命令
      const parts = trimmedInput.split(/\s+/)
      const cmd = parts[0]
      const args = parts.slice(1)

      switch (cmd) {
        case 'help': this.cmdHelp(); break;
        case 'clear': this.cmdClear(); break;
        case 'echo': this.cmdEcho(args); break;
        case 'pwd': this.cmdPwd(args); break;
        case 'ls': this.cmdLs(args); break;
        case 'cd': this.cmdCd(args); break;
        case 'whoami': this.cmdWhoami(); break;
        case 'date': this.cmdDate(); break;
        case 'welcome': this.cmdWelcome(); break;
        case 'login': this.cmdLogin(); break;
        case 'logout': this.cmdLogout(); break;
        case 'touch': this.cmdTouch(args); break;
        case 'rm': this.cmdRm(args); break;
        case 'upload': this.cmdUpload(args); break;
        case 'exit': this.addOutputLine('Process completed'); break;
        default: this.addOutputLine(`zsh: command not found: ${cmd}`, 'error');
      }

      // 清空当前命令
      this.currentCommand = ''

      // 滚动到底部
      this.scrollToBottom()
    },

    // 添加输出行（默认立即显示）
    addOutputLine(text: string, className = 'output') {
      // 如果文本包含多行，分别处理每一行
      const lines = text.split('\n')

      lines.forEach(line => {
        this.outputLines.push({
          type: 'output',
          text: line,
          className: className,
          isTyping: false
        })
      })

      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    // 滚动到底部
    scrollToBottom() {
      if (this.$refs.terminalBody) {
        (this.$refs.terminalBody as HTMLElement).scrollTop = (this.$refs.terminalBody as HTMLElement).scrollHeight
      }
    },

    // 获取显示的提示符
    getDisplayPrompt() {
      if (this.loginState === 'username') {
        return 'login: '
      } else if (this.loginState === 'password') {
        return 'password: '
      }
      return this.currentPrompt
    },

    // 获取显示的命令（密码时显示星号）
    getDisplayCommand() {
      if (this.loginState === 'password') {
        return '*'.repeat(this.currentCommand.length)
      }
      return this.currentCommand
    },

    // 延迟函数
    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    // 清理打字机效果
    clearTypewriter() {
      this.typewriterQueue = []
      this.isTypewriting = false
    },
    
    // 立即显示所有队列内容（跳过动画）
    skipTypewriterAnimation() {
      // 将队列中的所有内容立即添加到输出
      while (this.typewriterQueue.length > 0) {
        const item = this.typewriterQueue.shift()
        this.outputLines.push({
          type: item.type,
          text: item.text,
          className: item.className,
          isTyping: false
        })
      }

      this.isTypewriting = false
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    // 使用打字机效果添加输出行
    addOutputLineWithTypewriter(text: string, className = 'output') {
      const lines = text.split('\n')
      lines.forEach((line) => {
        this.typewriterQueue.push({
          type: 'output',
          text: line,
          className: className
        })
      })

      if (!this.isTypewriting) {
        this.processTypewriterQueue()
      }
    },

    // 添加多行输出（使用打字机效果）
    addMultipleOutputLinesWithTypewriter(lines: string[], className = 'output') {
      lines.forEach((line) => {
        this.typewriterQueue.push({
          type: 'output',
          text: line,
          className: className
        })
      })

      if (!this.isTypewriting) {
        this.processTypewriterQueue()
      }
    },

    // 添加多行输出（立即显示）
    addMultipleOutputLines(lines: string[], className = 'output') {
      lines.forEach((line) => {
        this.addOutputLine(line, className)
      })
    },

    // 处理打字机队列
    async processTypewriterQueue() {
      if (this.isTypewriting || this.typewriterQueue.length === 0) {
        return
      }

      this.isTypewriting = true

      while (this.typewriterQueue.length > 0) {
        // 如果打字机状态被外部重置（如skip），则停止
        if (!this.isTypewriting) break;

        const item = this.typewriterQueue.shift()
        await this.typewriteLine(item)

        // 行间延迟
        if (this.typewriterQueue.length > 0 && this.isTypewriting) {
          await this.delay(this.lineDelay) // Use configured lineDelay
        }
      }

      this.isTypewriting = false
    },

    // 逐字符显示一行
    async typewriteLine(item: any) {
      return new Promise<void>((resolve) => {
        // 创建一个占位行
        this.outputLines.push({
          type: item.type,
          text: '',
          className: item.className,
          isTyping: true
        })

        // 获取响应式引用
        const lineIndex = this.outputLines.length - 1
        // const activeLine = this.outputLines[lineIndex] // computed via index access in loop

        let charIndex = 0
        const text = item.text

        const typeNextChar = () => {
          // 检查是否被中断
          if (!this.isTypewriting) {
             this.outputLines[lineIndex].text = text
             this.outputLines[lineIndex].isTyping = false
             resolve()
             return
          }

          if (charIndex < text.length) {
            this.outputLines[lineIndex].text = text.substring(0, charIndex + 1)
            charIndex++

            this.$nextTick(() => {
              this.scrollToBottom()
            })

            setTimeout(typeNextChar, this.typewriterSpeed) // Use configured typewriterSpeed
          } else {
            this.outputLines[lineIndex].isTyping = false
            resolve()
          }
        }

        if (text === '') {
          this.outputLines[lineIndex].isTyping = false
          resolve()
        } else {
          typeNextChar()
        }
      })
    },

    // --- Commands ---

    cmdHelp() {
        const helpText = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal screen
  echo     - Print arguments to the screen
  date     - Show current date and time
  whoami   - Print current user
  ls       - List directory contents
  pwd      - Print working directory
  cd       - Change directory
  login    - Log in to system
  logout   - Log out
  touch    - Create a new file (requires login)
  rm       - Remove a file (requires login)
  upload   - Upload a file (simulated, requires login)`
        this.addOutputLine(helpText)
    },

    cmdClear() {
        this.outputLines = []
    },

    cmdEcho(args: string[]) {
        this.addOutputLine(args.join(' '))
    },

    cmdDate() {
        this.addOutputLine(new Date().toString())
    },

    cmdWhoami() {
        this.addOutputLine(this.isLoggedIn ? this.currentUser : 'guest')
    },

    cmdLogin() {
        if (this.isLoggedIn) {
            this.addOutputLine(`Already logged in as ${this.currentUser}.`)
            return
        }
        this.loginState = 'username'
        this.currentCommand = ''
    },

    cmdLogout() {
        if (!this.isLoggedIn) {
             this.addOutputLine('Not logged in.')
             return
        }
        this.isLoggedIn = false
        this.currentUser = 'guest'
        this.currentPrompt = 'user@Macos_web:~$ ' // Reset prompt
        this.addOutputLine('Logged out.')
        AuthAPI.logout()
    },

    processLoginInput() {
        const input = this.currentCommand
        
        // Echo the input (masked if password) implies logic in getDisplayCommand, 
        // but here we just want to push the line "login: user" or "Password: "
        if (this.loginState === 'username') {
             this.addOutputLine(`login: ${input}`)
             this.loginData.username = input
             this.loginState = 'password'
             this.currentCommand = ''
        } else if (this.loginState === 'password') {
             // Don't echo password text
             this.addOutputLine(`Password: `) 
             this.loginData.password = input
             
             // Check credentials
             if (this.loginData.username === 'root' && this.loginData.password === 'root2119') {
                 this.isLoggedIn = true
                 this.currentUser = 'root'
                 this.currentPrompt = 'root@Macos_web:~# ' // Change prompt for root
                 this.addOutputLine(`Welcome back, ${this.currentUser}.`)
                 this.addOutputLine(`Last login: ${new Date().toString().split(' ').slice(0,5).join(' ')} on ttys000`)
                 AuthAPI.login(this.currentUser)
             } else {
                 this.addOutputLine('Login incorrect', 'error')
             }
             
             // Reset
             this.loginState = null
             this.currentCommand = ''
             this.loginData = { username: '', password: '' }
        }
    },

    cmdTouch(args: string[]) {
        if (!this.isLoggedIn) {
            this.addOutputLine('Permission denied. Please login first.', 'error')
            return
        }
        if (args.length === 0) {
            this.addOutputLine('touch: missing file operand', 'error')
            return
        }
        const fileName = args[0]
        if (!fileName) return
        const dir = this.getCurrentDirectory() as any
        if (dir) {
            if (Object.prototype.hasOwnProperty.call(dir, fileName)) {
                // Update timestamp theoretically
            } else {
                dir[fileName] = ''
            }
        }
    },

    cmdRm(args: string[]) {
        if (!this.isLoggedIn) {
            this.addOutputLine('Permission denied. Please login first.', 'error')
            return
        }
        if (args.length === 0) {
            this.addOutputLine('rm: missing operand', 'error')
            return
        }
        const fileName = args[0]
        if (!fileName) return
        const dir = this.getCurrentDirectory() as any
        if (dir) {
            if (Object.prototype.hasOwnProperty.call(dir, fileName)) {
                delete dir[fileName]
            } else {
                this.addOutputLine(`rm: cannot remove '${fileName}': No such file or directory`, 'error')
            }
        }
    },

    cmdUpload(args: string[]) {
        if (!this.isLoggedIn) {
            this.addOutputLine('Permission denied. Please login first.', 'error')
            return
        }
        if (args.length === 0) {
            this.addOutputLine('upload: missing file operand', 'error')
            return
        }
        const fileName = args[0]
        if (!fileName) return
        const dir = this.getCurrentDirectory() as any
        if (dir) {
             if (Object.prototype.hasOwnProperty.call(dir, fileName)) {
                 this.addOutputLine(`upload: '${fileName}' already exists.`, 'error')
             } else {
                 dir[fileName] = 'Uploaded content...'
                 this.addOutputLine(`Successfully uploaded '${fileName}'`)
             }
        }
    },

    cmdWelcome() {
      // 计算当前日期信息
      const now = new Date()
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const currentWeekday = weekdays[now.getDay()]
      
      const welcomeLines = [
        "",
        " " +currentWeekday  + " " + now.toLocaleString(),
        "",
        " 遇见 获得 失去 释怀 成长 完结",
        " 我与旧事归于尽，来年依旧迎花开",
        "",
        "",
        " 欢迎来到我的blog~,一个伪macos桌面系统博客✨ "
      ]

      this.addMultipleOutputLinesWithTypewriter(welcomeLines)
    },

    cmdLs(_args: string[]) {
        const currentDir = this.getCurrentDirectory() as any
        if (!currentDir) return; // Handle case where directory might not be found
        const files = Object.keys(currentDir).map(name => {
             const val = currentDir[name];
             if (typeof val === 'string') return name;
             return name + '/';
        });
        
        // 格式化输出
         this.addOutputLine(files.join('  '))
    },

    cmdPwd(_args: string[]) {
        this.addOutputLine('/' + this.currentPath.join('/'))
    },

    cmdCd(args: string[]) {
        const path = args[0]
        if (!path || path === '~') {
            this.currentPath = ['home', 'user']
            return
        }
        
        if (path === '..') {
            if (this.currentPath.length > 0) {
                this.currentPath.pop()
            }
            return
        }
        
        // 简单支持向下导航
        const currentDir = this.getCurrentDirectory()
        if (currentDir[path] && typeof currentDir[path] !== 'string') {
             this.currentPath.push(path)
        } else {
             this.addOutputLine(`cd: no such file or directory: ${path}`, 'error')
        }
    },
    
    // 获取当前目录对象
    getCurrentDirectory() {
      // let dir = this.fileSystem
      // 这里的 fileSystem 结构比较简单
      // currentPath ['home', 'user'] -> fileSystem.home.user
      try {
          // 这里简化处理
          if (this.currentPath.length === 2 && this.currentPath[0] === 'home' && this.currentPath[1] === 'user') {
              return this.fileSystem.home.user;
          }
          return {}; 
      } catch (e) {
          return {}
      }
    },
  }
})
</script>

<style scoped>
.terminal-app {
  width: 100%;
  height: 100%;
  /* Force dark theme for terminal typically, or use system. 
     Real macOS terminal follows basics but "Pro" theme is popular. 
     Let's stick to system valid variables but ensure readability. */
  background-color: var(--app-bg-terminal); 
  color: var(--text-primary);
  /* Add subtle texture or gradient for realism */
  background-image: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%);
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Slightly more padding for the "Pro" feel */
}

.terminal-body {
  flex: 1;
  padding: 6px 8px; /* Compact padding */
  overflow-y: auto;
  outline: none;
}

.terminal-line {
  min-height: 18px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
} 

.prompt {
  /* Default MacOS prompt is often bold but same color, or colored. 
     Improving contrast */
  color: var(--text-secondary); 
  /* Or keep green if user prefers Linux-y feel, but macOS default is usually black/white or basic. 
     Let's use a subtle highlight color. */
  color: var(--macos-green);
  font-weight: bold;
  margin-right: 8px;
}

.command {
  color: var(--text-primary); /* Use theme variable */
  font-weight: bold;
}

.error {
  color: var(--macos-red); /* Use theme variable */
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: var(--text-secondary); /* Use theme variable */
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

.typing-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: var(--text-secondary); /* Use theme variable */
  vertical-align: text-bottom;
}

.typewriter-hint {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-secondary); /* Use theme variable */
  pointer-events: none;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Scrollbar styling */
.terminal-body::-webkit-scrollbar {
  width: 8px;
}

.terminal-body::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-body::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb); /* Use theme variable */
  border-radius: 4px;
}

.terminal-body::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover); /* Use theme variable */
}
</style>
