import { create } from 'zustand';
import Cookies from 'js-cookie';

type User = {
  id: string;
  access_token: string;
  refresh_token: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token, user) => {
    // Salva os dados nos cookies
    Cookies.set('akin-userdata', JSON.stringify(user), { secure: true, sameSite: 'Strict', });
    Cookies.set('akin-token', token, { secure: true, sameSite: 'Strict' });

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },
  logout: () => {
    // Remove os dados dos cookies
    Cookies.remove('akin-userdata');
    Cookies.remove('akin-token');
    Cookies.remove('akin-role');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

// Recupera os dados do cookie ao carregar a aplicação
const userCookie = Cookies.get('akin-userdata');
const tokenCookie = Cookies.get('akin-token');

if (userCookie && tokenCookie) {
  const parsedUser = JSON.parse(userCookie) as User;
  useAuthStore.setState({
    user: parsedUser,
    token: tokenCookie,
    isAuthenticated: true,
  });
}
