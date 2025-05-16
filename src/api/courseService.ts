
import http from './httpService'
import type { Course } from '@/types'

export const getCourses = async (page = 1, limit = 10, search = ''): Promise<PaginatedCourses> => {
  try {
    const response = await http.get('/api/courses', {
      params: { page, limit, search }
    })
    return {
      items: response.data.items || [],
      total: response.data.total || 0
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取课程列表失败')
  }
}
export const getSelectedCourses = async (): Promise<Course[]> => {
  try {
    const response = await http.get('/api/courses/selected')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取已选课程失败')
  }
}

export const selectCourse = async (courseId: number): Promise<{
  message: string
  course: Course
}> => {
  try {
    const response = await http.post(`/api/courses/${courseId}/select`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取课程失败')
  }
}

export const cancelCourse = async (courseId: number): Promise<{
  message: string
  course: Course
}> => {
  try {
    const response = await http.del(`/api/courses/${courseId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '退课程失败')
  }
}

export const getCourseDetail = async (courseId: number): Promise<Course> => {
  try {
    const response = await http.get(`/api/courses/${courseId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取课程详情失败')
  }
}