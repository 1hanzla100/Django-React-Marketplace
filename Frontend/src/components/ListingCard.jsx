import {
	Card,
	Box,
	CardActions,
	CardContent,
	IconButton,
	CardMedia,
	Chip,
	Typography,
	DialogContent,
	Dialog,
	DialogTitle,
	useMediaQuery,
	Button,
	DialogActions,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { userState } from "../store/slices/userSlice";
import theme from "../theme";
import { setNotificationMessage } from "../store/slices/notificationSlice";
import axios from "axios";
import { tokensState } from "../store/slices/tokensSlice";
import { setMyListings } from "../store/slices/myListingsSlice";

const ListingCard = ({ item, showActions }) => {
	const user = useSelector(userState);
	const [deleteListingDialog, setDeleteListingDialog] = React.useState(false);
	const tokens = useSelector(tokensState);
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const deleteListing = () => {
		axios
			.delete(
				`http://localhost:8000/api/mart/listings/${item.slug}/delete/`
			)
			.then((response) => {
				dispatch(setNotificationMessage(response.data.detail));
				axios
					.get("mart/my-listings/", {
						headers: {
							Authorization: `Bearer ${tokens.access}`,
						},
					})
					.then((res) => {
						dispatch(setMyListings(res.data));
					});
			});
	};

	return (
		<>
			<Dialog
				fullScreen={fullScreen}
				open={deleteListingDialog}
				onClose={() => setDeleteListingDialog(false)}
				aria-labelledby="responsive-dialog-title"
				fullWidth
			>
				<DialogTitle id="responsive-dialog-title">
					Delete Listing
				</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete this listing?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteListingDialog(false)}>
						Cancel
					</Button>
					<Button
						color="error"
						onClick={() => {
							deleteListing();
							setDeleteListingDialog(false);
						}}
						type="submit"
						variant="contained"
						sx={{ mt: 2, mb: 2 }}
					>
						Delete Account
					</Button>
				</DialogActions>
			</Dialog>
			<Card key={item.id}>
				<Link
					style={{ textDecoration: "none" }}
					to={`/listings/${item.slug}`}
				>
					<CardMedia
						component="img"
						height="140"
						image={item.images[0].image_url}
						alt="green iguana"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							$ {item.price}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{item.title.length > 50
								? item.title.substring(0, 50) + "..."
								: item.title}
						</Typography>
						<Chip
							label={item.category.name}
							color="primary"
							size="small"
							sx={{ mt: 1 }}
						/>
					</CardContent>
				</Link>
				<CardActions
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Typography
						sx={{
							fontSize: "1rem",
						}}
					>
						{moment(item.timestamp).fromNow()}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						{showActions &&
							user.profile &&
							user.profile.id === item.user.id && (
								<>
									<IconButton
										aria-label="edit"
										color="warning"
										onClick={() =>
											navigate(
												`/listings/${item.slug}/edit`
											)
										}
									>
										<EditOutlined />
									</IconButton>
									<IconButton
										onClick={() =>
											setDeleteListingDialog(true)
										}
										aria-label="delete"
										color="error"
									>
										<DeleteOutlined />
									</IconButton>
								</>
							)}
					</Box>
				</CardActions>
			</Card>
		</>
	);
};

export default ListingCard;
