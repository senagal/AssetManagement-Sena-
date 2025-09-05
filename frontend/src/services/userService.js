import { api } from "./api";

export const userService = {
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
  updateProfile: async (data) => {
    const res = await api.put("/Users/me", data);
    return res.data;
  },

  deleteAccount: async () => {
    const res = await api.delete("/Users/me");
    return res.data;
  },

  getAllUsers: async () => {
    const res = await api.get("/Users");
    return res.data;
  },
};
