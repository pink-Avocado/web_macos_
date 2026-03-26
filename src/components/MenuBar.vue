<template>
  <div class="menubar">
    <!-- Left Side - Apple Menu & App Menus -->
    <div class="menubar-left">
      <div class="apple-menu menu-item">
        <svg class="apple-logo" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      </div>
      <div class="app-name menu-item">{{ activeApp }}</div>
      <div class="menu-item">{{ t.menuBar.file }}</div>
      <div class="menu-item">{{ t.menuBar.edit }}</div>
      <div class="menu-item">{{ t.menuBar.view }}</div>
      <div class="menu-item">{{ t.menuBar.go }}</div>
      <div class="menu-item">{{ t.menuBar.window }}</div>
      <div class="menu-item">{{ t.menuBar.help }}</div>
    </div>
    
    <!-- Right Side - Status Icons -->
    <div class="menubar-right">
      <div class="status-item weather-info" 
           @click="refreshWeather" 
           v-if="weatherData" 
           @mouseenter="showWeatherDetail = true" 
           @mouseleave="showWeatherDetail = false">
        <div class="weather">
          {{ weatherData.city }} 
          <span v-if="weatherData.district && weatherData.district !== weatherData.city">{{ weatherData.district }}</span>
          {{ weatherData.weather }} {{ weatherData.temperature }}°C
        </div>
        
        <!-- Weather Detail Popup -->
         <Transition name="fade">
          <div class="weather-detail-popup" v-if="showWeatherDetail">
            <div class="weather-location">
              {{ weatherData.province }} {{ weatherData.city }} {{ weatherData.district }}
            </div>
            
            <div class="weather-main">
              <div class="temp-section">
                <span class="big-temp">{{ weatherData.temperature }}°</span>
                <span class="weather-text">{{ weatherData.weather }}</span>
              </div>
            </div>
            
            <div class="weather-grid">
              <div class="grid-item" v-if="weatherData.winddirection || weatherData.wind_direction">
                <span class="label">风向</span>
                <span class="value">{{ weatherData.winddirection || weatherData.wind_direction }}</span>
              </div>
              <div class="grid-item" v-if="weatherData.windpower || weatherData.wind_power">
                <span class="label">风力</span>
                <span class="value">{{ weatherData.windpower || weatherData.wind_power }}</span>
              </div>
              <div class="grid-item" v-if="weatherData.humidity">
                <span class="label">湿度</span>
                <span class="value">{{ weatherData.humidity }}%</span>
              </div>
            </div>
            
            <div class="weather-footer" v-if="weatherData.reporttime">
              更新时间: {{ weatherData.reporttime }}
            </div>
          </div>
        </Transition>
      </div>
      <!-- <div class="status-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      </div> -->

      

      
      <!-- Theme Toggle Button -->
      <div class="status-item theme-toggle" title="切换主题">
        <div class="theme-icon" @click="toggleTheme">
          <!-- Sun Icon (Light Mode) -->
          <svg v-if="currentTheme === 'light'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon Icon (Dark Mode) -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>
        
        <div class="theme-menu">
          <div class="theme-option" :class="{ active: themeMode === 'light' }" @click="setThemeMode('light')">
            <span>浅色</span>
            <span v-if="themeMode === 'light'" class="check">✓</span>
          </div>
          <div class="theme-option" :class="{ active: themeMode === 'dark' }" @click="setThemeMode('dark')">
            <span>深色</span>
            <span v-if="themeMode === 'dark'" class="check">✓</span>
          </div>
          <div class="theme-option" :class="{ active: themeMode === 'auto' }" @click="setThemeMode('auto')">
            <span>自动 (跟随系统)</span>
            <span v-if="themeMode === 'auto'" class="check">✓</span>
          </div>
        </div>
      </div>
      
      <!-- Fullscreen Toggle -->
      <div class="status-item fullscreen-toggle" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '进入全屏'">
        <svg v-if="!isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      </div>
      
      <!-- <div class="status-item search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="10" cy="10" r="7"/>
          <line x1="21" y1="21" x2="15" y2="15"/>
        </svg>
      </div> -->
      <div class="status-item time">{{ currentTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

defineProps<{
  activeApp: string
}>()

const { currentTheme, toggleTheme, themeMode, setThemeMode } = useTheme()
const { t } = useI18n()

const currentTime = ref('')
const weatherData = ref<any>(null)
const showWeatherDetail = ref(false)

const isFullscreen = ref(false)
let intervalId: number | undefined

const toggleFullscreen = () => {
  const doc = document as any
  const element = document.documentElement as any

  // 判断当前是否处于全屏状态
  const isFull = doc.fullscreenElement || 
                 doc.webkitFullscreenElement || 
                 doc.mozFullScreenElement || 
                 doc.msFullscreenElement

  if (!isFull) {
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err: any) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch((err: any) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`)
      })
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen()
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen()
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen()
    }
  }
}

const updateFullscreenState = () => {
  isFullscreen.value = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement)
}



function updateTime() {
  const now = new Date()
  
  const day = t.menuBar.days[now.getDay()]
  const month = t.menuBar.months[now.getMonth()]
  const date = now.getDate()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  
  currentTime.value = `${month}${date}日 ${day}  ${hours}:${minutes}`
}

const fetchWeatherInfo = async () => {
  try {
    const timestamp = Date.now()
    const apiUrl = `https://lt20czhfj3.hzh.sealos.run/macos_web_fangke?timestamp=${timestamp}`
    
    console.log('[访客记录] 获取访客信息（包含天气）...')
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source: 'macos_web',
            page: 'loading'
        })
    })

    const data = await response.json()
      
    if (data && data.success && data.weather) {
      console.log('[访客记录] 获取成功，包含天气信息:', data.weather)
      weatherData.value = data.weather
    } else {
      console.warn('[访客记录] 获取失败或无天气信息:', data?.message || '未知错误')
    }
  } catch (error: any) {
    console.error('[访客记录] 接口调用失败:', error.message)
  }
}

