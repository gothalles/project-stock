// backend/controllers/authController.js
const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM tb_user WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(401).json({ message: "Usuário não encontrado" });

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ id: user.id, email: user.email, fullname: user.fullname }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token, user: { id: user.id, email: user.email, fullname: user.fullname } });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor" });
  }
};
