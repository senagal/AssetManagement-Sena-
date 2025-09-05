import { api } from "./api";

export const assetService = {
  createAsset: async (newAssetData) => {
    const response = await api.post("/Assets", newAssetData);
    return response.data;
  },
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post("/assets/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.imageUrl;
  },

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

  updateAsset: async (id, updatedData) => {
    const response = await api.put(`/Assets/${id}`, updatedData);
    return response.data;
  },

  deleteAsset: async (id) => {
    const response = await api.delete(`/Assets/${id}`);
    return response.data;
  },
};
