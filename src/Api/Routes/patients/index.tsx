import { _axios } from "@/Api/axios.config";


class PatientRoutes {

  async getAllPacients() {
    const response = await _axios.get('/pacients');
    return response.data;
  }
}

export const patientRoutes = new PatientRoutes();