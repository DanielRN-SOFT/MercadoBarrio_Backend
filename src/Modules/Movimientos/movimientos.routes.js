import express from "express";
import {
  getMovements,
  getMovementById,
  createMovements,
  cancelMovement,
} from "./movimientos.controller.js";
import {
  attachStore,
  isGrocer,
  protect,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protect, isGrocer, attachStore, getMovements);
router.get("/:id", protect, isGrocer, attachStore, getMovementById);
router.post("/", protect, isGrocer, attachStore, createMovements);
router.post("/delete/:id", protect, isGrocer, attachStore, cancelMovement);

export default router;
