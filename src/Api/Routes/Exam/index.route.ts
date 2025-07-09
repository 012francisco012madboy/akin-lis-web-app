import { _axios } from "@/Api/axios.config";


class ExamRoute {

  async editExam(examId: number, updates: EditableExam) {
    const response = await _axios.patch(`/exams/${examId}`, updates);
    return response.data;
  }
}

export const examRoutes = new ExamRoute();