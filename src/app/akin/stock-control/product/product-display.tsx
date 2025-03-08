"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { GridOrBlockDisplayButton } from "../../patient/components/gridOrBlockButtonMode";
import { ListMode } from "./list-mode";
import { Combobox } from "@/components/combobox/comboboxExam";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductModal } from "./productModalToCreate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { stockMaterialRoutes } from "@/module/services/routes/stock-material";

export default function ProductDisplay() {
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = ["Categoria 1", "Categoria 2", "Categoria 3"];

  const stockMaterialMutate = useMutation({
    mutationKey: ["stockMaterial"],
    mutationFn: async (data: any) => {
      const response = await stockMaterialRoutes.createStockMaterial(data);
      return response;
    },
  });
  const getAllStockMaterials = useQuery({
    queryKey: ["stockMaterial"],
    queryFn: async () => {
      const response = await stockMaterialRoutes.getAllStockMaterials();
      return response;
    },
  });
  console.log(getAllStockMaterials.data); 


  function handleSearch(searchText: string) {
    setIsSearching(searchText.length > 0);
    // ...existing code...
  }

  function handleSaveProduct(product: { nome: string; quantidade: number; unidade_de_medida: string }) {
    // Lógica para salvar o produto
    console.log("Produto salvo:", product);
    stockMaterialMutate.mutate(product);
  }

  return (
    <div className=" px-6 pt-4 pb-6 shadow-sm rounded-lg">
      {/* Barra de controle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        {/* Botão de alternância */}
        <div className="mb-4 sm:mb-0">
          <GridOrBlockDisplayButton
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
          />
        </div>
        <div className="w-full flex gap-2 sm:w-auto">
          <Combobox
            data={[
              { label: "Cat 1", value: "Cat 1" },
              { label: "Cat 2", value: "Cat 2" },
              { label: "Cat 3", value: "Cat 3 " },
            ]}
            displayKey="label"
            onSelect={() => { }}
            placeholder="Filtrar por status"
            clearLabel="Limpar"
            width=""
          />
          {/* Campo de busca */}
          <Input
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus-visible:ring-0"
            placeholder="Procurar por nome"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)}> <Plus /> Cadastrar</Button>
        </div>
      </div>
      {displayMode === "list" && <ListMode />}
      <ProductModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />
    </div>
  );
}
