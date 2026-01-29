"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  ExpandMore,
  InsertDriveFileOutlined,
  Folder,
  FilterList,
} from "@mui/icons-material";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { filterTree } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";

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
          className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-indigo-50 transition-colors ${
            isSelected ? "bg-indigo-100 dark:bg-indigo-900/30" : ""
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id);
            } else {
              setSelectedFileNode(node);
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
    <div className="w-80 border-r border-neutral-200 bg-gray-100 flex flex-col h-full transition-colors duration-300">
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
            {/* Filter inputs ... same structure, removed checks for simplicity in this snippet if not changing logic */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="high-risk"
                checked={filters.highRiskOnly}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, highRiskOnly: checked as boolean })
                }
              />
              <Label
                htmlFor="high-risk"
                className="text-xs text-neutral-500 cursor-pointer"
              >
                High risk only
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="public-endpoints"
                checked={filters.publicEndpoints}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    publicEndpoints: checked as boolean,
                  })
                }
              />
              <Label
                htmlFor="public-endpoints"
                className="text-xs text-neutral-500 cursor-pointer"
              >
                Public endpoints
              </Label>
            </div>
            {/* ... other filters ... */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="unvalidated"
                checked={filters.unvalidatedInputs}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    unvalidatedInputs: checked as boolean,
                  })
                }
              />
              <Label
                htmlFor="unvalidated"
                className="text-xs text-neutral-500 cursor-pointer"
              >
                Unvalidated inputs
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="large-files"
                checked={filters.largeFiles}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, largeFiles: checked as boolean })
                }
              />
              <Label
                htmlFor="large-files"
                className="text-xs text-neutral-500 cursor-pointer"
              >
                Large files (&gt;500 lines)
              </Label>
            </div>
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
          {filteredFileTree?.map((node) => renderFileNode(node))}
        </div>
      </div>
    </div>
  );
}
