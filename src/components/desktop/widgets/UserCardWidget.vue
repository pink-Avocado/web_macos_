<template>
  <div class="user-card-widget" 
       :class="{ wide: isWide, large: isLarge, hover: isHovered }"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false">
    
    <div class="card-content">
      <!-- Avatar Section -->
      <div class="user-avatar" :class="{ 'avatar-hidden': isHovered }">
         <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" alt="User Avatar" />
         <div v-else class="avatar-placeholder">{{ initials }}</div>
      </div>
      
      <!-- QR Code Section (Shown on Hover) -->
      <div class="qr-code-section" :class="{ 'qr-visible': isHovered }">
        <img :src="qrCodeUrl" class="qr-image" alt="WeChat QR" />
      </div>

      <!-- User Info (Moves up on Hover) -->
      <div class="user-info" :class="{ 'info-moved': isHovered }">
        <div class="username">{{ username }}</div>
        <div class="role">{{ role }}</div>
      </div>
      
      <!-- Statistics (Hidden on small 1:1, visible on others) -->
      <div class="stats" v-if="isLarge || isWide">
         <div class="stat-item">
            <span class="stat-val">{{ storageUsed }}</span>
            <span class="stat-label">空间</span>
         </div>
         <div class="stat-item">
            <span class="stat-val">{{ articleCount }}</span>
            <span class="stat-label">文章</span>
         </div>
         <div class="stat-item">
            <span class="stat-val">{{ appCount }}</span>
            <span class="stat-label">应用</span>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = defineProps<{
  widget?: any
}>()

const isWide = computed(() => {
  return props.widget && props.widget.width > 200 && props.widget.height < 200
})

const isLarge = computed(() => {
  return props.widget && props.widget.width > 200 && props.widget.height > 200
})

const username = ref('前端小白')
const role = ref('联系作者')
const avatarUrl = ref('https://www.qian-qian.xyz/tx.jpg')
const qrCodeUrl = ref('https://api.pwmqr.com/qrcode/create/?url=https://u.wechat.com/MHGBQtRYzX4kvXu86gkdd9w?s=2')

const storageUsed = ref('45%')
const articleCount = ref('128')
const appCount = ref('9')
const isHovered = ref(false)

const initials = computed(() => {
  return username.value.slice(0, 2).toUpperCase()
})

onMounted(() => {
  // In a real app, fetch these stats from an API
})
</script>

<style scoped>
.user-card-widget {
  width: 100%;
  height: 100%;
  background: var(--window-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  box-shadow: var(--window-shadow);
  border: 1px solid var(--window-border);
  position: relative;
  overflow: hidden;
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  cursor: default;
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 10px;
  position: relative;
}

.user-avatar {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
  z-index: 2;
}

.user-avatar.avatar-hidden {
  opacity: 0;
  transform: scale(0.5);
  pointer-events: none;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.qr-code-section {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 0.1s;
  z-index: 1;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: white; /* QR usually needs white bg */
  padding: 4px;
}

.qr-code-section.qr-visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1); /* Absolute center */
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.user-info {
  text-align: center;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 3;
}

.user-info.info-moved {
  transform: translateY(-125px); /* Move name further up */
}

.username {
  font-size: 16px;
  font-weight: 600;
  background: rgba(255,255,255,0.0); /* Transparent bg */
  padding: 2px 6px;
  border-radius: 4px;
  backdrop-filter: none;
}
/* Optional: Add background to username when moved up for readability over QR? 
   Actually if it moves UP, it might cover the top of the card. 
   Let's check layout. 150px height. 
   Center is 75px. 
   Avatar is ~60px. Info is ~30px.
   If Info moves up 55px, it goes near top edge.
   QR takes center spot.
*/

.role {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
  opacity: 1;
  transition: opacity 0.2s;
}

.user-info.info-moved .role {
  opacity: 0; /* Hide role when showing QR code to reduce clutter? User just said name moves up */
}

/* Wide Layout Adjustments */
.user-card-widget.wide .card-content {
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 15px;
}

.user-card-widget.wide .user-info {
  text-align: left;
  flex: 1;
  min-width: 0;
}

.user-card-widget.wide .user-info.info-moved {
   transform: none; /* Disable move up on wide layout for now, or define specific animation if needed */
   /* User request was general, but likely targeting the main 1:1 view since they restricted it earlier */
}

/* User only allowed 1:1 so we focus on that mostly */

.stats {
  /* ... kept as is ... */
  display: flex;
  gap: 15px;
  border-left: 1px solid var(--app-separator);
  padding-left: 15px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--macos-blue);
}

.stat-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-top: 2px;
}
</style>
