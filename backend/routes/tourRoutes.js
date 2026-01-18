import express from "express";
const router = express.Router();
import {
  requestTour,
  getUserTours,
  getOwnerTours,
  updateTourStatus,
  getAllToursAdmin,
} from "../controllers/tourController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

router.post("/", protect, authorize("user"), requestTour);
router.get("/my-tours", protect, authorize("user"), getUserTours);
router.get("/owner-tours", protect, authorize("owner"), getOwnerTours);
router.put("/:id", protect, authorize("owner"), updateTourStatus);

export default router;
