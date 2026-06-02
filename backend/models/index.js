const { Sequelize, DataTypes } = require("sequelize");
const env = require("../config/env");

const sequelize = new Sequelize(
  env.POSTGRES_DB,
  env.POSTGRES_USER,
  env.POSTGRES_PASSWORD,
  {
    dialect: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    logging: false,
  },
);

const db = {
  BatteryReading: require("./BatteryReading")(sequelize, DataTypes),
  User: require("./User")(sequelize, DataTypes),
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
