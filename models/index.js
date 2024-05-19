const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
});

const models = {
    Question: require('./Question')(sequelize, Sequelize.DataTypes),
    Answer: require('./Answer')(sequelize, Sequelize.DataTypes),
    Evaluation: require('./Evaluation')(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
