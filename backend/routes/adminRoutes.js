import express from "express";
import {
  getSystemMetrics,
  disableProperty,
  getAllPropertiesAdmin,
  getAllUsers,
  deleteUser,
  deleteTour,
} from "../controllers/adminController.js";
import { getAllToursAdmin } from "../controllers/tourController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require Admin role
router.use(protect);
router.use(authorize("admin"));

/**
 * @swagger
 * /api/admin/metrics:
 *   get:
 *     summary: Get system metrics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System metrics retrieved
 */
router.get("/metrics", getSystemMetrics);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /api/admin/properties:
 *   get:
 *     summary: Get all properties (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all properties retrieved
 */
router.get("/properties", getAllPropertiesAdmin);

/**
 * @swagger
 * /api/admin/properties/{id}/disable:
 *   put:
 *     summary: Disable a property (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property disabled
 */
router.put("/properties/:id/disable", disableProperty);

/**
 * @swagger
 * /api/admin/tours/all:
 *   get:
 *     summary: Get all tours (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tours retrieved
 */
router.get("/tours/all", getAllToursAdmin);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /api/admin/tours/{id}:
 *   delete:
 *     summary: Delete a tour (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour deleted
 */
router.delete("/tours/:id", deleteTour);

export default router;
