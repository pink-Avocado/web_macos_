<template>
  <div class="mac-loading" :class="{ 'fade-out': isLoaded }">
    <div class="logo">
      <img src="/icons/apple-logo.svg" alt="Apple Logo" />
    </div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['loaded'])

const progress = ref(0)
const isLoaded = ref(false)
let timer: any = null

onMounted(() => {
  // 模拟加载进度
  timer = setInterval(() => {
    if (progress.value < 100) {
      // 随机增加进度
      progress.value += Math.random() * 15
      if (progress.value > 100) progress.value = 100
    } else {
      clearInterval(timer)
      setTimeout(() => {
        isLoaded.value = true
        // 动画结束后发出事件
        setTimeout(() => {
          emit('loaded')
        }, 1000)
      }, 500)
    }
  }, 200)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.mac-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  transition: opacity 1s ease;
}

.mac-loading.fade-out {
  opacity: 0;
}

.logo {
  margin-bottom: 50px;
  width: 80px;
  height: 80px;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Ensure logo is white if it's not already */
  filter: brightness(0) invert(1);
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #fff;
  border-radius: 4px;
  transition: width 0.2s ease;
}
</style>
