import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, setAuthHeader } from "../api/api";

// 📥 Admin fetch all tasks
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async ({ status, sortByCreatedAt, sortByDeadline }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.get("/api/tasks", {
        params: { status, sortByDeadline, sortByCreatedAt },
      });
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Fetch tasks failed");
    }
  }
);

// 📥 User fetch assigned tasks
export const fetchUsersTasks = createAsyncThunk(
  "task/fetchUsersTasks",
  async ({ status, sortByCreatedAt, sortByDeadline }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.get("/api/tasks/user", {
        params: { status, sortByDeadline, sortByCreatedAt },
      });
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Fetch user's tasks failed");
    }
  }
);

// 📄 Get task by ID
export const fetchTaskById = createAsyncThunk(
  "task/fetchTaskById",
  async (taskId) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.get(`/api/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Fetch task by ID failed");
    }
  }
);

// ➕ Create task
export const createNewTask = createAsyncThunk(
  "task/createNewTask",
  async (taskData) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.post("/api/tasks", taskData);
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Create task failed");
    }
  }
);

// ✏️ Update task
export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, updatedTaskData }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.put(`/api/tasks/${id}`, updatedTaskData);
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Update task failed");
    }
  }
);

// 👤 Assign task
export const assignedTaskToUser = createAsyncThunk(
  "task/assignedTaskToUser",
  async ({ userId, taskId }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.put(`/api/tasks/${taskId}/user/${userId}/assigned`);
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Assign task failed");
    }
  }
);

// ❌ Delete task
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      await api.delete(`/api/tasks/${id}`);
      return id;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Delete task failed");
    }
  }
);

// 🧠 Slice config
const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    taskDetails: null,
    usersTask: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUsersTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetails = action.payload;
      })

      .addCase(createNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const updated = action.payload;
        state.tasks = state.tasks.map(task =>
          task.id === updated.id ? { ...task, ...updated } : task
        );
      })

      .addCase(assignedTaskToUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.tasks = state.tasks.map(task =>
          task.id === updated.id ? { ...task, ...updated } : task
        );
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
