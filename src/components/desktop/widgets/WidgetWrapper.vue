<template>
  <div 
    ref="wrapperRef"
    class="widget-wrapper"
    :style="style"
    @mousedown="handleMouseDown"
    @contextmenu.prevent="handleContextMenu"
  >
    <div v-if="isEditing" class="widget-controls">
      <button class="delete-btn" @click.stop="$emit('remove')">×</button>
    </div>
    
    <component :is="component" :data="widget.props" :widget="widget" />
    
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  widget: any
  component: any
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:position', payload: { x: number, y: number }): void
  (e: 'drag-end', payload: { x: number, y: number, width: number, height: number }): void
  (e: 'remove'): void
}>()

const wrapperRef = ref<HTMLElement | null>(null)

const style = computed(() => ({
  left: `${props.widget.x}px`,
  top: `${props.widget.y}px`,
  width: `${props.widget.width}px`,
  height: `${props.widget.height}px`
  // zIndex: 2 // Handled by parent or CSS
}))

// Dragging Logic
let isDragging = false
let startX = 0
let startY = 0
let initialX = 0
let initialY = 0

function handleMouseDown(e: MouseEvent) {
  // Only drag if in editing mode or if we decide widgets are always draggable (user preference)
  // For now, let's say widgets are draggable when holding mouse down or if specific handle is used.
  // Actually, macOS widgets are draggable.
  
  if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) return // Don't drag if interacting with controls

  isDragging = true
  startX = e.clientX
  startY = e.clientY
  initialX = props.widget.x
  initialY = props.widget.y
  
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging) return
  
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  
  emit('update:position', {
    x: initialX + dx,
    y: initialY + dy
  })
}

function handleMouseUp(e: MouseEvent) {
  if (isDragging) {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const finalX = initialX + dx
    const finalY = initialY + dy
    
    const el = wrapperRef.value
    if (el) {
       emit('drag-end', {
         x: finalX,
         y: finalY,
         width: el.offsetWidth,
         height: el.offsetHeight
       })
    }
  }

  isDragging = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

function handleContextMenu() {
  // Can emit event to open menu
}

</script>

<style scoped>
.widget-wrapper {
  position: absolute;
  user-select: none;
  cursor: default;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 20px; /* macOS style */
  /* backdrop-filter: blur(20px); */ /* Widgets themselves usually have their own background */
}

.widget-wrapper:active {
  cursor: grabbing;
}

.widget-controls {
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: 100;
}

.delete-btn {
  background: #ff5f57;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>
