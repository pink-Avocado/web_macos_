<template>
  <div class="stickies-app">
    <textarea 
      class="sticky-content" 
      placeholder="Take a note..."
      spellcheck="false"
      :value="content"
      @input="handleInput"
    ></textarea>
    
    <!-- Color Picker Trigger -->
    <div class="color-picker-trigger">
      <div class="color-dots">
        <button 
          v-for="(theme, name) in colors" 
          :key="name"
          class="color-dot"
          :style="{ backgroundColor: theme.color }"
          :class="{ active: (color || colors.yellow.color) === theme.color }"
          @click="changeColor(theme)"
          :title="name"
        ></button>
        <button class="add-btn" @click="createNewSticky" title="New Note">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue'

const openApp = inject<(appId: string, props?: any) => void>('openApp')

const props = defineProps<{
  color?: string
  titlebarColor?: string
  content?: string
}>()

const emit = defineEmits<{
  (e: 'update-props', payload: { color?: string, titlebarColor?: string, content?: string }): void
}>()

const colors = {
  yellow: { color: '#ffe66e', titlebar: '#fdf2a0' },
  blue: { color: '#96c2f1', titlebar: '#cce3fa' },
  green: { color: '#aeefec', titlebar: '#c8f7f5' },
  pink: { color: '#ffc8d5', titlebar: '#ffe3ea' },
  purple: { color: '#d1cee7', titlebar: '#e5e2f7' },
  grey: { color: '#e4e4e4', titlebar: '#f0f0f0' },
}

function handleInput(e: Event) {
  emit('update-props', {
    content: (e.target as HTMLTextAreaElement).value
  })
}

function changeColor(theme: { color: string, titlebar: string }) {
  emit('update-props', {
    color: theme.color,
    titlebarColor: theme.titlebar
  })
}

function createNewSticky() {
  if (openApp) {
    openApp('stickies', { forceNew: true })
  }
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    e.preventDefault()
    createNewSticky()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.stickies-app {
  width: 100%;
  height: 100%;
  background-color: transparent; /* Use window background */
  display: flex;
  flex-direction: column;
  position: relative;
}

.sticky-content {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  resize: none;
  outline: none;
  padding: 16px;
  font-family: "Noteworthy", "Marker Felt", "Bradley Hand", cursive;
  font-size: 18px;
  line-height: 1.4;
  color: #4a4a4a;
}

.sticky-content::placeholder {
  color: rgba(74, 74, 74, 0.5);
}

.color-picker-trigger {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s ease;
  background: rgba(255, 255, 255, 0.4);
  padding: 4px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.stickies-app:hover .color-picker-trigger {
  opacity: 1;
}

.color-dots {
  display: flex;
  gap: 6px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
  padding: 0;
}

.color-dot:hover {
  transform: scale(1.1);
  border-color: rgba(0,0,0,0.3);
}

.color-dot.active {
  border: 2px solid #555;
  transform: scale(0.9);
}

.add-btn {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  color: #555;
  padding: 0;
  transition: all 0.2s;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}
</style>
