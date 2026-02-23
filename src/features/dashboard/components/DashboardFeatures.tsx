"use client";

import { Card } from "@/components/ui/Card";
import {
  CloudUpload,
  Code,
  BugReport,
  Schema,
  AutoFixHigh,
  Analytics,
} from "@mui/icons-material";
import Link from "next/link";

const features = [
  {
    title: "Code Analysis",
    description:
      "Deep dive into code complexity, hotspots, and technical debt.",
    icon: <Analytics className="w-5 h-5 text-blue-400" />,
    color: "bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Agentic Analysis",
    description: "Autonomous AI agents for refactoring and security audits.",
    icon: <AutoFixHigh className="w-5 h-5 text-purple-400" />,
    color: "bg-purple-500/10 border-purple-500/20",
  },
  {
    title: "Dependency Mapping",
    description: "Visualize relationships and circular dependencies.",
    icon: <Schema className="w-5 h-5 text-orange-400" />,
    color: "bg-orange-500/10 border-orange-500/20",
  },
  {
    title: "Multiple Formats",
    description:
      "Support for TS, JS, Python, and more with intelligent parsing.",
    icon: <CloudUpload className="w-5 h-5 text-green-400" />,
    color: "bg-green-500/10 border-green-500/20",
  },
];

export function DashboardFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in delay-100">
      {features.map((feature, index) => (
        <div key={index} className="block">
          <Card className="p-2 bg-gray-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition-all duration-300 h-full cursor-default">
            <div className="flex gap-2">
              <div
                className={`w-8 h-8 p-2 flex items-center justify-center ${feature.color}`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-neutral-700 dark:text-neutral-300 font-medium text-sm mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-500 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
