const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const env = require("../config/env");

function buildUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

function createToken(user, remember) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    env.JWT_SECRET,
    { expiresIn: remember ? "7d" : "1h" },
  );
}

function setAuthCookie(res, token, remember) {
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    sameSite: "lax",
  });
}

const logout = (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Çıkış yapıldı" });
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    return res.json(buildUserResponse(user));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Bu e-posta adresi kullanılmaktadır" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Şifre en az 8 karakter olmalıdır" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      passwordHash,
    });

    return res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Şifre yanlış" });
    }

    const token = createToken(user, remember);
    setAuthCookie(res, token, remember);

    return res.json({
      message: "Giriş başarılı",
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const deletedCount = await User.destroy({
      where: {
        id: req.user.id,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    res.clearCookie("token");
    return res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  deleteAccount,
  login,
  logout,
  me,
  register,
};
