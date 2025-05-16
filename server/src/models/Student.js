const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
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
    class: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      default: Date.now
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'active',
      allowNull: false
    }
  });
  // 定义关联关系
  Student.associate = function(models) {
    // 学生-课程多对多关系
    Student.belongsToMany(models.Course, {
      through: 'CourseStudents',
      foreignKey: 'studentId',
      // 禁用自动索引
      indexes: false
    });
    
    // 学生-用户一对一关系
    Student.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userInfo'
    });
  };

  return Student;
}