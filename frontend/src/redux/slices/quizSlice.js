// src/redux/slices/quizSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizId: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizId: (state, action) => {
      state.quizId = action.payload;
    },
    clearQuizId: (state) => {
      state.quizId = null;
    },
  },
});

export const { setQuizId, clearQuizId } = quizSlice.actions;
export default quizSlice.reducer;
