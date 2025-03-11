"use client"
import { View } from "@/components/view";
import { _axios } from "@/lib/axios";
import PatientDisplay from "./patient-display";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { PatientDisplaySkeleton } from "./components/patientDisplaySkeleton";
import { labTechniciansRoutes } from "@/module/services/api/routes/lab-technicians";
import { patientRoutes } from "@/module/services/api/routes/patients";
import { getAllDataInCookies } from "@/utils/get-data-in-cookies";

const breadcrumbItems = [
  {
    label: "Paciente",
  }
]

export default function Patient() {
  const userRole = getAllDataInCookies().userRole;
  const isLabTechnician = userRole === "TECNICO";

  console.log("user role", userRole);
  console.log("isLabTechnician", isLabTechnician);

  const patientsQuery = useQuery({
    queryKey: ["patient-data"],
    queryFn: async () => {
      if (isLabTechnician) {
        return await labTechniciansRoutes.getPacientsAssocietedToLabTechnician(getAllDataInCookies().userdata.id);
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