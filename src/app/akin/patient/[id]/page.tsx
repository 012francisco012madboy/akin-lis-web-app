"use client";
import { View } from "@/components/view";
import { _axios } from "@/lib/axios";
import { PatientResumeInfo } from "../components/patientResumeInfo";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { ResponseData } from "./next-exam/types";
import { Exam } from "./exam-history/useExamHookData";
import { PatientByIdProfileSkeleton } from "./patientProfileSkeleton";
import { PatientNotFound } from "./patientNotFoundScreen";

interface IPatientById {
  params: {
    id: string;
  };
}
const breadcrumbItems = [
  {
    label: "Paciente",
    href: "/akin/patient"
  },
  {
    label: "Perfil do paciente"
  }
];

export default function PatientByIdProfile({ params }: IPatientById) {
  const { data, isPending } = useQuery({
    queryKey: ["next-exam",params.id],
    queryFn: async () => {
      return await _axios.get<ResponseData>(`/exams/next/${params.id}`);
    }
  });

  const getBasicExamHistory = useQuery({
    queryKey:['history-exam',params.id],
    queryFn: async () => {
      return await _axios.get<Exam>(`/exams/history/${params.id}`);
    }
  })

  console.log("getBasicExamHistory",getBasicExamHistory);

  const getPatientInfo = useQuery({
    queryKey:['patient-info',params.id],
    queryFn: async () => {
      return await _axios.get<PatientType>(`/pacients/${params.id}`);
    }
  })

  if (isPending || getBasicExamHistory.isPending || getPatientInfo.isPending) {
    return (
      <View.Vertical className="h-screen">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <PatientByIdProfileSkeleton />
      </View.Vertical>
    )
  }

  if (getPatientInfo.error) {
    return <p className="text-center text-red-500">{getPatientInfo.error.message}</p>;
  }

  if (!getPatientInfo.data?.data) {
    return <PatientNotFound id={params.id} />;
  }

  return (
    <View.Vertical className="h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      <div className="flex gap-4  text-akin-white-smoke p-0 rounded-lg w-full h-full">
        <PatientResumeInfo patient={getPatientInfo.data!.data} basicExamHistory={getBasicExamHistory.data?.data} basicNextExam={data?.data} />
      </div>
    </View.Vertical>
  );
}