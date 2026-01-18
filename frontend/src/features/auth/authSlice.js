import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "/api") + "/auth";
axios.defaults.withCredentials = true;

// Register User
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
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

// Login User
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data;
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

// Logout User
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (error) {
    console.error(error);
  }
});

// Get Me (Session Check)
export const getMe = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/me`);

    // Safety check: If we get HTML instead of JSON, we're likely hitting the catch-all
    if (
      typeof response.data === "string" &&
      response.data.includes("<!doctype html>")
    ) {
      return thunkAPI.rejectWithValue("Invalid session response");
    }

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Toggle Favorite
export const toggleFavorite = createAsyncThunk(
  "auth/toggleFavorite",
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/favorites/${id}`);
      return response.data; // Array of favorite IDs
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

// Get Favorites
export const getFavorites = createAsyncThunk(
  "auth/getFavorites",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/favorites`);
      return response.data; // Array of populated property objects
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

const initialState = {
  user: null, // If null, not logged in
  favoritesList: [], // Populated favorite properties
  isError: false,
  isSuccess: false,
  isLoading: false,
  favoritesLoading: false, // Separate loading for favorites to prevent dashboard re-mount loops
  message: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.user) {
          state.user.favorites = action.payload;
        }
      })
      // Get Favorites
      .addCase(getFavorites.pending, (state) => {
        state.favoritesLoading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.isSuccess = true;
        state.favoritesList = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
