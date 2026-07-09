import express from "express";
import {
  getStoreCategories,
  getStoreCategoryById,
  createStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
  restoreStoreCategory,
} from "./categoriasTiendas.controller.js";
import { IsAdmin, protect } from "../../middlewares/authMiddleware.js";

// La documentación Swagger de estas rutas vive en ./categoriasTiendas.docs.js

const router = express.Router();

router.get("/", getStoreCategories);
router.get("/:id", getStoreCategoryById);
router.post("/", protect, IsAdmin, createStoreCategory);
router.put("/:id", protect, IsAdmin, updateStoreCategory);
router.put("/delete/:id", protect, IsAdmin, deleteStoreCategory);
router.put("/restore/:id", protect, IsAdmin, restoreStoreCategory);

export default router;
