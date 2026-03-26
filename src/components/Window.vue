<template>
  <div
    v-if="!window.minimized"
    class="window"
    :class="{ 
      'maximized': window.maximized,
      'smooth-animate': !isDragging && !isResizing,
      'stickies-mode': isStickies
    }"
    :style="windowStyle"
    @mousedown="handleFocus"
  >
    <!-- Window Title Bar -->
    <div class="window-titlebar" :class="{ 'dragging': isDragging }" @mousedown="handleDragStart" @dblclick="handleTitlebarDblClick">
      <div class="window-controls">
        <button class="control-btn close" @click.stop="emit('close', window.id)" />
        <button class="control-btn minimize" @click.stop="startMinimize" />
        <button class="control-btn maximize" @click.stop="handleMaximize" />
      </div>
      <div class="window-title">{{ window.title }}</div>
      <div class="window-controls-spacer"></div>
    </div>
    
    <!-- Window Content -->
    <div class="window-content">
      <component 
        :is="contentComponent" 
        v-bind="window.props" 
        @update-title="handleUpdateTitle"
        @update-props="handleUpdateProps"
      />
    </div>

    <!-- Resize Handles -->
    <div class="resize-handle n" @mousedown.stop="startResize('n', $event)"></div>
    <div class="resize-handle e" @mousedown.stop="startResize('e', $event)"></div>
    <div class="resize-handle s" @mousedown.stop="startResize('s', $event)"></div>
    <div class="resize-handle w" @mousedown.stop="startResize('w', $event)"></div>
    <div class="resize-handle ne" @mousedown.stop="startResize('ne', $event)"></div>
    <div class="resize-handle nw" @mousedown.stop="startResize('nw', $event)"></div>
    <div class="resize-handle se" @mousedown.stop="startResize('se', $event)"></div>
    <div class="resize-handle sw" @mousedown.stop="startResize('sw', $event)"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, markRaw, defineAsyncComponent, watch } from 'vue'
import type { WindowState } from '../App.vue'

const props = defineProps<{
  window: WindowState
}>()

const emit = defineEmits<{
  close: [windowId: string]
  minimize: [windowId: string]
  focus: [windowId: string]
  maximize: [windowId: string]
}>()

const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)

const contentComponent = computed(() => {
  const components: Record<string, any> = {
    FinderApp: markRaw(defineAsyncComponent(() => import('./apps/FinderApp.vue'))),
    SafariApp: markRaw(defineAsyncComponent(() => import('./apps/SafariApp.vue'))),
    NotesApp: markRaw(defineAsyncComponent(() => import('./apps/NotesApp.vue'))),
    CalendarApp: markRaw(defineAsyncComponent(() => import('./apps/CalendarApp.vue'))),
    SettingsApp: markRaw(defineAsyncComponent(() => import('./apps/SettingsApp.vue'))),
    PreviewApp: markRaw(defineAsyncComponent(() => import('./apps/PreviewApp.vue'))),
    TerminalApp: markRaw(defineAsyncComponent(() => import('./apps/TerminalApp.vue'))),
    VSCodeApp: markRaw(defineAsyncComponent(() => import('./apps/VSCodeApp.vue'))),
    StickiesApp: markRaw(defineAsyncComponent(() => import('./apps/StickiesApp.vue'))),
  }
  return components[props.window.component] || null
})

const windowStyle = computed(() => {
  const style: Record<string, any> = {
    left: props.window.x + 'px',
    top: props.window.y + 'px',
    width: props.window.width + 'px',
    height: props.window.height + 'px',
    zIndex: props.window.zIndex,
    ...(isMinimizing.value ? minimizeStyle.value : {})
  }

  if (isStickies.value && props.window.props?.color) {
    style['--stickies-bg'] = props.window.props.color
    style['--stickies-titlebar-bg'] = props.window.props.titlebarColor || props.window.props.color
  }

  return style
})

const isStickies = computed(() => props.window.appId === 'stickies')

const isMinimizing = ref(false)
const minimizeStyle = ref({})

// Reset minimizing state when window is restored
watch(() => props.window.minimized, (newVal) => {
  if (!newVal) {
    isMinimizing.value = false
    minimizeStyle.value = {}
  }
})

function startMinimize() {
  const dockItem = document.getElementById(`dock-item-${props.window.appId}`)
  if (!dockItem) {
    emit('minimize', props.window.id)
    return
  }
  
  const dockRect = dockItem.getBoundingClientRect()
  const windowRect = {
    x: props.window.x,
    y: props.window.y,
    width: props.window.width,
    height: props.window.height
  }
  
  // Calculate center of dock item
  const targetX = dockRect.left + dockRect.width / 2
  const targetY = dockRect.top + dockRect.height / 2
  
  // Current center
  const currentCenterX = windowRect.x + windowRect.width / 2
  const currentCenterY = windowRect.y + windowRect.height / 2
  
  const tx = targetX - currentCenterX
  const ty = targetY - currentCenterY
  
  isMinimizing.value = true
  minimizeStyle.value = {
    transform: `translate(${tx}px, ${ty}px) scale(0)`,
    opacity: '0',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  }
  
  setTimeout(() => {
    emit('minimize', props.window.id)
    // Reset state so it's ready for next time (though unmounting usually handles it, we keep component instance alive)
    isMinimizing.value = false
    minimizeStyle.value = {}
  }, 500)
}

function handleFocus() {
  emit('focus', props.window.id)
}

function handleMaximize() {
  emit('maximize', props.window.id)
}

function handleTitlebarDblClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.window-controls')) return
  emit('maximize', props.window.id)
}

