import React from "react";
import { useField } from "formik";
import {
	FormControl,
	FormHelperText,
	Icon,
	InputLabel,
	ListSubheader,
	MenuItem,
	Select,
} from "@mui/material";

const MyFormCategorySelect = ({ label, items, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
			<InputLabel htmlFor="grouped-select">{label}</InputLabel>
			<Select
				value={items.length > 0 ? items[0].categories[0].id : ""}
				{...field}
				{...props}
				id="grouped-select"
				label={label}
			>
				{items.length > 0 &&
					items.map((item, index) => {
						return [
							<ListSubheader
								key={index}
								sx={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<Icon sx={{ mr: 1 }}>{item.icon}</Icon>
								{item.name}
							</ListSubheader>,
							item.categories.map((category) => (
								<MenuItem key={category.id} value={category.id}>
									{category.name}
								</MenuItem>
							)),
						];
					})}
			</Select>
			{meta.touched && meta.error && (
				<FormHelperText>{meta.error}</FormHelperText>
			)}
		</FormControl>
	);
};

export default MyFormCategorySelect;
