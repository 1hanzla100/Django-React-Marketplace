import LoadingButton from "@mui/lab/LoadingButton";
import {
	Grid,
	Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import MyFormTextInput from "../InputFields/MyFormTextInput";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, userState } from "../../store/slices/userSlice";
import axios from "axios";
import { Box } from "@mui/system";
import { setNotificationMessage } from "../../store/slices/notificationSlice";

const UpdateProfile = () => {
	const user = useSelector(userState);
	const dispatch = useDispatch();

	const initialValues = {
		first_name: user.profile ? user.profile.first_name : "",
		last_name: user.profile ? user.profile.last_name : "",
		phone_no: user.profile ? user.profile.phone_no : "",
	};
	const validationSchema = Yup.object().shape({
		first_name: Yup.string()
			.min(3, "Must be atleast 3 characters")
			.max(12, "Must be Atleast 12 Characters or less")
			.required("First Name is required"),
		last_name: Yup.string()
			.min(3, "Must be atleast 3 characters")
			.max(12, "Must be Atleast 12 Characters or less")
			.required("This Field is Required"),
		phone_no: Yup.string().required("This Field is Required"),
	});
	const onSubmit = (
		{ first_name, last_name, phone_no },
		{ setSubmitting, resetForm, setFieldError }
	) => {
		axios
			.post("users/update-profile/", {
				first_name,
				last_name,
				phone_no,
			})
			.then((res) => {
				dispatch(
					setNotificationMessage("Profile Updated Successfully!")
				);
				resetForm();
				dispatch(updateProfile(res.data));
				setSubmitting(false);
			})
			.catch(({ response }) => {
				if (response) {
					let errors = response.data;
					let errorKeys = Object.keys(errors);
					errorKeys.map((val) => {
						if (Array.isArray(errors[val])) {
							setFieldError(val, errors[val][0]);
							return null;
						} else {
							setFieldError(val, errors[val]);
							return null;
						}
					});
				}
				setSubmitting(false);
			});
	};
	return (
		<>
			<Box
				sx={{
					marginTop: 6,
					marginBottom: 6,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h1" variant="h5">
					Update Profile
				</Typography>
				<Box component="div" sx={{ mt: 3 }}>
					<Formik
						enableReinitialize={true}
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
					>
						{(props) => (
							<Form>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<MyFormTextInput
											label="First Name"
											name="first_name"
											placeholder="Ali"
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<MyFormTextInput
											label="Last Name"
											name="last_name"
											placeholder="Hassan"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Phone Number"
											name="phone_no"
											placeholder="+921234567891"
										/>
									</Grid>
								</Grid>
								<LoadingButton
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 2, mb: 2 }}
									loading={props.isSubmitting}
								>
									Update Profile
								</LoadingButton>
							</Form>
						)}
					</Formik>
				</Box>
			</Box>
		</>
	);
};

export default UpdateProfile;
