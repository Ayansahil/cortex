import client from "./client";

export const register = async (userData) => {
  const response = await client.post("/auth/register", userData);
  return response.data.data;
};

export const login = async (credentials) => {
  const response = await client.post("/auth/login", credentials);
  return response.data.data;
};

export const logout = async () => {
  const response = await client.post("/auth/logout");
  return response.data.data;
};
