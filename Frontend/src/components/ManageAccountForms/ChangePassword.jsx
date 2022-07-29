import LoadingButton from "@mui/lab/LoadingButton";
import {
	Grid,
	Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import MyFormTextInput from "../InputFields/MyFormTextInput";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Box } from "@mui/system";
import { setNotificationMessage } from "../../store/slices/notificationSlice";

const ChangePassword = () => {
	const dispatch = useDispatch();
	const initialValues = {
		current_password: "",
		new_password: "",
		confirm_new_password: "",
	};
	const validationSchema = Yup.object().shape({
		current_password: Yup.string()
			.min(8, "Must be atleast 8 characters")
			.max(20, "Must be Atleast 20 Characters or less")
			.required("This Field is Required"),
		new_password: Yup.string()
			.min(8, "Must be atleast 8 characters")
			.max(20, "Must be Atleast 20 Characters or less")
			.required("This Field is Required"),
		confirm_new_password: Yup.string()
			.min(8, "Must be atleast 8 characters")
			.max(20, "Must be Atleast 20 Characters or less")
			.required("This Field is Required")
			.when("password", {
				is: (val) => (val && val.length > 0 ? true : false),
				then: Yup.string().oneOf(
					[Yup.ref("password")],
					"Password does not match"
				),
			}),
	});
	const onSubmit = (
		{ current_password, new_password },
		{ setSubmitting, resetForm, setFieldError }
	) => {
		axios
			.post("authentication/users/set_password/", {
				current_password,
				new_password,
			})
			.then((res) => {
				resetForm();
				setSubmitting(false);
				dispatch(
					setNotificationMessage("Password Changed Successfully!")
				);
			})
			.catch(({ response }) => {
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
					Change Password
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
									<Grid item xs={12}>
										<MyFormTextInput
											label="Current Password"
											name="current_password"
											type="password"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormTextInput
											label="New Password"
											name="new_password"
											type="password"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Confirm New Password"
											name="confirm_new_password"
											type="password"
										/>
									</Grid>
									<Grid item xs={12}>
										<LoadingButton
											type="submit"
											fullWidth
											variant="contained"
											loading={props.isSubmitting}
										>
											Change Password
										</LoadingButton>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Box>
			</Box>
		</>
	);
};

export default ChangePassword;
