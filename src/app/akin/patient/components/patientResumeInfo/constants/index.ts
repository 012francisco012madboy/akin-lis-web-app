export const GENDER_OPTIONS = ["Masculino", "Feminino"] as const;

export const USER_ROLES = {
  RECEPTIONIST: "RECEPCIONISTA",
  TECHNICIAN: "TECNICO",
  DOCTOR: "MEDICO",
  CHIEF: "CHEFE",
} as const;

export type GenderOption = typeof GENDER_OPTIONS[number];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Roles que podem editar informações de pacientes
export const EDIT_PATIENT_ROLES = [
  USER_ROLES.RECEPTIONIST,
  USER_ROLES.CHIEF,
] as const;
