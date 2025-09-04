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
};
