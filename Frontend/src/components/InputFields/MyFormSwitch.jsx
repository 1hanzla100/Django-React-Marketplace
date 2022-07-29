import React from "react";
import { useField } from "formik";
import {
	FormControlLabel,
	Switch,
} from "@mui/material";

const MyFormSwitch = ({ label, ...props }) => {
	const [field, ] = useField(props);
	return (
		<FormControlLabel
			control={
				<Switch
					checked={field.value}
					{...field}
					{...props}
				/>
			}
			label={label}
		/>
	);
};

export default MyFormSwitch;