const refreshWeather = () => {
  fetchWeatherInfo()
}

onMounted(() => {
  updateTime()
  intervalId = window.setInterval(updateTime, 1000)
  
  fetchWeatherInfo()
  

  document.addEventListener('fullscreenchange', updateFullscreenState)
  document.addEventListener('webkitfullscreenchange', updateFullscreenState)
  document.addEventListener('mozfullscreenchange', updateFullscreenState)
  document.addEventListener('MSFullscreenChange', updateFullscreenState)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  

  document.removeEventListener('fullscreenchange', updateFullscreenState)
  document.removeEventListener('webkitfullscreenchange', updateFullscreenState)
  document.removeEventListener('mozfullscreenchange', updateFullscreenState)
  document.removeEventListener('MSFullscreenChange', updateFullscreenState)
})
</script>

<style scoped>
.menubar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--menubar-height);
  /* height: 28px; */
  background: var(--menubar-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  /* font-weight: 500; */
  color: var(--menubar-text);
  z-index: 1000;
  user-select: none;
  border-bottom: 0.5px solid var(--menubar-border);
  transition: all var(--transition-smooth);
}

.menubar-left,
.menubar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
}

.menu-item {
  cursor: pointer;
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: background-color 0.15s ease;
  border-radius: 4px;
}

.menu-item:hover {
  background-color: var(--menubar-hover);
}

.apple-menu {
  font-size: 16px;
}

.app-name {
  font-weight: 600;
}

.menubar-right {
  gap: 12px;
}

.status-item {
  cursor: pointer;
  padding: 0 6px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;
  border-radius: 4px;
}

.status-item:hover {
  background-color: var(--menubar-hover);
}

.theme-toggle {
  position: relative;
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.theme-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 140px;
  background: var(--menubar-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--text-primary);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 4px;
  display: none;
  flex-direction: column;
  z-index: 2000;
  border: 0.5px solid var(--menubar-border);
  margin-top: 4px;
}

.theme-menu::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: transparent;
}

.theme-toggle:hover .theme-menu {
  display: flex;
  animation: fadeIn 0.1s ease;
}

.theme-option {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--menubar-text);
}

.theme-option:hover {
  background: var(--active-bg, rgba(0, 122, 255, 0.6));
  color: white;
}

.theme-option.active {
  font-weight: 500;
}

.check {
  font-size: 12px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.time {
  font-size: 12px;
  padding: 0 8px;
  font-variant-numeric: tabular-nums;
}


.weather-info {
  position: relative;
}

.weather-info .weather {
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0.9;
  padding: 0 4px;
}

.weather-detail-popup {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: var(--menubar-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 12px;
  margin-top: 6px;
  z-index: 2000;
  border: 0.5px solid var(--menubar-border);
  color: var(--menubar-text);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weather-detail-popup::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: transparent;
}

.weather-location {
  font-size: 12px;
  opacity: 0.8;
  border-bottom: 0.5px solid rgba(128, 128, 128, 0.2);
  padding-bottom: 4px;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
}

.temp-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.big-temp {
  font-size: 32px;
  font-weight: 300;
}

.weather-text {
  font-size: 16px;
  opacity: 0.9;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: rgba(128, 128, 128, 0.1);
  border-radius: 4px;
  padding: 6px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.grid-item .label {
  font-size: 10px;
  opacity: 0.6;
}

.grid-item .value {
  font-size: 11px;
  font-weight: 500;
}

.weather-footer {
  font-size: 10px;
  opacity: 0.5;
  text-align: right;
  margin-top: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}



</style>
