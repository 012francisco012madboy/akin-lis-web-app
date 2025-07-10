import { useCallback, useMemo } from "react";
import { EDIT_PATIENT_ROLES } from "../constants";

export const usePatientPermissions = (userRole?: string) => {
  const canEdit = useMemo(() => {
    if (!userRole) return false;
    return EDIT_PATIENT_ROLES.includes(userRole as any);
  }, [userRole]);

  const canView = useMemo(() => {
    // Todos os usuários autenticados podem visualizar
    return !!userRole;
  }, [userRole]);

  const canAccessExamHistory = useMemo(() => {
    // Baseado no middleware, todos podem acessar histórico
    return !!userRole;
  }, [userRole]);

  const canAccessNextExams = useMemo(() => {
    // Baseado no middleware, todos podem acessar próximos exames
    return !!userRole;
  }, [userRole]);

  const getRoleDisplayName = useCallback((role: string) => {
    const roleMap: Record<string, string> = {
      "RECEPCIONISTA": "Recepcionista",
      "TECNICO": "Técnico",
      "MEDICO": "Médico",
      "CHEFE": "Chefe",
    };
    return roleMap[role] || role;
  }, []);

  return {
    canEdit,
    canView,
    canAccessExamHistory,
    canAccessNextExams,
    getRoleDisplayName,
  };
};
