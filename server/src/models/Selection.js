
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Selection = sequelize.define('Selection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'Selections',
    // 禁用自动添加的外键列
    underscored: true,
    freezeTableName: true,
    // 禁用自动索引
    indexes: []
  });

  // 定义关联关系
  Selection.associate = function(models) {
    Selection.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User'
    });
    Selection.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'Students'
    });
  };

  return Selection;
};
