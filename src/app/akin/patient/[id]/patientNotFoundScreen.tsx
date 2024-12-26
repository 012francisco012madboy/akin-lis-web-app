import { PackageOpen } from "lucide-react";

export function PatientNotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-sky-800 p-8 rounded space-y-4 my-auto">
      <PackageOpen size={150} />
      <p className="text-center">
        Não foi encontrado paciente com ID: <span className="font-bold">{id}</span>
      </p>
    </div>
  );
}