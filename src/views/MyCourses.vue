
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSelectedCourses as apiGetSelectedCourses } from '@/api/courseService'

interface Course {
  id: number
  code: string
  name: string
  teacher: string
  credit: number
  time: string
  location: string
}

const courses = ref<Course[]>([])
const loading = ref(false)

// 获取已选课程
const getMyCourses = async () => {
  try {
    loading.value = true
    courses.value = await apiGetSelectedCourses()
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getMyCourses()
})
</script>

<template>
  <div class="my-courses">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>我的课程</h3>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="courses"
        style="width: 100%"
      >
        <el-table-column prop="code" label="课程代码" width="120" />
        <el-table-column prop="name" label="课程名称" width="200" />
        <el-table-column prop="teacher" label="授课教师" width="120" />
        <el-table-column prop="credit" label="学分" width="80" />
        <el-table-column prop="time" label="上课时间" width="150" />
        <el-table-column prop="location" label="上课地点" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.my-courses {
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
</style>
