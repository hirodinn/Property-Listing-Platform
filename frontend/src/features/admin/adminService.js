import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/admin";

// Get system metrics
const getSystemMetrics = async () => {
  const response = await axios.get(`${API_URL}/metrics`);
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

const getAllProperties = async () => {
  const response = await axios.get(`${API_URL}/properties`);
  return response.data;
};

// Get all tours (Admin)
const getAllTours = async () => {
  const response = await axios.get(`${API_URL}/tours/all`);
  return response.data;
};

// Disable property
const disableProperty = async (id) => {
  const response = await axios.put(`${API_URL}/properties/${id}/disable`);
  return response.data;
};

// Delete user
const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

// Delete tour
const deleteTour = async (id) => {
  const response = await axios.delete(`${API_URL}/tours/${id}`);
  return response.data;
};

const adminService = {
  getSystemMetrics,
  getAllUsers,
  getAllProperties,
  getAllTours,
  disableProperty,
  deleteUser,
  deleteTour,
};

export default adminService;
