<template>
  <div class="finder-app">
    <!-- Finder Toolbar -->
    <div class="finder-toolbar">
      <div class="toolbar-controls">
        <button class="nav-btn" :disabled="!canGoBack" @click="goBack">◀</button>
        <button class="nav-btn" :disabled="!canGoForward" @click="goForward">▶</button>
      </div>
      
      <div class="toolbar-path">
        <span 
          v-for="(crumb, index) in breadcrumbs" 
          :key="index" 
          class="path-item"
        >
          {{ crumb }}
          <span v-if="index < breadcrumbs.length - 1" class="path-separator">▶</span>
        </span>
      </div>
      
      <div class="toolbar-actions">
        <!-- 上传按钮 -->
        <button 
          class="macos-btn upload-btn" 
          :disabled="!isLoggedIn"
          @click="openUploadDialog"
          :title="isLoggedIn ? '上传文件' : '上传文件 (暂无权限)'"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1 L6 8 M3 4 L6 1 L9 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="1" y="9" width="10" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>
        
        <!-- 图标大小控制 (仅在网格视图下显示) -->
        <div v-if="viewMode === 'grid'" class="icon-size-group">
          <button 
            class="macos-btn size-btn" 
            :class="{ active: iconSize === 'small' }"
            @click="iconSize = 'small'"
            title="小图标"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="2" height="2" rx="0.5"/>
              <rect x="5" y="1" width="2" height="2" rx="0.5"/>
              <rect x="9" y="1" width="2" height="2" rx="0.5"/>
              <rect x="1" y="5" width="2" height="2" rx="0.5"/>
              <rect x="5" y="5" width="2" height="2" rx="0.5"/>
              <rect x="9" y="5" width="2" height="2" rx="0.5"/>
              <rect x="1" y="9" width="2" height="2" rx="0.5"/>
              <rect x="5" y="9" width="2" height="2" rx="0.5"/>
              <rect x="9" y="9" width="2" height="2" rx="0.5"/>
            </svg>
          </button>
          <button 
            class="macos-btn size-btn" 
            :class="{ active: iconSize === 'medium' }"
            @click="iconSize = 'medium'"
            title="中图标"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0.5" y="0.5" width="3" height="3" rx="0.5"/>
              <rect x="4.5" y="0.5" width="3" height="3" rx="0.5"/>
              <rect x="8.5" y="0.5" width="3" height="3" rx="0.5"/>
              <rect x="0.5" y="4.5" width="3" height="3" rx="0.5"/>
              <rect x="4.5" y="4.5" width="3" height="3" rx="0.5"/>
              <rect x="8.5" y="4.5" width="3" height="3" rx="0.5"/>
              <rect x="0.5" y="8.5" width="3" height="3" rx="0.5"/>
              <rect x="4.5" y="8.5" width="3" height="3" rx="0.5"/>
              <rect x="8.5" y="8.5" width="3" height="3" rx="0.5"/>
            </svg>
          </button>
          <button 
            class="macos-btn size-btn" 
            :class="{ active: iconSize === 'large' }"
            @click="iconSize = 'large'"
            title="大图标"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="4" height="4" rx="1"/>
              <rect x="7" y="1" width="4" height="4" rx="1"/>
              <rect x="1" y="7" width="4" height="4" rx="1"/>
              <rect x="7" y="7" width="4" height="4" rx="1"/>
            </svg>
          </button>
        </div>
        
        <div class="view-group">
          <button 
            class="macos-btn view-btn" 
            :class="{ active: viewMode === 'grid' }" 
            @click="viewMode = 'grid'"
            title="网格视图"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="2.5" height="2.5" rx="0.5"/>
              <rect x="4.75" y="1" width="2.5" height="2.5" rx="0.5"/>
              <rect x="8.5" y="1" width="2.5" height="2.5" rx="0.5"/>
              <rect x="1" y="4.75" width="2.5" height="2.5" rx="0.5"/>
              <rect x="4.75" y="4.75" width="2.5" height="2.5" rx="0.5"/>
              <rect x="8.5" y="4.75" width="2.5" height="2.5" rx="0.5"/>
              <rect x="1" y="8.5" width="2.5" height="2.5" rx="0.5"/>
              <rect x="4.75" y="8.5" width="2.5" height="2.5" rx="0.5"/>
              <rect x="8.5" y="8.5" width="2.5" height="2.5" rx="0.5"/>
            </svg>
          </button>
          <button 
            class="macos-btn view-btn" 
            :class="{ active: viewMode === 'list' }" 
            @click="viewMode = 'list'"
            title="列表视图"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1.5" width="10" height="1" rx="0.5"/>
              <rect x="1" y="4" width="10" height="1" rx="0.5"/>
              <rect x="1" y="6.5" width="10" height="1" rx="0.5"/>
              <rect x="1" y="9" width="10" height="1" rx="0.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="finder-body">
      <!-- Sidebar -->
      <div class="finder-sidebar">
        <div class="sidebar-section">
          <div class="section-title">Favorites</div>
          <div
            v-for="fav in favorites"
            :key="fav.id"
            class="sidebar-item"
            :class="{ active: currentFolder === fav.id }"
            @click="navigateToFolder(fav.id)"
          >
            <span class="item-icon" v-html="fav.icon"></span>
            <span class="item-label">{{ fav.name }}</span>
          </div>
        </div>
        
        <!-- <div class="sidebar-section">
          <div class="section-title">iCloud</div>
          <div class="sidebar-item">
            <span class="item-icon">☁️</span>
            <span class="item-label">iCloud Drive</span>
          </div>
        </div> -->
        
        <!-- <div class="sidebar-section">
          <div class="section-title">Tags</div>
          <div v-for="tag in tags" :key="tag" class="sidebar-item tag-item">
            <span class="tag-dot" :style="{ background: getTagColor(tag) }"></span>
            <span class="item-label">{{ tag }}</span>
          </div>
        </div> -->
      </div>
      
      <!-- Main Content Area -->
      <div 
        class="finder-content" 
        @contextmenu="handleEmptyAreaContextMenu"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- 拖拽上传提示遮罩 -->
        <div v-if="isDragging" class="drag-overlay" :class="{ 'overlay-forbidden': !canUpload }">
          <div class="drag-content">
            <template v-if="canUpload">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 8v24M14 18l10-10 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="8" y="36" width="32" height="4" rx="2" fill="currentColor"/>
              </svg>
              <span>释放以上传到当前文件夹</span>
            </template>
            <template v-else>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>暂无权限，请登录</span>
            </template>
          </div>
        </div>
        <div v-if="isLoading" class="state-container">
          <div class="loading-spinner"></div>
          <div>Loading...</div>
        </div>
        <div v-else-if="error" class="state-container error">
          <div>⚠️ {{ error }}</div>
        </div>
        
        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid-view" :class="`size-${iconSize}`">
          <div
            v-for="item in currentItems"
            :key="item.id"
            class="grid-item"
            @dblclick="handleItemDoubleClick(item)"
            @contextmenu="(e) => handleItemContextMenu(e, item)"
          >
            <div class="grid-item-icon">
              <!-- 图片文件显示缩略图 -->
              <template v-if="isImageFile(item.name)">
                <img 
                  :src="getImageUrl(item.path)"
                  :alt="item.name"
                  class="image-preview"
                  @error="handleImageError($event, item)"
                  draggable="false"
                />
              </template>
              <!-- 视频文件预览 -->
              <template v-else-if="isVideoFile(item.name)">
                <div class="video-preview-wrapper">
                  <video 
                    :src="getImageUrl(item.path)"
                    class="image-preview"
                    preload="metadata"
                    draggable="false"
                    @error="handleImageError($event, item)"
                    @loadeddata="(e: Event) => (e.target as HTMLVideoElement).currentTime = 0.1"
                  ></video>
                  <div class="play-overlay">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </template>
              <!-- 其他文件显示图标 -->
              <div v-else v-html="item.icon"></div>
            </div>
            <div class="grid-item-name" :title="item.name">{{ truncateFileName(item.name) }}</div>
          </div>
        </div>
        
        <!-- List View -->
        <div v-else class="list-view">
          <table class="list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date Modified</th>
                <th>Size</th>
                <th>Kind</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in currentItems"
                :key="item.id"
                @dblclick="handleItemDoubleClick(item)"
                @contextmenu="(e) => handleItemContextMenu(e, item)"
              >
                <td>
                  <span class="list-icon" v-html="item.icon"></span>
                  {{ item.name }}
                </td>
                <td>{{ item.modified }}</td>
                <td>{{ item.size }}</td>
                <td>{{ item.kind }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Finder 状态栏 -->
    <div class="finder-statusbar">
      <span>{{ currentItems.length }} 个项目</span>
    </div>
    
    <!-- 上传对话框 -->
    <div v-if="showUploadDialog" class="upload-overlay" @click="closeUploadDialog">
      <div class="upload-dialog" @click.stop>
        <div class="upload-header">
          <h3>上传文件</h3>
          <button class="close-btn" @click="closeUploadDialog">×</button>
        </div>
        
        <div class="upload-body">
          <div class="upload-drop-zone" @click="selectFiles">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 8v24M14 18l10-10 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="8" y="36" width="32" height="4" rx="2" fill="currentColor"/>
            </svg>
            <div class="upload-text">点击选择文件</div>
            <div class="upload-hint">支持多文件上传</div>
          </div>
          
          <div v-if="selectedFiles.length > 0" class="selected-files">
            <h4>已选择 {{ selectedFiles.length }} 个文件</h4>
            <div class="file-list">
              <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                <div class="file-info">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-size">{{ formatFileSize(file.size) }}</div>
                </div>
                <button class="remove-btn" @click="removeFile(index)">×</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="upload-footer">
          <button class="btn-secondary" @click="closeUploadDialog">取消</button>
          <button 
            class="btn-primary" 
            :disabled="selectedFiles.length === 0 || isUploading"
            @click="startUpload"
          >
            {{ isUploading ? '上传中...' : `上传 ${selectedFiles.length} 个文件` }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <ContextMenu ref="contextMenuRef" :items="contextMenuItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import { FileAPI, AuthAPI } from '../../api'
import * as Icons from '../../utils/iconHelpers'
import ContextMenu, { type MenuItem } from '../ContextMenu.vue'

interface FileItem {
  id: string
  name: string
  icon: string
  type: 'file' | 'folder'
  modified: string
  size: string
  kind: string
  path: string
}

interface FavoriteItem {
  id: string
  name: string
  icon: string
  path: string
}

const props = defineProps<{
  path?: string
}>()

const openApp = inject('openApp') as (appId: string, props?: any) => void

const viewMode = ref<'grid' | 'list'>('grid')
const iconSize = ref<'small' | 'medium' | 'large'>('medium')
const currentFolder = ref(localStorage.getItem('finder_current_folder') || '')
const currentPath = ref('macos_web/')
const isLoading = ref(false)
const error = ref<string | null>(null)
const canGoBack = ref(false)
const canGoForward = ref(false)

// 导航历史
const navigationHistory = ref<string[]>([])
const currentHistoryIndex = ref(-1)

// 登录状态
const isLoggedIn = ref(false)

// 上传相关
const showUploadDialog = ref(false)
const selectedFiles = ref<File[]>([])
const isUploading = ref(false)

// 拖拽相关
const isDragging = ref(false)
const canUpload = ref(false)

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  if (!isLoggedIn.value) {
     canUpload.value = false
     if (event.dataTransfer) {
       event.dataTransfer.dropEffect = 'none'
     }
     isDragging.value = true
     return
  }
  canUpload.value = true
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  if (event.relatedTarget === null || (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node) === false) {
    isDragging.value = false
  }
}

async function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  
  if (!isLoggedIn.value) {
    return
  }
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    await uploadDroppedFiles(Array.from(files))
  }
}

