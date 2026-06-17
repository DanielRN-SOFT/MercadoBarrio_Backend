import express from "express";
import {
  getProductCategories,
  getProductCategoryById,
  createCategory,
  updateProductCategory,
  deleteProductCategory,
  restoreProductCategory,
} from "./categoriasProductos.controller.js";

const router = express();

router.get("/", getProductCategories);
router.get("/:id", getProductCategoryById);
router.post("/", createCategory);
router.put("/:id", updateProductCategory);
router.put("/delete/:id", deleteProductCategory);
router.put("/restore/:id", restoreProductCategory);

export default router;
