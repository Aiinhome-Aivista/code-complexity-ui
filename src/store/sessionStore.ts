import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SessionDataTableItem } from "@/types/common_api_types";

interface SessionState {
  sessions: SessionDataTableItem[];
  setSessions: (sessions: SessionDataTableItem[]) => void;
  isSessionsLoading: boolean;
  setIsSessionsLoading: (loading: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessions: [],
      setSessions: (sessions) => set({ sessions }),
      isSessionsLoading: false,
      setIsSessionsLoading: (loading) => set({ isSessionsLoading: loading }),
    }),
    {
      name: 'code-heatmap-session-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
