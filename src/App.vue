<template>
  <div id="app-layout">
    <header>
      <div class="wrapper">
        <!-- Logo 已被移除 -->
        <h1>HDU 自动化单词测试</h1>
        <p>一个由 Go + Vue 驱动的现代 Web 应用</p>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>请合理使用，并对自己的行为负责。© 2025</p>
    </footer>
  </div>
</template>

<script setup>
// 这里不再需要 import logo
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
</style>
