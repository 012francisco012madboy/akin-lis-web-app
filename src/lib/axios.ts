
import { useAuthStore } from "@/utils/zustand-store/authStore";
import axios from "axios";
import { ___showErrorToastNotification } from "./sonner";

export const API_BASE_URL = "https://magnetic-buzzard-osapicare-a83d5229.koyeb.app";

export const _axios = axios.create({
  baseURL: API_BASE_URL,
});

_axios.interceptors.request.use(
  async (config) => {
    const { token, logout } = useAuthStore.getState();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("RHoken: " + config.headers)
    }
    return config;
  },
  (error) => {
    console.log(error);
    console.log("Error in request interceptor");

    return Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  (response) => {
    // Retorna diretamente a resposta caso esteja OK
    console.log("Resp: ");
    console.log(response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro é relacionado à autenticação (token expirado)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Evita loops infinitos

      const { user, logout, login, token } = useAuthStore.getState();

      console.log("entrei aqui em erro")

      console.log(user?.id)
      if (user?.id) {
        try {
          // Faz a chamada para renovar o token
          console.log("Tentei executar o refresh")

          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { id: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Estou no try ")
          console.log(response.data)
          const { access_token, refresh_token } = response.data;

          // Atualiza o estado no zustand com o novo token
          login(access_token, {
            ...user,
            access_token,
            refresh_token,
          });

          // Atualiza o cabeçalho Authorization no request original
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

          // Reenvia a requisição original
          return _axios(originalRequest);
        } catch (refreshError) {
          // Falha ao renovar o token, realiza logout
          console.error("Failed to refresh token:", refreshError);
          ___showErrorToastNotification({
            message: "Erro ao renovar o token",
            messages: ["Falha ao renovar o token, por favor fa a o login novamente."],
          });
        //  logout();
          return Promise.reject(refreshError);
        }
      } else {
        // Se não houver ID ou refresh_token, realiza logout
        ___showErrorToastNotification({
          message: "Erro ao renovar o token",
          messages: ["Falha ao renovar o token, por favor fa a o login novamente."],
        });
      }
      //  logout();
    }

    return Promise.reject(error);
  }
);


/**
 * Codigo Suposto
 */

// _axios.interceptors.response.use(
//   (response) => {
//     // Retorna diretamente a resposta caso esteja OK
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Verifica se o erro é relacionado à autenticação (token expirado)
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true; // Evita loops infinitos

//       const { user, logout, login } = useAuthStore.getState();

//       if (user?.refresh_token) {
//         try {
//           // Faz a chamada para renovar o token
//           const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//             refresh_token: user.refresh_token,
//           });

//           const { access_token, refresh_token } = response.data;

//           // Atualiza o estado no zustand com o novo token
//           login(access_token, {
//             ...user,
//             access_token,
//             refresh_token,
//           });

//           // Atualiza o cabeçalho Authorization no request original
//           originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

//           // Reenvia a requisição original
//           return _axios(originalRequest);
//         } catch (refreshError) {
//           // Falha ao renovar o token, realiza logout
//           console.error("Failed to refresh token:", refreshError);
//           logout();
//           return Promise.reject(refreshError);
//         }
//       } else {
//         // Se não houver refresh_token, realiza logout
//         logout();
//       }
//     }

//     return Promise.reject(error);
//   }
// );
