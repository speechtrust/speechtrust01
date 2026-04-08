import { configureStore } from "@reduxjs/toolkit";
import assessmentReducer from "../features/assessmentSlice";
import userReducer from "../features/userSlice";

const savedAssessment = JSON.parse(localStorage.getItem("assessment"));
const savedUser = JSON.parse(localStorage.getItem("user"));

export const store = configureStore({
  reducer: {
    assessment: assessmentReducer,
    user: userReducer,
  },
  preloadedState: {
    assessment: savedAssessment || undefined,
    user: savedUser || undefined,
  },
});