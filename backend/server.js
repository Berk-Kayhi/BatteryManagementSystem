const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketIO = require("socket.io");

const mqttClientInit = require("./mqttClient");

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

app.get("/", (req, res) => res.send("Backend Çalışıyor!"));

const server = http.createServer(app);

const io = new SocketIO.Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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