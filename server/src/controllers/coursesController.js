
const { Course, Selection, User, sequelize } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // 获取课程列表
  getCourses: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      // 构建查询条件
      const where = {};
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { code: { [Op.like]: `%${search}%` } }
        ];
      }

      // 先获取课程总数
      const count = await Course.count({ where });
      
      // 获取课程列表
      const courses = await Course.findAll({
        where,
        limit,
        offset,
        order: [['code', 'ASC']]
      });

      // 获取当前用户已选课程ID
      const selections = await Selection.findAll({
        where: { userId: req.user.id },
        attributes: ['courseId']
      });
      const selectedCourseIds = selections.map(s => s.courseId);

      // 合并选课状态
      const coursesWithSelection = courses.map(course => ({
        ...course.toJSON(),
        isSelected: selectedCourseIds.includes(course.id)
      }));

      res.json({
        total: count,
        items: coursesWithSelection
      });
    } catch (error) {
      res.status(500).json({ 
        message: '获取课程列表失败',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  // 获取课程详情
  getCourseDetail: async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ message: '课程不存在' });
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: '获取课程详情失败', error: error.message });
    }
  },

  // 选课操作
  selectCourse: async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ message: '课程不存在' });

      if (course.selected >= course.capacity) {
        return res.status(400).json({ message: '课程已满' });
      }

      const transaction = await sequelize.transaction();
      try {
        // 先删除可能存在的重复记录
        await Selection.destroy({
          where: { userId: req.user.id, courseId: course.id },
          transaction
        });
        
        // 锁定课程记录
        const lockedCourse = await Course.findByPk(course.id, {
          lock: transaction.LOCK.UPDATE,
          transaction
        });
        
        if (lockedCourse.selected >= lockedCourse.capacity) {
          await transaction.rollback();
          return res.status(400).json({ message: '课程已满' });
        }

        // 创建新记录
        await Selection.create({ 
          userId: req.user.id, 
          courseId: course.id 
        }, { transaction });
        
        await Course.update(
          { selected: sequelize.literal('selected + 1') },
          { 
            where: { id: course.id },
            transaction
          }
        );
        const updatedCourse = await Course.findByPk(course.id, { 
          transaction,
          lock: transaction.LOCK.UPDATE 
        });
        
        await transaction.commit();
        res.json({ 
          message: '选课成功',
          course: updatedCourse 
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      res.status(500).json({ message: '选课失败', error: error.message });
    }
  },

  // 退课操作
  cancelSelection: async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ message: '课程不存在' });

      const selection = await Selection.findOne({
        where: { userId: req.user.id, courseId: course.id }
      });
      if (!selection) return res.status(400).json({ message: '未选择该课程' });

      await selection.destroy();
      await course.decrement('selected');
      
      res.json({ message: '退课成功' });
    } catch (error) {
      res.status(500).json({ message: '退课失败', error: error.message });
    }
  },

  // 获取已选课程
  getSelectedCourses: async (req, res) => {
    try {
      const courses = await Course.findAll({
        include: [{
          model: Selection,
          as: 'Selections',
          where: { userId: req.user.id },
          attributes: [],
          required: true
        }],
        attributes: ['id', 'code', 'name', 'teacher', 'credit', 'time', 'location']
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: '获取已选课程失败', error: error.message });
    }
  },

  // 获取课程表
  getSchedule: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Course, 
          as: 'Courses',
          through: { attributes: [] }
        }]
      });

      const schedule = {
        '周一': Array(6).fill(null),
        '周二': Array(6).fill(null),
        '周三': Array(6).fill(null),
        '周四': Array(6).fill(null),
        '周五': Array(6).fill(null)
      };

      user.Courses.forEach(course => {
        const [day, slot] = course.time.split(' ');
        if (schedule[day]) {
          schedule[day][parseInt(slot) - 1] = {
            name: course.name,
            teacher: course.teacher,
            location: course.location
          };
        }
      });

      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: '获取课程表失败', error: error.message });
    }
  }
};