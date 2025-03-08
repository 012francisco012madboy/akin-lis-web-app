import { _axios } from "@/lib/axios";


class PatientRoutes {

  async getAllPacients() {
    const response = await _axios.get('/pacients');
    return response.data;
  }
}

export const patientRoutes = new PatientRoutes();