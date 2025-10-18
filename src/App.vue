<template>
  <div id="app-layout">
    <header>
      <div class="wrapper">
        <!-- Logo 已被移除 -->
        <h1>HDU 自动化单词测试</h1>
        <p>一个由 Go + Vue 驱动的现代 Web 应用</p>
        <!-- === 新增：后端状态指示器 === -->
        <div class="backend-status">
          <span class="status-indicator" :class="statusClass"></span>
          <span>{{ statusText }}</span>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>
        请合理使用，并对自己的行为负责。© 2025 |
        <!-- <a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备XXX号</a> -->
      </p>
    </footer>
  </div>
</template>

<script setup>
// 这里不再需要 import logo
import { onMounted, onUnmounted, computed } from 'vue'
import { useTaskStore } from './stores/task'

const taskStore = useTaskStore()

// --- 新增：计算属性，用于动态改变样式和文本 ---
const statusClass = computed(() => {
  if (taskStore.isBackendHealthy === true) {
    return 'healthy'
  }
  if (taskStore.isBackendHealthy === false) {
    return 'unhealthy'
  }
  return 'unknown' // isBackendHealthy 为 null
})

const statusText = computed(() => {
  if (taskStore.isBackendHealthy === true) {
    return '后端服务正常'
  }
  if (taskStore.isBackendHealthy === false) {
    return '后端服务异常'
  }
  return '后端状态未知'
})

let healthCheckInterval = null

onMounted(() => {
  // 1. 页面加载后立即执行一次健康检查
  taskStore.performHealthCheck()

  // 2. 然后，每 10 秒执行一次
  healthCheckInterval = setInterval(() => {
    taskStore.performHealthCheck()
  }, 10000) // 10000 毫秒 = 10 秒
})

onUnmounted(() => {
  // 3. 当组件卸载时（例如离开页面），清除定时器以防止内存泄漏
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
  }
})
</script>

<style>
/* 全局样式 (保持不变) */
:root {
  --color-primary: #42b983;
  --color-primary-dark: #33a06f;
  --color-success-bg: #f0f9eb;
  --color-success-border: #e1f3d8;
  --color-success-text: #67c23a;
  --color-error-bg: #fef0f0;
  --color-error-border: #fde2e2;
  --color-error-text: #f56c6c;
  --color-info-bg: #f4f4f5;
  --color-info-border: #e9e9eb;
  --color-info-text: #909399;
  --color-background: #f0f2f5;
  --color-text: #303133;
  --color-heading: #1f2d3d;
  --color-border: #dcdfe6;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  margin: 0;
}

#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
}
</style>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
  padding: 3rem 0;
  background-color: #fff;
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

/* .logo 样式已被移除 */

.wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

h1 {
  font-weight: 600;
  font-size: 2.2rem;
  color: var(--color-heading);
  /* 增加一些底部边距以补偿 logo 移除后的空间 */
  margin-bottom: 0.5rem;
}

header p {
  color: #606266;
  font-size: 1rem;
}

footer {
  text-align: center;
  padding: 2rem 0;
  color: #a9aeb8;
  font-size: 0.9rem;
}

.backend-status {
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f0f2f5;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #606266;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  transition: background-color 0.5s ease;
}

.status-indicator.healthy {
  background-color: #67c23a; /* 绿色 */
  box-shadow: 0 0 8px rgba(103, 194, 58, 0.7);
}

.status-indicator.unhealthy {
  background-color: #f56c6c; /* 红色 */
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.7);
  animation: pulse 1.5s infinite;
}

.status-indicator.unknown {
  background-color: #909399; /* 灰色 */
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(245, 108, 108, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}
</style>
