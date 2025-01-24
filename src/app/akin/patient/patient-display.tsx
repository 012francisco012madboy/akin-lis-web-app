"use client";

import { useState } from "react";
import { ListMode } from "./components/listModePatients";
import { BlockMode } from "./components/blockModePatients";
import { GridOrBlockDisplayButton } from "./components/gridOrBlockButtonMode";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { redirect } from "next/navigation";

interface PatientDisplay {
  patients: PatientType[];
}

export default function PatientDisplay({ patients }: PatientDisplay) {
  const [filteredPatients, setFilteredPatients] = useState<PatientType[]>(patients);
  const [isSearching, setIsSearching] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("list");


  function handleSearch(searchText: string) {
    setIsSearching(searchText.length > 0);

    const foundPatients = patients.filter((patient) =>
      patient.nome_completo.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPatients(foundPatients);
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

        {/* Campo de busca */}
        <div className="w-full sm:w-auto">
          <Input
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus-visible:ring-0"
            placeholder="Procurar por nome"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && (
            <p className="mt-2 text-sm text-gray-600 italic">
              {filteredPatients.length > 0
                ? `Total de pacientes encontrados: ${filteredPatients.length}`
                : "Nenhum paciente encontrado"}
            </p>
          )}
        </div>
      </div>
      {
        filteredPatients.length > 0 ? (
          <>
            {displayMode === "list" && <ListMode patientList={filteredPatients} />}
            {displayMode === "block" && <BlockMode patientList={filteredPatients} />}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              Nenhum paciente encontrado.
            </p>
          </div>
        )
      }
    </div>
  );
}
