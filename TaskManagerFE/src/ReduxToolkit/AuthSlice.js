import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, api, setAuthHeader } from '../api/api';

// 🔐 LOGIN
// Trong LoginSlice.js
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    console.log("Sending login request:", userData);

    const response = await axios.post(`${BASE_URL}/auth/signin`, {
      email: userData.email,
      password: userData.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("Login response:", response.data);
    localStorage.setItem("jwt", response.data.jwt);
    return response.data;
  } catch (error) {
    console.log("Login error full:", error);
    if (error.response) {
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
      return rejectWithValue(error.response.data.message || "Login failed");
    }
    return rejectWithValue("Network error");
  }
});

// 📝 REGISTER
export const register = createAsyncThunk('auth/register', async (userData) => {
  try {
    const response = await api.post(`${BASE_URL}/auth/signup`, userData);
    localStorage.setItem("jwt", response.data.jwt);
    console.log("✅ register success", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ register error", error);
    throw Error(error.response?.data?.error || "Registration failed");
  }
});

// 🚪 LOGOUT
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    localStorage.clear();
  } catch (error) {
    throw Error("Logout failed");
  }
});

// 👤 GET PROFILE (Fix transformResponse issue with MSW)
// Thay đổi hàm getUserProfile
export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (jwt) => {
  setAuthHeader(jwt, api);
  try {
    const response = await api.get('/api/users/profile');
    console.log("✅ get profile", response.data);
    return response.data; // Chỉ trả về data, không trả về toàn bộ response
  } catch (error) {
    console.log("❌ get profile error", error);
    throw Error(error?.response?.data?.error || "Get profile failed");
  }
});

// 📋 GET USER LIST
export const getUserList = createAsyncThunk('auth/getUserList', async (jwt) => {
  setAuthHeader(jwt, api);
  try {
    const response = await api.get('/api/users');
    console.log("✅ user list", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ get users error", error);
    throw Error("Get users failed");
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loggedIn: false,
    loading: false,
    error: null,
    jwt: null,
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
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.jwt = null;
        state.loggedIn = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      });
  },
});

export default authSlice.reducer;
