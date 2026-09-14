"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  TrendingUp,
  Users,
  Database,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { BottomCardItem } from "@/types/research-map";

interface BottomIntelligenceBarProps {
  relatedGaps: BottomCardItem[];
  emergingTrends: BottomCardItem[];
  topAuthors: BottomCardItem[];
  keyDatasets: BottomCardItem[];
  onSelectNodeById: (nodeId: string) => void;
  onOpenGapsModal?: () => void;
}

type TabKey = "gaps" | "trends" | "authors" | "datasets";

export default function BottomIntelligenceBar({
  relatedGaps,
  emergingTrends,
  topAuthors,
  keyDatasets,
  onSelectNodeById,
  onOpenGapsModal,
}: BottomIntelligenceBarProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("gaps");

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "gaps", label: "Related Research Gaps", count: relatedGaps.length },
    { key: "trends", label: "Emerging Trends", count: emergingTrends.length },
    { key: "authors", label: "Top Authors", count: topAuthors.length },
    { key: "datasets", label: "Key Datasets", count: keyDatasets.length },
  ];

  const currentCards =
    activeTab === "gaps"
      ? relatedGaps
      : activeTab === "trends"
      ? emergingTrends
      : activeTab === "authors"
      ? topAuthors
      : keyDatasets;

  const renderBadge = (badge?: string, variant?: string) => {
    if (!badge) return null;
    let colorClass = "bg-slate-100 text-slate-700";
    if (variant === "red" || badge.includes("High")) {
      colorClass = "bg-red-50 text-red-700 border border-red-200/80";
    } else if (variant === "orange" || badge.includes("Medium")) {
      colorClass = "bg-amber-50 text-amber-700 border border-amber-200/80";
    } else if (variant === "blue") {
      colorClass = "bg-blue-50 text-[#2563EB] border border-blue-200/80";
    } else if (variant === "purple") {
      colorClass = "bg-purple-50 text-purple-700 border border-purple-200/80";
    } else if (variant === "green") {
      colorClass = "bg-green-50 text-green-700 border border-green-200/80";
    }
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${colorClass}`}>
        {badge}
      </span>
    );
  };

  const renderIcon = (tab: TabKey) => {
    switch (tab) {
      case "gaps":
        return <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />;
      case "trends":
        return <TrendingUp className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />;
      case "authors":
        return <Users className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />;
      case "datasets":
        return <Database className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl border-t border-[#E2EBF6] px-4 sm:px-6 py-3.5 flex flex-col gap-3 shadow-lg select-none">
      {/* ── Tabs + View All ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto pb-1 sm:pb-0" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`text-xs sm:text-sm font-semibold transition-colors cursor-pointer py-1 relative whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-[#2563EB]"
                  : "text-[#64748B] hover:text-[#07133D]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenGapsModal}
          className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group cursor-pointer transition-colors"
        >
          <span>
            {activeTab === "gaps"
              ? "View All Potential Research Gaps"
              : activeTab === "trends"
              ? "Explore All Emerging Trends"
              : activeTab === "authors"
              ? "View Top Authors"
              : "Explore Datasets"}
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {currentCards.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.nodeId) {
                onSelectNodeById(item.nodeId);
              }
            }}
            className={`p-3.5 rounded-xl border border-[#E2EBF6] bg-white transition-all duration-200 flex flex-col justify-between gap-2 shadow-xs hover:border-[#2563EB]/60 hover:shadow-md group ${
              item.nodeId ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                {renderIcon(activeTab)}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors truncate">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-[11px] text-[#64748B] truncate">{item.subtitle}</p>
                  )}
                </div>
              </div>
              {renderBadge(item.badge, item.badgeVariant)}
            </div>

            <p className="text-[11px] text-[#475569] leading-relaxed line-clamp-2 pl-6">
              {item.description}
            </p>

            {item.metric && (
              <div className="pl-6 pt-1 text-[10px] font-semibold text-[#2563EB] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{item.metric}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
