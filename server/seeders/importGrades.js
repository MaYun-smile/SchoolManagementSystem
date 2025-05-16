const { Grade } = require('../src/models');
const gradeData = require('./grades_data');

module.exports = {
  up: async () => {
    try {
      const data = gradeData;
      await Grade.bulkCreate(data);
      console.log(`成功导入${data.length}条成绩数据`);
    } catch (error) {
      console.error('导入成绩数据失败:', error);
    }
  },
  
  down: async () => {
    await Grade.destroy({ where: {}, truncate: true });
  }
};