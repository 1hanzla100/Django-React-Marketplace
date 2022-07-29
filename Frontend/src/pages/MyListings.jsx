import { Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import {
	myListingsState,
	setMyListings,
} from "../store/slices/myListingsSlice";
import { tokensState } from "../store/slices/tokensSlice";
const MyListings = () => {
	const { listings } = useSelector(myListingsState);
	const dispatch = useDispatch();
	const tokens = useSelector(tokensState);
	React.useEffect(() => {
		axios
			.get("mart/my-listings/", {
				headers: {
					Authorization: `Bearer ${tokens.access}`,
				},
			})
			.then((res) => {
				dispatch(setMyListings(res.data));
			});
		// eslint-disable-next-line
	}, []);
	return (
		<>
			<Navbar />
			<Container maxWidth="xl" sx={{ mt: 3 }}>
				<Grid container spacing={3}>
					{listings &&
						listings.map((item) => {
							return (
								<Grid
									key={item.id}
									item
									xs={12}
									sm={6}
									md={4}
									lg={3}
								>
									<ListingCard
										item={item}
										showActions={true}
									/>
								</Grid>
							);
						})}
				</Grid>
				{listings.length < 1 ? (
					<Typography
						variant="h5"
						component="div"
						sx={{ mt: 3, textAlign: "center" }}
					>
						You have no listings
					</Typography>
				) : null}
			</Container>
		</>
	);
};

export default MyListings;
