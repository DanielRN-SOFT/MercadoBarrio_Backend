import express from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
} from "./proveedores.controller.js";
import { IsAdmin, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getSuppliers);
router.get("/:id", getSupplierById);
router.post("/", protect, IsAdmin, createSupplier);
router.put("/:id", protect, IsAdmin, updateSupplier);
router.put("/delete/:id", protect, IsAdmin, deleteSupplier);
router.put("/restore/:id", protect, IsAdmin, restoreSupplier);

export default router;
