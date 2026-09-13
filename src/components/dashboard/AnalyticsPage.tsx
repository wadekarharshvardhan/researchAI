"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Compass,
  Search,
  Clock,
  Calendar,
  ChevronDown,
  Target,
  Plus,
  BarChart2,
  TrendingUp,
  Database,
  PieChart,
  Sprout,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Award,
  RotateCcw,
  Zap,
  Layers,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";
import { useAnalytics } from "@/lib/analytics-store";

interface AnalyticsPageProps {
  onStartResearch?: () => void;
  onSearch?: (query: string) => void;
  onExploreTopics?: () => void;
  onGoToLibrary?: () => void;
}

export default function AnalyticsPage({
  onStartResearch,
  onSearch,
  onExploreTopics,
  onGoToLibrary,
}: AnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const timeRangeOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"];

  const {
    calculations,
    isLoaded,
    seedSampleAnalytics,
    clearAnalytics,
  } = useAnalytics(timeRange);

  const { stats, activityTimeline, topTopics, sources, researchAreas, insights, hasData } =
    calculations;

  const statCards = [
    {
      id: "projects",
      label: "Research Projects",
      value: stats.projectsCount.toString(),
      change: stats.projectsChange,
      icon: FileText,
      iconBg: "bg-[#EEF4FD]",
      iconColor: "text-[#2563EB]",
    },
    {
      id: "topics",
      label: "Topics Explored",
      value: stats.topicsCount.toString(),
      change: stats.topicsChange,
      icon: Compass,
      iconBg: "bg-[#FEF2F2]",
      iconColor: "text-[#EF4444]",
    },
    {
      id: "queries",
      label: "Research Queries",
      value: stats.queriesCount.toString(),
      change: stats.queriesChange,
      icon: Search,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#10B981]",
    },
    {
      id: "hours",
      label: "Hours Saved",
      value: `${stats.hoursSaved}h`,
      change: stats.hoursSavedChange,
      icon: Clock,
      iconBg: "bg-[#F5F3FF]",
      iconColor: "text-[#8B5CF6]",
    },
  ];

  // Max total in activity timeline for relative bar scaling
  const maxActivityTotal = Math.max(
    ...activityTimeline.map((item) => item.total),
    4
  );

  const handleTopicClick = (topicName: string) => {
    if (onSearch) {
      onSearch(topicName);
    } else if (onStartResearch) {
      onStartResearch();
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full min-h-0 min-w-0 flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-10 max-w-[1360px] mx-auto select-none"
      aria-label="Research Analytics Dashboard"
    >
      {/* ── Top Header with Doodle & Time Range ──────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative">
        <div>
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#556987] uppercase block mb-1">
            Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#07133D] tracking-tight">
            Your Research Analytics
          </h1>
          <p className="text-sm sm:text-base text-[#556987] mt-1.5 max-w-2xl">
            Track your research queries, papers viewed in AI reader, and discovery velocity over time.
          </p>
        </div>

        {/* Right side: Doodle + Demo Actions + Time Range Dropdown */}
        <div className="flex items-center gap-3 self-start md:self-auto relative flex-wrap">
          {/* Hand-drawn Caveat Doodle */}
          <div className="hidden lg:flex flex-col items-center relative -top-3 right-2 pointer-events-none">
            <div className="flex items-center gap-1.5 text-[#2563EB] font-['Caveat',cursive] text-lg font-bold rotate-[-4deg] leading-tight">
              <span>Small steps.</span>
              <br />
              <span className="text-[#1D4ED8]">Big discoveries.</span>
              <div className="flex items-end gap-1 ml-1 mb-1">
                <div className="w-1.5 h-3 bg-[#93C5FD] rounded-xs" />
                <div className="w-1.5 h-4.5 bg-[#60A5FA] rounded-xs" />
                <div className="w-1.5 h-6 bg-[#2563EB] rounded-xs" />
              </div>
            </div>
            <svg
              className="w-8 h-8 text-[#2563EB] mt-0.5 -rotate-12"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8 C 22 14, 26 24, 20 32" />
              <path d="M14 28 L 20 32 L 24 26" />
            </svg>
          </div>

          {/* Quick Demo Data / Reset Buttons */}
          <div className="flex items-center gap-2">
            {!hasData ? (
              <button
                type="button"
                onClick={seedSampleAnalytics}
                title="Populate with demo research activity to preview analytics"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-[#2563EB] border border-blue-200/80 transition-all cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Demo Data</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={clearAnalytics}
                title="Reset analytics store"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-xs font-medium text-[#556987] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* Time Range Selector Button */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F6] text-sm font-semibold text-[#07133D] hover:bg-[#F8FAFC] shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#556987]" />
              <span>{timeRange}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#556987] transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-[#DCE7F6] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                {timeRangeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTimeRange(opt);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                      timeRange === opt
                        ? "bg-[#EEF4FD] text-[#2563EB] font-semibold"
                        : "text-[#556987] hover:bg-[#F8FAFC] hover:text-[#07133D]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Metrics 4-Card Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.3 }}
              className="bg-white rounded-2xl border border-[#DCE7F6] p-5 shadow-xs hover:shadow-md hover:border-[#BFDBFE] transition-all flex items-start gap-4"
            >
              <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.iconColor} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#07133D] block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-[#556987] block mt-0.5 truncate">
                  {stat.label}
                </span>
                <span
                  className={`text-[11px] font-semibold block mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-[#10B981]"
                      : stat.change.startsWith("-")
                      ? "text-[#EF4444]"
                      : "text-[#556987]"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Middle Row (2 Large Cards: Activity & Topics) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Research Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[340px]"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#07133D]">Research Activity</h2>
              <p className="text-xs text-[#556987] mt-0.5">
                Your research searches and paper readings over time.
              </p>
            </div>

            {hasData && (
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <span className="text-[#556987] font-medium">Searches</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[#556987] font-medium">Paper Views</span>
                </div>
              </div>
            )}
          </div>

          {!hasData ? (
            /* Empty State Illustration & Message */
            <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
              <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#EEF4FD] rounded-full blur-md opacity-80" />
                <div className="flex items-end gap-2 relative z-10">
                  <div className="w-3.5 h-8 bg-[#DBEAFE] rounded-xs" />
                  <div className="w-3.5 h-12 bg-[#BFDBFE] rounded-xs" />
                  <div className="w-3.5 h-16 bg-[#93C5FD] rounded-xs" />
                </div>
                <div className="absolute -bottom-1 -right-1 z-20 p-2 rounded-full bg-white shadow-md border border-[#DCE7F6] text-[#2563EB]">
                  <Search className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#07133D]">No research activity yet</h3>
              <p className="text-xs text-[#556987] mt-1 max-w-[280px]">
                Start a new research query or open papers in AI reader to see your activity timeline.
              </p>
              <button
                type="button"
                onClick={seedSampleAnalytics}
                className="mt-4 px-3.5 py-1.5 bg-[#EEF4FD] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Load Sample Activity
              </button>
            </div>
          ) : (
            /* Active Interactive Bar Chart */
            <div className="my-auto py-2">
              <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1 relative">
                {/* Horizontal guide lines */}
                <div className="absolute inset-x-0 top-6 border-b border-dashed border-slate-200/80 pointer-events-none" />
                <div className="absolute inset-x-0 top-24 border-b border-dashed border-slate-200/80 pointer-events-none" />

                {activityTimeline.map((item, idx) => {
                  const searchHeight =
                    item.searches > 0
                      ? Math.max(8, Math.round((item.searches / maxActivityTotal) * 110))
                      : 0;
                  const viewHeight =
                    item.views > 0
                      ? Math.max(8, Math.round((item.views / maxActivityTotal) * 110))
                      : 0;

                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <div
                      key={item.dateStr + idx}
                      className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Tooltip on hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -top-14 bg-[#07133D] text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl z-30 whitespace-nowrap pointer-events-none"
                          >
                            <p className="font-bold">{item.displayLabel}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-300">
                              <span>Searches: {item.searches}</span>
                              <span>•</span>
                              <span>Views: {item.views}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Stacked Bars */}
                      <div className="w-full max-w-[28px] flex flex-col justify-end items-center gap-0.5">
                        {/* Searches bar (Blue) */}
                        {item.searches > 0 && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${searchHeight}px` }}
                            transition={{ duration: 0.4, delay: idx * 0.03 }}
                            className={`w-full rounded-t-sm transition-all ${
                              isHovered ? "bg-[#1D4ED8]" : "bg-[#2563EB]"
                            }`}
                          />
                        )}

                        {/* Views bar (Green) */}
                        {item.views > 0 && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${viewHeight}px` }}
                            transition={{ duration: 0.4, delay: idx * 0.03 + 0.05 }}
                            className={`w-full ${
                              item.searches > 0 ? "rounded-b-sm" : "rounded-t-sm"
                            } transition-all ${isHovered ? "bg-[#059669]" : "bg-[#10B981]"}`}
                          />
                        )}

                        {/* Baseline dot if 0 activity */}
                        {item.searches === 0 && item.views === 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      {/* X-axis Label */}
                      <span
                        className={`text-[10px] font-semibold mt-2.5 transition-colors ${
                          isHovered ? "text-[#2563EB]" : "text-[#556987]"
                        }`}
                      >
                        {item.displayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom activity summary pill */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#556987]">
                <span>
                  Total searches:{" "}
                  <strong className="text-[#07133D] font-bold">{stats.queriesCount}</strong>
                </span>
                <span>
                  Total paper views:{" "}
                  <strong className="text-[#07133D] font-bold">
                    {activityTimeline.reduce((acc, i) => acc + i.views, 0)}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Top Research Topics Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[340px]"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h2 className="text-base font-bold text-[#07133D]">Top Research Topics</h2>
              <p className="text-xs text-[#556987] mt-0.5">
                Concepts and fields you explore the most. Click any topic to research.
              </p>
            </div>
            {topTopics.length > 0 && (
              <span className="text-[11px] font-semibold text-[#2563EB] bg-[#EEF4FD] px-2.5 py-1 rounded-full">
                {topTopics.length} Active Topics
              </span>
            )}
          </div>

          {!hasData || topTopics.length === 0 ? (
            /* Empty State Illustration & Message */
            <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
              <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#EEF4FD] rounded-full blur-md opacity-80" />
                <div className="relative z-10 w-14 h-16 bg-white rounded-lg shadow-sm border border-[#DCE7F6] flex flex-col justify-between p-2">
                  <div className="space-y-1.5">
                    <div className="w-8 h-1.5 bg-[#DBEAFE] rounded-full" />
                    <div className="w-6 h-1.5 bg-[#EEF4FD] rounded-full" />
                    <div className="w-7 h-1.5 bg-[#EEF4FD] rounded-full" />
                  </div>
                  <div className="self-end">
                    <Sprout className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#07133D]">No topics yet</h3>
              <p className="text-xs text-[#556987] mt-1 max-w-[280px]">
                Your top research topics will appear here after you start exploring.
              </p>
              {onExploreTopics && (
                <button
                  type="button"
                  onClick={onExploreTopics}
                  className="mt-4 px-3.5 py-1.5 bg-[#EEF4FD] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Explore Trending Topics
                </button>
              )}
            </div>
          ) : (
            /* Active Top Topics Ranked List */
            <div className="my-auto space-y-3 py-1">
              {topTopics.map((topicItem, idx) => (
                <div
                  key={topicItem.topic}
                  onClick={() => handleTopicClick(topicItem.topic)}
                  className="group p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#DCE7F6] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-[#07133D] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors truncate">
                        {topicItem.topic}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#556987]">
                        {topicItem.count} {topicItem.count === 1 ? "entry" : "entries"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(12, topicItem.percentage)}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Bottom 3-Card Row (Papers by Source, Research Areas, Saved Papers) ─ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Card 1: Papers by Source */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[290px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-[#07133D]">Papers by Source</h2>
              <Database className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="text-xs text-[#556987]">Academic indexes and venues you access most.</p>
          </div>

          {!hasData || sources.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EEF4FD] text-[#2563EB] flex items-center justify-center mb-3">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#07133D]">No source data yet</h3>
              <p className="text-xs text-[#556987] mt-1 max-w-[220px]">
                Start researching to see which academic repositories you use.
              </p>
            </div>
          ) : (
            <div className="my-auto py-2 space-y-3.5">
              {/* Segmented Bar */}
              <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden">
                {sources.map((src, i) => (
                  <div
                    key={src.source}
                    style={{
                      width: `${src.percentage}%`,
                      backgroundColor: src.color,
                    }}
                    title={`${src.source}: ${src.count} (${src.percentage}%)`}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                  />
                ))}
              </div>

              {/* Source Details List */}
              <div className="space-y-2">
                {sources.map((src) => (
                  <div key={src.source} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: src.color }}
                      />
                      <span className="font-semibold text-[#07133D]">{src.source}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#556987]">
                      <span className="font-medium">{src.count} papers</span>
                      <span className="text-[11px] font-bold text-slate-400">({src.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Card 2: Research Areas */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[290px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-[#07133D]">Research Areas</h2>
              <PieChart className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="text-xs text-[#556987]">Distribution of your multidisciplinary interests.</p>
          </div>

          {!hasData || researchAreas.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EEF4FD] text-[#2563EB] flex items-center justify-center mb-3">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#07133D]">No research areas yet</h3>
              <p className="text-xs text-[#556987] mt-1 max-w-[220px]">
                Your research areas will appear here as you run queries.
              </p>
            </div>
          ) : (
            <div className="my-auto py-2 space-y-3">
              {researchAreas.map((area, idx) => (
                <div key={area.area} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#07133D] truncate max-w-[170px]">
                      {area.area}
                    </span>
                    <span className="font-bold text-[#556987] text-[11px]">
                      {area.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${area.percentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      style={{ backgroundColor: area.color }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Card 3: Research Insights */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[290px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-[#07133D]">Research Insights</h2>
              <Award className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="text-xs text-[#556987]">Quality metrics and research milestones.</p>
          </div>

          {!hasData ? (
            <div className="flex flex-col items-center justify-center my-auto py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EEF4FD] text-[#2563EB] flex items-center justify-center mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#07133D]">No research data yet</h3>
              <p className="text-xs text-[#556987] mt-1 max-w-[220px]">
                Explore topics and read papers to reveal your discovery milestones.
              </p>
            </div>
          ) : (
            <div className="my-auto py-2 space-y-3.5">
              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-[#556987] tracking-wider block">
                    Avg Citations
                  </span>
                  <span className="text-base font-extrabold text-[#07133D]">
                    {insights.avgCitations}
                  </span>
                </div>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-[#556987] tracking-wider block">
                    Open Access
                  </span>
                  <span className="text-base font-extrabold text-[#10B981]">
                    {insights.openAccessRate}%
                  </span>
                </div>
              </div>

              {/* Milestones checklist */}
              <div className="space-y-1.5">
                {insights.milestones.slice(0, 3).map((m) => (
                  <div
                    key={m.title}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        m.unlocked ? "text-[#10B981]" : "text-slate-300"
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-[11px] font-bold truncate ${
                          m.unlocked ? "text-[#07133D]" : "text-slate-400"
                        }`}
                      >
                        {m.title}
                      </p>
                      <p className="text-[10px] text-[#556987] truncate">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Bottom Callout Banner ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.35 }}
        className="rounded-2xl bg-gradient-to-r from-[#EEF4FD] via-[#F4F8FE] to-[#EEF4FD] border border-[#DCE7F6] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-[#DCE7F6] flex items-center justify-center text-[#2563EB] shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#07133D]">
              Ready to accelerate your discoveries?
            </h4>
            <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
              Launch an AI research query, analyze multi-paper trends, and read papers in the AI reader.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onGoToLibrary && (
            <button
              type="button"
              onClick={onGoToLibrary}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#07133D] border border-[#DCE7F6] text-sm font-semibold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <BookOpen className="w-4 h-4 text-[#556987]" />
              <span>Library</span>
            </button>
          )}
          <button
            type="button"
            onClick={onStartResearch}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Start a New Research</span>
          </button>
        </div>
      </motion.div>
    </motion.main>
  );
}
