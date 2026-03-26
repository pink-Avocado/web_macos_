<template>
  <div class="macos-desktop">
    <MacLoading v-if="isLoading" @loaded="isLoading = false" />
    <!-- DeskTop Background -->
    <template v-if="isVideoWallpaper">
      <video
        class="desktop-background"
        autoplay
        loop
        muted
        playsinline
        :src="currentWallpaper"
      ></video>
    </template>
    <template v-else>
      <img class="desktop-background" :src="currentWallpaper" alt="Wallpaper" />
    </template>
    
    <!-- Desktop Icons -->
    <DesktopIcons />

    <!-- Desktop Widgets -->
    <DesktopWidgets @toggle-edit-mode="(val) => isWidgetEditing = val" />
    
    <!-- Windows Container -->
    <div class="windows-container">
      <Window
        v-for="window in openWindows"
        :key="window.id"
        :window="window"
        @close="closeWindow"
        @minimize="minimizeWindow"
        @focus="focusWindow"
        @maximize="toggleMaximizeWindow"
      />
    </div>
    
    <!-- Menu Bar -->
    <MenuBar :activeApp="activeApp" />
    
    <!-- Dock -->
    <Dock :windows="openWindows" :hidden="hasMaximizedWindow || isWidgetEditing" @open-app="openApp" @restore-window="restoreWindow" />

    <!-- Launchpad -->
    <Transition name="fade">
      <Launchpad 
        v-if="showLaunchpad" 
        :show="showLaunchpad"
        @close="showLaunchpad = false"
        @open-app="openApp"
      />
    </Transition>

    <!-- Footer Info -->
    <div class="footer-info">
      <span class="copyright">
        <svg t="1756034588744" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5113" width="16" height="16"><path d="M669.3 369.4c9.8 0 19.6 0 29.4 1.6C671 245.2 536.9 152 383.2 152 211.6 152 71 269.7 71 416.8c0 85 45.8 156.9 124.2 210.9l-31.1 93.2L273.6 667c39.2 8.2 70.3 16.3 109.5 16.3 9.8 0 19.6 0 31.1-1.6-6.5-21.3-9.8-42.5-9.8-65.4 0.1-135.7 116.2-246.9 264.9-246.9z m-168.4-85c24.5 0 39.2 16.3 39.2 39.2 0 22.9-16.3 39.2-39.2 39.2-24.5 0-47.4-16.4-47.4-39.2 0-24.5 24.6-39.2 47.4-39.2z m-216.3 73.1c-24.7 0-47.8-16.2-47.8-38.8 0-24.3 24.7-38.8 47.8-38.8s39.5 16.2 39.5 38.8c0.1 22.7-16.4 38.8-39.5 38.8z" fill="#24DB5A" p-id="5114"></path><path d="M953.8 613c0-125.9-124.2-227.2-264.8-227.2-148.8 0-266.5 103-266.5 227.2 0 125.9 117.7 227.2 266.5 227.2 31.1 0 62.1-8.2 93.2-16.3l85 47.4-22.9-78.5c62.1-47.4 109.5-109.5 109.5-179.8z m-351.5-39.2c-14.7 0-31.1-14.7-31.1-31.1 0-14.7 16.3-31.1 31.1-31.1 22.9 0 39.2 16.3 39.2 31.1 0 16.4-14.7 31.1-39.2 31.1z m178-7.6c-14.8 0-31.3-14.6-31.3-30.7 0-14.6 16.5-30.7 31.3-30.7 23.1 0 39.5 16.2 39.5 30.7 0 16.2-16.4 30.7-39.5 30.7z" fill="#24DB5A" p-id="5115"></path></svg>
        <a :href="qrCodeUrl" target="_blank" class="author-link" @mouseenter="showQRCode = true" @mouseleave="showQRCode = false">
          微信
          <!-- 微信二维码气泡框 -->
          <div v-if="showQRCode" class="qr-tooltip">
            <div class="qr-content">
              <img :src="qrCodeUrl" alt="微信二维码" class="qr-image" />
              <!-- <p class="qr-text">扫码添加作者微信</p> -->
            </div>
          </div>
        </a>
      </span>

      <span class="copyright">
        <svg t="1769141838292" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5697" width="16" height="16"><path d="M740.8 231.8c-10.2 0-24.2 0-37-33.7-10.2-26.9-11.2-56.3-11.2-58.6V99.6H546.5v40.2c0 1.5-0.2 40.4-0.4 83.6v4.7c-0.6 144.1-1.8 412.2-1.8 441.9 0 51.3-41.8 93.1-93.1 93.1s-93.1-41.8-93.1-93.1 41.8-93.1 93.1-93.1h40.3V411.2h-40.3c-131.9 0-258.8 83.8-258.8 258.8 0 153.5 95.3 258.8 258.8 258.8 165.9 0 258.8-126.9 258.9-258.8 0-20.4 0.5-140.9 1.1-279 15.7 4.3 12.6 6.5 29.6 6.5h90.7V231.8h-90.7z" fill="currentColor" p-id="5698"></path></svg>
        <a href="javascript:void(0)" class="author-link" @mouseenter="showDouyinQRCode = true" @mouseleave="showDouyinQRCode = false">
          抖音
          <!-- 抖音二维码气泡框 -->
          <div v-if="showDouyinQRCode" class="qr-tooltip">
            <div class="qr-content">
              <img src="/抖音.jpg" alt="抖音二维码" class="qr-image douyin-qr" />
            </div>
          </div>
        </a>
      </span>

      <span class="copyright">
        © 2025
        <a href="	https://www.qian-qian.xyz/" class="author-link">
          前端小白
        </a>
      </span>

      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="icp-link">
        冀ICP备2025113003号-1
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide, watch } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Dock from './components/Dock.vue'
import DesktopIcons from './components/DesktopIcons.vue'
import Window from './components/Window.vue'
import Launchpad from './components/Launchpad.vue'
import DesktopWidgets from './components/desktop/DesktopWidgets.vue'
import MacLoading from './components/MacLoading.vue'

