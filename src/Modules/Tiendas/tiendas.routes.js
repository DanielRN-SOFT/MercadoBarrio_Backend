import express from "express";
import {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  restoreStore,
  getStoresPublic,
  getStorePublicById,
  getMyStore,
  createMyStore,
  updateMyStore,
} from "./tiendas.controller.js";
import { protect, IsAdmin, isGrocer, attachStore } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/public", getStoresPublic);
router.get("/public/:id", getStorePublicById);

// Rutas del tendero (su propia tienda)
router.get("/me", protect, isGrocer, getMyStore);
router.post("/me", protect, isGrocer, createMyStore);
router.put("/me", protect, isGrocer, updateMyStore);

// Rutas admin
router.get("/", protect, IsAdmin, getStores);
router.get("/:id", protect, IsAdmin, getStoreById);
router.post("/", protect, IsAdmin, createStore);
router.put("/:id", protect, IsAdmin, updateStore);
router.put("/delete/:id", protect, IsAdmin, deleteStore);
router.put("/restore/:id", protect, IsAdmin, restoreStore);

export default router;
