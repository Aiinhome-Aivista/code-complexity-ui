"use client";

import { useEffect, useState } from "react";

import {
  ArrowForward,
  Warning as AlertTriangle,
  Shield,
  Bolt as Zap,
} from "@mui/icons-material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

// Mock Data
const mockProjectHealth = {
  overallScore: 85,
  ratings: {
    readability: 4.5,
    modularity: 4.0,
    security: 4.8,
    reliability: 4.2,
    performance: 3.8,
    sizeHealth: 4.5,
  },
  warnings: {
    publicEndpoints: 3,
    missingValidation: 5,
    performanceRisks: 2,
  },
};

import { useUIStore } from "@/store/uiStore";
import { Skeleton } from "@mui/material";

export default function CodeHealthAnalysis() {
  const projectResults = useUIStore((state) => state.projectResults);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Derive currentHealth from store data
  const results = projectResults;
  const currentHealth = results?.codeHealth || mockProjectHealth;
  const overallScoreVal = currentHealth.overallScore;
  const overallScore = typeof overallScoreVal === 'object' && overallScoreVal !== null ? overallScoreVal.score : overallScoreVal;

  const ratings = currentHealth.ratings;
  const insights = results?.insights || [];

  // Loading Logic
  // If projectResults is null, we assume we are loading or haven't selected a project yet.
  if (!projectResults) {
    return (
      <div className="h-full min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50 dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span className="text-lg font-medium text-indigo-600 animate-pulse">
            Analyzing Code Health...
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(prev => prev === metric ? null : metric);
  };

  // Helper to get color class based on score
  const getRatingColorClass = (value: number) => {
    if (value >= 4.5)
      return {
        bg: "bg-emerald-50 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        indicator: "bg-emerald-400",
      };
    if (value >= 3.5)
      return {
        bg: "bg-blue-50 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800",
        indicator: "bg-blue-400",
      };
    if (value >= 2.5)
      return {
        bg: "bg-amber-50 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        indicator: "bg-amber-400",
      };
    return {
      bg: "bg-red-50 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      indicator: "bg-red-400",
    };
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-100 dark:bg-neutral-950">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Overview of code quality, security, and performance metrics
      </p>

      {/* Main Score Card */}
      <Card className="px-0 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-sm">
        <CardContent className="flex flex-col items-center gap-6 pt-6 px-0">
          {/* Ratings Chips */}
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {Object.entries(ratings || {}).map(([key, data]: [string, any]) => {
              // Handle both mock structure (value) and real structure (score)
              const value = typeof data === "number" ? data : data.score;
              const styles = getRatingColorClass(value);
              const isSelected = selectedMetric === key;

              const labelMap: Record<string, string> = {
                readability: "Readability",
                modularity: "Modularity",
                security: "Security",
                reliability: "Reliability",
                performance: "Performance",
                sizeHealth: "Size Health",
              };

              return (
                <div
                  key={key}
                  onClick={() => handleMetricClick(key)}
                  className={`flex items-center gap-2 mx-1 rounded-full border px-5 py-2 shadow-sm transition-all cursor-pointer 
                    ${styles.bg} ${styles.text} ${styles.border}
                    ${isSelected ? "ring-2 ring-offset-1 ring-neutral-400 dark:ring-neutral-600 scale-104" : "hover:scale-104 opacity-90 hover:opacity-100"}
                  `}
                >
                  <span className="text-sm font-semibold">
                    {labelMap[key] || key}
                  </span>
                  <div
                    className={`h-4 w-px opacity-30 ${styles.indicator.replace("bg-", "bg-current ")}`}
                  />
                  <span className="font-mono font-bold text-sm">
                    {value.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="relative flex flex-col items-center justify-center py-4">
            {/* Overall Score Chip */}
            <div
              onClick={() => handleMetricClick("OVERALL")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 shadow-sm bg-white dark:bg-black/20 cursor-pointer transition-transform hover:scale-105
                ${selectedMetric === "OVERALL" ? "ring-1 ring-offset-1 ring-neutral-200" : ""}
                ${overallScore >= 80
                  ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                  : overallScore >= 60
                    ? "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                    : "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                }`}
            >
              <span className="text-md font-bold uppercase tracking-wide opacity-80">
                Overall Score
              </span>
              <div className="h-5 bg-current opacity-20" />
              <span className="text-3xl font-mono font-bold tracking-tighter">
                {overallScore}
              </span>
            </div>

            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 max-w-sm text-center font-medium">
              {overallScore >= 80 && "Excellent code quality"}
              {overallScore >= 60 && overallScore < 80 && "Good, with room for improvement"}
              {overallScore < 60 && "Requires attention"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Detail Section */}
      <div className="transition-all duration-300 ease-in-out">
        <h2 className="text-lg text-neutral-900 dark:text-neutral-100 mb-4 font-semibold capitalize">
          {!selectedMetric
            ? "Key Insights"
            : selectedMetric === "OVERALL"
              ? "Overall Analysis"
              : `${selectedMetric} Details`}
        </h2>

        {!selectedMetric ? (
          /* Default View: Key Insights */
          <Card className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-sm">
            <CardContent className="px-3 py-4 [&:last-child]:pb-4 space-y-4">
              {/* ... Existing Insights Logic ... */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Key Insights
                  </h3>
                  {insights.length > 0 ? (
                    <ul className="space-y-3">
                      {insights.map((insight: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <span className="select-none text-blue-500">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-500 italic">No specific insights available.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : selectedMetric === "OVERALL" ? (
          <Card className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-indigo-500" />
                  Analysis Summary
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {(typeof currentHealth.overallScore === 'object' && currentHealth.overallScore?.reason)
                    ? currentHealth.overallScore.reason
                    : "No detailed analysis available for the overall score."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {(() => {
              const metricData = ratings[selectedMetric];
              // Handle mock vs real structure
              // Real: { score, reason, impact, suggestion, affected_files }
              // Mock: just a number value

              if (typeof metricData === "number") {
                return (
                  <Card className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800">
                    <CardContent className="p-6 text-center text-neutral-500">
                      Detailed breakdown not available for mock data.
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Suggestion & Reason */}
                  <Card className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 md:col-span-2">
                    <CardContent className="p-3 space-y-4 [&:last-child]:pb-3">
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Reason
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {metricData.reason}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          Impact
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {metricData.impact}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-500" />
                          Suggestion
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {metricData.suggestion}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Affected Files */}
                  <Card className="bg-white gap-2 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 md:col-span-2">
                    <CardHeader className="p-3 pb-1 border-b border-neutral-100 dark:border-neutral-800/50">
                      <CardTitle className="text-sm pb-0 font-semibold flex items-center gap-1">
                        Affected Files
                        <Badge
                          variant="secondary"
                          className="px-1.5 py-0 text-[10px] h-5 min-w-4 text-center"
                        >
                          {metricData.affected_files?.length || 0}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pb-0">
                      {metricData.affected_files &&
                        metricData.affected_files.length > 0 ? (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {metricData.affected_files.map(
                            (file: string, idx: number) => (
                              <div
                                key={idx}
                                className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 font-mono flex items-center gap-2 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                              >
                                <span className="opacity-50 text-xs">
                                  {idx + 1}.
                                </span>
                                {file}
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-sm text-neutral-500 italic">
                          No specific files identified.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* View Details Button */}
      <div className="flex justify-center pt-2">
        <Link
          href="/heatmap"
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 px-4 py-2 rounded-md transition-all duration-300 text-xs font-semibold cursor-pointer shadow-sm hover:shadow-md hover:scale-105"
        >
          View Detailed Analysis
          <ArrowForward className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
