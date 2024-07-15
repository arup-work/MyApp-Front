import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const initialAuthState = {
    isAuthenticated: !!token,
    auth: { token: token || null, user: user || null }
};
const authenticateSlice = createSlice({
    name: 'authenticated',
    initialState: initialAuthState,
    reducers: {
        // Function to login
        login(state, action) {
            const { token, user } = action.payload;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            state.isAuthenticated = true;
            state.auth = { token, user }

        },

        // Function to logout
        logout(state) {
            localStorage.removeItem('token'); //Remove "token" into local storage
            localStorage.removeItem('user');  //Remove "user details" into local storage
            state.isAuthenticated = false;
            state.auth = { token: null, user: null }
        }
    }
})

export const authActions = authenticateSlice.actions;

export default authenticateSlice.reducer;