// src/api/api.js
import axios from "axios";

// Update this to your actual gateway URL
export const BASE_URL = 'http://localhost:2005';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth Services
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/signin', credentials);
    localStorage.setItem("jwt", response.data.jwt);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred during login" };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    localStorage.setItem("jwt", response.data.jwt);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred during registration" };
  }
};

export const getUserProfile = async () => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get user profile" };
  }
};

// Task Services
export const getAllTasks = async (filter) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    let url = '/api/tasks';
    if (filter) {
      url += `?filter=${filter}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch tasks" };
  }
};

export const getUserTasks = async (filter) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    let url = '/api/tasks/user';
    if (filter) {
      url += `?filter=${filter}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user tasks" };
  }
};

export const createTask = async (taskData) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create task" };
  }
};

export const updateTask = async (id, taskData) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update task" };
  }
};

export const deleteTask = async (id) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete task" };
  }
};

export const assignTaskToUser = async (taskId, userId) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.put(`/api/tasks/${taskId}/user/${userId}/assign`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to assign task" };
  }
};

// Submission Services
export const submitTask = async (taskId, githubLink) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.post(`/api/submissions?task_id=${taskId}&github_link=${githubLink}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to submit task" };
  }
};

export const getSubmissions = async () => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.get('/api/submissions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch submissions" };
  }
};

export const getSubmissionsByTaskId = async (taskId) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.get(`/api/submissions/task/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch task submissions" };
  }
};

export const acceptDeclineSubmission = async (submissionId, status) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.put(`/api/submissions/${submissionId}?status=${status}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update submission status" };
  }
};

// User Services
export const getAllUsers = async () => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

export const searchUsers = async (query) => {
  try {
    setAuthHeader(localStorage.getItem("jwt"));
    const response = await api.get(`/api/users/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to search users" };
  }
};