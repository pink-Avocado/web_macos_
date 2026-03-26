<template>
  <div 
    class="desktop-icons" 
    @contextmenu="handleDesktopContextMenu"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 拖拽上传提示遮罩 -->
    <div v-if="isDragging" class="drag-overlay" :class="{ 'overlay-forbidden': !canUpload }">
      <div class="drag-content">
        <template v-if="canUpload">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 8v24M14 18l10-10 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="8" y="36" width="32" height="4" rx="2" fill="currentColor"/>
          </svg>
          <span>释放以上传到桌面</span>
        </template>
        <template v-else>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>暂无权限，请登录</span>
        </template>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>
    
    <div
      v-for="icon in icons"
      :key="icon.id"
      class="desktop-icon"
      :style="{ top: icon.y + 'px', left: icon.x + 'px' }"
      @dblclick="handleIconDoubleClick(icon)"
      @contextmenu="(e) => handleIconContextMenu(e, icon)"
      @mouseenter="handleIconMouseEnter"
      @mouseleave="handleIconMouseLeave"
      @mousemove="handleIconMouseMove"
    >
      <div class="icon-image" :style="icon.background_color ? { backgroundColor: icon.background_color, borderRadius: '17px' } : {}">
        <img 
          v-if="icon.isLink && icon.logoUrl"
          :src="icon.logoUrl"
          class="image-preview"
          :style="icon.background_color ? { objectFit: 'contain', width: '100%', height: '100%', top: '0%', left: '0%' } : {}"
          draggable="false"
        />
        <img 
          v-else-if="isImageFile(icon.name)" 
          :src="getImageUrl(icon.path)" 
          class="image-preview full-image" 
          @error="handleImageError($event)" 
          draggable="false"
        />
        <div v-if="isVideoFile(icon.name)" class="video-preview-wrapper image-preview">
           <video
             :src="getImageUrl(icon.path)" 
             class="image-preview" 
             style="position:absolute; width:100%; height:100%; top:0; left:0; object-fit:cover;"
             preload="metadata"
             @loadeddata="(e: Event) => (e.target as HTMLVideoElement).currentTime = 0.1"
             @error="handleImageError($event)" 
           ></video>
           <div class="play-overlay">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
           </div>
        </div>
        <div v-if="!isImageFile(icon.name) && !isVideoFile(icon.name) && !(icon.isLink && icon.logoUrl)" v-html="icon.icon" class="default-icon"></div>
      </div>
      <div class="icon-label">{{ icon.name }}</div>
      <div v-if="icon.tag" class="icon-tag">{{ icon.tag }}</div>
    </div>
    
    <!-- 右键菜单 -->
    <ContextMenu ref="contextMenuRef" :items="contextMenuItems" />

    <!-- Mouse Follow Tooltip -->
    <div 
      v-if="tooltipVisible" 
      class="mouse-tooltip"
      :style="{ left: tooltipPos.x + 15 + 'px', top: tooltipPos.y + 15 + 'px' }"
    >
      双击打开
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import ContextMenu, { type MenuItem } from './ContextMenu.vue'
import { FileAPI, AuthAPI } from '../api'
import * as Icons from '../utils/iconHelpers'

interface DesktopIcon {
  id: string
  name: string
  iconPath: string
  icon: string
  type: 'file' | 'folder'
  path: string
  x: number
  y: number
  size?: number
  isLink?: boolean
  linkUrl?: string
  logoUrl?: string
  tag?: any
  mode?: boolean
  background_color?: string
}



const icons = ref<DesktopIcon[]>([])
const isLoading = ref(true)
const openApp = inject('openApp') as (appId: string, props?: any) => void

// Tooltip State
const tooltipVisible = ref(false)
const tooltipPos = ref({ x: 0, y: 0 })
const hasLearnedDoubleClick = ref(false)

function handleIconMouseEnter(e: MouseEvent) {
  if (hasLearnedDoubleClick.value) return
  tooltipVisible.value = true
  tooltipPos.value = { x: e.clientX, y: e.clientY }
}

