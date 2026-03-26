<template>
  <div class="calendar-app">
    <div class="calendar-header">
      <button class="nav-btn" @click="prevMonth">‹</button>
      <h2>{{ currentMonthYear }}</h2>
      <button class="nav-btn" @click="nextMonth">›</button>
    </div>
    
    <div class="calendar-body">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      
      <div class="days-grid">
        <div
          v-for="day in calendarDays"
          :key="day.key"
          class="day-cell"
          :class="{
            'other-month': day.otherMonth,
            'today': day.isToday,
            'selected': day.selected
          }"
          @click="selectDay(day)"
        >
          <div class="day-number">{{ day.day }}</div>
          <div v-if="day.hasEvents" class="event-dot"></div>
        </div>
      </div>
    </div>
    
    <div class="events-sidebar">
      <h3>Events</h3>
      <div class="events-list">
        <div v-for="event in selectedDayEvents" :key="event.id" class="event-item">
          <div class="event-time">{{ event.time }}</div>
          <div class="event-title">{{ event.title }}</div>
        </div>
        <p v-if="selectedDayEvents.length === 0" class="no-events">No events</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CalendarDay {
  key: string
  day: number
  date: Date
  otherMonth: boolean
  isToday: boolean
  selected: boolean
  hasEvents: boolean
}

interface Event {
  id: string
  date: string
  time: string
  title: string
}

const currentDate = ref(new Date())
const selectedDate = ref(new Date())

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const events: Event[] = [
  { id: '1', date: (new Date().toISOString().split('T')[0] || ''), time: '10:00 AM', title: 'Team Meeting' },
  { id: '2', date: (new Date().toISOString().split('T')[0] || ''), time: '2:00 PM', title: 'Project Review' },
]

const currentMonthYear = computed(() => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days: CalendarDay[] = []
  
  // Previous month days
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      key: `prev-${i}`,
      day: date.getDate(),
      date,
      otherMonth: true,
      isToday: false,
      selected: false,
      hasEvents: false,
    })
  }
  
  // Current month days
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      key: `curr-${i}`,
      day: i,
      date,
      otherMonth: false,
      isToday: date.toDateString() === today.toDateString(),
      selected: date.toDateString() === selectedDate.value.toDateString(),
      hasEvents: events.some(e => e.date === dateStr),
    })
  }
  
  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      key: `next-${i}`,
      day: i,
      date,
      otherMonth: true,
      isToday: false,
      selected: false,
      hasEvents: false,
    })
  }
  
  return days
})

const selectedDayEvents = computed(() => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return events.filter(e => e.date === dateStr)
})

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

function selectDay(day: CalendarDay) {
  selectedDate.value = day.date
}
</script>

<style scoped>
.calendar-app {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr 280px;
  background: var(--app-bg);
  color: var(--text-primary);
  transition: all var(--transition-smooth);
}

.calendar-header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 24px;
  border-bottom: 1px solid var(--app-toolbar-border);
  transition: border-color var(--transition-smooth);
}

.calendar-header h2 {
  font-size: 22px;
  font-weight: 700;
  min-width: 200px;
  text-align: center;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--app-input-bg);
  color: var(--text-primary);
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: var(--app-item-hover);
}

.calendar-body {
  padding: 20px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 8px 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease;
  color: var(--text-primary);
}

.day-cell:hover {
  background: var(--app-item-hover);
}

.day-cell.other-month {
  opacity: 0.3;
}

.day-cell.today {
  background: var(--macos-blue);
  color: white;
}

.day-cell.selected {
  background: rgba(0, 122, 255, 0.1);
  border: 2px solid var(--macos-blue);
}

.day-number {
  font-size: 14px;
  font-weight: 500;
}

.event-dot {
  width: 4px;
  height: 4px;
  background: var(--macos-blue);
  border-radius: 50%;
  margin-top: 4px;
}

.day-cell.today .event-dot {
  background: white;
}

.events-sidebar {
  border-left: 1px solid var(--app-border);
  padding: 24px;
  background: var(--app-sidebar-bg);
  transition: all var(--transition-smooth);
}

.events-sidebar h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-item {
  padding: 12px;
  background: var(--app-input-bg);
  border-radius: 8px;
  border-left: 3px solid var(--macos-blue);
}

.event-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.event-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.no-events {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 20px;
}
</style>
