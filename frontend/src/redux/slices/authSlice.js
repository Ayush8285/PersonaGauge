import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://127.0.0.1:8000/api/auth";

// ✅ Signup Thunk
export const signup = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, userData);
    return response.data; // { user, access, refresh }
  } catch (error) {
    return rejectWithValue(error.response?.data || "Signup failed");
  }
});

// ✅ Login Thunk
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, credentials);
    return response.data; // { user, access, refresh }
  } catch (error) {
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

// ✅ Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: sessionStorage.getItem("accessToken") || null,
  refreshToken: sessionStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

// ✅ Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      sessionStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
        sessionStorage.setItem("accessToken", action.payload.access);
        sessionStorage.setItem("refreshToken", action.payload.refresh);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
        sessionStorage.setItem("accessToken", action.payload.access);
        sessionStorage.setItem("refreshToken", action.payload.refresh);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
