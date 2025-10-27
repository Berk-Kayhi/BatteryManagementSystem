const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/timestamp", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM timestamp_");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
