import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const submitTask = createAsyncThunk(
  'submissions/submitTask',
  async ({ taskId, githubLink }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.post(`/api/submissions?task_id=${taskId}&github_link=${githubLink}`, {});
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Submit failed");
    }
  }
);

export const fetchAllSubmissions = createAsyncThunk(
  'submissions/fetchAllSubmissions',
  async () => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.get("/api/submissions");
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Fetch all submissions failed");
    }
  }
);

export const fetchSubmissionsByTaskId = createAsyncThunk(
  'submissions/fetchSubmissionsByTaskId',
  async ({ taskId }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.get(`/api/submissions/task/${taskId}`);
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Fetch by task ID failed");
    }
  }
);

export const acceptDeclineSubmission = createAsyncThunk(
  'submissions/acceptDeclineSubmission',
  async ({ id, status }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const response = await api.put(`/api/submissions/${id}?status=${status}`);
      return response.data;
    } catch (error) {
      throw Error(error?.response?.data?.error || "Update submission status failed");
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
        state.error = action.error.message;
      })

      .addCase(fetchAllSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = action.payload;
      })
      .addCase(fetchAllSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
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
      });
  },
});

export default submissionSlice.reducer;
