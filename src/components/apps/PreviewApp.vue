<template>
  <div class="preview-app" :class="{ 'is-loading': isLoading }">
    <!-- Preview 工具栏 -->
    <div class="preview-toolbar">
      <div class="toolbar-left">
        <button 
          class="nav-btn" 
          :disabled="!hasPrev"
          @click="prevImage"
          title="上一张 (←)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button 
          class="nav-btn" 
          :disabled="!hasNext"
          @click="nextImage"
          title="下一张 (→)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="divider"></div>
        
        <button 
          class="tool-btn" 
          @click="rotateLeft" 
          :disabled="fileType === 'video'"
          title="向左旋转"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3V1L5 4L8 7V5C10.2 5 12 6.8 12 9S10.2 13 8 13S4 11.2 4 9H2C2 12.3 4.7 15 8 15S14 12.3 14 9S11.3 3 8 3Z"/>
          </svg>
        </button>
        <button 
          class="tool-btn" 
          @click="rotateRight" 
          :disabled="fileType === 'video'"
          title="向右旋转"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3V1L11 4L8 7V5C5.8 5 4 6.8 4 9S5.8 13 8 13S12 11.2 12 9H14C14 12.3 11.3 15 8 15S2 12.3 2 9S4.7 3 8 3Z"/>
          </svg>
        </button>
      </div>
      
      <div class="toolbar-center">
        <!-- <span class="image-name">{{ fileName }}</span> -->
        <span class="image-name" v-if="fileList.length > 1">
          {{ currentIndex + 1 }} / {{ fileList.length }}
        </span>
      </div>
      
      <div class="toolbar-right">
        <div class="zoom-controls">
          <button class="tool-btn" @click="zoomOut" :disabled="zoom <= 0.1" title="缩小 (-)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M6 8H10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
          <button class="tool-btn" @click="zoomIn" :disabled="zoom >= 5" title="放大 (+)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M6 8H10M8 6V10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button class="tool-btn" @click="resetZoom" title="实际大小">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M6 6H10M6 8H10M6 10H8"/>
            </svg>
          </button>
          <button class="tool-btn" @click="fitToWindow" title="适合窗口">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" rx="2"/>
              <rect x="4" y="4" width="8" height="8" fill="currentColor" rx="1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="preview-content" ref="contentRef" @wheel="handleWheel">
      <div v-if="error" class="error-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>无法预览此文件</span>
        <div class="debug-info" style="font-size: 10px; opacity: 0.5; margin-top: 8px;">
          Preview failed
        </div>
      </div>
      
      <div v-if="isLoading && !error" class="loading-state">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-if="!error" class="media-container" v-show="!isLoading" :style="mediaStyle">
        <img 
          v-if="fileType === 'image'"
          ref="imageRef"
          :src="currentUrl" 
          :alt="fileName"
          draggable="false"
          @load="handleLoad"
          @error="handleError"
        />
        <video 
          v-else-if="fileType === 'video'"
          :src="currentUrl"
          controls
          autoplay
          @loadeddata="handleLoad"
          @error="handleError"
          @timeupdate="handleVideoTimeUpdate"
          @loadedmetadata="handleVideoLoadedMetadata"
        ></video>
      </div>
    </div>

    <!-- Preview 状态栏 -->
    <div class="preview-statusbar">
      <div class="status-left">
        <span v-if="fileType === 'video'">
          {{ formatTime(videoCurrentTime) }} / {{ formatTime(videoDuration) }}
        </span>
        <span v-else>
           <!-- 显示当前图片序号/总数 -->
           <!-- <span v-if="fileList.length > 1" style="margin-right: 10px; opacity: 0.8;">
             {{ currentIndex + 1 }} / {{ fileList.length }}
           </span> -->
           <!-- 显示当前日期作为占位，如果有文件日期则显示文件日期 -->
           {{ currentDate }}
        </span>
      </div>
      <div class="status-right">
        <!-- 如果有文件大小数据则显示 -->
        <span v-if="fileSize">{{ formatFileSize(fileSize) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { FileAPI } from '../../api'

interface PreviewFileItem {
  name: string
  path: string
  url?: string
  size?: number | string // Allow string size from Finder
  date?: string
}

const props = defineProps<{
  path?: string
  name?: string
  url?: string
  list?: PreviewFileItem[]
}>()

const emit = defineEmits<{
  (e: 'update-title', title: string): void
}>()

const isLoading = ref(true)
const error = ref(false)
const zoom = ref(1)
const rotation = ref(0)
const contentRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

// 当前显示的文件信息
const currentPath = ref('')
const currentName = ref('')
const currentUrl = ref('')

// 视频相关状态
const videoCurrentTime = ref(0)
const videoDuration = ref(0)

// 列表相关
const fileList = computed(() => props.list || [])
const currentIndex = computed(() => {
  if (fileList.value.length === 0) return 0
  return fileList.value.findIndex(item => item.path === currentPath.value)
})
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < fileList.value.length - 1 && currentIndex.value !== -1)


const fileName = computed(() => currentName.value || currentPath.value?.split('/').pop() || 'Untitled')
const currentDate = new Date().toLocaleDateString()
// 暂时无法获取真实大小，设为null或根据需要扩展
const fileSize = ref<number | null>(null)

const fileType = computed(() => {
  const ext = fileName.value.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(ext || '')) return 'image'
  if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) return 'video'
  return 'unknown'
})