async function uploadDroppedFiles(files: File[]) {
  isLoading.value = true
  try {
    for (const file of files) {
      try {
        await FileAPI.uploadFile(file, currentPath.value)
      } catch (error) {
        console.error(`文件 ${file.name} 上传失败:`, error)
      }
    }
    await fetchFiles(currentPath.value)
  } catch (error) {
    console.error('批量上传过程出错:', error)
  } finally {
    isLoading.value = false
  }
}

// 右键菜单相关
const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null)
const contextMenuItems = ref<MenuItem[]>([])
const contextMenuTarget = ref<FileItem | null>(null)

// 排序相关
const sortBy = ref<'name' | 'time' | 'size'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Persist current folder selection
watch(currentFolder, (newVal) => {
  if (newVal) {
    localStorage.setItem('finder_current_folder', newVal)
  }
})

// Initial favorites state (empty)
const favorites = ref<FavoriteItem[]>([])



// Store items for current view
const currentItems = ref<FileItem[]>([])

const breadcrumbs = computed(() => {
  if (currentPath.value === 'macos_web/') return ['Home']
  
  const parts = currentPath.value.split('/').filter(p => p && p !== 'macos_web')
  // Map first part to favorite name if possible
  if (parts.length > 0) {
      const firstPart = parts[0] || ''
      const fav = favorites.value.find(f => f.path.includes(firstPart))
      if (fav && parts.length === 1) return [fav.name]
      if (fav) {
          return [fav.name, ...parts.slice(1)]
      }
  }
  return parts
})

