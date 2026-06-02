const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function getRequiredEnv(name) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    throw new Error(`${name} ortam değişkeni tanımlı değil.`);
  }

  return value;
}

function getRequiredNumberEnv(name) {
  const value = Number(getRequiredEnv(name));

  if (!Number.isFinite(value)) {
    throw new Error(`${name} geçerli bir sayı değil.`);
  }

  return value;
}

module.exports = {
  BACKEND_PORT: getRequiredNumberEnv("BACKEND_PORT"),
  CLIENT_URL: getRequiredEnv("CLIENT_URL"),
  DB_HOST: getRequiredEnv("DB_HOST"),
  DB_PORT: getRequiredNumberEnv("DB_PORT"),
  FAKE_AI_URL: getRequiredEnv("FAKE_AI_URL"),
  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
  MQTT_HOST: getRequiredEnv("MQTT_HOST"),
  MQTT_PORT: getRequiredNumberEnv("MQTT_PORT"),
  MQTT_TOPIC: getRequiredEnv("MQTT_TOPIC"),
  POSTGRES_DB: getRequiredEnv("POSTGRES_DB"),
  POSTGRES_PASSWORD: getRequiredEnv("POSTGRES_PASSWORD"),
  POSTGRES_USER: getRequiredEnv("POSTGRES_USER"),
};
