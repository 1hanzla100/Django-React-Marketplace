import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
	Container,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	Icon,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
	useMediaQuery,
} from "@mui/material";
import ListingCard from "../components/ListingCard";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyFormTextInput from "../components/InputFields/MyFormTextInput";
import {
	CategoryOutlined,
	Close,
	ExpandLess,
	ExpandMore,
	Search,
} from "@mui/icons-material";
import { Box } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import theme from "../theme";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const [data, setData] = React.useState([]);
	const ordering = {
		latest: "-timestamp",
		oldest: "timestamp",
		title: "title",
	};
	const [listingOrder, setListingOrder] = React.useState(ordering.latest);

	const [orderMenu, setOrderMenu] = React.useState(null);
	const openOrderMenu = Boolean(orderMenu);
	const handleClickOrderMenu = (event) => {
		setOrderMenu(event.currentTarget);
	};
	const handleCloseOrderMenu = () => {
		setOrderMenu(null);
	};
	const [openCategoriesDialog, setOpenCategoriesDialog] =
		React.useState(false);
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [categoryTypes, setCategoryTypes] = React.useState(null);

	const fetchListings = async (search) => {
		return search
			? await axios.get(
					`mart/listings/?ordering=${listingOrder}&search=${search}`
			  )
			: await axios.get(`mart/listings/?ordering=${listingOrder}`);
	};
	let navigate = useNavigate();
	React.useEffect(() => {
		fetchListings().then((res) => {
			setData(res.data);
		});
		axios
			.get("mart/category-types/")
			.then((res) => setCategoryTypes(res.data));
		// eslint-disable-next-line
	}, [listingOrder]);
	return (
		<>
			<Navbar />
			<Container maxWidth="xl" sx={{ mt: 3 }}>
				<Formik
					initialValues={{
						search: "",
					}}
					validationSchema={Yup.object({
						search: Yup.string().max(
							250,
							"Must be Atleast 250 Characters or less"
						),
					})}
					onSubmit={({ search }, { setSubmitting }) => {
						fetchListings(search).then((res) => {
							setData(res.data);
						});
						setSubmitting(false);
					}}
				>
					{(props) => (
						<Form>
							<Box
								sx={{
									display: "flex",
									alignItems: { md: "center", xs: "end" },
									justifyContent: {
										md: "space-between",
										xs: "end",
									},
									flexDirection: { md: "row", xs: "column" },
								}}
							>
								<MyFormTextInput
									label="Search"
									name="search"
									placeholder="Find everything you need"
									InputProps={{
										endAdornment: (
											<LoadingButton
												icon="search"
												type="submit"
												color="primary"
												loading={props.isSubmitting}
											>
												<Search />
											</LoadingButton>
										),
									}}
								/>
								<Box
									sx={{
										display: "flex",
										flexDirection: "row",
									}}
								>
									<Button
										id="basic-button"
										aria-controls="basic-menu"
										aria-haspopup="true"
										aria-expanded={
											openOrderMenu ? "true" : undefined
										}
										variant="contained"
										onClick={handleClickOrderMenu}
										startIcon={
											openOrderMenu ? (
												<ExpandLess />
											) : (
												<ExpandMore />
											)
										}
										sx={{
											whiteSpace: "nowrap",
											minWidth: "max-content",
											ml: { md: 2 },
											mr: { md: 0, xs: 1 },
											mt: { md: 0, xs: 2 },
										}}
									>
										Order By
									</Button>
									<Button
										id="basic-button"
										aria-controls="basic-menu"
										// aria-haspopup="true"
										variant="contained"
										onClick={() =>
											setOpenCategoriesDialog(true)
										}
										startIcon={<CategoryOutlined />}
										sx={{
											whiteSpace: "nowrap",
											minWidth: "max-content",
											ml: { md: 2 },
											mt: { md: 0, xs: 2 },
										}}
									>
										Categories
									</Button>
								</Box>
								<Dialog
									fullScreen={fullScreen}
									open={openCategoriesDialog}
									onClose={() =>
										setOpenCategoriesDialog(false)
									}
									aria-labelledby="responsive-dialog-title"
									fullWidth
									maxWidth="md"
								>
									<DialogTitle
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}
										id="responsive-dialog-title"
									>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<CategoryOutlined sx={{ mr: 1 }} />
											Categories
										</Box>
										<IconButton
											onClick={() =>
												setOpenCategoriesDialog(false)
											}
										>
											<Close />
										</IconButton>
									</DialogTitle>
									<DialogContent>
										<Grid container spacing={2}>
											{categoryTypes &&
												categoryTypes.map(
													(categoryType, i) => (
														<Grid
															key={i}
															item
															md={4}
														>
															<Typography
																sx={{
																	display:
																		"flex",
																	alignItems:
																		"center",
																}}
																variant="h6"
															>
																<Icon
																	sx={{
																		mr: 1,
																	}}
																>
																	{
																		categoryType.icon
																	}
																</Icon>
																{
																	categoryType.name
																}
															</Typography>

															<List
																component="nav"
																aria-label="main mailbox folders"
															>
																{categoryType.categories.map(
																	(
																		category,
																		catI
																	) => (
																		<ListItemButton
																			key={
																				catI
																			}
																			onClick={() => {
																				navigate(
																					`/categories/${category.slug}`
																				);
																				setOpenCategoriesDialog(
																					false
																				);
																			}}
																		>
																			<ListItemText
																				primary={
																					category.name
																				}
																			/>
																		</ListItemButton>
																	)
																)}
															</List>
														</Grid>
													)
												)}
										</Grid>
									</DialogContent>
								</Dialog>
								<Menu
									id="basic-menu"
									anchorEl={orderMenu}
									open={openOrderMenu}
									onClose={handleCloseOrderMenu}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}
								>
									<MenuItem
										onClick={() => {
											handleCloseOrderMenu();
											setListingOrder(ordering.latest);
										}}
									>
										By Latest
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleCloseOrderMenu();
											setListingOrder(ordering.oldest);
										}}
									>
										By Oldest
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleCloseOrderMenu();
											setListingOrder(ordering.title);
										}}
									>
										By Title
									</MenuItem>
								</Menu>
							</Box>
						</Form>
					)}
				</Formik>
				<Typography variant="h4" sx={{ my: 3 }}>
					Recent Listings
				</Typography>
				<Grid container spacing={3}>
					{data &&
						data.map((item) => {
							return (
								<Grid
									key={item.id}
									item
									xs={12}
									sm={6}
									md={4}
									lg={3}
								>
									<ListingCard item={item} />
								</Grid>
							);
						})}
				</Grid>
				{data.length < 1 ? (
					<Typography
						variant="h5"
						component="div"
						sx={{ mt: 3, textAlign: "center" }}
					>
						No listings to show.
					</Typography>
				) : null}
			</Container>
		</>
	);
};

export default Home;
