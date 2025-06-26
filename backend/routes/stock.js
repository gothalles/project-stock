// backend/routes/stock.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const productController = require("../controllers/stockController");

router.get("/", verifyToken, productController.getAll);

module.exports = router;
