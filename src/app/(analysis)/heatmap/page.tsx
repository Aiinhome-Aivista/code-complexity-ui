"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MetricType, HeatmapData, heatmapData } from "@/data/mockData";
import {
  ReportProblem as AlertOctagon,
  ArrowForward as ArrowRight,
} from "@mui/icons-material";

interface HeatmapViewProps {
  data: HeatmapData[];
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
}

function HeatmapView({
  data,
  selectedMetric,
  onMetricChange,
}: HeatmapViewProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    file: string;
    value: number;
  } | null>(null);

  const metrics: MetricType[] = [
    "Complexity",
    "Security",
    "Performance",
    "Size",
  ];

  const getMetricValue = (item: HeatmapData, metric: MetricType): number => {
    switch (metric) {
      case "Complexity":
        return item.complexity;
      case "Security":
        return item.security;
      case "Performance":
        return item.performance;
      case "Size":
        return item.size;
      default:
        return 0;
    }
  };

  const getColorForValue = (value: number): string => {
    if (value >= 80) return "bg-red-600";
    if (value >= 60) return "bg-red-500";
    if (value >= 40) return "bg-yellow-500";
    if (value >= 20) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getRiskColor = (level: number) => {
    // Level 0-10
    if (level === 0)
      return "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400";
    if (level < 3)
      return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400";
    if (level < 6)
      return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400";
    if (level < 8)
      return "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400";
    return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400";
  };

  const getSeverityLabel = (value: number): string => {
    if (value >= 80) return "Critical";
    if (value >= 60) return "High";
    if (value >= 40) return "Moderate";
    if (value >= 20) return "Low";
    return "Safe";
  };

  // Mock data for topRisks
  const topRisks = [
    {
      file: "src/components/ComplexComponent.tsx",
      risk: 9,
      details: { churn: "High", complexity: "Very High", coverage: 65 },
    },
    {
      file: "src/utils/LegacyHelper.js",
      risk: 8,
      details: { churn: "Medium", complexity: "High", coverage: 70 },
    },
    {
      file: "src/api/AuthService.ts",
      risk: 7,
      details: { churn: "High", complexity: "Medium", coverage: 80 },
    },
    {
      file: "src/pages/Dashboard.jsx",
      risk: 6,
      details: { churn: "Low", complexity: "Medium", coverage: 90 },
    },
  ];

  const maxLines = Math.max(...data.map((d) => d.lines));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
            Risk Heatmap
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Visualize code cleanup priorities based on complexity and churn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-gray-600 text-neutral-700 hover:bg-neutral-100 bg-neutral-100 "
          >
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Refresh Analysis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Heatmap Visualization */}
        <Card className="lg:col-span-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-neutral-900 dark:text-neutral-100">
                  Project Risk Distribution
                </CardTitle>
                <CardDescription className="text-neutral-500 dark:text-neutral-400">
                  Size represents complexity, color represents churn rate
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Risk Levels
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500 dark:bg-red-500/80"></div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      Critical
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500 dark:bg-orange-500/80"></div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      High
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500 dark:bg-yellow-500/80"></div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      Moderate
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500 dark:bg-green-500/80"></div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      Low
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-950 rounded-lg p-4 grid grid-cols-4 grid-rows-4 gap-1">
              {/* Mock TreeMap Visualization */}
              {[...Array(16)].map((_, i) => {
                const riskLevel = Math.floor(Math.random() * 10);
                const size = Math.floor(Math.random() * 3) + 1;
                return (
                  <div
                    key={i}
                    className={`rounded transition-opacity hover:opacity-80 cursor-pointer ${
                      i % 5 === 0 ? "col-span-2 row-span-2" : ""
                    } ${getRiskColor(riskLevel)}`}
                    title={`File ${i + 1} - Risk Level ${riskLevel}`}
                  ></div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Risk Files */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              Top Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topRisks.map((file, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
              >
                <div className="mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      file.risk >= 8
                        ? "bg-red-500"
                        : file.risk >= 6
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {file.file}
                    </h4>
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {file.details.churn} churn
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900"
                    >
                      {file.details.complexity} complex
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900"
                    >
                      {file.details.coverage}% cvg
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-dashed border-neutral-200 dark:border-neutral-800"
            >
              View All Files
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function HeatmapPage() {
  const [metric, setMetric] = useState<MetricType>("Complexity");

  return (
    <HeatmapView
      data={heatmapData}
      selectedMetric={metric}
      onMetricChange={setMetric}
    />
  );
}
