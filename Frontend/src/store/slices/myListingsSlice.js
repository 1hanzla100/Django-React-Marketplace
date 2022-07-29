import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	listings: [],
};

export const myListingsSlice = createSlice({
	name: "myListings",
	initialState,
	reducers: {
		setMyListings: (state, action) => {
			state.listings = action.payload;
		},
	},
});

export const { setMyListings } = myListingsSlice.actions;

export const myListingsState = (state) => state.myListings;

export default myListingsSlice.reducer;
