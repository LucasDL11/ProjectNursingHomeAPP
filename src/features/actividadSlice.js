import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    actividad: []
};

export const actividadSlice = createSlice({
    name: "actividad",
    initialState,
    reducers: {
        guardarActividad: (state, action) => {
            state.actividad = action.payload;
        },
        limpiarActividad: (state) => {
            state.actividad = [];
        }
    }
});

export const { guardarActividad, limpiarActividad } = actividadSlice.actions;
export default actividadSlice.reducer;