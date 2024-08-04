import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import favoriteReducer from "./slices/favoriteSlice";

const reduxStore = configureStore({
    reducer: {
        auth : authSlice,
        favorites: favoriteReducer
    }
})

export default reduxStore;