function handleIconMouseLeave() {
  tooltipVisible.value = false
}

function handleIconMouseMove(e: MouseEvent) {
  tooltipPos.value = { x: e.clientX, y: e.clientY }
}

const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null)
const contextMenuItems = ref<MenuItem[]>([])

// 获取桌面文件
const layoutIcons = () => {
  const startX = 20
  const startY = 40
  const gridX = 100
  const gridY = 110
  
  // Calculate available height (approximate)
  const availableHeight = window.innerHeight - 100 // dock + menubar + padding
  const itemsPerColumn = Math.max(1, Math.floor(availableHeight / gridY))
  
  let currentColumn = 0
  let currentRow = 0
  
  icons.value.forEach((icon) => {
    icon.x = startX + (currentColumn * gridX)
    icon.y = startY + (currentRow * gridY)
    
    currentRow++
    if (currentRow >= itemsPerColumn) {
      currentRow = 0
      currentColumn++
    }
  })
}

// 获取桌面文件
async function loadDesktopFiles() {
  try {
    isLoading.value = true
    const data = await FileAPI.getData('macos_web/桌面/')
    
    const desktopItems: DesktopIcon[] = []
    
    // 处理文件夹
    if (data.CommonPrefixes) {
      data.CommonPrefixes.forEach((folder) => {
        const name = folder.Prefix.split('/').filter(Boolean).pop() || ''
        if (name === '_#' || name.startsWith('.')) return
        
        desktopItems.push({
          id: `folder-${desktopItems.length}`,
          name: name,
          iconPath: '/icons/folder.svg',
          icon: Icons.createFolderIcon(),
          type: 'folder',
          path: folder.Prefix,
          x: 0, // Will be set by layoutIcons
          y: 0
        })
      })
    }
    
    // 处理文件
    if (data.Contents) {
      data.Contents.forEach((file) => {
        const rawName = file.Key.split('/').filter(Boolean).pop() || ''
        if (!rawName || rawName.startsWith('.') || rawName === '_#') return
        
        let displayName = rawName
        let isLink = false
        let linkUrl = ''
        let logoUrl = ''
        let tag = null
        let mode = undefined
        let background_color = undefined
        
        // 解析 data- 开头的文件名
        if (rawName.startsWith('data-')) {
          isLink = true
          // 尝试解析，如果失败也作为链接处理
          const parsedData = parseDataFileName(rawName)
          if (parsedData) {
            if (parsedData.name) displayName = parsedData.name
            if (parsedData.url) linkUrl = parsedData.url
            if (parsedData.logo_url) logoUrl = parsedData.logo_url
            if (parsedData.tag !== undefined) tag = parsedData.tag
            if (parsedData.mode !== undefined) mode = parsedData.mode
            if (parsedData.background_color) background_color = parsedData.background_color
          } else {
             // 解析失败 fallback: 简单处理文件名
             displayName = rawName.replace(/^data-/, '').replace(/\.[^/.]+$/, '').substring(0, 20)
          }
        }
        
        desktopItems.push({
          id: `file-${desktopItems.length}`,
          name: displayName,
          iconPath: '/icons/file.svg',
          icon: isLink ? Icons.createLinkIcon() : getFileIcon(rawName),
          type: 'file',
          path: file.Key,
          x: 0,
          y: 0,
          size: file.Size,
          isLink,
          linkUrl,
          logoUrl,
          tag,
          mode,
          background_color
        })
      })
    }
    
    icons.value = desktopItems
    layoutIcons()
    
  } catch (error) {
    console.error('加载桌面文件失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 解析 data- 文件名
function parseDataFileName(fileName: string) {
  try {
    // 移除 data- 前缀
    let base64 = fileName.slice(5)
    // 移除扩展名
    const lastDotIndex = base64.lastIndexOf('.')
    if (lastDotIndex > -1) {
      base64 = base64.substring(0, lastDotIndex)
    }

    // 恢复 URL-safe Base64 字符
    base64 = base64.replace(/-/g, '+').replace(/_/g, '/')
    
    // 清理非 Base64 字符 (比如空格、换行或其他非法字符)
    base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '')
    
    // 补全 padding
    const pad = base64.length % 4
    if (pad) {
      base64 += '='.repeat(4 - pad)
    }

    // 解码 UTF-8 字符串
    const jsonStr = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))

    const parsed = JSON.parse(jsonStr)
    // console.log('Parsed data- file:', fileName, parsed)
    return parsed
  } catch (e) {
    console.warn('解析 data- 文件名失败. JSON formatting error?', fileName, e)
    return null
  }
}

