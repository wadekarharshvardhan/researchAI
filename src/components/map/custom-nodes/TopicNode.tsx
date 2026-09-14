"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Leaf, Wheat, Orbit, Network, Sparkles, Sun, Wind, BatteryCharging, Grid, BookOpen, Cpu, Smartphone, Target, Camera } from "lucide-react";
import { TopicNodeData } from "@/types/research-map";

const iconMap: Record<string, React.ElementType> = {
  leaf: Leaf,
  wheat: Wheat,
  orbit: Orbit,
  network: Network,
  sparkles: Sparkles,
  sun: Sun,
  wind: Wind,
  "battery-charging": BatteryCharging,
  grid: Grid,
  "book-open": BookOpen,
  cpu: Cpu,
  smartphone: Smartphone,
  target: Target,
  camera: Camera,
};

function TopicNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as TopicNodeData;
  const IconComponent = (nodeData.iconName && iconMap[nodeData.iconName]) || Sparkles;

  return (
    <div
      className={`relative group px-6 py-3.5 rounded-full bg-gradient-to-r from-[#205DF8] via-[#2563EB] to-[#1D4ED8] text-white shadow-xl shadow-blue-500/25 flex items-center gap-3 cursor-pointer select-none transition-all duration-200 hover:scale-105 active:scale-98 ${
        selected ? "ring-4 ring-blue-300 ring-offset-2 shadow-2xl scale-105" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 !bg-white/80 border-2 !border-[#205DF8]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-white/80 border-2 !border-[#205DF8]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2.5 h-2.5 !bg-white/80 border-2 !border-[#205DF8]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2.5 h-2.5 !bg-white/80 border-2 !border-[#205DF8]"
      />

      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
        <IconComponent className="w-4 h-4 text-white" strokeWidth={2.2} />
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-semibold tracking-wide leading-tight drop-shadow-sm whitespace-nowrap">
          {nodeData.label}
        </span>
      </div>
    </div>
  );
}

export default memo(TopicNode);
