const http = require("http");
const SocketIO = require("socket.io");
const app = require("./app");
const env = require("./config/env");
const { sequelize } = require("./models");
const { startMqttClient } = require("./services/mqttService");
const {
  setLatestSensorData,
  startPredictionLoop,
} = require("./services/predictionService");

const server = http.createServer(app);

const io = new SocketIO.Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const DB_CONNECT_MAX_RETRIES = 20;
const DB_CONNECT_RETRY_DELAY_MS = 1500;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Kullanıcı bağlandı: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`[Socket.IO] Kullanıcı ayrıldı: ${socket.id}`);
  });
});

async function connectDatabaseWithRetry() {
  for (let attempt = 1; attempt <= DB_CONNECT_MAX_RETRIES; attempt += 1) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log("PostgreSQL bağlantısı başarılı.");
      return;
    } catch (error) {
      const isLastAttempt = attempt === DB_CONNECT_MAX_RETRIES;

      if (isLastAttempt) {
        throw error;
      }

      console.log(
        `PostgreSQL bağlantısı bekleniyor (${attempt}/${DB_CONNECT_MAX_RETRIES}): ${error.message}`,
      );
      await wait(DB_CONNECT_RETRY_DELAY_MS);
    }
  }
}

async function startServer() {
  try {
    await connectDatabaseWithRetry();

    startMqttClient(io, setLatestSensorData);
    startPredictionLoop(io);

    server.listen(env.BACKEND_PORT, () => {
      console.log(
        `Backend çalışıyor ve ${env.BACKEND_PORT} portunu dinliyor (HTTP + Socket.IO)`,
      );
    });
  } catch (error) {
    console.error("Backend başlatılamadı:", error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
