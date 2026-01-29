"use client";

import {
  Warning as AlertTriangle,
  Shield,
  Bolt as Zap,
  ContentCopy as Copy,
  Close as X,
} from "@mui/icons-material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Issue, codeExample, issuesForFile } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/ScrollArea";

interface FileCodeViewProps {
  code: string;
  issues: Issue[];
  fileName: string;
}

export function FileCodeView({ code, issues, fileName }: FileCodeViewProps) {
  const codeLines = code.split("\n");

  const getIssueIcon = (type: Issue["type"]) => {
    switch (type) {
      case "security":
        return <Shield sx={{ fontSize: 16 }} className="text-red-500" />;
      case "validation":
        return <AlertTriangle sx={{ fontSize: 16 }} className="text-yellow-500" />;
      case "performance":
        return <Zap sx={{ fontSize: 16 }} className="text-orange-500" />;
      default:
        return <AlertTriangle sx={{ fontSize: 16 }} className="text-neutral-500" />;
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
      <div className="flex-1 border-r border-neutral-200 dark:border-neutral-800 flex flex-col min-w-0">
        <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between bg-white dark:bg-neutral-950">
          <span className="text-sm text-neutral-700 dark:text-neutral-300 font-mono">{fileName}</span>
          <Badge
            variant="outline"
            className="text-xs border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
          >
            {issues.length} issues
          </Badge>
        </div>
        <ScrollArea className="flex-1 bg-neutral-50 dark:bg-neutral-950">
          <div className="p-4 font-mono text-sm">
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const lineIssues = issuesByLine[lineNumber];
              const hasIssue = lineIssues && lineIssues.length > 0;

              return (
                <div
                  key={lineNumber}
                  className={`flex gap-4 ${
                    hasIssue ? "bg-red-50 dark:bg-red-950/20" : ""
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
                    <pre className="flex-1 overflow-x-auto">
                      <code className="text-neutral-800 dark:text-neutral-300">{line}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Issue Details */}
      <div className="w-[420px] bg-white dark:bg-neutral-950 flex flex-col flex-shrink-0 border-l border-neutral-200 dark:border-neutral-800">
        <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center bg-white dark:bg-neutral-950">
          <span className="text-sm text-neutral-900 dark:text-neutral-300">Issue Details</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {issues.map((issue) => (
              <Card
                key={issue.id}
                className={`${getIssueBgColor(
                  issue.severity
                )} border-l-4 border-t-0 border-r-0 border-b-0 rounded-l-none`}
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
                            className="text-[10px] h-5 px-1.5"
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
                          <span className="text-neutral-400 dark:text-neutral-600">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

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
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-900/50 p-2.5 rounded border border-neutral-200 dark:border-neutral-800/50">
                      {issue.explanation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                    >
                      <Copy sx={{ fontSize: 14 }} className="mr-1.5" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-7 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                    >
                      <X sx={{ fontSize: 14 }} className="mr-1.5" />
                      Ignore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function CodeViewPage() {
  return (
    <div className="h-full overflow-hidden">
      <FileCodeView
        code={codeExample}
        issues={issuesForFile}
        fileName="src/api/users.ts"
      />
    </div>
  );
}
