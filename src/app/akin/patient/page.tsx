"use client"
import { View } from "@/components/view";
import { _axios } from "@/lib/axios";
import PatientDisplay from "./patient-display";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { PatientDisplaySkeleton } from "./components/patientDisplaySkeleton";

const breadcrumbItems = [
  {
    label: "Paciente",
  }
]

export default function Patient() {
  const patients = useQuery({
    queryKey: ["patient-data"],
    queryFn: async () => {
      return await _axios.get<PatientType[]>("/pacients");
    },
  })

  if (patients.isError) return <p>{patients.error.message}</p>
  if (patients.isLoading) return <PatientDisplaySkeleton />
  return (
    <View.Vertical className="h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />
      <View.Scroll>
        <PatientDisplay patients={patients.data!.data} />
      </View.Scroll>
    </View.Vertical>
  );
}