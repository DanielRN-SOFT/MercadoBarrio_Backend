import express from "express";
import {
  getStoreCategories,
  getStoreCategoryById,
  createStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
  restoreStoreCategory,
} from "./categoriasTiendas.controller";

const router = express.Router();

router.get("/", getStoreCategories);
router.get("/:id", getStoreCategoryById);
router.post("/", createStoreCategory);
router.put("/", updateStoreCategory);
router.put("/", deleteStoreCategory);
router.put("/", restoreStoreCategory);

export default router;