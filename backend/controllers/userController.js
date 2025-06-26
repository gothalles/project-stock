// backend/controllers/userController.js
const pool = require("../db");
const bcrypt = require("bcryptjs");

exports.getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT id, email, fullname, create_on FROM tb_user");
  res.json(rows);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT id, email, fullname, create_on FROM tb_user WHERE id = ?", [id]);
  res.json(rows);
};

exports.create = async (req, res) => {
  const { email, password, fullname } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const now = new Date();

  try {
    await pool.query("INSERT INTO tb_user (email, password, fullname, create_on) VALUES (?, ?, ?, ?)", [
      email,
      hashedPassword,
      fullname,
      now,
    ]);
    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { email, fullname, password } = req.body;

  try {
    await pool.query("UPDATE tb_user SET email = ?, fullname = ? WHERE id = ?", [email, fullname, id]);
    if (password || password != "") await pool.query("UPDATE tb_user SET password = ? WHERE id = ?", [password, id]);
    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM tb_user WHERE id = ?", [id]);
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};
