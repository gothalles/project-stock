// backend/routes/user.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.get("/", verifyToken, userController.getAll);
router.get("/:id", verifyToken, userController.getById);
router.post("/", userController.create);
router.put("/:id", verifyToken, userController.update);
router.delete("/:id", verifyToken, userController.delete);

module.exports = router;
