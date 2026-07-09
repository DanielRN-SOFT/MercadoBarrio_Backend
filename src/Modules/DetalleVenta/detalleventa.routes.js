import express from "express";
import {
  getSaleDetails,
  getSaleDetailById,
} from "./detalleventa.controller.js";
import {
  attachStore,
  isGrocer,
  protect,
} from "../../middlewares/authMiddleware.js";

// La documentación Swagger de estas rutas vive en ./detalleventa.docs.js

const router = express.Router();

router.get("/", protect, isGrocer, attachStore, getSaleDetails);
router.get("/:id", protect, isGrocer, attachStore, getSaleDetailById);

export default router;
