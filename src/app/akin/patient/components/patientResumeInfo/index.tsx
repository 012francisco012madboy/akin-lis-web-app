"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Exam } from "../../[id]/exam-history/useExamHookData";
import { useState } from "react";
import { ResponseData } from "../../[id]/next-exam/types";

// Componentes reutilizáveis
function InfoItem({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="w-[300px] bg-gray-100 p-1 tracking-tighter rounded-md shadow-sm">
      <h4 className="flex justify-between items-center text-sm text-gray-400 font-medium">
        {label}
        {
          copied ? (
            <span className="text-xs text-green-500 block ">
              Copiado!
            </span>
          ) : (
            <Copy size={18} className="cursor-pointer" onClick={handleCopy} />
          )
        }
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
export function PatientResumeInfo({
  patient,
  basicExamHistory,
  basicNextExam
}: {
  patient: PatientType,
  basicExamHistory?: Exam,
  basicNextExam?: ResponseData
}) {
  const personalInfo = [
    { label: "Nome do paciente", value: patient.nome_completo },
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
    <div className=" w-full gap-x-5 gap-y-5 pb-5 flex flex-col md:justify-between lg:flex-row  overflow-auto  [&::-webkit-scrollbar]:hidden ">
      {/* Card principal */}
      <Card className=" md:min-w-[65%]  h-max shadow-md flex flex-col gap-10">
        <CardHeader className="flex flex-col md:flex-row md:justify-between gap-5 px-4 py-2">
          <CardTitle>
            <AvatarSection imageSrc="https://images.pexels.com/photos/12202417/pexels-photo-12202417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
          </CardTitle>
          <CardDescription>
            <InfoGroup
              items={[
                { label: "Paciente registado", value: new Date(patient.data_registro).toString() },
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

      <div className="space-y-5 w-ful">
        {/* Card de histórico */}
        <Card className="w-full  h-max shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="bg-gray-50 p-4 border-b">
            <CardTitle className="text-lg font-semibold text-gray-800">Histórico de Exames</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {basicExamHistory?.data && basicExamHistory.data.length > 0 ? (
              basicExamHistory.data.slice(0, 2).map((exam, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 bg-white shadow-sm rounded-md p-4 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-800 text-base">{exam.exame.nome}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Data de Agendamento:</strong> {exam.Agendamento.data_agendamento}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status do Exame:</strong> {exam.Agendamento.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Sem exames registrados</p>
            )}
          </CardContent>
          {basicExamHistory!.data.length > 2 ? (
            <CardFooter className="bg-gray-50 p-4 border-t w-full">
              <Link href={`${patient.id}/exam-history`} passHref>
                <Button className="w-[295px] h-8 bg-akin-turquoise text-white font-medium hover:bg-akin-turquoise-dark transition">
                  Ver mais históricos
                </Button>
              </Link>
            </CardFooter>
          ) : (
            <CardFooter className="bg-gray-50 p-4 border-t">
              <Link href={`${patient.id}/exam-history`} passHref>
                <Button className="w-[295px] h-8 bg-akin-turquoise text-white font-medium hover:bg-akin-turquoise-dark transition">
                  Ver todos
                </Button>
              </Link>
            </CardFooter>
          )
          }
        </Card>

        {/* Card de Proximos exames */}
        <Card className="w-full h-max shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="bg-gray-50 p-4 border-b">
            <CardTitle className="text-lg font-semibold text-gray-800">Próximos Exames</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {basicNextExam?.data && basicNextExam.data.length > 0 ? (
              basicNextExam.data.slice(0, 1).map((exam, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 bg-white shadow-sm rounded-md p-4 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-800 text-base">{exam.Tipo_Exame.nome}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Data de Agendamento:</strong> {exam.data_agendamento
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Hora do Exame:</strong> {exam.hora_agendamento}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Sem exames registrados</p>
            )}
          </CardContent>
          {basicExamHistory!.data.length > 2 ? (
            <CardFooter className="bg-gray-50 p-4 border-t w-full">
              <Link href={`${patient.id}/next-exam`} passHref>
                <Button className="w-[295px] h-8 bg-akin-turquoise text-white font-medium hover:bg-akin-turquoise-dark transition">
                  Ver mais históricos
                </Button>
              </Link>
            </CardFooter>
          ) : (
            <CardFooter className="bg-gray-50 p-4 border-t">
              <Link href={`${patient.id}/next-exam`} passHref>
                <Button className="w-[300px] h-8 bg-akin-turquoise text-white font-medium hover:bg-akin-turquoise-dark transition">
                  Ver todos
                </Button>
              </Link>
            </CardFooter>
          )
          }
        </Card>
      </div>
    </div>
  );
}
