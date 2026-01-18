import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  toggleFavorite,
  getFavorites,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:id", protect, toggleFavorite);

export default router;
