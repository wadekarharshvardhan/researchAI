"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Cpu } from "lucide-react";
import { MethodNodeData } from "@/types/research-map";

function MethodNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as MethodNodeData;

  return (
    <div
      className={`relative group min-w-[150px] max-w-[210px] p-2.5 px-3 rounded-2xl bg-[#F5F3FF] border border-[#8B5CF6]/40 shadow-sm flex items-center gap-2.5 cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:border-[#8B5CF6] hover:scale-102 ${
        selected ? "ring-2 ring-[#8B5CF6] ring-offset-2 border-[#8B5CF6] shadow-md scale-102" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-[#8B5CF6] border border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-[#8B5CF6] border border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-[#8B5CF6] border border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-[#8B5CF6] border border-white"
      />

      <div className="w-6 h-6 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
        <Cpu className="w-3.5 h-3.5" strokeWidth={2.2} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-semibold text-[#07133D] leading-tight truncate">
          {nodeData.label}
        </span>
        <span className="text-[10px] text-[#7C3AED] font-medium leading-none mt-0.5">
          Method
        </span>
      </div>
    </div>
  );
}

export default memo(MethodNode);
