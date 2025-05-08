// src/ReduxToolkit/TaskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../api/api';

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async ({ status, sortByCreatedAt, sortByDeadline }, { rejectWithValue }) => {
    try {
      const filter = status ? status : null;
      const response = await api.getAllTasks(filter);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch tasks");
    }
  }
);

export const fetchUsersTasks = createAsyncThunk(
  "task/fetchUsersTasks",
  async ({ status, sortByCreatedAt, sortByDeadline }, { rejectWithValue }) => {
    try {
      const filter = status ? status : null;
      const response = await api.getUserTasks(filter);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user tasks");
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "task/fetchTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.getTaskById(taskId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch task");
    }
  }
);

export const createNewTask = createAsyncThunk(
  "task/createNewTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.createTask(taskData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, updatedTaskData }, { rejectWithValue }) => {
    try {
      const response = await api.updateTask(id, updatedTaskData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update task");
    }
  }
);

export const assignedTaskToUser = createAsyncThunk(
  "task/assignedTaskToUser",
  async ({ userId, taskId }, { rejectWithValue }) => {
    try {
      const response = await api.assignTaskToUser(taskId, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to assign task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete task");
    }
  }
);

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
        state.error = action.payload;
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
        const updatedTask = action.payload;
        state.tasks = state.tasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      })
      .addCase(assignedTaskToUser.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.tasks = state.tasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;