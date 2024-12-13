"use client"
import { View } from "@/components/view";
import { _axios } from "@/lib/axios";
import PatientDisplay from "./patient-display";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlignJustify, Grid } from "lucide-react";
import { InputText } from "primereact/inputtext";

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

const PatientDisplaySkeleton = () => {
  return (
    <View.Vertical className="h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />
      <View.Scroll>
        <div className="w-full flex flex-row  p-5 items-center justify-between">
          <div>
            <div className="flex items-center gap-2 p-1 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
              {/* Botão para visualização em lista */}
              <button
                aria-label="Alterar para visualização em lista"
                className={`flex items-center justify-center w-10 h-10 rounded-md transition-all bg-blue-600 text-white shadow-md" `}
              >
                <AlignJustify size={20} />
              </button>

              {/* Botão para visualização em blocos */}
              <button

                aria-label="Alterar para visualização em blocos"
                className={`flex items-center justify-center w-10 h-10 rounded-md transition-a`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <InputText
              className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Procurar por nome"
              disabled
            />
          </div>
        </div>
        <div className=" w-full px-5 pb-10">
          <Skeleton className="w-full h-[500px] bg-gray-500/10" />
        </div>
      </View.Scroll>
    </View.Vertical>
  )
}