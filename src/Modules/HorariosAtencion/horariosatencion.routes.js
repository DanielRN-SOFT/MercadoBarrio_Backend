import express from "express";
import {
  getAttendanceSchedule,
  getAttendanceScheduleById,
  createAttendanceSchedule,
  updateAttendanceSchedule,
  deleteAttendanceSchedule,
  restoreAttendanceSchedule,
} from "./horariosAtencion.controller.js";
import {
  attachStore,
  isGrocer,
  protect,
} from "../../middlewares/authMiddleware.js";

// La documentación Swagger de estas rutas vive en ./horariosAtencion.docs.js

const router = express.Router();

router.get("/", protect, isGrocer, attachStore, getAttendanceSchedule);
router.get("/:id", protect, isGrocer, attachStore, getAttendanceScheduleById);

router.post("/", protect, isGrocer, attachStore, createAttendanceSchedule);

router.put("/:id", protect, isGrocer, attachStore, updateAttendanceSchedule);
router.put(
  "/delete/:id",
  protect,
  isGrocer,
  attachStore,
  deleteAttendanceSchedule,
);
router.put(
  "/restore/:id",
  protect,
  isGrocer,
  attachStore,
  restoreAttendanceSchedule,
);

export default router;
