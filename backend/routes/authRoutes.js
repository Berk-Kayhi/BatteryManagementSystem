const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/delete", authMiddleware, authController.deleteAccount);

module.exports = router;