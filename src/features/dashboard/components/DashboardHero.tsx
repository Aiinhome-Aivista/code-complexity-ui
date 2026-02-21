"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";

export function DashboardHero() {
  return (
    <div className="relative flex justify-start text-start overflow-hidden rounded-2xl  px-6 mb-8 text-gray-800 animate-fade-in">
      <div className="relative">
        <h1 className="text-6xl font-bold tracking-tight  mb-2">
          Intelligent Code Analysis Tool
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-4 leading-relaxed max-w-2xl">
          Upload your codebase to get AI-powered insights about complexity,
          security vulnerabilities, and potential optimizations with our
          advanced heatmap engine.
        </p>
        <div className="flex flex-wrap justify-start gap-4">
          <Link href="?analysis=agentic" scroll={false}>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-[length:200%_auto] hover:bg-right text-white font-bold px-5 py-2.5 h-auto text-sm transition-all duration-500 ease-in-out cursor-pointer"
            >
              Upload Project
              <ArrowForward className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
