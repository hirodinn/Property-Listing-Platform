import mongoose from "mongoose";
import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Create a new property (Draft)
// @route   POST /api/properties
// @access  Owner
const createProperty = async (req, res) => {
  const { title, description, location, price } = req.body;

  // Images are handled by multer and uploaded to cloud in a separate middleware or here loop
  // For simplicity, we assume frontend sends files and we upload them here OR helper middleware does it.
  // Actually, standard practice: Multer -> req.files -> Upload to Cloudinary -> Get URLs

  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      // Upload to cloudinary
      // Needs to be a buffer stream or convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "properties",
      });
      imageUrls.push(result.secure_url);
    }
  }

  const property = await Property.create({
    title,
    description,
    location,
    price,
    images: imageUrls,
    owner: req.user._id,
    status: "draft",
  });

  res.status(201).json(property);
};

// @desc    Publish property (Transactional)
// @route   PUT /api/properties/:id/publish
// @access  Owner
const publishProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const property = await Property.findById(req.params.id).session(session);

    if (!property) {
      throw new Error("Property not found");
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to publish this property");
    }

    if (
      !property.title ||
      !property.price ||
      !property.location ||
      property.images.length === 0
    ) {
      res.status(400);
      throw new Error("Property missing required fields for publication");
    }

    property.status = "published";
    await property.save({ session });

    await session.commitTransaction();
    res.json(property);
  } catch (error) {
    await session.abortTransaction();
    res.status(400); // Bad Request or whatever error code
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

// @desc    Get all properties (Public - Pagination/Filtering)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  const { location, priceMin, priceMax, page = 1, limit = 10 } = req.query;

  const query = { status: "published", deletedAt: null };

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  const count = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  res.json({
    properties,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
  });
};

// @desc    Get my properties (Owner)
// @route   GET /api/properties/my
// @access  Owner
const getMyProperties = async (req, res) => {
  // Use .find() directly to include drafts, but standard pre-hook filters deleted.
  const properties = await Property.find({ owner: req.user._id });
  res.json(properties);
};

// @desc    Soft Delete Property
// @route   DELETE /api/properties/:id
// @access  Owner/Admin
const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Check ownership or admin
  if (
    property.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  property.deletedAt = new Date();
  await property.save();

  res.json({ message: "Property removed" });
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "owner",
    "name email",
  );

  if (property) {
    res.json(property);
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
};

export {
  createProperty,
  publishProperty,
  getProperties,
  getMyProperties,
  deleteProperty,
  getPropertyById,
};
