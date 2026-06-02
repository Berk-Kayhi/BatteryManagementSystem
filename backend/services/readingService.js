const { BatteryReading } = require("../models");

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function formatReading(reading) {
  const plainReading = reading.get ? reading.get({ plain: true }) : reading;

  return {
    id: plainReading.id,
    reading_timestamp: plainReading.readingTimestamp,
    ai_soc: plainReading.aiSoc,
    sensor_soc: plainReading.sensorSoc,
    soh_pct: plainReading.sohPct,
    voltage_diff_v: plainReading.voltageDiffV,
    max_cell_voltage_v: plainReading.maxCellVoltageV,
    current_a: plainReading.currentA,
    power_kw: plainReading.powerKw,
    voltage_v: plainReading.voltageV,
  };
}

async function createReadingFromPrediction(sensorData, aiPrediction) {
  const reading = await BatteryReading.create({
    readingTimestamp: new Date(),
    aiSoc: toNumberOrNull(aiPrediction.predicted_soc),
    sensorSoc: toNumberOrNull(sensorData.soc_pct),
    sohPct: toNumberOrNull(sensorData.soh_pct),
    voltageDiffV: toNumberOrNull(sensorData.voltage_diff_V),
    maxCellVoltageV: toNumberOrNull(sensorData.max_cell_voltage_V),
    currentA: toNumberOrNull(sensorData.current_A),
    powerKw: toNumberOrNull(sensorData.power_kW),
    voltageV: toNumberOrNull(sensorData.voltage_V),
  });

  return formatReading(reading);
}

async function getAllReadings() {
  const readings = await BatteryReading.findAll({
    order: [["readingTimestamp", "ASC"]],
  });

  return readings.map(formatReading);
}

async function getLatestReadings(limit = 10) {
  const readings = await BatteryReading.findAll({
    order: [["readingTimestamp", "DESC"]],
    limit,
  });

  return readings.map(formatReading);
}

module.exports = {
  createReadingFromPrediction,
  getAllReadings,
  getLatestReadings,
};
