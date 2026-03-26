<template>
  <div class="desktop-widgets-layer" :class="{ 'visible': showWidgets }">
    <WidgetWrapper
      v-for="widget in widgets"
      :key="widget.id"
      :widget="widget"
      :component="getComponent(widget.type)"
      :is-editing="isEditing"
      @update:position="(pos) => updateWidgetPosition(widget.id, pos)"
      @drag-end="(payload) => handleDragEnd(widget.id, payload)"
      @remove="removeWidget(widget.id)"
      @mouseenter="onWidgetHover(true)"
      @mouseleave="onWidgetHover(false)"
    />
    
    <!-- Widget Gallery / Add Button (Only visible when editing) -->
    <div v-if="isEditing" class="widget-gallery-panel"
         @mouseenter="onWidgetHover(true)"
         @mouseleave="onWidgetHover(false)">
      <div class="gallery-title">添加小组件</div>
      <div class="gallery-sections">
        
        <div class="gallery-section">
          <div class="section-title">时钟</div>
          <div class="gallery-items">
            <div class="gallery-item" @click="addWidget('clock', '1:1')">
              <div class="preview clock size-1-1">1:1</div>
            </div>
            <!-- Clock only 1:1 for now -->
          </div>
        </div>

        <div class="gallery-section">
           <div class="section-title">天气</div>
           <div class="gallery-items">
            <div class="gallery-item" @click="addWidget('weather', '1:1')">
              <div class="preview weather size-1-1">1:1</div>
            </div>
            <div class="gallery-item" @click="addWidget('weather', '1:2')">
              <div class="preview weather size-1-2">1:2</div>
            </div>
           </div>
        </div>

        <div class="gallery-section">
           <div class="section-title">日历</div>
           <div class="gallery-items">
            <div class="gallery-item" @click="addWidget('calendar', '1:1')">
              <div class="preview calendar size-1-1">1:1</div>
            </div>
            <div class="gallery-item" @click="addWidget('calendar', '2:2')">
              <div class="preview calendar size-2-2">2:2</div>
            </div>
           </div>
        </div>

        <div class="gallery-section">
           <div class="section-title">用户卡片</div>
           <div class="gallery-items">
            <div class="gallery-item" @click="addWidget('user-card', '1:1')">
              <div class="preview user-card size-1-1">1:1</div>
            </div>
           </div>
        </div>

      </div>
      <button class="done-btn" @click="isEditing = false">完成</button>
    </div>

    <!-- Toggle Edit Mode Button (Temporary visual cue or rely on context menu) -->
    <!-- For now, let's add a small transparent trigger or rely on external control -->
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted, onUnmounted, defineAsyncComponent, watch } from 'vue'


import { CloudSyncAPI, AuthAPI } from '../../api'

const emit = defineEmits<{
  (e: 'toggle-edit-mode', isEditing: boolean): void
}>()

import WidgetWrapper from './widgets/WidgetWrapper.vue'

// Import Widgets
const ClockWidget = markRaw(defineAsyncComponent(() => import('./widgets/ClockWidget.vue')))
const WeatherWidget = markRaw(defineAsyncComponent(() => import('./widgets/WeatherWidget.vue')))
const CalendarWidget = markRaw(defineAsyncComponent(() => import('./widgets/CalendarWidget.vue')))
const UserCardWidget = markRaw(defineAsyncComponent(() => import('./widgets/UserCardWidget.vue')))

interface WidgetData {
  id: string
  type: string
  x: number
  y: number
  width?: number
  height?: number
  right?: number // Pixel distance from right edge
  top?: number   // Pixel distance from top edge
  rightPercent?: number // Deprecated but kept for migration
  topPercent?: number   // Deprecated
  xPercent?: number     // Deprecated
  yPercent?: number     // Deprecated
  screenWidth?: number
  screenHeight?: number
  props?: any
}

const widgets = ref<WidgetData[]>([])
const isEditing = ref(false)
const showWidgets = ref(false)
const isHovering = ref(false)

function getComponent(type: string) {
  switch (type) {
    case 'clock': return ClockWidget
    case 'weather': return WeatherWidget
    case 'calendar': return CalendarWidget
    case 'user-card': return UserCardWidget
    default: return ClockWidget
  }
}
// ...
// ... existing functions ...
// ...

function onActivity() {
  if (!isHovering.value) {
    resetHideTimer()
  } else {
    // If hovering, ensure timer is cleared
    if (hideTimer) clearTimeout(hideTimer)
  }
}

function resetHideTimer() {
  if (hideTimer) clearTimeout(hideTimer)
  
  // Don't start timer if we are hovering or editing
  if (isEditing.value || isHovering.value) return

  hideTimer = setTimeout(() => {
     if (!isEditing.value && !isHovering.value) {
         showWidgets.value = false
         stopInactivityTracking()
         
         // Re-enable trigger
         startMouseX = null
         startMouseY = null
         window.addEventListener('mousemove', onMouseMove)
     } else {
         // Should not happen due to check above, but safe guard
         resetHideTimer()
     }
  }, INACTIVITY_DELAY)
}

