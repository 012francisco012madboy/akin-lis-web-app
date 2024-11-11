import { APP_CONFIG } from "@/config/app";
import Link from "next/link";
import Image from "next/image";



export function BlockMode({ patientList }: { patientList: PatientType[] }) {
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
