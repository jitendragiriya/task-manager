import axios from "axios";

const authAxios = axios.create({
  baseURL: "https://task-manager-api-nj4e.onrender.com/api",
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authAxios;
