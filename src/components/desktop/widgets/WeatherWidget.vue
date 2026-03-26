<template>
  <div class="weather-widget" :class="{ wide: isWide }">
    <div v-if="weatherData" class="weather-content">
      <div class="weather-main">
        <div class="location-group">
          <div class="location-info">
            <span class="city">{{ weatherData.city }}</span>
            <span class="district" v-if="weatherData.district && weatherData.district !== weatherData.city">{{ weatherData.district }}</span>
          </div>
          <div class="condition">{{ weatherData.weather }}</div>
        </div>
        <div class="current-weather">
          <div class="temp">{{ weatherData.temperature }}°</div>
        </div>
      </div>
      
      <div class="weather-details">
        <div class="detail-item" v-if="weatherData.winddirection || weatherData.wind_direction">
          <span class="label">风向</span>
          <span class="value">{{ weatherData.winddirection || weatherData.wind_direction }}</span>
        </div>
        <div class="detail-item" v-if="weatherData.windpower || weatherData.wind_power">
          <span class="label">风力</span>
          <span class="value">{{ weatherData.windpower || weatherData.wind_power }}</span>
        </div>
        <div class="detail-item" v-if="weatherData.humidity">
          <span class="label">湿度</span>
          <span class="value">{{ weatherData.humidity }}%</span>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <span>加载天气...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  data?: any
  widget?: any
}>()

const isWide = computed(() => {
  return props.widget && props.widget.width > 200 // 150 vs 320
})

const weatherData = ref<any>(null)

const fetchWeatherInfo = async () => {
  try {
    const timestamp = Date.now()
    const apiUrl = `https://lt20czhfj3.hzh.sealos.run/macos_web_fangke?timestamp=${timestamp}`
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source: 'macos_web',
            page: 'widget'
        })
    })

    const data = await response.json()
      
    if (data && data.success && data.weather) {
      weatherData.value = data.weather
    }
  } catch (error) {
    console.error('Failed to fetch weather for widget:', error)
  }
}

onMounted(() => {
  fetchWeatherInfo()
  // Refresh every 30 minutes
  setInterval(fetchWeatherInfo, 30 * 60 * 1000)
})
</script>

<style scoped>
.weather-widget {
  width: 100%;
  height: 100%;
  background: var(--window-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  box-shadow: var(--window-shadow);
  border: 1px solid var(--window-border);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  position: relative;
  color: var(--text-primary);
}

.weather-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: space-between;
}

/* Wide Layout Changes */
.weather-widget.wide .weather-content {
  flex-direction: row;
  flex-direction: row;
  align-items: center;
  padding: 20px 24px;
}

.weather-widget.wide .weather-main {
  flex-direction: row-reverse;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.weather-widget.wide .location-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.weather-widget.wide .weather-details {
  border-top: none;
  border-left: 1px solid var(--app-separator);
  padding-top: 0;
  padding-left: 20px;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-left: 20px;
  min-width: 80px;
}

.widget.wide .location-info {
  font-size: 16px;
}

.weather-widget.wide .temp {
  font-size: 48px;
}

.weather-widget.wide .detail-item {
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.weather-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-info {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.district {
  margin-left: 4px;
  opacity: 0.7;
  font-size: 12px;
}

.current-weather {
  display: flex;
  flex-direction: column;
}

.temp {
  font-size: 32px;
  font-weight: 300;
  line-height: 1.2;
  color: var(--text-primary);
}

.condition {
  font-size: 14px;
  color: var(--text-secondary);
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  border-top: 1px solid var(--app-separator);
  padding-top: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.label {
  font-size: 9px;
  color: var(--text-tertiary);
}

.value {
  font-size: 10px;
  color: var(--text-primary);
  font-weight: 500;
}

.loading-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--app-separator);
  border-top-color: var(--macos-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
