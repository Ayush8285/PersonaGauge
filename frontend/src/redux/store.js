import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// import cvReducer from "./slices/cvSlice";
// import quizReducer from "./slices/quizSlice";

// import settingsReducer from "./slices/settingsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // cv: cvReducer,
    // quiz: quizReducer,
    // settings: settingsReducer,
  },
});

export default store;
