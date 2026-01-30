"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  ExpandMore,
  InsertDriveFileOutlined,
  Folder,
  FilterList,
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { filterTree } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useRouter } from "next/navigation";

type RiskLevel = "safe" | "moderate" | "high" | "critical" | "low";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  risk: RiskLevel;
  children?: FileNode[];
  path: string;
  lines?: number;
  isPublic?: boolean;
  hasUnvalidatedInputs?: boolean;
  found_at?: string;
  issues?: any[];
}

export default function Sidebar() {
  const fileNodeData = useUIStore((state) => state.fileNodeData);
  const selectedFileNode = useUIStore((state) => state.selectedFileNode);
  const setSelectedFileNode = useUIStore((state) => state.setSelectedFileNode);
  const router = useRouter();

  // Transform API data to FileNode structure
  const fileTree = useMemo(() => {
    if (!fileNodeData?.data?.FileNode) return [];

    const sortNodes = (a: FileNode, b: FileNode) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "folder" ? -1 : 1;
    };

    const transformNode = (node: any): FileNode => {
      const children = node.children?.map(transformNode);

      if (children) {
        children.sort(sortNodes);
      }

      return {
        id: node.id,
        name: node.name,
        type: node.type,
        risk: node.risk?.toLowerCase() as RiskLevel,
        children: children,
        path: node.path,
        lines: node.lines,
        found_at: node.found_at,
        issues: node.issues,
      };
    };

    const nodes = fileNodeData.data.FileNode.map(transformNode);
    return nodes.sort(sortNodes);
  }, [fileNodeData]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  // State for collapsible filters
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    highRiskOnly: false,
    publicEndpoints: false,
    unvalidatedInputs: false,
    largeFiles: false,
  });

  const filterOptions = [
    { id: "high-risk", key: "highRiskOnly", label: "High risk only" },
    { id: "public-endpoints", key: "publicEndpoints", label: "Public endpoints" },
    { id: "unvalidated", key: "unvalidatedInputs", label: "Unvalidated inputs" },
    { id: "large-files", key: "largeFiles", label: "Large files (>500 lines)" },
  ];

  const filteredFileTree = useMemo(() => {
    return filterTree(fileTree, filters);
  }, [fileTree, filters]);

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "safe":
      case "low":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFileNode?.id === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-indigo-100 transition-colors ${
            isSelected ? "bg-indigo-200 dark:bg-indigo-900/30" : ""
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id);
            } else {
              setSelectedFileNode(node);
              // Update URL and navigate
              const params = new URLSearchParams(window.location.search);
              params.set("file", node.name);
              router.push(`/code-view?${params.toString()}`);
            }
          }}
        >
          {node.type === "folder" && (
            <span className="text-neutral-400 flex items-center">
              {isExpanded ? (
                <ExpandMore sx={{ fontSize: 16 }} />
              ) : (
                <ChevronRight sx={{ fontSize: 16 }} />
              )}
            </span>
          )}
          {node.type === "folder" ? (
            <Folder sx={{ fontSize: 16 }} className="text-indigo-400" />
          ) : (
            <InsertDriveFileOutlined
              sx={{ fontSize: 16 }}
              className="text-neutral-500"
            />
          )}
          <span className="text-sm text-neutral-700 flex-1">{node.name}</span>
          <div
            className={`w-2 h-2 rounded-full ${getRiskColor(node.risk)}`}
            title={`${node.risk} risk`}
          />
          {node.type === "file" && node.lines && (
            <span className="text-xs text-neutral-500 font-mono">
              {node.lines}L
            </span>
          )}
        </div>
        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 border-r border-neutral-200 bg-gray-200 flex flex-col h-full transition-colors duration-300">
      {/* Collapsible Filters Header */}
      <div className="border-b border-neutral-200">
        <div
          className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-neutral-100 transition-colors select-none"
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
        >
          <span className="text-neutral-400 flex items-center">
            {isFiltersExpanded ? (
              <ExpandMore sx={{ fontSize: 16 }} />
            ) : (
              <ChevronRight sx={{ fontSize: 16 }} />
            )}
          </span>
          <FilterList sx={{ fontSize: 16 }} className="text-neutral-400" />
          <span className="text-sm text-neutral-600 font-medium">Filters</span>
        </div>

        {/* Filter Options (Hidden when collapsed) */}
        {isFiltersExpanded && (
          <div className="px-4 pb-4 space-y-2 pl-9 border border-transparent">
            {filterOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  id={option.id}
                  checked={filters[option.key as keyof typeof filters]}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, [option.key]: checked as boolean })
                  }
                  className={`${
                    filters[option.key as keyof typeof filters]
                      ? "bg-indigo-500 border-indigo-500"
                      : "bg-gray-200"
                  }`}
                />
                <Label
                  htmlFor={option.id}
                  className="text-xs text-neutral-500 cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-2 border-b border-neutral-200 flex-shrink-0">
        <span className="text-xs text-neutral-500 uppercase tracking-wider">
          Project Files
        </span>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="py-2">
          {!fileNodeData ? (
            <div className="px-4 space-y-3">
              <div className="flex items-center gap-2 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-medium text-indigo-600 animate-pulse">
                  Analyzing project structure...
                </span>
              </div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton
                    variant="rectangular"
                    width={16}
                    height={16}
                    sx={{ bgcolor: "grey.300", borderRadius: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    sx={{ bgcolor: "grey.300" }}
                  />
                </div>
              ))}
            </div>
          ) : filteredFileTree.length === 0 ? (
            <div className="px-4 py-8 text-center text-neutral-400 text-sm">
              No files found
            </div>
          ) : (
            filteredFileTree?.map((node) => renderFileNode(node))
          )}
        </div>
      </div>
    </div>
  );
}
