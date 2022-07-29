import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const tokensSlice = createSlice({
	name: "tokens",
	initialState,
	reducers: {
		setTokens: (state, action) => {
			state.access = action.payload.access;
			state.refresh = action.payload.refresh;
		},
		removeTokens: (state) => {
			state.access = undefined;
			state.refresh = undefined;
		},
	},
});

export const { setTokens, removeTokens } = tokensSlice.actions;

export const tokensState = (state) => state.tokens;

export default tokensSlice.reducer;

export const jwtMiddleware = (store) => (next) => (action) => {
	if (setTokens.match(action)) {
		localStorage.setItem("tokens", JSON.stringify(action.payload));
	} else if (removeTokens.match(action)) {
		localStorage.setItem("tokens", undefined);
	}
	const result = next(action);
	if (action.type?.startsWith("tokens/")) {
		const tokenState = store.getState().tokens;
		localStorage.setItem("tokens", JSON.stringify(tokenState));
	}
	return result;
};

export const reHydrateTokens = () => {
	if (localStorage.getItem("tokens") !== null) {
		return JSON.parse(localStorage.getItem("tokens")); // re-hydrate the store
	}
};
