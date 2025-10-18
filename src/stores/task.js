import { defineStore } from 'pinia'
import { loginAndStartTask, checkHealth } from '@/api'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const isBackendHealthy = ref(null) // null: 未知, true: 健康, false: 异常
  const isLoading = ref(false)
  const resultMessage = ref('')
  const errorMessage = ref('')
  const successToken = ref('')

  const processingMessage = ref('')

  async function performHealthCheck() {
    try {
      const response = await checkHealth()
      // 只要能收到 200 OK 且 status 是 UP，就认为是健康的
      if (response.status === 200 && response.data?.status === 'UP') {
        isBackendHealthy.value = true
      } else {
        isBackendHealthy.value = false
      }
    } catch (error) {
      // 任何网络错误都视为不健康
      console.error('Health check failed:', error)
      isBackendHealthy.value = false
    }
  }

  async function runTask(payload) {
    isLoading.value = true
    resultMessage.value = ''
    errorMessage.value = ''
    successToken.value = ''
    processingMessage.value = '任务正在处理中，请稍候...'

    try {
      const response = await loginAndStartTask(payload)
      resultMessage.value = response.data.message || '任务成功完成！'
      if (response.data.x_auth_token) {
        successToken.value = response.data.x_auth_token
      }
    } catch (error) {
      if (error.response) {
        errorMessage.value = error.response.data.error || '发生未知错误'
        if (error.response.data.details) {
          errorMessage.value += ` (${error.response.data.details})`
        }
      } else if (error.request) {
        errorMessage.value = '无法连接到服务器，请检查后端是否正在运行。'
      } else {
        errorMessage.value = `请求设置错误: ${error.message}`
      }
    } finally {
      isLoading.value = false
      processingMessage.value = ''
    }
  }

  function clearMessages() {
    resultMessage.value = ''
    errorMessage.value = ''
    processingMessage.value = ''
  }

  return {
    isBackendHealthy,
    performHealthCheck,

    isLoading,
    resultMessage,
    errorMessage,
    successToken,
    processingMessage,
    runTask,
    clearMessages,
  }
})
