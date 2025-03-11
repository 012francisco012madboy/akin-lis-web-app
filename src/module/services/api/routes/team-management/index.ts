import { _axios } from "@/lib/axios";


class TeamManagementRoutes {
  async getAllLabTechs() {
    const response = await _axios.get<ITeamManagement[]>("/lab-technicians");
    return response;
  }

  async createLabTech(data: ITeamManagement) {
    const response = await _axios.post("/lab-technicians", data);
    return response;
  }

  async deleteLabTech(id: string) {
    const response = await _axios.delete(`/lab-technicians/${id}`);
    return response;
  }

  async updateLabTech(data: ITeamManagement) {
    const response = await _axios.patch(`/lab-technicians/${data.id}`, data);
    return response;
  }
}

export const teamManagementRoutes = new TeamManagementRoutes();

