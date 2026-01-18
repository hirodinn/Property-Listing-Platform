import axios from "axios";

const API_URL = "/api/properties";
const BASE_URL = "/api";

// Axios instance with credentials enabled for cookies
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
});

// Since we set baseURL in instance, we can just use /properties path or just use full URL if we stick to axios.
// Let's use axiosInstance.

// Create new property
const createProperty = async (propertyData) => {
  const response = await axiosInstance.post("/properties", propertyData);
  return response.data;
};

// Update property
const updateProperty = async (propertyId, propertyData) => {
  const response = await axiosInstance.put(
    `/properties/${propertyId}`,
    propertyData,
  );
  return response.data;
};

// Get all properties
const getProperties = async (params) => {
  const response = await axios.get(API_URL, { params }); // Public route, no need for credentials usually unless tracking?
  return response.data;
};

// Get user properties
const getMyProperties = async () => {
  const response = await axiosInstance.get("/properties/my");
  return response.data;
};

// Get property by ID
const getProperty = async (propertyId) => {
  const response = await axios.get(`${API_URL}/${propertyId}`);
  return response.data;
};

// Delete property
const deleteProperty = async (propertyId) => {
  const response = await axiosInstance.delete(`/properties/${propertyId}`);
  return response.data;
};

// Archive property
const archiveProperty = async (propertyId) => {
  const response = await axiosInstance.put(`/properties/${propertyId}/archive`);
  return response.data;
};

// Publish property
const publishProperty = async (propertyId) => {
  const response = await axiosInstance.put(`/properties/${propertyId}/publish`);
  return response.data;
};

// Approve property
const approveProperty = async (propertyId) => {
  const response = await axiosInstance.put(`/properties/${propertyId}/approve`);
  return response.data;
};

// Reject property
const rejectProperty = async (propertyId) => {
  const response = await axiosInstance.put(`/properties/${propertyId}/reject`);
  return response.data;
};

const propertyService = {
  createProperty,
  updateProperty,
  getProperties,
  getProperty,
  getMyProperties,
  deleteProperty,
  archiveProperty,
  publishProperty,
  approveProperty,
  rejectProperty,
};

export default propertyService;
