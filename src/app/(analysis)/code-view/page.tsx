"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { commonService } from "@/services/common_apiservice";
import { useAuthStore } from "@/store/authStore";
import { CodeViewer } from "@/features/code-view/CodeViewer";
import { Issue } from "@/data/mockData";

export default function CodeViewPage() {
  const fileNodeData = useUIStore((state) => state.fileNodeData);
  const selectedFileNode = useUIStore((state) => state.selectedFileNode);
  const addOpenFile = useUIStore((state) => state.addOpenFile);
  const activeSessionId = useUIStore((state) => state.activeSessionId);
  const openFiles = useUIStore((state) => state.openFiles);
  const { user } = useAuthStore();

  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file");

  // Sync URL -> State
  useEffect(() => {
    if (fileParam && fileNodeData?.data?.FileNode) {
      if (!selectedFileNode || selectedFileNode.name !== fileParam) {
        // Deep search for node
        const findNode = (nodes: any[]): any => {
          for (const node of nodes) {
            if (node.name === fileParam && node.type === "file") return node;
            if (node.children) {
              const found = findNode(node.children);
              if (found) return found;
            }
          }
          return null;
        };

        const targetNode = findNode(fileNodeData.data.FileNode);
        if (targetNode) {
          addOpenFile(targetNode);
        }
      }
    }
  }, [fileParam, fileNodeData]);

  const [code, setCode] = useState<string>("// Select a file to view code");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [exitingIssueIds, setExitingIssueIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedFileNode && selectedFileNode.found_at) {
      setLoading(true);
      // Fetch code content
      fetch(selectedFileNode.found_at)
        .then((res) => res.text())
        .then((text) => setCode(text))
        .catch((err) => {
          console.error("Error fetching code:", err);
          setCode("// Error loading file content.");
        })
        .finally(() => setLoading(false));

      // Transform issues
      if (selectedFileNode.issues) {
        const uniqueIssues = new Map<string, Issue>();
        selectedFileNode.issues.forEach((apiIssue: any, index: number) => {
          const key = `${apiIssue.line}-${apiIssue.title}`;
          if (!uniqueIssues.has(key)) {
            uniqueIssues.set(key, {
              id: `api-${index}`,
              type: (apiIssue.type?.toLowerCase() as any) || "complexity",
              severity:
                apiIssue.severity?.toLowerCase() === "high" ||
                  apiIssue.severity?.toLowerCase() === "critical"
                  ? "high"
                  : apiIssue.severity?.toLowerCase() === "medium"
                    ? "moderate"
                    : apiIssue.severity?.toLowerCase() === "low"
                      ? "safe"
                      : "moderate",
              line: apiIssue.line,
              message: apiIssue.title,
              rule: apiIssue.title,
              confidence: 100,
              explanation: apiIssue.suggested_explanation,
              original_snippet: apiIssue.original_snippet,
              suggested_fix: apiIssue.suggested_fix,
              facts: [],
            });
          }
        });
        setIssues(Array.from(uniqueIssues.values()));
      } else {
        setIssues([]);
      }
    } else {
      setCode("// Select a file to view code");
      setIssues([]);
    }
  }, [fileNodeData, selectedFileNode]);

  const handleIgnore = (id: string) => {
    setExitingIssueIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setIssues((prev) => prev.filter((issue) => issue.id !== id));
      setExitingIssueIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 500);
  };

  const handleApplyFix = async (issue: Issue) => {
    if (!issue.suggested_fix) {
      setToast({
        open: true,
        message: "No fix available to apply",
        severity: "error",
      });
      return;
    }

    if (!activeSessionId || !user) {
      setToast({
        open: true,
        message: "Session or User information missing. Please return to dashboard.",
        severity: "error",
      });
      return;
    }

    try {
      const payload = {
        user_id: user.id,
        session_id: activeSessionId,
        // Use filename preferrably, fallback to path (stripping leading slash if needed)
        filename: selectedFileNode?.filename || (selectedFileNode?.path?.startsWith('/') ? selectedFileNode?.path.slice(1) : selectedFileNode?.path),
        original_snippet: issue.original_snippet,
        suggested_fix: issue.suggested_fix
      };

      const response = await commonService.applyFix(payload);

      if (response && response.isSuccess) {
        setToast({
          open: true,
          message: "Fix applied successfully!",
          severity: "success",
        });

        handleIgnore(issue.id);
      } else {
        setToast({
          open: true,
          message: response?.message || "Failed to apply fix",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error applying fix:", error);
      setToast({
        open: true,
        message: "An error occurred while applying the fix",
        severity: "error",
      });
    }
  };

  return (
    <div className="flex-1 bg-gray-100 dark:bg-neutral-950 flex flex-col h-full border-l border-neutral-200 dark:border-neutral-800 overflow-hidden relative">
      {(!fileNodeData) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-950 z-10">
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900/40 rounded-full animate-pulse blur-[2px]" />
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 text-indigo-600 bg-indigo-50 dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-inner">
                  <span className="font-bold text-xs">CQ</span>
                </div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                Analyzing Codebase
              </h3>
              <p className="text-sm text-neutral-500 max-w-[250px]">
                We are scanning your project structure and identifying secure optimizations...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative min-h-0">
        {!selectedFileNode ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3 opacity-60">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                Select a file to view code
              </h3>
              <p className="text-sm text-neutral-500 max-w-[280px]">
                Choose a file from the explorer sidebar to view its contents, issues, and AI suggestions.
              </p>
            </div>
          </div>
        ) : (
          <CodeViewer
            code={code}
            issues={issues}
            fileName={selectedFileNode.name}
            onIgnore={handleIgnore}
            onApplyFix={handleApplyFix}
            exitingIssueIds={exitingIssueIds}
          />
        )}
      </div>
    </div>
  );
}
