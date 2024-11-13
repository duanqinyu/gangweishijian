import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Check for existing token in localStorage
  const existingToken = localStorage.getItem('token');
  const initialState = {
    token: existingToken,
    user: existingToken ? jwtDecode(existingToken) : null,
    isAuthenticated: !!existingToken,
  };

  return {
    ...initialState,
    login: (token: string) => {
      localStorage.setItem('token', token);
      const user = jwtDecode(token);
      set({ token, user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});