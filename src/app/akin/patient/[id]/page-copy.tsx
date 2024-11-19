import ExamsHistory from "./exam-history";
import { AppLayout } from "@/components/layout";
import { View } from "@/components/view";
import { PackageOpen } from "lucide-react";
import { ___api } from "@/lib/axios";
import { PatientResumeInfo } from "../components/patientResumeInfo";

interface IPatientById {
  params: {
    id: string;
  };
}

export default async function PatientByIdProfile({ params }: IPatientById) {
  try {
    const response = await ___api.get<PatientType>(`/pacients/${params.id}`);
    const patient = response.data;

    if (!patient?.id) {
      return (
        <NoPatientFound id={params.id} />
      );
    }

    return (
      <View.Vertical className="h-screen">
        <AppLayout.ContainerHeader goBack label="Perfil do Paciente" />

        <div className="flex gap-4 bg-akin-turquoise text-akin-white-smoke p-6 rounded-lg">
          <PatientResumeInfo patient={patient} />
        </div>

        <section className="my-4">
          <h1 className="font-bold text-2xl">Histórico de Exames</h1>
          <hr />
        </section>

        <View.Scroll>
          <ExamsHistory patientId={patient.id} />
        </View.Scroll>
      </View.Vertical>
    );
  } catch (error) {
    console.error(`Erro ao buscar o paciente com ID ${params.id}:`, error);
    return <p className="text-center text-red-500">Erro ao carregar o perfil do paciente.</p>;
  }
}

function NoPatientFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-sky-800 p-8 rounded space-y-4 my-auto">
      <PackageOpen size={150} />
      <p className="text-center">
        Não foi encontrado paciente com ID: <span className="font-bold">{id}</span>
      </p>
    </div>
  );
}