// 获取文件图标
// 获取文件图标
function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  const iconMap: Record<string, () => string> = {
    txt: Icons.createTextIcon,
    doc: Icons.createWordIcon,
    docx: Icons.createWordIcon,
    pdf: Icons.createPdfIcon,
    xls: Icons.createExcelIcon,
    xlsx: Icons.createExcelIcon,
    csv: Icons.createExcelIcon,
    ppt: Icons.createWordIcon,
    pptx: Icons.createWordIcon,
    jpg: Icons.createImageIcon,
    jpeg: Icons.createImageIcon,
    png: Icons.createImageIcon,
    gif: Icons.createImageIcon,
    svg: Icons.createImageIcon,
    mp3: Icons.createAudioIcon,
    wav: Icons.createAudioIcon,
    flac: Icons.createAudioIcon,
    mp4: Icons.createVideoIcon,
    avi: Icons.createVideoIcon,
    mov: Icons.createVideoIcon,
    mkv: Icons.createVideoIcon,
    zip: Icons.createArchiveIcon,
    rar: Icons.createArchiveIcon,
    '7z': Icons.createArchiveIcon,
    js: Icons.createCodeIcon,
    ts: Icons.createCodeIcon,
    vue: Icons.createCodeIcon,
    html: Icons.createCodeIcon,
    css: Icons.createCodeIcon,
    json: Icons.createCodeIcon,
  }
  
  const iconFunc = iconMap[ext] || Icons.createGenericIcon
  return iconFunc()
}

// 图片文件扩展名
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff']

// 检查是否为图片文件
function isImageFile(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? imageExtensions.includes(ext) : false
}

const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
function isVideoFile(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? videoExtensions.includes(ext) : false
}

// 获取图片URL
function getImageUrl(filePath: string): string {
  return FileAPI.getImageUrl(filePath)
}

