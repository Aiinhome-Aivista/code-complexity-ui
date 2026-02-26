"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  ExpandMore,
  Folder,
  FilterList,
  MenuOpen,
  Menu,
} from "@mui/icons-material";
import { Skeleton, Tooltip, IconButton } from "@mui/material";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { filterTree } from "@/lib/utils";
import { FileIcon } from "@/components/ui/FileIcon";
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
  const addOpenFile = useUIStore((state) => state.addOpenFile);
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

  // State for collapsible filters and sidebar
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    highRiskOnly: false,
    publicEndpoints: false,
    unvalidatedInputs: false,
    largeFiles: false,
    minLines: 500,
  });

  const filterOptions = [
    { id: "public-endpoints", key: "publicEndpoints", label: "Public endpoints" },
    { id: "unvalidated", key: "unvalidatedInputs", label: "Unvalidated inputs" },
    { id: "large-files", key: "largeFiles", label: "Large files" },
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


  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFileNode?.id === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-indigo-100 transition-colors ${isSelected ? "bg-indigo-200 dark:bg-indigo-900/30" : ""
            }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id);
            } else {
              addOpenFile(node);
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
            <Folder sx={{ fontSize: 16 }} className="text-indigo-400 dark:text-indigo-500" />
          ) : (
            <FileIcon
              fileName={node.name}
              className="mr-1"
            />
          )}
          <span className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">{node.name}</span>

          {node.type === "file" && typeof node.lines === "number" && (
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
    <div
      className={`border-r border-neutral-200 bg-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out relative ${isSidebarExpanded ? "w-80" : "w-12 bg-gray-100"
        }`}
    >
      {/* Sidebar Toggle Button */}
      <div className={`flex items-center p-2 border-b border-neutral-200 h-10 ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
        {isSidebarExpanded && (
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2">
            Explorer
          </span>
        )}
        <Tooltip title={isSidebarExpanded ? "Collapse Explorer" : "Expand Explorer"} placement="right">
          <IconButton
            size="small"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-neutral-500 hover:text-indigo-600 transition-colors"
          >
            {isSidebarExpanded ? <MenuOpen sx={{ fontSize: 18 }} /> : <Menu sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      </div>

      {isSidebarExpanded && (
        <>
          {/* Collapsible Filters Header */}
          <div className="border-b border-neutral-200 flex-shrink-0">
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
                  <div key={option.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={option.id}
                        checked={filters[option.key as keyof typeof filters] as boolean}
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, [option.key]: checked as boolean })
                        }
                        className={`${filters[option.key as keyof typeof filters]
                          ? "bg-indigo-500 border-indigo-500"
                          : "bg-gray-200"
                          }`}
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-xs text-neutral-500 cursor-pointer flex-1"
                      >
                        {option.id === "large-files" ? `${option.label} (>${filters.minLines} lines)` : option.label}
                      </Label>
                    </div>
                    {option.id === "large-files" && filters.largeFiles && (
                      <div className="pl-6 pt-1 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                        <span className="text-xs text-neutral-500">Min lines:</span>
                        <input
                          type="number"
                          min="1"
                          className="w-20 text-xs px-2 py-1 rounded border border-neutral-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          value={filters.minLines}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setFilters({ ...filters, minLines: val > 0 ? val : 0 });
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
        </>
      )}
    </div>
  );
}
