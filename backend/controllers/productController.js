// backend/controllers/productController.js
const pool = require("../db");

exports.getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM tb_product ORDER BY type ASC, description ASC");
  res.json(rows);
};

exports.create = async (req, res) => {
  const { type, description } = req.body;

  try {
    await pool.query("INSERT INTO tb_product (type, description, create_by, create_on) VALUES (?, ?, ?, ?)", [
      type,
      description,
      req.user.id,
      new Date(),
    ]);
    res.status(201).json({ message: "Registro criado com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao criar registro" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("UPDATE tb_product SET type = ?, description = ?, change_by = ?, change_on = ? WHERE id = ?", [
      req.body.type,
      req.body.description,
      req.user.id,
      new Date(),
      id,
    ]);
    res.json({ message: "Registro atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar registro" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT id FROM tb_gm_item WHERE product = ?", [id]);

    if (rows.length) {
      res.status(500).json({ message: "Registro não pode ser deletado pois está sendo utilizado" });
      return;
    }

    await pool.query("DELETE FROM tb_product WHERE id = ?", [id]);
    res.json({ message: "Registro deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar registro" });
  }
};
