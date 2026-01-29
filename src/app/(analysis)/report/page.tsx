"use client";

import React, { useState } from "react";
import {
  Download,
  ContentCopy as Copy,
  Refresh as RefreshCw,
  CheckCircle as CheckCircle2,
  Cancel as XCircle,
  ErrorOutline as AlertCircle,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ExperienceLevel } from "@/data/mockData";

interface ReportViewProps {
  experienceLevel: ExperienceLevel;
  onExperienceLevelChange: (level: ExperienceLevel) => void;
  onReRunAnalysis: () => void;
}

export function ReportView({
  experienceLevel,
  onExperienceLevelChange,
  onReRunAnalysis,
}: ReportViewProps) {
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeSuggestions, setIncludeSuggestions] = useState(true);

  const handleDownloadPDF = () => {
    console.log("Downloading PDF report...");
  };

  const handleDownloadJSON = () => {
    console.log("Downloading JSON report...");
  };

  const handleCopyExplanations = () => {
    console.log("Copying AI explanations...");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
          Report Generation
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Create and export comprehensive code health reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-neutral-100">
                Report Configuration
              </CardTitle>
              <CardDescription className="text-neutral-500 dark:text-neutral-400">
                Customize what to include
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charts"
                    checked={includeCharts}
                    onCheckedChange={(checked: boolean) =>
                      setIncludeCharts(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="charts"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Include Visualization Charts
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metrics"
                    checked={includeMetrics}
                    onCheckedChange={(checked: boolean) =>
                      setIncludeMetrics(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="metrics"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Include Detailed Metrics
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="suggestions"
                    checked={includeSuggestions}
                    onCheckedChange={(checked: boolean) =>
                      setIncludeSuggestions(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="suggestions"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Include AI Suggestions
                  </Label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Label className="text-neutral-700 dark:text-neutral-300 mb-2 block">
                  Target Audience (Experience Level)
                </Label>
                <Select
                  value={experienceLevel}
                  onValueChange={(val) =>
                    onExperienceLevelChange(val as ExperienceLevel)
                  }
                >
                  <SelectTrigger className="w-full bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                    <SelectItem
                      value="Junior"
                      className="text-neutral-900 dark:text-neutral-100 focus:bg-neutral-100 dark:focus:bg-neutral-800"
                    >
                      Junior (Detailed explanations)
                    </SelectItem>
                    <SelectItem
                      value="Mid"
                      className="text-neutral-900 dark:text-neutral-100 focus:bg-neutral-100 dark:focus:bg-neutral-800"
                    >
                      Mid (Standard terminology)
                    </SelectItem>
                    <SelectItem
                      value="Senior"
                      className="text-neutral-900 dark:text-neutral-100 focus:bg-neutral-100 dark:focus:bg-neutral-800"
                    >
                      Senior (High-level summary)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  onClick={onReRunAnalysis}
                  variant="outline"
                  className="w-full border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-run Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-neutral-100">
                Analysis Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Analysis Date:</span>
                  <span className="text-neutral-100 font-mono">
                    2026-01-12 14:32:15
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Experience Level:</span>
                  <span className="text-neutral-100">{experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Issues:</span>
                  <span className="text-neutral-100 font-mono">36</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Files Analyzed:</span>
                  <span className="text-neutral-100 font-mono">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Duration:</span>
                  <span className="text-neutral-100 font-mono">2.3s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Confidence:</span>
                  <span className="text-neutral-100 font-mono">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions & Preview */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-neutral-100">
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleDownloadPDF}
                  className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download  sx={{ fontSize: 24 }} />
                  <span>Download PDF Report</span>
                  <span className="text-xs text-blue-100 opacity-80">
                    Complete analysis with charts
                  </span>
                </Button>
                <Button
                  onClick={handleDownloadJSON}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <Copy sx={{ fontSize: 24 }} />
                  <span>Export as JSON</span>
                  <span className="text-xs text-neutral-500">
                    Raw data for external tools
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-neutral-900 dark:text-neutral-100">
                AI Explanation Preview
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyExplanations}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg font-mono text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                  <InfoOutlined className="w-4 h-4" />
                  <span className="font-semibold">Executive Summary</span>
                </div>
                <p className="leading-relaxed">
                  The codebase shows strong structural integrity with a 85/100
                  overall score. However, there are 3 critical security
                  vulnerabilities detected in the authentication module that
                  require immediate attention. The cyclomatic complexity in
                  core/utils.ts is higher than recommended (15), suggesting a
                  need for refactoring.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs">
                    3 Critical Issues
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs">
                    5 Warnings
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-neutral-100">
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  {
                    date: "2024-01-10",
                    type: "Full Analysis",
                    size: "2.4 MB",
                  },
                  {
                    date: "2024-01-08",
                    type: "Security Scan",
                    size: "1.1 MB",
                  },
                  {
                    date: "2024-01-05",
                    type: "Performance Audit",
                    size: "1.8 MB",
                  },
                ].map((report, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                        <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                          {report.type}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {report.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">
                      {report.size}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("Mid");

  const handleReRun = () => {
    console.log("Rerunning analysis with level:", experienceLevel);
  };

  return (
    <ReportView
      experienceLevel={experienceLevel}
      onExperienceLevelChange={(val: string) =>
        setExperienceLevel(val as ExperienceLevel)
      }
      onReRunAnalysis={handleReRun}
    />
  );
}
