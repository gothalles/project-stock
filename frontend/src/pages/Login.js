// frontend/src/pages/Login.js
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [registerMode, setRegisterMode] = useState(false);
  const [fullname, setFullname] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (registerMode) {
        await api.post("/users", {
          email: form.email,
          password: form.password,
          fullname: fullname,
        });
        alert("Usuário cadastrado com sucesso!");
        setRegisterMode(false);
        setForm({ email: "", password: "" });
        setFullname("");
      } else {
        const res = await api.post("/auth/login", form);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/");
      }
    } catch (err) {
      alert("Erro: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h3 className="text-center mb-3">{registerMode ? "Criar Conta" : "Login"}</h3>
          <form onSubmit={handleSubmit}>
            {registerMode && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome completo"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="submit">
                {registerMode ? "Cadastrar" : "Entrar"}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={() => setRegisterMode(!registerMode)}>
              {registerMode ? "Já tem conta? Fazer login" : "Não tem conta? Criar agora"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
