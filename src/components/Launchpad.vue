<template>
  <div 
    class="launchpad" 
    :class="{ 'closing': isClosing }"
    @click="handleBackgroundClick"
    @mousedown="handlePageMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <div class="launchpad-content" :class="{ 'blur-content': expandedFolderId }">
      <!-- Search Bar -->
      <div class="search-container" @click.stop>
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input 
            type="text" 
            :placeholder="t.common.search" 
            v-model="searchQuery"
            ref="searchInput"
            @keydown.stop
          >
        </div>
      </div>

      <!-- Apps Pages Container -->
      <div 
        class="pages-container"
        :style="{ transform: `translateX(calc(-${currentPage * 100}% + ${pageDragOffset}px))` }"
        :class="{ 'transitioning': !isPageDragging }"
      >
        <div 
          v-for="(page, pageIndex) in paginatedApps" 
          :key="pageIndex" 
          class="apps-page"
        >
          <div class="apps-grid">
            <template v-for="item in page" :key="item.id">
              <!-- Folder Item -->
              <div 
                v-if="item.type === 'folder'"
                class="app-item folder-item"
                :class="{ 
                  'active': activeAppId === item.id,
                  'drag-target': dragTargetId === item.id,
                  'dragging': draggingItemId === item.id 
                }"
                @mousedown.stop="handleAppMouseDown($event, item)"
                @mouseup="handleAppMouseUp(item)"
                @mouseenter="handleMouseEnterItem(item)"
                @mouseleave="handleMouseLeaveItem(item)"
              >
                <div class="app-icon-container folder-icon-container">
                  <div class="folder-grid">
                    <img 
                      v-for="subItem in item.items.slice(0, 9)" 
                      :key="subItem.id" 
                      :src="subItem.icon" 
                      class="mini-icon"
                    >
                  </div>
                </div>
                <span class="app-name">{{ item.name }}</span>
              </div>

              <!-- Normal App Item -->
              <div 
                v-else
                class="app-item"
                :class="{ 
                  'active': activeAppId === item.id,
                  'drag-target': dragTargetId === item.id,
                  'dragging': draggingItemId === item.id
                }"
                @mousedown.stop="handleAppMouseDown($event, item)"
                @mouseup="handleAppMouseUp(item)"
                @mouseenter="handleMouseEnterItem(item)"
                @mouseleave="handleMouseLeaveItem(item)"
              >
                <div class="app-icon-container">
                  <img :src="item.icon" :alt="item.name" class="app-icon">
                </div>
                <span class="app-name">{{ item.name }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Pagination Dots -->
      <div class="pagination" v-if="paginatedApps.length > 1">
        <div 
          v-for="(_, index) in paginatedApps" 
          :key="index"
          class="dot" 
          :class="{ active: currentPage === index }"
          @click.stop="currentPage = index"
        ></div>
      </div>
    </div>

    <!-- Expanded Folder Overlay -->
    <Transition name="folder-expand">
      <div 
        v-if="expandedFolder" 
        class="folder-overlay" 
        @click.self.stop="closeFolder"
        @mouseup="handleFolderOverlayMouseUp"
      >
        <div class="folder-content">
          <input 
            v-model="expandedFolder.name" 
            class="folder-title-input" 
            @keydown.stop
            @click.stop
          />
          <div class="folder-apps-grid">
            <div 
              v-for="app in expandedFolder.items" 
              :key="app.id" 
              class="app-item"
              :class="{ 
                'dragging': draggingItemId === app.id,
                'drag-target': dragTargetId === app.id,
                'active': activeAppId === app.id
              }"
              @mousedown.stop="handleAppMouseDown($event, app)"
              @mouseup.stop="handleAppMouseUp(app)"
              @mouseenter="handleMouseEnterItem(app)"
              @mouseleave="handleMouseLeaveItem(app)"
            >
              <div class="app-icon-container">
                <img :src="app.icon" :alt="app.name" class="app-icon">
              </div>
              <span class="app-name">{{ app.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Ghost Item for Dragging -->
    <div 
      v-if="draggingItem"
      class="ghost-item"
      :style="ghostStyle"
    >
      <img v-if="draggingItem.type === 'app'" :src="draggingItem.icon" class="ghost-icon">
      <div v-else class="folder-icon-container" style="width: 100%; height: 100%">
         <div class="folder-grid">
            <img 
              v-for="subItem in draggingItem.items.slice(0, 9)" 
              :key="subItem.id" 
              :src="subItem.icon" 
              class="mini-icon"
            >
         </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { appsConfig } from '../config/apps'
import { CloudSyncAPI, AuthAPI } from '../api'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'open-app'])
const { t } = useI18n()
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const isClosing = ref(false)
const activeAppId = ref<string | null>(null)
const didDrag = ref(false)

