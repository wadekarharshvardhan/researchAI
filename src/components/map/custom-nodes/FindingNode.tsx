"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import { FindingNodeData } from "@/types/research-map";

function FindingNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FindingNodeData;

  return (
    <div
      className={`relative group min-w-[170px] max-w-[220px] p-2.5 px-3 rounded-2xl bg-[#ECFEFF] border border-[#06B6D4]/50 shadow-sm flex items-center gap-2.5 cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:border-[#06B6D4] hover:scale-102 ${
        selected ? "ring-2 ring-[#06B6D4] ring-offset-2 border-[#06B6D4] shadow-md scale-102" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-[#06B6D4] border border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-[#06B6D4] border border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-[#06B6D4] border border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-[#06B6D4] border border-white"
      />

      <div className="w-6 h-6 rounded-lg bg-[#CFFAFE] text-[#0891B2] flex items-center justify-center shrink-0">
        <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-semibold text-[#07133D] leading-tight line-clamp-2">
          {nodeData.label}
        </span>
        <span className="text-[10px] text-[#0891B2] font-medium leading-none mt-0.5">
          Finding
        </span>
      </div>
    </div>
  );
}

export default memo(FindingNode);
