import client from "./client";

export const getItems = async (params) => {
  const response = await client.get("/items", { params });
  return response.data.data;
};

export const getItem = async (id) => {
  const response = await client.get(`/items/${id}`);
  return response.data.data;
};

export const saveItem = async (itemData) => {
  const isFormData = itemData instanceof FormData;
  const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const response = await client.post("/items", itemData, config);
  return response.data.data;
};

export const updateItem = async (id, itemData) => {
  const response = await client.patch(`/items/${id}`, itemData);
  return response.data.data;
};

export const deleteItem = async (id) => {
  const response = await client.delete(`/items/${id}`);
  return response.data.data;
};