interface AppItem {
  id: string
  name: string
  icon: string
  type: 'app'
}

interface FolderItem {
  id: string
  name: string
  type: 'folder'
  items: AppItem[]
}

type LaunchpadItem = AppItem | FolderItem

const STORAGE_KEY = 'macOS_launchpad_state'


// 解析国际化名称的辅助函数
function resolveName(key: string) {
  return key.split('.').reduce((o: any, k) => o?.[k], t) || key
}

// 合并本地存储的应用状态和默认配置
// 确保新添加的应用能显示，同时保留用户的自定义排序
function mergeApps(saved: LaunchpadItem[], defaults: LaunchpadItem[]): LaunchpadItem[] {
    const savedIds = new Set<string>()
    // 递归遍历已保存的结构，收集所有 App ID
    const traverse = (items: LaunchpadItem[]) => {
        items.forEach(item => {
            if (item.type === 'app') savedIds.add(item.id)
            if (item.type === 'folder') traverse(item.items)
        })
    }
    traverse(saved)
    
    // 找出配置中有但保存数据中没有的新应用
    const missing = defaults.filter(d => !savedIds.has(d.id))
    // 将新应用追加到末尾
    return [...saved, ...missing]
}

// 获取初始应用列表
function getInitialApps(): LaunchpadItem[] {
  // 从配置文件生成默认列表
  const defaultApps = appsConfig
    .filter(app => app.showInLaunchpad)
    .map(app => ({
      id: app.id,
      name: resolveName(app.nameKey),
      icon: app.icon, 
      type: 'app' as const
    }))

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const savedApps: LaunchpadItem[] = JSON.parse(saved)
      return mergeApps(savedApps, defaultApps)
    } catch (e) {
      console.error('Error parsing saved launchpad state', e)
    }
  }
  
  return defaultApps
}

const apps = ref<LaunchpadItem[]>(getInitialApps())

const saveToCloud = async (newVal: LaunchpadItem[]) => {
  if (!AuthAPI.isLoggedIn()) return
  try {
    await CloudSyncAPI.save(STORAGE_KEY, newVal)
  } catch (error) {
    console.error('Failed to sync to cloud:', error)
  }
}

watch(apps, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  saveToCloud(newVal)
}, { deep: true })

// 分页逻辑
const itemsPerPage = 35 
const currentPage = ref(0)
const isPageDragging = ref(false)
const startX = ref(0)
const pageDragOffset = ref(0)

// 拖拽逻辑状态
const draggingItemId = ref<string | null>(null)
const draggingItem = ref<LaunchpadItem | null>(null)
const draggingFromFolder = ref(false)
const dragTargetId = ref<string | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const ghostX = ref(0)
const ghostY = ref(0) // 拖拽时的幽灵图标位置

// 长按交互状态
const pressedItem = ref<LaunchpadItem | null>(null)
const pressTimer = ref<any>(null)
const pressStartX = ref(0)
const pressStartY = ref(0)

// Folder Expansion
const expandedFolderId = ref<string | null>(null)
const expandedFolder = computed(() => {
  if (!expandedFolderId.value) return null
  return apps.value.find(a => a.id === expandedFolderId.value && a.type === 'folder') as FolderItem | undefined
})

const ghostStyle = computed(() => ({
  left: `${ghostX.value}px`,
  top: `${ghostY.value}px`
}))

