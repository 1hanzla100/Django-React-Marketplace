import React from "react";
import { useField } from "formik";
import { Checkbox, FormControlLabel } from "@mui/material";

const MyFormCheckbox = ({ label, ...props }) => {
	const [field] = useField(props);
	return (
		<FormControlLabel
			control={<Checkbox checked={field.value} {...field} {...props} />}
			label={label}
		/>
	);
};

export default MyFormCheckbox;
