"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  Search,
  ArrowUpDown,
  ChevronDown,
  ArrowRight,
  Sparkles,
  FileText,
  Compass,
  Library,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SavedPapersPageProps {
  onStartResearch?: () => void;
  onExploreTopics?: () => void;
  onGoToLibrary?: () => void;
}

type FilterTab = "all" | "unread" | "read" | "favorites" | "notes";

/* ΓöÇΓöÇΓöÇ Animated Paper & Plane Illustration ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
function SavedPapersIllustration() {
  return (
    <div className="relative w-80 h-56 flex items-center justify-center select-none mx-auto mb-2">
      {/* Decorative Sparkle 1 (Top Left) */}
      <motion.div
        className="absolute left-10 top-12 text-blue-300"
        animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>

      {/* Decorative Marks (Left Dotted Burst) */}
      <svg
        className="absolute left-12 top-18 text-blue-200"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M4 12H1M7 6L5 4M7 18L5 20" />
      </svg>

      {/* Center Papers Stack */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Back Paper 1 (Left tilted) */}
        <motion.div
          className="absolute -left-12 -top-6 w-28 h-36 bg-white/90 rounded-2xl shadow-[0_8px_24px_rgba(30,60,120,0.06)] border border-slate-100 p-3.5 flex flex-col gap-2 rotate-[-12deg]"
          animate={{ rotate: [-12, -10, -12], y: [-2, 2, -2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-10 h-1.5 bg-blue-100 rounded-full" />
          <div className="w-20 h-1 bg-slate-100 rounded-full" />
          <div className="w-16 h-1 bg-slate-100 rounded-full" />
          <div className="w-14 h-1 bg-slate-100 rounded-full" />
        </motion.div>

        {/* Back Paper 2 (Right tilted) */}
        <motion.div
          className="absolute -right-10 -top-4 w-28 h-36 bg-white/90 rounded-2xl shadow-[0_8px_24px_rgba(30,60,120,0.06)] border border-slate-100 p-3.5 flex flex-col gap-2 rotate-[10deg]"
          animate={{ rotate: [10, 8, 10], y: [2, -2, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-1.5 bg-blue-100 rounded-full" />
          <div className="w-18 h-1 bg-slate-100 rounded-full" />
          <div className="w-14 h-1 bg-slate-100 rounded-full" />
          <div className="w-16 h-1 bg-slate-100 rounded-full" />
        </motion.div>

        {/* Front Paper (Upright, with Bookmark) */}
        <motion.div
          className="relative w-34 h-44 bg-white rounded-2xl shadow-[0_16px_36px_rgba(37,99,235,0.12)] border border-blue-100/80 p-4 flex flex-col justify-between"
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
        >
          {/* Blue Bookmark Ribbon in Top-Right of Paper */}
          <div className="absolute -top-1.5 right-4 w-6 h-9 z-20">
            <svg viewBox="0 0 24 34" fill="none" className="w-full h-full drop-shadow-sm">
              <path
                d="M0 0H24V32L12 25L0 32V0Z"
                fill="#2563EB"
              />
            </svg>
          </div>

          {/* Paper Content Lines */}
          <div className="space-y-2.5 pt-1">
            <div className="w-14 h-2 bg-blue-100 rounded-full" />
            <div className="w-22 h-1.5 bg-slate-100 rounded-full" />
            <div className="w-20 h-1.5 bg-slate-100 rounded-full" />
            <div className="w-18 h-1.5 bg-slate-100 rounded-full" />
            <div className="w-22 h-1.5 bg-slate-100 rounded-full" />
          </div>

          {/* Bottom subtle detail */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
            <span className="w-2 h-2 rounded-full bg-blue-400/60" />
            <span className="w-12 h-1 bg-slate-100 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Floating Paper Airplane & Flight Trail (Top Right) */}
      <motion.div
        className="absolute right-4 top-4 z-20"
        animate={{ y: [-4, 4, -4], x: [-2, 3, -2], rotate: [-2, 3, -2] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="text-[#3B82F6] drop-shadow-md"
        >
          <path
            d="M44 4L22 26M44 4L30 44L22 26M44 4L4 18L22 26"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(59,130,246,0.18)"
          />
        </svg>
      </motion.div>

      {/* Dotted Flight Trail */}
      <svg
        className="absolute right-12 top-14 w-28 h-20 text-blue-300/80 pointer-events-none"
        viewBox="0 0 110 80"
        fill="none"
      >
        <path
          d="M10 65C30 75 60 70 80 40C90 25 95 15 100 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function SavedPapersPage({
  onStartResearch,
  onExploreTopics,
  onGoToLibrary,
}: SavedPapersPageProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Most Recent");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const filterTabs = [
    { id: "all" as const, label: "All Papers" },
    { id: "unread" as const, label: "Unread" },
    { id: "read" as const, label: "Read" },
    { id: "favorites" as const, label: "Favorites" },
    { id: "notes" as const, label: "With Notes" },
  ];

  const sortOptions = ["Most Recent", "Oldest First", "Title A-Z", "Citation Count"];

  return (
    <motion.main
      className="w-full h-full min-h-0 min-w-0 flex-1 relative flex flex-col overflow-y-auto px-4 sm:px-6 lg:px-8 py-7 select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Your saved papers"
    >
      {/* ΓöÇΓöÇ Soft Atmospheric Ambient Gradient + Mountain Landscape ΓöÇΓöÇΓöÇ */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #F0F6FE 0%, #EEF4FD 28%, #F7FAFE 60%, #EBF3FD 100%)",
          }}
        />

        {/* Panoramic mountain peaks across bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[420px] opacity-[0.22] pointer-events-none">
          <Image
            src="/images/hero-bg.webp"
            alt=""
            fill
            unoptimized
            priority
            className="object-cover object-bottom"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(238,244,253,0.3) 0%, rgba(238,244,253,0.92) 80%, #EEF4FD 100%)",
            }}
          />
        </div>

        <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-blue-200/20 rounded-full blur-[110px]" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[350px] bg-sky-200/25 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1360px] mx-auto space-y-7 pb-12">
        {/* ΓöÇΓöÇ Top Header Section ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        <div className="space-y-1 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#556987]">
            SAVED PAPERS
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#07133D] tracking-tight leading-tight">
            Your Saved Papers
          </h1>
          <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
            Keep track of important papers, read them later, add notes, and organize them with tags.
          </p>
        </div>

        {/* ΓöÇΓöÇ Filter / Search Toolbar Row ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          {/* Left: 5 Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0" style={{ scrollbarWidth: "none" }}>
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "bg-white/80 text-[#556987] hover:bg-white hover:text-[#07133D] border border-[#DCE7F5]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right: Search + Sort Dropdown */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 flex items-center bg-white/90 border border-[#DCE7F6] rounded-full px-3.5 py-1.5 shadow-2xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all">
              <Search className="w-3.5 h-3.5 text-[#6B80A8] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved papers..."
                className="w-full bg-transparent text-xs text-[#07133D] placeholder-[#8EA3C0] outline-none focus:outline-none focus:ring-0 border-none font-normal"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DCE7F6] text-xs font-semibold text-[#07133D] hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                <span>{sortOption}</span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              {/* Sort Menu */}
              <AnimatePresence>
                {sortMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 p-1 z-30 overflow-hidden"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSortOption(opt);
                          setSortMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          sortOption === opt
                            ? "bg-blue-50 text-[#2563EB] font-semibold"
                            : "text-[#334155] hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ΓöÇΓöÇ Main Empty State Glass Card ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        <motion.div
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-[#E2EAF5] shadow-[0_4px_30px_rgba(32,93,248,0.06),0_1px_3px_rgba(0,0,0,0.03)] px-6 sm:px-12 py-12 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Central 3D Animated Illustration */}
          <SavedPapersIllustration />

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#07133D] tracking-tight mb-2">
            No saved papers yet
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#556987] max-w-md mx-auto leading-relaxed mb-6 font-normal">
            When you find interesting papers during your research, save them here to keep track, read later, and organize with tags.
          </p>

          {/* CTA Button: "Start Exploring Papers" with Bookmark icon */}
          <div className="flex justify-center mb-8">
            <motion.button
              type="button"
              onClick={onStartResearch}
              className="px-6 py-3 rounded-2xl text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(37,99,235,0.38)] cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 28px rgba(37,99,235,0.48)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Bookmark className="w-4 h-4 fill-white" strokeWidth={2.4} />
              <span>Start Exploring Papers</span>
            </motion.button>
          </div>

          {/* "Or try these actions" Divider */}
          <div className="relative max-w-lg mx-auto flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80" />
            </div>
            <span className="relative bg-white px-4 text-[11px] font-semibold text-[#8DA0BC] uppercase tracking-wider">
              Or try these actions
            </span>
          </div>

          {/* 3 Action Cards (Horizontal Row) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
            {/* Card 1: Start a New Research */}
            <motion.button
              type="button"
              onClick={onStartResearch}
              className="p-4 rounded-2xl bg-white/95 border border-[#E2EAF5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="w-4.5 h-4.5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors leading-tight">
                    Start a New Research
                  </h3>
                  <p className="text-[11px] text-[#64748B] leading-tight mt-0.5 truncate">
                    Discover relevant papers on any topic.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Card 2: Explore Topics */}
            <motion.button
              type="button"
              onClick={onExploreTopics}
              className="p-4 rounded-2xl bg-white/95 border border-[#E2EAF5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-4.5 h-4.5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors leading-tight">
                    Explore Topics
                  </h3>
                  <p className="text-[11px] text-[#64748B] leading-tight mt-0.5 truncate">
                    Browse trending research areas.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Card 3: Go to Library */}
            <motion.button
              type="button"
              onClick={onGoToLibrary}
              className="p-4 rounded-2xl bg-white/95 border border-[#E2EAF5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 group-hover:scale-105 transition-transform">
                  <Library className="w-4.5 h-4.5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors leading-tight">
                    Go to Library
                  </h3>
                  <p className="text-[11px] text-[#64748B] leading-tight mt-0.5 truncate">
                    Organize your research projects.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
