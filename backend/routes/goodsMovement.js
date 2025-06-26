// backend/routes/goodsMovement.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const controller = require("../controllers/goodsMovementController");

router.get("/", verifyToken, controller.getAllWithItems);
router.get("/:id", verifyToken, controller.getByIdWithItems);
router.post("/", verifyToken, controller.create);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);

module.exports = router;
