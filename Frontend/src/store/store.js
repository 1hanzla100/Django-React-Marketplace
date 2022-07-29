import { configureStore } from "@reduxjs/toolkit";
import myListingsSlice from "./slices/myListingsSlice";
import notificationSlice from "./slices/notificationSlice";
import tokensSlice, {
	jwtMiddleware,
	reHydrateTokens,
} from "./slices/tokensSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
	reducer: {
		tokens: tokensSlice,
		myListings: myListingsSlice,
		user: userSlice,
		notification: notificationSlice,
	},
	preloadedState: {
		tokens: reHydrateTokens(),
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(jwtMiddleware),
	devTools: process.env.REACT_APP_ENV !== "production",
});
