import { _axios } from "@/lib/axios";


class ProcessingImageRoute {

  async sendImageToIA(_formData: FormData) {
    const response = await _axios.post("/image-processing/upload",_formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return response.data;
  }
}

export const processingImageRoute = new ProcessingImageRoute();