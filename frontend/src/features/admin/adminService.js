import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/admin";

// Get system metrics
const getSystemMetrics = async () => {
  const response = await axios.get(`${API_URL}/metrics`);
  return response.data;
};

// Disable property
const disableProperty = async (propertyId) => {
  const response = await axios.put(`${API_URL}/property/${propertyId}/disable`);
  return response.data;
};

const adminService = {
  getSystemMetrics,
  disableProperty,
};

export default adminService;
