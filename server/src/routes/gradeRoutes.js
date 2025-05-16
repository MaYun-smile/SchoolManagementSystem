const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authMiddleware = require('../middleware/authMiddleware');

// 所有成绩路由都需要身份验证
router.use(authMiddleware);

// 获取分页成绩列表
router.get('/', gradeController.getGrades);

// 获取所有成绩（不分页）
router.get('/all', gradeController.getAllGrades);

// 获取成绩统计信息
router.get('/statistics', gradeController.getStatistics);

// 获取可用学期列表
router.get('/semesters', gradeController.getSemesters);

// 获取特定课程的成绩
router.get('/course/:courseId', gradeController.getGradeByCourse);

module.exports = router;