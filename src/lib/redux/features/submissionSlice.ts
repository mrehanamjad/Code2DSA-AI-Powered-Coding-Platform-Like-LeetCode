import { createSlice } from "@reduxjs/toolkit"

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentCodeLanguage") || "javascript";
  }
  return "javascript";
};

const initialState = {
  submissionId: "",
  currentCodeLanguage: getInitialLanguage(),
};


export const submissionSlice = createSlice({
    name: "submission",
    initialState,
    reducers: {
        setSubmissionIdIS: (state, action) => {
            state.submissionId = action.payload
        },
        setCurrentCodeLanguageIS: (state, action) => {
            state.currentCodeLanguage = action.payload
            localStorage.setItem("currentCodeLanguage", action.payload || state.currentCodeLanguage )
        }   
    }

})

export const { setSubmissionIdIS , setCurrentCodeLanguageIS} = submissionSlice.actions

export default submissionSlice.reducer