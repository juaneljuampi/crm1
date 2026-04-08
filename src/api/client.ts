import axios from "axios";

const api = axios.create({
  baseURL: "http://129.212.191.110:3000", // backend en DigitalOcean
  headers: { "Content-Type": "application/json" }
});

export default api;