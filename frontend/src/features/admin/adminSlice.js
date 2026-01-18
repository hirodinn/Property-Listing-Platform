import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

const initialState = {
  usersCount: 0,
  propertiesCount: 0,
  toursCount: 0,
  pendingProperties: 0,
  usersList: [],
  propertiesList: [],
  toursList: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Helper to extract error message
const responseErrorMessage = (error) => {
  return (
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString()
  );
};

// Get System Metrics
export const getSystemMetrics = createAsyncThunk(
  "admin/getMetrics",
  async (_, thunkAPI) => {
    try {
      return await adminService.getSystemMetrics();
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get All Users
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllUsers();
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get All Properties
export const getAllProperties = createAsyncThunk(
  "admin/getAllProperties",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllProperties();
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Disable Property
export const disableProperty = createAsyncThunk(
  "admin/disableProperty",
  async (id, thunkAPI) => {
    try {
      return await adminService.disableProperty(id);
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get All Tours
export const getAllTours = createAsyncThunk(
  "admin/getAllTours",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllTours();
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSystemMetrics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSystemMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Correcting the mapping based on backend response keys
        state.usersCount = action.payload.totalUsers;
        state.propertiesCount = action.payload.totalProperties;
        state.pendingProperties = action.payload.pendingProperties;
        state.toursCount = action.payload.totalTours;
      })
      .addCase(getSystemMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersList = action.payload;
      })
      .addCase(getAllProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.propertiesList = action.payload;
      })
      .addCase(getAllTours.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTours.fulfilled, (state, action) => {
        state.isLoading = false;
        state.toursList = action.payload;
      })
      .addCase(disableProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update local state to reflect change - find property and update status
        const index = state.propertiesList.findIndex(
          (p) => p._id === action.payload.property._id,
        );
        if (index !== -1) {
          state.propertiesList[index] = action.payload.property;
        }
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
