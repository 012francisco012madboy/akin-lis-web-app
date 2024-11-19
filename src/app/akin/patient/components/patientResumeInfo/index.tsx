import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Componentes reutilizáveis
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <article className="w-[300px] bg-gray-100 p-1 tracking-tighter rounded-md shadow-sm">
      <h4 className="flex justify-between items-center text-sm text-gray-400 font-medium">
        {label}
        <Copy size={18} className="cursor-pointer" />
      </h4>
      <p>{value}</p>
    </article>
  );
}

function InfoGroup({ title, items }: { title?: string; items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-2">
      {title && <h2 className="flex justify-between items-center text-sm text-gray-400 font-medium">{title}</h2>}
      {items.map((item, index) => (
        <InfoItem key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
}

function AvatarSection({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="w-max flex flex-col items-center">
      <Avatar className="size-[150px]">
        <AvatarImage className="object-cover" src={imageSrc} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h2 className="flex gap-2 text-sm items-center text-akin-turquoise cursor-pointer">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image size={14} />
        Trocar foto
      </h2>
    </div>
  );
}

// Componente principal
export function PatientResumeInfo({ patient }: { patient: PatientType }) {
  const personalInfo = [
    { label: "Nome do paciente", value: patient.nome },
    { label: "Bilhete de Identidade", value: patient.numero_identificacao },
    { label: "Gênero", value: patient.id_sexo === 1 ? "Masculino" : "Feminino" },
    { label: "Data de nascimento", value: new Date(patient.data_nascimento).toLocaleDateString() },
    { label: "Idade", value: `${2024 - Number(new Date(patient.data_nascimento).getFullYear())}` },
    { label: "Contacto", value: patient.contacto_telefonico },
  ];

  const assignedStaff = [
    { label: "Doutor", value: "Paulo Sauimbo" },
    { label: "Enfermeiros", value: "Albertina Tchela, Miguel Bungo" },
  ];

  return (
    <div className="flex gap-x-6">
      {/* Card principal */}
      <Card className="w-[680px] h-max shadow-md">
        <CardHeader className="flex flex-row justify-between px-5 py-2">
          <CardTitle>
            <AvatarSection imageSrc="https://images.pexels.com/photos/12202417/pexels-photo-12202417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
          </CardTitle>
          <CardDescription>
            <InfoGroup
              items={[
                { label: "Paciente registado", value: new Date(patient.data_registro).toLocaleString() },
              ]}
            />
            <InfoGroup title="Técnicos já alocados" items={assignedStaff} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-md font-medium text-black/50">Informações do Paciente</h3>
          <InfoGroup items={personalInfo} />
        </CardContent>
      </Card>

      {/* Card de histórico */}
      <Card className="w-[300px] h-max shadow-md">
        <CardHeader>
          <CardTitle>Histórico de exames</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex justify-between p-2 border-b rounded-lg mb-1"
            >
              <div>
                <p className="font-bold text-lg">Covid</p>
                <p>Detalhes: Virus contagioso</p>
                <p>ID do Agendamento: 1325</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Link href={`${patient.id}/exam-history`}>
            <Button className="w-full h-[30px] bg-akin-turquoise">Ver mais históricos</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
