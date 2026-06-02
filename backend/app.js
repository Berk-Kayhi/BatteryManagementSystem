const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);

app.get("/", (_req, res) => res.send("Backend Aktif"));

module.exports = app;
