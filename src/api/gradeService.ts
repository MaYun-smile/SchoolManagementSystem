import http from './httpService'

// 成绩类型定义
export interface Grade {
  id: number
  courseName: string
  courseCode: string
  credit: number
  score: number
  gradePoint: number
  semester: string
  comment?: string
}

// 成绩统计信息类型
export interface GradeStatistics {
  totalCredits: number
  averageScore: number
  averageGPA: number
  passRate: number
  excellentRate: number
}

// 分页成绩结果类型
export interface PaginatedGrades {
  items: Grade[]
  total: number
}

/**
 * 获取当前学生的所有成绩
 * @param page 页码
 * @param limit 每页数量
 * @param semester 学期筛选
 * @returns 分页成绩数据
 */
export const getGrades = async (
  page = 1, 
  limit = 10, 
  semester = ''
): Promise<PaginatedGrades> => {
  try {
    const response = await http.get('/api/grades', {
      params: { page, limit, semester }
    })
    return {
      items: response.data.items || [],
      total: response.data.total || 0
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取成绩信息失败')
  }
}

/**
 * 获取当前学生的所有成绩（不分页）
 * @param semester 学期筛选（可选）
 * @returns 成绩数组
 */
export const getAllGrades = async (semester = ''): Promise<Grade[]> => {
  try {
    const response = await http.get('/api/grades/all', {
      params: { semester }
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取成绩信息失败')
  }
}

/**
 * 获取特定课程的成绩
 * @param courseId 课程ID
 * @returns 成绩信息
 */
export const getGradeByCourseId = async (courseId: number): Promise<Grade> => {
  try {
    const response = await http.get(`/api/grades/course/${courseId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取课程成绩失败')
  }
}

/**
 * 获取成绩统计信息
 * @param semester 学期筛选（可选）
 * @returns 成绩统计信息
 */
export const getGradeStatistics = async (semester = ''): Promise<GradeStatistics> => {
  try {
    const response = await http.get('/api/grades/statistics', {
      params: { semester }
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取成绩统计信息失败')
  }
}

/**
 * 获取可用的学期列表
 * @returns 学期列表
 */
export const getSemesters = async (): Promise<string[]> => {
  try {
    const response = await http.get('/api/grades/semesters')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取学期列表失败')
  }
}