async function loadSidebarDirectories() {
    try {
        const data = await FileAPI.getData('macos_web/')
        const dirs: FavoriteItem[] = []
        
        if (data.CommonPrefixes) {
            data.CommonPrefixes.forEach((folder) => {
                const folderName = folder.Prefix.split('/').filter(Boolean).pop()
                if (!folderName || folderName.startsWith('.') || folderName === '_#') return
                
                dirs.push({
                    id: generateDirectoryId(folderName),
                    name: folderName,
                    icon: getDirectoryIcon(folderName),
                    path: folder.Prefix
                })
            })
        }
        favorites.value = dirs
        
        // Handle selection persistence and defaults
        if (favorites.value.length > 0) {
            let targetId = currentFolder.value
            
            // Check if validated
            const exists = favorites.value.some(f => f.id === targetId)
            
            if (!exists) {
                // Default to first item if explicitly requested or if persisted value is invalid
                const firstFav = favorites.value[0]
                if (firstFav) {
                  targetId = firstFav.id
                } else {
                  targetId = 'desktop'
                }
            }
            
            navigateToFolder(targetId)
        } else {
             // Fallback if no specific logic needed
             navigateToFolder('desktop')
        }

    } catch (e) {
        console.error("Failed to load sidebar", e)
        // Fallback
        favorites.value = [
            { id: 'desktop', name: '桌面', icon: Icons.createDesktopIcon(), path: 'macos_web/desktop/' }
        ]
        navigateToFolder('desktop')
    }
}

function generateDirectoryId(folderName: string): string {
    const idMap: Record<string, string> = {
    '桌面': 'desktop',
    '文档': 'documents', 
    '文稿': 'documents',
    '下载': 'downloads',
    '图库': 'pictures',
    '音乐': 'music',
    '影片': 'movies',
    '视频': 'movies'
    }
    return idMap[folderName] || folderName.toLowerCase().replace(/\s+/g, '_')
}

function getDirectoryIcon(folderName: string): string {
    const iconMap: Record<string, () => string> = {
    '桌面': Icons.createDesktopIcon,
    '文档': Icons.createDocumentsIcon,
    '文稿': Icons.createDocumentsIcon, 
    '下载': Icons.createDownloadsIcon,
    '图库': Icons.createPicturesIcon,
    '音乐': Icons.createMusicIcon,
    '影片': Icons.createMoviesIcon,
    '视频': Icons.createMoviesIcon,
    '应用程序': Icons.createApplicationsIcon,
    '系统': Icons.createSystemIcon,
    '用户': Icons.createUserIcon
    }
    const iconFunc = iconMap[folderName] || Icons.createFolderIcon
    return iconFunc()
}

