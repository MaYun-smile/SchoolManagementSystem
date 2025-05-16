
import http from './httpService'
import type { Schedule } from '@/types'

export const getSchedule = async (): Promise<Schedule> => {
  try {
    const response = await http.get('/api/courses/schedule')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取课程表失败')
  }
}

export const updateSchedule = async (schedule: Schedule): Promise<Schedule> => {
  try {
    const response = await http.post('/api/courses/schedule', schedule)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '更新课程表失败')
  }
}
