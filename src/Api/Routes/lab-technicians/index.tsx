import { _axios } from "@/Api/axios.config";


class LabTechniciansRoutes {
  async getAllLabTechnicians() {
    return _axios.get('/lab-technicians');
  }

  async allocateLabTechnician(examId: string, labTechnicianId: string) {
    return _axios.post(`/exams/lab-technician/set/${examId}`, {
      id_tecnico_alocado: labTechnicianId,
    });
  }
  
  async getPacientsAssocietedToLabTechnician(labTechnicianId: string) {
    const response = await _axios.get(`/lab-technicians/patients/${labTechnicianId}`);
    return response.data;
  }
}

export const labTechniciansRoutes = new LabTechniciansRoutes();