async function fetchFiles(path: string) {
  isLoading.value = true
  error.value = null
  currentItems.value = []
  
  try {
    const data = await FileAPI.getData(path)
    
    const items: FileItem[] = []
    
    // Process Folders
    if (data.CommonPrefixes) {
      data.CommonPrefixes.forEach((folder, index) => {
        const name = folder.Prefix.split('/').filter(Boolean).pop() || ''
        if (name === '_#') return // Skip special folders
        
        items.push({
          id: `folder-${index}`,
          name: name,
          icon: Icons.createFolderIcon(),
          type: 'folder',
          modified: '--',
          size: '--',
          kind: 'Folder',
          path: folder.Prefix
        })
      })
    }

    // Process Files
    if (data.Contents) {
      data.Contents.forEach((file, index) => {
        if (file.Key.endsWith('/')) return
        
        const name = file.Key.split('/').filter(Boolean).pop() || ''
        if (!name || name.startsWith('.') || name.endsWith('_#')) return

        items.push({
          id: `file-${index}`,
          name: name,
          icon: getFileIcon(name),
          type: 'file',
          modified: formatDate(file.LastModified),
          size: formatSize(file.Size),
          kind: getFileKind(name),
          path: file.Key
        })
      })
    }
    
    currentItems.value = items
    // 应用当前的排序设置
    sortItems()
  } catch (e: any) {
    console.error('Failed to fetch files:', e)
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

function addToHistory(path: string) {
  // 如果当前不在历史的末尾,删除前进历史
  if (currentHistoryIndex.value < navigationHistory.value.length - 1) {
    navigationHistory.value = navigationHistory.value.slice(0, currentHistoryIndex.value + 1)
  }
  
  // 添加新的历史项
  navigationHistory.value.push(path)
  currentHistoryIndex.value = navigationHistory.value.length - 1
  
  // 更新按钮状态
  updateNavigationButtons()
}

function updateNavigationButtons() {
  canGoBack.value = currentHistoryIndex.value > 0
  canGoForward.value = currentHistoryIndex.value < navigationHistory.value.length - 1
}

function navigateToFolder(folderId: string, addHistory: boolean = true) {
  currentFolder.value = folderId
  const fav = favorites.value.find(f => f.id === folderId)
  if (fav) {
    currentPath.value = fav.path
    if (addHistory) {
      addToHistory(fav.path)
    }
    fetchFiles(fav.path)
  }
}

function goBack() {
  if (canGoBack.value && currentHistoryIndex.value > 0) {
    currentHistoryIndex.value--
    const path = navigationHistory.value[currentHistoryIndex.value]
    if (path) {
      currentPath.value = path
    }
    
    // 找到对应的文件夹ID
    const fav = favorites.value.find(f => f.path === path)
    if (fav) {
      currentFolder.value = fav.id
    }
    
    if (path) {
      fetchFiles(path)
    }
    updateNavigationButtons()
  }
}

function goForward() {
  if (canGoForward.value && currentHistoryIndex.value < navigationHistory.value.length - 1) {
    currentHistoryIndex.value++
    const path = navigationHistory.value[currentHistoryIndex.value]
    if (path) {
      currentPath.value = path
    }
    
    // 找到对应的文件夹ID
    const fav = favorites.value.find(f => f.path === path)
    if (fav) {
      currentFolder.value = fav.id
    }
    
    if (path) {
        fetchFiles(path)
    }
    updateNavigationButtons()
  }
}

function handleItemDoubleClick(item: FileItem) {
  if (item.type === 'folder') {
    currentPath.value = item.path
    addToHistory(item.path)
    fetchFiles(item.path)
  } else {
    // 图片/视频文件用 Preview 打开
    if (isImageFile(item.name) || isVideoFile(item.name)) {
      const mediaList = currentItems.value
        .filter(i => i.type === 'file' && (isImageFile(i.name) || isVideoFile(i.name)))
        .map(i => ({
          name: i.name,
          path: i.path,
          url: getImageUrl(i.path),
          size: i.size,
          date: i.modified
        }))

      openApp('preview', { 
        path: item.path, 
        name: item.name,
        url: getImageUrl(item.path),
        list: mediaList
      })
    } 
    // 可编辑的文本文件用 VSCode 打开
    else if (isEditableFile(item.name)) {
      openApp('vscode', {
        filePath: item.path,
        fileName: item.name
      })
    } 
    // 其他文件类型暂不处理
    else {
      console.log('Open file:', item.name)
    }
  }
}

// 判断是否为可编辑的文本文件
function isEditableFile(fileName: string): boolean {
  const editableExtensions = [
    // 文本文件
    'txt', 'md', 'markdown',
    // 代码文件
    'js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss', 'less', 'sass',
    'json', 'xml', 'yaml', 'yml',
    // 配置文件
    'conf', 'config', 'ini', 'env',
    // 编程语言
    'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt',
    // Shell 脚本
    'sh', 'bash', 'zsh', 'fish',
    // 其他
    'sql', 'log', 'csv'
  ]
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? editableExtensions.includes(ext) : false
}



// Helper functions (simplified versions of logic in reference file)
function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const iconMap: Record<string, () => string> = {
    txt: Icons.createTextIcon,
    doc: Icons.createWordIcon,
    docx: Icons.createWordIcon,
    pdf: Icons.createPdfIcon,
    xls: Icons.createExcelIcon,
    xlsx: Icons.createExcelIcon,
    csv: Icons.createExcelIcon,
    ppt: Icons.createWordIcon,
    pptx: Icons.createWordIcon,
    jpg: Icons.createImageIcon,
    jpeg: Icons.createImageIcon,
    png: Icons.createImageIcon,
    gif: Icons.createImageIcon,
    svg: Icons.createImageIcon,
    mp3: Icons.createAudioIcon,
    mp4: Icons.createVideoIcon,
    avi: Icons.createVideoIcon,
    mov: Icons.createVideoIcon,
    zip: Icons.createArchiveIcon,
    rar: Icons.createArchiveIcon,
    '7z': Icons.createArchiveIcon,
    js: Icons.createCodeIcon,
    ts: Icons.createCodeIcon,
    vue: Icons.createCodeIcon,
    html: Icons.createCodeIcon,
    css: Icons.createCodeIcon,
    json: Icons.createCodeIcon,
  }
  const iconFunc = iconMap[ext] || Icons.createGenericIcon
  return iconFunc()
}

function getFileKind(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  return ext.toUpperCase() + ' File'
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 判断是否为图片文件
function isImageFile(fileName: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff']
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? imageExtensions.includes(ext) : false
}

function isVideoFile(fileName: string): boolean {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? videoExtensions.includes(ext) : false
}

// 获取图片URL
function getImageUrl(filePath: string): string {
  return FileAPI.getImageUrl(filePath)
}

// 处理图片加载错误
function handleImageError(event: Event, item: FileItem): void {
  console.log('图片加载失败:', item.name, getImageUrl(item.path))
  // 图片加载失败时,隐藏图片元素
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// 截断文件名,保留前缀和后缀(最多15个字符)
function truncateFileName(fileName: string, maxLength: number = 15): string {
  if (fileName.length <= maxLength) {
    return fileName
  }
  
  // 分离文件名和扩展名
  const lastDotIndex = fileName.lastIndexOf('.')
  
  // 如果没有扩展名或扩展名在开头(隐藏文件)
  if (lastDotIndex <= 0) {
    // 直接截断
    return fileName.substring(0, maxLength - 3) + '...'
  }
  
  const name = fileName.substring(0, lastDotIndex)
  const ext = fileName.substring(lastDotIndex) // 包括点号
  
  // 如果扩展名太长,直接截断整个文件名
  if (ext.length >= maxLength - 3) {
    return fileName.substring(0, maxLength - 3) + '...'
  }
  
  // 计算可用于文件名的字符数(保留扩展名和省略号)
  const availableLength = maxLength - ext.length - 3 // 3 是省略号的长度
  
  if (availableLength <= 0) {
    return '...' + ext
  }
  
  // 截取文件名前缀 + ... + 扩展名
  return name.substring(0, availableLength) + '...' + ext
}

// 打开上传对话框
function openUploadDialog() {
  showUploadDialog.value = true
  selectedFiles.value = []
}

// 关闭上传对话框
function closeUploadDialog() {
  showUploadDialog.value = false
  selectedFiles.value = []
  isUploading.value = false
}

// 选择文件
function selectFiles() {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement
    if (target.files) {
      selectedFiles.value = Array.from(target.files)
    }
  }
  input.click()
}

// 开始上传
async function startUpload() {
  if (selectedFiles.value.length === 0) return
  
  isUploading.value = true
  
  try {
    // 逐个上传文件
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]
      if (!file) continue
      
      console.log(`上传文件 ${i + 1}/${selectedFiles.value.length}:`, file.name)
      
      try {
        await FileAPI.uploadFile(file, currentPath.value)
        console.log(`文件 ${file.name} 上传成功`)
      } catch (error) {
        console.error(`文件 ${file.name} 上传失败:`, error)
        throw new Error(`文件 ${file.name} 上传失败`)
      }
    }
    
    // 所有文件上传成功后刷新文件列表
    await fetchFiles(currentPath.value)
    closeUploadDialog()
  } catch (e: any) {
    console.error('上传失败:', e)
  } finally {
    isUploading.value = false
  }
}

