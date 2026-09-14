"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Sun, Wind, BatteryCharging, Grid, Sparkles, BookOpen, Cpu, Smartphone, Target, Camera, LucideIcon } from "lucide-react";
import { TopicNodeData } from "@/types/research-map";

const iconMap: Record<string, LucideIcon> = {
  sun: Sun,
  wind: Wind,
  "battery-charging": BatteryCharging,
  grid: Grid,
  sparkles: Sparkles,
  "book-open": BookOpen,
  cpu: Cpu,
  smartphone: Smartphone,
  target: Target,
  camera: Camera,
};

function SubtopicNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as TopicNodeData;
  const Icon = (nodeData.iconName && iconMap[nodeData.iconName]) || Sparkles;

  return (
    <div
      className={`relative group px-4 py-2.5 rounded-2xl bg-white border-2 border-blue-200/90 shadow-sm flex items-center gap-2.5 cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:border-blue-400 hover:scale-102 ${
        selected ? "ring-2 ring-[#2563EB] ring-offset-2 border-[#2563EB] shadow-md scale-102" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-blue-400 border border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-blue-400 border border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-blue-400 border border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-blue-400 border border-white"
      />

      <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      </div>

      <span className="text-xs font-semibold text-[#07133D] whitespace-nowrap">
        {nodeData.label}
      </span>
    </div>
  );
}

export default memo(SubtopicNode);
