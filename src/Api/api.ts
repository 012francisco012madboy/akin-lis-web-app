// /services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://magnetic-buzzard-osapicare-a83d5229.koyeb.app",
});

export const agentUrl = axios.create({
  baseURL: "https://chatkin.osapicare.com",
})