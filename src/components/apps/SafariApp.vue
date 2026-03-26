<template>
  <div class="safari-app">
    <!-- Safari Toolbar -->
    <div class="safari-toolbar">
      <div class="toolbar-left">
        <button class="nav-btn" @click="goBack" title="Back">
          <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <button class="nav-btn" @click="goForward" title="Forward">
          <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
        <button class="nav-btn" title="Sidebar">
          <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </button>
      </div>
      
      <div class="address-bar">
        <span class="lock-icon">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-9-2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
        </span>
        <input
          v-model="currentUrl"
          type="text"
          class="url-input"
          placeholder="Search or enter website name"
          @keyup.enter="navigate"
        />
        <button class="refresh-btn" @click="toggleFavorite" :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'" style="margin-right: 4px;">
          <svg viewBox="0 0 24 24" :fill="isFavorite ? '#f5c518' : 'none'" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </button>
        <button class="refresh-btn" @click="refresh">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        </button>
      </div>
      
      <div class="toolbar-right">
        <button class="tool-btn" title="Share">
          <svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
        </button>
        <button class="tool-btn" title="Show all tabs">
          <svg viewBox="0 0 24 24"><path d="M2 16h8v-2H2v2zm0-5h18v-2H2v2zm0-7v2h18V4H2z"/></svg>
        </button>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="safari-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: tab.id === activeTabId }"
        @click="switchTab(tab.id)"
      >
        <span class="tab-icon" v-if="tab.icon">
          <span v-if="tab.icon === '⭐'">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px;color:#f5c518"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </span>
          <span v-else>{{ tab.icon }}</span>
        </span>
        <span class="tab-title">{{ tab.title }}</span>
        <button class="tab-close" @click.stop="closeTab(tab.id)">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <button class="new-tab-btn" @click="newTab">
        <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      </button>
    </div>
    
    <!-- Content Area -->
    <!-- Content Area -->
    <div class="safari-content" ref="contentContainer">
      <div 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="tab-content"
        v-show="tab.id === activeTabId"
      >
        <!-- Favorites -->
        <div v-if="tab.url === 'favorites'" class="favorites-page">
          <!-- <h2>Favorites</h2> -->
          <div class="favorites-grid">
            <div
              v-for="fav in favorites"
              :key="fav.id"
              class="favorite-item"
              @click="navigateToUrl(fav.url, fav.name)"
              @contextmenu.prevent="handleFavoriteContextMenu($event, fav)"
            >
              <div class="fav-icon" >
                <img 
                  v-if="fav.icon.startsWith('http')" 
                  :src="fav.icon" 
                  class="fav-img" 
                  @error="handleFavIconError($event, fav)"
                />
                <span v-else>{{ fav.icon }}</span>
                <!-- Fallback text if image hidden via error handler or logic -->
                <span class="fallback-icon" v-if="fav.icon.startsWith('http')" style="display:none">{{ fav.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="fav-name">{{ fav.name }}</div>
            </div>
          </div>
        </div>
        
        <!-- Webpage Content -->
        <div class="iframe-container" v-else>
          <iframe
            :src="tab.url"
            class="webpage-frame"
            title="safari-content"
            :style="iframeStyle"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Context Menu - Shared instance -->
    <ContextMenu ref="contextMenuRef" :items="contextMenuItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { CloudSyncAPI, AuthAPI } from '../../api'

import ContextMenu, { type MenuItem } from '../ContextMenu.vue'

const props = defineProps<{
  url?: string
  title?: string
  icon?: string
  timestamp?: number
}>()

interface Tab {
  id: string
  title: string
  url: string
  icon: string
}

const tabs = ref<Tab[]>([
  { 
    id: '1', 
    title: props.title || props.url || 'Favorites', 
    url: props.url || 'favorites', 
    icon: props.icon || '⭐' 
  },
])

const activeTabId = ref('1')
let nextTabId = 2

const currentUrl = ref(props.url || 'favorites')

const currentTab = computed(() => tabs.value.find(t => t.id === activeTabId.value))

// Watch for url/timestamp changes to open new tabs
watch(() => [props.url, props.timestamp], ([newUrl, _ts]) => {
  if (newUrl && typeof newUrl === 'string') {
    const activeTab = tabs.value.find(t => t.id === activeTabId.value)
    // Reuse active tab ONLY if it is the default favorites page (empty new tab)
    if (activeTab && activeTab.url === 'favorites') {
      activeTab.url = newUrl
      activeTab.title = props.title || newUrl
      if (props.icon) activeTab.icon = props.icon
      currentUrl.value = newUrl
    } else {
      // Create new tab for the link
      const id = String(nextTabId++)
      tabs.value.push({
        id,
        title: props.title || newUrl,
        url: newUrl,
        icon: props.icon || '⭐'
      })
      activeTabId.value = id
      currentUrl.value = newUrl
    }
  }
})

// Favorites Logic
interface FavoriteItem {
  id: string
  name: string
  url: string
  icon: string
  color: string
}

const getInitialFavorites = (): FavoriteItem[] => {
  try {
    const saved = localStorage.getItem('safari_favorites')
    if (saved) {
      return JSON.parse(saved)
    } else {
      return [
        { id: '1', name: '百度', url: 'https://www.baidu.com', icon: 'https://www.baidu.com/img/flexible/logo/pc/result.png', color: 'white' },
      ]
    }
  } catch (e) {
    console.error('Failed to load favorites', e)
    return []
  }
}

const favorites = ref<FavoriteItem[]>(getInitialFavorites())

const saveToCloud = async (newVal: FavoriteItem[]) => {
  if (!AuthAPI.isLoggedIn()) return
  try {
    await CloudSyncAPI.save('safari_favorites', newVal)
  } catch (error) {
    console.error('Failed to sync favorites to cloud:', error)
  }
}

watch(favorites, (newVal) => {
  localStorage.setItem('safari_favorites', JSON.stringify(newVal))
  saveToCloud(newVal)
}, { deep: true })

const isFavorite = computed(() => {
  if (!currentUrl.value || currentUrl.value === 'favorites') return false
  return favorites.value.some(f => f.url === currentUrl.value)
})

const getDomainName = (url: string) => {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace('www.', '')
  } catch {
    return url
  }
}

const toggleFavorite = () => {
  if (!currentUrl.value || currentUrl.value === 'favorites') return

  const index = favorites.value.findIndex(f => f.url === currentUrl.value)
  if (index !== -1) {
    favorites.value.splice(index, 1)
  } else {
    // Add to favorites
    // Suggest a name
    // Use tab title if available and distinct from URL, otherwise try to parse domain
    const defaultName = (currentTab.value?.title && currentTab.value.title !== currentUrl.value && currentTab.value.title !== 'Favorites') 
        ? currentTab.value.title 
        : getDomainName(currentUrl.value)
        
    const name = prompt('Enter bookmark name:', defaultName)
    if (name === null) return // User cancelled

    // Use a China-friendly favicon service or fallback to origin/favicon.ico
    // If tab has a specific icon (passed from desktop), use it
    let iconUrl = ''
    if (currentTab.value?.icon && currentTab.value.icon !== '⭐' && currentTab.value.icon.startsWith('http')) {
        iconUrl = currentTab.value.icon
    } else {
        try {
            const domain = new URL(currentUrl.value).hostname
            iconUrl = `https://api.iowen.cn/favicon/${domain}.png`
        } catch {
            iconUrl = '/icons/safari.png'
        }
    }

    favorites.value.push({
      id: String(Date.now()),
      name: name || defaultName,
      url: currentUrl.value,
      icon: iconUrl,
      color: '#ffffff'
    })
  }
}

// Context Menu Logic
const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null)
const contextMenuItems = ref<MenuItem[]>([])

