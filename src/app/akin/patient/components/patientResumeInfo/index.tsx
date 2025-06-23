"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Exam } from "../../[id]/exam-history/useExamHookData";
import { ResponseData } from "../../[id]/next-exam/types";
import { AvatarSection } from "./_avatarSection";
import { InfoGroup } from "./_infoGroup";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { _axios } from "@/Api/axios.config";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { Combobox } from "@/components/combobox/combobox";
import { QueryClient, useMutation } from "@tanstack/react-query";

const genderOptions = ["Masculino", "Femenino"]
const queryClient = new QueryClient()
// Componente principal
export function PatientResumeInfo({
  patient,
  basicExamHistory,
  basicNextExam,
  userRole,
  refetchPatientInfo
}: {
  patient: PatientType,
  basicExamHistory?: Exam,
  basicNextExam?: ResponseData,
  userRole?: string,
  refetchPatientInfo: () => void
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<{
    nome_completo: string;
    numero_identificacao: string;
    id_sexo: number;
    data_nascimento: string;
    contacto_telefonico: string;
    sexo: sexoType;
  }>({
    nome_completo: patient.nome_completo,
    numero_identificacao: patient.numero_identificacao,
    id_sexo: patient.id_sexo,
    data_nascimento: patient.data_nascimento,
    contacto_telefonico: patient.contacto_telefonico,
    sexo: {
      nome: patient.sexo.nome
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onUpdate = useMutation({
    mutationFn: (data: any) => {
      setIsSaving(true);
      return _axios.patch(`/pacients/${patient.id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setIsSaving(false);
      setIsEditing(false);
      ___showSuccessToastNotification({ message: "Dados atualizados com sucesso" });
      refetchPatientInfo();
    },
    onError: () => {
      setIsSaving(false);
      setIsEditing(false);
      ___showErrorToastNotification({ message: "Erro ao salvar dados" });
    },
  })

  const handleSave = async () => {
    const dataToSend = {
      nome_completo: formData.nome_completo,
      numero_identificacao: formData.numero_identificacao,
      id_sexo: parseInt(formData.id_sexo.toString(), 10),
      data_nascimento: formData.data_nascimento,
      contacto_telefonico: formData.contacto_telefonico,
    };
    onUpdate.mutate(dataToSend);
  };

  const personalInfo = [
    { label: "Nome do paciente", value: patient.nome_completo },
    { label: "Bilhete de Identidade", value: patient.numero_identificacao },
    { label: "Gênero", value: patient.id_sexo === 1 ? "Masculino" : "Feminino" },
    { label: "Data de nascimento", value: new Date(patient.data_nascimento).toLocaleDateString() },
    { label: "Idade", value: `${2024 - Number(new Date(patient.data_nascimento).getFullYear())}` },
    { label: "Contacto", value: patient.contacto_telefonico },
  ];

  return (
    <div className=" w-full gap-x-5 gap-y-5 pb-5  flex flex-col md:justify-between lg:flex-row  overflow-auto  [&::-webkit-scrollbar]:hidden ">
      {/* Card principal */}
      <Card className=" md:min-w-[65%]  h-max shadow-md flex flex-col gap-10">
        <CardHeader className="flex flex-col md:flex-row md:justify-between gap-5 px-4 py-2">
          <CardTitle>
            <AvatarSection imageSrc="https://images.pexels.com/photos/12202417/pexels-photo-12202417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
          </CardTitle>
          <CardDescription>
            <h3 className="text-md font-medium text-black/50">Informações do Paciente</h3>
            <InfoGroup items={personalInfo} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            userRole === "RECEPCIONISTA" && (
              <Button
                className="mt-4 bg-akin-turquoise hover:bg-akin-turquoise/80 text-white"
                onClick={() => setIsEditing(true)}
              >
                Editar Informações
              </Button>
            )
          }
        </CardContent>
      </Card>

      {/* Card de Edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Informações do Paciente</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-800 font-medium" htmlFor="nome_completo">Nome do Paciente</label>
              <Input
                id="nome_completo"
                placeholder="Nome do Paciente"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-800 font-medium" htmlFor="numero_identificacao">Bilhete de Identidade</label>
              <Input
                id="numero_identificacao"
                placeholder="Bilhete de Identidade"
                name="numero_identificacao"
                value={formData.numero_identificacao}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-800 font-medium" htmlFor="id_sexo">Gênero</label>

              <Combobox
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_sexo: value === "Masculino" ? 1 : 2,
                  }))
                }
                value={formData.sexo.nome}
                options={genderOptions}
                placeholder={formData.sexo.nome}
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-800 font-medium" htmlFor="data_nascimento">Data de Nascimento</label>
              <Input
                id="data_nascimento"
                placeholder="Data de Nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-800 font-medium" htmlFor="contacto_telefonico">Contacto</label>
              <Input
                id="contacto_telefonico"
                placeholder="Contacto"
                name="contacto_telefonico"
                value={formData.contacto_telefonico}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button className="bg-akin-turquoise hover:bg-akin-turquoise/80" onClick={handleSave}>{isSaving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-5 w-ful">
        {/* Card de histórico */}
        <Card className="w-full  h-max shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="bg-gray-50 p-4 border-b">
            <CardTitle className="text-lg font-semibold text-gray-800">Histórico de Exames</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {basicExamHistory?.data && basicExamHistory.data.length > 0 ? (
              basicExamHistory.data.slice(0, 1).map((exam, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 bg-white shadow-sm rounded-md p-4 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-800 text-base">
                    {exam.Tipo_Exame.nome}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Data de Agendamento:</strong> {exam.data_agendamento}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status do Exame:</strong> {exam.Tipo_Exame.status}
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
          {/* {basicNextExam!.data.length > 2 ? ( */}
            <CardFooter className="bg-gray-50 p-4 border-t w-full">
              <Link href={`${patient.id}/next-exam`} passHref>
                <Button className="w-[295px] h-8 bg-akin-turquoise text-white font-medium hover:bg-akin-turquoise-dark transition">
                  Ver próximos
                </Button>
              </Link>
            </CardFooter>
          {/* ) : (
            <></>
          )
          } */}
        </Card>
      </div>
    </div>
  );
}