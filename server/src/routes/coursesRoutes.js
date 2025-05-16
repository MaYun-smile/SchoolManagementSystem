const express = require('express');
const coursesController = require('../controllers/coursesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // 以下接口需要认证
router.get('/', coursesController.getCourses); // 课程列表
// 具体路径路由放在前面
router.get('/selected', coursesController.getSelectedCourses); // 已选课程
router.get('/schedule', coursesController.getSchedule); // 课程表
// 参数化路由放在后面
router.get('/:id', coursesController.getCourseDetail); // 课程详情
router.post('/:id/select', coursesController.selectCourse); // 选课
router.delete('/:id/select', coursesController.cancelSelection); // 退课

module.exports = router; 