import express from "express";
import {
  getUnitOfMeasureById,
  getUnitsOfMeasure,
  createUnitOfMeasure,
  updateUnitOfMeasure,
  deleteUnitOfMeasure,
  restoreUnitOfMeasure,
} from "./unidadesMedida.controller.js";
import { IsAdmin, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getUnitsOfMeasure);
router.get("/:id", protect, getUnitOfMeasureById);
router.post("/", protect, IsAdmin, createUnitOfMeasure);
router.put("/:id", protect, IsAdmin, updateUnitOfMeasure);
router.put("/delete/:id", protect, IsAdmin, deleteUnitOfMeasure);
router.put("/restore/:id", protect, IsAdmin, restoreUnitOfMeasure);

export default router;
