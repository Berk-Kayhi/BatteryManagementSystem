const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BatteryReading extends Model {}

  BatteryReading.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      readingTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "reading_timestamp",
      },
      aiSoc: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: "ai_soc",
      },
      sensorSoc: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: "sensor_soc",
      },
      sohPct: {
        type: DataTypes.DECIMAL(5, 2),
        field: "soh_pct",
      },
      voltageDiffV: {
        type: DataTypes.DECIMAL(8, 4),
        field: "voltage_diff_v",
      },
      maxCellVoltageV: {
        type: DataTypes.DECIMAL(8, 4),
        field: "max_cell_voltage_v",
      },
      currentA: {
        type: DataTypes.DECIMAL(8, 4),
        field: "current_a",
      },
      powerKw: {
        type: DataTypes.DECIMAL(8, 4),
        field: "power_kw",
      },
      voltageV: {
        type: DataTypes.DECIMAL(8, 4),
        field: "voltage_v",
      },
    },
    {
      sequelize,
      modelName: "BatteryReading",
      tableName: "timestamp_",
      timestamps: false,
    },
  );

  return BatteryReading;
};
