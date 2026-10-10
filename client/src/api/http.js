import axios from "axios";

export const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  // Cookie-based authentication-ku required
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 20000,
});

// Response data helper
export const getData = (response) => {
  return response?.data?.data;
};

// API error logging for debugging
API.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("API Request Failed:", {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message,
    });

    return Promise.reject(error);
  }
);