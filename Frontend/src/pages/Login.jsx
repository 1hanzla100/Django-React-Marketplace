import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import MyFormTextInput from "../components/InputFields/MyFormTextInput";
import { Form, Formik } from "formik";
import MuiLink from "@mui/material/Link";
import * as Yup from "yup";
import { LockOutlined } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { setTokens } from "../store/slices/tokensSlice";

const Login = () => {
	const dispatch = useDispatch();
	const initialValues = {
		email: "",
		password: "",
	};
	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email("Invalid Email")
			.required("This Field is Required"),
		password: Yup.string()
			.min(8, "Must be atleast 8 characters")
			.max(20, "Must be Atleast 20 Characters or less")
			.required("This Field is Required"),
	});

	const onSubmit = (
		{ email, password },
		{ setSubmitting, setFieldError, resetForm }
	) => {
		axios
			.post("token/", {
				email,
				password,
			})
			.then((res) => {
				resetForm();
				dispatch(setTokens(res.data));
				setSubmitting(false);
			})
			.catch(({ response }) => {
				axios
					.get(`users/is-user-active/${email}/`)
					.then((res) => {
						if (res.data.is_active === false) {
							axios
								.post(
									"authentication/users/resend_activation/",
									{
										email: res.data.email,
									}
								)
								.then((res) => {
									if (res.status === 204) {
										setFieldError(
											"email",
											"Your Email is not verified! We have resent verification email"
										);
									}
								});
						} else {
							if (response) {
								let error = response.data?.detail;
								setFieldError("email", error);
							}
						}
					})
					.catch(({ response }) => {
						if (response) {
							let error = response.data?.detail;
							setFieldError("email", error);
						}
					});
				setSubmitting(false);
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
						<LockOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Login
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
											<MyFormTextInput
												label="Password"
												name="password"
												type="password"
											/>
										</Grid>
									</Grid>
									<Grid
										sx={{ mt: 2 }}
										container
										justifyContent="flex-start"
									>
										<Grid item>
											<Link
												to="/signup"
												style={{
													textDecoration: "none",
												}}
											>
												<MuiLink
													component="p"
													variant="body2"
												>
													Dont have account? Signup
												</MuiLink>
											</Link>
										</Grid>
									</Grid>
									<LoadingButton
										type="submit"
										fullWidth
										variant="contained"
										sx={{ mt: 2, mb: 2 }}
										loading={props.isSubmitting}
									>
										Login
									</LoadingButton>
									<Grid container justifyContent="flex-end">
										<Grid item>
											<Link
												to="/reset-password"
												style={{
													textDecoration: "none",
												}}
											>
												<MuiLink
													component="p"
													variant="body2"
												>
													Forget Password?
												</MuiLink>
											</Link>
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

export default Login;
