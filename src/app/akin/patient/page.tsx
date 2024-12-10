"use client"
import { AppLayout } from "@/components/layout";
import { View } from "@/components/view";
import { _axios } from "@/lib/axios";
import PatientDisplay from "./patient-display";
import { useEffect, useState } from "react";
import CustomBreadcrumb, { BreadcrumbItem } from "@/components/custom-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

export default function Patient() {
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    {
      label: "Paciente",
    }
  ]

  const fetchPatients = async () => {
    try {
      const response = await _axios.get("/pacients");
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`Erro ao buscar pacientes: ${error}`);
    }
  };

  useEffect(() => {
    fetchPatients();

    const intervalId = setInterval(() => {
      fetchPatients();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View.Vertical className="h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />
      <View.Scroll>
        {loading ? (
          <PatientDisplaySkeleton />
        ) : (
          <PatientDisplay patients={patients} />
        )}
      </View.Scroll>
    </View.Vertical>
  );
}



const PatientDisplaySkeleton = () => {
  return (
    <div className="px-5 w-full h-full flex flex-col gap-10">
      <div className="flex justify-between items-center w-full mt-2">
        <div className="space-x-1 flex">
          <Skeleton className="size-[50px] bg-gray-500/20" />
          <Skeleton className="size-[50px] bg-gray-500/20" />
        </div>
        <Skeleton className="w-[400px] h-12 bg-gray-500/20" />
      </div>

      <Skeleton className="w-full h-screen bg-gray-500/20" />
    </div>
  )
}
