import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyService from "./propertyService";

const initialState = {
  properties: [],
  property: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
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

// Create new property
export const createProperty = createAsyncThunk(
  "properties/create",
  async (propertyData, thunkAPI) => {
    try {
      return await propertyService.createProperty(propertyData);
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get properties
export const getProperties = createAsyncThunk(
  "properties/getAll",
  async (params, thunkAPI) => {
    try {
      return await propertyService.getProperties(params);
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get My Properties
export const getMyProperties = createAsyncThunk(
  "properties/getMy",
  async (_, thunkAPI) => {
    try {
      return await propertyService.getMyProperties();
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get property by ID
export const getProperty = createAsyncThunk(
  "properties/getOne",
  async (id, thunkAPI) => {
    try {
      return await propertyService.getProperty(id);
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
// Delete property
export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id, thunkAPI) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error) {
      const message = responseErrorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.push(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload.properties;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.property = action.payload;
      })
      .addCase(getProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload;
      })
      .addCase(getMyProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.filter(
          (property) => property._id !== action.payload,
        );
      });
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;
