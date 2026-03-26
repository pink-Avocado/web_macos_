<template>
  <div class="clock-widget">
    <div class="clock-face">
      <!-- Simple Digital Clock for now, can be Analog -->
      <div class="time">{{ time }}</div>
      <div class="date">{{ date }}</div>
      <div class="city" v-if="data?.city">{{ data.city }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  data?: {
    city?: string
    timezone?: string
  }
}>()

const time = ref('')
const date = ref('')

let interval: number

function updateTime() {
  const now = new Date()
  time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  date.value = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

onMounted(() => {
  updateTime()
  interval = setInterval(updateTime, 1000) as unknown as number
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.clock-widget {
  width: 100%;
  height: 100%;
  background: var(--window-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-shadow: var(--window-shadow);
  border: 1px solid var(--window-border);
  color: var(--text-primary);
}

.time {
  font-size: 32px;
  font-weight: 300;
  line-height: 1.2;
}

.date {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
  text-transform: uppercase;
}

.city {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 8px;
}
</style>
