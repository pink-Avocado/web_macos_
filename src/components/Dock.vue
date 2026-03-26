<template>
  <div 
    v-if="hidden" 
    class="dock-trigger"
    @mouseenter="handleMouseEnter" 
    @mouseleave="handleMouseLeave"
  ></div>

  <div class="dock-container" :class="{ 'dock-hidden': shouldHide }" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="dock" @mousemove="handleMouseMove" @mouseleave="handleDockMouseLeave">
      <template v-for="(item, index) in displayedDockItems" :key="item.id">
        <!-- 分隔线 -->
        <div v-if="item.isDivider" class="dock-divider"></div>
        
        <!-- 应用图标 -->
        <div
          v-else
          class="dock-item"
          :id="`dock-item-${item.id}`"
          :class="{ 
            active: isAppActive(item.id), 
            running: isAppRunning(item.id),
            trash: item.isTrash 
          }"
          @click="!item.isTrash && handleAppClick(item.id)"
          @mouseenter="hoveredApp = item.id"
        >
          <div class="dock-icon" :style="getDockItemStyle(index)">
            <img :src="item.iconPath" :alt="item.name" class="icon-image" />
          </div>
          <div class="app-tooltip">{{ item.name }}</div>
          <div v-if="!item.isTrash && isAppRunning(item.id)" class="running-indicator"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, watch } from 'vue'
import type { WindowState } from '../App.vue'
import { useI18n } from '../composables/useI18n'
import { useApps } from '../composables/useApps'

const { t } = useI18n()
const { apps } = useApps()

const props = defineProps<{
  windows: WindowState[]
  hidden?: boolean
}>()

const emit = defineEmits<{
  openApp: [appId: string]
  restoreWindow: [windowId: string]
}>()

interface DockItem {
  id: string
  name: string
  iconPath: string
  isDivider?: boolean
  isTrash?: boolean
}


function resolveName(key: string) {
  return key.split('.').reduce((o: any, k) => o?.[k], t) || key
}

const pinnedApps = computed<DockItem[]>(() => {
    return apps.value.filter(app => app.showInDock).map(app => ({
        id: app.id,
        name: resolveName(app.nameKey),
        iconPath: app.icon
    }))
})

const bottomItems: DockItem[] = [
  { id: 'divider', name: '', iconPath: '', isDivider: true },
  { id: 'trash', name: t.apps.trash, iconPath: '/icons/trash.png', isTrash: true },
]

const displayedDockItems = computed(() => {
  // 获取正在运行但不在固定列表中的应用
  const runningAppIds = [...new Set(props.windows.map(w => w.appId))]
  const unpinnedRunningApps: DockItem[] = []
  
  runningAppIds.forEach(appId => {
    // 检查是否已经在固定列表中
    const isPinned = pinnedApps.value.some(app => app.id === appId)
    const isBottom = bottomItems.some(item => item.id === appId)
    
    if (!isPinned && !isBottom) {
       // Look up in apps
       const config = apps.value.find(a => a.id === appId)
       
       if (config) {
           unpinnedRunningApps.push({
               id: appId,
               name: resolveName(config.nameKey),
               iconPath: config.icon
           })
       } else {
           // Fallback
           unpinnedRunningApps.push({
               id: appId,
               name: appId.charAt(0).toUpperCase() + appId.slice(1),
               iconPath: '/icons/stickies.png'
           })
       }
    }
  })
  
  return [...pinnedApps.value, ...unpinnedRunningApps, ...bottomItems]
})

const hoveredApp = ref<string | null>(null)
const mouseX = ref(-999)
let rafId: number | null = null
let pendingMouseX: number | null = null

// Hide/Show Logic
const tempVisible = ref(false)
let showTimer: any = null
let hideTimer: any = null

const shouldHide = computed(() => props.hidden && !tempVisible.value)

watch(() => props.hidden, (newVal) => {
  // If globally hidden becomes false (e.g. unmaximized), reset local state
  if (!newVal) {
    tempVisible.value = false
    clearTimers()
  }
})

function clearTimers() {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
  showTimer = null
  hideTimer = null
}

function handleMouseEnter() {
  // Cancel any pending hiding
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  
  // If hidden and not yet visible, start showing timer
  if (props.hidden && !tempVisible.value) {
    if (!showTimer) {
      showTimer = setTimeout(() => {
        tempVisible.value = true
        showTimer = null
      }, 1000)
    }
  }
}

