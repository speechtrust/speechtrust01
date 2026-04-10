import { configureStore } from "@reduxjs/toolkit";
import assessmentReducer from "../features/assessmentSlice";
import userReducer from "../features/userSlice";
import resultReducer from "../features/resultSlice";

const savedAssessment = JSON.parse(localStorage.getItem("assessment"));
const savedUser = JSON.parse(localStorage.getItem("user"));

export const store = configureStore({
  reducer: {
    assessment: assessmentReducer,
    user: userReducer,
    result: resultReducer, // ✅ ADDED
  },
  preloadedState: {
    assessment: savedAssessment || undefined,
    user: savedUser || undefined,
  },
});