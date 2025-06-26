// backend/server.js
const express = require("express");
const morgan = require("morgan"); // Middleware para log de requisições HTTP
const cors = require("cors"); // Middleware para habilitar CORS
require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env

// Importa as rotas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const goodsMovementRoutes = require("./routes/goodsMovement");
const stockRoutes = require("./routes/stock");

const app = express();
app.use(morgan("dev")); // Configura morgan para mostrar logs no formato 'dev'

// Configuração do CORS
app.use(
  cors({
    origin: "*", // Permite acesso de qualquer origem
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
    credentials: true, // Permite envio de credenciais
  })
);

app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Middleware personalizado para capturar e logar erros 500
app.use((req, res, next) => {
  const originalJson = res.json; // Armazena a função original res.json

  let responseData = null; // Variável para armazenar o JSON da resposta

  // Substitui res.json para capturar a resposta antes de enviá-la
  res.json = function (data) {
    responseData = data; // Armazena a resposta
    return originalJson.call(this, data); // Envia a resposta real
  };

  // Captura o status e o JSON após o envio
  res.on("finish", () => {
    if (res.statusCode === 500) console.error(`❌ Erro capturado ❌\n`, JSON.stringify(responseData, null, 2));
  });

  next(); // Passa o controle para o próximo middleware
});

// Configuração das rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/goodsMovement", goodsMovementRoutes);
app.use("/api/stock", stockRoutes);

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log("Servidor backend rodando na porta 3001");
});
