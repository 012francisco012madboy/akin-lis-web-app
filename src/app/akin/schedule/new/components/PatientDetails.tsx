import AutoComplete from "@/components/auto-complete";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "../../types";
import { PatientInfo } from "./PatientInfo";
import Autocomplete from "@/components/ui/autocomplete";

export function PatientDetails({ isLoading, selectedPatient, onPatientSelect, autoCompleteData, resetPatient }: {
  isLoading: boolean,
  selectedPatient: Patient | undefined,
  onPatientSelect: (value: string) => void,
  autoCompleteData: {
    value: string;
    id: string;
  }[],
  resetPatient: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <div className="flex justify-between gap-5  w-[650px] ">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      ) : (
        <div className="flex rounded-lg gap-5 ">
          {/* <AutoComplete
            placeholder={selectedPatient?.nome_completo || "Nome completo do paciente"}
            name="name"
            id="idname"
            lookingFor="paciente"
            dataFromServer={autoCompleteData}
            setSelectedItemId={onPatientSelect }
            className="w-full bg-white "
          /> */}

          <Autocomplete
            suggestions={autoCompleteData}
            onSelect={onPatientSelect}
            placeholder={selectedPatient?.nome_completo || "Nome completo do paciente"}
            reset={resetPatient}
          />
        </div>
      )}
      <PatientInfo patient={selectedPatient} isLoading={isLoading} />
    </div>
  );
}