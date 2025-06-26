// frontend/src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ type: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/products/${editingId}`, {
        ...form,
        change_by: 1, // Pode capturar do token
      });
    } else {
      await api.post("/products", {
        ...form,
        create_by: 1, // Pode capturar do token
      });
    }

    setForm({ type: "", description: "" });
    setEditingId(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja excluir este produto?")) {
      await api.delete(`/products/${id}`).catch((error) => {
        if (error?.response?.data?.message) {
          alert(error?.response?.data?.message);
          return;
        }
      });

      loadProducts();
    }
  };

  const handleEdit = (product) => {
    setForm({ type: product.type, description: product.description });
    setEditingId(product.id);
  };

  const handleCancelEdit = () => {
    setForm({ type: "", description: "" });
    setEditingId(null);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Produtos</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                placeholder="Tipo"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="col">
              <button className="btn btn-primary">{editingId ? "Atualizar" : "Cadastrar"}</button>
              {editingId && (
                <button type="button" className="btn btn-secondary ms-2" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="col-md-1 text-center">ID</th>
              <th className="text-center">Tipo</th>
              <th className="text-center">Descrição</th>
              <th className="col-md-2 text-center">Data da Criação/Atualização</th>
              <th className="col-md-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={editingId === p.id ? "table-info" : ""}>
                <td>{p.id}</td>
                <td>{p.type}</td>
                <td>{p.description}</td>
                <td className="text-center">{new Date(p.change_on || p.create_on).toLocaleString()}</td>
                <td className="text-center">
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;
