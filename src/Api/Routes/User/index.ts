import { _axios } from "@/Api/axios.config";

class UserRoutes {
  async getUser(id: string) {
    const response = await _axios.get<UserData>(`/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserDto) {
    const response = await _axios.post<User>("/users", data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const response = await _axios.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await _axios.delete(`/users/${id}`);
    return response.data;
  }
}

export const userRoutes = new UserRoutes();
