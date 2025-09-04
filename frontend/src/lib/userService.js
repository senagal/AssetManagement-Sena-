import { api } from "./api";

export const userService = {
  getProfile: async () => {
    const response = await api.get("/Auth/me");
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
};