import { useI18n } from './composables/useI18n'
import { CloudSyncAPI, AuthAPI } from './api'

import { useCloudSync } from './composables/useCloudSync'

const { t } = useI18n()
// const { updateAppOrder } = useApps() // No longer needed directly here as useCloudSync handles it
const { syncDataFromCloud } = useCloudSync()

// Loading State
const isLoading = ref(true)

// Wallpaper Management
const currentWallpaper = ref(localStorage.getItem('macos_wallpaper') || '/wallpaper.png')
const isVideoWallpaper = computed(() => {
  const wallpaper = currentWallpaper.value?.toLowerCase()
  return wallpaper?.endsWith('.mp4') || wallpaper?.endsWith('.webm')
})

const saveWallpaperToCloud = async (url: string) => {
  if (!AuthAPI.isLoggedIn()) return
  try {
    await CloudSyncAPI.save('macos_wallpaper', url)
  } catch (error) {
    console.error('Failed to sync wallpaper to cloud:', error)
  }
}

const setWallpaper = (url: string) => {
  console.log('Setting wallpaper to:', url)
  currentWallpaper.value = url
  localStorage.setItem('macos_wallpaper', url)
  saveWallpaperToCloud(url)
}

const loadWallpaper = () => {
  const saved = localStorage.getItem('macos_wallpaper')
  if (saved && saved !== currentWallpaper.value) {
    currentWallpaper.value = saved
  }
}



watch(currentWallpaper, (newVal) => {
  console.log('Wallpaper changed to:', newVal)
})

provide('setWallpaper', setWallpaper)

// 初始化主题 & 同步数据
onMounted(() => {
  // 禁用全局右键菜单
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
  
  syncDataFromCloud().then(() => {
    // Attempt to load stickies again after sync (in case cloud had newer data)
    loadStickies()
    loadWallpaper()
  })

  // Initial load from local storage (fast)
  loadStickies()
})

function loadStickies() {
  const savedStickies = localStorage.getItem('stickies_data')
  if (savedStickies) {
    try {
      const stickies = JSON.parse(savedStickies)
      
      // Clear existing stickies first as requested
      openWindows.value = openWindows.value.filter(w => w.appId !== 'stickies')
      
      stickies.forEach((s: any) => {
         // Calculate positions
         let finalX = s.x
         let finalY = s.y
         
         // Only use percentages if screen size differs from when it was saved
         const screenChanged = s.screenWidth && s.screenHeight && 
           (s.screenWidth !== window.innerWidth || s.screenHeight !== window.innerHeight)
           
         if (screenChanged && typeof s.xPercent === 'number' && typeof s.yPercent === 'number') {
           finalX = s.xPercent * window.innerWidth
           finalY = s.yPercent * window.innerHeight
         } else if (!s.screenWidth && typeof s.xPercent === 'number' && typeof s.yPercent === 'number') {
           // Fallback for data saved in the brief period where we only had percentages but no screen size
           finalX = s.xPercent * window.innerWidth
           finalY = s.yPercent * window.innerHeight
         }

         openWindows.value.push({
          ...s,
          x: finalX,
          y: finalY,
          // If we re-use ID from storage, we must ensure nextWindowId is higher
          id: s.id || `window-${nextWindowId++}`,
          zIndex: ++highestZIndex,
          minimized: false 
        })
        
        // Update nextWindowId to avoid collision
        if (s.id && s.id.startsWith('window-')) {
           const idNum = parseInt(s.id.replace('window-', ''))
           if (!isNaN(idNum) && idNum >= nextWindowId) {
             nextWindowId = idNum + 1
           }
        }
      })
      
      lastSavedStickiesJSON = savedStickies
    } catch (e) {
      console.error('Failed to restore stickies:', e)
    }
  }
}

