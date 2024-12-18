import apiClient from "../lib/apiClient";
import { jwtDecode } from "jwt-decode";

export const checkAuth = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp >= currentTime) return true; // Token is still valid

    console.error("Token expired");
    try {
      const refreshed = await refreshToken();
      if (refreshed) {
        const accessToken = localStorage.getItem("accessToken");
        return true;
      }
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError.message);
      localStorage.removeItem("accessToken");
      window.location.href = "/";
      return false;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.post(
      "auth/refresh-token",
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return true;
  } catch (error) {
    console.error("Refresh token failed:", error);
    window.location.href = "/";
    return false;
  }
};
