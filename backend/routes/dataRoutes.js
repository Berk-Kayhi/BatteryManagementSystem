const express = require("express");
const dataController = require("../controllers/dataController");

const router = express.Router();

router.get("/timestamp", dataController.getTimestamps);
router.get("/latest", dataController.getLatest);

module.exports = router;