// 处理图片加载错误
function handleImageError(event: Event): void {
  // 图片加载失败时,隐藏图片元素,这样就会显示下面的默认图标
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

function handleIconDoubleClick(icon: DesktopIcon) {
  if (!hasLearnedDoubleClick.value) {
    hasLearnedDoubleClick.value = true
    localStorage.setItem('macOS_learned_double_click', 'true')
    tooltipVisible.value = false
  }

  if (icon.type === 'folder') {
    // Open Finder at this path
    openApp('finder', { path: icon.path, name: icon.name })
    console.log('Open folder:', icon.name)
  } else {
    // 特殊标记文件 logic: mode=true -> internal Safari, mode=false -> new tab
    if (icon.mode === true) {
      openApp('safari', { 
        url: icon.linkUrl,
        title: icon.name,
        icon: icon.logoUrl
      })
      return
    } else if (icon.mode === false) {
      if (icon.linkUrl) {
         window.open(icon.linkUrl, '_blank')
      }
      return
    }

    // 处理链接文件
    if (icon.isLink && icon.linkUrl) {
      window.open(icon.linkUrl, '_blank')
    }
    // 图片/视频文件用 Preview 打开
    else if (isImageFile(icon.name) || isVideoFile(icon.name)) {
      const mediaList = icons.value
        .filter(i => i.type === 'file' && (isImageFile(i.name) || isVideoFile(i.name)))
        .map(i => ({
          name: i.name,
          path: i.path,
          url: getImageUrl(i.path),
          size: i.size
        }))

      openApp('preview', { 
        path: icon.path, 
        name: icon.name,
        url: getImageUrl(icon.path),
        list: mediaList
      })
    } 
    // 可编辑的文本文件用 VSCode 打开
    else if (isEditableFile(icon.name)) {
      openApp('vscode', {
        filePath: icon.path,
        fileName: icon.name
      })
    }
    // 其他文件在新窗口打开
    else {
      const fileUrl = getImageUrl(icon.path)
      window.open(fileUrl, '_blank')
    }
  }
}

// 判断是否为可编辑的文本文件
function isEditableFile(fileName: string): boolean {
  const editableExtensions = [
    // 文本文件
    'txt', 'md', 'markdown',
    // 代码文件
    'js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss', 'less', 'sass',
    'json', 'xml', 'yaml', 'yml',
    // 配置文件
    'conf', 'config', 'ini', 'env',
    // 编程语言
    'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt',
    // Shell 脚本
    'sh', 'bash', 'zsh', 'fish',
    // 其他
    'sql', 'log', 'csv'
  ]
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? editableExtensions.includes(ext) : false
}

// 检查登录状态
function isUserLoggedIn(): boolean {
  return AuthAPI.isLoggedIn()
}

// 复制文件链接
async function copyLink(icon: DesktopIcon) {
  const url = getImageUrl(icon.path)
  try {
    await navigator.clipboard.writeText(url)
    console.log('链接已复制:', url)
  } catch (err) {
    console.error('复制链接失败:', err)
  }
}

// 下载文件
async function downloadFile(icon: DesktopIcon) {
  try {
    const url = getImageUrl(icon.path)
    const response = await fetch(url)
    if (!response.ok) throw new Error('下载失败')
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = icon.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  } catch (e) {
    console.error('下载出错:', e)
    // 降级处理:直接打开链接
    window.open(getImageUrl(icon.path), '_blank')
  }
}

// 桌面图标右键菜单
function handleIconContextMenu(event: MouseEvent, icon: DesktopIcon) {
  event.preventDefault()
  event.stopPropagation()
  
  const isLoggedIn = isUserLoggedIn()
  
  const items: MenuItem[] = [
    { label: '打开', action: () => handleIconDoubleClick(icon) },
    { divider: true }
  ]

  // 如果是文件，添加复制链接和下载选项
  if (icon.type === 'file') {
    items.push(
      { label: '复制链接', action: () => copyLink(icon) },
      { label: '下载', action: () => downloadFile(icon) },
      { divider: true }
    )
  }

  items.push(
    // { label: '重命名', action: () => console.log('重命名', icon.name) },
    { 
      label: isLoggedIn ? '删除' : '删除 (暂无权限)', 
      disabled: !isLoggedIn,
      action: () => deleteIcon(icon) 
    },
    // { divider: true },
    // { label: '显示简介', action: () => console.log('显示简介', icon.name) }
  )
  
  contextMenuItems.value = items
  
  contextMenuRef.value?.show(event)
}

// 删除桌面图标
async function deleteIcon(icon: DesktopIcon) {
  const confirmDelete = confirm(`确定要删除 "${icon.name}" 吗?`)
  
  if (!confirmDelete) {
    return
  }
  
  try {
    await FileAPI.deleteFile(icon.path)
    
    // 刷新桌面
    await loadDesktopFiles()
  } catch (error: any) {
    console.error('删除失败:', error)
    alert(error.message || '删除失败')
  }
}

import { useCloudSync } from '../composables/useCloudSync'

const { syncDataFromCloud } = useCloudSync()

// 桌面空白区域右键菜单
function handleDesktopContextMenu(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  const isLoggedIn = isUserLoggedIn()
  
  contextMenuItems.value = [
    { 
      label: isLoggedIn ? '新建文件夹' : '新建文件夹 (暂无权限)', 
      disabled: !isLoggedIn,
      action: createNewFolder 
    },
    { 
      label: isLoggedIn ? '新建文件' : '新建文件 (暂无权限)', 
      disabled: !isLoggedIn,
      action: createNewFile 
    },
    { 
      label: isLoggedIn ? '上传文件（拖曳上传）' : '上传 (暂无权限)', 
      disabled: !isLoggedIn,
      action: triggerUpload
    },
    { divider: true },
    { label: '刷新', action: handleRefresh },
    { divider: true },
    { label: '编辑小组件', action: () => window.dispatchEvent(new Event('open-widget-gallery')) },
    { divider: true },
    { label: '排列方式', action: () => console.log('排列方式') },
    { label: '清理', action: () => console.log('清理') },
    { divider: true },
    { label: '更改桌面背景', action: () => console.log('更改桌面背景') }
  ]
  
  contextMenuRef.value?.show(event)
}

function handleRefresh() {
  loadDesktopFiles()
  syncDataFromCloud()
}

// 触发文件上传
function triggerUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.onchange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      uploadFiles(Array.from(files))
    }
  }
  input.click()
}

