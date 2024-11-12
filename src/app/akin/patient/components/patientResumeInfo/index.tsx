import Avatar from "@/components/avatar";
import ImageAvatat from "@/assets/images/avatar.png";




export function PatientResumeInfo({ patient }: { patient: PatientType }) {
  return (
    <div className="flex flex-1 items-center gap-x-6">
      <Avatar userName={patient.nome} image={String(ImageAvatat)} size="xlarge" className="border size-[144px]" />
      <div>
        <p className="font-bold text-akin-turquoise text-xl">{patient.nome}</p>
        <p>Nº do BI: {patient.numero_identificacao}</p>
        <p>Sexo: {patient.id_sexo === 1 ? "Masculino" : "Feminino"}</p>
        <p>idade: {2024 - Number(new Date(patient.data_nascimento).getFullYear())}</p>
        <p>Data de Nascumento: {new Date(patient.data_nascimento).toLocaleDateString()}</p>
        <p>Contacto: {patient.contacto_telefonico}</p>
        <p>Última Visita: {new Date(patient.data_ultima_visita).toLocaleString()}</p>
        <p>Registrado(a) em: {new Date(patient.data_ultima_visita).toLocaleString()}</p>
      </div>
    </div>
  );
}
