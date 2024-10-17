const API_URL = "http://127.0.0.1:8000/api/";

// Generic GET request
export const getClients = async (token) => {
  const response = await fetch(`${API_URL}clients/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  return response.json();
};

// POST request for creating new client
export const createClient = async (clientData, token) => {
  const response = await fetch(`${API_URL}clients/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) {
    throw new Error("Failed to create client");
  }
  return response.json();
};

const handleResponse = (response) => {
  if (!response.ok) {
    const error = response.status === 401 ? 'Unauthorized' : 'An error occurred';
    throw new Error(error);
  }
  return response.json();
};