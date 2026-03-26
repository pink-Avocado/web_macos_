<template>
  <div class="settings-app">
    <div class="settings-sidebar">
      <div
        v-for="section in sections"
        :key="section.id"
        class="settings-item"
        :class="{ active: section.id === activeSection }"
        @click="activeSection = section.id"
      >
        <span class="settings-label">{{ resolveName(section.nameKey) }}</span>
      </div>
    </div>
    
    <div class="settings-content">
      <div v-if="activeSection === 'about'" class="settings-panel about-view">
         <div class="about-header">
           <img src="https://www.qian-qian.xyz/tx.jpg" class="system-icon-large" />
           <h2 class="system-title">macos_web</h2>
           <p class="system-version">Version 3.0</p>
         </div>
         
         <div class="about-specs">
           <div class="spec-row">
             <span class="spec-label">作者</span>
             <span class="spec-value">前端小白</span>
           </div>
           <div class="spec-row">
             <span class="spec-label">当前运行环境</span>
             <span class="spec-value">{{ browserInfo }}</span>
           </div>
           <div class="spec-row">
             <span class="spec-label">屏幕分辨率</span>
             <span class="spec-value">{{ systemInfo.screenRes }}</span>
           </div>
           <div class="spec-row">
             <span class="spec-label">发行日期</span>
             <span class="spec-value">2026/01/25</span>
           </div>
         </div>
         
         <div class="tech-stack">
            <div class="shield-badge">
              <span class="shield-label">框架</span>
              <span class="shield-value" style="background: #4FC08D">Vue 3</span>
            </div>
            <div class="shield-badge">
              <span class="shield-label">语言</span>
              <span class="shield-value" style="background: #3178C6">TypeScript</span>
            </div>
            <div class="shield-badge">
              <span class="shield-label">构建</span>
              <span class="shield-value" style="background: #646CFF">Vite</span>
            </div>
           <div class="shield-badge">
              <span class="shield-label">存储</span>
              <span class="shield-value" style="background: #FF6A00">阿里云OSS</span>
            </div>
            <div class="shield-badge">
              <span class="shield-label">云开发</span>
              <span class="shield-value" style="background: #111827">Sealos</span>
            </div>
            
         </div>
      </div>

      <div v-else-if="activeSection === 'wallpaper'" class="settings-panel">
        <h2>{{ t.settings.wallpaper }}</h2>
        
        <div v-if="isLoadingWallpapers" class="loading-container">
          <div class="spinner"></div>
        </div>
        
        <div v-else class="wallpaper-grid">
          <div 
            v-for="wp in wallpapers" 
            :key="wp.url" 
            class="wallpaper-item"
            @click="setWallpaper(wp.url)"
          >
            <div class="wallpaper-preview">
              <video 
                v-if="wp.url.endsWith('.mp4') || wp.url.endsWith('.webm')"
                :src="wp.url" 
                muted 
                loop 
                onmouseover="this.play()" 
                onmouseout="this.pause()"
                class="wallpaper-video-preview"
              ></video>
              <img v-else :src="wp.url" loading="lazy" />
            </div>
            <span class="wallpaper-name">{{ wp.name }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="activeSection === 'apps'" class="settings-panel">
        <h2>{{ t.settings.appManagement }}</h2>
        <div class="setting-group">
          <div 
            v-for="(app, index) in apps" 
            :key="app.id" 
            class="setting-row draggable-item"
            :class="{ 'dragging': dragIndex === index, 'drag-over': dragOverIndex === index }"
            draggable="true"
            @dragstart="handleDragStart($event, index)"
            @dragenter.prevent="handleDragEnter(index)"
            @dragover.prevent
            @dragend="handleDragEnd"
            @drop="handleDrop"
          >
            <div class="app-info">
              <span class="drag-handle">≡</span>
              <img :src="app.icon" class="app-icon-small" />
              <label>{{ resolveName(app.nameKey) }}</label>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                :checked="app.showInDock"
                :disabled="app.id === 'settings'"
                @change="(e) => onDockChange(app.id, (e.target as HTMLInputElement).checked)"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div v-else class="settings-panel">
        <h2>{{ resolveName(sections.find(s => s.id === activeSection)?.nameKey || '') }}</h2>
        <p class="placeholder-text">{{ t.settings.panelPlaceholder }} {{ resolveName(sections.find(s => s.id === activeSection)?.nameKey || '') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { useApps } from '../../composables/useApps'
import { useI18n } from '../../composables/useI18n'

import { CloudSyncAPI, AuthAPI, FileAPI } from '../../api'

const { apps, toggleDock, updateAppOrder } = useApps()
const { t } = useI18n()

// Cloud Sync
const saveToCloud = async () => {
  if (!AuthAPI.isLoggedIn()) return

  try {
    const key = 'macos_dock_settings'
    await CloudSyncAPI.save(key, apps.value)
  } catch (error) {
    console.error('Failed to sync to cloud:', error)
  }
}

const onDockChange = (appId: string, checked: boolean) => {
  toggleDock(appId, checked)
  saveToCloud()
}

// Drag and Drop Logic
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function handleDragStart(e: DragEvent, index: number) {
  dragIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
    // 设为透明度降低，在 drag css 中处理
  }
}

function handleDragEnter(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return
  dragOverIndex.value = index
  
  // Real-time reordering preview (Optional: can be done processing only on drop, 
  // but iOS/Mac style usually swaps immediately. Let's do swap on drop for simplicity 
  // or swap on enter for smoothness. Let's try swap on drop properly first for stability)
}

function handleDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
}

function handleDrop() {
  if (dragIndex.value !== null && dragOverIndex.value !== null) {
    const newApps = [...apps.value]
    const [movedItem] = newApps.splice(dragIndex.value, 1)
    if (movedItem) {
      newApps.splice(dragOverIndex.value, 0, movedItem)
      updateAppOrder(newApps)
      saveToCloud()
    }
  }
  handleDragEnd()
}

function resolveName(key: string) {
  return key.split('.').reduce((o: any, k) => o?.[k], t) || key
}

const sections = [
  { id: 'about', nameKey: 'settings.about', icon: 'ℹ️' },
  { id: 'wallpaper', nameKey: 'settings.wallpaper', icon: '🖼️' },
  { id: 'apps', nameKey: 'settings.appManagement', icon: '📱' },
]

const activeSection = ref('about')

// Wallpaper Logic
interface Wallpaper {
  name: string
  url: string
}

const wallpapers = ref<Wallpaper[]>([])
const isLoadingWallpapers = ref(false)
const setWallpaper = inject('setWallpaper') as (url: string) => void

const fetchWallpapers = async () => {
  if (wallpapers.value.length > 0) return
  
  isLoadingWallpapers.value = true
  try {
    const data = await FileAPI.getData('macos_web/图库/壁纸/')
    if (data.Contents) {
       wallpapers.value = data.Contents
         .filter((file: any) => {
             const ext = file.Key.split('.').pop()?.toLowerCase()
             return ['jpg', 'jpeg', 'png', 'webp', 'heic', 'mp4', 'webm'].includes(ext || '') && !file.Key.endsWith('/')
         })
         .map((file: any) => ({
             name: file.Key.split('/').pop() || 'Unknown',
             url: FileAPI.getImageUrl(file.Key)
         }))
    }
  } catch (e) {
    console.error('Failed to fetch wallpapers', e)
  } finally {
    isLoadingWallpapers.value = false
  }
}

const getBrowserInfo = () => {
  const ua = navigator.userAgent
  let browserName = 'Unknown'
  let fullVersion = ''
  let nameOffset, verOffset, ix

  // In Opera, the true version is after "OPR" or "Opera"
  if ((verOffset = ua.indexOf("OPR/")) != -1) {
    browserName = "Opera"
    fullVersion = ua.substring(verOffset + 4)
  }
  // In Edge, the true version is after "Edg"
  else if ((verOffset = ua.indexOf("Edg/")) != -1) {
    browserName = "Edge"
    fullVersion = ua.substring(verOffset + 4)
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = ua.indexOf("Chrome/")) != -1) {
    browserName = "Chrome"
    fullVersion = ua.substring(verOffset + 7)
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = ua.indexOf("Safari/")) != -1) {
    browserName = "Safari"
    fullVersion = ua.substring(verOffset + 7)
    if ((verOffset = ua.indexOf("Version/")) != -1) {
      fullVersion = ua.substring(verOffset + 8)
    }
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = ua.indexOf("Firefox/")) != -1) {
    browserName = "Firefox"
    fullVersion = ua.substring(verOffset + 8)
  }
  else if ((nameOffset = ua.lastIndexOf(' ') + 1) < (verOffset = ua.lastIndexOf('/'))) {
    browserName = ua.substring(nameOffset, verOffset)
    fullVersion = ua.substring(verOffset + 1)
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName
    }
  }

  // trim the fullVersion string at semicolon/space/paren
  if ((ix = fullVersion.indexOf(";")) != -1) fullVersion = fullVersion.substring(0, ix)
  if ((ix = fullVersion.indexOf(" ")) != -1) fullVersion = fullVersion.substring(0, ix)
  if ((ix = fullVersion.indexOf(")")) != -1) fullVersion = fullVersion.substring(0, ix)

  return `${browserName} ${fullVersion}`
}

