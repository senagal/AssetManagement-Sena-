import { api } from "./api";

export const requestService = {
  requestAsset: async (assetId, reason) => {
    const response = await api.post("/Requests", { assetId, reason });
    return response.data;
  },
  getRequestById: async (id) => {
    const response = await api.get(`/Requests/${id}`);
    return response.data;
  },
  getUserRequests: async () => {
    const response = await api.get("/Requests/user");
    return response.data;
  },

  getAllRequests: async () => {
    const response = await api.get("/Requests");
    return response.data;
  },

  handleRequest: async (requestId, status, reason) => {
    const response = await api.put(`/Requests/handle/${requestId}`, {
      status,
      reason,
    });
    return response.data;
  },
  searchRequests: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/Requests/search?${params}`);
    return response.data;
  },
};
