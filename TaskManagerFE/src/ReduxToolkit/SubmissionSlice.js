// src/ReduxToolkit/SubmissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/api';

export const submitTask = createAsyncThunk(
  'submissions/submitTask',
  async ({ taskId, githubLink }, { rejectWithValue }) => {
    try {
      const response = await api.submitTask(taskId, githubLink);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to submit task");
    }
  }
);

export const fetchAllSubmissions = createAsyncThunk(
  'submissions/fetchAllSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getSubmissions();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch submissions");
    }
  }
);

export const fetchSubmissionsByTaskId = createAsyncThunk(
  'submissions/fetchSubmissionsByTaskId',
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const response = await api.getSubmissionsByTaskId(taskId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch task submissions");
    }
  }
);

export const acceptDeclineSubmission = createAsyncThunk(
  'submissions/acceptDeclineSubmission',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.acceptDeclineSubmission(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update submission status");
    }
  }
);

const submissionSlice = createSlice({
  name: 'submission',
  initialState: {
    submissions: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions.push(action.payload);
      })
      .addCase(submitTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = action.payload;
      })
      .addCase(fetchAllSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSubmissionsByTaskId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = action.payload;
      })
      .addCase(acceptDeclineSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = state.submissions.map((item) =>
          item.id !== action.payload.id ? item : action.payload
        );
      })
  },
});

export default submissionSlice.reducer;