import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/combobox/combobox";
import { PatientFormData } from "../hooks/usePatientForm";
import { GENDER_OPTIONS } from "../constants";
import { User, IdCard, Calendar, Phone, Users, AlertCircle } from "lucide-react";

interface PatientEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: PatientFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenderChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  validationErrors?: Record<string, string>;
}

export function PatientEditDialog({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onGenderChange,
  onSave,
  isSaving,
  validationErrors = {}
}: PatientEditDialogProps) {
  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Editar Informações do Paciente
          </DialogTitle>
          {hasErrors && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
              <AlertCircle className="w-4 h-4" />
              Por favor, corrija os erros abaixo antes de salvar.
            </div>
          )}
        </DialogHeader>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="nome_completo"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Nome Completo
            </Label>
            <Input
              id="nome_completo"
              placeholder="Digite o nome completo"
              name="nome_completo"
              value={formData.nome_completo}
              onChange={onInputChange}
              className={`h-11 ${validationErrors.nome_completo ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {validationErrors.nome_completo && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.nome_completo}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="numero_identificacao"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <IdCard className="w-4 h-4" />
              Bilhete de Identidade
            </Label>
            <Input
              id="numero_identificacao"
              placeholder="Digite o número de identificação"
              name="numero_identificacao"
              value={formData.numero_identificacao}
              onChange={onInputChange}
              className={`h-11 ${validationErrors.numero_identificacao ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {validationErrors.numero_identificacao && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.numero_identificacao}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="id_sexo"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Gênero
            </Label>
            <Combobox
              onChange={onGenderChange}
              value={formData.sexo.nome}
              options={[...GENDER_OPTIONS]}
              placeholder="Selecione o gênero"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="data_nascimento"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Data de Nascimento
            </Label>
            <Input
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={onInputChange}
              className={`h-11 ${validationErrors.data_nascimento ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {validationErrors.data_nascimento && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.data_nascimento}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="contacto_telefonico"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Contacto Telefônico
            </Label>
            <Input
              id="contacto_telefonico"
              placeholder="Digite o número de telefone"
              name="contacto_telefonico"
              value={formData.contacto_telefonico}
              onChange={onInputChange}
              className={`h-11 ${validationErrors.contacto_telefonico ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {validationErrors.contacto_telefonico && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.contacto_telefonico}
              </p>
            )}
          </div>
        </form>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
