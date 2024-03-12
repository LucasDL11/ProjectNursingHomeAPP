import { configureStore } from "@reduxjs/toolkit";
import visitasReducer from "../features/visitasSlice"
import residentesReducer from "../features/residentesSlice"

export const store = configureStore({
    reducer:{
        visitas: visitasReducer,
        residentes: residentesReducer,
    }
})