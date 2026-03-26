# macOS Desktop Web 还原

一款基于 Web 的 macOS 风格虚拟桌面，以熟悉的交互体验无缝管理云端存储。

## ✨ 特性

### 核心功能
- 🖥️ **完整桌面环境** - 包含菜单栏、Dock 栏、Launchpad 和桌面图标
- 🪟 **窗口管理系统** - 支持多窗口、拖拽、最小化、关闭、层级管理
- 🎨 **毛玻璃效果** - 使用 backdrop-filter 实现真实的毛玻璃材质
- ⚡ **流畅动画** - 窗口打开、hover 效果等平滑过渡
- 🎯 **深度交互** - 完整还原 macOS 的交互体验
- 🚀 **Launchpad 启动台** - 网格化应用启动器，完美还原 macOS
- 📱 **桌面小组件** - 时钟、天气、日历、用户卡片等桌面小组件
- 🌐 **国际化支持** - 中文界面（i18n 架构）
- ☁️ **云端数据同步** - 基于 Laf 云函数的 KV 数据持久化
- 🖱️ **右键菜单** - 上下文菜单系统
- 🎨 **主题系统** - 支持主题切换
- ⏳ **macOS 加载动画** - 仿真开机加载效果

### 内置应用 (9 款)

#### 1. **Finder** - 文件管理器
- 侧边栏导航（收藏夹、iCloud、标签）
- 网格视图和列表视图切换
- 面包屑导航
- 文件预览与云端存储同步

#### 2. **Safari** - 浏览器
- 地址栏和导航控制
- 多标签页管理
- 书签收藏页面
- 模拟网页浏览

#### 3. **Notes** - 备忘录
- 笔记列表侧边栏
- 富文本编辑器
- 实时预览更新
- 创建新笔记

#### 4. **Calendar** - 日历
- 月视图日历
- 事件显示
- 日期选择
- 今日高亮

#### 5. **Settings** - 系统设置
- 多面板设置界面
- 外观主题设置
- Dock 自定义
- 其他系统配置

#### 6. **Terminal** - 终端
- 仿真终端模拟器
- 命令行交互体验

#### 7. **VSCode** - 代码编辑器
- 集成 Monaco Editor 代码编辑器
- 语法高亮
- 代码编辑体验

#### 8. **Stickies** - 便签
- 桌面便签应用
- 快速记录

#### 9. **Preview** - 预览
- 文件预览工具
- 图片查看

### Launchpad 启动台注册应用 (16 款)
Finder、Launchpad、Safari、Messages、Notes、Stickies、Contacts、Calendar、Music、Settings、Calculator、Reminders、Preview、Terminal、Siri、VSCode

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建
```bash
npm run preview
```

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **代码编辑器**: Monaco Editor
- **样式**: CSS3（毛玻璃、渐变、动画）
- **设计系统**: 自定义 CSS 变量和令牌
- **云服务**: Laf 云函数（KV 数据同步）

## 🎨 设计亮点

1. **最新 macOS Sequoia 风格**
   - 动态壁纸背景
   - 半透明毛玻璃效果
   - 现代化的配色方案

2. **精致的交互细节**
   - Dock 图标 hover 放大效果
   - 窗口拖拽和层级管理
   - 平滑的过渡动画
   - 右键上下文菜单

3. **高度还原**
   - 真实的窗口控制按钮（红黄绿）
   - 实时时钟显示
   - 应用运行指示器
   - macOS 开机加载动画
   - 桌面小组件系统

## 📁 项目结构

