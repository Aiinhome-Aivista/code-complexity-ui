import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fileTree as initialFileTree } from '@/data/mockData';

interface UIState {
  isUserMenuOpen: boolean;
  toggleUserMenu: () => void;
  closeUserMenu: () => void;
  openUserMenu: () => void;
  projectResults: any | null;
  setProjectResults: (results: any) => void;
  fileTree: any[];
  setFileTree: (tree: any[]) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isUserMenuOpen: false,
      toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
      closeUserMenu: () => set({ isUserMenuOpen: false }),
      openUserMenu: () => set({ isUserMenuOpen: true }),
      projectResults: null,
      setProjectResults: (results) => set({ projectResults: results }),
      fileTree: initialFileTree,
      setFileTree: (tree) => set({ fileTree: tree }),
    }),
    {
      name: 'code-heatmap-storage-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
