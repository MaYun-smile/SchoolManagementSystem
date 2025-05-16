
const { Student } = require('../models');

module.exports = {
  // 获取所有学生
  getStudents: async (req, res) => {
    try {
      const students = await Student.findAll();
      res.json(students);
    } catch (error) {
      res.status(500).json({ 
        message: '获取学生列表失败',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  // 获取单个学生
  getStudent: async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) {
        return res.status(404).json({ message: '未找到该学生' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ 
        message: '获取学生信息失败',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  // 创建学生
  createStudent: async (req, res) => {
    try {
      const student = await Student.create(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ 
        message: '创建学生失败',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  // 更新学生
  updateStudent: async (req, res) => {
    try {
      const [updated] = await Student.update(req.body, {
        where: { id: req.params.id },
        returning: true,
        individualHooks: true
      });
      
      if (!updated) {
        return res.status(404).json({ message: '未找到该学生' });
      }
      
      const student = await Student.findByPk(req.params.id);
      res.json(student);
    } catch (error) {
      res.status(400).json({ 
        message: '更新学生信息失败',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  // 删除学生
  deleteStudent: async (req, res) => {
    try {
      const deleted = await Student.destroy({
        where: { id: req.params.id }
      });
      
      if (!deleted) {
        return res.status(404).json({ message: '未找到该学生' });
      }
      
      res.json({ message: '学生已删除' });
    } catch (error) {
      res.status(500).json({ 
        message: '删除学生失败',
        error: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  }
};
