"use client";
import { Button } from "@/components/button";
import { DialogWindow } from "@/components/dialog";
import { Input } from "@/components/input";
import { Save, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { schemaSchedule } from "../schemaZodNewPatient";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { _axios } from "@/lib/axios";
import { genders, mapFormDataToPatient } from "../utils/mapFormDataToPatient";


export const ModalNewPatient = ({ onPatientSaved }: { onPatientSaved: (patient: PatientType) => void }) => {
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
      patient_name: patientData.nome_completo,
      patient_gender: data.get("gender") as string,
    });

    if (!validatedData.success) {
      const errorMessages = validatedData.error.errors.map((error) => error.message);
      ___showErrorToastNotification({ messages: errorMessages });
      return;
    }

    await savePatientData(patientData);
  };

  const savePatientData = async (patientData: object) => {
    // console.log(patientData)
    setIsSaving(true);
    try {
      const res = await _axios.post("/pacients", patientData);

      if (res.status === 201) {
        ___showSuccessToastNotification({ message: "Paciente cadastrado com sucesso" });

        // Comunicar o paciente cadastrado ao componente pai
        onPatientSaved(res.data); // Assumindo que a API retorna o paciente cadastrado
        handleCloseModal();
      } else {
        ___showErrorToastNotification({ message: "Erro ao cadastrar paciente." });
      }
    } catch (error) {
      ___showErrorToastNotification({ message: "Erro ao salvar paciente." });
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
    className="w-max py-2  px-2 bg-akin-yellow-light/80 justify-center rounded-lg text-sm right-0 top-0 transform transition-all hover:bg-akin-yellow-light hover:scale-105 focus:outline-none focus:ring-2 focus:ring-akin-primary focus:ring-opacity-50 text-gray-800 flex items-center space-x-2 shadow-lg"
    onClick={onClick}
  >
    <UserRoundPlus className="text-xl" />
    Registar Novo Paciente
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
      className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <Input.InputText
        placeholder="Nome do Paciente"
        name="name"
        className="border-[1px] bg-white border-gray-300 rounded-lg 0 transition-all placeholder-gray-500 text-gray-800"
      />
      <div className="flex flex-wrap gap-4">
        <Input.CalenderDate
          noUseLabel
          placeholder="Data de Nascimento"
          maxDate={new Date()}
          name="birth_day"
          valueDate={null}
          className="border-[1px] pl-2.5 bg-white ring-0 h-12  border-gray-300 rounded-lg focus:border-none focus:ring-0 transition-all placeholder-gray-800 text-gray-800 "
        />
        <Input.Dropdown
          data={genders}
          name="gender"
          placeholder="Selecione o sexo"
          className="border-[1px] bg-white ring-0 border-gray-300 rounded-lg focus:border-none focus:ring-0 transition-all placeholder-gray-500 text-gray-800"
        />
      </div>
      <Input.InputText
        placeholder="Contacto telefónico"
        name="phone_number"
        type="number"
        className="border-[1px] bg-white border-gray-300 rounded-lg   transition-all placeholder-gray-500 text-gray-800"
      />
      <Input.InputText
        placeholder="Bilhete de Identidade"
        maxLength={14}
        name="identity"
        className="border-[1px] bg-white border-gray-300 rounded-lg  transition-all placeholder-gray-500 text-gray-800"
      />
      <div className="flex justify-end gap-4 mt-6">
        <Button.Primary
          icon={<Save />}
          type="submit"
          className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-white py-2 px-4 rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          label={isSaving ? "Salvando..." : "Salvar"}
          disabled={isSaving}
        />
      </div>
    </form>
  </DialogWindow.Window>
);