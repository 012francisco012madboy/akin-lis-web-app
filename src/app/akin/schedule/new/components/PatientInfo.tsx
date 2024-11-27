import { Input } from "@/components/input";
import { Skeleton } from "@/components/ui/skeleton";
import { GenderOption, Patient } from "../../types";


// Constants
const GENDERS: GenderOption[] = [
  { id: 1, value: "Masculino" },
  { id: 2, value: "Feminino" },
];

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
              noUseLabel
              placeholder="Data de Nascimento"
              maxDate={new Date()}
              valueDate={patient?.data_nascimento ? new Date(patient.data_nascimento) : null}
              className="flex-1 lg:w-[400px] bg-gray-100 rounded-md"
            />
            <Input.Dropdown
              disabled
              data={GENDERS}
              name="gender"
              placeholder="Sexo"
              valueData={patient?.sexo.nome}
              className="flex-1 bg-gray-100"
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