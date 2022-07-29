import React from "react";
import { useField } from "formik";
import { TextField } from "@mui/material";

const MyFormTextInput = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<TextField
			label={label}
			{...field}
			{...props}
			fullWidth
			error={meta.touched && Boolean(meta.error)}
			helperText={meta.touched && meta.error}
		/>
	);
};

export default MyFormTextInput;
