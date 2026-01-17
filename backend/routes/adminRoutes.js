import express from "express";
import {
  getSystemMetrics,
  disableProperty,
  getAllPropertiesAdmin,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require Admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/metrics", getSystemMetrics);
router.get("/users", getAllUsers);
router.get("/properties", getAllPropertiesAdmin);
router.put("/properties/:id/disable", disableProperty);

export default router;
