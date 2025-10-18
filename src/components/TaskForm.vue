<template>
  <div class="task-form-container">
    <h2>开始自动化任务</h2>
    <p class="subtitle">输入您的凭据以开始。</p>

    <!-- === 新增：处理中消息框 === -->
    <!-- 这个消息框只在 processingMessage 有内容，且没有最终结果时显示 -->
    <div
      v-if="taskStore.processingMessage && !taskStore.resultMessage && !taskStore.errorMessage"
      class="message info"
    >
      <div class="icon">
        <span class="processing-spinner"></span>
      </div>
      <span>{{ taskStore.processingMessage }}</span>
    </div>

    <!-- 结果/错误信息展示 -->
    <div v-if="taskStore.errorMessage" class="message error">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          ></path>
        </svg>
      </div>
      <span>{{ taskStore.errorMessage }}</span>
    </div>
    <div v-if="taskStore.resultMessage" class="message success">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          ></path>
        </svg>
      </div>
      <span>{{ taskStore.resultMessage }}</span>
    </div>
    <div v-if="taskStore.successToken" class="message token-info">
      <strong>获取到的 Token (已自动复制):</strong>
      <input
        type="text"
        :value="taskStore.successToken"
        readonly
        @focus="copyToken"
        ref="tokenInput"
      />
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名 / Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          placeholder="请输入你的用户名"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">密码 / Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="请输入你的密码"
          required
        />
      </div>

      <details class="advanced-settings">
        <summary>高级设置 (可选)</summary>
        <div class="settings-content">
          <div class="form-group">
            <label for="examType">模式 / Mode</label>
            <select id="examType" v-model.number="form.examType">
              <option :value="0">测试 (Test)</option>
              <option :value="1">考试 (Exam)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="week">周数 / Week</label>
            <input
              id="week"
              v-model.number="form.week"
              type="number"
              min="1"
              placeholder="留空则自动获取"
            />
          </div>

          <div class="form-group">
            <label for="correctCount">目标正确题数 / Correct Count</label>
            <input
              id="correctCount"
              v-model.number="form.correctCount"
              type="number"
              min="0"
              max="100"
              placeholder="0-100, 留空则全对"
            />
          </div>

          <div class="form-group">
            <label for="delay">提交总时长 (秒) / Total Duration (s)</label>
            <input
              id="delay"
              v-model.number="form.delay"
              type="number"
              min="0"
              placeholder="例如: 300 (5分钟)"
            />
          </div>
        </div>
      </details>

      <button type="submit" :disabled="taskStore.isLoading">
        <span v-if="taskStore.isLoading"> <span class="spinner"></span> 正在执行... </span>
        <span v-else>登录并开始任务</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()
const tokenInput = ref(null)

const form = reactive({
  username: '',
  password: '',
  week: null,
  correctCount: null,
  delay: null,
  examType: 0,
})

const handleSubmit = () => {
  taskStore.clearMessages()
  const payload = {
    username: form.username,
    password: form.password,
    exam_type: form.examType,
  }
  if (form.week) payload.week = form.week
  if (form.correctCount !== null && form.correctCount !== '') {
    const count = parseInt(form.correctCount, 10)
    if (isNaN(count) || count >= 0) {
      payload.correct_count = count
    }
  }
  if (form.delay) payload.submit_delay_seconds = form.delay

  taskStore.runTask(payload)
}

const copyToken = (event) => {
  event.target.select()
  try {
    navigator.clipboard.writeText(taskStore.successToken)
    alert('Token 已复制到剪贴板！')
  } catch (err) {
    alert('自动复制失败，错误信息: ' + err.message)
  }
}
</script>

<style scoped>
.task-form-container {
  max-width: 480px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  background: #fff;
  border: 1px solid #ebeef5;
}

h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.subtitle {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2.5rem;
  color: #909399;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #606266;
}

input,
select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.advanced-settings {
  margin: 2rem 0;
  border: 1px solid #e9e9eb;
  border-radius: 8px;
  padding: 0.5rem;
}

.advanced-settings summary {
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  padding: 0.5rem;
  outline: none;
}

.settings-content {
  padding: 1.5rem 0.5rem 0 0.5rem;
}

button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-image: linear-gradient(to right, #42b983, #2a9d8f);
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

button:disabled {
  background-image: none;
  background-color: #c8c9cc;
  cursor: not-allowed;
  box-shadow: none;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.15);
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.message .icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.message svg {
  width: 100%;
  height: 100%;
}

.success {
  background-color: var(--color-success-bg);
  color: var(--color-success-text);
  border: 1px solid var(--color-success-border);
}
.success .icon {
  color: var(--color-success-text);
}

.error {
  background-color: var(--color-error-bg);
  color: var(--color-error-text);
  border: 1px solid var(--color-error-border);
}
.error .icon {
  color: var(--color-error-text);
}

.token-info {
  background-color: var(--color-info-bg);
  border: 1px solid var(--color-info-border);
  color: var(--color-info-text);
  display: block;
}

.token-info input {
  margin-top: 0.5rem;
  background-color: #fff;
  color: #333;
  cursor: pointer;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* === 新增：为 info/processing 消息框添加样式 === */
.info {
  background-color: var(--color-info-bg);
  color: var(--color-info-text);
  border: 1px solid var(--color-info-border);
}
.info .icon {
  color: var(--color-info-text);
}

.processing-spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-info-text);
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

.spinner {
  /* 按钮内的白色 spinner */
  border: 3px solid rgba(255, 255, 255, 0.3);
  /* ... (其余不变) */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
