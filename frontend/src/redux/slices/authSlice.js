import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://127.0.0.1:8000/api/auth";

// ✅ Signup Thunk
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup/`, userData);
      return response.data; // { user_id, access, name }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

// ✅ Login Thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login/`, credentials);
      // console.log(response.data);
      return response.data; // { user_id , access, name }
      
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// ✅ Initial State
const initialState = {
  user: JSON.parse(sessionStorage.getItem("user")) || null,
  userId: localStorage.getItem("user_id") || null, // Store user_id
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: true,
  error: null,
};

// ✅ Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user_id");
      sessionStorage.removeItem("user");
      window.location.reload();
    },
    restoreSession: (state, action) => {
      state.user = action.payload.user;
      state.userId = action.payload.user.id;
      state.accessToken = action.payload.access;
      state.isAuthenticated = true;
      state.loading = false;
    },
    restoreFinished: (state) => {
      state.loading = false;
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
        state.userId = action.payload.user.id;
        state.accessToken = action.payload.access;
        state.user = action.payload.user;
        localStorage.setItem("user_id", action.payload.user.id);
        localStorage.setItem("accessToken", action.payload.access);
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
        state.userId = action.payload.user.id;
        state.accessToken = action.payload.access;
        state.user = action.payload.user;
        localStorage.setItem("user_id", action.payload.user.id);
        localStorage.setItem("accessToken", action.payload.access);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, restoreSession, restoreFinished } = authSlice.actions;
export default authSlice.reducer;
