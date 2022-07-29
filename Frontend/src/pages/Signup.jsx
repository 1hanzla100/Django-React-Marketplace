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
import { PersonAddAltOutlined } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { setNotificationMessage } from "../store/slices/notificationSlice";

const Signup = () => {
	const initialValues = {
		first_name: "",
		last_name: "",
		email: "",
		phone_no: "",
		password: "",
		confirm_password: "",
	};
	const validationSchema = Yup.object({
		first_name: Yup.string()
			.min(3, "Must be atleast 3 characters")
			.max(12, "Must be Atleast 12 Characters or less")
			.required("First Name is required"),
		last_name: Yup.string()
			.min(3, "Must be atleast 3 characters")
			.max(12, "Must be Atleast 12 Characters or less")
			.required("This Field is Required"),
		email: Yup.string()
			.email("Invalid Email")
			.required("This Field is Required"),
		phone_no: Yup.string().required("This Field is Required"),
		password: Yup.string()
			.min(8, "Must be atleast 8 characters")
			.max(20, "Must be Atleast 20 Characters or less")
			.required("This Field is Required"),
		confirm_password: Yup.string()
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
	const dispatch = useDispatch();
	const onSubmit = (
		{ first_name, last_name, email, password, phone_no },
		{ setSubmitting, resetForm, setFieldError }
	) => {
		axios
			.post("authentication/users/", {
				first_name,
				last_name,
				email,
				password,
				phone_no,
			})
			.then((res) => {
				if (res.status === 201) {
					resetForm();
					dispatch(
						setNotificationMessage(
							"Please Click on the link that has just been sent to your email address to verify your email and activate your account"
						)
					);
				}
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
						<PersonAddAltOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Signup
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
												id="first_name"
												placeholder="Ali"
												autoFocus
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
												label="Email"
												name="email"
												placeholder="example@gmail.com"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Phone Number"
												name="phone_no"
												placeholder="+921234567891"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Password"
												name="password"
												type="password"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Confirm Password"
												name="confirm_password"
												type="password"
											/>
										</Grid>
									</Grid>
									<LoadingButton
										type="submit"
										fullWidth
										variant="contained"
										sx={{ mt: 3, mb: 2 }}
										loading={props.isSubmitting}
									>
										Signup
									</LoadingButton>
									<Grid container justifyContent="flex-end">
										<Grid item>
											<Link
												to="/login"
												style={{
													textDecoration: "none",
												}}
											>
												<MuiLink
													component="p"
													variant="body2"
												>
													Already have an account?
													Login
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
export default Signup;
