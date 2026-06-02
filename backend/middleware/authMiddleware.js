const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Token bulunamadı" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token geçersiz veya süresi dolmuş" });
  }
};
