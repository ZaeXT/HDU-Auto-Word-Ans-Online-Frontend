import axios from 'axios'

// 创建一个 Axios 实例
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 通过账号密码登录并开始任务
 * @param {object} payload - 包含 username, password, week, exam_type, submit_delay_seconds, correct_count
 * @returns {Promise}
 */
export const loginAndStartTask = (payload) => {
  // === 核心修复：确保这里的路径与 Go 后端 router 中定义的完全一致 ===
  // 错误: '/api/v1/login_and_start_task'
  // 正确: '/api/v1/login-and-start'
  return apiClient.post('/api/v1/login-and-start', payload)
}

/**
 * 通过 Token 开始任务 (备用)
 * @param {string} token - X-Auth-Token
 * @param {object} payload - 包含 week, exam_type, submit_delay_seconds, correct_count
 * @returns {Promise}
 */
export const startTaskWithToken = (token, payload) => {
  // 同样，确保这里的路径也正确
  return apiClient.post('/api/v1/start-test', payload, {
    headers: {
      'X-Auth-Token': token,
    },
  })
}

/**
 * 检查后端健康状态
 * @returns {Promise}
 */
export const checkHealth = () => {
  // 我们给健康检查设置一个很短的超时时间，比如 5 秒
  return apiClient.get('/api/v1/health', { timeout: 5000 })
}
