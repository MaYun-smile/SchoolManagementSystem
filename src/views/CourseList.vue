<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  getCourses as apiGetCourses,
  getSelectedCourses as apiGetSelectedCourses,
  selectCourse as apiSelectCourse,
  cancelCourse as apiCancelCourse,
  getCourseDetail as apiGetCourseDetail
} from '@/api/courseService'

const courseDetail = ref<Course | null>(null)
const detailDialogVisible = ref(false)

interface Course {
  id: number
  code: string
  name: string
  teacher: string
  credit: number
  time: string
  location: string
  capacity: number
  selected: number
  isSelected: boolean
}

const courses = ref<Course[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

// 获取课程列表
const getCourses = async () => {
  try {
    loading.value = true
    const { items, total: totalCount } = await apiGetCourses(
      currentPage.value,
      pageSize.value,
      searchQuery.value
    )
    courses.value = items
    total.value = totalCount
  } catch (error: any) {
    ElMessage.error(error || '获取课程列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  getCourses()
}

const handleSearch = () => {
  currentPage.value = 1
  getCourses()
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getCourses()
}

// 选课
const selectedCourses = ref<number[]>([])

const isCourseSelected = (courseId: number) => {
  return selectedCourses.value.includes(courseId)
}

const selectCourse = async (courseId: number) => {
  try {
    if (isCourseSelected(courseId)) {
      ElMessage.warning('您已选择该课程')
      return
    }

    loading.value = true
    const { message, course: updatedCourse } = await apiSelectCourse(courseId)
    ElMessage.success(message)

    // 更新状态
    courses.value = courses.value.map(c =>
      c.id === courseId ? { ...c, ...updatedCourse } : c
    )
    selectedCourses.value.push(courseId)
  } catch (error: any) {
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error || '选课失败')
    }
  } finally {
    loading.value = false
  }
}

const toggleSelection = async (course: Course) => {
  try {
    if (isCourseSelected(course.id)) {
      await cancelCourse(course.id);
    } else {
      await selectCourse(course.id);
    }
  } catch (error) {
    ElMessage.error(error);
  }
};

const handleRowDblClick = async (row: Course) => {
  try {
    loading.value = true
    courseDetail.value = await apiGetCourseDetail(row.id)
    detailDialogVisible.value = true
  } catch (error: any) {
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.message || '退课失败')
    }
  } finally {
    loading.value = false
  }
}

const cancelCourse = async (courseId: number) => {
  try {
    loading.value = true
    const { message } = await apiCancelCourse(courseId)
    ElMessage.success(message)

    // 更新状态
    const updatedCourse = await apiGetCourseDetail(courseId)
    courses.value = courses.value.map(c =>
      c.id === courseId ? { ...c, ...updatedCourse, isSelected: false } : c
    )
    selectedCourses.value = selectedCourses.value.filter(id => id !== courseId)
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const initSelectedCourses = async () => {
  try {
    const courses = await apiGetSelectedCourses()
    selectedCourses.value = courses
      .filter(course => course?.id != null)
      .map(course => course.id)
  } catch (error) {
    ElMessage.error(error.message)
  }
}

onMounted(async () => {
  await Promise.all([getCourses(), initSelectedCourses()])
})
</script>

<template>
  <div class="course-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>课程列表</h3>
          <el-input v-model="searchQuery" placeholder="输入课程名称或代码搜索" style="width: 300px" clearable @clear="handleSearch"
            @keyup.enter="handleSearch">
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </template>

      <el-table v-loading="loading" :data="courses" style="width: 100%" @row-dblclick="handleRowDblClick">
        <el-table-column prop="code" label="课程代码" width="120" />
        <el-table-column prop="name" label="课程名称" width="200" />
        <el-table-column prop="teacher" label="授课教师" width="120" />
        <el-table-column prop="credit" label="学分" width="80" />
        <el-table-column prop="time" label="上课时间" width="150" />
        <el-table-column prop="location" label="上课地点" width="120" />
        <el-table-column prop="capacity" label="容量" width="100">
          <template #default="{ row }">
            {{ row.selected }}/{{ row.capacity }}
          </template>
        </el-table-column>
        <el-table-column label="是否已选" width="100">
          <template #default="scope">
            <el-checkbox :model-value="isCourseSelected(scope.row.id)" disabled="disabled"
              @change="toggleSelection(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small"
              :disabled="row.selected >= row.capacity || loading || isCourseSelected(row.id)" :loading="loading"
              @click="selectCourse(row.id)" v-show="!isCourseSelected(row.id)">
              {{ row.selected >= row.capacity ? '已满' : '选课' }}
            </el-button>
            <el-button type="danger" size="small" :disabled="loading" @click="cancelCourse(row.id)"
              v-show="isCourseSelected(row.id)">
              退课
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="detailDialogVisible" title="课程详情" width="50%">
        <el-descriptions border v-if="courseDetail">
          <el-descriptions-item label="课程代码">{{ courseDetail.code }}</el-descriptions-item>
          <el-descriptions-item label="课程名称">{{ courseDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="授课教师">{{ courseDetail.teacher }}</el-descriptions-item>
          <el-descriptions-item label="学分">{{ courseDetail.credit }}</el-descriptions-item>
          <el-descriptions-item label="上课时间">{{ courseDetail.time }}</el-descriptions-item>
          <el-descriptions-item label="上课地点">{{ courseDetail.location }}</el-descriptions-item>
          <el-descriptions-item label="课程容量">{{ courseDetail.capacity }}</el-descriptions-item>
          <el-descriptions-item label="已选人数">{{ courseDetail.selected }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @current-change="handlePageChange"
          @size-change="handleSizeChange" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.course-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.el-button--small {
  margin-left: 0;
}
</style>