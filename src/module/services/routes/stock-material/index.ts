import { _axios } from "@/lib/axios";



interface IMaterialCategory{
  id:number;
  nome:string
}

interface IUnidadeMedida {
  id: number;
  nome: string;
}

interface IMaterial {
  id: number;
  nome: string;
  id_unidade: number;
  Unidade_Medida: IUnidadeMedida;
}

class StockMaterialRoutes {
  async getAllStockMaterials() {
    const response = await _axios.get('/stock-materials');
    return response.data;
  }

  async createStockMaterial(data: any) {
    const response = await _axios.post('/stock-materials', data);
    return response.data;
  }

  async getAllMaterialCategory(){
    const response = await _axios.get<IMaterialCategory[]>("material-categories")
    return response.data
  }

  async getAllMeasureTpes(){
  const response = await _axios.get<IMaterial[]>("/measure-types");
  return response.data
  }
}

export const stockMaterialRoutes = new StockMaterialRoutes();