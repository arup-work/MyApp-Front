import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";

const reduxStore = configureStore({
    reducer: {
        auth : auth
    }
})

export default reduxStore;