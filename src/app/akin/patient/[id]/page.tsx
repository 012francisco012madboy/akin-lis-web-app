"use client";
import { View } from "@/components/view";
import { PatientResumeInfo } from "../components/patientResumeInfo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ResponseData } from "./next-exam/types";
import { Exam } from "./exam-history/useExamHookData";
import { PatientByIdProfileSkeleton } from "./patientProfileSkeleton";
import { PatientNotFound } from "./patientNotFoundScreen";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { _axios } from "@/Api/axios.config";

interface IPatientById {
  params: {
    id: string;
  };
}

export default function PatientByIdProfile({ params }: IPatientById) {

  const { user } = useAuthStore();
  const userRole = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      return await _axios.get(`/users/${user?.id}`);
    }
  })

  const { data, isPending } = useQuery({
    queryKey: ["next-exam", params.id],
    queryFn: async () => {
      return await _axios.get<ResponseData>(`/exams/next/${params.id}`);
    }
  });

  const getBasicExamHistory = useQuery({
    queryKey: ['history-exam', params.id],
    queryFn: async () => {
      return await _axios.get<Exam>(`/exams/history/${params.id}`);
    }
  })

  const queryClient = useQueryClient();

  const getPatientInfo = useQuery({
    queryKey: ['patient-info', params.id],
    queryFn: async () => {
      return await _axios.get<PatientType>(`/pacients/${params.id}`);
    }
  })

  if (isPending || getBasicExamHistory.isPending || getPatientInfo.isPending || userRole.isPending) {
    return (
      <View.Vertical className="h-screen pb-10">
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

      <div className="flex gap-4 bg-red px-2 md:px-0 md:pr-2 text-akin-white-smoke p-0 rounded-lg w-full h-full">
        <PatientResumeInfo
          patient={getPatientInfo.data!.data}
          basicExamHistory={getBasicExamHistory.data?.data}
          basicNextExam={data?.data}
          userRole={userRole.data?.data?.tipo}
          refetchPatientInfo={() => {
            return queryClient.invalidateQueries({
              queryKey: ['patient-info', params.id]
            })
          }
          }
        />
      </div>
    </View.Vertical>
  );
}