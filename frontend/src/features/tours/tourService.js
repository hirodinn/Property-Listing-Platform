import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "/api") + "/tours";

// Request a tour
const requestTour = async (tourData) => {
  const response = await axios.post(API_URL, tourData);
  return response.data;
};

// Get user tours
const getUserTours = async () => {
  const response = await axios.get(`${API_URL}/my-tours`);
  return response.data;
};

// Get owner tours
const getOwnerTours = async () => {
  const response = await axios.get(`${API_URL}/owner-tours`);
  return response.data;
};

// Update tour status
const updateTourStatus = async (tourId, status) => {
  const response = await axios.put(`${API_URL}/${tourId}`, { status });
  return response.data;
};

const tourService = {
  requestTour,
  getUserTours,
  getOwnerTours,
  updateTourStatus,
};

export default tourService;