function onWidgetHover(hover: boolean) {
  isHovering.value = hover
  if (hover) {
    if (hideTimer) clearTimeout(hideTimer)
  } else {
    resetHideTimer()
  }
}

function updateWidgetPosition(id: string, pos: { x: number, y: number }) {
  const widget = widgets.value.find(w => w.id === id)
  if (widget) {
    widget.x = pos.x
    widget.y = pos.y
    // Do NOT save here on every move
  }
}

function handleDragEnd(id: string, payload: { x: number, y: number, width: number, height: number }) {
  const widget = widgets.value.find(w => w.id === id)
  if (widget) {
    widget.x = payload.x
    widget.y = payload.y
    widget.width = payload.width
    widget.height = payload.height
    
    // Store position as FIXED PIXEL OFFSET relative to TOP-RIGHT
    // right = distance from right edge to widget's right edge
    // top = distance from top edge
    
    // Calculate distance from right
    // Window Width = x + width + right
    // => right = Window Width - x - width
    const right = window.innerWidth - payload.x - payload.width
    const top = payload.y
    
    widget.right = right
    widget.top = top
    
    widget.screenWidth = window.innerWidth
    widget.screenHeight = window.innerHeight
    
    // Clear old positioning types
    delete widget.xPercent
    delete widget.yPercent
    delete widget.rightPercent
    delete widget.topPercent
    
    saveWidgets()
  }
}

// Widget Size Constants
const WIDGET_BASE_SIZE = 150
const WIDGET_GAP = 20

// 1:1 Size
const SIZE_SMALL = { width: WIDGET_BASE_SIZE, height: WIDGET_BASE_SIZE }
// 1:2 Size (Wide) - 2 units wide + 1 gap
const SIZE_WIDE = { width: WIDGET_BASE_SIZE * 2 + WIDGET_GAP, height: WIDGET_BASE_SIZE }
// 2:2 Size (Large) - 2 units wide + 1 gap, 2 units high + 1 gap
const SIZE_LARGE = { width: WIDGET_BASE_SIZE * 2 + WIDGET_GAP, height: WIDGET_BASE_SIZE * 2 + WIDGET_GAP }

function addWidget(type: string, sizeRatio: '1:1' | '1:2' | '2:2' = '1:1') {
  // Add to top-right area by default
  let size = SIZE_SMALL
  
  if (sizeRatio === '1:2') {
      size = SIZE_WIDE
  } else if (sizeRatio === '2:2') {
      size = SIZE_LARGE
  } else {
      size = SIZE_SMALL // Default 1:1
  }

  const width = size.width
  const height = size.height
  
  // Default to 20px from right, 50px from top (account for MenuBar)
  const right = 20
  const top = 50
  
  const x = window.innerWidth - width - right
  const y = top
  
  widgets.value.push({
    id: `widget-${Date.now()}`,
    type,
    x,
    y,
    width,
    height,
    right,
    top,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    props: {}
  })
  saveWidgets()
}

function removeWidget(id: string) {
  widgets.value = widgets.value.filter(w => w.id !== id)
  saveWidgets()
}

let syncTimeout: ReturnType<typeof setTimeout>

function saveWidgets() {
  // Direct upload to cloud, no local storage cache
  // We still debounce to avoid excessive API calls during dragging
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(async () => {
     try {
       // Only save if logged in, or if we want to enforce cloud requirement?
       // The instruction implies cloud reliance.
       // We should check login status or just try to save.
       // Current system seems to rely on AuthAPI.isLoggedIn() for correct endpoint/token usage implicitly or explicitly.
       if (AuthAPI.isLoggedIn()) {
          await CloudSyncAPI.save('desktop_widgets', widgets.value)
       } else {
         console.warn('Cannot save widgets: User not logged in and local storage is disabled.')
       }
     } catch (e) {
       console.error('Failed to sync widgets to cloud', e)
     }
  }, 1000)
}

