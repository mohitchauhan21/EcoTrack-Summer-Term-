import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    try {
      const { token } = JSON.parse(storedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // malformed localStorage value, ignore and send request unauthenticated
    }
  }
  return config;
});

export default apiClient;
