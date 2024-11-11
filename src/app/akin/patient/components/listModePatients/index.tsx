import { APP_CONFIG } from "@/config/app";
import Link from "next/link";



export function ListMode({ patientList }: { patientList: PatientType[] }) {
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
                <Link key={patient.id} href={APP_CONFIG.ROUTES.PATIENT.INDIVIDUAL_PATIENT_LINK(patient.id)} className="inline-block rounded bg-akin-turquoise text-akin-white-smoke px-4 py-2 text-xs font-medium  hover:bg-sky-700">
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