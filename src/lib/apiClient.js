import axios from "axios";
import { refreshToken } from "../lib/authUtils";
import { useNavigate } from "react-router-dom";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

// Add accessToken to each request
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response, // Handle successful responses
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized
      try {
        const refreshed = await refreshToken();
        if (refreshed) {
          const accessToken = localStorage.getItem("accessToken");
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        localStorage.removeItem("accessToken");
        const navigate = useNavigate();
        navigate("/");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
