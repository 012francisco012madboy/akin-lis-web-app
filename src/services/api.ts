// /services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://magnetic-buzzard-osapicare-a83d5229.koyeb.app",
});

export const agentUrl = axios.create({
  baseURL: "https://34.118.135.69:5000",
})