// 移除选中的文件
function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 复制文件链接
async function copyLink(item: FileItem) {
  const url = getImageUrl(item.path)
  try {
    await navigator.clipboard.writeText(url)
    // 可以添加一个提示
    console.log('链接已复制:', url)
  } catch (err) {
    console.error('复制链接失败:', err)
  }
}

// 下载文件
async function downloadFile(item: FileItem) {
  try {
    const url = getImageUrl(item.path)
    const response = await fetch(url)
    if (!response.ok) throw new Error('下载失败')
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = item.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  } catch (e) {
    console.error('下载出错:', e)
    // 降级处理:直接打开链接
    window.open(getImageUrl(item.path), '_blank')
  }
}

// 处理文件/文件夹右键菜单
function handleItemContextMenu(event: MouseEvent, item: FileItem) {
  event.preventDefault()
  event.stopPropagation()
  
  contextMenuTarget.value = item
  
  const isLoggedIn = AuthAPI.isLoggedIn()
  
  if (item.type === 'folder') {
    // 文件夹右键菜单
    contextMenuItems.value = [
      { label: '打开', action: () => handleItemDoubleClick(item) },
      { divider: true },
      // { label: '重命名', action: () => console.log('重命名', item.name) },
      // { label: '复制', action: () => console.log('复制', item.name) },
      // { divider: true },
      { 
        label: isLoggedIn ? '删除' : '删除 (暂无权限)', 
        disabled: !isLoggedIn,
        action: () => deleteItem(item) 
      },
      { divider: true },
      { label: '显示简介', action: () => console.log('显示简介', item.name) }
    ]
  } else {
    // 文件右键菜单
    contextMenuItems.value = [
      { label: '打开', action: () => handleItemDoubleClick(item) },
      // { label: '打开方式', action: () => console.log('打开方式', item.name) },
      { divider: true },
      { label: '复制链接', action: () => copyLink(item) },
      { label: '下载', action: () => downloadFile(item) },
      { divider: true },
      // { label: '重命名', action: () => console.log('重命名', item.name) },
      // { label: '复制', action: () => console.log('复制', item.name) },
      // { divider: true },
      { 
        label: isLoggedIn ? '删除' : '删除 (暂无权限)', 
        disabled: !isLoggedIn,
        action: () => deleteItem(item) 
      },
      { divider: true },
      { label: '显示简介', action: () => console.log('显示简介', item.name) }
    ]
  }
  
  contextMenuRef.value?.show(event)
}

