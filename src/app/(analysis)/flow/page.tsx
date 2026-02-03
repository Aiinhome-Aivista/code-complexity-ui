"use client";

import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  MarkerType,
  Node,
  Edge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { useUIStore } from "@/store/uiStore";
import CustomNode from "./CustomNode";
import { ViewQuilt } from "@mui/icons-material";

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 320; // Card width + gap
  const nodeHeight = 100; // Approximate card height

  dagreGraph.setGraph({ rankdir: "LR" }); // Left-to-Right layout

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    // Dagre returns the center of the node, React Flow needs top-left
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      targetPosition: "left",
      sourcePosition: "right",
    };
  });

  return { nodes: layoutedNodes, edges };
};

function Flow() {
  const { flowData } = useUIStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!flowData) return;

    // Handle data structure
    let apiNodes: any[] = [];
    if (Array.isArray(flowData)) {
      apiNodes = flowData;
    } else if (flowData.data && Array.isArray(flowData.data)) {
      apiNodes = flowData.data;
    }

    if (apiNodes.length === 0) return;

    // Transform to React Flow structure
    const rfNodes: Node[] = apiNodes.map((node) => ({
      id: node.id,
      type: "custom",
      data: {
        name: node.name,
        type: node.type,
        category: node.category,
        fields: node.fields,
        dependenciesCount: node.dependencies?.length || 0,
      },
      position: { x: 0, y: 0 }, // Initial position, will be calculated by dagre
    }));

    const rfEdges: Edge[] = [];
    apiNodes.forEach((node) => {
      if (node.dependencies) {
        node.dependencies.forEach((depId: string) => {
          // Verify dependency exists
          if (apiNodes.find(n => n.id === depId)) {
            rfEdges.push({
              id: `${depId}-${node.id}`,
              source: depId,
              target: node.id, // Arrow points TO the dependent? Or dependency -> node?
              // Usually: A depends on B means A calls B. Flow: A -> B.
              // In this app visualization context: 
              // If A "depends on" B, usually we want an arrow from A to B.
              // Let's assume dependency is the target.
              type: "smoothstep",
              animated: true,
              style: { stroke: "#94a3b8", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#94a3b8",
              },
            });
          }
        });
      }
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      rfNodes,
      rfEdges
    );

    setNodes(layoutedNodes as any);
    setEdges(layoutedEdges);
  }, [flowData, setNodes, setEdges]);

  if (!flowData || (Array.isArray(flowData) && flowData.length === 0)) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-200 dark:bg-neutral-950 text-neutral-400">
        <div className="flex flex-col items-center gap-2">
          <ViewQuilt fontSize="large" className="opacity-50" />
          <p>No flow data to visualize</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="bg-gray-300"
        minZoom={0.1}
      >
        <Controls className="!bg-white dark:!bg-neutral-800 !border-neutral-200 dark:!border-neutral-700 !fill-neutral-500" />
        <Background color="#94a3b8" gap={16} size={1} className="opacity-20" />
      </ReactFlow>
    </div>
  );
}

export default function FlowPage() {
  return (
    <ReactFlowProvider>
      <div className="h-[calc(100vh-64px)] bg-gray-100 dark:bg-neutral-950 p-6 flex flex-col gap-6">
        <div className="shrink-0">
          <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
            Flow
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Visual graph of file dependencies and relationships
          </p>
        </div>

        <div className="flex-1 min-h-0 bg-gray-400 dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-800 shadow-sm overflow-hidden relative">
          <Flow />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
