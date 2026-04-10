import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: [],
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    addResult: (state, action) => {
      state.results.unshift(action.payload);
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
  },
});

export const { addResult, setResults } = resultSlice.actions;
export default resultSlice.reducer;