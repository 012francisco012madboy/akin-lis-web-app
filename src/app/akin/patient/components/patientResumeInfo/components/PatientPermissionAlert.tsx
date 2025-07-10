import { AlertCircle, CheckCircle, Info, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatientPermissionAlertProps {
  userRole?: string;
  canEdit: boolean;
}

export function PatientPermissionAlert({ userRole, canEdit }: PatientPermissionAlertProps) {
  if (!userRole) return null;

  const getRoleInfo = () => {
    if (canEdit) {
      return {
        icon: <Shield className="w-4 h-4" />,
        title: "Permissões de Edição",
        description: "Você tem permissão para editar as informações deste paciente.",
        variant: "default" as const,
      };
    }

    return {
      icon: <Info className="w-4 h-4" />,
      title: "Acesso Somente Leitura",
      description: "Você pode visualizar as informações, mas não pode editá-las.",
      variant: "default" as const,
    };
  };

  const { icon, title, description, variant } = getRoleInfo();

  return (
    <Alert variant={variant} className="border-blue-200 bg-blue-50">
      {icon}
      <AlertDescription className="text-sm">
        <strong>{title}:</strong> {description}
      </AlertDescription>
    </Alert>
  );
}
