import { _axios } from "@/lib/axios";


class StockMaterialRoutes {
  async getAllStockMaterials() {
    const response = await _axios.get('/stock-materials');
    return response.data;
  }

  async createStockMaterial(data: any) {
    const response = await _axios.post('/stock-materials', data);
    return response.data;
  }
}

export const stockMaterialRoutes = new StockMaterialRoutes();