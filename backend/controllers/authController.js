import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile/session validation
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
  res.status(200).json(user);
};

// @desc    Toggle favorite property
// @route   POST /api/auth/favorites/:id
// @access  Private
const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isFavorite = user.favorites.includes(req.params.id);

  if (isFavorite) {
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.id,
    );
  } else {
    user.favorites.push(req.params.id);
  }

  await user.save();
  res.status(200).json(user.favorites);
};

// @desc    Get favorite properties
// @route   GET /api/auth/favorites
// @access  Private
const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.favorites);
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  toggleFavorite,
  getFavorites,
};
