import client from "./client";

export const getCollections = async () => {
  const response = await client.get("/collections");
  return response.data.data;
};

export const createCollection = async (collectionData) => {
  const response = await client.post("/collections", collectionData);
  return response.data.data;
};

export const updateCollection = async (id, collectionData) => {
  const response = await client.put(`/collections/${id}`, collectionData);
  return response.data.data;
};

export const deleteCollection = async (id) => {
  const response = await client.delete(`/collections/${id}`);
  return response.data.data;
};

export const addItemToCollection = async (collectionId, itemId) => {
  const response = await client.post(`/collections/${collectionId}/items`, { itemId });
  return response.data.data;
};
