import { createSlice } from "@reduxjs/toolkit";

import { addFavoritePost, removeFavoritePost } from "../thunks/favoriteThunks";

// Utility function to save State to localStorage
const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('favoritePosts', serializedState);
    } catch (error) {
        console.log("Could not save to local storage", error);
    }
}

// Utility function to load state from localStorage
const localStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('favoritePosts');
        return serializedState ? JSON.parse(serializedState) : [];
    } catch (error) {
        console.warn("Could not load state from localStorage", e);
        return [];
    }
}

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState: {
        favoritePosts : localStateFromLocalStorage(),
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addFavoritePost.fulfilled, (state, action) => {
            state.favoritePosts.push(action.payload.favoritePost);
            saveStateToLocalStorage(state.favoritePosts);
        })
        .addCase(addFavoritePost.rejected, (state, action) => {
            state.error = action.payload;
        }) 
        .addCase(removeFavoritePost.fulfilled, (state, action) => {
            state.favoritePosts = state.favoritePosts.filter(
                post => post != action.payload.removedPost
            );
            saveStateToLocalStorage(state.favoritePosts);
        })
        .addCase(removeFavoritePost.rejected, (state, action) => {
            state.error = action.payload;
        });
    }
})

export default favoriteSlice.reducer;