// 删除文件/文件夹
async function deleteItem(item: FileItem) {
  const confirmDelete = confirm(`确定要删除 "${item.name}" 吗?`)
  
  if (!confirmDelete) {
    return
  }
  
  try {
    await FileAPI.deleteFile(item.path)
    
    // 刷新当前目录
    await fetchFiles(currentPath.value)
  } catch (error: any) {
    console.error('删除失败:', error)
    alert(error.message || '删除失败')
  }
}

// 处理空白区域右键菜单
function handleEmptyAreaContextMenu(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  contextMenuTarget.value = null
  
  const isLoggedIn = AuthAPI.isLoggedIn()

  // 空白区域右键菜单
  contextMenuItems.value = [
    { 
      label: isLoggedIn ? '新建文件夹' : '新建文件夹 (暂无权限)', 
      disabled: !isLoggedIn,
      action: createNewFolder 
    },
    { divider: true },
    { label: '刷新', action: () => fetchFiles(currentPath.value) },
    { divider: true },
    { 
      label: isLoggedIn ? '上传文件' : '上传文件 (暂无权限)', 
      disabled: !isLoggedIn,
      action: openUploadDialog 
    },
    { divider: true },
    { label: sortOrder.value === 'asc' ? '正序 ✓' : '正序', action: () => setSortOrder('asc') },
    { label: sortOrder.value === 'desc' ? '倒序 ✓' : '倒序', action: () => setSortOrder('desc') },

  ]
  
  contextMenuRef.value?.show(event)
}

// 设置排序方式


// 设置排序顺序
function setSortOrder(order: 'asc' | 'desc') {
  sortOrder.value = order
  sortItems()
}

// 排序items
function sortItems() {
  const items = [...currentItems.value]
  
  items.sort((a, b) => {
    // 首先按类型排序:文件夹在前,文件在后
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    
    // 同类型再按选定的方式排序
    let comparison = 0
    
    if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy.value === 'time') {
      const timeA = a.modified === '--' ? 0 : new Date(a.modified).getTime()
      const timeB = b.modified === '--' ? 0 : new Date(b.modified).getTime()
      comparison = timeA - timeB
    } else if (sortBy.value === 'size') {
      const sizeA = a.size === '--' ? 0 : parseSizeToBytes(a.size)
      const sizeB = b.size === '--' ? 0 : parseSizeToBytes(b.size)
      comparison = sizeA - sizeB
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  currentItems.value = items
}

// 将文件大小字符串转换为字节数
function parseSizeToBytes(sizeStr: string): number {
  if (sizeStr === '--') return 0
  const units: Record<string, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024
  }
  const match = sizeStr.match(/^([\d.]+)\s*(\w+)$/)
  if (!match || !match[1] || !match[2]) return 0
  const value = parseFloat(match[1])
  const unit = match[2]
  return value * (units[unit] || 1)
}

// 创建新文件夹
async function createNewFolder() {
  const folderName = prompt('请输入文件夹名称:', '新建文件夹')
  
  if (!folderName || !folderName.trim()) {
    return
  }
  
  try {
    let finalFolderName = folderName.trim()
    
    // 检查是否重名
    const existingNames = currentItems.value
      .filter(item => item.type === 'folder')
      .map(item => item.name)
    
    // 如果重名,添加数字后缀
    if (existingNames.includes(finalFolderName)) {
      let counter = 1
      while (existingNames.includes(`${finalFolderName}(${counter})`)) {
        counter++
      }
      finalFolderName = `${finalFolderName}(${counter})`
    }
    
    const folderPath = `${currentPath.value}${finalFolderName}/`
    await FileAPI.createFolder(folderPath)
    
    // 刷新当前目录
    await fetchFiles(currentPath.value)
  } catch (error: any) {
    console.error('创建文件夹失败:', error)
    alert(error.message || '创建文件夹失败')
  }
}

// 监听 path prop 变化
watch(() => props.path, async (newPath) => {
  if (newPath) {
    currentPath.value = newPath
    // Try to match with sidebar item
    const fav = favorites.value.find(f => f.path === newPath)
    if (fav) {
      currentFolder.value = fav.id
    } else {
      currentFolder.value = '' 
    }
    await fetchFiles(newPath)
  }
})

onMounted(async () => {
  // Check login status
  isLoggedIn.value = AuthAPI.isLoggedIn()
  
  // Initial load
  await loadSidebarDirectories()
  
  if (props.path) {
    currentPath.value = props.path
    // Try to match with sidebar item
    const fav = favorites.value.find(f => f.path === props.path)
    if (fav) {
      currentFolder.value = fav.id
    } else {
      currentFolder.value = '' // Clear selection if custom path
    }
    fetchFiles(props.path)
  }
})
</script>

<style scoped>
.finder-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--app-bg);
  color: var(--text-primary);
  transition: all var(--transition-smooth);
}

.finder-toolbar {
  height: 44px;
  background: linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%);
  border-bottom: 1px solid #d6d6d6;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.toolbar-controls {
  display: flex;
  gap: 3px;
}

