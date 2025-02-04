import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cvReducer from './slices/cvSlice';
import quizReducer from './slices/quizSlice';
import predictionReducer from './slices/predictionSlice';
import feedbackReducer from './slices/feedbackSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,          // Manages authentication (login/signup)
    cv: cvReducer,              // Handles CV uploads and processing
    quiz: quizReducer,          // Stores quiz answers
    prediction: predictionReducer, // Stores ML predictions
    feedback: feedbackReducer,  // Manages user feedback & rating
    settings: settingsReducer,  // Handles user settings
  },
  devTools: import.meta.env.MODE !== 'production', //  Vite-compatible DevTools condition
});

export default store;
