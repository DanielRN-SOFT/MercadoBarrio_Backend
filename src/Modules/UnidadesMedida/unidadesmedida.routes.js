import express from "express";
import {
  getUnitOfMeasureById,
  getUnitsOfMeasure,
  createUnitOfMeasure,
  updateUnitOfMeasure,
  deleteUnitOfMeasure,
  restoreUnitOfMeasure,
} from "./unidadesMedida.controller.js";

const router = express.Router();
router.get("/", getUnitsOfMeasure);
router.get("/:id", getUnitOfMeasureById);
router.post("/", createUnitOfMeasure);
router.put("/:id", updateUnitOfMeasure);
router.put("/delete/:id", deleteUnitOfMeasure);
router.put("/restore/:id", restoreUnitOfMeasure);

export default router;