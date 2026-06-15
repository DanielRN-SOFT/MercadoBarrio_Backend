import express from "express";
import {
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
} from "./auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/log-out", logoutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
