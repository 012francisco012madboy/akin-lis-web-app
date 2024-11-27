import AutoComplete from "@/components/auto-complete";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "../../types";
import { PatientInfo } from "./PatientInfo";

// Extracted Components
export function PatientDetails({ isLoading, selectedPatient, onPatientSelect, autoCompleteData }: {
  isLoading: boolean,
  selectedPatient: Patient | undefined,
  onPatientSelect: (value: string) => void,
  autoCompleteData: {
    value: string;
    id: string;
  }[]
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
          <AutoComplete
            placeholder={selectedPatient?.nome || "Nome completo do paciente"}
            name="name"
            lookingFor="paciente"
            dataFromServer={autoCompleteData}
            setSelectedItemId={onPatientSelect}
            className="w-full "
          />
          {/* <ModalNewPatient  onPatientSaved={handleSavePatient}/> */}
        </div>
      )}
      <PatientInfo patient={selectedPatient} isLoading={isLoading} />
    </div>
  );
}