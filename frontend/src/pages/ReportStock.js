// frontend/src/pages/ReportStock.js

import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ReportStock() {
  const [stock, setStock] = useState([]);

  const loadStock = async () => {
    try {
      const res = await api.get("/stock");
      setStock(res.data);
    } catch (error) {
      alert("Erro ao carregar estoque");
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Consulta de Estoque</h2>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Descrição</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr
                key={item.product}
                className={item.balance < 0 ? "table-danger" : item.balance > 0 ? "table-success" : "table-warning"}
              >
                <td>{item.product}</td>
                <td>{item.description}</td>
                <td>
                  {parseFloat(item.balance).toLocaleString("pt-BR", {
                    minimumFractionDigits: 3,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportStock;
