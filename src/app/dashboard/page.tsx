"use client";

import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardFeatures } from "@/features/dashboard/components/DashboardFeatures";
import { RecentSessionsTable } from "@/features/dashboard/components/RecentSessionsTable";
import { UploadModal } from "@/components/upload/UploadModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    <div className="p-6 space-y-8 animate-fade-in min-h-full bg-gray-100 dark:bg-neutral-900 border-l border-neutral-200/50">
      <DashboardFeatures />
      <DashboardHero />
      <RecentSessionsTable refreshTrigger={refreshKey} />
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
