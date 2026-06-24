import express from "express";
import { getSales, getSaleById, createSale, cancelSale } from "./ventas.controller.js";
import { attachStore, isGrocer, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, isGrocer, attachStore, getSales);
router.get("/:id", protect, isGrocer, attachStore, getSaleById);
router.post("/", protect, isGrocer, attachStore, createSale);
router.put("/cancel/:id", protect, isGrocer, attachStore, cancelSale);

export default router;