async function loadWidgets() {
  let loadedWidgets: WidgetData[] = []
  let hasData = false
  
  // 1. Direct fetch from Cloud API - Allow public read
  try {
    const cloudData = await CloudSyncAPI.get('desktop_widgets')
    if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
      loadedWidgets = cloudData
      hasData = true
    }
  } catch (e) {
    console.error('Failed to fetch widgets from cloud', e)
  }
  
  // 2. If no data (or not logged in), Initialize Defaults
  // User requested to remove default 3 widgets. 
  // If no data in cloud, we start with empty desktop.
  if (!hasData) {
      loadedWidgets = []
  }

  // Recalculate positions based on Fixed Top-Right Offsets
  loadedWidgets.forEach(w => {
    // If we have fixed right/top offsets, use them
    if (typeof w.right === 'number' && typeof w.top === 'number') {
       const wWidth = w.width || 150
       w.x = window.innerWidth - wWidth - w.right
       w.y = w.top
    }
    // Migration: If we have rightPercent/topPercent (from previous step), convert to fixed px
    else if (typeof w.rightPercent === 'number' && typeof w.topPercent === 'number') {
       w.right = w.rightPercent * window.innerWidth
       w.top = w.topPercent * window.innerHeight
       
       const wWidth = w.width || 150
       w.x = window.innerWidth - wWidth - w.right
       w.y = w.top
    }
    // Migration: Old percentages (center/left based)
    else if (typeof w.xPercent === 'number' && typeof w.yPercent === 'number') {
       const centerX = w.xPercent * window.innerWidth
       const centerY = w.yPercent * window.innerHeight
       const wWidth = w.width || 150
       const wHeight = w.height || 150
       
       let calculatedX, calculatedY
       if (w.width && w.height) {
         calculatedX = centerX - wWidth / 2
         calculatedY = centerY - wHeight / 2
       } else {
         calculatedX = w.xPercent * window.innerWidth
         calculatedY = w.yPercent * window.innerHeight
       }
       
       w.right = window.innerWidth - calculatedX - wWidth
       w.top = calculatedY
       
       w.x = calculatedX
       w.y = calculatedY
       
       // Update the widget to use the new coordinate system for future saves
       delete w.xPercent
       delete w.yPercent
    }
  })
  
  widgets.value = loadedWidgets
  // No local storage sync
}

// Expose openEditMode to be called from parent or EventBus
// Simple event bus or window event for now
window.addEventListener('open-widget-gallery', () => {
  isEditing.value = true
})


let startMouseX: number | null = null
let startMouseY: number | null = null
const MOVEMENT_THRESHOLD = 470
const INACTIVITY_DELAY = 2000 // 5 seconds of inactivity hides the widgets
let hideTimer: ReturnType<typeof setTimeout> | null = null

function onMouseMove(e: MouseEvent) {
  if (showWidgets.value) return 

  if (startMouseX === null || startMouseY === null) {
    startMouseX = e.clientX
    startMouseY = e.clientY
    return
  }

  const dx = Math.abs(e.clientX - startMouseX)
  const dy = Math.abs(e.clientY - startMouseY)
  
  if (dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD) {
     showWidgets.value = true
     window.removeEventListener('mousemove', onMouseMove)
     startInactivityTracking()
  }
}

function startInactivityTracking() {
  window.addEventListener('mousemove', onActivity)
  window.addEventListener('mousedown', onActivity)
  window.addEventListener('keydown', onActivity)
  resetHideTimer()
}

function stopInactivityTracking() {
  window.removeEventListener('mousemove', onActivity)
  window.removeEventListener('mousedown', onActivity)
  window.removeEventListener('keydown', onActivity)
  if (hideTimer) clearTimeout(hideTimer)
}



watch(isEditing, (val) => {
  emit('toggle-edit-mode', val)
  // If we stop editing, ensure timer is running if widgets are shown
  if (!val && showWidgets.value) {
      resetHideTimer()
  }
})

onMounted(() => {
  loadWidgets()
  
  // Initialize visibility logic
  window.addEventListener('mousemove', onMouseMove)

  // Recalculate positions on window resize
  window.addEventListener('resize', () => {
      widgets.value.forEach(w => {
          if (typeof w.right === 'number' && typeof w.top === 'number') {
              const wWidth = w.width || 150
              w.x = window.innerWidth - wWidth - w.right
              w.y = w.top
          }
      })
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  stopInactivityTracking()
})

</script>

<style scoped>
.desktop-widgets-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let clicks pass through to icons/desktop unless hitting a widget */
  z-index: 2; /* Above icons (1), below windows (10) */
  
  /* Entrance Animation State: Hidden */
  opacity: 0;
  transition: opacity 0.8s ease-out;
}

.desktop-widgets-layer.visible {
  opacity: 1;
}

/* Allow pointer events on direct children (widgets) */
.desktop-widgets-layer > * {
  pointer-events: auto;
}

.widget-gallery-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 350px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.gallery-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.gallery-sections {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  width: 100%;
  padding-bottom: 20px;
  flex: 1;
}

.gallery-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
  margin-left: 5px;
  font-weight: 500;
}

.gallery-items {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 5px;
  width: 100%;
  /* justify-content: center; Remove centering to allow left alignment scrolling */
}

/* Hide scrollbar for gallery items */
.gallery-items::-webkit-scrollbar {
  display: none;
}

.gallery-item {
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.preview {
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Base Unit for Preview: 80px */
.preview.size-1-1 { width: 80px; height: 80px; }
.preview.size-1-2 { width: 170px; height: 80px; } /* 80*2 + 10 gap approx */
.preview.size-2-2 { width: 170px; height: 170px; }

.preview.clock { background: #eee; color: #333; }
.preview.weather { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.preview.calendar { background: #ff5f57; }
.preview.user-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

.done-btn {
  margin-top: 10px;
  padding: 8px 24px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
}

@media (prefers-color-scheme: dark) {
  .widget-gallery-panel {
    background: rgba(30, 30, 30, 0.9);
  }
  .gallery-title {
    color: white;
  }
  .section-title {
    color: #aaa;
  }
  .preview.clock { background: #444; color: white; }
}
</style>
