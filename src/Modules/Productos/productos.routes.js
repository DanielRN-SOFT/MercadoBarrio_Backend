import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  searchProductsPublic,
} from "./productos.controller.js";
import { attachStore, isGrocer, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta pública
router.get("/public/search", searchProductsPublic);

// Rutas privadas
router.get("/", protect, isGrocer, attachStore, getProducts);
router.get("/:id", protect, isGrocer, attachStore, getProductById);
router.post("/", protect, isGrocer, attachStore, createProduct);
router.put("/:id", protect, isGrocer, attachStore, updateProduct);
router.put("/delete/:id", protect, isGrocer, attachStore, deleteProduct);
router.put("/restore/:id", protect, isGrocer, attachStore, restoreProduct);

export default router;
