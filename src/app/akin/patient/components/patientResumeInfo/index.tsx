"use client"
import { Exam } from "../../[id]/exam-history/useExamHookData";
import { ResponseData } from "../../[id]/next-exam/types";
import { PatientHeader, PatientEditDialog, NextExamsCard, PatientStats, ExamHistoryCard } from "./components";
import { usePatientForm, usePatientData, usePatientPermissions } from "./hooks";

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
  const { personalInfo } = usePatientData(patient);
  const { canEdit } = usePatientPermissions(userRole);
  const {
    formData,
    isSaving,
    isEditing,
    validationErrors,
    handleInputChange,
    handleGenderChange,
    handleSave,
    openEditDialog,
    closeEditDialog,
  } = usePatientForm(patient, refetchPatientInfo, userRole);

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50/50 min-h-screen">
      {/* Header Principal do Paciente */}
      <PatientHeader
        patient={patient}
        personalInfo={personalInfo}
        canEdit={canEdit}
        onEdit={openEditDialog}
      />

      {/* Grid de Conteúdo */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Coluna Principal - Estatísticas */}
        <div className="xl:col-span-2 space-y-6">
          <PatientStats
            patient={patient}
            totalExams={basicExamHistory?.data?.length || 0}
            pendingExams={basicNextExam?.data?.length || 0}
          />

          {/* Histórico de Exames */}
          <ExamHistoryCard
            patientId={patient.id}
            examHistory={basicExamHistory}
          />
        </div>

        {/* Coluna Lateral - Próximos Exames */}
        <div className="xl:col-span-1">
          <NextExamsCard
            patientId={patient.id}
            nextExams={basicNextExam}
          />
        </div>
      </div>

      {/* Dialog de Edição */}
      <PatientEditDialog
        isOpen={isEditing}
        onClose={closeEditDialog}
        formData={formData}
        onInputChange={handleInputChange}
        onGenderChange={handleGenderChange}
        onSave={handleSave}
        isSaving={isSaving}
        validationErrors={validationErrors}
      />
    </div>
  );
}