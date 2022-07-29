import React from "react";
import { useField } from "formik";
import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";

const MyFormConditionSelect = ({ label, items, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
			<InputLabel htmlFor="grouped-select">{label}</InputLabel>
			<Select
				value={""}
				{...field}
				{...props}
				id="grouped-select"
				label={label}
			>
				{items.length > 0 &&
					items.map((item, index) => {
						return (
							<MenuItem key={index} value={item.value}>
								{item.label}
							</MenuItem>
						);
					})}
			</Select>
			{meta.touched && meta.error && (
				<FormHelperText>{meta.error}</FormHelperText>
			)}
		</FormControl>
	);
};

export default MyFormConditionSelect;
