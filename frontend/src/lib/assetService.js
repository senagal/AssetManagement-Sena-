import { api } from "./api";

export const assetService = {
  getAssets: async () => {
    const response = await api.get("/Assets");
    return response.data;
  },

  getAvailableAssets: async () => {
    const response = await api.get("/Assets/available");
    return response.data;
  },

  getAssetById: async (id) => {
    const response = await api.get(`/Assets/${id}`);
    return response.data;
  },
  searchAssets: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/Assets/search?${params}`);
    return response.data;
  },
};
