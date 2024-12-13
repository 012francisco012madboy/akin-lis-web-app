
import { useAuthStore } from "@/utils/zustand-store/authStore";
import axios from "axios";

export const API_BASE_URL = "https://magnetic-buzzard-osapicare-a83d5229.koyeb.app";

export const _axios = axios.create({
  baseURL: API_BASE_URL,
});
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

_axios.interceptors.request.use(
  async (config) => {
    const { token ,logout} = useAuthStore.getState();

    

    // if (!token) {
    //   if (!isRefreshing) {
    //     isRefreshing = true;
    //     // Aguarda o token ser configurado no Zustand
    //     await new Promise((resolve) => setTimeout(resolve, 100)); // Simula um pequeno delay
    //     isRefreshing = false;
    //   }
    // const refreshedToken = useAuthStore.getState().token; // Pega o token atualizado
    // if (refreshedToken) {
    //   console.log("Refresh token: "+refreshedToken)
    //   config.headers['Authorization'] = `Bearer ${refreshedToken}`;
    //   processQueue(null, refreshedToken);
    // }
    // } else {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // console.log("RHoken: " + config.headers)
    }

    // }
    return config;
  },
  (error) => {
    const { logout } = useAuthStore.getState();
    console.log(error);
    if (error.response?.status === 401) {
      // Token expirou, realiza logout e redireciona para login
      logout();
      window.location.href = "/"; // Ajuste a rota de login conforme necessário
    }

    return Promise.reject(error);
  }
);