"use client"
import { View } from "@/components/view";
import { _axios } from "@/lib/axios";
import PatientDisplay from "./patient-display";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { PatientDisplaySkeleton } from "./components/patientDisplaySkeleton";
import { labTechniciansRoutes } from "@/module/services/routes/lab-technicians";
import Cookies from "js-cookie";
import { patientRoutes } from "@/module/services/routes/patients";

const breadcrumbItems = [
  {
    label: "Paciente",
  }
]

export default function Patient() {
  const userRole = typeof window !== "undefined" ? Cookies.get("akin-role") || "" : "";
  const isLabTechnician = userRole === "TECNICO";

  const patientsQuery = useQuery({
    queryKey: ["patient-data"],
    queryFn: async () => {
      if (isLabTechnician) {
        return await labTechniciansRoutes.getPacientsAssocietedToLabTechnician("cm681rq01000pfe0x5b9gi2y8");
      } else {
        return await patientRoutes.getAllPacients();
      }
    },
  });

  if (patientsQuery.isError) return <p>{patientsQuery.error.message}</p>
  if (patientsQuery.isLoading) return <PatientDisplaySkeleton />

  return (
    <View.Vertical className="h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />
      <View.Scroll>
        <p></p>
        <PatientDisplay patients={patientsQuery.data} />
      </View.Scroll>
    </View.Vertical>
  );
}