"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  Warning as AlertTriangle,
  Shield,
  Bolt as Zap,
  ContentCopy as Copy,
  Close as X,
  ChevronLeft,
  ChevronRight,
  FactCheck,
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Issue, codeExample, issuesForFile } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useUIStore } from "@/store/uiStore";
import { Snackbar, Alert, Skeleton, Tooltip } from "@mui/material";

interface FileCodeViewProps {
  code: string;
  issues: Issue[];
  fileName: string;
  onIgnore: (id: string) => void;
  onCopy: (issue: Issue) => void;
}

export function FileCodeView({
  code,
  issues,
  fileName,
  onIgnore,
  onCopy,
}: FileCodeViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const codeLines = code.split("\n");

  const getIssueIcon = (type: Issue["type"]) => {
    switch (type) {
      case "security":
        return <Shield sx={{ fontSize: 16 }} className="text-red-500" />;
      case "validation":
        return (
          <AlertTriangle sx={{ fontSize: 16 }} className="text-yellow-500" />
        );
      case "performance":
        return <Zap sx={{ fontSize: 16 }} className="text-orange-500" />;
      default:
        return (
          <AlertTriangle sx={{ fontSize: 16 }} className="text-neutral-500" />
        );
    }
  };

  const getIssueBgColor = (severity: Issue["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-50 dark:bg-red-950/30 border-l-red-500";
      case "moderate":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-l-yellow-500";
      case "safe":
        return "bg-green-50 dark:bg-green-950/30 border-l-green-500";
    }
  };

  const issuesByLine = issues.reduce(
    (acc, issue) => {
      if (!acc[issue.line]) {
        acc[issue.line] = [];
      }
      acc[issue.line].push(issue);
      return acc;
    },
    {} as Record<number, Issue[]>,
  );

  return (
    <div className="flex h-full">
      {/* Left Panel - Code Editor */}
      <div className="flex-1 border-r border-neutral-400 dark:border-neutral-700 flex flex-col min-w-0">
        <div className="h-12 border-b border-neutral-400 dark:border-neutral-700 px-4 flex items-center justify-between bg-gray-200 dark:bg-neutral-900">
          <span className="text-sm text-neutral-700 dark:text-neutral-300 font-mono">
            {fileName}
          </span>
          <Badge
            variant="outline"
            className="text-xs bg-gray-100 border-neutral-200 text-neutral-600 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {issues.length} issues
          </Badge>
        </div>
        <ScrollArea className="flex-1 bg-gray-300/60">
          <div className="p-4 font-mono text-sm">
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const lineIssues = issuesByLine[lineNumber];
              const hasIssue = lineIssues && lineIssues.length > 0;

              return (
                <div
                  key={lineNumber}
                  className={`flex gap-4 ${hasIssue ? "bg-red-50/50" : ""
                    } hover:bg-neutral-100 dark:hover:bg-neutral-900/50`}
                >
                  <div className="w-12 text-right text-neutral-400 dark:text-neutral-600 select-none flex-shrink-0">
                    {lineNumber}
                  </div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {hasIssue && (
                      <div className="flex-shrink-0">
                        {getIssueIcon(lineIssues[0].type)}
                      </div>
                    )}
                    <pre className="flex-1 whitespace-pre-wrap break-words">
                      <code className="text-neutral-900 dark:text-neutral-200">
                        {line}
                      </code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Issue Details */}
      <div
        className={`bg-gray-200 dark:bg-neutral-900 flex flex-col flex-shrink-0 border-l border-neutral-300 dark:border-neutral-700 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[50px]" : "w-[420px]"
          }`}
      >
        <div className="h-12 border-b border-neutral-300 dark:border-neutral-700 px-2 flex items-center justify-between bg-gray-200 dark:bg-neutral-900 overflow-hidden">
          {!isCollapsed && (
            <span className="text-sm text-neutral-900 dark:text-neutral-300 ml-2 whitespace-nowrap">
              Issue Details
            </span>
          )}
          <Tooltip title={isCollapsed ? "Open Issue Details" : "Close Issue Details"}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-400/20"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </Tooltip>
        </div>
        <ScrollArea className={`flex-1 ${isCollapsed ? "hidden" : "block"}`}>
          {issues.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60 hover:opacity-100 transition-opacity min-h-[400px]">
              <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <FactCheck sx={{ fontSize: 48 }} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                0 Issues Found
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed">
                We've analyzed this file and couldn't find any issues. Looks good!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {issues.map((issue) => (
                <Card
                  key={issue.id}
                  className={`${getIssueBgColor(
                    issue.severity,
                  )} border-l-4 border-t-0 border-r-0 border-b-0 rounded-l-none bg-gray-200 dark:bg-neutral-800 shadow-sm`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{getIssueIcon(issue.type)}</div>
                        <div>
                          <CardTitle className="text-sm text-neutral-900 dark:text-neutral-100 mb-1 leading-tight">
                            {issue.message}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge
                              variant={
                                issue.severity === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={`text-[10px] h-5 px-1.5 ${issue.severity === "safe"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : ""
                                }`}
                            >
                              {issue.severity}
                            </Badge>
                            <span className="text-xs text-neutral-500">
                              Line {issue.line}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {/* Facts */}
                    {issue.facts && issue.facts.length > 0 && (
                      <div>
                        <h4 className="text-[10px] text-neutral-500 mb-1.5 uppercase tracking-wider font-semibold">
                          Facts
                        </h4>
                        <ul className="space-y-1">
                          {issue.facts.map((fact, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-neutral-600 dark:text-neutral-400 flex gap-2"
                            >
                              <span className="text-neutral-400 dark:text-neutral-600">
                                •
                              </span>
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Rule */}
                    <div>
                      <h4 className="text-[10px] text-neutral-500 mb-1 uppercase tracking-wider font-semibold">
                        Rule Triggered
                      </h4>
                      <code className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded font-mono border border-blue-200 dark:border-blue-900/50">
                        {issue.rule}
                      </code>
                    </div>

                    {/* Confidence */}
                    <div>
                      <h4 className="text-[10px] text-neutral-500 mb-1 uppercase tracking-wider font-semibold">
                        Confidence
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${issue.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                          {issue.confidence}%
                        </span>
                      </div>
                    </div>

                    {/* AI Explanation */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                          Suggested Explanation
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 px-1 border-purple-200 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/10"
                        >
                          AI
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-gray-300 dark:bg-neutral-900/50 p-2.5 rounded border border-neutral-300 dark:border-neutral-800/50">
                        {issue.explanation}
                      </p>
                    </div>

                    {/* Original Snippet */}
                    {issue.original_snippet && (
                      <div className="mt-3">
                        <h4 className="text-[10px] text-neutral-500 mb-1 uppercase tracking-wider font-semibold">
                          Current Code
                        </h4>
                        <pre className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/10 p-2 rounded border border-red-200 dark:border-red-900/30 whitespace-pre-wrap break-all font-mono">
                          <code>{issue.original_snippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Suggested Fix */}
                    {issue.suggested_fix && (
                      <div className="mt-3">
                        <h4 className="text-[10px] text-neutral-500 mb-1 uppercase tracking-wider font-semibold">
                          Suggested Fix
                        </h4>
                        <pre className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/10 p-2 rounded border border-green-200 dark:border-green-900/30 whitespace-pre-wrap break-all font-mono">
                          <code>{issue.suggested_fix}</code>
                        </pre>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs bg-gray-700 hover:bg-gray-800 text-gray-100 border-none cursor-pointer"
                        onClick={() => onCopy(issue)}
                      >
                        <Copy sx={{ fontSize: 14 }} className="mr-1.5" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs bg-gray-400 hover:bg-gray-500 text-gray-900 border-none cursor-pointer"
                        onClick={() => onIgnore(issue.id)}
                      >
                        <X sx={{ fontSize: 14 }} className="mr-1.5" />
                        Ignore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default function CodeViewPage() {
  const fileNodeData = useUIStore((state) => state.fileNodeData);
  const selectedFileNode = useUIStore((state) => state.selectedFileNode);
  const setSelectedFileNode = useUIStore((state) => state.setSelectedFileNode);

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
          setSelectedFileNode(targetNode);
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

  useEffect(() => {
    /* console.log("CodeView File Node Data:", fileNodeData);
    console.log("Selected File Node:", selectedFileNode); */

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
    }
  }, [fileNodeData, selectedFileNode]);

  const handleIgnore = (id: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  const handleCopy = (issue: Issue) => {
    let textToCopy = `Issue: ${issue.message}\nSeverity: ${issue.severity}\nLine: ${issue.line}\nRule: ${issue.rule}\nExplanation: ${issue.explanation}`;
    if (issue.original_snippet) textToCopy += `\nSnippet: ${issue.original_snippet}`;
    if (issue.suggested_fix) textToCopy += `\nFix: ${issue.suggested_fix}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log("Copied to clipboard");
      setToast({
        open: true,
        message: "Copied to clipboard",
        severity: "success",
      });
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Loading State (No file data)
  if (!fileNodeData) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4 bg-gray-50 dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span className="text-lg font-medium text-indigo-600 animate-pulse">
            Analyzing project...
          </span>
        </div>
        <div className="space-y-2 w-64">
          <Skeleton
            variant="text"
            sx={{ bgcolor: "grey.300", fontSize: "1rem" }}
          />
          <Skeleton
            variant="text"
            sx={{ bgcolor: "grey.300", fontSize: "0.8rem" }}
          />
        </div>
      </div>
    );
  }

  // Empty Data State
  if (!fileNodeData.data?.FileNode || fileNodeData.data.FileNode.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-gray-100 dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800">
        <Card className="max-w-md w-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-inner">
              <AlertTriangle
                sx={{ fontSize: 32 }}
                className="text-neutral-400 dark:text-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                No Analysable Files
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                We couldn't find any supported files to analyze in this project.
                This might be due to file exclusions or an unsupported project structure.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard" passHref>
                <Button variant="outline" className="gap-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 shadow-sm">
                  <ArrowForward sx={{ fontSize: 16 }} className="rotate-180" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="h-full overflow-hidden">
      <FileCodeView
        code={code}
        issues={issues}
        fileName={selectedFileNode?.name || "No File Selected"}
        onIgnore={handleIgnore}
        onCopy={handleCopy}
      />
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          zIndex: 10,
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
