import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    residentes : []
}

export const ResidentesSlice = createSlice({
    name: "guardarResidentes",
    initialState,
    reducers:{
        guardarResidentes: (state, action) => {
            state.residentes = (action.payload);
        }
    }
})

export const { guardarResidentes } = ResidentesSlice.actions;
export default ResidentesSlice.reducer;