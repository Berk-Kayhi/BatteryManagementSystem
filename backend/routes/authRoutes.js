const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Çıkış yapıldı" });
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Token yok, lütfen giriş yapınız" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    const user = userResult.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Token geçersiz veya süresi dolmuş" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkUser.rows.length !== 0) {
      return res
        .status(400)
        .json({ error: "Bu e-posta adresi kullanılmaktadır" });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Şifre en az 8 karakter olmalıdır" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
    return res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur" });
    }
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Şifre yanlış" });
    }
    const expiresIn= remember ? "7d" : "1h";
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        username: user.rows[0].username,
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
    res.cookie("token", token, { httpOnly: true, maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 });
    res.json({ message: "Giriş başarılı" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;