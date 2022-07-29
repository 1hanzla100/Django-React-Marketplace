import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { tokensState } from "../../store/slices/tokensSlice";

const PrivateRoute = () => {
	const tokens = useSelector(tokensState);
	return tokens.access ? <Outlet /> : <Navigate replace to="/login" />;
};

export default PrivateRoute;
