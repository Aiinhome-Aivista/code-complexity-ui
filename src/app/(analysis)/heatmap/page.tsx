"use client";

import { useState, useEffect } from "react";

type MetricType = "Complexity" | "Security" | "Reliability" | "Performance" | "Size";

interface HeatmapData {
  file: string;
  lines: number;
  complexity: number;
  security: number;
  performance: number;
  size: number;
  reason?: string;
  riskLevel?: string;
}


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
  const [selectedFile, setSelectedFile] = useState<HeatmapData | null>(null);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string | null>(null);

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
    ? data.filter((item) => item.riskLevel === selectedRiskFilter)
    : data;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-100 dark:bg-neutral-950">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
            Code Risk Heatmap
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Visual representation of risk distribution across files
          </p>
        </div>

        {/* Metric Selection Tabs */}
        {/* <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Metric:
          </span>
          <div className="flex gap-2">
            {metrics.map((metric) => (
              <button
                key={metric}
                onClick={() => onMetricChange(metric)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedMetric === metric
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700"
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
        </div> */}
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
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  isSelected 
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
            const value = getMetricValue(file, selectedMetric);
            const colorClass = getRiskColor(value);
            const isSelected = selectedFile?.file === file.file;

            return (
              <div key={index} className="space-y-2">
                <div
                  onClick={() => setSelectedFile(selectedFile?.file === file.file ? null : file)}
                  className={`space-y-1.5 p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? "bg-white dark:bg-neutral-800 border-indigo-500 ring-1 ring-indigo-500"
                      : "hover:bg-gray-300/50 dark:hover:bg-neutral-800 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                      {file.file}
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
                          {file.riskLevel && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full capitalize border ${
                                file.riskLevel === "safe"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : file.riskLevel === "low"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : file.riskLevel === "moderate"
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }`}
                            >
                              {file.riskLevel}
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

export default function HeatmapPage() {
  const [metric, setMetric] = useState<MetricType>("Complexity");
  const [data, setData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    const storageData = localStorage.getItem("code-heatmap-storage-v1");
    if (storageData) {
      try {
        const parsed = JSON.parse(storageData);
        if (parsed.state && parsed.state.heatmapData) {
          const loadedData = parsed.state.heatmapData;
         /*  console.log("Heatmap data from localStorage:", loadedData); */
          
          let files: any[] = [];
          
          // Handle various response structures
          if (loadedData.data && Array.isArray(loadedData.data.files)) {
            files = loadedData.data.files;
          } else if (loadedData.files && Array.isArray(loadedData.files)) {
            files = loadedData.files;
          } else if (Array.isArray(loadedData)) {
            files = loadedData;
          }

          if (files.length > 0) {
            const transformedData: HeatmapData[] = files.map((f: any) => ({
              file: f.filename,
              lines: f.lines,
              complexity: f.risk,
              security: f.risk,
              performance: f.risk,
              size: f.risk,
              reason: f.reason,
              riskLevel: f.risk_level,
            }));
            
            setData(transformedData);
          } else {
             console.warn("Could not find files array in heatmap data:", loadedData);
          }
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  return (
    <HeatmapView
      data={data}
      selectedMetric={metric}
      onMetricChange={setMetric}
    />
  );
}
