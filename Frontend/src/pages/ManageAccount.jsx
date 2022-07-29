import * as React from "react";
import Navbar from "../components/Navbar";
import { Container, Divider } from "@mui/material";
import UpdateProfile from "../components/ManageAccountForms/UpdateProfile";
import ChangePassword from "../components/ManageAccountForms/ChangePassword";
import DeleteAccount from "../components/ManageAccountForms/DeleteAccount";

const ManageAccount = () => {
	return (
		<>
			<Navbar />
			<Container component="main" maxWidth="sm" sx={{ mt: 2 }}>
				<UpdateProfile />
				<Divider />
				<ChangePassword />
				<Divider />
				<DeleteAccount />
			</Container>
		</>
	);
};

export default ManageAccount;
