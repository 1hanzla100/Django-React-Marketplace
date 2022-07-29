import React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import MyFormTextInput from "../components/InputFields/MyFormTextInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { LockOpenOutlined } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { setNotificationMessage } from "../store/slices/notificationSlice";

const ResetPassword = () => {
	const dispatch = useDispatch();
	const initialValues = {
		email: "",
	};
	const validationSchema = Yup.object({
		email: Yup.string()
			.email("Invalid Email")
			.required("This Field is Required"),
	});
	const onSubmit = ({ email }, { setSubmitting, resetForm }) => {
		axios
			.post("authentication/users/reset_password/", {
				email,
			})
			.then((res) => {
				resetForm();
				setSubmitting(false);
				dispatch(
					setNotificationMessage(
						"Password Reset Email has just been sent to your email address!"
					)
				);
			});
	};

	return (
		<>
			<Navbar />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 6,
						marginBottom: 6,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOpenOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Reset Password
					</Typography>
					<Box component="div" sx={{ mt: 3 }}>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
						>
							{(props) => (
								<Form>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Email"
												name="email"
												placeholder="example@gmail.com"
											/>
										</Grid>
										<Grid item xs={12}>
											<LoadingButton
												type="submit"
												fullWidth
												variant="contained"
												loading={props.isSubmitting}
											>
												Reset Password
											</LoadingButton>
										</Grid>
									</Grid>
								</Form>
							)}
						</Formik>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default ResetPassword;
