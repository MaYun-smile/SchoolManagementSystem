const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    teacher: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50
    },
    selected: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
  // 定义关联关系
  Course.associate = function(models) {
    // 课程-学生多对多关系
    Course.belongsToMany(models.User, {
      through: models.Selection,
      foreignKey: 'courseId',
      otherKey: 'userId',
      as: 'Students'
    });
    
    // 添加与Selection的直接关联
    Course.hasMany(models.Selection, {
      foreignKey: 'courseId',
      as: 'Selections'
    });
    
    // 课程-教师多对一关系
    Course.belongsTo(models.User, {
      foreignKey: 'teacherId',
      as: 'teacherInfo'
    });
  };

  return Course;
};
