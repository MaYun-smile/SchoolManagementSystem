
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 检查token有效性
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false
  
  try {
    // 验证token格式
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // 解析payload
    const payload = JSON.parse(atob(parts[1]))
    
    // 验证必要字段
    if (!payload.exp || typeof payload.exp !== 'number') return false
    
    // 检查过期时间
    return payload.exp * 1000 > Date.now()
  } catch (error) {
    console.error('Token验证失败:', error)
    return false
  }
}

// 不需要token校验的API路径
const NO_AUTH_PATHS = [
  '/api/users/login',
  '/api/users/register'
]

// 请求拦截器
service.interceptors.request.use(
  async config => {
    // 跳过不需要认证的请求
    if (NO_AUTH_PATHS.some(path => config.url?.includes(path))) {
      return config
    }

    // 从localStorage获取token
    let token = localStorage.getItem('token')
    
    // 检查token有效性
    if (!isTokenValid(token)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('isLoggedIn')
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 处理未授权
      const originalRequest = error.config
      if (!originalRequest._retry) {
        // 清除所有认证状态
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('isLoggedIn')
        
        // 避免重复跳转
        if (router.currentRoute.value.path !== '/login') {
          ElMessage.error('登录已过期，请重新登录')
          router.push('/login')
        }
      }
    }
    return Promise.reject(error)
  }
)

// 封装通用请求方法
export function request(config) {
  return service(config)
}

// 封装GET请求
export function get(url, params = {}, config = {}) {
  return request({
    url,
    method: 'GET',
    params,
    ...config
  })
}

// 封装POST请求
export function post(url, data = {}, config = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...config
  })
}

// 封装DELETE请求
export function del(url, data = {}, config = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...config
  })
}

// 导出所有方法
export default {
  request: (config) => service(config),
  get,
  post,
  del
}
