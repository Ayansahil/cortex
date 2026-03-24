import client from "./client";

// Fix #4: Accept optional searchType to toggle between normal and semantic search
export const searchItems = async (query, searchType = 'normal') => {
  const endpoint = searchType === 'semantic' ? `/search/semantic?q=${encodeURIComponent(query)}` : `/search?q=${encodeURIComponent(query)}`;
  const response = await client.get(endpoint);
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
