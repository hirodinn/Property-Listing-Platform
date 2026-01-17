import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

const initialState = {
  usersCount: 0,
  propertiesCount: 0,
  recentActivities: [], // If backend provides this
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
        state.usersCount = action.payload.users;
        state.propertiesCount = action.payload.properties;
      })
      .addCase(getSystemMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(disableProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(disableProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Optionally update local list or just notify success
      })
      .addCase(disableProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