```
mac/
├── index.html                    # 入口 HTML
├── package.json                  # 项目配置与依赖
├── vite.config.ts                # Vite 构建配置
├── tsconfig.json                 # TypeScript 配置
├── 云数据同步api接口文档.md        # 云函数 API 文档
├── docs/
│   └── 开发新应用指南.md           # 新应用开发指南
├── public/
│   ├── wallpaper.png             # 桌面壁纸
│   ├── wallpaper1.png            # 备选壁纸
│   ├── tx.jpg                    # 头像
│   ├── 抖音.jpg                   # 抖音图片资源
│   └── icons/                    # 应用图标集 (26 个图标)
│       ├── finder.png
│       ├── safari.png
│       ├── terminal.png
│       ├── vscode.png
│       ├── notes.png
│       ├── calendar.png
│       ├── settings.png
│       └── ...                   # 更多应用图标
├── src/
│   ├── main.ts                   # 应用入口
│   ├── App.vue                   # 主应用组件（桌面编排）
│   ├── style.css                 # 全局样式和设计令牌
│   ├── api/
│   │   └── index.ts              # 云端 KV 数据同步 API
│   ├── config/
│   │   └── apps.ts               # 应用注册配置（统一管理）
│   ├── composables/              # 组合式函数
│   │   ├── useApps.ts            # 应用状态管理
│   │   ├── useCloudSync.ts       # 云端同步逻辑
│   │   ├── useI18n.ts            # 国际化钩子
│   │   └── useTheme.ts           # 主题切换逻辑
│   ├── locales/
│   │   └── zh-CN.ts              # 中文语言包
│   ├── utils/
│   │   └── iconHelpers.ts        # 图标工具函数
│   ├── assets/
│   │   └── vue.svg               # Vue logo
│   └── components/
│       ├── MenuBar.vue           # 顶部菜单栏
│       ├── Dock.vue              # 底部 Dock 栏
│       ├── DesktopIcons.vue      # 桌面图标管理
│       ├── Window.vue            # 通用窗口组件
│       ├── Launchpad.vue         # 启动台
│       ├── MacLoading.vue        # macOS 加载动画
│       ├── ContextMenu.vue       # 右键菜单
│       ├── desktop/
│       │   ├── DesktopWidgets.vue     # 桌面小组件容器
│       │   └── widgets/
│       │       ├── WidgetWrapper.vue  # 小组件通用包装器
│       │       ├── ClockWidget.vue    # 时钟小组件
│       │       ├── WeatherWidget.vue  # 天气小组件
│       │       ├── CalendarWidget.vue # 日历小组件
│       │       └── UserCardWidget.vue # 用户卡片小组件
│       └── apps/                 # 内置应用
│           ├── FinderApp.vue     # 文件管理器
│           ├── SafariApp.vue     # 浏览器
│           ├── NotesApp.vue      # 备忘录
│           ├── CalendarApp.vue   # 日历
│           ├── SettingsApp.vue   # 系统设置
│           ├── TerminalApp.vue   # 终端
│           ├── VSCodeApp.vue     # 代码编辑器
│           ├── StickiesApp.vue   # 便签
│           └── PreviewApp.vue    # 预览
└── dist/                         # 构建输出
```

## ☁️ 云端数据同步

项目集成了基于 Laf 云函数的 KV 数据同步服务，支持以下操作：
- **save/set** - 保存或更新数据（Upsert）
- **get** - 按 key 获取数据
- **delete** - 删除数据
- **list** - 列出所有数据

API 接口详情参见 [云数据同步api接口文档.md](./云数据同步api接口文档.md)

## 📝 开发说明

### 添加新应用

详细指南参见 [docs/开发新应用指南.md](./docs/开发新应用指南.md)

简要步骤：
1. 在 `src/components/apps/` 创建新应用组件
2. 在 `src/config/apps.ts` 的 `appsConfig` 中注册应用
3. 在 `App.vue` 中导入并连接组件
4. 在 `Window.vue` 的 `contentComponent` 中导入组件

### 自定义样式

所有设计令牌定义在 `src/style.css` 的 `:root` 中，包括：
- 颜色方案
- 间距系统
- 边框圆角
- 过渡动画
- 毛玻璃效果

### 组合式函数 (Composables)

| 函数 | 说明 |
|------|------|
| `useApps` | 应用状态管理（打开/关闭/切换） |
| `useCloudSync` | 云端 KV 数据同步 |
| `useI18n` | 国际化支持 |
| `useTheme` | 主题切换与持久化 |

## 📄 许可证

MIT License

---

**注意**: 此项目仅供学习和演示使用，所有设计元素均致敬 macOS 系统。
