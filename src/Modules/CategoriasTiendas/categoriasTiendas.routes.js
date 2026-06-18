import express from "express";
import {
  getStoreCategories,
  getStoreCategoryById,
  createStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
  restoreStoreCategory,
} from "./categoriasTiendas.controller.js";

const router = express.Router();

router.get("/", getStoreCategories);
router.get("/:id", getStoreCategoryById);
router.post("/", createStoreCategory);
router.put("/:id", updateStoreCategory);
router.put("/delete/:id", deleteStoreCategory);
router.put("/restore/:id", restoreStoreCategory);

export default router;
