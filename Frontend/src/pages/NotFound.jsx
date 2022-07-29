import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const NotFound = () => {
	return (
		<>
			<Navbar />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "60vh",
				}}
			>
				<Typography
					variant="h1"
					sx={{
						fontWeight: "light",
						fontSize: { xs: "8rem", sm: "10rem" },
					}}
				>
					404
				</Typography>
				<Typography
					variant="h3"
					sx={{
						fontSize: { xs: "1.5rem", sm: "2rem" },
					}}
				>
					Page Not Found!
				</Typography>
				<Link style={{ textDecoration: "none" }} to="/">
					<Button
						variant="contained"
						sx={{ color: "white", marginTop: "1rem" }}
						startIcon={<ArrowBack />}
					>
						Go Back to Home Page
					</Button>
				</Link>
			</Box>
		</>
	);
};

export default NotFound;
