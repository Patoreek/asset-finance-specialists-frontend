import React from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../lib/authUtils";

const PrivateRoute = ({ children }) => {
  const isAuthorized = checkAuth();

  return isAuthorized ? children : <Navigate to="/" />;
};

export default PrivateRoute;
