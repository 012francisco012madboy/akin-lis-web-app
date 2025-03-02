"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { GridOrBlockDisplayButton } from "../../patient/components/gridOrBlockButtonMode";
import { ListMode } from "./list-mode";
import { Combobox } from "@/components/combobox/comboboxExam";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDisplay {

}

export default function ProductDisplay() {
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("list");

  const categories = ["Categoria 1", "Categoria 2", "Categoria 3"];

  function handleSearch(searchText: string) {
    setIsSearching(searchText.length > 0);

    // const foundPatients = patients.filter((patient) =>
    //   patient.nome_completo.toLowerCase().includes(searchText.toLowerCase())
    // );
    // setFilteredPatients(foundPatients);
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
              onSelect={() =>{} }
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
          {/* {isSearching && (
            <p className="mt-2 text-sm text-gray-600 italic">
              {filteredPatients.length > 0
                ? `Total de pacientes encontrados: ${filteredPatients.length}`
                : "Nenhum paciente encontrado"}
            </p>
          )} */}

          <Button> <Plus/> Cadastrar</Button>
        </div>
      </div>
      {/* {
        filteredPatients.length > 0 ? (
          <> */}
      {displayMode === "list" && <ListMode />}
      {/* {displayMode === "block" && <BlockMode patientList={filteredPatients} />} */}
      {/* </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              Nenhum producto encontrado.
            </p>
          </div>
        )
      } */}
    </div>
  );
}
