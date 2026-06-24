import axios from "axios";
import { authStorage } from "./authStorage";
import { refresh } from "./authApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  const refreshToken = authStorage.getRefreshToken();

  const path = config.url?.split("?")[0];
  if (path === "/refresh" && refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`;

    return config;
  }

  if (path !== "/login" && token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = authStorage.getRefreshToken();

    const originalRequest = error.config;
    const path = originalRequest.url?.split("?")[0];

    // if (error.response?.status === 403) {
    //   window.location.replace("/forbidden");
    //   return Promise.reject(error);
    // }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      path !== "/login" &&
      refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refresh();
        authStorage.setToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authStorage.clear();
        window.location.href = "/sign-in";
        return Promise.reject(null);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
