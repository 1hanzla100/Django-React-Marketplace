import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import axios from "axios";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Loader from "./components/Loader";
const App = lazy(() => import("./App"));
// ThunkAsync
// Antity Adapter
// Query
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HOST;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS;

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<Suspense fallback={<Loader />}>
					<App />
				</Suspense>
			</Provider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

serviceWorker.unregister();
