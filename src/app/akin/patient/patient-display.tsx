"use client";

import { InputText } from "@/components/input/input-text";
import { APP_CONFIG } from "@/config/app";
import { AlignJustify, Grid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PatientDisplay {
  patients: PatientType[];
}
export default function PatientDisplay({ patients }: PatientDisplay) {
  const [filteredPatients, setFilteredPatients] = useState<PatientType[]>(patients);
  const [isSearching, setIsSearching] = useState(false);
  const [displayMode, setDisplayMode] = useState<"block" | "list">("list");

  function handleSearch(serachText: string) {
    serachText.length > 0 ? setIsSearching(true) : setIsSearching(false);

    const findedSchedule = patients.filter((patient) => patient.nome.toLowerCase().includes(serachText.toLowerCase()));
    setFilteredPatients(findedSchedule);
  }

  return (
    <div>
      <div className="overflow-x-auto p-4">
        <div className="mb-4 flex items-center justify-between ">
          <div className="flex items-center gap-2 *:p-2 *:rounded-lg border rounded-lg bg-akin-yellow-light/20">
            <div data-showDisplay={displayMode} className="hover:cursor-pointer data-[showDisplay='list']:bg-akin-turquoise data-[showDisplay='list']:shadow data-[showDisplay='list']:border data-[showDisplay='list']:text-white" onClick={() => setDisplayMode("list")}>
              <AlignJustify />
            </div>
            <div data-showDisplay={displayMode} className="hover:cursor-pointer data-[showDisplay='block']:bg-akin-turquoise data-[showDisplay='block']:shadow data-[showDisplay='block']:border data-[showDisplay='block']:text-white" onClick={() => setDisplayMode("block")}>
              <Grid />
            </div>
          </div>

          <div>
            <InputText className="w-96" placeholder="Procurar" onChange={(e) => handleSearch(e.target.value)} />
            {isSearching && <p className="text-sm text-gray-500 italic">Total de pacientes encontrados: {filteredPatients.length}</p>}
          </div>
        </div>

        {filteredPatients.length > 0 ? (
          <>
            {displayMode == "list" && <ListMode patientList={filteredPatients} />}
            {displayMode == "block" && <BlockMode patientList={filteredPatients} />}
          </>
        ) : (
          <>
            <p className="text-center text-gray-500">Nenhum Paciente encontrado</p>
          </>
        )}
      </div>
    </div>
  );
}

function ListMode({ patientList }: { patientList: PatientType[] }) {
  return (
    <>
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        {/* <thead className=" bg-sky-300 *:text-left text-sky-800 "> */}
        <thead className=" bg-akin-turquoise text-akin-white-smoke *:text-left  ">
          <tr className="*:whitespace-nowrap *:py-2 *:p-2 *:font-bold">
            <th>Nome do Paciente</th>
            <th>Nº do BI</th>
            <th>Idade</th>
            <th>Data de Nascimento</th>
            <th>Contacto</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {patientList.map((patient, index) => (
            <tr key={index} className="*:p-2 even:bg-akin-turquoise/40 odd:bg-akin-turquoise/20">
              <td>{patient.nome}</td>
              <td>{patient.numero_identificacao}</td>
              <td>{2024 - Number(new Date(patient.data_nascimento).getFullYear())}</td>
              <td>{new Date(patient.data_nascimento).toLocaleDateString()}</td>
              <td>{patient.contacto_telefonico}</td>

              <td>
                {/* <Link key={patient.id} href={APP_CONFIG.ROUTES.PATIENT.INDIVIDUAL_PATIENT_LINK(patient.id)} className="inline-block rounded bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-700"> */}
                <Link key={patient.id} href={APP_CONFIG.ROUTES.PATIENT.INDIVIDUAL_PATIENT_LINK(patient.id)} className="inline-block rounded bg-akin-turquoise text-akin-white-smoke px-4 py-2 text-xs font-medium  hover:bg-akin-yellow-light/70">
                  <p>Ver Paciente</p>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function BlockMode({ patientList }: { patientList: PatientType[] }) {
  return (
    <div className="min-w-full bg-white text-sm">
      <div className="grid grid-cols-3 *:border gap-2 *:rounded-lg">
        {patientList.map((patient, index) => (
          <div key={index} className="*:p-2 even:bg-[#fcfcfc] odd:bg-akin-white-smoke hover:shadow-lg border transition ease-in-out">
            <div className="bg-akin-turquoise/50 h-44 rounded-lg relative">
              <Image className="bg-center overflow-hidden rounded-t-lg" src="/images/patient.webp" fill alt="" />
              <p className="font-bold text-xl absolute bottom-0 text-akin-white-smoke bg-zinc-800/40 p-1 mb-2 rounded-lg">{patient.nome}</p>
            </div>
            <div className="space-y-2">
              
              <p>
                <strong>Nº do BI: </strong>
                {patient.numero_identificacao}
              </p>
              <p>
                <strong>Idade: </strong>
                {2024 - Number(new Date(patient.data_nascimento).getFullYear())}
              </p>
              <p>
                <strong>Data de Nascimento: </strong>
                {new Date(patient.data_nascimento).toLocaleDateString()}
              </p>
              <p>
                <strong>Contacto: </strong>
                {patient.contacto_telefonico}
              </p>
            </div>

            <div className="">
              {/* <Link key={patient.id} href={APP_CONFIG.ROUTES.PATIENT.INDIVIDUAL_PATIENT_LINK(patient.id)} className="inline-block rounded bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-700"> */}
              <Link key={patient.id} href={APP_CONFIG.ROUTES.PATIENT.INDIVIDUAL_PATIENT_LINK(patient.id)} className="inline-block rounded bg-akin-turquoise text-white text-center w-full font-semibold px-4 py-2 text-xs">
                <p>Ver Paciente</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
