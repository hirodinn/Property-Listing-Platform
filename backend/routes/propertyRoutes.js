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

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: List all published properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of properties retrieved
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 */
router
  .route("/")
  .get(getProperties)
  .post(protect, authorize("owner"), upload.array("images"), createProperty);

/**
 * @swagger
 * /api/properties/my:
 *   get:
 *     summary: Get properties owned by the current user
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My properties retrieved
 */
router.get("/my", protect, authorize("owner"), getMyProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property detail retrieved
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
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
 *         description: Property deleted
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Property updated
 */
router
  .route("/:id")
  .get(getPropertyById)
  .delete(protect, deleteProperty)
  .put(protect, authorize("owner"), upload.array("images"), updateProperty);

/**
 * @swagger
 * /api/properties/{id}/archive:
 *   put:
 *     summary: Archive a property
 *     tags: [Properties]
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
 *         description: Property archived
 */
router.put("/:id/archive", protect, archiveProperty);

/**
 * @swagger
 * /api/properties/{id}/publish:
 *   put:
 *     summary: Publish a property
 *     tags: [Properties]
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
 *         description: Property published
 */
router.put("/:id/publish", protect, authorize("owner"), publishProperty);

/**
 * @swagger
 * /api/properties/{id}/approve:
 *   put:
 *     summary: Approve a property (Admin only)
 *     tags: [Properties]
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
 *         description: Property approved
 */
router.put("/:id/approve", protect, authorize("admin"), approveProperty);

/**
 * @swagger
 * /api/properties/{id}/reject:
 *   put:
 *     summary: Reject a property (Admin only)
 *     tags: [Properties]
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
 *         description: Property rejected
 */
router.put("/:id/reject", protect, authorize("admin"), rejectProperty);

export default router;
