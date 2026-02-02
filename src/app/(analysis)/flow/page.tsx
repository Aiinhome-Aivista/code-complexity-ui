"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useUIStore } from "@/store/uiStore";
import {
  Storage as Database,
  Description as FileCode,
  Inventory2 as Box,
  Settings,
  OpenInNew as ExternalLink,
  Search,
} from "@mui/icons-material";
import { Input } from "@/components/ui/Input";

export interface FlowNode {
  id: string;
  name: string;
  type: "file" | "folder" | "table";
  category: "component" | "api" | "util" | "model" | "config";
  fields?: Array<{ name: string; type: string }>;
  dependencies?: string[]; // IDs of nodes this depends on
  x: number;
  y: number;
}

interface FlowViewProps {
  nodes: FlowNode[];
}

export function FlowView({ nodes }: FlowViewProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  const getCategoryColor = (category: FlowNode["category"]) => {
    switch (category) {
      case "model":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-700",
          text: "text-blue-600 dark:text-blue-400",
          accent: "bg-blue-600",
        };
      case "api":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-700",
          text: "text-green-600 dark:text-green-400",
          accent: "bg-green-600",
        };
      case "component":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-200 dark:border-purple-700",
          text: "text-purple-600 dark:text-purple-400",
          accent: "bg-purple-600",
        };
      case "util":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-700",
          text: "text-yellow-600 dark:text-yellow-400",
          accent: "bg-yellow-600",
        };
      case "config":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-700",
          text: "text-orange-600 dark:text-orange-400",
          accent: "bg-orange-600",
        };
      default:
        // Fallback for unknown categories
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-200 dark:border-gray-700",
          text: "text-gray-600 dark:text-gray-400",
          accent: "bg-gray-600",
        };
    }
  };

  const getNodeIcon = (node: FlowNode) => {
    if (node.type === "table") return <Database sx={{ fontSize: 16 }} />;
    if (node.category === "component") return <Box sx={{ fontSize: 16 }} />;
    if (node.category === "util") return <Settings sx={{ fontSize: 16 }} />;
    return <FileCode sx={{ fontSize: 16 }} />;
  };

  const filteredNodes = nodes.filter((node) =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate connection paths
  const getConnectionPath = (from: FlowNode, to: FlowNode): string => {
    const fromX = from.x + 140; // Right edge of source node
    const fromY = from.y + 70; // Middle of source node
    const toX = to.x; // Left edge of target node
    const toY = to.y + 70; // Middle of target node

    const midX = (fromX + toX) / 2;

    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  };

  const isNodeHighlighted = (nodeId: string): boolean => {
    const targetId = hoveredNode || selectedNode;

    if (!targetId) return false;

    const targetNode = nodes.find((n) => n.id === targetId);

    if (!targetNode) return false;

    // Highlight the hovered/selected node
    if (nodeId === targetId) return true;

    // Highlight dependencies
    if (targetNode.dependencies?.includes(nodeId)) return true;

    // Highlight dependents
    const isDependent = nodes.some(
      (n) => n.id === nodeId && n.dependencies?.includes(targetId),
    );

    return isDependent;
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-950">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
              Folder Structure Flow
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Visualize file dependencies and relationships
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-600"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Models</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-600"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">API</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-600"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Components</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-600"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Utils</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
             <Search sx={{ fontSize: 16 }} />
          </div>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files and folders..."
            className="pl-10 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 overflow-auto relative bg-neutral-50 dark:bg-neutral-950">
        <div
          className="absolute inset-0"
          style={{ minWidth: "1600px", minHeight: "800px" }}
        >
          {/* SVG for connection lines */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#888888" />
              </marker>
              <marker
                id="arrowhead-highlight"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
            </defs>
            {filteredNodes.map((node) => {
              if (!node.dependencies) return null;
              return node.dependencies.map((depId) => {
                const depNode = nodes.find((n) => n.id === depId);
                // IF depNode is not found, skip (can happen if API returns broken ref)
                if (!depNode) return null;

                const isHighlighted =
                  isNodeHighlighted(node.id) || isNodeHighlighted(depId);

                return (
                  <path
                    key={`${node.id}-${depId}`}
                    d={getConnectionPath(depNode, node)}
                    stroke={isHighlighted ? "#3b82f6" : "#888888"}
                    strokeWidth={isHighlighted ? "2" : "1.5"}
                    fill="none"
                    markerEnd={
                      isHighlighted
                        ? "url(#arrowhead-highlight)"
                        : "url(#arrowhead)"
                    }
                    className="transition-all duration-200 dark:opacity-60"
                    opacity={isHighlighted ? 1 : 0.3}
                  />
                );
              });
            })}
          </svg>

          {/* Nodes */}
          <div className="relative" style={{ zIndex: 1 }}>
            {filteredNodes.map((node) => {
              const colors = getCategoryColor(node.category);
              const isHighlighted = isNodeHighlighted(node.id);
              const isActive =
                selectedNode === node.id || hoveredNode === node.id;

              return (
                <div
                  key={node.id}
                  className="absolute cursor-pointer transition-all duration-200"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: "280px",
                    opacity:
                      !hoveredNode && !selectedNode
                        ? 1
                        : isHighlighted
                          ? 1
                          : 0.3,
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() =>
                    setSelectedNode(selectedNode === node.id ? null : node.id)
                  }
                >
                  <Card
                    className={`${colors.bg} border ${colors.border} ${
                      isActive ? "shadow-lg shadow-blue-500/20" : "shadow-sm"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`${colors.accent} p-1.5 rounded`}>
                            <div className="text-white grid place-items-center">
                              {getNodeIcon(node)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle
                              className={`text-sm ${colors.text} truncate`}
                            >
                              {node.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`text-[10px] mt-1 ${colors.border} ${colors.text}`}
                            >
                              {node.type}
                            </Badge>
                          </div>
                        </div>
                        {node.dependencies && node.dependencies.length > 0 && (
                          <ExternalLink sx={{ fontSize: 12 }} className="text-neutral-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {node.fields?.slice(0, 4).map((field, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-1 border-b border-neutral-200 dark:border-neutral-800/50 last:border-0"
                          >
                            <code className="text-neutral-700 dark:text-neutral-300 font-mono">
                              {field.name}
                            </code>
                            <span className="text-neutral-500 text-[10px]">
                              {field.type}
                            </span>
                          </div>
                        ))}
                        {node.fields && node.fields.length > 4 && (
                          <div className="text-[10px] text-neutral-500 text-center pt-1">
                            +{node.fields.length - 4} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedNode && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
          <div className="max-w-4xl mx-auto">
            {(() => {
              const node = nodes.find((n) => n.id === selectedNode);
              if (!node) return null;
              const colors = getCategoryColor(node.category);

              const dependencies =
                node.dependencies
                  ?.map((depId) => nodes.find((n) => n.id === depId))
                  .filter(Boolean) || [];
              const dependents = nodes.filter((n) =>
                n.dependencies?.includes(selectedNode),
              );

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`${colors.accent} p-2 rounded`}>
                      <div className="text-white">{getNodeIcon(node)}</div>
                    </div>
                    <div>
                      <h3 className={`text-lg ${colors.text} font-mono`}>
                        {node.name}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {node.category} • {node.type}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                        Dependencies ({dependencies.length})
                      </h4>
                      <div className="space-y-1">
                        {dependencies.length === 0 ? (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            No dependencies
                          </p>
                        ) : (
                          dependencies.map((dep) => (
                            <div
                              key={dep?.id}
                              className="text-xs text-neutral-700 dark:text-neutral-300 font-mono bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded"
                            >
                              {dep?.name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                        Dependents ({dependents.length})
                      </h4>
                      <div className="space-y-1">
                        {dependents.length === 0 ? (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            No dependents
                          </p>
                        ) : (
                          dependents.map((dep) => (
                            <div
                              key={dep.id}
                              className="text-xs text-neutral-700 dark:text-neutral-300 font-mono bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded"
                            >
                              {dep.name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlowPage() {
  const { flowData } = useUIStore();
  const [nodes, setNodes] = useState<FlowNode[]>([]);

  useEffect(() => {
    if (flowData && flowData.data && Array.isArray(flowData.data)) {
      setNodes(flowData.data);
    }
  }, [flowData]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-500">
        No flow data available. Use the Analysis Wizard to generate a flow.
      </div>
    );
  }

  return <FlowView nodes={nodes} />;
}