export interface WindowState {
  id: string
  appId: string
  title: string
  component: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
  maximized: boolean
  prevX?: number
  prevY?: number
  prevWidth?: number
  prevHeight?: number
  props?: Record<string, any>
}

const openWindows = ref<WindowState[]>([])
const showLaunchpad = ref(false)
const showQRCode = ref(false)
const showDouyinQRCode = ref(false)
const isWidgetEditing = ref(false)
const qrCodeUrl = 'https://api.pwmqr.com/qrcode/create/?url=https://u.wechat.com/MHGBQtRYzX4kvXu86gkdd9w?s=2'
let nextWindowId = 1
let highestZIndex = 100
let lastSavedStickiesJSON = ''

const activeApp = computed(() => {
  if (showLaunchpad.value) return t.appTitles.launchpad
  const activeWindows = openWindows.value.filter(w => !w.minimized)
  if (activeWindows.length === 0) return t.appTitles.finder
  const topWindow = activeWindows.reduce((max, w) => w.zIndex > max.zIndex ? w : max)
  return topWindow.title
})

const hasMaximizedWindow = computed(() => openWindows.value.some(w => w.maximized && !w.minimized))

const appConfigs: Record<string, { component: string, title: string, width: number, height: number }> = {
  finder: { component: 'FinderApp', title: t.appTitles.finder, width: 800, height: 550 },
  safari: { component: 'SafariApp', title: t.appTitles.safari, width: 1000, height: 700 },
  notes: { component: 'NotesApp', title: t.appTitles.notes, width: 800, height: 550 },
  stickies: { component: 'StickiesApp', title: t.appTitles.stickies, width: 300, height: 200 },
  calendar: { component: 'CalendarApp', title: t.appTitles.calendar, width: 700, height: 600 },
  settings: { component: 'SettingsApp', title: t.appTitles.settings, width: 850, height: 650 },
  preview: { component: 'PreviewApp', title: '预览', width: 800, height: 600 },
  terminal: { component: 'TerminalApp', title: '终端', width: 680, height: 420 },
  vscode: { component: 'VSCodeApp', title: t.appTitles.vscode, width: 1000, height: 700 },
}

function openApp(appId: string, props?: Record<string, any>) {
  if (appId === 'launchpad') {
    showLaunchpad.value = !showLaunchpad.value
    return
  }

  // Close launchpad if opening another app
  showLaunchpad.value = false

  // For Preview app, we allow multiple windows if they are for different files
  if (appId === 'preview' && props?.path) {
    const existingPreview = openWindows.value.find(w => 
      w.appId === 'preview' && 
      w.props?.path === props.path && 
      !w.minimized
    )
    if (existingPreview) {
      focusWindow(existingPreview.id)
      return
    }
  } else {
    // Check if app is already open (except stickies if forced new)
    const shouldCheckExisting = appId !== 'stickies' || !props?.forceNew
    
    if (shouldCheckExisting) {
      const existingWindow = openWindows.value.find(w => w.appId === appId && !w.minimized)
      if (existingWindow) {
        // Update props if new props are provided (e.g. changing Finder path)
        if (props) {
          existingWindow.props = { ...existingWindow.props, ...props, timestamp: Date.now() }
        }
        focusWindow(existingWindow.id)
        return
      }
    }
  }
  
  // Check if there's a minimized window
  if (appId !== 'preview' && (appId !== 'stickies' || !props?.forceNew)) {
    const minimizedWindow = openWindows.value.find(w => w.appId === appId && w.minimized)
    if (minimizedWindow) {
      restoreWindow(minimizedWindow.id)
      return
    }
  }
  
  const config = appConfigs[appId]
  if (!config) return
  
  const newWindow: WindowState = {
    id: `window-${nextWindowId++}`,
    appId,
    title: props?.name || config.title,
    component: config.component,
    x: 100 + (openWindows.value.length * 30),
    y: 80 + (openWindows.value.length * 30),
    width: config.width,
    height: config.height,
    zIndex: ++highestZIndex,
    minimized: false,
    maximized: false,
    props
  }
  
  openWindows.value.push(newWindow)
}

provide('openApp', openApp)

