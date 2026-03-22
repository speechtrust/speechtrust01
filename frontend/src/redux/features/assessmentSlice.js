import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: null,
  currentQuestion: null,
  questionIndex: 1,
  totalQuestions: 0,
  phase: "idle",
  result: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    startAssessment: (state, action) => {
      state.sessionId = action.payload.sessionId;
      state.currentQuestion = action.payload.question;
      state.totalQuestions = action.payload.totalQuestions;
      state.questionIndex = 1;
      state.phase = "reading";

      localStorage.setItem("assessment", JSON.stringify(state));
    },

    setNextQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      state.questionIndex += 1;
      state.phase = "reading";

      localStorage.setItem("assessment", JSON.stringify(state));
    },

    setPhase: (state, action) => {
      state.phase = action.payload;

      localStorage.setItem("assessment", JSON.stringify(state));
    },

    setResult: (state, action) => {
      state.result = action.payload;
      state.phase = "completed";

      localStorage.setItem("assessment", JSON.stringify(state));
    },

    resetAssessment: () => {
      localStorage.removeItem("assessment");
      return initialState;
    },
  },
});

export const {
  startAssessment,
  setNextQuestion,
  setPhase,
  setResult,
  resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;