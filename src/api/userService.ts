
import { post } from './httpService'

export const login = async (credentials: { username: string, password: string }) => {
  try {
    const response = await post('/api/users/login', credentials)
    if (!response?.data?.token) {
      throw new Error('服务器返回无效的认证令牌')
    }
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message ||
      error.message ||
      '登录失败，请检查用户名和密码'
    throw new Error(message)
  }
}

export const register = async (userData: {
  username: string,
  email: string,
  password: string
}) => {

  try {
    const response = await post('/api/users/register', userData)
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message ||
      error.message ||
      '注册失败，请检查用户名和密码以及确认密码'
    throw new Error(message)
  }
}
