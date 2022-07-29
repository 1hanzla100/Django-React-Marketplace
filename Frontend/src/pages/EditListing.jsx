import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import NumberFormat from "react-number-format";
import {
	Container,
	CssBaseline,
	Divider,
	Grid,
	IconButton,
	InputAdornment,
	List,
	ListItem,
} from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import MyFormSwitch from "../components/InputFields/MyFormSwitch";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MyFormTextInput from "../components/InputFields/MyFormTextInput";
import MyFormCheckbox from "../components/InputFields/MyFormCheckbox";
import MyFormCategorySelect from "../components/InputFields/MyFormCategorySelect";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import MyFormConditionSelect from "../components/InputFields/MyFormConditionSelect";
import { AttachMoney, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setNotificationMessage } from "../store/slices/notificationSlice";
import { useNavigate, useParams } from "react-router-dom";

const PriceFormat = React.forwardRef(function NumberFormatCustom(props, ref) {
	const { onChange, ...other } = props;

	return (
		<NumberFormat {...other} {...props} getInputRef={ref} isNumericString />
	);
});

const EditListing = () => {
	const [categoryTypes, setCategoryTypes] = React.useState([]);
	const [conditions, setConditions] = React.useState([]);
	const formRef = React.useRef(null);
	const mapContainer = React.useRef(null);
	const map = React.useRef(null);
	const [lng, setLng] = React.useState(74.3283);
	const [lat, setLat] = React.useState(31.5083);
	const [zoom, setZoom] = React.useState(9);
	const [listing, setListing] = React.useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { slug } = useParams();

	React.useEffect(() => {
		axios
			.get("mart/category-types/")
			.then((res) => setCategoryTypes(res.data));
		axios.get("mart/listing-conditions-options/").then((res) => {
			setConditions(res.data);
		});
		axios
			.get(`mart/listings/${slug}/`)
			.then((res) => {
				setListing(res.data);
				setLng(parseFloat(res.data.location_longitude));
				setLat(parseInt(res.data.location_latitude));
				new mapboxgl.Marker({})
					.setLngLat([lng, lat])
					.addTo(map.current);
			})
			.catch((err) => {
				if (err.response.status === 404) {
					navigate("/404");
				}
			});
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			zoom: zoom,
		});
		map.current.on("move", () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});
		let geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl: mapboxgl,
			marker: false,
		});
		map.current.addControl(geocoder);
		map.current.addControl(new mapboxgl.NavigationControl());
		map.current.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			})
		);
		let marker = new mapboxgl.Marker({});

		function add_marker(event) {
			var coordinates = event.lngLat;
			marker.setLngLat(coordinates).addTo(map.current);
		}
		map.current.on("click", add_marker);
		// eslint-disable-next-line
	}, []);

	const deleteListingImage = (image_id) => {
		setListing({
			...listing,
			images: listing.images.filter((image) => image.id !== image_id),
		});
		axios
			.delete(`mart/listings/${listing.slug}/delete-image/${image_id}/`)
			.then(() => {
				dispatch(setNotificationMessage("Image deleted successfully"));
			});
	};

	const initialValues = {
		title: listing ? listing.title : "",
		description: listing ? listing.description : "",
		category: listing ? listing.category.id : "",
		offer_delivery: listing ? listing.offer_delivery : false,
		price: listing ? listing.price : "",
		public_meetup: listing ? listing.public_meetup : false,
		door_pickup: listing ? listing.door_pickup : false,
		drop_off: listing ? listing.drop_off : false,
		images: null,
		condition: listing ? listing.condition : "",
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string()
			.min(10, "Must be atleast 10 characters")
			.max(100, "Must be atmost 100 characters")
			.required("This Field is Required"),
		description: Yup.string().required("This Field is Required"),
		category: Yup.string().required("This Field is Required"),
		offer_delivery: Yup.boolean().required("This Field is Required"),
		price: Yup.number().required("This Field is Required"),
		public_meetup: Yup.boolean().required("This Field is Required"),
		door_pickup: Yup.boolean().required("This Field is Required"),
		drop_off: Yup.boolean().required("This Field is Required"),
		images: Yup.mixed(),
		condition: Yup.string().required("This Field is Required"),
	});
	const onSubmit = (values, { setSubmitting, setFieldError, resetForm }) => {
		const formData = new FormData();
		if (values.images) {
			values.images.forEach((img, index) => {
				formData.append(`images[${index}]image`, img);
			});
		}

		let formDataObj = {
			title: values.title,
			description: values.description,
			condition: values.condition,
			price: values.price,
			offer_delivery: values.offer_delivery,
			public_meetup: values.public_meetup,
			door_pickup: values.door_pickup,
			drop_off: values.drop_off,
			location_longitude: lng,
			location_latitude: lat,
			category: values.category,
		};
		Object.keys(formDataObj).forEach((key) => {
			formData.append(key, formDataObj[key]);
		});
		axios({
			method: "put",
			url: `mart/listings/${slug}/update/`,
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((res) => {
				setSubmitting(false);
				dispatch(
					setNotificationMessage("Listing Updated Successfully")
				);
				navigate(`/listings/${listing.slug}/`);
			})
			.catch(({ response }) => {
				if (response) {
					let errors = response.data;
					let errorKeys = Object.keys(errors);
					console.log(errors);
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
			<Container component="main" maxWidth="md">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 6,
						marginBottom: 6,
					}}
				>
					<Typography
						sx={{ textAlign: "center", mb: 2 }}
						component="h1"
						variant="h5"
					>
						Create New Listing
					</Typography>
					<Formik
						enableReinitialize={true}
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
					>
						{({ setFieldValue, values, errors, isSubmitting }) => (
							<Form ref={formRef}>
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Listing Details
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Title"
											name="title"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Description"
											name="description"
											multiline
											rows={4}
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormCategorySelect
											label="Category"
											name="category"
											items={categoryTypes}
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormConditionSelect
											label="Condition"
											name="condition"
											items={conditions}
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormSwitch
											label="Offer Delivery"
											name="offer_delivery"
											type="checkbox"
										/>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Set Price
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Price"
											name="price"
											icon={<AttachMoney />}
											InputProps={{
												inputComponent: PriceFormat,
												startAdornment: (
													<InputAdornment position="start">
														<AttachMoney />
													</InputAdornment>
												),
											}}
										/>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Images
								</Typography>
								<List
									sx={{
										width: "100%",
									}}
								>
									<Grid container spacing={2}>
										{listing &&
											listing.images.map((image) => {
												return (
													<Grid
														key={image.id}
														item
														xs={12}
														sm={6}
													>
														<ListItem
															secondaryAction={
																<IconButton
																	edge="end"
																	color="error"
																	aria-label="delete_image"
																	disabled={
																		listing
																			.images
																			.length >
																		1
																			? false
																			: true
																	}
																	onClick={() =>
																		deleteListingImage(
																			image.id
																		)
																	}
																>
																	<Delete />
																</IconButton>
															}
															disablePadding
														>
															<img
																style={{
																	marginRight: 3,
																	marginBottom: 3,
																}}
																alt={
																	image.image
																}
																height="50"
																width="70"
																src={
																	image.image
																}
															/>
														</ListItem>
													</Grid>
												);
											})}
									</Grid>
								</List>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Upload New Images
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<input
											accept="image/png, image/jpeg, image/jpg, image/x-png"
											style={{ display: "none" }}
											id="raised-button-file"
											multiple
											type="file"
											onChange={(event) => {
												const uplaod_img = Array.from(
													event.currentTarget.files
												);
												if (
													uplaod_img &&
													uplaod_img.length > 0
												) {
													setFieldValue(
														"images",
														Array.from(
															event.currentTarget
																.files
														)
													);
												} else {
													setFieldValue(
														"images",
														null
													);
												}
											}}
										/>
										<label htmlFor="raised-button-file">
											<Button
												color="primary"
												variant="raised"
												component="span"
											>
												Upload
											</Button>
										</label>

										{values.images ? (
											<Typography sx={{ my: 2 }}>
												{`${values.images.length} Images Selected`}
											</Typography>
										) : null}

										{errors.images ? (
											<Typography
												color="error"
												sx={{ mt: 1 }}
											>
												{errors.images}
											</Typography>
										) : null}

										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
											}}
										>
											{values.images
												? values.images.map(
														(img, i) => (
															<img
																alt={URL.createObjectURL(
																	img
																)}
																style={{
																	marginRight: 3,
																	marginBottom: 3,
																}}
																key={i}
																height="50"
																width="70"
																src={URL.createObjectURL(
																	img
																)}
															/>
														)
												  )
												: null}
										</Box>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Meetup Preferences
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<MyFormCheckbox
											label="Public Meetup"
											name="public_meetup"
											type="checkbox"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormCheckbox
											label="Door Pickup"
											name="door_pickup"
											type="checkbox"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormCheckbox
											label="Drop Off"
											name="drop_off"
											type="checkbox"
										/>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Select Location
								</Typography>
								<Box
									sx={{
										height: {
											sm: "20rem",
											xs: "25rem",
										},
									}}
									ref={mapContainer}
									fullWidth
								/>
								<Divider sx={{ my: 2 }} />
								<LoadingButton
									type="submit"
									variant="contained"
									loading={isSubmitting}
								>
									Post Now
								</LoadingButton>
							</Form>
						)}
					</Formik>
				</Box>
			</Container>
		</>
	);
};

export default EditListing;
