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
  updateMyStoreVisibility,
  getStoresForMap,
} from "./tiendas.controller.js";
import { protect, IsAdmin, isGrocer, attachStore } from "../../middlewares/authMiddleware.js";
import { uploadStorePhoto } from "../../config/multerConfig.js";

const router = express.Router();

// Rutas públicas
router.get("/public", getStoresPublic);
router.get("/public/map", getStoresForMap);
router.get("/public/:id", getStorePublicById);

// Rutas del tendero (su propia tienda)
router.get("/me", protect, isGrocer, getMyStore);
router.post("/me", protect, isGrocer, uploadStorePhoto.single("photo"), createMyStore);
router.put("/me", protect, isGrocer, uploadStorePhoto.single("photo"), updateMyStore);
router.patch("/me/visibility", protect, isGrocer, attachStore, updateMyStoreVisibility);

// Rutas admin
router.get("/", protect, IsAdmin, getStores);
router.get("/:id", protect, IsAdmin, getStoreById);
router.post("/", protect, IsAdmin, uploadStorePhoto.single("photo"), createStore);
router.put("/:id", protect, IsAdmin, uploadStorePhoto.single("photo"), updateStore);
router.put("/delete/:id", protect, IsAdmin, deleteStore);
router.put("/restore/:id", protect, IsAdmin, restoreStore);

export default router;
