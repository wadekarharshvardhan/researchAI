"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ReactFlowInstance,
  ConnectionLineType,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  Sparkles,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import TopicNode from "./custom-nodes/TopicNode";
import SubtopicNode from "./custom-nodes/SubtopicNode";
import PaperNode from "./custom-nodes/PaperNode";
import MethodNode from "./custom-nodes/MethodNode";
import DatasetNode from "./custom-nodes/DatasetNode";
import FindingNode from "./custom-nodes/FindingNode";
import GapNode from "./custom-nodes/GapNode";
import NodeDetailPanel from "./NodeDetailPanel";
import BottomIntelligenceBar from "./BottomIntelligenceBar";
import {
  RENEWABLE_ENERGY_GRAPH,
  CROP_DISEASE_GRAPH,
  getPresetOrGenerateMap,
} from "@/lib/research-map-presets";
import {
  ResearchMapGraph,
  ResearchMapNode,
  ResearchMapEdge,
  ResearchMapNodeData,
} from "@/types/research-map";

const nodeTypes = {
  topic: TopicNode,
  subtopic: SubtopicNode,
  paper: PaperNode,
  method: MethodNode,
  dataset: DatasetNode,
  finding: FindingNode,
  gap: GapNode,
};

const EXAMPLE_TOPICS = [
  "Renewable energy",
  "AI-based crop disease detection",
  "Transformer models",
  "Cancer immunotherapy",
];

