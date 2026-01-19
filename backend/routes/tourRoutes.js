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

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Request a property tour (User only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - property
 *               - date
 *               - time
 *             properties:
 *               property:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tour requested
 */
router.post("/", protect, authorize("user"), requestTour);

/**
 * @swagger
 * /api/tours/my-tours:
 *   get:
 *     summary: Get tours requested by the current user
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User tours retrieved
 */
router.get("/my-tours", protect, authorize("user"), getUserTours);

/**
 * @swagger
 * /api/tours/owner-tours:
 *   get:
 *     summary: Get tours requested for properties owned by the current user
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner tours retrieved
 */
router.get("/owner-tours", protect, authorize("owner"), getOwnerTours);

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Update tour status (Owner only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, completed]
 *     responses:
 *       200:
 *         description: Tour status updated
 */
router.put("/:id", protect, authorize("owner"), updateTourStatus);

export default router;
