import { Input } from "@/components/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "../../types";


export function PatientInfo({ patient, isLoading }: {
  patient: Patient | undefined,
  isLoading: boolean
}) {
  return (
    <div className="flex flex-nowrap gap-2 ">
      {
        isLoading ? (
          <div className="w-full space-y-3">
            <Skeleton className="w-full h-[250px]" />
          </div>
        ) : (
          <div className="space-y-6 w-full p-6 bg-white shadow-md rounded-lg border border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <Input.CalenderDate
                disabled
                name="calendario"
                noUseLabel
                placeholder="Data de Nascimento"
                maxDate={new Date()}
                valueDate={patient?.data_nascimento ? new Date(patient.data_nascimento) : null}
                className="flex-1 lg:w-[400px] bg-gray-100 rounded-md"
              />
              <input
                disabled
                name="gender"
                placeholder="Sexo"
                className="rounded-lg bg-gray-100 text-gray-400"
                value={patient?.sexo.nome}
              />
            </div>

            <Input.InputText
              placeholder="Contacto Telefónico"
              id="text"
              name="phone_number"
              value={patient?.contacto_telefonico}
              disabled
              className="w-full bg-gray-100 border-none "
            />

            <Input.InputText
              placeholder="Bilhete de Identidade"
              name="identity"
              value={patient?.numero_identificacao}
              disabled
              className="w-full bg-gray-100 border-none"
            />
          </div>
        )
      }
    </div>
  );
}