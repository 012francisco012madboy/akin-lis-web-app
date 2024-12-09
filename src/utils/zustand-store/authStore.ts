import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  access_token: string;
  refresh_token: string;
}

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: "",
      login: (token, user) =>
        set({
          user,
          token,
          isAuthenticated: user.access_token,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: null,
        }),
    }),
    {
      name: 'auth-storage', // Salva o estado no localStorage
    }
  )
);
