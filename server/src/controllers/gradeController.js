const { Grade, Course, Student } = require('../models');
const { Op } = require('sequelize');

// 获取分页成绩列表
exports.getGrades = async (req, res) => {
  try {
    const { page = 1, limit = 10, semester = '' } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    
    // 如果指定了学期，添加学期筛选条件
    if (semester) {
      where.semester = semester;
    }

    // 获取当前用户对应的学生ID
    const student = await Student.findOne({
      where: { userId: req.user.id },
      attributes: ['id']
    });
    
    if (!student) {
      return res.status(404).json({ message: '未找到对应的学生信息' });
    }
    
    where.studentId = student.id;

    const { count, rows } = await Grade.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: Course,
        as: 'course',
        attributes: ['name', 'code', 'credit']
      }],
      order: [['semester', 'DESC'], ['courseId', 'ASC']]
    });

    // 格式化返回数据
    const items = rows.map(grade => ({
      id: grade.id,
      courseName: grade.course.name,
      courseCode: grade.course.code,
      credit: grade.course.credit,
      score: grade.score,
      gradePoint: grade.gradePoint,
      semester: grade.semester,
      comment: grade.comment
    }));

    res.json({
      items,
      total: count
    });
  } catch (error) {
    console.error('获取成绩列表失败:', error);
    res.status(500).json({ message: '获取成绩列表失败' });
  }
};

// 获取所有成绩（不分页）
exports.getAllGrades = async (req, res) => {
  try {
    const { semester = '' } = req.query;
    
    // 获取当前用户对应的学生ID
    const student = await Student.findOne({
      where: { userId: req.user.id },
      attributes: ['id']
    });
    
    if (!student) {
      return res.status(404).json({ message: '未找到对应的学生信息' });
    }
    
    const where = { studentId: student.id };
    
    if (semester) {
      where.semester = semester;
    }

    const grades = await Grade.findAll({
      where,
      include: [{
        model: Course,
        as: 'course',
        attributes: ['name', 'code', 'credit']
      }],
      order: [['semester', 'DESC'], ['courseId', 'ASC']]
    });

    const formattedGrades = grades.map(grade => ({
      id: grade.id,
      courseName: grade.course.name,
      courseCode: grade.course.code,
      credit: grade.course.credit,
      score: grade.score,
      gradePoint: grade.gradePoint,
      semester: grade.semester,
      comment: grade.comment
    }));

    res.json(formattedGrades);
  } catch (error) {
    console.error('获取所有成绩失败:', error);
    res.status(500).json({ message: '获取所有成绩失败' });
  }
};

// 获取成绩统计信息
exports.getStatistics = async (req, res) => {
  try {
    const { semester = '' } = req.query;
    
    // 获取当前用户对应的学生ID
    const student = await Student.findOne({
      where: { userId: req.user.id },
      attributes: ['id']
    });
    
    if (!student) {
      return res.status(404).json({ message: '未找到对应的学生信息' });
    }
    
    const where = { studentId: student.id };
    
    if (semester) {
      where.semester = semester;
    }

    const grades = await Grade.findAll({
      where,
      include: [{
        model: Course,
        as: 'course',
        attributes: ['credit']
      }]
    });

    if (grades.length === 0) {
      return res.json({
        totalCredits: 0,
        averageScore: 0,
        averageGPA: 0,
        passRate: 0,
        excellentRate: 0
      });
    }

    let totalCredits = 0;
    let weightedScore = 0;
    let weightedGPA = 0;
    let passCount = 0;
    let excellentCount = 0;

    grades.forEach(grade => {
      const credit = grade.course.credit;
      totalCredits += credit;
      weightedScore += grade.score * credit;
      weightedGPA += grade.gradePoint * credit;
      
      if (grade.score >= 60) passCount++;
      if (grade.score >= 90) excellentCount++;
    });

    const statistics = {
      totalCredits,
      averageScore: weightedScore / totalCredits,
      averageGPA: weightedGPA / totalCredits,
      passRate: passCount / grades.length,
      excellentRate: excellentCount / grades.length
    };

    res.json(statistics);
  } catch (error) {
    console.error('获取成绩统计失败:', error);
    res.status(500).json({ message: '获取成绩统计失败' });
  }
};

// 获取可用学期列表
exports.getSemesters = async (req, res) => {
  try {
    // 获取当前用户对应的学生ID
    const student = await Student.findOne({
      where: { userId: req.user.id },
      attributes: ['id']
    });
    
    if (!student) {
      return res.status(404).json({ message: '未找到对应的学生信息' });
    }
    
    const grades = await Grade.findAll({
      where: { studentId: student.id },
      attributes: ['semester'],
      group: ['semester'],
      order: [['semester', 'DESC']]
    });

    const semesters = grades.map(grade => grade.semester);
    res.json(semesters);
  } catch (error) {
    console.error('获取学期列表失败:', error);
    res.status(500).json({ message: '获取学期列表失败' });
  }
};

// 获取特定课程的成绩
exports.getGradeByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // 获取当前用户对应的学生ID
    const student = await Student.findOne({
      where: { userId: req.user.id },
      attributes: ['id']
    });
    
    if (!student) {
      return res.status(404).json({ message: '未找到对应的学生信息' });
    }
    
    const grade = await Grade.findOne({
      where: {
        studentId: student.id,
        courseId
      },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['name', 'code', 'credit']
      }]
    });

    if (!grade) {
      return res.status(404).json({ message: '未找到该课程成绩' });
    }

    const formattedGrade = {
      id: grade.id,
      courseName: grade.course.name,
      courseCode: grade.course.code,
      credit: grade.course.credit,
      score: grade.score,
      gradePoint: grade.gradePoint,
      semester: grade.semester,
      comment: grade.comment
    };

    res.json(formattedGrade);
  } catch (error) {
    console.error('获取课程成绩失败:', error);
    res.status(500).json({ message: '获取课程成绩失败' });
  }
};