import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5002", // or your API base
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies if needed (especially for refresh tokens)
});

export default api;
