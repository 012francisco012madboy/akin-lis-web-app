import { _axios } from "@/Api/axios.config";

class AuthRoutes {

  async login( email: string, senha: string) {
    const response = await _axios.post<UserData>("/auth/local/signin", { email, senha });
    return response.data;
  }

  async register(data:any) {
    const response = await _axios.post<UserData>("/auth/local/signup", data);
    return response;
  }
}

export const authRoutes = new AuthRoutes();