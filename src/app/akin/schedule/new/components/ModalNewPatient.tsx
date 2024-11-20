"use client";
import { Button } from "@/components/button";
import { DialogWindow } from "@/components/dialog";
import { Input } from "@/components/input";
import { LoaderCircle, Save, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { schemaSchedule } from "../schemaZodNewPatient";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { ___api } from "@/lib/axios";

const genders = [
  { id: 1, value: "Masculino" },
  { id: 2, value: "Feminino" },
];

const NOTIFICATION_MESSAGES = {
  success: "Paciente cadastrado com sucesso",
  error: "Erro ao cadastrar paciente. Tente novamente ou contate o suporte se o erro persistir.",
};

export const ModalNewPatient = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handleFormSubmit = async (data: FormData) => {
    const patientData = mapFormDataToPatient(data);

    const validatedData = schemaSchedule.safeParse({
      patient_id: patientData.numero_identificacao,
      patient_phone: patientData.contacto_telefonico,
      patient_birth_day: new Date(patientData.data_nascimento),
      patient_name: patientData.nome,
      patient_gender: data.get("gender") as string,
    });

    if (!validatedData.success) {
      const errorMessages = validatedData.error.errors.map((error) => error.message);
      ___showErrorToastNotification({ messages: errorMessages });
      return;
    }

    await savePatientData(patientData);
  };

  const mapFormDataToPatient = (data: FormData) => ({
    numero_identificacao: data.get("identity") as string,
    nome: data.get("name") as string,
    data_nascimento: new Date(data.get("birth_day") as string).toLocaleDateString("en-CA"),
    contacto_telefonico: data.get("phone_number") as string,
    id_sexo: genders.find((gender) => gender.value === data.get("gender") as string)?.id,
  });

  const savePatientData = async (patientData: object) => {
    setIsSaving(true);
    try {
      const res = await ___api.post("/pacients", patientData);
      if (res.status === 201) {
        ___showSuccessToastNotification({ message: NOTIFICATION_MESSAGES.success });
        handleCloseModal();
      } else {
        ___showErrorToastNotification({ message: NOTIFICATION_MESSAGES.error });
      }
    } catch (error) {
      ___showErrorToastNotification({ message: NOTIFICATION_MESSAGES.error });
      console.error("Error saving patient data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <RegisterPatientButton onClick={handleOpenModal} />
      <PatientRegistrationModal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        isSaving={isSaving}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
const RegisterPatientButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    className="absolute bg-akin-yellow-light/80 p-3 rounded-lg text-sm right-0 top-0 transform transition-all hover:bg-akin-yellow-light hover:scale-105 focus:outline-none focus:ring-2 focus:ring-akin-primary focus:ring-opacity-50 text-gray-800 flex items-center space-x-2 shadow-lg"
    onClick={onClick}
  >
    <UserRoundPlus className="text-xl" />
    <p className="text-sm font-medium">Registar Novo Paciente</p>
  </button>
);

const PatientRegistrationModal = ({
  isOpen,
  onClose,
  isSaving,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: (state: boolean) => void;
  isSaving: boolean;
  onSubmit: (data: FormData) => Promise<void>;
}) => (
  <DialogWindow.Window modalTitle="Cadastro de Paciente" visible={isOpen} setVisible={onClose}>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.target as HTMLFormElement));
      }}
      className="flex flex-col gap-6 p-6  bg-white rounded-lg shadow-xl"
    >
      <Input.InputText
        placeholder="Nome do Paciente"
        name="name"
        className="border-2 border-akin-gray-200 rounded-md focus:ring-2 focus:ring-akin-primary transition-colors"
      />
      <div className="flex flex-wrap gap-4">
        <Input.CalenderDate
          noUseLabel
          placeholder="Data de Nascimento"
          maxDate={new Date()}
          name="birth_day"
          valueDate={null}
          className="border-2 border-akin-gray-200 rounded-md focus:ring-2 focus:ring-akin-primary"
        />
        <Input.Dropdown
          data={genders}
          name="gender"
          placeholder="Selecione o sexo"
          className="border-2 border-akin-gray-200 rounded-md focus:ring-2 focus:ring-akin-primary"
        />
      </div>
      <Input.InputText
        placeholder="Contacto telefónico"
        name="phone_number"
        type="number"
        className="border-2 border-akin-gray-200 rounded-md focus:ring-2 focus:ring-akin-primary"
      />
      <Input.InputText
        placeholder="Bilhete de Identidade"
        maxLength={14}
        name="identity"
        className="border-2 border-akin-gray-200 rounded-md focus:ring-2 focus:ring-akin-primary"
      />
      <div className="flex justify-end gap-4 mt-6">
        <Button.Primary
          icon={<Save />}
          type="submit"
          className="bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-akin-primary transition-all"
          label={isSaving ? "Salvando..." : "Salvar"}
          disabled={isSaving}
        />
      
      </div>
    </form>
  </DialogWindow.Window>
);