function closeWindow(windowId: string) {
  const index = openWindows.value.findIndex(w => w.id === windowId)
  if (index !== -1) {
    openWindows.value.splice(index, 1)
  }
}

function minimizeWindow(windowId: string) {
  const window = openWindows.value.find(w => w.id === windowId)
  if (window) {
    window.minimized = true
  }
}

function restoreWindow(windowId: string) {
  const window = openWindows.value.find(w => w.id === windowId)
  if (window) {
    window.minimized = false
    window.zIndex = ++highestZIndex
  }
}

function focusWindow(windowId: string) {
  const window = openWindows.value.find(w => w.id === windowId)
  if (window && !window.minimized) {
    window.zIndex = ++highestZIndex
  }
}

function toggleMaximizeWindow(windowId: string) {
  const window = openWindows.value.find(w => w.id === windowId)
  if (!window) return

  if (window.maximized) {
    // Restore
    window.x = window.prevX ?? window.x
    window.y = window.prevY ?? window.y
    window.width = window.prevWidth ?? window.width
    window.height = window.prevHeight ?? window.height
    window.maximized = false
  } else {
    // Maximize
    window.prevX = window.x
    window.prevY = window.y
    window.prevWidth = window.width
    window.prevHeight = window.height
    
    // Calculate available space
    // MenuBar height is defined in CSS as 24px
    const menuBarHeight = 24
    
    window.x = 0
    window.y = menuBarHeight
    window.width = document.documentElement.clientWidth
    window.height = document.documentElement.clientHeight - menuBarHeight
    window.maximized = true
    window.zIndex = ++highestZIndex
  }
}

const saveStickiesToCloud = async (stickies: any[]) => {
  if (!AuthAPI.isLoggedIn()) return
  try {
    await CloudSyncAPI.save('stickies_data', stickies)
  } catch (error) {
    console.error('Failed to sync stickies to cloud:', error)
  }
}

// Persist only stickies
let stickiesSaveTimeout: ReturnType<typeof setTimeout>

watch(openWindows, (newWindows) => {
  const stickies = newWindows
    .filter(w => w.appId === 'stickies')
    .map(w => ({
        id: w.id,
        appId: w.appId,
        title: w.title,
        component: w.component,
        x: w.x,
        y: w.y,
        // Store relative position as percentage (0-1)
        xPercent: w.x / window.innerWidth,
        yPercent: w.y / window.innerHeight,
        // Store reference screen size to avoid precision loss on same screen
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        width: w.width,
        height: w.height,
        props: w.props
      }))
  
  const currentStickiesJSON = JSON.stringify(stickies)

  // If content hasn't changed, don't trigger save
  if (currentStickiesJSON === lastSavedStickiesJSON) {
    if (stickiesSaveTimeout) clearTimeout(stickiesSaveTimeout)
    return
  }

  if (stickiesSaveTimeout) clearTimeout(stickiesSaveTimeout)
  
  stickiesSaveTimeout = setTimeout(() => {
    localStorage.setItem('stickies_data', currentStickiesJSON)
    saveStickiesToCloud(stickies)
    lastSavedStickiesJSON = currentStickiesJSON
  }, 1000)
}, { deep: true })
</script>

<style scoped>
.macos-desktop {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
}

.desktop-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.5s ease-in-out;
}

.windows-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}

/* Global Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.footer-info {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
}

.footer-info .copyright {
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-info .copyright .icon {
  vertical-align: middle;
  display: inline-block;
}

.footer-info .copyright:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(-1px);
}

.footer-info .copyright .author-link {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.footer-info .copyright .author-link:hover {
  color: #007AFF;
  text-decoration: underline;
}

/* 二维码气泡框样式 */
.qr-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  z-index: 10000;
  animation: qrFadeIn 0.3s ease-out;
}

.qr-content {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  min-width: 100px;
}

.qr-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.3);
}

.qr-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
}

.douyin-qr {
  width: 150px;
  height: auto;
  max-height: 300px;
  object-fit: contain;
}

.qr-text {
  margin: 6px 0 0 0;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

@keyframes qrFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .qr-content {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .qr-content::after {
    border-top-color: rgba(0, 0, 0, 0.5);
  }
  
  .qr-text {
    color: rgba(255, 255, 255, 0.9);
  }
}

.footer-info .icp-link {
  color: inherit;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.footer-info .icp-link:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(-1px);
}

/* 在深色主题下调整样式 */
@media (prefers-color-scheme: dark) {
  .footer-info {
    color: rgba(255, 255, 255, 0.7);
  }

  .footer-info .copyright,
  .footer-info .icp-link {
    background: rgba(255, 255, 255, 0.1);
  }

  .footer-info .copyright:hover,
  .footer-info .icp-link:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
