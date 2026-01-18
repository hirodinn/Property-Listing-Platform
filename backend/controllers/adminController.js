import User from "../models/User.js";
import Property from "../models/Property.js";
import Tour from "../models/Tour.js";

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

  const totalTours = await Tour.countDocuments();

  res.json({
    totalUsers,
    totalProperties,
    publishedProperties,
    draftProperties,
    pendingProperties,
    archivedProperties: await Property.countDocuments({ status: "archived" }),
    totalTours,
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

  // Toggle status: if archived, set to published (active), else set to archived
  property.status = property.status === "archived" ? "published" : "archived";
  await property.save();

  res.json({
    message: `Property status updated to ${property.status}`,
    property,
  });
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User removed" });
};

// @desc    Delete tour (Admin)
// @route   DELETE /api/admin/tours/:id
// @access  Admin
const deleteTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }

  await tour.deleteOne();
  res.json({ message: "Tour removed" });
};

// @desc    Get all properties (raw view for admin)
// @route   GET /api/admin/properties
// @access  Admin
const getAllPropertiesAdmin = async (req, res) => {
  // Admin sees everything, including soft deleted or drafts, maybe?
  // For now, let's show all valid docs (including drafts/archived)
  const properties = await Property.find({})
    .setOptions({ includeDeleted: true })
    .populate("owner", "name email");
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
  deleteUser,
  deleteTour,
};
