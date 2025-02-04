import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for authentication
const initialState = {
  user: null,       // Stores the user info (after successful login)
  token: null,      // Stores the JWT token (for authenticated requests)
  isAuthenticated: false, // Boolean to check if the user is authenticated
  loading: false,   // To track loading state during API calls
  error: null,      // Error message during login/signup or other processes
};

// Async thunk for login (handling asynchronous API call)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);  // Change to your Flask login endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);  // In case of failure, return error message
    }
  }
);

// Async thunk for signup (handling asynchronous API call)
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/signup', userDetails);  // Change to your Flask signup endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);  // In case of failure, return error message
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Login action handlers
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to log in';
      });

    // Signup action handlers
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to sign up';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
