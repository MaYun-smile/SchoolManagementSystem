const { DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'username',
      validate: {
        len: [3, 20]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      set(val) {
        // 将空字符串转为null
        this.setDataValue('email', val || null);
      },
      validate: {
        isEmailOrEmpty(val) {
          if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            throw new Error('请输入有效的邮箱地址');
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'default-avatar.png',
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'active',
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  // 密码比较方法
  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // 转换为JSON时排除敏感信息
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // 定义关联关系
  User.associate = function (models) {
    // 用户-学生一对一关系
    User.hasOne(models.Student, {
      foreignKey: 'userId',
      as: 'studentProfile'
    });

    // 用户-课程一对多关系(教师)
    User.hasMany(models.Course, {
      foreignKey: 'teacherId',
      as: 'teachingCourses'
    });

    // 学生-课程多对多关系
    User.belongsToMany(models.Course, {
      through: models.Selection,
      foreignKey: 'userId',
      as: 'Courses'
    });
  };

  return User;
};