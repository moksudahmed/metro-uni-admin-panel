import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "api/v1/admin/";


const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export default api;
