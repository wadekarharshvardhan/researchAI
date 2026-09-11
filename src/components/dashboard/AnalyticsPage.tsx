"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Bookmark,
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
} from "lucide-react";

interface AnalyticsPageProps {
  onStartResearch?: () => void;
  onExploreTopics?: () => void;
  onGoToLibrary?: () => void;
}

export default function AnalyticsPage({
  onStartResearch,
}: AnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const timeRangeOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"];

  const stats = [
    {
      id: "projects",
      label: "Research Projects",
      value: "0",
      change: "— vs. previous period",
      icon: FileText,
      iconBg: "bg-[#EEF4FD]",
      iconColor: "text-[#2563EB]",
    },
    {
      id: "saved",
      label: "Saved Papers",
      value: "0",
      change: "— vs. previous period",
      icon: Bookmark,
      iconBg: "bg-[#FEF2F2]",
      iconColor: "text-[#EF4444]",
    },
    {
      id: "queries",
      label: "Research Queries",
      value: "0",
      change: "— vs. previous period",
      icon: Search,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#10B981]",
    },
    {
      id: "hours",
      label: "Hours Saved",
      value: "0",
      change: "— vs. previous period",
      icon: Clock,
      iconBg: "bg-[#F5F3FF]",
      iconColor: "text-[#8B5CF6]",
    },
  ];

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
            Track your research journey, explore insights, and see how your knowledge grows over time.
          </p>
        </div>

        {/* Right side: Doodle + Time Range Dropdown */}
        <div className="flex items-center gap-4 self-start md:self-auto relative">
          {/* Hand-drawn Caveat Doodle */}
          <div className="hidden lg:flex flex-col items-center relative -top-3 right-2 pointer-events-none">
            <div className="flex items-center gap-1.5 text-[#2563EB] font-['Caveat',cursive] text-lg font-bold rotate-[-4deg] leading-tight">
              <span>Small steps.</span>
              <br />
              <span className="text-[#1D4ED8]">Big discoveries.</span>
              {/* Mini 3-bar chart doodle */}
              <div className="flex items-end gap-1 ml-1 mb-1">
                <div className="w-1.5 h-3 bg-[#93C5FD] rounded-xs" />
                <div className="w-1.5 h-4.5 bg-[#60A5FA] rounded-xs" />
                <div className="w-1.5 h-6 bg-[#2563EB] rounded-xs" />
              </div>
            </div>
            {/* Curved Arrow SVG */}
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

          {/* Time Range Selector Button */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F6] text-sm font-semibold text-[#07133D] hover:bg-[#F8FAFC] shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#556987]" />
              <span>{timeRange}</span>
              <ChevronDown className={`w-4 h-4 text-[#556987] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
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
        {stats.map((stat, idx) => {
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
                <span className="text-[11px] font-medium text-[#10B981] block mt-1">
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
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[300px]"
        >
          <div>
            <h2 className="text-base font-bold text-[#07133D]">Research Activity</h2>
            <p className="text-xs text-[#556987] mt-0.5">Your research activity over time.</p>
          </div>

          {/* Empty State Illustration & Message */}
          <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
            {/* Illustrated 3D Bar Chart & Magnifier */}
            <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
              {/* Soft glow */}
              <div className="absolute inset-0 bg-[#EEF4FD] rounded-full blur-md opacity-80" />
              {/* Bar charts */}
              <div className="flex items-end gap-2 relative z-10">
                <div className="w-3.5 h-8 bg-[#DBEAFE] rounded-xs" />
                <div className="w-3.5 h-12 bg-[#BFDBFE] rounded-xs" />
                <div className="w-3.5 h-16 bg-[#93C5FD] rounded-xs" />
              </div>
              {/* Floating Magnifying glass */}
              <div className="absolute -bottom-1 -right-1 z-20 p-2 rounded-full bg-white shadow-md border border-[#DCE7F6] text-[#2563EB]">
                <Search className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-[#07133D]">No research activity yet</h3>
            <p className="text-xs text-[#556987] mt-1 max-w-[280px]">
              Start a new research query to see your activity over time.
            </p>
          </div>
        </motion.div>

        {/* Top Research Topics Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[300px]"
        >
          <div>
            <h2 className="text-base font-bold text-[#07133D]">Top Research Topics</h2>
            <p className="text-xs text-[#556987] mt-0.5">Topics you explore the most.</p>
          </div>

          {/* Empty State Illustration & Message */}
          <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
            {/* Document with sprout illustration */}
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
          </div>
        </motion.div>
      </div>

      {/* ── Bottom 3-Card Row (Papers by Source, Research Areas, Saved Papers) ─ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Card 1: Papers by Source */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[260px]"
        >
          <div>
            <h2 className="text-sm font-bold text-[#07133D]">Papers by Source</h2>
            <p className="text-xs text-[#556987] mt-0.5">Sources you use the most.</p>
          </div>

          <div className="flex flex-col items-center justify-center my-auto py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF4FD] text-[#2563EB] flex items-center justify-center mb-3">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#07133D]">No source data yet</h3>
            <p className="text-xs text-[#556987] mt-1 max-w-[220px]">
              Start researching to see which sources you use most.
            </p>
          </div>
        </motion.div>

        {/* Card 2: Research Areas */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[260px]"
        >
          <div>
            <h2 className="text-sm font-bold text-[#07133D]">Research Areas</h2>
            <p className="text-xs text-[#556987] mt-0.5">Distribution of your research interests.</p>
          </div>

          <div className="flex flex-col items-center justify-center my-auto py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF4FD] text-[#2563EB] flex items-center justify-center mb-3">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#07133D]">No research areas yet</h3>
            <p className="text-xs text-[#556987] mt-1 max-w-[220px]">
              Your research areas will appear here after you start exploring.
            </p>
          </div>
        </motion.div>

        {/* Card 3: Saved Papers */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE7F6] p-6 shadow-xs flex flex-col justify-between min-h-[260px]"
        >
          <div>
            <h2 className="text-sm font-bold text-[#07133D]">Saved Papers</h2>
            <p className="text-xs text-[#556987] mt-0.5">Your library growth over time.</p>
          </div>

          <div className="flex flex-col items-center justify-center my-auto py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF4FD] text-[#2563EB] flex items-center justify-center mb-3">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#07133D]">No saved papers yet</h3>
            <p className="text-xs text-[#556987] mt-1 max-w-[220px]">
              Save interesting papers to see your library growth.
            </p>
          </div>
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
              Ready to see your insights?
            </h4>
            <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
              Start a research query, save papers, and explore topics to unlock your personal analytics.
            </p>
          </div>
        </div>

        <button
          onClick={onStartResearch}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Start a New Research</span>
        </button>
      </motion.div>
    </motion.main>
  );
}
