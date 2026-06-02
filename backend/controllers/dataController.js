const {
  getAllReadings,
  getLatestReadings,
} = require("../services/readingService");

const getTimestamps = async (_req, res) => {
  try {
    const readings = await getAllReadings();
    res.json(readings);
  } catch (error) {
    console.error("Timestamp verileri alınamadı:", error.message);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const getLatest = async (_req, res) => {
  try {
    const readings = await getLatestReadings(10);
    res.json(readings);
  } catch (error) {
    console.error("Son veriler alınamadı:", error.message);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = {
  getLatest,
  getTimestamps,
};
