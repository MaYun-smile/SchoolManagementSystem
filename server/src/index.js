require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Course, Student } = require('./models');
const userRoutes = require('./routes/userRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/users', userRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/grades', gradeRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

const PORT = process.env.PORT || 5000;

// 启动服务器
const startServer = async () => {
  try {
    // 同步数据库结构
    await sequelize.sync({ alter: true });
    console.log('数据库已同步');

    // 初始化数据
    const courseCount = await Course.count();
    const studentCount = await Student.count();
    
    if (courseCount === 0) {
      const courses = require('../seeders/course_data');
      await Course.bulkCreate(courses);
      console.log(`已初始化 ${courses.length} 条课程数据`);
    }

    if (studentCount === 0) {
      const students = require('../seeders/students_data');
      await Student.bulkCreate(students);
      console.log(`已初始化 ${students.length} 条学生数据`);
    }
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
};

startServer(); 