.nav-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #bbb;
  border-radius: 5px;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.15s ease;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%);
  color: #999;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.nav-btn:hover:not(:disabled) {
  background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%);
  border-color: #999;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.nav-btn:active:not(:disabled) {
  background: linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), 0 1px 1px rgba(255, 255, 255, 0.8);
  transform: translateY(0.5px);
}

.toolbar-path {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-primary);
  overflow: hidden;
  font-weight: 500;
}

.path-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.path-separator {
  color: var(--text-secondary);
  font-size: 9px;
  opacity: 0.5;
  margin: 0 2px;
}

.toolbar-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.view-group {
  display: flex;
  gap: 3px;
}

.macos-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #bbb;
  border-radius: 5px;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.15s ease;
}

.macos-btn:hover {
  background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%);
  border-color: #999;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.macos-btn:active {
  background: linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), 0 1px 1px rgba(255, 255, 255, 0.8);
  transform: translateY(0.5px);
}

.macos-btn.active {
  background: linear-gradient(180deg, #4a9eff 0%, #1976d2 100%);
  border-color: #1565c0;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.macos-btn.active:hover {
  background: linear-gradient(180deg, #5aadff 0%, #2986e2 100%);
  border-color: #1565c0;
}

.icon-size-group {
  display: flex;
  gap: 0;
  background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%);
  border: 1px solid #bbb;
  border-radius: 5px;
  padding: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.icon-size-group .macos-btn {
  border: none;
  box-shadow: none;
  margin: 0;
  background: transparent;
  border-radius: 3px;
}

.icon-size-group .macos-btn:hover {
  background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.icon-size-group .macos-btn.active {
  background: linear-gradient(180deg, #4A90E2 0%, #357ABD 100%);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

[data-theme="dark"] .icon-size-group {
  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
  border-color: #1a1a1a;
}

[data-theme="dark"] .icon-size-group .macos-btn:hover {
  background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%);
}

[data-theme="dark"] .icon-size-group .macos-btn.active {
  background: linear-gradient(180deg, #0066CC 0%, #004499 100%);
}

/* 暗黑模式样式 */
[data-theme="dark"] .finder-toolbar {
  background: linear-gradient(180deg, #3c3c3c 0%, #2d2d2d 100%);
  border-bottom: 1px solid #1a1a1a;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .nav-btn {
  background: linear-gradient(180deg, #505050 0%, #404040 100%);
  border-color: #2a2a2a;
  color: #e0e0e0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .nav-btn:disabled {
  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
  color: #666;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .nav-btn:hover:not(:disabled) {
  background: linear-gradient(180deg, #5a5a5a 0%, #4a4a4a 100%);
  border-color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .nav-btn:active:not(:disabled) {
  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .macos-btn {
  background: linear-gradient(180deg, #505050 0%, #404040 100%);
  border-color: #2a2a2a;
  color: #b0b0b0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .macos-btn:hover {
  background: linear-gradient(180deg, #5a5a5a 0%, #4a4a4a 100%);
  border-color: #1a1a1a;
  color: #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .macos-btn:active {
  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .macos-btn.active {
  background: linear-gradient(180deg, #4a9eff 0%, #1976d2 100%);
  border-color: #1565c0;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

[data-theme="dark"] .macos-btn.active:hover {
  background: linear-gradient(180deg, #5aadff 0%, #2986e2 100%);
}

.finder-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.finder-sidebar {
  width: 180px;
  background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
  border-right: 1px solid #d0d0d0;
  overflow-y: auto;
  padding: 12px 0;
  transition: all 0.3s ease;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.5);
}

[data-theme="dark"] .finder-sidebar {
  background: linear-gradient(180deg, #2d2d2d 0%, #252525 100%);
  border-right: 1px solid #1a1a1a;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.05);
}

.sidebar-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #666;
  padding: 0 16px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
}

[data-theme="dark"] .section-title {
  color: #999;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 7px 16px;
  cursor: pointer;
  gap: 10px;
  border-radius: 6px;
  margin: 1px 12px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  position: relative;
}

.sidebar-item:hover {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.06) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.sidebar-item.active {
  background: linear-gradient(180deg, #4A90E2 0%, #357ABD 100%);
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 
    0 1px 3px rgba(74, 144, 226, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.sidebar-item.active:hover {
  background: linear-gradient(180deg, #5A9AE8 0%, #4080C8 100%);
  box-shadow: 
    0 1px 4px rgba(74, 144, 226, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .sidebar-item:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.06) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .sidebar-item.active {
  background: linear-gradient(180deg, #0066CC 0%, #004499 100%);
  box-shadow: 
    0 1px 3px rgba(0, 102, 204, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

[data-theme="dark"] .sidebar-item.active:hover {
  background: linear-gradient(180deg, #0077DD 0%, #0055AA 100%);
  box-shadow: 
    0 1px 4px rgba(0, 102, 204, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.item-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon :deep(svg) {
  width: 18px;
  height: 18px;
  max-width: 18px;
  max-height: 18px;
  display: block;
}

.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.finder-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: var(--app-bg);
  position: relative;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  padding: 16px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px;
  /* border-radius: 8px; */
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.grid-item:hover {
  background: linear-gradient(180deg, rgba(74, 144, 226, 0.06) 0%, rgba(74, 144, 226, 0.1) 100%);
  border-color: rgba(74, 144, 226, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.15);
}

[data-theme="dark"] .grid-item:hover {
  background: linear-gradient(180deg, rgba(0, 102, 204, 0.06) 0%, rgba(0, 102, 204, 0.1) 100%);
  border-color: rgba(0, 102, 204, 0.2);
  box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);
}

.grid-item-icon {
  width: 48px;
  height: 48px;
  /* border-radius: 12px; */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: relative;
}

.grid-item-icon :deep(svg) {
  width:32px;
  height: 32px;
  max-width: none;
  max-height: none;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* border-radius: 12px; */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.video-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.play-overlay svg {
  width: 10px;
  height: 10px;
  margin-left: 1px; /* Visual correction */
}


.image-preview:hover {
  transform: scale(1.05);
}

.grid-item-name {
  font-size: 11px;
  text-align: center;
  word-break: break-word;
  color: var(--text-primary);
  line-height: 1.3;
}

/* 小图标尺寸 */
.grid-view.size-small {
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 12px;
  padding: 12px;
}

.grid-view.size-small .grid-item {
  padding: 6px;
  gap: 4px;
}

.grid-view.size-small .grid-item-icon {
  width: 36px;
  height: 36px;
}

.grid-view.size-small .grid-item-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.grid-view.size-small .grid-item-name {
  font-size: 10px;
}

/* 中图标尺寸 (默认) */
.grid-view.size-medium {
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  padding: 16px;
}

.grid-view.size-medium .grid-item {
  padding: 8px;
  gap: 6px;
}

.grid-view.size-medium .grid-item-icon {
  width: 48px;
  height: 48px;
}

.grid-view.size-medium .grid-item-icon :deep(svg) {
  width: 32px;
  height: 32px;
}

.grid-view.size-medium .grid-item-name {
  font-size: 11px;
}

/* 大图标尺寸 */
.grid-view.size-large {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  padding: 20px;
}

.grid-view.size-large .grid-item {
  padding: 12px;
  gap: 8px;
}

.grid-view.size-large .grid-item-icon {
  width: 64px;
  height: 64px;
}

.grid-view.size-large .grid-item-icon :deep(svg) {
  width: 48px;
  height: 48px;
}

.grid-view.size-large .grid-item-name {
  font-size: 12px;
}

.list-view {
  width: 100%;
}

.list-table {
  width: 100%;
  border-collapse: collapse;
}

.list-table th {
  text-align: left;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--app-separator);
}

.list-table td {
  padding: 10px 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--app-separator);
  color: var(--text-primary);
}

.list-table tr:hover {
  background: var(--app-item-hover);
}

.list-icon {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  vertical-align: middle;
  flex-shrink: 0;
}

.list-icon :deep(svg) {
  width: 14px;
  height: 14px;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  gap: 16px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--text-secondary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #ff3b30;
}

.finder-statusbar {
  height: 22px;
  background: linear-gradient(180deg, #e8e8e8 0%, #d8d8d8 100%);
  border-top: 1px solid #c0c0c0;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 11px;
  color: #666;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

[data-theme="dark"] .finder-statusbar {
  background: linear-gradient(180deg, #2d2d2d 0%, #252525 100%);
  border-top: 1px solid #1a1a1a;
  color: #999;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* 上传对话框样式 */
.upload-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.upload-dialog {
  width: 480px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

[data-theme="dark"] .upload-dialog {
  background: #2d2d2d;
}

.upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

[data-theme="dark"] .upload-header {
  border-bottom-color: #3a3a3a;
}

.upload-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

[data-theme="dark"] .close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.upload-body {
  padding: 20px;
}

.upload-drop-zone {
  border: 2px dashed #d0d0d0;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-drop-zone:hover {
  border-color: #4A90E2;
  background: rgba(74, 144, 226, 0.05);
}

[data-theme="dark"] .upload-drop-zone {
  border-color: #4a4a4a;
}

[data-theme="dark"] .upload-drop-zone:hover {
  border-color: #0066CC;
  background: rgba(0, 102, 204, 0.1);
}

.upload-drop-zone svg {
  color: #999;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 13px;
  color: var(--text-secondary);
}

.selected-files {
  margin-top: 20px;
}

.selected-files h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

[data-theme="dark"] .file-item {
  background: #3a3a3a;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #ff3b30;
  color: white;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 12px;
  transition: all 0.15s ease;
}

.remove-btn:hover {
  background: #ff2d1f;
  transform: scale(1.1);
}

.upload-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

[data-theme="dark"] .upload-footer {
  border-top-color: #3a3a3a;
}

.btn-secondary,
.btn-primary {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

[data-theme="dark"] .btn-secondary {
  background: #3a3a3a;
  color: #e0e0e0;
}

[data-theme="dark"] .btn-secondary:hover {
  background: #4a4a4a;
}

.btn-primary {
  background: linear-gradient(180deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #5A9AE8 0%, #4080C8 100%);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

[data-theme="dark"] .btn-primary {
  background: linear-gradient(180deg, #0066CC 0%, #004499 100%);
}

[data-theme="dark"] .btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #0077DD 0%, #0055AA 100%);
}

/* Drag Overlay */
.drag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px dashed #4A90E2;
  border-radius: 8px;
  margin: 10px;
}

[data-theme="dark"] .drag-overlay {
  background: rgba(45, 45, 45, 0.6);
  border-color: #357ABD;
}

.drag-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #4A90E2;
  font-weight: 500;
  font-size: 18px;
  pointer-events: none;
}

[data-theme="dark"] .drag-content {
  color: #357ABD;
}

.overlay-forbidden {
  border-color: #ff3b30 !important;
  background: rgba(255, 59, 48, 0.1) !important;
}

.overlay-forbidden .drag-content {
  color: #ff3b30 !important;
}
</style>
