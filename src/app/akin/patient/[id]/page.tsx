"use client";

import { useEffect, useState } from "react";
import ExamsHistory from "./exam-history";
import { AppLayout } from "@/components/layout";
import { View } from "@/components/view";
import { PackageOpen } from "lucide-react";
import { ___api } from "@/lib/axios";
import { PatientResumeInfo } from "../components/patientResumeInfo";
import CustomBreadcrumb from "@/components/custom-breadcrumb";

interface IPatientById {
  params: {
    id: string;
  };
}

export default function PatientByIdProfile({ params }: IPatientById) {
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [examHistory, setExamHistory] = useState<any>(null); // Ajuste o tipo conforme necessário
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    {
      label: "Paciente",
      href: "/akin/patient"
    },
    {
      label: "Perfil do paciente"
    }
  ];

  useEffect(() => {
    async function fetchPatientData() {
      setLoading(true);
      setError(null);

      try {
        const response = await ___api.get<PatientType>(`/pacients/${params.id}`);
        const patientData = response.data;

        if (!patientData?.id) {
          setPatient(null);
          return;
        }

        const examResponse = await ___api.get(`/exams/history/${params.id}`);
        setPatient(patientData);
        setExamHistory(examResponse.data);
      } catch (err) {
        console.error(`Erro ao buscar o paciente com ID ${params.id}:`, err);
        setError("Erro ao carregar o perfil do paciente.");
      } finally {
        setLoading(false);
      }
    }

    fetchPatientData();
  }, [params.id]);

  if (loading) {
    return (
      <View.Vertical className="h-screen">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <p className="text-center">Carregando...</p>
      </View.Vertical>

    )
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!patient) {
    return <NoPatientFound id={params.id} />;
  }

  return (
    <View.Vertical className="h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      <div className="flex gap-4 e text-akin-white-smoke p-4 rounded-lg">
        <PatientResumeInfo patient={patient} basicExamHistory={examHistory} />
      </div>

    </View.Vertical>
  );
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
