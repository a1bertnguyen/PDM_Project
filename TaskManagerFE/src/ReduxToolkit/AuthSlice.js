// src/ReduxToolkit/AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/api';

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.login(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.register(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Registration failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem("jwt");
});

export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return rejectWithValue('No token found');
    }
    const response = await api.getUserProfile();
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch user profile');
  }
});

export const getUserList = createAsyncThunk('auth/getUserList', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllUsers();
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch users');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loggedIn: false,
    loading: false,
    error: null,
    jwt: localStorage.getItem("jwt") || null,
    users: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.loggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.loggedIn = false;
        state.jwt = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;