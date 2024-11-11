"use client"
import { AppLayout } from "@/components/layout";
import { View } from "@/components/view";
import { ___api } from "@/lib/axios";
import PatientDisplay from "./patient-display";
import { useEffect, useState } from "react";

export default function Patient() {
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const response = await ___api.get("/pacients");
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
      <AppLayout.ContainerHeader label="Pacientes" />
      <View.Scroll>
        {loading ? (
          <p>Carregando pacientes...</p>
        ) : (
          <PatientDisplay patients={patients} />
        )}
      </View.Scroll>
    </View.Vertical>
  );
}




