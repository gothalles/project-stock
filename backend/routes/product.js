// backend/routes/product.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

router.get("/", verifyToken, productController.getAll);
router.post("/", verifyToken, productController.create);
router.put("/:id", verifyToken, productController.update);
router.delete("/:id", verifyToken, productController.delete);

module.exports = router;
