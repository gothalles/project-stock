// frontend/src/pages/GoodsMovementList.js

import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function GoodsMovement() {
  const [headers, setHeaders] = useState([]);
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState(null);

  const [headerForm, setHeaderForm] = useState({ type: "", description: "" });
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState({ product: "", quantity: "" });

  const loadHeaders = async () => {
    const res = await api.get("/goodsMovement");
    setHeaders(res.data);
  };

  const loadProducts = async () => {
    var color = "option-gray";
    const res = await api.get("/products");
    setProducts(res.data);

    var typesCheck = [];

    res.data.forEach((row) => {
      var type = typesCheck.find((x) => x.type === row.type);

      if (!type) {
        typesCheck.push({
          type: row.type,
          color: color,
        });

        if (color === "option-gray") color = "option-white";
        else color = "option-gray";
      }
    });

    setTypes(typesCheck);
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!itemForm.product || !itemForm.quantity) {
      alert("Preencha todos os campos do item");
      return;
    }

    const nextItemNumber = items.length > 0 ? Math.max(...items.map((i) => i.item)) + 1 : 1;

    const newItem = {
      item: nextItemNumber,
      product: itemForm.product,
      quantity: itemForm.quantity,
    };

    setItems([...items, newItem]);
    setItemForm({ product: "", quantity: "" });
  };

  const handleRemoveItem = (itemNumber) => {
    setItems(items.filter((i) => i.item !== itemNumber));
  };

  const handleCreateHeader = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Adicione ao menos um item.");
      return;
    }

    try {
      await api.post("/goodsMovement", {
        ...headerForm,
        create_by: 1, // depois pode pegar do token
        items,
      });
      setHeaderForm({ type: "", description: "" });
      setItems([]);
      loadHeaders();
      alert("Movimentação criada!");
    } catch (err) {
      alert("Erro ao criar movimentação");
    }
  };

  const handleSelectHeader = async (header) => {
    try {
      const res = await api.get(`/goodsMovement/${header.id}`);
      setSelectedHeader(res.data);
    } catch (err) {
      alert("Erro ao carregar movimentação");
    }
  };

  const handleDeleteHeader = async (id) => {
    if (window.confirm("Deseja excluir esta movimentação e seus itens?")) {
      await api.delete(`/goodsMovement/${id}`);
      loadHeaders();
      setSelectedHeader(null);
    }
  };

  useEffect(() => {
    loadHeaders();
    loadProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Movimentações</h2>

        {/* Formulário Header */}
        <div className="card mb-4">
          <div className="card-header">Criar Movimentação</div>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleCreateHeader}>
              <div className="col-md-2">
                <select
                  className="form-control"
                  value={headerForm.type}
                  onChange={(e) => setHeaderForm({ ...headerForm, type: e.target.value })}
                  required
                >
                  <option value="">Tipo</option>
                  <option value="E">Entrada</option>
                  <option value="S">Saída</option>
                </select>
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Descrição"
                  value={headerForm.description}
                  onChange={(e) => setHeaderForm({ ...headerForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100">Cadastrar</button>
              </div>
            </form>

            <hr />
            {/* Formulário Itens */}
            <form className="row g-3" onSubmit={handleAddItem}>
              <div className="col-md-4">
                <select
                  className="form-control"
                  value={itemForm.product}
                  onChange={(e) => setItemForm({ ...itemForm, product: e.target.value })}
                  required
                >
                  <option value="">Selecione Produto</option>
                  {products.map((p) => {
                    const typeColor = types.find((x) => x.type === p.type)?.color || "option-white";
                    return (
                      <option key={p.id} value={p.id} className={typeColor}>
                        {p.type} - {p.description}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  step="0.001" // Allows decimals
                  className="form-control"
                  placeholder="Quantidade"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-secondary w-100">Adicionar Item</button>
              </div>
            </form>

            {/* Lista de Itens do formulário */}
            {items.length > 0 && (
              <div className="mt-3">
                <h6>Itens da Movimentação</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => (
                      <tr key={i.item}>
                        <td>{i.item}</td>
                        <td>
                          {i.product} - {products.find((x) => x.id === Number(i.product))?.description || "Produto não encontrado"}
                        </td>

                        <td>
                          {parseFloat(i.quantity).toLocaleString("pt-BR", {
                            minimumFractionDigits: 3,
                          })}
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(i.item)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Headers */}
        <h5>Movimentações Cadastradas</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="col-md-1 text-center">Selecionado</th>
              <th className="col-md-1 text-center">ID</th>
              <th className="col-md-1 text-center">Tipo</th>
              <th className="col-md-5 text-center">Descrição</th>
              <th className="col-md-2 text-center">Data</th>
              <th className="col-md-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {headers.map((h) => (
              <tr key={h.id} className={h?.type === "E" ? "table-success" : "table-danger"}>
                <td className="text-center">
                  <input type="checkbox" disabled {...(selectedHeader?.id === h.id ? { checked: true } : { checked: false })} />
                </td>
                <td className="text-center">{h.id}</td>
                <td>{h.type === "E" ? "Entrada" : h.type === "S" ? "Saída" : h.type}</td>
                <td>{h.description}</td>
                <td>{new Date(h.create_on).toLocaleString()}</td>
                <td className="text-center">
                  <button className="btn btn-secondary btn-sm me-2" onClick={() => handleSelectHeader(h)}>
                    Ver Itens
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteHeader(h.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Detalhes do Header Selecionado */}
        {selectedHeader && (
          <>
            <hr />
            <h4>
              Itens da Movimentação #{selectedHeader.id} - {selectedHeader.description}
            </h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {selectedHeader.items.map((i) => (
                  <tr key={i.item}>
                    <td>{i.item}</td>
                    <td>
                      {i.product} - {products.find((x) => x.id === Number(i.product))?.description || "Produto não encontrado"}
                    </td>
                    <td>
                      {parseFloat(selectedHeader?.type === "E" ? i.quantity : i.quantity * -1).toLocaleString("pt-BR", {
                        minimumFractionDigits: 3,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default GoodsMovement;