const mediaStyle = computed(() => ({
  transform: `scale(${zoom.value}) rotate(${rotation.value}deg)`,
  transition: 'transform 0.2s ease'
}))

// Navigation Methods
function prevImage() {
  if (hasPrev.value) {
    const prevItem = fileList.value[currentIndex.value - 1]
    if (prevItem) {
      loadFile(prevItem)
    }
  }
}

function nextImage() {
  if (hasNext.value) {
    const nextItem = fileList.value[currentIndex.value + 1]
    if (nextItem) {
      loadFile(nextItem)
    }
  }
}

function loadFile(item: PreviewFileItem) {
  currentPath.value = item.path
  currentName.value = item.name
  // Update file size if available
  if (item.size) {
    // If it's a string (from Finder), we might need to parse it or just store it.
    // But formatFileSize expects number or string. 
    // If it's a string like "1.2 MB", we can just pass it if formatFileSize handles it.
    // Our formatFileSize in PreviewApp handles string inputs now.
    fileSize.value = item.size as any
  } else {
    fileSize.value = null
  }

  // If item has URL use it, otherwise prepare to fetch
  if (item.url) {
    currentUrl.value = item.url
  } else {
    currentUrl.value = FileAPI.getImageUrl(item.path)
  }
  
  // Update browser title via emit if needed, or local state
  // Reset view state
  zoom.value = 1
  rotation.value = 0
  videoCurrentTime.value = 0
  videoDuration.value = 0
  isLoading.value = true
  error.value = false
  
  // Simulate load or wait for image load event
  // For images, load event will handle loading state
  // For videos, loadeddata
  
  emit('update-title', currentName.value)
}

function handleLoad() {
  isLoading.value = false
  error.value = false
  nextTick(() => {
    fitToWindow()
  })
}

function handleVideoTimeUpdate(e: Event) {
  const video = e.target as HTMLVideoElement
  videoCurrentTime.value = video.currentTime
}

function handleVideoLoadedMetadata(e: Event) {
  const video = e.target as HTMLVideoElement
  videoDuration.value = video.duration
  handleLoad()
}

