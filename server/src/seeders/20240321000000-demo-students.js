
const Student = require('../models/Student');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const students = require('../../seeders/student_data.json');
    await Student.bulkCreate(students);
  },

  down: async (queryInterface, Sequelize) => {
    await Student.destroy({ where: {} });
  }
};
