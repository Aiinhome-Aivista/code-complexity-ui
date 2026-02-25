import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileNode } from "@/data/mockData";

export type FilterState = {
  highRiskOnly: boolean;
  publicEndpoints: boolean;
  unvalidatedInputs: boolean;
  largeFiles: boolean;
  minLines?: number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterFileTree(
  nodes: FileNode[],
  filters: FilterState
): FileNode[] {
  return nodes
    .map((node) => {
      // If it's a folder, recursively filter children
      if (node.type === "folder" && node.children) {
        const filteredChildren = filterFileTree(node.children, filters);
        // If folder has matching children, keep the folder (with filtered children)
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        // If folder matches criteria itself (e.g. risk), keep it but with empty children?
        // Usually we only keep folders if they have content relevant to the filter.
        // But if the folder itself is "High Risk", maybe we show it?
        // For navigation, usually we show path to the matching file.
        // Let's stick to: Keep folder if children match OR if folder itself matches (though usually files are the targets).
        // Simplest: Keep folder only if children match.
        // However, we also check the node itself below.
      }

      // Check criteria for the current node (file or folder)
      let matches = true;

      // High Risk matches 'high' risk
      if (filters.highRiskOnly && node.risk !== "high") {
        matches = false;
      }

      // Large Files - configurable via minLines
      if (filters.largeFiles) {
        if (node.type === "file") {
          if (node.lines === undefined || node.lines <= (filters.minLines ?? 500)) {
            matches = false;
          }
        }
      }

      // Public Endpoints & Unvalidated Inputs
      // These require extra metadata not currently on FileNode.
      // For now, we'll placeholder this or strictly filtered by what we have.
      // If the user wants these, we'd need to map paths to endpoints.
      // Given the "mockData" structure, we don't have a direct link on the node.
      // We will skip these checks for now to avoid breaking, or implement if data allows.
      // But looking at mock structure, we can't easily check these without the extra lists.
      // So we will only filter if we can verify.

      // For the purpose of this task with current data:
      // We'll leave these as pass-through or todo.

      if (node.type === "folder") {
        // For folders, if they have children (after recursion above), we keep them.
        // The recursion logic is a bit tricky with map/filter.
        // Let's retry the recursion strategy.
        return null; // logic handled below via proper recursion structure
      }

      return matches ? node : null;
    })
    .filter(Boolean) as FileNode[]; // This simple map/filter doesn't handle the "Keep folder if child matches" perfectly if we return null for folder above.
}

// Correct Recursive Implementation
export function filterTree(nodes: FileNode[], filters: FilterState): FileNode[] {
  return nodes.reduce((acc: FileNode[], node) => {
    // 1. Check if the node itself matches the filters (for files)
    const matchesSelf = checkNodeMatches(node, filters);

    // 2. If it's a folder, process children
    if (node.type === "folder" && node.children) {
      const filteredChildren = filterTree(node.children, filters);

      // Keep folder if it has matching children OR if it matches itself (if we want to support matching empty folders)
      // Usually for "High Risk", a folder might be high risk? Mock data shows folders have risk.
      // So if folder is high risk, we might want to show it. 
      // But usually user wants to see *files* inside.
      // Let's assume: Show folder if it has matching children.
      if (filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      } else if (matchesSelf && node.children.length === 0) {
        // If folder matches (e.g. high risk) but has no matching children (maybe empty or children filtered out)
        // Do we keep it? Let's say yes for "High Risk" folders.
        acc.push({ ...node, children: [] });
      }
    } else {
      // It's a file (or empty folder without children property)
      if (matchesSelf) {
        acc.push(node);
      }
    }

    return acc;
  }, []);
}

function checkNodeMatches(node: FileNode, filters: FilterState): boolean {
  if (filters.highRiskOnly && node.risk !== "high" && node.risk !== "critical") return false;

  if (filters.largeFiles && node.type === "file") {
    if (node.lines === undefined) return false;
    if (node.lines <= (filters.minLines ?? 500)) return false;
  }

  if (filters.publicEndpoints && !node.isPublic) {
    return false;
  }

  if (filters.unvalidatedInputs && !node.hasUnvalidatedInputs) {
    return false;
  }

  return true;
}
