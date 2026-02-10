"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@mui/material";
import { ContentCopy as Copy, CheckCircle } from "@mui/icons-material";

type MetricType = "complexity" | "security" | "performance" | "size";

interface FileData {
  filename: string;
  lines: number;
  reason: string;
  risk: number;
  risk_level: string;
  solution: string;
  suggested_code: string;
}

interface MetricCategory {
  files: FileData[];
  legend: Record<string, string>;
}

interface MetricsData {
  complexity?: MetricCategory;
  performance?: MetricCategory;
  security?: MetricCategory;
  size?: MetricCategory;
}

interface HeatmapResponse {
  data: {
    metrics: MetricsData;
  };
  isSuccess: boolean;
  message: string;
  statuscode: number;
}



interface HeatmapViewProps {
  files: FileData[];
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy code"}>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
      >
        {copied ? (
          <CheckCircle sx={{ fontSize: 12 }} className="text-green-600" />
        ) : (
          <Copy sx={{ fontSize: 12 }} className="text-neutral-500" />
        )}
      </Button>
    </Tooltip>
  );
}

function HeatmapView({
  files,
  selectedMetric,
  onMetricChange,
}: HeatmapViewProps) {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string | null>(null);

  const metrics: { id: MetricType; label: string }[] = [
    { id: "complexity", label: "Complexity" },
    { id: "performance", label: "Performance" },
    { id: "security", label: "Security" },
    { id: "size", label: "Size" },
  ];

  const getRiskColor = (value: number) => {
    if (value >= 80) return "bg-red-600 dark:bg-red-600";
    if (value >= 60) return "bg-red-500 dark:bg-red-500";
    if (value >= 40) return "bg-orange-500 dark:bg-orange-500";
    if (value >= 20) return "bg-yellow-500 dark:bg-yellow-500";
    return "bg-emerald-500 dark:bg-emerald-500";
  };

  const legendItems = [
    { label: "Safe (0-19)", value: "safe", color: "bg-emerald-500" },
    { label: "Low (20-39)", value: "low", color: "bg-yellow-500" },
    { label: "Moderate (40-59)", value: "moderate", color: "bg-orange-500" },
    { label: "High (60-79)", value: "high", color: "bg-red-500" },
    { label: "Critical (80-100)", value: "critical", color: "bg-red-600" },
  ];

  const filteredData = selectedRiskFilter
    ? files.filter((item) => item.risk_level === selectedRiskFilter)
    : files;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-100 dark:bg-neutral-950">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Visual representation of risk distribution across files by metric
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex p-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 w-fit">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onMetricChange(m.id);
                setSelectedFile(null); // Reset selection on metric change
              }}
              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${selectedMetric === m.id
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-neutral-300 dark:border-neutral-800 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex justify-between items-center">
          Risk Level Legend
          {selectedRiskFilter && (
            <button
              onClick={() => setSelectedRiskFilter(null)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </h3>
        <div className="flex flex-wrap gap-4">
          {legendItems.map((item) => {
            const isSelected = selectedRiskFilter === item.value;
            const isDimmed = selectedRiskFilter && !isSelected;

            return (
              <button
                key={item.label}
                onClick={() => setSelectedRiskFilter(isSelected ? null : item.value)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${isSelected
                  ? "bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-neutral-300 dark:ring-neutral-700"
                  : "hover:bg-gray-300/50 dark:hover:bg-neutral-800/50"
                  } ${isDimmed ? "opacity-40 grayscale" : "opacity-100"}`}
              >
                <div className={`w-5 h-5 rounded ${item.color} shadow-sm`} />
                <span className={`text-sm font-medium ${isSelected ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* File List / Heatmap Bars */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-300 dark:border-neutral-800 shadow-sm space-y-2">
        {Array.isArray(filteredData) && filteredData.length > 0 ? (
          filteredData.map((file, index) => {
            const value = file.risk;
            const colorClass = getRiskColor(value);
            const isSelected = selectedFile?.filename === file.filename;

            return (
              <div key={index} className="space-y-2">
                <div
                  onClick={() => setSelectedFile(selectedFile?.filename === file.filename ? null : file)}
                  className={`space-y-1.5 p-3 rounded-lg cursor-pointer transition-all duration-200 border ${isSelected
                    ? "bg-white dark:bg-neutral-800 border-indigo-500 ring-1 ring-indigo-500"
                    : "hover:bg-gray-300/50 dark:hover:bg-neutral-800 border-transparent"
                    }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                      {file.filename}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-500">
                      {file.lines} lines
                    </span>
                  </div>

                  <div className="h-8 w-full bg-neutral-300 dark:bg-neutral-800 rounded-md overflow-hidden relative">
                    <div
                      className={`h-full ${colorClass} transition-all duration-500 ease-out flex items-center px-3`}
                      style={{ width: `${value}%` }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow-sm">
                        {value}%
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="bg-gray-100 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-300 dark:border-neutral-700 mx-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                          Analysis Details
                          {file.risk_level && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full capitalize border ${file.risk_level === "safe"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : file.risk_level === "low"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : file.risk_level === "moderate"
                                    ? "bg-orange-100 text-orange-800 border-orange-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                                }`}
                            >
                              {file.risk_level}
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Reason
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-800">
                        {file.reason || "No detailed analysis available."}
                      </p>
                    </div>

                    {file.solution && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Solution
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-800">
                          {file.solution}
                        </p>
                      </div>
                    )}

                    {file.suggested_code && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            Suggested Code
                          </h4>
                          <CopyButton text={file.suggested_code} />
                        </div>
                        <div className="relative bg-neutral-900 rounded-md overflow-hidden border border-neutral-800">
                          <pre className="p-3 text-xs text-neutral-300 font-mono overflow-x-auto">
                            <code>{file.suggested_code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No heatmap data available for this metric.
          </div>
        )}
      </div>
    </div>
  );
}

import { useUIStore } from "@/store/uiStore";
import { Skeleton } from "@mui/material";

export default function HeatmapPage() {
  const [metric, setMetric] = useState<MetricType>("complexity");
  const heatmapData = useUIStore((state) => state.heatmapData);
  const metricsData = heatmapData?.data?.metrics;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state or check against store hydration
    // Since persist middleware is async in some environments, or just to show the loader if data is missing
    if (metricsData) {
      setIsLoading(false);
    } else {
      // If no data, we might be loading or just have no data. 
      // For this task, if we assume data *should* be there or will be fetched:
      const timer = setTimeout(() => setIsLoading(false), 1000); // Optional: smooth transition
      return () => clearTimeout(timer);
    }
  }, [metricsData]);

  // Simplify: The store might be empty initially. If we are in a session, we expect data.
  // If we just check !metricsData, it will show loader until data arrives.

  if (!metricsData) {
    return (
      <div className="h-full min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50 dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span className="text-lg font-medium text-indigo-600 animate-pulse">
            Generating Heatmap...
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

  const currentFiles = metricsData?.[metric]?.files || [];

  return (
    <HeatmapView
      files={currentFiles}
      selectedMetric={metric}
      onMetricChange={setMetric}
    />
  );
}
