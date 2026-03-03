import axios from "axios";
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from "@/lib/utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getItemFromLocalStorage("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeItemFromLocalStorage("accessToken");
      removeItemFromLocalStorage("user");
      removeItemFromLocalStorage("email");
      removeItemFromLocalStorage("otp");
      removeItemFromLocalStorage("username");

      const currentPath = window.location.pathname;
      const redirectUrl =
        currentPath !== "/"
          ? `?redirect=${encodeURIComponent(currentPath)}`
          : "";
      window.location.href = `/login${redirectUrl}`;
    }

    return Promise.reject(error);
  },
);

export default api;