function fitToWindow() {
  if (fileType.value !== 'image') return
  if (!imageRef.value || !contentRef.value) return
  
  const container = contentRef.value
  const img = imageRef.value
  
  // Ensure image is loaded
  if (!img.complete) return

  const containerRect = container.getBoundingClientRect()
  const imgNaturalWidth = img.naturalWidth
  const imgNaturalHeight = img.naturalHeight
  
  if (imgNaturalWidth && imgNaturalHeight) {
    // Calculate available space (assuming 40px buffer)
    const availableWidth = containerRect.width - 40
    const availableHeight = containerRect.height - 40
    
    if (availableWidth <= 0 || availableHeight <= 0) return

    // Calculate scale
    const scaleX = availableWidth / imgNaturalWidth
    const scaleY = availableHeight / imgNaturalHeight
    
    // Adaptive: fit to window but max 100%
    const optimalScale = Math.min(scaleX, scaleY, 1)
    
    zoom.value = optimalScale
  }
}

function handleError() {
  isLoading.value = false
  error.value = true
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.1, 5)
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.1, 0.1)
}

function resetZoom() {
  zoom.value = 1
}

function rotateLeft() {
  rotation.value -= 90
}

function rotateRight() {
  rotation.value += 90
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  
  if (e.deltaY > 0) {
    // Zoom out
    zoom.value = Math.max(0.1, zoom.value / 1.1)
  } else {
    // Zoom in
    zoom.value = Math.min(5, zoom.value * 1.1)
  }
}

// Format helpers
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatFileSize(bytes: any) {
  if (typeof bytes === 'string') return bytes // Already formatted
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}


// Initialize state
async function initContent() {
  if (props.path) currentPath.value = props.path
  if (props.name) currentName.value = props.name
  if (props.url) {
    currentUrl.value = props.url
  } else if (props.path) {
    currentUrl.value = FileAPI.getImageUrl(props.path)
  }
  
  // Try to find current item in list to get size
  if (currentPath.value && fileList.value.length > 0) {
    const item = fileList.value.find(i => i.path === currentPath.value)
    if (item && item.size) {
      fileSize.value = item.size as any
    }
  }
  
  // If list is present but currentPath is not set, defaulting to first?
  // Usually path is passed so this should correspond to one in list.
  
  isLoading.value = true
  error.value = false
}

watch(() => props.path, () => {
  initContent()
})

onMounted(() => {
  initContent()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    // Clean up if needed
    window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}
</script>

<style scoped>
.preview-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--app-bg);
  color: var(--text-primary);
  font-size: 13px;
}

/* Toolbar */
.preview-toolbar {
  height: 44px;
  background: var(--app-toolbar-bg);
  border-bottom: 1px solid var(--app-toolbar-border);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 12px;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.nav-btn, .tool-btn {
  width: 32px;
  height: 32px;
  border: 1px solid transparent; /* var(--app-border) usually not used for ghost buttons, but if we want borders: var(--app-border) */
  border-radius: 6px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

/* Or use a specific style for buttons if they need to look like inputs or specific controls */
.nav-btn, .tool-btn {
    border-color: var(--app-input-border);
    background: var(--app-input-bg);
    color: var(--text-primary);
}

.nav-btn:hover:not(:disabled), .tool-btn:hover:not(:disabled) {
  background: var(--app-item-hover);
}

.nav-btn:disabled, .tool-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--app-separator);
  margin: 0 4px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.image-name {
  font-size: 13px;
  font-weight: 600;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

/* Content */
.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--app-bg); /* Or window-bg if distinct */
  position: relative;
}

/* If app-bg is white in light mode, maybe we want a slight contrast for content area? 
   style.css has --bg-tertiary which is slightly gray.
*/
.preview-content {
    background: var(--bg-tertiary);
}

.media-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

img, video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: var(--window-shadow);
}

/* States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 16px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--app-border);
  border-top-color: var(--macos-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Status Bar */
.preview-statusbar {
  height: 28px;
  background: var(--app-toolbar-bg);
  border-top: 1px solid var(--app-toolbar-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 11px;
  color: var(--text-secondary);
  flex-shrink: 0;
}
</style>
