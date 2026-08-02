import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: any;
  setUser: (user: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setUser: (user) => set({ user }),
  clearAuth: () => set({ token: null, user: null }),
}));