function handleMouseLeave() {
  // Cancel any pending showing
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  
  // If visible (temporarily) and should be hidden globally, start hiding timer
  if (props.hidden && tempVisible.value) {
    if (!hideTimer) {
      hideTimer = setTimeout(() => {
        tempVisible.value = false
        hideTimer = null
      }, 2000)
    }
  }
}

function isAppRunning(appId: string) {
  return props.windows.some(w => w.appId === appId)
}

function isAppActive(appId: string) {
  const appWindows = props.windows.filter(w => w.appId === appId && !w.minimized)
  if (appWindows.length === 0) return false
  const maxZIndex = Math.max(...props.windows.filter(w => !w.minimized).map(w => w.zIndex))
  return appWindows.some(w => w.zIndex === maxZIndex)
}

function handleAppClick(appId: string) {
  const minimizedWindow = props.windows.find(w => w.appId === appId && w.minimized)
  if (minimizedWindow) {
    emit('restoreWindow', minimizedWindow.id)
  } else {
    emit('openApp', appId)
  }
}

// 使用 requestAnimationFrame 节流鼠标移动事件
function updateMousePosition() {
  if (pendingMouseX !== null) {
    mouseX.value = pendingMouseX
    pendingMouseX = null
  }
  rafId = null
}

function handleMouseMove(e: MouseEvent) {
  const dock = e.currentTarget as HTMLElement
  const rect = dock.getBoundingClientRect()
  pendingMouseX = e.clientX - rect.left
  
  if (rafId === null) {
    rafId = requestAnimationFrame(updateMousePosition)
  }
}

function handleDockMouseLeave() {
  hoveredApp.value = null
  mouseX.value = -999
  pendingMouseX = null
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function getDockItemStyle(itemIndex: number) {
  if (mouseX.value < 0) {
    return {
      width: '48px',
      height: '48px',
      transform: 'translateY(0)'
    }
  }
  
  const baseSize = 48
  const maxSize = 72 // 放大到 1.5 倍
  
  // 计算当前鼠标位置与图标的距离
  const dockElement = document.querySelector('.dock')
  if (!dockElement) return { width: `${baseSize}px`, height: `${baseSize}px`, transform: 'translateY(0)' }
  
  const items = dockElement.querySelectorAll('.dock-item')
  // 找到对应的 DOM 元素（需要过滤掉分隔线）
  let domIndex = 0
  for (let i = 0; i < itemIndex; i++) {
    const item = displayedDockItems.value[i]
    if (item && !item.isDivider) {
      domIndex++
    }
  }
  
  const currentItem = items[domIndex] as HTMLElement
  if (!currentItem) return { width: `${baseSize}px`, height: `${baseSize}px`, transform: 'translateY(0)' }
  
  const rect = currentItem.getBoundingClientRect()
  const itemCenter = rect.left + rect.width / 2
  const dockRect = dockElement.getBoundingClientRect()
  const relativeMouseX = mouseX.value + dockRect.left
  
  const distance = Math.abs(relativeMouseX - itemCenter)
  const maxDistance = 100
  
  // 使用更平滑的衰减曲线 (ease-out)
  const scaleFactor = Math.max(0, 1 - Math.pow(distance / maxDistance, 1.5))
  const size = baseSize + (maxSize - baseSize) * scaleFactor
  const translateY = -scaleFactor * 15
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    transform: `translateY(${translateY}px)`
  }
}

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<style scoped>
.dock-container {
  position: fixed;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-container.dock-hidden {
  transform: translate(-50%, 150%);
}

.dock {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 4px;
  height: 56px;
  background: var(--dock-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--dock-border);
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  pointer-events: all;
  overflow: visible;
  transition: all var(--transition-smooth);
}

.dock-item {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 48px;
  transform-origin: bottom center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dock-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: width, height, transform;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
  transition: filter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dock-item:hover .icon-image {
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.25));
}

.app-tooltip {
  position: absolute;
  bottom: 95px;
  background: rgba(50, 50, 50, 0.95);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(10px);
}

.app-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(50, 50, 50, 0.95) transparent transparent transparent;
}

.dock-item:hover .app-tooltip {
  opacity: 1;
}

.running-indicator {
  position: absolute;
  bottom: -4px;
  width: 4px;
  height: 4px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
}

.dock-item.active .running-indicator {
  background: rgba(0, 0, 0, 0.8);
}

.dock-divider {
  width: 1px;
  height: 44px;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 4px;
}

.dock-trigger {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  z-index: 999;
}
</style>
