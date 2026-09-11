"use client";

import Image from "next/image";
import {
  Search,
  FileText,
  Layers,
  Compass,
  Clock,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardRightbarProps {
  onSelectQuery?: (query: string) => void;
}

const features = [
  {
    icon: Search,
    title: "Find relevant papers",
    desc: "Across multiple scholarly sources",
  },
  {
    icon: FileText,
    title: "Understand complex research",
    desc: "AI-powered summaries",
  },
  {
    icon: Layers,
    title: "Compare methodologies",
    desc: "Structured insights and tables",
  },
  {
    icon: Compass,
    title: "Discover research gaps",
    desc: "Identify new opportunities",
  },
  {
    icon: Clock,
    title: "Save time",
    desc: "Focus on what matters",
  },
];

import { useRecentSearches, formatRelativeTime } from "@/lib/recent-searches";

export default function DashboardRightbar({ onSelectQuery }: DashboardRightbarProps) {
  const { recentSearches, clearRecentSearches } = useRecentSearches();

  return (
    <aside
      className="w-80 shrink-0 space-y-4 py-6 px-4 bg-white/70 backdrop-blur-xl border-l border-[#E8EFF8] h-full select-none overflow-y-auto"
      aria-label="Features and history"
    >
      {/* ── Card 1: Why ResearchAI? ─────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(30,60,120,0.04)]">
        <h3 className="text-xs font-bold text-[#07133D] mb-3.5 tracking-tight uppercase tracking-wider text-[11px] text-[#556987]">
          Why ResearchAI?
        </h3>

        <ul className="space-y-3" role="list">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <li key={idx} className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-xl bg-blue-50/90 border border-blue-100/70 flex items-center justify-center text-[#205DF8] shrink-0 mt-0.5 group-hover:bg-blue-100/80 transition-colors shadow-xs">
                  <Icon className="w-4 h-4" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-[#07133D] group-hover:text-[#205DF8] transition-colors leading-tight">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7FA2] leading-tight mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Card 2: Recent Searches ─────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(30,60,120,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#07133D] tracking-tight">
            Recent Searches
          </h3>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={() => clearRecentSearches()}
              className="text-[11px] font-semibold text-[#5B7FCC] hover:text-[#DC2626] cursor-pointer transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {recentSearches.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-[#8DA0BC]">No recent searches yet</p>
            <p className="text-[10.5px] text-[#A0B4D0] mt-0.5 leading-relaxed">
              Search a paper or concept to see history here
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5" role="list">
            {recentSearches.slice(0, 6).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectQuery?.(item.query)}
                  className="w-full flex items-start gap-2.5 p-1.5 -mx-1.5 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                  title={item.query}
                >
                  <Clock className="w-3.5 h-3.5 text-[#8DA0BC] mt-0.5 shrink-0 group-hover:text-[#205DF8] transition-colors" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1E293B] group-hover:text-[#205DF8] transition-colors truncate">
                      {item.query}
                    </p>
                    <p className="text-[10px] text-[#8DA0BC]">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Card 3: Carl Sagan Quote Card ───────────────────── */}
      <div className="relative rounded-2xl p-4 sm:p-5 overflow-hidden border border-white/90 bg-gradient-to-b from-white/90 to-[#EBF3FE]/85 shadow-[0_2px_12px_rgba(30,60,120,0.04)]">
        {/* Mountain illustration in bottom of card */}
        <div className="absolute inset-x-0 bottom-0 h-24 opacity-25 pointer-events-none">
          <Image
            src="/images/hero-bg.webp"
            alt="Card mountain backdrop"
            fill
            className="object-cover object-bottom"
            unoptimized
          />
        </div>

        <div className="relative z-10">
          <span className="text-[#205DF8] text-xl font-serif font-black select-none leading-none block mb-1">
            “
          </span>

          <p className="text-xs font-medium text-[#334155] leading-relaxed">
            Science is a way of thinking much more than it is a body of knowledge.
          </p>

          <span className="text-xs font-bold text-[#07133D] block mt-2.5">
            — Carl Sagan
          </span>
        </div>
      </div>
    </aside>
  );
}