export default function ResearchMapPage({
  initialQuery = "Renewable energy",
}: {
  initialQuery?: string;
}) {
  const [searchTopic, setSearchTopic] = useState(initialQuery);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedNodeData, setSelectedNodeData] = useState<ResearchMapNodeData | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<ResearchMapNode, ResearchMapEdge> | null>(null);

  // Load initial graph
  const initialGraph = useMemo(() => {
    return getPresetOrGenerateMap(initialQuery);
  }, [initialQuery]);

  const [currentGraph, setCurrentGraph] = useState<ResearchMapGraph>(initialGraph);
  const [nodes, setNodes, onNodesChange] = useNodesState<ResearchMapNode>(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ResearchMapEdge>(initialGraph.edges);

  // Keep a reference to current selected node ID
  const selectedNodeId = selectedNodeData?.id || null;

  // Function to load/generate map for a query
  const handleGenerateMap = useCallback(
    (queryToGenerate: string) => {
      if (!queryToGenerate.trim()) return;
      setIsGenerating(true);

      setTimeout(() => {
        const nextGraph = getPresetOrGenerateMap(queryToGenerate);
        setCurrentGraph(nextGraph);
        setNodes(nextGraph.nodes);
        setEdges(nextGraph.edges);
        setSelectedNodeData(null);
        setIsGenerating(false);

        // Reset view after slight delay to allow layout calculation
        setTimeout(() => {
          if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
          }
        }, 150);
      }, 500);
    },
    [reactFlowInstance, setNodes, setEdges]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: ResearchMapNode) => {
      setSelectedNodeData(node.data);

      // Highlight connected edges and center on node
      if (reactFlowInstance) {
        reactFlowInstance.setCenter(node.position.x + 100, node.position.y + 40, {
          zoom: 1.1,
          duration: 600,
        });
      }
    },
    [reactFlowInstance]
  );

  // Handle bottom item click to focus specific node
  const handleSelectNodeById = useCallback(
    (nodeId: string) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (targetNode) {
        setSelectedNodeData(targetNode.data);
        if (reactFlowInstance) {
          reactFlowInstance.setCenter(targetNode.position.x + 100, targetNode.position.y + 40, {
            zoom: 1.15,
            duration: 600,
          });
        }
      }
    },
    [nodes, reactFlowInstance]
  );

  // Handle fit view / reset
  const handleFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.15, duration: 600 });
    }
  }, [reactFlowInstance]);

  // Highlight styling on edges when a node is selected
  const displayEdges = useMemo(() => {
    if (!selectedNodeId) return edges;

    return edges.map((edge) => {
      const isConnected = edge.source === selectedNodeId || edge.target === selectedNodeId;
      return {
        ...edge,
        animated: isConnected || edge.animated,
        style: {
          ...edge.style,
          stroke: isConnected ? "#2563EB" : edge.style?.stroke || "#CBD5E1",
          strokeWidth: isConnected ? 3 : 1.5,
          opacity: isConnected ? 1 : 0.35,
        },
      };
    });
  }, [edges, selectedNodeId]);

  // Filtered nodes based on in-map search
  const displayNodes = useMemo(() => {
    if (!filterQuery.trim()) return nodes;
    const lower = filterQuery.toLowerCase();
    return nodes.map((n) => {
      const matches =
        n.data.label.toLowerCase().includes(lower) ||
        n.data.type.toLowerCase().includes(lower);
      return {
        ...n,
        style: {
          ...n.style,
          opacity: matches ? 1 : 0.2,
          filter: matches ? "none" : "grayscale(80%)",
        },
      };
    });
  }, [nodes, filterQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden select-none">
      {/* ── TOP BAR: Header + Search + Generate ── */}
      <div className="px-5 sm:px-8 pt-5 pb-3 bg-white/90 backdrop-blur-md border-b border-[#E2EBF6] flex flex-col gap-3.5 shrink-0 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-[#07133D] tracking-tight">
                Research Map
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-200/60 shadow-xs">
                Beta
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#556987] mt-0.5 font-normal">
              Explore the big picture. See how papers, methods, datasets and findings are connected.
            </p>
          </div>

          {/* Search / Generate Map Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateMap(searchTopic);
            }}
            className="flex items-center gap-2 max-w-xl w-full"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Enter research topic or question..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-[#F1F5F9]/80 focus:bg-white text-[#07133D] placeholder-[#94A3B8] rounded-xl border border-[#E2EBF6] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#205DF8] hover:bg-[#1A4FD0] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all duration-150 cursor-pointer disabled:opacity-70 shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isGenerating ? "Synthesizing..." : "Generate Map"}</span>
            </button>
          </form>
        </div>

        {/* ── METRICS SUMMARY CARDS ── */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <div className="flex-1 min-w-[120px] p-2.5 px-3.5 rounded-xl bg-white border border-[#E2EBF6] shadow-xs flex flex-col">
            <span className="text-base sm:text-lg font-bold text-[#07133D]">
              {currentGraph.stats.paperCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium">Papers</span>
          </div>

          <div className="flex-1 min-w-[120px] p-2.5 px-3.5 rounded-xl bg-white border border-[#E2EBF6] shadow-xs flex flex-col">
            <span className="text-base sm:text-lg font-bold text-[#7C3AED]">
              {currentGraph.stats.methodCount}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium">Key Methods</span>
          </div>

          <div className="flex-1 min-w-[120px] p-2.5 px-3.5 rounded-xl bg-white border border-[#E2EBF6] shadow-xs flex flex-col">
            <span className="text-base sm:text-lg font-bold text-[#D97706]">
              {currentGraph.stats.datasetCount}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium">Datasets</span>
          </div>

          <div className="flex-1 min-w-[120px] p-2.5 px-3.5 rounded-xl bg-white border border-[#E2EBF6] shadow-xs flex flex-col">
            <span className="text-base sm:text-lg font-bold text-[#0891B2]">
              {currentGraph.stats.findingCount}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium">Main Findings</span>
          </div>

          <div className="flex-1 min-w-[120px] p-2.5 px-3.5 rounded-xl bg-white border border-[#E2EBF6] shadow-xs flex flex-col">
            <span className="text-base sm:text-lg font-bold text-[#DC2626]">
              {currentGraph.stats.gapCount}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium">Research Gaps</span>
          </div>

          {/* Quick example topics pills */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">
              Try:
            </span>
            {EXAMPLE_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setSearchTopic(topic);
                  handleGenerateMap(topic);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  searchTopic.toLowerCase() === topic.toLowerCase()
                    ? "bg-blue-50 border-[#2563EB] text-[#2563EB] font-semibold"
                    : "bg-white border-slate-200 text-[#556987] hover:border-slate-300"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CENTER: INTERACTIVE REACT FLOW GRAPH ── */}
      <div className="flex-1 relative w-full h-full min-h-0">
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNodeData(null)}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.25}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 2, stroke: "#94A3B8" },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.2}
            color="#CBD5E1"
            className="bg-[#F8FAFC]"
          />

          {/* Top Left Floating Legend */}
          <div className="absolute top-4 left-4 z-10 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E2EBF6] shadow-sm flex flex-col gap-2 select-none">
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Map Legend
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-[#334155]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#205DF8]" />
                <span className="font-medium text-[11px]">Research Topic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="font-medium text-[11px]">Paper</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                <span className="font-medium text-[11px]">Method</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="font-medium text-[11px]">Dataset</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                <span className="font-medium text-[11px]">Finding</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="font-medium text-[11px]">Research Gap</span>
              </div>
            </div>
          </div>

          {/* Graph Controls (Zoom In, Zoom Out, Fit View, In-Map Search) */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 select-none">
            {/* Filter inside map */}
            <div className="relative">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter map nodes..."
                className="w-36 sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-white/90 backdrop-blur-md rounded-xl border border-[#E2EBF6] shadow-sm text-[#07133D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
              />
              <Filter className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center bg-white/90 backdrop-blur-md border border-[#E2EBF6] rounded-xl p-1 shadow-sm gap-0.5">
              <button
                type="button"
                onClick={() => reactFlowInstance?.zoomIn({ duration: 300 })}
                className="p-1.5 rounded-lg text-[#556987] hover:text-[#07133D] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => reactFlowInstance?.zoomOut({ duration: 300 })}
                className="p-1.5 rounded-lg text-[#556987] hover:text-[#07133D] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleFitView}
                className="p-1.5 rounded-lg text-[#556987] hover:text-[#07133D] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Fit View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Right Detail Panel */}
          <AnimatePresence>
            {selectedNodeData && (
              <div className="absolute top-4 right-4 z-20 max-w-[90vw]">
                <NodeDetailPanel
                  nodeData={selectedNodeData}
                  onClose={() => setSelectedNodeData(null)}
                  onSelectNodeById={handleSelectNodeById}
                />
              </div>
            )}
          </AnimatePresence>
        </ReactFlow>
      </div>

      {/* ── BOTTOM SECTION: Secondary Intelligence Explorer ── */}
      <BottomIntelligenceBar
        relatedGaps={currentGraph.relatedGaps}
        emergingTrends={currentGraph.emergingTrends}
        topAuthors={currentGraph.topAuthors}
        keyDatasets={currentGraph.keyDatasets}
        onSelectNodeById={handleSelectNodeById}
        onOpenGapsModal={() => {
          if (currentGraph.relatedGaps[0]?.nodeId) {
            handleSelectNodeById(currentGraph.relatedGaps[0].nodeId);
          }
        }}
      />
    </div>
  );
}