// 创建新文件
async function createNewFile() {
  const fileName = prompt('请输入文件名:', 'untitled.txt')
  
  if (!fileName || !fileName.trim()) {
    return
  }

  // 不再弹窗让用户输入内容，而是直接创建空文件，然后打开编辑器
  
  try {
    let finalFileName = fileName.trim()
    
    // 检查是否重名
    const existingNames = icons.value
      .filter(icon => icon.type === 'file')
      .map(icon => icon.name)
    
    // 如果重名,添加数字后缀
    if (existingNames.includes(finalFileName)) {
      const parts = finalFileName.split('.')
      const ext = parts.length > 1 ? parts.pop() : ''
      const nameWithoutExt = parts.join('.')
      
      let counter = 1
      let newName = ext ? `${nameWithoutExt}(${counter}).${ext}` : `${nameWithoutExt}(${counter})`
      
      while (existingNames.includes(newName)) {
        counter++
        newName = ext ? `${nameWithoutExt}(${counter}).${ext}` : `${nameWithoutExt}(${counter})`
      }
      finalFileName = newName
    }
    
    const filePath = `macos_web/桌面/${finalFileName}`
    
    // 打开 VSCode 编辑该文件 - 传递 isNew: true 让 VSCode 处理保存
    openApp('vscode', {
      filePath: filePath,
      fileName: finalFileName,
      isNew: true
    })
    
  } catch (error: any) {
    console.error('创建文件失败:', error)
    alert(error.message || '创建文件失败')
  }
}

// 创建新文件夹
async function createNewFolder() {
  const folderName = prompt('请输入文件夹名称:', '新建文件夹')
  
  if (!folderName || !folderName.trim()) {
    return
  }
  
  try {
    let finalFolderName = folderName.trim()
    
    // 检查是否重名
    const existingNames = icons.value
      .filter(icon => icon.type === 'folder')
      .map(icon => icon.name)
    
    // 如果重名,添加数字后缀
    if (existingNames.includes(finalFolderName)) {
      let counter = 1
      while (existingNames.includes(`${finalFolderName}(${counter})`)) {
        counter++
      }
      finalFolderName = `${finalFolderName}(${counter})`
    }
    
    const folderPath = `macos_web/桌面/${finalFolderName}/`
    await FileAPI.createFolder(folderPath)
    
    // 刷新桌面
    await loadDesktopFiles()
  } catch (error: any) {
    console.error('创建文件夹失败:', error)
    alert(error.message || '创建文件夹失败')
  }
}

// 拖拽相关状态
const isDragging = ref(false)
const canUpload = ref(false)

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  // 如果未登录，不显示拖拽UI且禁止掉落
  if (!isUserLoggedIn()) {
     canUpload.value = false
     if (event.dataTransfer) {
       event.dataTransfer.dropEffect = 'none'
     }
     isDragging.value = true // Show the overlay (forbidden state)
     return
  }
  canUpload.value = true
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  // 只有当离开的元素不是遮罩层的子元素时才隐藏
  if (event.relatedTarget === null || (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node) === false) {
    isDragging.value = false
  }
}

async function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  
  // 再次检查登录状态
  if (!isUserLoggedIn()) {
    alert('权限验证失败：请先在终端使用 login 命令登录系统')
    return
  }
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    await uploadFiles(Array.from(files))
  }
}

