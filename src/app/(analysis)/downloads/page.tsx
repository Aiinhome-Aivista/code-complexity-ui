"use client";

import React, { useState } from "react";
import {
  Download,
  Code as CodeIcon,
  Description as FileIcon,
  Summarize as ReportIcon,
  CheckCircle,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { commonService } from "@/services/common_apiservice";

export default function DownloadsPage() {
  const [isDownloadingSource, setIsDownloadingSource] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const activeSessionId = useUIStore((state) => state.activeSessionId);
  const user = useAuthStore((state) => state.user);

  const handleDownloadSource = async () => {
    if (!activeSessionId) {
      console.error("No active session ID");
      return;
    }
    if (!user?.id) {
      console.error("No user ID found");
      return;
    }
    setIsDownloadingSource(true);
    try {
      const blob = await commonService.downloadProject(user.id, activeSessionId);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-${activeSessionId}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download project", error);
    } finally {
      setIsDownloadingSource(false);
    }
  };

  const handleDownloadReport = (type: "pdf" | "json") => {
    setDownloadingReport(type);
    // Simulate API call
    setTimeout(() => {
      console.log(`Downloading ${type} report...`);
      setDownloadingReport(null);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-100 dark:bg-neutral-950">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Downloads
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Access updated project files, comprehensive reports, and analysis data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Project Source Card */}
        <Card className="lg:col-span-2 bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className=" text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <CodeIcon className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                  Project Source Code
                </CardTitle>
                <CardDescription className="text-neutral-600 dark:text-neutral-400">
                  Download the complete codebase including all applied AI fixes and refactoring.
                </CardDescription>
              </div>
              <Badge variant="outline" className=" bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                Latest Version
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-300 dark:border-neutral-800 text-sm mb-2">
              <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-300 mb-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Included in this package:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 list-disc text-neutral-700 dark:text-neutral-400">
                <li>Optimized source files</li>
                <li>Refactored components</li>
                <li>Updated configuration files</li>
                <li>Documentation & README</li>
              </ul>
            </div>

            <Button
              onClick={handleDownloadSource}
              disabled={isDownloadingSource || !activeSessionId || !user?.id}
              className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-800 text-neutral-100 shadow-sm font-medium h-11 px-6 min-w-[200px]"
            >
              {isDownloadingSource ? (
                "Preparing Download..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Download Updated Project (ZIP)
                </>
              )}
            </Button>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}

/* 
        <Card className=" bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ReportIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              Analysis Reports
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Export detailed analysis results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 border border-neutral-300 dark:border-neutral-800 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">PDF Report</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={downloadingReport === "pdf"}
                  onClick={() => handleDownloadReport("pdf")}
                  className="text-neutral-600 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 hover:bg-neutral-200"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */