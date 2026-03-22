import { configureStore } from "@reduxjs/toolkit";
import assessmentReducer from "../features/assessmentSlice";

const savedState = JSON.parse(localStorage.getItem("assessment"));

export const store = configureStore({
  reducer: {
    assessment: assessmentReducer,
  },
  preloadedState: {
    assessment: savedState || undefined,
  },
});