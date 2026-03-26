<template>
  <div class="calendar-widget" :class="{ large: isLarge }">
    <div class="header">
      <div class="day-name">{{ currentDayName }}</div>
      <div class="day-number">{{ currentDayNumber }}</div>
    </div>
    <div class="month-grid">
      <div class="week-days">
        <span v-for="d in ['日', '一', '二', '三', '四', '五', '六']" :key="d">{{ d }}</span>
      </div>
      <div class="days">
        <span 
          v-for="(day, index) in calendarDays" 
          :key="index"
          :class="{ 
            'current': day.isCurrentMonth, 
            'today': day.isToday 
          }"
        >
          {{ day.number }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  widget?: any
}>()

const isLarge = computed(() => {
  return props.widget && props.widget.width > 200 && props.widget.height > 200
})

const date = new Date()
const currentDayName = date.toLocaleDateString('zh-CN', { weekday: 'long' })
const currentDayNumber = date.getDate()

interface CalendarDay {
  number: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const calendarDays = computed(() => {
  const days: CalendarDay[] = []
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      number: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      number: i,
      isCurrentMonth: true,
      isToday: i === currentDayNumber
    })
  }
  
  // Next month days to fill grid (6 rows * 7 cols = 42)
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      number: i,
      isCurrentMonth: false,
      isToday: false
    })
  }
  
  return days
})
</script>

<style scoped>
.calendar-widget {
  width: 100%;
  height: 100%;
  background: var(--window-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  padding: 12px;
  box-shadow: var(--window-shadow);
  border: 1px solid var(--window-border);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-primary);
}

.header {
  text-align: center;
  margin-bottom: 8px;
}

.day-name {
  font-size: 10px;
  color: var(--macos-red);
  font-weight: 600;
}

.day-number {
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
  color: var(--text-primary);
}

.month-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 8px;
  color: var(--text-secondary);
  font-weight: 600;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 8px;
  padding-bottom: 4px;
  flex: 1;
}

.days span {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.days span.current {
  color: var(--text-primary);
}

.days span.today {
  background: var(--macos-red);
  color: white;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  margin: 0 auto;
}

/* Large Size Overrides */
.calendar-widget.large .day-name {
  font-size: 16px;
  margin-bottom: 4px;
}

.calendar-widget.large .day-number {
  font-size: 48px;
  font-weight: 200;
  margin-bottom: 10px;
}

.calendar-widget.large .week-days {
  font-size: 12px;
  margin-bottom: 5px;
}

.calendar-widget.large .days {
  font-size: 12px;
}

.calendar-widget.large .days span.today {
  width: 20px;
  height: 20px;
}
</style>
