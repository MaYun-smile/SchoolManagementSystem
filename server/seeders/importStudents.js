
const { Student } = require('../src/models');
const studentData = require('./students_data');

module.exports = {
  up: async () => {
    try {
      const data = studentData;
      await Student.bulkCreate(data);
      console.log(`成功导入${data.length}条学生数据`);
    } catch (error) {
      console.error('导入学生数据失败:', error);
    }
  },
  
  down: async () => {
    await Student.destroy({ where: {}, truncate: true });
  }
};
