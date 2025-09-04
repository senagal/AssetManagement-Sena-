import { api } from "./api";

export const requestService = {
  requestAsset: async (assetId, reason) => {
    const response = await api.post("/Requests", { assetId, reason });
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
};
