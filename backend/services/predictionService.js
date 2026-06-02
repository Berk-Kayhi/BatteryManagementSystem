const env = require("../config/env");
const { createReadingFromPrediction } = require("./readingService");

let latestSensorData = null;
let intervalId = null;

function setLatestSensorData(sensorData) {
  latestSensorData = sensorData;
}

async function requestPrediction(sensorData) {
  const response = await fetch(env.FAKE_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      soc: sensorData.soc_pct,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.detail || data?.message || "AI tahmini alınamadı.";
    throw new Error(message);
  }

  return data;
}

async function runPredictionCycle(io) {
  if (!latestSensorData || latestSensorData.soc_pct === undefined) {
    console.log("Tahmin yapmak için sensör verisi bekleniyor...");
    return;
  }

  try {
    const aiPrediction = await requestPrediction(latestSensorData);
    const timestamp = new Date().toISOString();

    io.emit("ai_prediction_data", {
      sensorData: latestSensorData,
      aiPrediction,
      timestamp,
    });

    await createReadingFromPrediction(latestSensorData, aiPrediction);
    console.log(`Kayıt başarılı | timestamp: ${timestamp}`);
  } catch (error) {
    console.error("İşlem döngüsünde bir hata oluştu:", error.message);
  }
}

function startPredictionLoop(io) {
  if (intervalId !== null) {
    return intervalId;
  }

  intervalId = setInterval(() => runPredictionCycle(io), 5000);
  return intervalId;
}

module.exports = {
  setLatestSensorData,
  startPredictionLoop,
};
