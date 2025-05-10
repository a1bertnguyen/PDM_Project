import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, api, setAuthHeader } from '../api/api';

// 🔐 LOGIN
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
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post(`${BASE_URL}/auth/signup`, userData);
    localStorage.setItem("jwt", response.data.jwt);
    console.log("✅ register success", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ register error", error);
    return rejectWithValue(error.response?.data?.error || "Registration failed");
  }
});

// 🚪 LOGOUT - cập nhật để xóa sạch localStorage
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    console.log("Executing logout action");
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("isAuthenticated");
    localStorage.clear();

    // Dispatch thành công
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed");
  }
});

// 👤 GET PROFILE - Thêm lại action này nếu nó đã bị xóa
export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (jwt, { rejectWithValue }) => {
  setAuthHeader(jwt, api);
  try {
    const response = await api.get('/api/users/profile');
    console.log("✅ get profile", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ get profile error", error);
    localStorage.removeItem("jwt"); // Remove invalid token
    return rejectWithValue(error?.response?.data?.error || "Failed to get profile");
  }
});

// 📋 GET USER LIST
export const getUserList = createAsyncThunk('auth/getUserList', async (jwt, { rejectWithValue }) => {
  setAuthHeader(jwt, api);
  try {
    const response = await api.get('/api/users');
    console.log("✅ user list", response.data);
    return response.data || []; // Đảm bảo trả về mảng rỗng nếu response.data là null
  } catch (error) {
    console.log("❌ get users error", error);
    return rejectWithValue("Get users failed");
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
    users: [],
    lastAction: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logAuthState: (state) => {
      console.log("Current auth state:", {
        user: state.user ? "EXISTS" : "NULL",
        loggedIn: state.loggedIn,
        error: state.error,
        jwt: state.jwt ? "[TOKEN EXISTS]" : null
      });
    },
    resetAuthState: (state) => {
      // Reset state thủ công để đảm bảo mọi giá trị được xóa sạch
      state.user = null;
      state.loggedIn = false;
      state.loading = false;
      state.error = null;
      state.jwt = null;
      state.users = [];
      state.lastAction = "resetAuthState";
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = "login.pending";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.user = action.payload;
        state.loggedIn = true;
        state.error = null;
        state.lastAction = "login.fulfilled";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid email or password";
        state.jwt = null;
        state.user = null;
        state.loggedIn = false;
        state.lastAction = "login.rejected";
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = "register.pending";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.user = action.payload;
        state.loggedIn = true;
        state.error = null;
        state.lastAction = "register.fulfilled";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.loggedIn = false;
        state.lastAction = "register.rejected";
      })

      // GET PROFILE
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.lastAction = "getUserProfile.pending";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedIn = true;
        state.error = null;
        state.lastAction = "getUserProfile.fulfilled";
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.user = null;
        state.loggedIn = false;
        state.jwt = null;
        state.lastAction = "getUserProfile.rejected";
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.lastAction = "logout.pending";
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.jwt = null;
        state.loggedIn = false;
        state.users = [];
        state.error = null;
        state.lastAction = "logout.fulfilled";
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.lastAction = "logout.rejected";
        // Vẫn xóa thông tin đăng nhập kể cả khi có lỗi
        state.user = null;
        state.jwt = null;
        state.loggedIn = false;
      })

      // GET USER LIST
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.lastAction = "getUserList.pending";
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.lastAction = "getUserList.fulfilled";
      })
      .addCase(getUserList.rejected, (state) => {
        state.loading = false;
        state.users = [];
        state.lastAction = "getUserList.rejected";
      });
  },
});

export const { clearError, logAuthState, resetAuthState } = authSlice.actions;
export default authSlice.reducer;