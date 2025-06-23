import { _axios } from "@/Api/axios.config";

class UserRoutes {
  async getUser(id: string) {
    const response = await _axios.get<UserData>(`/users/${id}`);
    return response.data;
  }

  async createUser() {
    const response = await _axios.post("/users");
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await _axios.delete(`/users/${id}`);
    return response.data;
  }
}

export const userRoutes = new UserRoutes();
