// frontend/src/pages/User.js

import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function User() {
  const userStorage = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userStorage.id;

  const [form, setForm] = useState({ email: "", fullname: "", password: "" });

  const loadUser = async () => {
    try {
      const res = await api.get(`/users/${userId}`);

      setForm({
        email: res.data[0].email,
        fullname: res.data[0].fullname,
        password: "",
      });
    } catch (err) {
      alert("Erro ao carregar seus dados.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${userId}`, {
        email: form.email,
        fullname: form.fullname,
        password: form.password || undefined,
      });
      alert("Dados atualizados com sucesso.");
      loadUser();
    } catch (err) {
      alert("Erro ao atualizar dados.");
    }
  };

  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  return (
    <div>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <h2>Meu Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label>Nome completo</label>
            <input
              className="form-control"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label>Senha (deixe em branco para manter)</label>
            <input
              className="form-control"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="btn btn-primary w-100">Salvar</button>
        </form>
      </div>
    </div>
  );
}

export default User;
