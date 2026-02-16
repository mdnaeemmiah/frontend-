import axios from "axios";

// Create an axios instance
const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Your API base URL
});

// Add a request interceptor to include the access token in the headers
baseApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default baseApi;
