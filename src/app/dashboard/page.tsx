"use client";

import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardFeatures } from "@/features/dashboard/components/DashboardFeatures";
import { RecentSessionsTable } from "@/features/dashboard/components/RecentSessionsTable";
import { RecentActivityList } from "@/features/dashboard/components/RecentActivityList";
import { UploadModal } from "@/components/upload/UploadModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { Card } from "@/components/ui/Card";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { setProjectResults, setHeatmapData, setFileNodeData, setFlowData } = useUIStore();

  useEffect(() => {
    // Clear previous analysis data when entering dashboard
    setProjectResults(null);
    setHeatmapData(null);
    setFileNodeData(null);
    setFlowData(null);
    // Explicitly clear storage to ensure no ghost data remains
    localStorage.removeItem("code-heatmap-storage-v1");
  }, [setProjectResults, setHeatmapData, setFileNodeData, setFlowData]);

  useEffect(() => {
    setIsUploadModalOpen(searchParams.get("analysis") === "agentic");
  }, [searchParams]);

  const handleOpenChange = (open: boolean) => {
    setIsUploadModalOpen(open);
    if (!open) {
      router.push("/dashboard", { scroll: false });
    } else {
      router.push("/dashboard?analysis=agentic", { scroll: false });
    }
  };

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6 min-h-full bg-gray-100 border-l border-neutral-200/50 animate-fade-in flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-9">
        {/* Left Column - ~75% */}
        <div className="lg:col-span-9 flex flex-col gap-9">
          <Card className="p-6 bg-gray-200 border-neutral-200 shadow-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <DashboardHero />
          </Card>

          <DashboardFeatures />
        </div>

        {/* Right Column - ~25% */}
        <div className="lg:col-span-3 h-full">
          <Card className="p-6 h-full bg-gray-200 border-neutral-200 shadow-sm">
            <RecentActivityList />
          </Card>
        </div>
      </div>

      {/* Full Width Table */}
      <div id="recent-sessions-table">
        <RecentSessionsTable refreshTrigger={refreshKey} />
      </div>

      <UploadModal
        open={isUploadModalOpen}
        onOpenChange={handleOpenChange}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