// 批量上传文件
async function uploadFiles(files: File[]) {
  const desktopPath = 'macos_web/桌面/'
  isLoading.value = true
  
  try {
    for (const file of files) {
      console.log(`正在上传文件到桌面: ${file.name}`)
      try {
        await FileAPI.uploadFile(file, desktopPath)
        console.log(`文件 ${file.name} 上传成功`)
      } catch (error) {
        console.error(`文件 ${file.name} 上传失败:`, error)
      }
    }
    // 刷新桌面
    await loadDesktopFiles()
  } catch (error) {
    console.error('批量上传过程出错:', error)
  }
}

import { onUnmounted } from 'vue'

onMounted(() => {
  hasLearnedDoubleClick.value = localStorage.getItem('macOS_learned_double_click') === 'true'
  loadDesktopFiles()
  window.addEventListener('resize', layoutIcons)

  // 检查是否已经触发过全屏
  const hasTriggeredFullscreen = localStorage.getItem('macOS_has_triggered_fullscreen') === 'true'

  if (!hasTriggeredFullscreen) {
    // 第一次打开网页，点击或移动时全屏
    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('mousemove', handleFirstInteraction)
    window.addEventListener('mousedown', handleFirstInteraction)
    window.addEventListener('touchstart', handleFirstInteraction)
    window.addEventListener('keydown', handleFirstInteraction)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', layoutIcons)
  cleanupListeners()
})

// Auto Fullscreen Logic
let moveAttempted = false

function cleanupListeners() {
  window.removeEventListener('click', handleFirstInteraction)
  window.removeEventListener('mousemove', handleFirstInteraction)
  window.removeEventListener('mousedown', handleFirstInteraction)
  window.removeEventListener('touchstart', handleFirstInteraction)
  window.removeEventListener('keydown', handleFirstInteraction)
}

function handleFirstInteraction(e: Event) {
  // If already fullscreen, clean up
  if (document.fullscreenElement) {
    localStorage.setItem('macOS_has_triggered_fullscreen', 'true')
    cleanupListeners()
    return
  }

  // Avoid spamming requests on mousemove if it already failed once
  if (e.type === 'mousemove' && moveAttempted) return

  document.documentElement.requestFullscreen()
    .then(() => {
      // Success
      localStorage.setItem('macOS_has_triggered_fullscreen', 'true')
      cleanupListeners()
    })
    .catch(() => {
      // console.log("Fullscreen request failed:", err)
      // If failed on mousemove, mark it so we don't retry on every pixel move
      if (e.type === 'mousemove') {
        moveAttempted = true
      }
    })
}
</script>

<style scoped>
.drag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px dashed rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  margin: 10px;
}

.drag-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: white;
  font-weight: 500;
  font-size: 18px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.desktop-icons {
  position: absolute;
  top: var(--menubar-height);
  left: 0;
  right: 0;
  bottom: var(--dock-height);
  pointer-events: all;
  z-index: 1;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.desktop-icon {
  position: absolute;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}



.mouse-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.9);
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.icon-image {
  width: 54px;
  height: 54px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  transition: all 0.2s ease;
}

.image-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  z-index: 2;
}

.full-image {
  object-fit: contain !important;
  border-radius: 4px; /* Slightly smaller radius for full images looks better */
}

.default-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image :deep(svg) {
  width: 54px;
  height: 54px;
}

.desktop-icon:hover .icon-image {
  transform: scale(1.05);
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.25));
}

.icon-label {
  font-size: 12px;
  color: white;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.2);
  /* padding: 2px 8px; */
  border-radius: 4px;
  backdrop-filter: blur(5px);
  max-width: 100%;
  
  /* Allow multi-line text */
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.2;
  
  /* Limit to 2 lines like macOS */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-preview-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 3;
}

.play-overlay svg {
  width: 10px;
  height: 10px;
  margin-left: 1px;
}

.icon-tag {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff3b30;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 4;
  font-weight: bold;
}

</style>
