import { api } from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/Auth/login", { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/Users/me");
    return response.data;
  },
};
