import { create } from "zustand";

type AuthRoleState = {
  role: string | null; // Role do usuário (ex.: "CHEFE", "TECNICO", etc.)
  setRole: (role: string | null) => void; // Função para definir o role
  clearRole: () => void; // Função para limpar o role
};

export const useAuthRoleStore = create<AuthRoleState>((set) => ({
  role: null, // Inicialmente, o role é null
  setRole: (role) => set({ role }),
  clearRole: () => set({ role: null }),
}));
