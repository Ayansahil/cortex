import client from "./client";

export const searchItems = async (query) => {
  const response = await client.get(`/search?q=${query}`);
  return response.data.data;
};

export const getHighlights = async () => {
  const response = await client.get("/highlights");
  return response.data.data;
};

export const createHighlight = async (highlightData) => {
  const response = await client.post("/highlights", highlightData);
  return response.data.data;
};

export const deleteHighlight = async (id) => {
  const response = await client.delete(`/highlights/${id}`);
  return response.data.data;
};
