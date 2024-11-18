import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import type { UserProfile } from '../types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Check for existing token in localStorage
  const existingToken = localStorage.getItem('token');
  const initialState = {
    token: existingToken,
    user: existingToken ? {
      ...jwtDecode(existingToken),
      role: jwtDecode<any>(existingToken).role || 'student'
    } : null,
    isAuthenticated: !!existingToken,
  };

  return {
    ...initialState,
    login: (token: string) => {
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode<any>(token);
      const user: UserProfile = {
        ...decodedToken,
        name: decodedToken.name || '用户',
        email: decodedToken.email || '',
        role: decodedToken.role || 'student'
      };
      set({ token, user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false });
    },
    updateProfile: (data: Partial<UserProfile>) => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        set({ user: updatedUser });
        // 实际项目中这里应该调用API更新服务器端的用户信息
      }
    },
    updatePassword: async (oldPassword: string, newPassword: string) => {
      // 模拟API调用
      return new Promise((resolve) => {
        setTimeout(() => {
          // 实际项目中应该验证旧密码并更新新密码
          resolve(true);
        }, 1000);
      });
    }
  };
});