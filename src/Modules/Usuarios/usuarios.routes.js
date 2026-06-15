import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  restoreUser,
  updateUser,
} from "./usuarios.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/delete/:id", deleteUser);
router.put("/restore/:id", restoreUser);

export default router;
