const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
  }
);

const User = require('./User')(sequelize);
const Student = require('./Student')(sequelize);
const Course = require('./Course')(sequelize);
const Selection = require('./Selection')(sequelize);
const Grade = require('./Grade')(sequelize);
const models = {
  User,Student,Course,Selection,Grade
};

// 建立模型之间的关联关系
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models
}; 