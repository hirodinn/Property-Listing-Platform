import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tourService from "./tourService";

const initialState = {
  tours: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Request a tour
export const requestTour = createAsyncThunk(
  "tours/request",
  async (tourData, thunkAPI) => {
    try {
      return await tourService.requestTour(tourData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get user tours
export const getUserTours = createAsyncThunk(
  "tours/getUserTours",
  async (_, thunkAPI) => {
    try {
      return await tourService.getUserTours();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get owner tours
export const getOwnerTours = createAsyncThunk(
  "tours/getOwnerTours",
  async (_, thunkAPI) => {
    try {
      return await tourService.getOwnerTours();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Update tour status
export const updateTourStatus = createAsyncThunk(
  "tours/updateStatus",
  async ({ tourId, status }, thunkAPI) => {
    try {
      return await tourService.updateTourStatus(tourId, status);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const tourSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestTour.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestTour.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tours.push(action.payload);
      })
      .addCase(requestTour.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserTours.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTours.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tours = action.payload;
      })
      .addCase(getUserTours.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getOwnerTours.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOwnerTours.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tours = action.payload;
      })
      .addCase(getOwnerTours.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTourStatus.fulfilled, (state, action) => {
        state.tours = state.tours.map((tour) =>
          tour._id === action.payload._id ? action.payload : tour,
        );
      });
  },
});

export const { reset } = tourSlice.actions;
export default tourSlice.reducer;
