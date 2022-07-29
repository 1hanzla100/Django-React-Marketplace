import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	message: undefined,
};

export const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		setNotificationMessage: (state, action) => {
			state.message = action.payload;
		},
		removeNotificationMessage: (state) => {
			state.message = undefined;
		},
	},
});

export const { setNotificationMessage, removeNotificationMessage } =
	notificationSlice.actions;

export const notificationState = (state) => state.notification;

export default notificationSlice.reducer;
