import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  restoreUser,
  updateUser,
} from "./usuarios.controller.js";
import { protect, IsAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, IsAdmin, getUsers);
router.get("/:id", protect, IsAdmin, getUserById);
router.put("/:id", protect, IsAdmin, updateUser);
router.put("/delete/:id", protect, IsAdmin, deleteUser);
router.put("/restore/:id", protect, IsAdmin, restoreUser);

export default router;
