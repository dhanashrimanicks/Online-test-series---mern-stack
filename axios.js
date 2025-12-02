// /api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true, // Needed to send cookies
});

// 🔐 Add access token to request headers
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("studentToken") ||
    localStorage.getItem("facultyToken") ||
    localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔁 Interceptor to refresh access token if 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
          }/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // Store new access token based on current user
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
          userInfo.token = newAccessToken;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          localStorage.setItem(`${userInfo.role}Token`, newAccessToken);
        }

        // Retry the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