const getSystemInfo = () => {
  const ua = navigator.userAgent
  let os = 'Unknown'
  if (ua.indexOf('Win') !== -1) os = 'Windows'
  if (ua.indexOf('Mac') !== -1) os = 'macOS'
  if (ua.indexOf('Linux') !== -1) os = 'Linux'
  if (ua.indexOf('Android') !== -1) os = 'Android'
  if (ua.indexOf('like Mac') !== -1) os = 'iOS'

  const screenRes = `${window.screen.width} × ${window.screen.height}`
  const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} 核` : 'Unknown'

  return { os, screenRes, cpuCores }
}

const browserInfo = ref(getBrowserInfo())
const systemInfo = ref(getSystemInfo())

watch(activeSection, (newSection) => {
  if (newSection === 'wallpaper') {
    fetchWallpapers()
  }
})
</script>

<style scoped>
.settings-app {
  height: 100%;
  display: flex;
  background: var(--app-bg);
  color: var(--text-primary);
  transition: all var(--transition-smooth);
}

.settings-sidebar {
  width: 240px;
  background: var(--app-sidebar-bg);
  border-right: 1px solid var(--app-border);
  overflow-y: auto;
  padding: 20px 0;
  transition: all var(--transition-smooth);
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.15s ease;
  color: var(--text-primary);
}

.settings-item:hover {
  background: var(--app-item-hover);
}

.settings-item.active {
  background: var(--app-bg);
  border-right: 3px solid var(--macos-blue);
}

.settings-icon {
  font-size: 20px;
}

.settings-label {
  font-size: 14px;
  font-weight: 500;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  background: var(--app-bg);
}

.settings-panel h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-primary);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--app-input-bg);
  border-radius: 10px;
  transition: background var(--transition-smooth);
}

.setting-row label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.setting-select {
  padding: 6px 12px;
  border: 1px solid var(--app-input-border);
  border-radius: 6px;
  background: var(--app-bg);
  font-size: 13px;
  cursor: pointer;
  color: var(--text-primary);
}

.color-options {
  display: flex;
  gap: 12px;
}

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease;
  border: 2px solid transparent;
}

.color-dot:hover {
  transform: scale(1.1);
  border-color: rgba(0, 0, 0, 0.2);
}

.setting-slider {
  width: 200px;
}

.setting-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.placeholder-text {
  color: var(--text-secondary);
  font-size: 16px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-icon-small {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.draggable-item {
  cursor: grab;
  user-select: none;
}

.draggable-item:active {
  cursor: grabbing;
}

.draggable-item.dragging {
  opacity: 0.5;
  background: var(--app-item-hover);
}

.draggable-item.drag-over {
  border-top: 2px solid var(--macos-blue);
  transform: translateY(2px);
}

.drag-handle {
  color: var(--text-secondary);
  font-size: 18px;
  cursor: grab;
  margin-right: 4px;
  opacity: 0.5;
}

.drag-handle:hover {
  opacity: 1;
}

/* iOS-style toggle switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc; /* Fallback */
  background-color: var(--app-input-border);
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .slider {
  background-color: var(--macos-blue); /* Use theme color */
  background-color: #34C759; /* Green for ON state like iOS */
}

input:checked + .slider:before {
  transform: translateX(22px);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Wallpaper Grid Styles */
.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  padding-bottom: 20px;
}

.wallpaper-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.wallpaper-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.wallpaper-preview {
  width: 100%;
  aspect-ratio: 16/9;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--app-border);
}

.wallpaper-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wallpaper-video-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wallpaper-name {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  text-align: center;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--macos-blue);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* About Section Styles */
.about-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.system-icon-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.system-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 5px 0;
}

.system-version {
  color: var(--text-secondary);
  font-size: 14px;
}

.about-specs {
  background: var(--app-input-bg);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 30px;
  border: 1px solid var(--app-border);
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
}

.spec-row:not(:last-child) {
  border-bottom: 1px solid var(--app-border);
}

.spec-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.spec-value {
  font-weight: 600;
  color: var(--text-primary);
}

.tech-stack {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
}

.shield-badge {
  display: inline-flex;
  align-items: stretch;
  height: 24px;
  border-radius: 3px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 11px;
  text-shadow: 0 1px 0 rgba(0,0,0,0.1);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  cursor: default;
}

.shield-badge:hover {
  transform: scale(1.05);
}

.shield-label {
  background: #555;
  color: #fff;
  padding: 0 8px;
  display: flex;
  align-items: center;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.shield-value {
  color: #fff;
  padding: 0 8px;
  display: flex;
  align-items: center;
  font-weight: 700;
}
</style>
