import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role: localStorage.getItem("role"),
    isLoggedIn: !!localStorage.getItem("authToken"),
    username: localStorage.getItem("username"),
    token: localStorage.getItem("authToken"),
};

const appSlicer = createSlice({
    initialState,
    name: "app",
    reducers: {
        setToken: (state, action) => {
            console.log(action.payload);
            
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.role = action.payload.role;
            localStorage.setItem("authToken", action.payload.token);
            localStorage.setItem("username", action.payload.username);
            localStorage.setItem("role", action.payload.role);
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.username = null;
            state.role = null;
            localStorage.removeItem("authToken");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
        },
    },
});

export default appSlicer.reducer;
export const { setToken, logout } = appSlicer.actions;
