import axios from "axios";
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});
export const getData = (r) => r.data?.data;
