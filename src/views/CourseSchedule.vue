<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSchedule } from '@/api/scheduleService'

interface CourseInfo {
  name: string
  teacher: string
  location: string
}

interface Schedule {
  [key: string]: (CourseInfo | null)[]
}

const schedule = ref<Schedule>({
  '周一': Array(6).fill(null),
  '周二': Array(6).fill(null),
  '周三': Array(6).fill(null),
  '周四': Array(6).fill(null),
  '周五': Array(6).fill(null)
})
const loading = ref(false)

const weekDays = ['周一', '周二', '周三', '周四', '周五']
const timeSlots = ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节']

// 获取课程表
const fetchSchedule = async () => {
  try {
    loading.value = true
    schedule.value = await getSchedule()
  } catch (error: any) {
    ElMessage.error(error || '获取课程表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSchedule()
})
</script>

<template>
  <div class="schedule">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>课程表</h3>
        </div>
      </template>

      <div v-loading="loading" class="schedule-table">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th v-for="day in weekDays" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(slot, index) in timeSlots" :key="slot">
              <td>{{ slot }}</td>
              <td v-for="day in weekDays" :key="day">
                <div v-if="schedule[day]?.[index]" class="course-cell">
                  <div class="course-name">{{ schedule[day][index]?.name }}</div>
                  <div class="course-info">
                    {{ schedule[day][index]?.teacher }}
                    <br>
                    {{ schedule[day][index]?.location }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.schedule {
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

.schedule-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ebeef5;
  padding: 12px;
  text-align: center;
}

th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
}

.course-cell {
  background-color: #ecf5ff;
  padding: 8px;
  border-radius: 4px;
}

.course-name {
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 4px;
}

.course-info {
  font-size: 12px;
  color: #606266;
}
</style>