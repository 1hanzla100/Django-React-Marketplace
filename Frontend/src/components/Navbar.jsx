import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
	Logout,
	AccountCircleOutlined,
	Login,
	PersonAddAlt1Outlined,
	ArticleOutlined,
	CameraAltOutlined,
} from "@mui/icons-material";
import { removeTokens, tokensState } from "../store/slices/tokensSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	Button,
	CssBaseline,
	Slide,
	useScrollTrigger,
	Drawer,
	List,
	ListItem,
	Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import { removeUser } from "../store/slices/userSlice";
import { setNotificationMessage } from "../store/slices/notificationSlice";

export default function MenuAppBar() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const tokens = useSelector(tokensState);
	const trigger = useScrollTrigger();
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
	const dispatch = useDispatch();
	const logout = () => {
		dispatch(removeTokens());
		dispatch(removeUser());
		dispatch(setNotificationMessage("Logged out successfully"));
	};
	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Slide appear={false} direction="down" in={!trigger}>
				<AppBar position="sticky">
					<CssBaseline />
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => setIsDrawerOpen(true)}
							sx={{ mr: 2, display: { md: "none" } }}
						>
							<MenuIcon />
						</IconButton>
						<Link
							style={{ textDecoration: "none", flexGrow: 1 }}
							to="/"
						>
							<Typography
								variant="h4"
								color="white"
								sx={{
									flexGrow: 1,
									fontFamily: '"Festive", cursive',
								}}
							>
								Atlas Mart
							</Typography>
						</Link>
						<Box sx={{ display: { md: "flex", xs: "none" } }}>
							{tokens && tokens.access ? (
								<div>
									<Link
										style={{ textDecoration: "none" }}
										to="/create-listing"
									>
										<Button
											variant="text"
											sx={{ color: "white" }}
											startIcon={<CameraAltOutlined />}
										>
											Start Selling
										</Button>
									</Link>
									<IconButton
										size="large"
										aria-label="account of current user"
										aria-controls="menu-appbar"
										aria-haspopup="true"
										onClick={handleMenu}
										color="inherit"
									>
										<AccountCircleOutlined />
									</IconButton>
									<Menu
										id="menu-appbar"
										anchorEl={anchorEl}
										anchorOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										keepMounted
										transformOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										open={Boolean(anchorEl)}
										onClose={handleClose}
									>
										<Link
											style={{ textDecoration: "none" }}
											to="/my-listings"
										>
											<MenuItem
												sx={{ color: "black" }}
												onClick={handleClose}
											>
												<ListItemIcon>
													<ArticleOutlined fontSize="small" />
												</ListItemIcon>
												<ListItemText>
													My Listings
												</ListItemText>
											</MenuItem>
										</Link>
										<Divider />

										<Link
											style={{ textDecoration: "none" }}
											to="/account"
										>
											<MenuItem
												sx={{ color: "black" }}
												onClick={handleClose}
											>
												<ListItemIcon>
													<AccountCircleOutlined fontSize="small" />
												</ListItemIcon>
												<ListItemText>
													Manage Account
												</ListItemText>
											</MenuItem>
										</Link>
										<MenuItem
											onClick={() => {
												handleClose();
												logout();
											}}
											sx={{ color: "black" }}
										>
											<ListItemIcon>
												<Logout fontSize="small" />
											</ListItemIcon>
											<ListItemText>Logout</ListItemText>
										</MenuItem>
									</Menu>
								</div>
							) : (
								<div>
									<Link
										style={{ textDecoration: "none" }}
										to="/login"
									>
										<Button
											variant="text"
											sx={{ color: "white" }}
											startIcon={<Login />}
										>
											Login
										</Button>
									</Link>
									<Link
										style={{ textDecoration: "none" }}
										to="/signup"
									>
										<Button
											variant="text"
											sx={{ color: "white" }}
											startIcon={
												<PersonAddAlt1Outlined />
											}
										>
											Signup
										</Button>
									</Link>
								</div>
							)}
						</Box>
					</Toolbar>
				</AppBar>
			</Slide>

			<Box
				component="nav"
				sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
				aria-label="mailbox folders"
			>
				<Drawer
					anchor="left"
					open={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					variant="temporary"
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: 240,
						},
					}}
				>
					<Toolbar>
						<Typography
							variant="h4"
							color="black"
							sx={{
								flexGrow: 1,
								fontFamily: '"Festive", cursive',
							}}
						>
							Atlas Mart
						</Typography>
					</Toolbar>
					<Divider />
					{tokens && tokens.access ? (
						<>
							<List>
								<Link
									style={{
										textDecoration: "none",
										color: "black",
									}}
									to="/create-listing"
								>
									<ListItem button>
										<ListItemIcon>
											<CameraAltOutlined fontSize="small" />
										</ListItemIcon>
										<ListItemText>
											Start Selling
										</ListItemText>
									</ListItem>
								</Link>
								<Link
									style={{
										textDecoration: "none",
										color: "black",
									}}
									to="/my-listings"
								>
									<ListItem button>
										<ListItemIcon>
											<ArticleOutlined fontSize="small" />
										</ListItemIcon>
										<ListItemText>My Listings</ListItemText>
									</ListItem>
								</Link>
							</List>
							<Divider />
							<List>
								<Link
									style={{
										textDecoration: "none",
										color: "black",
									}}
									to="/account"
								>
									<ListItem button>
										<ListItemIcon>
											<AccountCircleOutlined fontSize="small" />
										</ListItemIcon>
										<ListItemText>
											Manage Account
										</ListItemText>
									</ListItem>
								</Link>
								<ListItem
									sx={{ color: "black" }}
									onClick={() => {
										logout();
										setIsDrawerOpen(false);
									}}
									button
								>
									<ListItemIcon>
										<Logout fontSize="small" />
									</ListItemIcon>
									<ListItemText>Logout</ListItemText>
								</ListItem>
							</List>
						</>
					) : (
						<>
							<List>
								<Link
									style={{
										textDecoration: "none",
										color: "black",
									}}
									to="/login"
								>
									<ListItem button>
										<ListItemIcon>
											<Login />
										</ListItemIcon>
										<ListItemText primary="Login" />
									</ListItem>
								</Link>
								<Link
									style={{
										textDecoration: "none",
										color: "black",
									}}
									to="/signup"
								>
									<ListItem button>
										<ListItemIcon>
											<PersonAddAlt1Outlined />
										</ListItemIcon>
										<ListItemText primary="Signup" />
									</ListItem>
								</Link>
							</List>
						</>
					)}
				</Drawer>
			</Box>
		</>
	);
}
