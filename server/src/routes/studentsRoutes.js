const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const authMiddleware = require('../middleware/authMiddleware');
// 需认证接口
router.use(authMiddleware); // 以下接口需要认证
// 学生路由
router.get('/', studentsController.getStudents); // 获取所有学生
router.get('/:id', studentsController.getStudent); // 获取单个学生
router.post('/', studentsController.createStudent); // 创建学生
router.put('/:id', studentsController.updateStudent); // 更新学生
router.delete('/:id', studentsController.deleteStudent); // 删除学生

module.exports = router;