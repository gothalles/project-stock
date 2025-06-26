// backend/controllers/stockController.js

const pool = require("../db");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vw_stock");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao consultar estoque:", error);
    res.status(500).json({ error: "Erro ao consultar estoque" });
  }
};
