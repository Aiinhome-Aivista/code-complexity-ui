"use client";

import {
  AccessTime as Timer,
  Bolt as Zap,
  Description as FileText,
  ErrorOutline as AlertCircle,
  TrendingUp,
  Storage as HardDrive,
  Layers,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RiskLevel, performanceData } from "@/data/mockData";

interface PerformanceData {
  buildTimeRisk: RiskLevel;
  responseTimeRisk: RiskLevel;
  largestFiles: Array<{
    name: string;
    size: string;
    lines: number;
    risk: RiskLevel;
  }>;
  godFunctions: Array<{
    name: string;
    file: string;
    lines: number;
    complexity: number;
  }>;
  projectSize: {
    totalFiles: number;
    totalLines: number;
    avgFileSize: string;
  };
}

interface PerformanceViewProps {
  data: PerformanceData;
}

export function PerformanceView({ data }: PerformanceViewProps) {
  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
      case "moderate":
        return (
          <Badge
            variant="outline"
            className="border-yellow-700 text-yellow-600 dark:text-yellow-400"
          >
            Moderate
          </Badge>
        );
      case "safe":
        return (
          <Badge
            variant="outline"
            className="border-green-700 text-green-600 dark:text-green-400"
          >
            Safe
          </Badge>
        );
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "high":
        return "text-red-500";
      case "moderate":
        return "text-yellow-500";
      case "safe":
        return "text-green-500";
    }
  };

  // Mock data for missing properties
  const largeFiles = [
    { name: "bundle.js", path: "dist/assets", size: "1.2 MB" },
    { name: "vendors.js", path: "dist/assets", size: "850 KB" },
    { name: "main.css", path: "dist/styles", size: "420 KB" },
    { name: "dashboard.tsx", path: "src/pages", size: "120 KB" },
    { name: "chart.js", path: "src/components", size: "90 KB" },
  ];

  const godFunctions = [
    {
      name: "processUserData",
      file: "src/utils/userHelpers.ts",
      line: 45,
      complexity: 45,
      issues: ["Too many parameters"],
    },
    {
      name: "renderDashboard",
      file: "src/pages/Dashboard.tsx",
      line: 120,
      complexity: 32,
      issues: ["Deep nesting"],
    },
    {
      name: "calculateMetrics",
      file: "src/services/analytics.ts",
      line: 15,
      complexity: 28,
      issues: ["Cognitive complexity"],
    },
    {
      name: "updateState",
      file: "src/store/reducer.ts",
      line: 88,
      complexity: 25,
      issues: [],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
            Performance & Resources
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Build performance, bundle usage, and code efficiency metrics
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Build Time",
            value: "3.4s",
            icon: Timer,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
          {
            label: "Bundle Size",
            value: "142 KB",
            icon: HardDrive,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
          },
          {
            label: "Total Files",
            value: "284",
            icon: Layers,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
          },
          {
            label: "Issues",
            value: "12",
            icon: Zap,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20",
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-mono text-neutral-900 dark:text-neutral-100">
                    {item.value}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {item.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Largest Files Table */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">
              Largest Files
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-neutral-400">
              Files contributing most to bundle size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {largeFiles.map((file, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 w-4">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                        {file.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {file.path}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-neutral-900 dark:text-neutral-200">
                      {file.size}
                    </div>
                    <div className="w-24 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(parseFloat(file.size) / 500) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* God Functions */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">
              Complex Functions
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-neutral-400">
              Functions with high cyclomatic complexity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {godFunctions.map((func, i) => (
                <div
                  key={i}
                  className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-sm text-neutral-900 dark:text-neutral-200">
                      {func.name}
                    </div>
                    <Badge
                      variant="outline"
                      className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
                    >
                      Score: {func.complexity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    <span>Line {func.line}</span>
                    <span className="truncate max-w-[150px]">{func.file}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {func.issues.map((issue, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3 text-orange-400" />
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Size Summary */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-neutral-100">
            Project Size Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-mono text-neutral-900 dark:text-neutral-100">
                {data.projectSize.totalFiles}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Total Files
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-mono text-neutral-900 dark:text-neutral-100">
                {data.projectSize.totalLines.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Total Lines
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-mono text-neutral-900 dark:text-neutral-100">
                {data.projectSize.avgFileSize}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Avg File Size
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PerformancePage() {
  return <PerformanceView data={performanceData} />;
}