function handleDragStart(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.control-btn')) return
  
  isDragging.value = true
  dragStartX.value = e.clientX - props.window.x
  dragStartY.value = e.clientY - props.window.y
  
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging.value) return
    props.window.x = e.clientX - dragStartX.value
    props.window.y = Math.max(24, e.clientY - dragStartY.value)
  }
  
  const handleDragEnd = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', handleDrag)
    window.removeEventListener('mouseup', handleDragEnd)
  }
  
  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', handleDragEnd)
}

const isResizing = ref(false)
const resizeDirection = ref('')
const initialResizeState = ref({ x: 0, y: 0, width: 0, height: 0, mouseX: 0, mouseY: 0 })

function startResize(direction: string, e: MouseEvent) {
  if (props.window.maximized) return // Cannot resize when maximized
  
  isResizing.value = true
  resizeDirection.value = direction
  initialResizeState.value = {
    x: props.window.x,
    y: props.window.y,
    width: props.window.width,
    height: props.window.height,
    mouseX: e.clientX,
    mouseY: e.clientY
  }

  const handleResize = (e: MouseEvent) => {
    if (!isResizing.value) return
    
    // Prevent text selection during resize
    e.preventDefault()

    const dx = e.clientX - initialResizeState.value.mouseX
    const dy = e.clientY - initialResizeState.value.mouseY
    const { x, y, width, height } = initialResizeState.value
    
    const minWidth = isStickies.value ? 100 : 300
    const minHeight = isStickies.value ? 100 : 200
    
    let newWidth = width
    let newHeight = height
    let newX = x
    let newY = y

    if (resizeDirection.value.includes('e')) {
      newWidth = Math.max(minWidth, width + dx)
    }
    if (resizeDirection.value.includes('w')) {
      const possibleWidth = width - dx
      if (possibleWidth >= minWidth) {
        newWidth = possibleWidth
        newX = x + (width - newWidth)
      }
    }
    if (resizeDirection.value.includes('s')) {
      newHeight = Math.max(minHeight, height + dy)
    }
    if (resizeDirection.value.includes('n')) {
      const possibleHeight = height - dy
      if (possibleHeight >= minHeight) {
        newHeight = possibleHeight
        newY = y + (height - newHeight)
      }
    }

    props.window.x = newX
    props.window.y = newY
    props.window.width = newWidth
    props.window.height = newHeight
  }

  const stopResize = () => {
    isResizing.value = false
    window.removeEventListener('mousemove', handleResize)
    window.removeEventListener('mouseup', stopResize)
  }

  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
}

function handleUpdateTitle(newTitle: string) {
  props.window.title = newTitle
}

function handleUpdateProps(newProps: Record<string, any>) {
  // Update props in the window object
  // Since we don't have a direct method to update props deep in App.vue from here without event bubble,
  // we rely on the fact that props.window is an object reference from App.vue's ref array.
  // Modifying it here will likely update the source state in App.vue as well due to Vue's reactivity system sharing the object.
  if (!props.window.props) {
    props.window.props = {}
  }
  Object.assign(props.window.props, newProps)
}
</script>

<style scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--window-bg);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: var(--radius-lg);
  box-shadow: var(--window-shadow);
  border: 1px solid var(--window-border);
  overflow: hidden;
  animation: windowOpen 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  pointer-events: all;
}

.window.maximized {
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.window.smooth-animate {
  transition: 
    left 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    top 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes windowOpen {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.window-titlebar {
  /* height: 28px; */
  height: var(--window-titlebar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: var(--window-titlebar);
  border-bottom: 1px solid var(--window-border);
  cursor: default;
  user-select: none;
  transition: all var(--transition-smooth);
}

.window-titlebar.dragging {
  cursor: grabbing;
}

.window-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.control-btn.close {
  background: #FF5F57;
}

.control-btn.minimize {
  background: #FFBD2E;
}

.control-btn.maximize {
  background: #28CA42;
}

.control-btn:hover {
  filter: brightness(0.9);
}

.window-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.window-controls-spacer {
  width: 60px;
}

.window-content {
  flex: 1;
  overflow: hidden;
  background: var(--window-bg);
  transition: background var(--transition-smooth);
}

.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 100;
}

.resize-handle.n { top: -4px; left: 0; right: 0; height: 8px; cursor: n-resize; }
.resize-handle.e { top: 0; right: -4px; bottom: 0; width: 8px; cursor: e-resize; }
.resize-handle.s { bottom: -4px; left: 0; right: 0; height: 8px; cursor: s-resize; }
.resize-handle.w { top: 0; left: -4px; bottom: 0; width: 8px; cursor: w-resize; }

.resize-handle.ne { top: -4px; right: -4px; width: 12px; height: 12px; cursor: ne-resize; z-index: 101; }
.resize-handle.nw { top: -4px; left: -4px; width: 12px; height: 12px; cursor: nw-resize; z-index: 101; }
.resize-handle.se { bottom: -4px; right: -4px; width: 12px; height: 12px; cursor: se-resize; z-index: 101; }
.resize-handle.se { bottom: -4px; right: -4px; width: 12px; height: 12px; cursor: se-resize; z-index: 101; }
.resize-handle.sw { bottom: -4px; left: -4px; width: 12px; height: 12px; cursor: sw-resize; z-index: 101; }

.window.stickies-mode {
  background: var(--stickies-bg, #ffe66e);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: none;
  border-radius: 2px;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.window.stickies-mode .window-titlebar {
  background: var(--stickies-titlebar-bg, #fdf2a0);
  height: 22px;
  border-bottom: none;
}

.window.stickies-mode .window-title {
  display: none;
}

.window.stickies-mode .window-controls {
  transform: scale(0.7);
  margin-left: -4px;
}

.window.stickies-mode .control-btn {
  /* Make buttons simpler or just keep them small */
}

.window.stickies-mode .window-content {
  background: transparent;
}
</style>
