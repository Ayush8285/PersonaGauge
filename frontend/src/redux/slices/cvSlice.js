// src/redux/slices/cvSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cvId: null,
};

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    setCvId: (state, action) => {
      state.cvId = action.payload;
    },
    clearCvId: (state) => {
      state.cvId = null;
    },
  },
});

export const { setCvId, clearCvId } = cvSlice.actions;
export default cvSlice.reducer;
