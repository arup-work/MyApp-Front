import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import favoriteReducer from "./slices/favoriteSlice";
import commentsReducer from "./slices/commentSlice";

const reduxStore = configureStore({
    reducer: {
        auth : authSlice,
        favorites: favoriteReducer,
        comments: commentsReducer

    }
})

export default reduxStore;