import LoadingButton from "@mui/lab/LoadingButton";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import MyFormTextInput from "../InputFields/MyFormTextInput";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
	removeUser,
} from "../../store/slices/userSlice";
import axios from "axios";
import { Box } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import theme from "../../theme";
import { removeTokens } from "../../store/slices/tokensSlice";
import { setNotificationMessage } from "../../store/slices/notificationSlice";
import { useNavigate } from "react-router";

const DeleteAccount = () => {
	const dispatch = useDispatch();
	const [openDialog, setOpenDialog] = React.useState(false);
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const navigate = useNavigate();

	const initialValues = {
		current_password: "",
	};
	const validationSchema = Yup.object().shape({
		current_password: Yup.string()
			.min(8, "Must be atleast 8 characters")
			.max(20, "Must be Atleast 20 Characters or less")
			.required("This Field is Required"),
	});
	const onSubmit = (
		{ current_password },
		{ setSubmitting, resetForm, setFieldError }
	) => {
		axios
			.delete("authentication/users/me/", {
				data: {
					current_password,
				},
			})
			.then((res) => {
				dispatch(removeUser());
				dispatch(removeTokens());
				dispatch(
					setNotificationMessage("Account Deleted Successfully!")
				);
				resetForm();
				setSubmitting(false);
				setOpenDialog(false);
				navigate("/");
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
					Delete Account
				</Typography>
				<Typography component="p" variant="body1">
					Are you sure you want to delete your account?
				</Typography>
				<Button
					variant="contained"
					onClick={() => setOpenDialog(true)}
					color="error"
					sx={{ mt: 2 }}
				>
					Delete Account
				</Button>
				<Dialog
					fullScreen={fullScreen}
					open={openDialog}
					onClose={() => setOpenDialog(false)}
					aria-labelledby="responsive-dialog-title"
					fullWidth
				>
					<DialogTitle id="responsive-dialog-title">
						Delete Account
					</DialogTitle>

					<Formik
						enableReinitialize={true}
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
					>
						{(props) => (
							<Form>
								<DialogContent>
									<MyFormTextInput
										label="Current Password"
										name="current_password"
										type="password"
									/>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={() => setOpenDialog(false)}
									>
										Cancel
									</Button>
									<LoadingButton
										type="submit"
										variant="contained"
										sx={{ mt: 2, mb: 2 }}
										loading={props.isSubmitting}
									>
										Delete Account
									</LoadingButton>
								</DialogActions>
							</Form>
						)}
					</Formik>
				</Dialog>
			</Box>
		</>
	);
};

export default DeleteAccount;
