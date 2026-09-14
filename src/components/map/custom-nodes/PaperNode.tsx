"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import { PaperNodeData } from "@/types/research-map";

function PaperNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as PaperNodeData;

  return (
    <div
      className={`relative group min-w-[190px] max-w-[240px] p-3 rounded-2xl bg-[#F0FDF4] border border-[#10B981]/50 shadow-sm flex items-start gap-2.5 cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:border-[#10B981] hover:scale-102 ${
        selected ? "ring-2 ring-[#10B981] ring-offset-2 border-[#10B981] shadow-md scale-102" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-[#10B981] border border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-[#10B981] border border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-[#10B981] border border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-[#10B981] border border-white"
      />

      <div className="w-6 h-6 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
        <FileText className="w-3.5 h-3.5" strokeWidth={2.2} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-semibold text-[#07133D] leading-snug line-clamp-2">
          {nodeData.label}
        </span>
        <span className="text-[10px] text-[#15803D] font-medium mt-0.5">
          Paper {nodeData.year ? `• ${nodeData.year}` : ""}
        </span>
      </div>
    </div>
  );
}

export default memo(PaperNode);
