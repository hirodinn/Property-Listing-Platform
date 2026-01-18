import mongoose from "mongoose";
import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Create a new property (Draft)
// @route   POST /api/properties
// @access  Owner
const createProperty = async (req, res, next) => {
  try {
    const { title, description, location, price } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "properties",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          uploadStream.end(file.buffer);
        });
        console.log(result);
        imageUrls.push(result.secure_url);
      }
    }

    const property = await Property.create({
      title,
      description,
      location,
      price: Number(price),
      images: imageUrls,
      owner: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(400);
    next(error); // Pass to error handler
  }
};

// @desc    Publish property (Transactional)
// @route   PUT /api/properties/:id/publish
// @access  Owner
const publishProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
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

    property.status = "pending";
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// @desc    Approve Property (Admin)
// @route   PUT /api/properties/:id/approve
// @access  Admin
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }

    if (property.status !== "pending") {
      res.status(400);
      throw new Error("Property is not in pending status");
    }

    property.status = "published";
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reject Property (Admin)
// @route   PUT /api/properties/:id/reject
// @access  Admin
const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }

    if (property.status !== "pending") {
      res.status(400);
      throw new Error("Property is not in pending status");
    }

    property.status = "draft";
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update property (Draft)
// @route   PUT /api/properties/:id
// @access  Owner
const updateProperty = async (req, res, next) => {
  try {
    const { title, description, location, price } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this property");
    }

    // Update fields if provided
    if (title) property.title = title;
    if (description) property.description = description;
    if (location) property.location = location;
    if (price) property.price = Number(price);

    // Handle image updates (deletion)
    let keptImages = [];
    if (req.body.keptImages) {
      if (typeof req.body.keptImages === "string") {
        // Handle case where it's a JSON string or single URL
        try {
          keptImages = JSON.parse(req.body.keptImages);
          if (!Array.isArray(keptImages)) keptImages = [req.body.keptImages];
        } catch (e) {
          keptImages = [req.body.keptImages];
        }
      } else {
        keptImages = req.body.keptImages;
      }
    } else {
      // If keptImages is not sent, assumption depends on intent.
      // For this implementation, let's assume if it's missing, it means keep logic wasn't handled (e.g. old client),
      // OR if it's empty, user deleted all.
      // Careful: FormData with no keptImages means []? Or undefined?
      // Usually if array is empty, it's not sent.
      // Let's rely on frontend sending 'keptImages' as a JSON string to be safe and explicit.
      if (req.body.hasImageUpdates === "true") {
        keptImages = [];
      } else {
        keptImages = property.images; // Default to keeping all if not explicitly updating images
      }
    }

    // Normalize to strings if needed
    // The filter below ensures we only compare what we have.

    // Identify images to delete
    // We trust req.user owns the property, so they can delete what's there.
    const imagesToDelete = property.images.filter(
      (img) => !keptImages.includes(img),
    );

    if (imagesToDelete.length > 0) {
      for (const imgUrl of imagesToDelete) {
        // Extract public ID
        // Format: .../upload/v1234/folder/id.ext or .../upload/folder/id.ext
        const publicIdMatch = imgUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
        if (publicIdMatch) {
          const publicId = publicIdMatch[1];
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Set property images to keptImages
    property.images = keptImages;

    // Handle new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "properties",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          uploadStream.end(file.buffer);
        });
        property.images.push(result.secure_url);
      }
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export {
  createProperty,
  publishProperty,
  getProperties,
  getMyProperties,
  deleteProperty,
  getPropertyById,
  approveProperty,
  rejectProperty,
  updateProperty,
};
