import express from "express";
import {
  getUnitOfMeasureById,
  getUnitsOfMeasure,
  createUnitOfMeasure,
  updateUnitOfMeasure,
  deleteUnitOfMeasure,
  restoreUnifOfMeasure,
} from "./unidadesMedida.controller.js";

const router = express.Router();
router.get("/", getUnitOfMeasure);
router.get("/:id", getUnitOfMeasureById);
router.post("/", createUnitOfMeasure);
router.put("/:id", updateUnitOfMeasure);
router.put("/delete/:id", deleteUnitOfMeasure);
router.put("/restore/:id", restoreUnifOfMeasure);

export default router;