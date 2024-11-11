"use client";

import { InputText } from "@/components/input/input-text";
import { useState } from "react";
import { ListMode } from "./components/listModePatients";
import { BlockMode } from "./components/blockModePatients";
import { GridOrBlockDisplay } from "./components/gridOrBlockMode";

interface PatientDisplay {
  patients: PatientType[];
}

export default function PatientDisplay({ patients }: PatientDisplay) {
  const [filteredPatients, setFilteredPatients] = useState<PatientType[]>(patients);
  const [isSearching, setIsSearching] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("list");

  function handleSearch(serachText: string) {
    serachText.length > 0 ? setIsSearching(true) : setIsSearching(false);

    const findedSchedule = patients.filter((patient) => patient.nome.toLowerCase().includes(serachText.toLowerCase()));
    setFilteredPatients(findedSchedule);
  }

  return (
    <div>
      <div className="overflow-x-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <GridOrBlockDisplay displayMode={displayMode} setDisplayMode={setDisplayMode} />

          <div>
            <InputText
              className="w-96"
              placeholder="Procurar"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isSearching && (
              <p className="text-sm text-gray-500 italic">
                Total de pacientes encontrados: {filteredPatients.length}
              </p>
            )}
          </div>
        </div>

        {filteredPatients.length > 0 ? (
          <>
            {displayMode === "list" && <ListMode patientList={filteredPatients} />}
            {displayMode === "block" && <BlockMode patientList={filteredPatients} />}
          </>
        ) : (
          <p className="text-center text-gray-500">Nenhum Paciente encontrado</p>
        )}
      </div>
    </div>
  );
}