const filteredApps = computed(() => {
  if (!searchQuery.value) return apps.value
  return apps.value.filter(app => 
    app.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedApps = computed(() => {
  const result = []
  const allApps = filteredApps.value
  for (let i = 0; i < allApps.length; i += itemsPerPage) {
    result.push(allApps.slice(i, i + itemsPerPage))
  }
  while (result.length < 2) {
    result.push([])
  }
  return result
})

watch(() => props.show, (val) => {
  if (val) {
    currentPage.value = 0
    searchQuery.value = ''
    isClosing.value = false
    didDrag.value = false
    expandedFolderId.value = null
    cancelAppDrag()
    clearPressState()
  }
})

watch(searchQuery, () => {
  currentPage.value = 0
})

function handlePageMouseDown(e: MouseEvent) {
  if (paginatedApps.value.length <= 1) return
  isPageDragging.value = true
  startX.value = e.clientX
  pageDragOffset.value = 0
  didDrag.value = false
}

function handleAppMouseDown(e: MouseEvent, item: LaunchpadItem) {
  if (e.button !== 0) return
  e.preventDefault() 
  
  // Track press start
  pressedItem.value = item
  pressStartX.value = e.clientX
  pressStartY.value = e.clientY
  didDrag.value = false
  
  // Start Long Press timer
  pressTimer.value = setTimeout(() => {
    startDrag(item, e.clientX, e.clientY)
  }, 500)
}

function startDrag(item: LaunchpadItem, x: number, y: number) {
  if (draggingItemId.value) return 
  
  draggingItemId.value = item.id
  draggingItem.value = item
  draggingFromFolder.value = !!expandedFolderId.value
  
  ghostX.value = x
  ghostY.value = y
  
  didDrag.value = true // Ensure we treat this as a drag op from now on
}

function clearPressState() {
  if (pressTimer.value) {
    clearTimeout(pressTimer.value)
    pressTimer.value = null
  }
  pressedItem.value = null
}

function handleMouseEnterItem(item: LaunchpadItem) {
   if (draggingItemId.value && draggingItemId.value !== item.id) {
       dragTargetId.value = item.id
   }
}

function handleMouseLeaveItem(item: LaunchpadItem) {
   if (dragTargetId.value === item.id) {
       dragTargetId.value = null
   }
}


function handleMouseMove(e: MouseEvent) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY

  if (isPageDragging.value) {
    pageDragOffset.value = e.clientX - startX.value
    if (Math.abs(pageDragOffset.value) > 5) {
      didDrag.value = true
    }
  } else if (pressedItem.value && !draggingItemId.value) {
    // Check for drag start by movement
    const dx = e.clientX - pressStartX.value
    const dy = e.clientY - pressStartY.value
    const dist = Math.sqrt(dx*dx + dy*dy)
    
    // Increased threshold slightly to avoid sensitive jitters
    if (dist > 8) {
      clearTimeout(pressTimer.value)
      startDrag(pressedItem.value, e.clientX, e.clientY)
    }
  } else if (draggingItemId.value) {
    ghostX.value = e.clientX
    ghostY.value = e.clientY
  }
}

function handleAppMouseUp(targetItem: LaunchpadItem) {
  // Clear press state first (stops long press timer)
  clearPressState()

  // If no drag happened, treat as click
  if (!draggingItemId.value) {
      openApp(targetItem.id)
      return
  }
  
  if (draggingItemId.value === targetItem.id) {
      cancelAppDrag()
      return
  }
  
  // Merge Logic
  if (targetItem.type === 'app' && draggingItem.value?.type === 'app') {
    createFolder(targetItem, draggingItem.value as AppItem)
  } else if (targetItem.type === 'folder' && draggingItem.value?.type === 'app') {
    addToFolder(targetItem as FolderItem, draggingItem.value as AppItem)
  }
  
  cancelAppDrag()
}

function handleFolderOverlayMouseUp(e: MouseEvent) {
  // If we are dragging from folder and drop outside content...
  if (draggingFromFolder.value && draggingItem.value && draggingItemId.value) {
      const contentEl = document.querySelector('.folder-content');
      if (contentEl) {
          const rect = contentEl.getBoundingClientRect();
          const isOutside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
          
          if (isOutside) {
              moveAppOut(expandedFolderId.value!, draggingItem.value as AppItem);
          }
      }
  }
  
  // Also call cleanup
  handleMouseUp()
}

function moveAppOut(folderId: string, item: AppItem) {
  const folderIndex = apps.value.findIndex(a => a.id === folderId)
  if (folderIndex === -1) return
  
  const folder = apps.value[folderIndex] as FolderItem
  const itemIndex = folder.items.findIndex(a => a.id === item.id)
  
  if (itemIndex !== -1) {
    // Remove from folder
    folder.items.splice(itemIndex, 1)
    
    // Add to main apps (append for now, or insert after folder)
    apps.value.splice(folderIndex + 1, 0, item)
    
    // Check folder size
    if (folder.items.length === 0) {
      apps.value.splice(folderIndex, 1) // Remove folder
      expandedFolderId.value = null // Close view
    } else if (folder.items.length === 1) {
       // Ideally trigger dissolve animation or convert, but for now keep as is or just move out logic 
    }
  }
}

function createFolder(target: AppItem, source: AppItem) {
  const newFolder: FolderItem = {
    id: `folder-${Date.now()}`,
    name: 'Folder',
    type: 'folder',
    items: [target, source]
  }
  
  const targetIndex = apps.value.findIndex(a => a.id === target.id)
  if (targetIndex !== -1) {
    apps.value[targetIndex] = newFolder
    
    const sourceIndex = apps.value.findIndex(a => a.id === source.id)
    if (sourceIndex !== -1) {
      apps.value.splice(sourceIndex, 1)
    }
    
    // Do not open the new folder immediately (user preference)
    // expandedFolderId.value = newFolder.id
  }
}

function addToFolder(folder: FolderItem, source: AppItem) {
  // We need to mutate the actual folder object in the array
  const actualFolder = apps.value.find(a => a.id === folder.id) as FolderItem
  if (actualFolder) {
      actualFolder.items.push(source)
      const sourceIndex = apps.value.findIndex(a => a.id === source.id)
      if (sourceIndex !== -1) {
        apps.value.splice(sourceIndex, 1)
      }
  }
}

function handleMouseUp() {
  clearPressState()
  
  if (isPageDragging.value) {
     const threshold = window.innerWidth * 0.15 
      if (Math.abs(pageDragOffset.value) > threshold) {
        if (pageDragOffset.value > 0 && currentPage.value > 0) {
          currentPage.value--
        } else if (pageDragOffset.value < 0 && currentPage.value < paginatedApps.value.length - 1) {
          currentPage.value++
        }
      }
      isPageDragging.value = false
      pageDragOffset.value = 0
  }
  
  if (draggingItemId.value) {
    cancelAppDrag()
  }
}

function cancelAppDrag() {
  draggingItemId.value = null
  draggingItem.value = null
  dragTargetId.value = null
}

function handleBackgroundClick(_: MouseEvent) {
  // We check didDrag to avoid closing when a drag just finished (though handleMouseUp should clear it)
  // Wait, didDrag is set on movement. If we clicked, didDrag is false.
  
  // Also check if we just clicked on background
  if (!didDrag.value && !isClosing.value && !draggingItemId.value && !expandedFolderId.value) {
    emit('close')
  }
}

function closeFolder() {
  expandedFolderId.value = null
}

function openApp(appId: string) {
  const item = apps.value.find(a => a.id === appId)
  
  if (item && item.type === 'folder') {
     expandedFolderId.value = appId
     return
  }

  // Check if it's inside a folder (handled by view usually, but if we have id...)
  // But wait, dropped apps are removed from top level. 
  // If we click inside folder, the click handler there calls openApp directly with app ID.
  // So we just emit.
  
  if (isClosing.value || Math.abs(pageDragOffset.value) > 5 || didDrag.value) return
  
  activeAppId.value = appId
  isClosing.value = true
  
  setTimeout(() => {
    emit('open-app', appId)
  }, 150)
}

onMounted(() => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
})
</script>

<style scoped>
.launchpad {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
  user-select: none;
}

.launchpad.closing {
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  pointer-events: none;
}

.launchpad.closing .app-item.active {
  opacity: 1;
  transform: scale(2.5);
  filter: none;
  z-index: 100 !important;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.launchpad.closing .app-item.active .app-name {
  opacity: 0;
  transition: opacity 0.1s ease;
}

.launchpad.closing .app-item:not(.active),
.launchpad.closing .search-container,
.launchpad.closing .pagination {
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.2s ease;
}

.launchpad-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: filter 0.3s ease;
}

.launchpad-content.blur-content {
  filter: blur(10px) brightness(0.8);
  pointer-events: none; /* Prevent clicks on background apps when folder is open */
}

.pages-container {
  display: flex;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.pages-container.transitioning {
  transition: transform 0.4s cubic-bezier(0.2, 0, 0.2, 1);
}

.apps-page {
  min-width: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0 40px;
}

.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-shrink: 0;
  z-index: 10;
}

.search-box {
  position: relative;
  width: 240px;
  height: 36px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.search-box input {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0 10px 0 32px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-box input:focus {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: max-content;
  gap: 32px 20px;
  width: 100%;
  max-width: 1100px;
  padding-top: 20px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  position: relative; /* Context for z-index */
  z-index: 1;
}

/* Dim item when dragging */
.app-item.dragging {
  opacity: 0.3;
}

.app-item.drag-target {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.app-item:active {
  transform: scale(0.95);
  filter: brightness(0.8);
}

.app-icon-container {
  width: 80px;
  height: 80px;
  transition: transform 0.2s;
}

.folder-icon-container {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 13px; /* Adjusted padding */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  width: 100%;
  height: 100%;
}

.mini-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.app-name {
  color: white;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Ghost Item Styles */
.ghost-item {
  position: fixed;
  width: 80px;
  height: 80px;
  pointer-events: none;
  z-index: 100000;
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 0.9;
}

.ghost-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pagination {
  position: absolute;
  bottom: 30px;
  display: flex;
  gap: 12px;
  z-index: 10;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.5);
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

/* Folder Overlay */
.folder-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.folder-content {
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(30px);
  border-radius: 30px;
  padding: 30px 40px;
  width: 80vw;
  max-width: 1100px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
}

.folder-title-input {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  outline: none;
}

.folder-apps-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 32px 20px;
  width: 100%;
  justify-items: center;
}

.folder-expand-enter-active,
.folder-expand-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0, 0.2, 1);
}

.folder-expand-enter-from,
.folder-expand-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
  }
}
</style>
