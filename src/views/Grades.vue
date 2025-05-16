<template>
  <div class="grades-container">
    <h1>我的成绩</h1>
    
    <el-card class="grades-card" shadow="hover">
      <div class="card-header">
        <el-select
          v-model="currentSemester"
          placeholder="选择学期"
          clearable
          @change="handleSemesterChange"
        >
          <el-option
            v-for="semester in semesters"
            :key="semester"
            :label="semester"
            :value="semester"
          />
        </el-select>
      </div>

      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>
      <div v-else-if="error" class="error-message">
        <el-alert
          :title="error"
          type="error"
          show-icon
          :closable="false"
        />
      </div>
      <div v-else-if="grades.length === 0" class="empty-message">
        <el-empty :description="currentSemester ? '该学期暂无成绩数据' : '暂无成绩数据'" />
      </div>
      <div v-else>
        <el-table :data="grades" style="width: 100%" border stripe>
          <el-table-column prop="courseName" label="课程名称" min-width="180" />
          <el-table-column prop="courseCode" label="课程代码" min-width="120" />
          <el-table-column prop="credit" label="学分" width="80" />
          <el-table-column prop="score" label="成绩" width="100">
            <template #default="scope">
              <span :class="getScoreClass(scope.row.score)">{{ scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gradePoint" label="绩点" width="80" />
          <el-table-column prop="semester" label="学期" min-width="120" />
        </el-table>
        
        <div class="summary-section">
          <h3>成绩统计</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">总学分</div>
              <div class="summary-value">{{ statistics.totalCredits }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">平均分</div>
              <div class="summary-value">{{ statistics.averageScore.toFixed(2) }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">平均绩点</div>
              <div class="summary-value">{{ statistics.averageGPA.toFixed(2) }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">及格率</div>
              <div class="summary-value">{{ (statistics.passRate * 100).toFixed(1) }}%</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">优秀率</div>
              <div class="summary-value">{{ (statistics.excellentRate * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>
        
        <div class="pagination-container" v-if="total > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  getGrades, 
  getGradeStatistics, 
  getSemesters,
  type Grade, 
  type GradeStatistics 
} from '../api/gradeService'

const currentSemester = ref('')
const semesters = ref<string[]>([])
const statistics = ref<GradeStatistics>({
  totalCredits: 0,
  averageScore: 0,
  averageGPA: 0,
  passRate: 0,
  excellentRate: 0
})

const grades = ref<Grade[]>([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 根据分数返回不同的CSS类名
const getScoreClass = (score: number) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 70) return 'score-average'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}

// 获取成绩数据
const fetchGrades = async () => {
  try {
    loading.value = true
    error.value = ''
    const result = await getGrades(currentPage.value, pageSize.value, currentSemester.value)
    grades.value = result.items
    total.value = result.total
  } catch (err: any) {
    error.value = err.message || '获取成绩数据失败'
    console.error('获取成绩失败:', err)
  } finally {
    loading.value = false
  }
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const result = await getGradeStatistics(currentSemester.value)
    statistics.value = result
  } catch (err: any) {
    console.error('获取统计数据失败:', err)
  }
}

// 获取学期列表
const fetchSemesters = async () => {
  try {
    semesters.value = await getSemesters()
  } catch (err: any) {
    console.error('获取学期列表失败:', err)
  }
}

// 处理学期变化
const handleSemesterChange = async () => {
  await Promise.all([
    fetchGrades(),
    fetchStatistics()
  ])
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchGrades()
}

// 初始化数据
onMounted(async () => {
  await Promise.all([
    fetchSemesters(),
    fetchGrades(),
    fetchStatistics()
  ])
})
</script>

<style scoped>
.grades-container {
  padding: 20px;
}

.grades-card {
  margin-top: 20px;
}

.card-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.loading-container {
  padding: 20px 0;
}

.error-message,
.empty-message {
  padding: 20px 0;
}

.summary-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.summary-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.summary-item {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  min-width: 120px;
  text-align: center;
  flex: 1;
  min-width: 120px;
  max-width: 180px;
}

.summary-label {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.summary-value {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.score-excellent {
  color: #67c23a;
  font-weight: bold;
}

.score-good {
  color: #409eff;
  font-weight: bold;
}

.score-average {
  color: #e6a23c;
}

.score-pass {
  color: #909399;
}

.score-fail {
  color: #f56c6c;
  font-weight: bold;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>