const handleFavoriteContextMenu = (e: MouseEvent, fav: FavoriteItem) => {
  contextMenuItems.value = [
    { label: '打开', action: () => navigateToUrl(fav.url, fav.name) },
    { label: '新标签页打开', action: () => openInNewTab(fav.url) },
    { divider: true },
    { label: '删除', action: () => removeFavorite(fav.id) }
  ]
  contextMenuRef.value?.show(e)
}

const openInNewTab = (url: string) => {
  window.open(url, '_blank')
}

const removeFavorite = (id: string) => {
  if (!confirm('Are you sure you want to remove this bookmark?')) return

  const index = favorites.value.findIndex(f => f.id === id)
  if (index !== -1) {
    favorites.value.splice(index, 1)
  }
}

const handleFavIconError = (_e: Event, fav: FavoriteItem) => {
    // If image fails, revert to showing the first letter
    fav.icon = fav.name.charAt(0).toUpperCase()
}

// Iframe Adaptive Scaling
const contentContainer = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const baseWidth = 1280 // Design width for the internal webpage

const iframeStyle = computed(() => {
  if (!containerWidth.value) return {}
  
  // Calculate scale needed to fit baseWidth into containerWidth
  const scale = Math.min(1, containerWidth.value / baseWidth)
  
  return {
    width: `${(100 / scale)}%`,
    height: `${(100 / scale)}%`,
    transform: `scale(${scale})`,
    transformOrigin: '0 0',
  }
})

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width
    }
  })
  if (contentContainer.value) {
    resizeObserver.observe(contentContainer.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

function newTab() {
  const tab: Tab = {
    id: String(nextTabId++),
    title: 'New Tab',
    url: 'favorites',
    icon: '⭐',
  }
  tabs.value.push(tab)
  activeTabId.value = tab.id
}

function closeTab(tabId: string) {
  const index = tabs.value.findIndex(t => t.id === tabId)
  if (index === -1) return
  
  tabs.value.splice(index, 1)
  
  if (activeTabId.value === tabId && tabs.value.length > 0) {
    const newActiveTab = tabs.value[Math.max(0, index - 1)]
    if (newActiveTab) {
      activeTabId.value = newActiveTab.id
    }
  }
}

function switchTab(tabId: string) {
  activeTabId.value = tabId
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab) {
    currentUrl.value = tab.url
  }
}

function navigate() {
  if (currentTab.value) {
    currentTab.value.url = currentUrl.value
    currentTab.value.title = currentUrl.value
  }
}

function navigateToUrl(url: string, title?: string) {
  if (currentTab.value) {
    currentTab.value.url = url
    currentTab.value.title = title || url
    currentUrl.value = url
  }
}

function goBack() {
  console.log('Go back')
}

function goForward() {
  console.log('Go forward')
}

function refresh() {
  console.log('Refresh')
}
</script>

<style scoped>
.safari-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--app-bg);
  color: var(--text-primary);
  transition: all var(--transition-smooth);
}

