import axios from "axios";

const api = axios.create({
  baseURL: "https://talentflow-ai-8i2d.onrender.com",
});

export default api;