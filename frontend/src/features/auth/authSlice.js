import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, username: null, roles: null},
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, username, roles } = action.payload;
            state.token = accessToken;
            state.username = username; // store the username
            state.roles = roles  // store the roles
        },
        logOut: (state, action) => {
            state.token = null;
            state.username = null;
            state.roles = null  // clear the username
        }
    }
})


export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token