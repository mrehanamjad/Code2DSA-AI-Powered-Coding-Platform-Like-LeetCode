import { createSlice } from "@reduxjs/toolkit"

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentCodeLanguage") || "javascript";
  }
  return "javascript";
};

const initialState = {
  currentCodeLanguage: getInitialLanguage(),
};


export const codeSlice = createSlice({
    name: "submission",
    initialState,
    reducers: {
        setCurrentCodeLanguageIS: (state, action) => {
            state.currentCodeLanguage = action.payload
            localStorage.setItem("currentCodeLanguage", action.payload || state.currentCodeLanguage )
        }   
    }

})

export const { setCurrentCodeLanguageIS} = codeSlice.actions

export default codeSlice.reducer