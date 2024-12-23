import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import apiClient from "../lib/apiClient";

const Header = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await apiClient.post(`auth/logout`);
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/applications");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        form.setError("apiError", {
          message: "Logout Error",
        });
      }
      console.error("Axios error:", error.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-1">
      <div className="w-full max-w-7xl flex justify-end items-center">
        <Button onClick={logoutHandler}>Logout</Button>
      </div>
    </div>
  );
};

export default Header;
