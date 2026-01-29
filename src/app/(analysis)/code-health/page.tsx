"use client";

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

export default function CodeHealthAnalysis() {
  const { overallScore, ratings, warnings } = mockProjectHealth;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return {
      fullStars,
      hasHalfStar,
      emptyStars: 5 - fullStars - (hasHalfStar ? 1 : 0),
    };
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const { fullStars, hasHalfStar, emptyStars } = getRatingStars(rating);
    return (
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <div key={`full-${i}`} className="w-3 h-3 bg-yellow-500 rounded-sm" />
        ))}
        {hasHalfStar && <div className="w-3 h-3 bg-yellow-500/50 rounded-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-3 h-3 bg-neutral-200 dark:bg-neutral-800 rounded-sm"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
          Code Health Analysis
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Overview of code quality, security, and performance metrics
        </p>
      </div>

      {/* Overall Score */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-neutral-100 text-lg">
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className={`text-6xl font-mono ${getScoreColor(overallScore)}`}
            >
              {overallScore}
            </div>
            <div className="text-neutral-500 dark:text-neutral-400 text-sm">
              <div>Out of 100</div>
              <div className="mt-1">
                {overallScore >= 80 && "Excellent code quality"}
                {overallScore >= 60 &&
                  overallScore < 80 &&
                  "Good with room for improvement"}
                {overallScore < 60 && "Needs attention"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Readability", value: ratings.readability },
          { label: "Modularity", value: ratings.modularity },
          { label: "Security", value: ratings.security },
          { label: "Reliability", value: ratings.reliability },
          { label: "Performance", value: ratings.performance },
          { label: "Size Health", value: ratings.sizeHealth },
        ].map((item) => (
          <Card key={item.label} className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-neutral-100 text-sm">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <StarRating rating={item.value} />
                <span className="text-neutral-500 dark:text-neutral-400 font-mono text-sm">
                  {item.value.toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warnings */}
      <div>
        <h2 className="text-lg text-neutral-900 dark:text-neutral-100 mb-4 font-semibold">
          Active Warnings
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-neutral-900 dark:text-neutral-100 font-medium">
                      Public Endpoints
                    </h3>
                    <Badge
                      variant="destructive"
                      className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/70"
                    >
                      {warnings.publicEndpoints} found
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Multiple API endpoints are publicly accessible without
                    authentication
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-neutral-900 dark:text-neutral-100 font-medium">
                      Missing Validation
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/50"
                    >
                      {warnings.missingValidation} endpoints
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Input parameters lack proper validation and sanitization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-neutral-900 dark:text-neutral-100 font-medium">
                      Performance Risks
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900/50"
                    >
                      {warnings.performanceRisks} issues
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Blocking operations and inefficient code patterns detected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Details Button */}
      <div className="flex justify-center pt-2">
        <Link
          href="/heatmap"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium cursor-pointer shadow-sm hover:shadow"
        >
          View Detailed Analysis
          <ArrowForward className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
