import express from "express";
import {
  getAdminDashboard,
  getAdminCharts,
  getStoreCharts,
  getStoreDashboard,
} from "./dashboard.controller.js";
import {
  attachStore,
  IsAdmin,
  isGrocer,
  protect,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

// ─── Admin ────────────────────────────────────────────────────────────────────
router.get("/admin", protect, IsAdmin, getAdminDashboard);
router.get("/admin/charts", protect, IsAdmin, getAdminCharts);

// ─── Tendero ──────────────────────────────────────────────────────────────────
router.get("/store", protect, isGrocer, attachStore, getStoreDashboard);
router.get(
  "/store/charts",

  protect,
  isGrocer,
  attachStore,
  getStoreCharts,
);
export default router;
