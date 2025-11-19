const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketIO = require("socket.io");

const mqttClientInit = require("./mqttClient");
const axios = require("axios");
require("dotenv").config();
const pool = require("./db");

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));

app.use("/data", require("./routes/dataRoutes"));

app.get("/", (req, res) => res.send("Backend Çalışıyor!"));

const server = http.createServer(app);

const io = new SocketIO.Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let latestSensorData = null;

const mqttClient = mqttClientInit(io);
mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    latestSensorData = data;
    io.emit("live_data", data);
  } catch (e) {
    console.error("Gelen MQTT mesajı ayrıştırılamadı:", e);
  }
});

const runPredictionCycle = async () => {
  if (!latestSensorData || latestSensorData.soc_pct === undefined) {
    console.log("Tahmin yapmak için sensör verisi bekleniyor...");
    return;
  }

  try {
    const response = await axios.post("http://fake-ai:8001/predict", {
      soc: latestSensorData.soc_pct,
    });

    const aiPrediction = response.data;
    io.emit("ai_prediction_data", {
      sensorData: latestSensorData,
      aiPrediction: aiPrediction,
      timestamp: new Date().toISOString(),
    });

    const {
      soc_pct,
      soh_pct,
      voltage_diff_V,
      max_cell_voltage_V,
      current_A,
      power_kW,
      voltage_V,
    } = latestSensorData;
    const { predicted_soc } = aiPrediction;
    const timestamp = new Date();

    await pool.query(
      "INSERT INTO timestamp_ (reading_timestamp, ai_soc, sensor_soc, soh_pct, voltage_diff_V, max_cell_voltage_V, current_a, power_kw, voltage_v) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        timestamp,
        predicted_soc,
        soc_pct,
        soh_pct,
        voltage_diff_V,
        max_cell_voltage_V,
        current_A,
        power_kW,
        voltage_V,
      ]
    );
    console.log(
      `✅ Kayıt Başarılı | timestamp: ${timestamp}`
    );
  } catch (error) {
    console.error("İşlem döngüsünde bir hata oluştu:", error.message);
  }
};

setInterval(runPredictionCycle, 5000);

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Kullanıcı bağlandı: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`[Socket.IO] Kullanıcı ayrıldı: ${socket.id}`);
  });
});

mqttClientInit(io);

server.listen(PORT, () => {
  console.log(
    `Backend çalışıyor ve ${PORT} portunu dinliyor (HTTP + Socket.IO)`
  );
});

module.exports = app;
