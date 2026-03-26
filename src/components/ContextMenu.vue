<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="context-menu"
      :style="{ left: x + 'px', top: y + 'px' }"
      @click.stop
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="menu-item"
        :class="{ disabled: item.disabled, divider: item.divider }"
        @click="handleClick(item)"
      >
        <template v-if="!item.divider">
          <span class="menu-icon" v-if="item.icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
          <span class="menu-shortcut" v-if="item.shortcut">{{ item.shortcut }}</span>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface MenuItem {
  label?: string
  icon?: string
  shortcut?: string
  action?: () => void
  disabled?: boolean
  divider?: boolean
}

interface Props {
  items: MenuItem[]
}

const props = defineProps<Props>()

const visible = ref(false)
const x = ref(0)
const y = ref(0)

function show(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  x.value = event.clientX
  y.value = event.clientY
  
  // 确保菜单不会超出屏幕
  setTimeout(() => {
    const menu = document.querySelector('.context-menu') as HTMLElement
    if (menu) {
      const rect = menu.getBoundingClientRect()
      if (rect.right > window.innerWidth) {
        x.value = window.innerWidth - rect.width - 10
      }
      if (rect.bottom > window.innerHeight) {
        y.value = window.innerHeight - rect.height - 10
      }
    }
  }, 0)
  
  visible.value = true
}

function hide() {
  visible.value = false
}

function handleClick(item: MenuItem) {
  if (item.disabled || item.divider) return
  
  if (item.action) {
    item.action()
  }
  
  hide()
}

function handleClickOutside(_event: MouseEvent) {
  if (visible.value) {
    hide()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('contextmenu', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('contextmenu', handleClickOutside)
})

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 0.5px rgba(0, 0, 0, 0.1);
  padding: 4px;
  min-width: 200px;
  z-index: 10000;
  font-size: 13px;
}

[data-theme="dark"] .context-menu {
  background: rgba(45, 45, 45, 0.95);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.1s ease;
  color: var(--text-primary);
}

.menu-item:not(.divider):not(.disabled):hover {
  background: rgba(0, 122, 255, 0.1);
}

[data-theme="dark"] .menu-item:not(.divider):not(.disabled):hover {
  background: rgba(0, 102, 204, 0.2);
}

.menu-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.menu-item.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 4px 8px;
  padding: 0;
  cursor: default;
}

[data-theme="dark"] .menu-item.divider {
  background: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  margin-right: 8px;
  font-size: 14px;
}

.menu-label {
  flex: 1;
}

.menu-shortcut {
  margin-left: 16px;
  font-size: 12px;
  opacity: 0.6;
}
</style>
