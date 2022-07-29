import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	profile: undefined,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.profile = action.payload;
		},
		updateProfile: (state, action) => {
			state.profile = { ...state.profile, ...action.payload };
		},
		removeUser: (state) => {
			state.profile = undefined;
		},
	},
});

export const { setUser, updateProfile, removeUser } = userSlice.actions;

export const userState = (state) => state.user;

export default userSlice.reducer;
