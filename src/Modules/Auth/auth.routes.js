import express from "express";
import {
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/:token", resetPassword);

export default router;
