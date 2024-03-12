import { createSlice } from "@reduxjs/toolkit";
/*
const initialState = {
    visitas : []
}

export const visitasSlice = createSlice({
    name: "guardarVisitas",
    initialState,
    reducers:{
        guardarVisitas: (state, action) => {
            state.visitas.push(action.payload);
        }
    }
})

export const { guardarVisitas } = visitasSlice.actions;
export default visitasSlice.reducer;*/

const initialState = {
    visitas: []
  };
  
  export const visitasSlice = createSlice({
    name: "visitas",
    initialState,
    reducers: {
      guardarVisitas: (state, action) => {
        state.visitas = action.payload;
      },
      limpiarVisitas: (state) => {
        state.visitas = [];
      }
    }
  });
  
  export const { guardarVisitas, limpiarVisitas } = visitasSlice.actions;
  export default visitasSlice.reducer;