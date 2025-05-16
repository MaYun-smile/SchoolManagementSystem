const Course = require('../models/Course');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Course.bulkCreate([
      {
        code: 'CS101',
        name: '计算机导论',
        teacher: '张教授',
        credit: 3,
        time: '周一 1',
        location: 'A101',
        capacity: 50,
        selected: 0
      },
      {
        code: 'CS102',
        name: '程序设计基础',
        teacher: '李教授',
        credit: 4,
        time: '周二 2',
        location: 'B203',
        capacity: 40,
        selected: 0
      },
      {
        code: 'CS103',
        name: '数据结构',
        teacher: '王教授',
        credit: 4,
        time: '周三 3',
        location: 'C305',
        capacity: 45,
        selected: 0
      },
      {
        code: 'CS104',
        name: '计算机网络',
        teacher: '刘教授',
        credit: 3,
        time: '周四 4',
        location: 'D407',
        capacity: 35,
        selected: 0
      },
      {
        code: 'CS105',
        name: '操作系统',
        teacher: '陈教授',
        credit: 4,
        time: '周五 5',
        location: 'E509',
        capacity: 30,
        selected: 0
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Course.destroy({ where: {} });
  }
}; 