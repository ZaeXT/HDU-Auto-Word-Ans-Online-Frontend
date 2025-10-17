import { defineStore } from 'pinia'
import { loginAndStartTask } from '@/api'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const isLoading = ref(false)
  const resultMessage = ref('')
  const errorMessage = ref('')
  const successToken = ref('')

  async function runTask(payload) {
    isLoading.value = true
    resultMessage.value = ''
    errorMessage.value = ''
    successToken.value = ''

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
    }
  }

  function clearMessages() {
    resultMessage.value = ''
    errorMessage.value = ''
  }

  return {
    isLoading,
    resultMessage,
    errorMessage,
    successToken,
    runTask,
    clearMessages,
  }
})
