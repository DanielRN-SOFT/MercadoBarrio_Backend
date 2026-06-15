import express from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./roles.controller.js";
import { IsAdmin, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, IsAdmin, getRoles);
router.get("/:id", protect, IsAdmin, getRoleById);
router.post("/", protect, IsAdmin, createRole);
router.put("/:id", protect, IsAdmin, updateRole);
router.delete("/:id", protect, IsAdmin, deleteRole);

export default router;
