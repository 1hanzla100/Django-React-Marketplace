import { blue, pink } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export default createTheme({
	palette: {
		primary: {
			main: blue[500],
		},
		secondary: {
			main: pink[500],
		},
	},
	typography: {
		fontFamily: ["Raleway", "sans-serif"].join(","),
	},
});
