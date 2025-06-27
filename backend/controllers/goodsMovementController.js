// backend/controllers/goodsMovementController.js
const pool = require("../db");

// Buscar todos os Headers com seus Itens
exports.getAllWithItems = async (req, res) => {
  const [headers] = await pool.query("SELECT * FROM tb_gm_header");

  for (const header of headers) {
    const [items] = await pool.query("SELECT * FROM tb_gm_item WHERE id = ?", [header.id]);
    header.items = items;
  }

  res.json(headers);
};

// Buscar um Header específico com seus Itens
exports.getByIdWithItems = async (req, res) => {
  const { id } = req.params;

  const [headerRows] = await pool.query("SELECT * FROM tb_gm_header WHERE id = ?", [id]);
  if (headerRows.length === 0) {
    return res.status(404).json({ message: "Registro não encontrado" });
  }
  const header = headerRows[0];

  const [items] = await pool.query("SELECT * FROM tb_gm_item WHERE id = ?", [id]);
  header.items = items;

  res.json(header);
};

// Criar Header
exports.create = async (req, res) => {
  const { type, description, items } = req.body;

  const [result] = await pool.query("INSERT INTO tb_gm_header (type, description, create_by, create_on) VALUES (?, ?, ?, ?)", [
    type,
    description,
    req.user.id,
    new Date(),
  ]);

  for (var row of items) {
    await pool.query("INSERT INTO tb_gm_item (id, item, product, quantity) VALUES (?, ?, ?, ?)", [
      result.insertId,
      row.item,
      row.product,
      row.quantity,
    ]);
  }

  res.json({ id: result.insertId, message: "Registro criado com sucesso" });
};

// Atualizar Header
exports.update = async (req, res) => {
  const { id } = req.params;
  const { type, description } = req.body;

  await pool.query("UPDATE tb_gm_header SET type = ?, description = ? WHERE id = ?", [type, description, id]);

  res.json({ message: "Registro atualizado com sucesso" });
};

// Remover Header e seus itens
exports.remove = async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM tb_gm_item WHERE id = ?", [id]);
  await pool.query("DELETE FROM tb_gm_header WHERE id = ?", [id]);

  res.json({ message: "Registros removidos com sucesso" });
};
