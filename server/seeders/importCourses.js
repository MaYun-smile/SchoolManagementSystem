
const { Course } = require('../src/models');
const courseData = require('./course_data');

module.exports = {
  up: async () => {
    try {
      const data = courseData;
      await Course.bulkCreate(data);
      console.log(`成功导入${data.length}条课程数据`);
    } catch (error) {
      console.error('导入课程数据失败:', error);
    }
  },
  
  down: async () => {
    await Course.destroy({ where: {}, truncate: true });
  }
};
