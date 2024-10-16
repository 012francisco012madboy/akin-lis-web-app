import { AppLayout } from "@/components/layout";
import { View } from "@/components/view";
import { ___api } from "@/lib/axios";
import PatientDisplay from "./patient-display";

export default async function Patient() {
  let patients: PatientType[] = [];

  // revalidatePath("/akin/patient");

  try {
    patients = await ___api.get("/pacients").then((response) => response.data);
  } catch (error) {
    throw new Error(`Buscando Pacientes:${error}`);
  }

  return (
    <View.Vertical className=" h-screen ">
      <AppLayout.ContainerHeader label="Pacientes" />
      <View.Scroll>
        <PatientDisplay patients={patients} />
      </View.Scroll>
    </View.Vertical>
  );
}




