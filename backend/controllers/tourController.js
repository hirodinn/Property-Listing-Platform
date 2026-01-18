import asyncHandler from "express-async-handler";
import Tour from "../models/Tour.js";
import Property from "../models/Property.js";

// @desc    Request a tour
// @route   POST /api/tours
// @access  Private (User only)
const requestTour = asyncHandler(async (req, res) => {
  const { propertyId, date, time, message } = req.body;

  const property = await Property.findById(propertyId);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const tour = await Tour.create({
    property: propertyId,
    user: req.user._id,
    owner: property.owner,
    date,
    time,
    message,
  });

  if (tour) {
    res.status(201).json(tour);
  } else {
    res.status(400);
    throw new Error("Invalid tour data");
  }
});

// @desc    Get logged in user tours
// @route   GET /api/tours/my-tours
// @access  Private (User only)
const getUserTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ user: req.user._id })
    .populate("property", "title location images")
    .populate("owner", "name email");

  res.json(tours);
});

// @desc    Get owner tours
// @route   GET /api/tours/owner-tours
// @access  Private (Owner only)
const getOwnerTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ owner: req.user._id })
    .populate("property", "title location images")
    .populate("user", "name email");

  res.json(tours);
});

// @desc    Update tour status
// @route   PUT /api/tours/:id
// @access  Private (Owner only)
const updateTourStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }

  // Check if user is the owner of the property
  if (tour.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  tour.status = status || tour.status;

  await tour.save();

  // Fetch populated tour to return to frontend
  const updatedTour = await Tour.findById(req.params.id)
    .populate("property", "title location images")
    .populate("user", "name email");

  res.json(updatedTour);
});

const getAllToursAdmin = asyncHandler(async (req, res) => {
  const tours = await Tour.find({})
    .populate("property", "title location images price")
    .populate("user", "name email")
    .populate("owner", "name email")
    .sort("-createdAt");

  res.json(tours);
});

export {
  requestTour,
  getUserTours,
  getOwnerTours,
  updateTourStatus,
  getAllToursAdmin,
};
