"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Database } from "lucide-react";
import { DatasetNodeData } from "@/types/research-map";

function DatasetNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as DatasetNodeData;

  return (
    <div
      className={`relative group min-w-[150px] max-w-[210px] p-2.5 px-3 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]/50 shadow-sm flex items-center gap-2.5 cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:border-[#F59E0B] hover:scale-102 ${
        selected ? "ring-2 ring-[#F59E0B] ring-offset-2 border-[#F59E0B] shadow-md scale-102" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-[#F59E0B] border border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-[#F59E0B] border border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-[#F59E0B] border border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-[#F59E0B] border border-white"
      />

      <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
        <Database className="w-3.5 h-3.5" strokeWidth={2.2} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-semibold text-[#07133D] leading-tight truncate">
          {nodeData.label}
        </span>
        <span className="text-[10px] text-[#D97706] font-medium leading-none mt-0.5">
          Dataset
        </span>
      </div>
    </div>
  );
}

export default memo(DatasetNode);
