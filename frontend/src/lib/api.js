import axios from "axios";
const baseURL = process.env.REACT_APP_API_URL;
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  login: async (email, password) => {
    const response = await api.post("/Auth/login", { email, password });
    return response.data;
  },

  register: async (
    email,
    password,
    firstName,
    lastName,
    age,
    department,
    position,
    role
  ) => {
    const response = await api.post("/Users", {
      email,
      password,
      firstName,
      lastName,
      age,
      department,
      position,
      role,
    });
    return response.data;
  },

  getAssets: async () => {
    const response = await api.get("/Assets");
    return response.data;
  },

  requestAsset: async (userId, assetId) => {
    const response = await api.post("/Assets/request", { userId, assetId });
    return response.data;
  },
};
