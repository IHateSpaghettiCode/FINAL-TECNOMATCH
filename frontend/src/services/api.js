import axios from "axios";

const API = axios.create({
  baseURL: "https://final-tecnomatch-production.up.railway.app/api",
});

// Interceptor para meter el token en cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