/* Minimalist macOS Safari Style */

.safari-toolbar {
  height: 52px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  background: var(--app-toolbar-bg); /* Use theme toolbar background */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* For Safari support */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px; /* Tighter spacing */
  align-items: center;
}

.nav-btn,
.tool-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, opacity 0.2s ease;
  opacity: 0.7;
}

.nav-btn svg,
.tool-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.nav-btn:hover,
.tool-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  opacity: 1;
}

[data-theme="dark"] .nav-btn:hover,
[data-theme="dark"] .tool-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.address-bar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center; /* Center content */
  gap: 8px;
  background: rgba(0, 0, 0, 0.05); /* Very subtle background */
  border: 1px solid transparent; /* No border by default */
  border-radius: 8px; /* Slightly more rounded */
  padding: 0 10px;
  height: 32px; /* Slimmer */
  transition: box-shadow 0.2s ease, background 0.2s ease;
  max-width: 600px;
  margin: 0 auto;
}

[data-theme="dark"] .address-bar {
  background: rgba(255, 255, 255, 0.1);
}

.address-bar:focus-within {
  background: var(--app-bg); /* White/Dark bg on focus */
  border-color: var(--app-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* Focus ring */
}

.lock-icon {
  width: 12px;
  height: 12px;
  opacity: 0.5;
  display: flex;
  align-items: center;
}

.url-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: transparent;
  color: var(--text-primary);
  text-align: center; /* Centered text like macOS */
  font-weight: 500; /* Slightly bolder */
}

.url-input:focus {
  text-align: center; /* Keep centered even on focus usually, but left is fine */
}

.refresh-btn {
  border: none;
  background: transparent;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0; /* Hidden by default until hover or valid URL load */
  color: var(--text-secondary);
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.address-bar:hover .refresh-btn,
.address-bar:focus-within .refresh-btn {
  opacity: 0.6;
}

.refresh-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  opacity: 1 !important;
}

/* Tabs */
.safari-tabs {
  display: flex;
  align-items: flex-end;
  gap: 0; /* No gap between tabs */
  padding: 0 8px; /* Slight padding */
  background: var(--app-toolbar-bg); /* Match toolbar */
  /* border-bottom: 1px solid rgba(0,0,0,0.1); This is handled by toolbar now usually */
  overflow-x: auto;
  height: 38px; /* Fixed height for tabs area */
}

.tab {
  flex: 1; /* Tabs grow to fill space */
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  background: transparent; /* Transparent by default */
  color: var(--text-secondary);
  border-radius: 6px; /* Rounded corners */
  margin: 0 2px 4px 2px; /* Spacing for the 'floating' look */
  cursor: default;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  min-width: 100px;
  max-width: 240px;
  height: 28px; /* Slim tabs */
  position: relative;
  font-size: 12px;
}

.tab:hover {
  background: rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .tab:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tab.active {
  background: var(--window-bg); /* Active tab matches window bg */
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.tab-icon {
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  align-items: center;
}

.tab-title {
  flex: 1;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center; /* Center tab title */
}

.tab-close {
  width: 14px;
  height: 14px;
  border: none;
  background: transparent;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  opacity: 0; /* Hidden until hover */
  color: var(--text-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab:hover .tab-close {
  opacity: 0.7;
}

.tab-close:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1 !important;
}

.new-tab-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  margin-bottom: 4px;
}

.new-tab-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.new-tab-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.safari-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--app-bg);
}

.webpage {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.favorites-page {
  flex: 1;
  overflow: auto;
  padding: 40px;
}

.favorites-page h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  color: var(--text-primary);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 24px;
}

.favorite-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.favorite-item:hover {
  transform: scale(1.05);
}

.fav-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.fav-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  padding: 0;
}

.fav-name {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: var(--text-primary);
}

.iframe-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.webpage-frame {
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  background: white;
  transform-origin: 0 0;
}
</style>
