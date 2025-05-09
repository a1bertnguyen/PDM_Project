// store.js
import { configureStore, combineReducers, applyMiddleware } from '@reduxjs/toolkit';
import taskReducer from './TaskSlice';
import authReducer from './AuthSlice';
import submissionReducer from './SubmissionSlice';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({
  task: taskReducer,
  auth: authReducer,
  submission:submissionReducer
  // Add other reducers here if needed
});

const store = configureStore({
  reducer: rootReducer,
  // Add middleware, devTools, or other configurations here if needed
});

export default store;