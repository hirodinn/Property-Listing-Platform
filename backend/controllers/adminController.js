import User from "../models/User.js";
import Property from "../models/Property.js";

// @desc    Get system metrics (Admin)
// @route   GET /api/admin/metrics
// @access  Admin
const getSystemMetrics = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const publishedProperties = await Property.countDocuments({
    status: "published",
  });
  const draftProperties = await Property.countDocuments({ status: "draft" });
  const pendingProperties = await Property.countDocuments({
    status: "pending",
  });

  res.json({
    totalUsers,
    totalProperties,
    publishedProperties,
    draftProperties,
    pendingProperties,
  });
};

// @desc    Disable/Archive any property (Admin)
// @route   PUT /api/admin/properties/:id/disable
// @access  Admin
const disableProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  property.status = "archived"; // Or 'disabled' if we want a specific admin status
  await property.save();

  res.json({ message: "Property disabled by admin", property });
};

// @desc    Get all properties (raw view for admin)
// @route   GET /api/admin/properties
// @access  Admin
const getAllPropertiesAdmin = async (req, res) => {
  // Admin sees everything, including soft deleted or drafts, maybe?
  // For now, let's show all valid docs (including drafts/archived)
  const properties = await Property.find({}).populate("owner", "name email");
  res.json(properties);
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};

export {
  getSystemMetrics,
  disableProperty,
  getAllPropertiesAdmin,
  getAllUsers,
};
