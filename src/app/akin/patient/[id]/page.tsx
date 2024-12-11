"use client";
import { View } from "@/components/view";
import { PackageOpen } from "lucide-react";
import { _axios } from "@/lib/axios";
import { PatientResumeInfo } from "../components/patientResumeInfo";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ResponseData } from "./next-exam/types";
import { Exam } from "./exam-history/useExamHookData";

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
    return <NoPatientFound id={params.id} />;
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

const PatientByIdProfileSkeleton = () => {
  return (
    <div className="w-full h-full flex justify-between gap-5">
      <Skeleton className="w-full h-full bg-gray-500/20" />
      <div className=" w-[300px] space-y-10 ">
        <Skeleton className="w-[300px] h-[250px] bg-gray-500/20" />
        <Skeleton className="w-[300px] h-[250px] bg-gray-500/20" />
      </div>
    </div>
  )
}