import express from "express";
import {
  createProperty,
  publishProperty,
  getProperties,
  getMyProperties,
  deleteProperty,
  archiveProperty,
  getPropertyById,
  approveProperty,
  rejectProperty,
  updateProperty,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

router
  .route("/")
  .get(getProperties)
  .post(protect, authorize("owner"), upload.array("images"), createProperty);

router.get("/my", protect, authorize("owner"), getMyProperties);

router
  .route("/:id")
  .get(getPropertyById)
  .delete(protect, deleteProperty)
  .put(protect, authorize("owner"), upload.array("images"), updateProperty);

router.put("/:id/archive", protect, archiveProperty);

router.put("/:id/publish", protect, authorize("owner"), publishProperty);
router.put("/:id/approve", protect, authorize("admin"), approveProperty);
router.put("/:id/reject", protect, authorize("admin"), rejectProperty);

export default router;
