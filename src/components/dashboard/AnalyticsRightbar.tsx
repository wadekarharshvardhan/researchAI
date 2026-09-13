"use client";

import Image from "next/image";
import { Lightbulb, Quote, Check, Clock, Compass, FileText, Sparkles, Activity } from "lucide-react";
import { motion } from "motion/react";
import { useAnalytics } from "@/lib/analytics-store";

export default function AnalyticsRightbar() {
  const { calculations, raw } = useAnalytics("Last 30 days");
  const { stats, insights, researchAreas, hasData } = calculations;

  // Recent activity items (latest 3 searches or views)
  const recentItems = [
    ...raw.searches.map((s) => ({
      id: s.id,
      title: s.query,
      type: "search" as const,
      timestamp: s.timestamp,
    })),
    ...raw.views.map((v) => ({
      id: v.id,
      title: v.title,
      type: "view" as const,
      timestamp: v.timestamp,
    })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  const fallbackInsights = [
    "Discover research trends",
    "Track your progress",
    "Identify new opportunities",
    "Build your knowledge base",
  ];

  return (
    <motion.aside
      className="w-80 shrink-0 space-y-4 py-6 px-4 bg-white/70 backdrop-blur-xl border-l border-[#E8EFF8] h-full select-none overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
      aria-label="Research analytics insights and inspiration"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Card 1: B.B. King Quote Card with Mountain Backdrop ── */}
      <motion.div
        className="relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)] overflow-hidden min-h-[170px] flex flex-col justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        {/* Soft mountain silhouette backdrop */}
        <div className="absolute inset-0 opacity-[0.22] pointer-events-none select-none">
          <Image
            src="/images/hero-bg.webp"
            alt=""
            fill
            className="object-cover object-bottom"
            unoptimized
            aria-hidden="true"
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.65) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 space-y-2.5">
          <div className="text-[#2563EB]">
            <Quote className="w-5 h-5 rotate-180 fill-[#2563EB]/15 text-[#2563EB]" strokeWidth={2} />
          </div>
          <p className="text-xs sm:text-[13px] font-medium text-[#07133D] italic leading-relaxed">
            &ldquo;The beautiful thing about learning is that no one can take it away from you.&rdquo;
          </p>
          <p className="text-[11px] font-semibold text-[#64748B]">
            — B.B. King
          </p>
        </div>
      </motion.div>

      {/* ── Card 2: Research Summary & Insights Card ──────── */}
      <motion.div
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-2xs">
            <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.4} />
          </div>
          <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D]">
            Research Insights
          </h3>
        </div>

        {hasData ? (
          <div className="space-y-3.5 pt-1">
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#556987] font-medium">Top Domain:</span>
                <span className="font-bold text-[#07133D] truncate max-w-[130px]">
                  {researchAreas[0]?.area || "Multi-disciplinary"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#556987] font-medium">Peak Activity:</span>
                <span className="font-bold text-[#2563EB]">{insights.peakDayLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#556987] font-medium">Reading Velocity:</span>
                <span className="font-bold text-[#10B981]">
                  {insights.totalReadMinutes > 0 ? `${insights.totalReadMinutes} mins` : "Active"}
                </span>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-[#556987] uppercase tracking-wider">
              Discovery Highlights
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[#475569]">
                  <strong>{stats.queriesCount}</strong> search queries executed
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[#475569]">
                  <strong>{insights.openAccessRate}%</strong> open access paper ratio
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[#475569]">
                  Saved approximately <strong>{stats.hoursSaved} hrs</strong> of manual review
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[11px] text-[#556987] leading-relaxed mb-4">
              Your personalized insights will appear here once you start researching.
            </p>

            <div className="space-y-2.5">
              {fallbackInsights.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2.5 group cursor-default"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                  <span className="text-xs font-medium text-[#475569] group-hover:text-[#07133D] transition-colors">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Card 3: Recent Activity Feed (if data exists) ── */}
      {hasData && recentItems.length > 0 && (
        <motion.div
          className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Activity className="w-3 h-3" />
            </div>
            <h4 className="text-xs font-bold text-[#07133D]">Recent Log</h4>
          </div>

          <div className="space-y-2.5">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]/60 text-xs"
              >
                {item.type === "search" ? (
                  <Compass className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#07133D] truncate">{item.title}</p>
                  <p className="text-[10px] text-[#556987] capitalize">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
