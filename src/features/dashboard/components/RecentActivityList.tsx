import React, { useEffect, useState } from "react";
import { commonService } from "@/services/common_apiservice";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import type { SessionDataTableItem } from "@/types/common_api_types";
import { Skeleton } from "@mui/material";
import {
  History,
  AssessmentOutlined,
  Check,
  Error as ErrorIcon,
  Pending,
} from "@mui/icons-material";
import { Button } from "@/components/ui/Button";

export const RecentActivityList = () => {
  const { user } = useAuthStore();
  const { sessions, isSessionsLoading } = useUIStore();

  const activities = sessions.slice(0, 5);
  const loading = isSessionsLoading;

  const handleViewAll = () => {
    const tableElement = document.getElementById("recent-sessions-table");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "completed" || s === "done")
      return <Check className="w-4 h-4 text-gray-500" />;
    if (s === "failed") return <ErrorIcon className="w-4 h-4 text-red-500" />;
    return <Pending className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-400/70">
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <History fontSize="small" className="text-gray-600" />
          Recent Activity
        </h3>
        <span
          onClick={handleViewAll}
          className="text-xs text-neutral-500 cursor-pointer hover:text-indigo-600 transition-colors"
        >
          View All
        </span>
      </div>

      {loading ? (
        <div className="divide-y divide-gray-500/60">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1">
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="divide-y divide-gray-400/70">
          {activities.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3 group">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600 shrink-0 border border-gray-400/70">
                <AssessmentOutlined
                  className="text-gray-700"
                  sx={{ fontSize: 16 }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800 truncat transition-colors">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-neutral-400">
                    {item.created_at || "Recent"}
                  </span>
                  <span className="text-[10px] text-neutral-300">•</span>
                  <span className="text-[10px] text-neutral-500 truncate">
                    {/* {item.files_analyzed} */} file's
                  </span>
                </div>
              </div>
              {getStatusIcon(item.code_health_status)}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-neutral-500 text-sm">
          No recent activity found.
        </div>
      )}
    </div>
  );
};
