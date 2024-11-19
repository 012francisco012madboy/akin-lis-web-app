"use client"
import { View } from "@/components/view";
import { useParams } from "next/navigation";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { ___api } from "@/lib/axios";


export default function ExamsHistory() {
  const { id } = useParams();

  // const response = await ___api.get(`/exams/${id}`);
  // const patient = response.data;
  // console.log(patient)

  const breadcrumbItems = [
    { label: "Paciente", href: "/akin/patient" },
    { label: "Perfil do paciente", href: `/akin/patient/${id}` },
    { label: "Histórico de Exame" },
  ];
  return (
    <View.Vertical>
      <CustomBreadcrumb items={breadcrumbItems} borderB />
      Historico Processando...
    </View.Vertical>
  )
}


