// 生成随机成绩
const generateScore = () => {
  // 生成60-100之间的随机分数，保留一位小数
  return Number((Math.random() * 40 + 60).toFixed(1));
};

// 计算绩点
const calculateGradePoint = (score) => {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 82) return 3.3;
  if (score >= 78) return 3.0;
  if (score >= 75) return 2.7;
  if (score >= 72) return 2.3;
  if (score >= 68) return 2.0;
  if (score >= 65) return 1.7;
  if (score >= 62) return 1.3;
  if (score >= 60) return 1.0;
  return 0;
};

// 生成成绩数据
const generateGrades = () => {
  const grades = [];
  // 假设有10个学生，每个学生有5门课程的成绩
  for (let studentId = 1; studentId <= 10; studentId++) {
    for (let courseId = 1; courseId <= 5; courseId++) {
      const score = generateScore();
      grades.push({
        studentId,
        courseId,
        score,
        gradePoint: calculateGradePoint(score),
        semester: '2023-2024-1', // 当前学期
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  return grades;
};

module.exports = generateGrades();