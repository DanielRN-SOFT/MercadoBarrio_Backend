import express from "express";
import {
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  forgotPassword,
  resetPassword,
  comprobarToken,
} from "./auth.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

// La documentación Swagger de estas rutas vive en ./auth.docs.js
// (mismo módulo, separado para no mezclar lógica con documentación)

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/comprobar-token/:token", comprobarToken);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/:token", resetPassword);

export default router;
