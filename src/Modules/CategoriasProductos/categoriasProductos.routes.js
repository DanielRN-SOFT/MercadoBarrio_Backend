import express from "express";
import {
  getProductCategories,
  getProductCategoryById,
  getProductCategoriesWithProducts,
  getProductCategoriesByStore,
  createCategory,
  updateProductCategory,
  deleteProductCategory,
  restoreProductCategory,
} from "./categoriasProductos.controller.js";
import {
  protect,
  IsAdmin,
  isGrocer,
  attachStore,
} from "../../middlewares/authMiddleware.js";

// La documentación Swagger de estas rutas vive en ./categoriasProductos.docs.js

const router = express.Router();

router.get("/public/search", getProductCategoriesWithProducts);

router.get(
  "/store/mine",
  protect,
  isGrocer,
  attachStore,
  getProductCategoriesByStore,
);

router.get("/", getProductCategories);
router.get("/:id", getProductCategoryById);

router.post("/", protect, IsAdmin, createCategory);

router.put("/:id", protect, IsAdmin, updateProductCategory);
router.put("/delete/:id", protect, IsAdmin, deleteProductCategory);
router.put("/restore/:id", protect, IsAdmin, restoreProductCategory);

export default router;
