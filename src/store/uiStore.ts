import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fileTree as initialFileTree } from '@/data/mockData';
import type { SessionDataTableItem } from "@/types/common_api_types";

interface UIState {
  isUserMenuOpen: boolean;
  toggleUserMenu: () => void;
  closeUserMenu: () => void;
  openUserMenu: () => void;
  projectResults: any | null;
  setProjectResults: (results: any) => void;
  heatmapData: any | null;
  setHeatmapData: (data: any) => void;
  fileNodeData: any | null;
  setFileNodeData: (data: any) => void;
  selectedFileNode: any | null;
  setSelectedFileNode: (node: any) => void;
  fileTree: any[];
  setFileTree: (tree: any[]) => void;
  activeProjectName: string | null;
  setActiveProjectName: (name: string | null) => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  flowData: any | null;
  setFlowData: (data: any) => void;
  removeIssue: (nodeId: string, issueId: string) => void;
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
      heatmapData: null,
      setHeatmapData: (data) => set({ heatmapData: data }),
      fileNodeData: null,
      setFileNodeData: (data) => set({ fileNodeData: data, selectedFileNode: null }),
      selectedFileNode: null,
      setSelectedFileNode: (node) => set({ selectedFileNode: node }),
      fileTree: initialFileTree,
      setFileTree: (tree) => set({ fileTree: tree }),
      activeProjectName: null,
      setActiveProjectName: (name) => set({ activeProjectName: name }),
      activeSessionId: null,
      setActiveSessionId: (id) => set({ activeSessionId: id }),
      flowData: null,
      setFlowData: (data: any) => set({ flowData: data }),
      removeIssue: (nodeId, issueId) => set((state) => {
        if (!state.fileNodeData?.data?.FileNode) return state;

        const updatedFileNode = JSON.parse(JSON.stringify(state.fileNodeData));
        const findAndRemove = (nodes: any[]) => {
          for (const node of nodes) {
            if (node.id === nodeId) {
              if (node.issues) {
                // Determine the correct index or ID to filter by. 
                // Note: The UI generates custom IDs `api-${index}`. We need to match based on content or assume strict index mapping.
                // However, `issueId` passed from UI is `api-0`. We need to use the original issue data to match or just match by index if possible.
                // Better approach: Since we don't have unique IDs in API response, we filter by properties or index.
                // But wait, the `issueId` in the UI (e.g., `api-0`) corresponds to the index in the `issues` array.
                const index = parseInt(issueId.replace('api-', ''));
                if (!isNaN(index) && node.issues[index]) {
                     // Filter out the issue at that specific index if indices align, 
                     // OR filter by matching content if possible.
                     // Since `api-X` is index-based, we can just remove it.
                     // BUT, if we remove index 0, index 1 becomes 0. So subsequent removals might be tricky if not careful.
                     // For single removal, it's fine.
                     node.issues.splice(index, 1);
                }
              }
              return true;
            }
            if (node.children) {
              if (findAndRemove(node.children)) return true;
            }
          }
          return false;
        };

        findAndRemove(updatedFileNode.data.FileNode);
        
        // Also update selectedFileNode if it matches
        let updatedSelected = state.selectedFileNode;
        if (state.selectedFileNode?.id === nodeId) {
             updatedSelected = JSON.parse(JSON.stringify(state.selectedFileNode));
             const index = parseInt(issueId.replace('api-', ''));
              if (!isNaN(index) && updatedSelected.issues) {
                  updatedSelected.issues.splice(index, 1);
              }
        }

        return { fileNodeData: updatedFileNode, selectedFileNode: updatedSelected };
      }),
    }),
    {
      name: 'code-heatmap-storage-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
