import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { User } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isPaymentModalOpen: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isPaymentModalOpen: false,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
      openPaymentModal: () => set({ isPaymentModalOpen: true }),
      closePaymentModal: () => set({ isPaymentModalOpen: false }),
    }),
    {
      name: 'code-heatmap-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
