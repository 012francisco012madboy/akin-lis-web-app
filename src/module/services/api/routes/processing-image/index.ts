import { _axios } from "@/lib/axios";

class ProcessingImageRoute {
  async sendImageToIA(formData: FormData) { 
    console.log("📌 Enviando FormData para o servidor:", formData);
    
    const response = await _axios.post("/image-processing/upload", formData, { 
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });

    console.log("📌 Resposta do servidor:", response);
    return response.data;
  }
}

export const processingImageRoute = new ProcessingImageRoute();