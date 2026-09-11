"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Share2,
  Download,
  Plus,
  ChevronDown,
  ExternalLink,
  FileText as FileTextIcon,
  Loader2,
  Calendar,
  Hash,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  RotateCcw,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { searchPapers } from "@/lib/search-service";
import type { ResearchPaper, FullResearchReport } from "@/types/research-paper";
import PaperCard from "@/components/dashboard/PaperCard";
import ResearchGapExplorer from "@/components/dashboard/ResearchGapExplorer";
import {
  ResearchTrendsView,
  MethodsComparisonView,
  DatasetsAnalysisView,
  LiteratureReviewView,
  CitationsView,
} from "@/components/dashboard/ResearchIntelligenceViews";

const TABS = [
  "Overview",
  "Papers",
  "Methods",
  "Datasets",
  "Trends",
  "Citations",
  "Gaps",
];

const EXAMPLE_CHIPS = [
  "AI in healthcare",
  "Climate change",
  "Crop disease detection",
  "Transformer models",
];

const YEAR_PRESETS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const LIMIT_OPTIONS = [5, 10, 15, 20, 30, 50];

interface ResearchPageProps {
  searchQuery?: string;
  onBack?: () => void;
  onStartNewResearch?: () => void;
  onExampleSearch?: (query: string) => void;
}

/* ─── Animated SVG Illustration ─────────────────────────────────────── */
function ResearchIllustration() {
  return (
    <div className="relative w-56 h-56 flex items-center justify-center select-none">
      {/* Sparkle — top left */}
      <motion.div
        className="absolute top-1 left-8 pointer-events-none"
        animate={{ y: [-4, 4, -4], rotate: [0, 12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 2L13.8 9.2L21 12L13.8 14.8L12 22L10.2 14.8L3 12L10.2 9.2L12 2Z"
            fill="#93B4FF"
          />
        </svg>
      </motion.div>

      {/* Sparkle — top right */}
      <motion.div
        className="absolute top-5 right-6 pointer-events-none"
        animate={{ y: [4, -4, 4], rotate: [0, -15, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15">
          <path
            d="M7.5 1L9 6L14 7.5L9 9L7.5 14L6 9L1 7.5L6 6L7.5 1Z"
            fill="#205DF8"
            opacity="0.55"
          />
        </svg>
      </motion.div>

      {/* Document card */}
      <motion.div
        className="absolute left-3 top-6"
        style={{ rotate: -7 }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-28 h-36 bg-white rounded-2xl border border-[#C8D9F0] shadow-[0_8px_28px_rgba(32,93,248,0.09)] p-3.5 flex flex-col gap-2">
          <div className="h-1.5 bg-[#B5CCEF] rounded-full w-full" />
          <div className="h-1.5 bg-[#B5CCEF] rounded-full w-4/5" />
          <div className="mt-1 h-1.5 bg-[#DDE9F8] rounded-full w-full" />
          <div className="h-1.5 bg-[#DDE9F8] rounded-full w-11/12" />
          <div className="h-1.5 bg-[#DDE9F8] rounded-full w-3/4" />
          <div className="h-1.5 bg-[#DDE9F8] rounded-full w-full" />
          <div className="h-1.5 bg-[#DDE9F8] rounded-full w-2/3" />
          <div className="h-1.5 bg-[#DDE9F8] rounded-full w-full" />
          <div className="h-1.5 bg-[#DDE9F8] rounded-full w-5/6" />
        </div>
      </motion.div>

      {/* Magnifying glass */}
      <motion.div
        className="absolute right-1 bottom-4 z-10"
        animate={{ y: [-2, 3, -2] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="34" cy="34" r="27" fill="#EEF3FF" />
          <circle
            cx="34"
            cy="34"
            r="27"
            stroke="#205DF8"
            strokeWidth="5.5"
            fill="none"
          />
          <circle cx="34" cy="34" r="19" fill="white" opacity="0.45" />
          <line
            x1="54"
            y1="54"
            x2="75"
            y2="76"
            stroke="#205DF8"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}



/* ─── Main Component ─────────────────────────────────────────────────── */
export default function ResearchPage({
  searchQuery,
  onBack,
  onStartNewResearch,
  onExampleSearch,
}: ResearchPageProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [paperLimit, setPaperLimit] = useState<number>(15);
  const [sortBy, setSortBy] = useState<"relevance" | "citations">("relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [openDropdown, setOpenDropdown] = useState<"year" | "limit" | "sort" | "order" | null>(null);
  const [customYearInput, setCustomYearInput] = useState("");
  const [researchReport, setResearchReport] = useState<FullResearchReport | null>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);

  const hasActiveFilters =
    selectedYear !== null ||
    paperLimit !== 15 ||
    sortBy !== "relevance" ||
    sortOrder !== "desc";

  const handleResetFilters = () => {
    setSelectedYear(null);
    setPaperLimit(15);
    setSortBy("relevance");
    setSortOrder("desc");
    setCustomYearInput("");
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-dropdown-container]")) return;
      setOpenDropdown(null);
    };
    if (openDropdown) {
      document.addEventListener("mousedown", handleGlobalClick);
      return () => document.removeEventListener("mousedown", handleGlobalClick);
    }
  }, [openDropdown]);

  // Fetch papers when searchQuery, selectedYear, paperLimit, or sortBy changes
  useEffect(() => {
    if (!searchQuery?.trim()) return;

    let cancelled = false;

    async function doSearch() {
      setLoading(true);
      setSearchError(null);
      setPapers([]);
      setResearchReport(null);
      setHasSearched(true);

      const result = await searchPapers(searchQuery!, {
        year: selectedYear,
        limit: paperLimit,
        sortBy,
        sortOrder,
      });

      if (cancelled) return;

      setPapers(result.papers);
      setTotalResults(result.totalResults);
      setSearchError(result.error);
      setLoading(false);

      // Trigger cross-paper research intelligence (Agents 2, 3, 4) in background
      if (result.papers.length > 0) {
        setIntelligenceLoading(true);
        fetch("/api/agents/orchestrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            papers: result.papers,
          }),
        })
          .then((res) => res.json())
          .then((report) => {
            if (!cancelled && report && !report.error) {
              setResearchReport(report);
            }
          })
          .catch((err) => {
            console.warn("Intelligence background fetch:", err);
          })
          .finally(() => {
            if (!cancelled) setIntelligenceLoading(false);
          });
      }
    }

    doSearch();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedYear, paperLimit, sortBy, sortOrder]);

  const hasPapers = papers.length > 0;

  return (
    <motion.main
      className="w-full h-full min-h-0 min-w-0 flex-1 relative flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Research Intelligence workspace"
    >
      {/* ── Atmospheric Background ───────────────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #EBF2FA 0%, #EEF4FD 30%, #F4F8FE 55%, #E2EDFA 100%)",
          }}
        />
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero-bg.webp"
            alt=""
            fill
            unoptimized
            className="object-cover object-bottom opacity-30"
            sizes="100vw"
          />
        </div>
        <div
          className="absolute top-0 left-0 right-0 h-48"
          style={{
            background:
              "linear-gradient(to bottom, rgba(235,242,250,0.7) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Page Content ─────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col h-full px-4 sm:px-8 pt-7 pb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Back link */}
        <motion.button
          variants={fadeUp}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[#556987] hover:text-[#07133D] mb-5 self-start group cursor-pointer transition-colors duration-200"
          aria-label="Back to Research home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Research
        </motion.button>

        {/* Header row */}
        <motion.div
          variants={fadeUp}
          className="relative flex items-start mb-5"
        >
          <div className="flex-1 min-w-0 pr-4 sm:pr-36">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#07133D] tracking-tight leading-tight mb-2">
              Research Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-[#556987] leading-relaxed max-w-xl">
              {searchQuery
                ? <>Showing results for <span className="font-semibold text-[#07133D]">&ldquo;{searchQuery}&rdquo;</span></>
                : "Your research results will appear here after analyzing your query. Explore papers, key insights, methodologies, trends, citations, and research gaps — all in one place."}
            </p>
          </div>

          {/* Handwriting doodle */}
          <motion.div
            className="hidden md:block absolute top-0 right-0 select-none"
            style={{ rotate: 8 }}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col items-end">
              <span
                className="text-[#205DF8] font-bold text-[16px] sm:text-[17px] leading-tight text-right"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Knowledge
                <br />
                today:
                <br />a brighter
                <br />
                tomorrow.
              </span>
              <svg
                width="34"
                height="40"
                viewBox="0 0 34 40"
                fill="none"
                className="mt-0.5 mr-2"
              >
                <path
                  d="M6 3 C9 16 22 24 28 34"
                  stroke="#205DF8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M24 30 L28 34 L22 36"
                  stroke="#205DF8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Tab bar + actions */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 mb-5 flex-wrap"
        >
          {/* Tab buttons */}
          <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar py-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#205DF8]/40 shrink-0 ${
                  activeTab === tab
                    ? "text-[#07133D]"
                    : "text-[#556987] hover:text-[#07133D] hover:bg-white/60"
                }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="research-tab-bg"
                    className="absolute inset-0 rounded-full bg-white"
                    style={{
                      boxShadow:
                        "0 1px 4px rgba(30,60,120,0.08), 0 0 0 1px rgba(32,93,248,0.08)",
                    }}
                    transition={{ type: "spring", damping: 26, stiffness: 320 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Share + Export */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#556987] hover:text-[#07133D] hover:bg-white/70 transition-all duration-200 cursor-pointer border border-transparent hover:border-[#DDE8F4]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#556987] hover:text-[#07133D] bg-white/80 border border-[#DDE8F4] hover:border-[#B8CCE8] transition-all duration-200 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 hidden sm:block" />
            </button>
          </div>
        </motion.div>

        {/* ── Filter Bar ────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="relative z-20 flex items-center gap-2 mb-4 flex-wrap select-none"
          data-dropdown-container
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/75 border border-[#DCE7F6] text-xs font-semibold text-[#556987] shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#205DF8]" />
            <span className="hidden sm:inline">Filters</span>
          </div>

          {/* Sort By Dropdown (Default: Latest) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border shadow-xs ${
                sortBy !== "relevance"
                  ? "bg-[#EEF3FF] border-[#B9D2F8] text-[#205DF8] font-semibold"
                  : "bg-white/80 border-[#DCE7F6] text-[#475467] hover:text-[#07133D] hover:bg-white"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#205DF8]" />
              <span>
                Sort: <strong className="text-[#07133D] font-semibold">{sortBy === "relevance" ? "Relevance" : "Citations"}</strong>
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${openDropdown === "sort" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "sort" && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white/95 backdrop-blur-xl border border-[#DCE7F6] rounded-xl shadow-[0_8px_30px_rgba(20,40,90,0.12)] p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-[#8DA0BC] uppercase tracking-wider px-2 py-1">
                  Sort Criterion
                </div>
                <div className="space-y-0.5">
                  {[
                    { id: "relevance", label: "🎯 Most Relevant (Default)" },
                    { id: "citations", label: "⭐ Most Cited" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.id as "relevance" | "citations");
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        sortBy === opt.id
                          ? "bg-[#EEF3FF] text-[#205DF8] font-semibold"
                          : "text-[#475467] hover:bg-[#F2F6FC]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ascending / Descending Order Dropdown (Beside Sort Filter) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "order" ? null : "order")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border shadow-xs ${
                sortOrder !== "desc"
                  ? "bg-[#EEF3FF] border-[#B9D2F8] text-[#205DF8] font-semibold"
                  : "bg-white/80 border-[#DCE7F6] text-[#475467] hover:text-[#07133D] hover:bg-white"
              }`}
              title={`Order: ${sortOrder === "desc" ? "Descending (High to Low / Newest first)" : "Ascending (Low to High / Oldest first)"}`}
            >
              {sortOrder === "desc" ? (
                <ArrowDownWideNarrow className="w-3.5 h-3.5 text-[#205DF8]" />
              ) : (
                <ArrowUpWideNarrow className="w-3.5 h-3.5 text-[#205DF8]" />
              )}
              <span>
                Order: <strong className="text-[#07133D] font-semibold">{sortOrder === "desc" ? "Descending" : "Ascending"}</strong>
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${openDropdown === "order" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "order" && (
              <div className="absolute left-0 mt-1.5 w-52 bg-white/95 backdrop-blur-xl border border-[#DCE7F6] rounded-xl shadow-[0_8px_30px_rgba(20,40,90,0.12)] p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-[#8DA0BC] uppercase tracking-wider px-2 py-1">
                  Sort Direction
                </div>
                <div className="space-y-0.5">
                  {[
                    {
                      id: "desc",
                      label: "Descending",
                      desc: "High to Low · Newest first",
                      icon: ArrowDownWideNarrow,
                    },
                    {
                      id: "asc",
                      label: "Ascending",
                      desc: "Low to High · Oldest first",
                      icon: ArrowUpWideNarrow,
                    },
                  ].map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortOrder(opt.id as "asc" | "desc");
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                          sortOrder === opt.id
                            ? "bg-[#EEF3FF] text-[#205DF8] font-semibold"
                            : "text-[#475467] hover:bg-[#F2F6FC]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComp className="w-3.5 h-3.5 text-[#205DF8] shrink-0" />
                          <div className="flex flex-col">
                            <span>{opt.label}</span>
                            <span className="text-[10px] text-[#8DA0BC] font-normal">{opt.desc}</span>
                          </div>
                        </div>
                        {sortOrder === opt.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Year Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "year" ? null : "year")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border shadow-xs ${
                selectedYear !== null
                  ? "bg-[#EEF3FF] border-[#B9D2F8] text-[#205DF8] font-semibold"
                  : "bg-white/80 border-[#DCE7F6] text-[#475467] hover:text-[#07133D] hover:bg-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#205DF8]" />
              <span>{selectedYear ? `Year: ${selectedYear}` : "All Years"}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${openDropdown === "year" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "year" && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white/95 backdrop-blur-xl border border-[#DCE7F6] rounded-xl shadow-[0_8px_30px_rgba(20,40,90,0.12)] p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-[#8DA0BC] uppercase tracking-wider px-2 py-1">
                  Publication Year
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedYear(null);
                    setOpenDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                    selectedYear === null
                      ? "bg-[#EEF3FF] text-[#205DF8] font-semibold"
                      : "text-[#475467] hover:bg-[#F2F6FC]"
                  }`}
                >
                  <span>All Years</span>
                  {selectedYear === null && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="h-px bg-[#EBF0F8] my-1" />
                <div className="max-h-36 overflow-y-auto space-y-0.5 pr-0.5">
                  {YEAR_PRESETS.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setSelectedYear(yr);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        selectedYear === yr
                          ? "bg-[#EEF3FF] text-[#205DF8] font-semibold"
                          : "text-[#475467] hover:bg-[#F2F6FC]"
                      }`}
                    >
                      <span>{yr}</span>
                      {selectedYear === yr && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-[#EBF0F8] my-1" />
                {/* Custom year input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = parseInt(customYearInput.trim());
                    if (val >= 1900 && val <= 2100) {
                      setSelectedYear(val);
                      setCustomYearInput("");
                      setOpenDropdown(null);
                    }
                  }}
                  className="flex items-center gap-1 pt-1"
                >
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="Custom (e.g. 2019)"
                    value={customYearInput}
                    onChange={(e) => setCustomYearInput(e.target.value)}
                    className="w-full text-xs px-2 py-1 rounded-lg border border-[#DCE7F6] focus:outline-none focus:ring-1 focus:ring-[#205DF8] bg-white"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 text-xs bg-[#205DF8] text-white rounded-lg font-medium hover:bg-[#1A4ED4] transition-colors cursor-pointer"
                  >
                    Go
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Number of Papers Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "limit" ? null : "limit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border shadow-xs ${
                paperLimit !== 15
                  ? "bg-[#EEF3FF] border-[#B9D2F8] text-[#205DF8] font-semibold"
                  : "bg-white/80 border-[#DCE7F6] text-[#475467] hover:text-[#07133D] hover:bg-white"
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-[#205DF8]" />
              <span>Show: <strong className="text-[#07133D] font-semibold">{paperLimit}</strong> papers</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${openDropdown === "limit" ? "rotate-180" : ""}`} />
            </button>

            {openDropdown === "limit" && (
              <div className="absolute left-0 mt-1.5 w-40 bg-white/95 backdrop-blur-xl border border-[#DCE7F6] rounded-xl shadow-[0_8px_30px_rgba(20,40,90,0.12)] p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-[#8DA0BC] uppercase tracking-wider px-2 py-1">
                  Papers Count
                </div>
                <div className="space-y-0.5">
                  {LIMIT_OPTIONS.map((lim) => (
                    <button
                      key={lim}
                      type="button"
                      onClick={() => {
                        setPaperLimit(lim);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        paperLimit === lim
                          ? "bg-[#EEF3FF] text-[#205DF8] font-semibold"
                          : "text-[#475467] hover:bg-[#F2F6FC]"
                      }`}
                    >
                      <span>{lim} papers</span>
                      {paperLimit === lim && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#6B7FA2] hover:text-[#DC2626] hover:bg-red-50/70 border border-transparent hover:border-red-100 transition-all duration-200 cursor-pointer shadow-2xs"
              title="Reset all filters to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </motion.div>

        {/* Main panel — either loading, results, or empty state */}
        <motion.div
          variants={fadeUp}
          className="flex-1 flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.86)",
            boxShadow: "0 4px 24px rgba(30,60,120,0.05)",
          }}
        >
          <AnimatePresence mode="wait">
            {/* Loading state */}
            {loading ? (
              <motion.div
                key="loading"
                className="flex-1 flex flex-col items-center justify-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-8 h-8 text-[#205DF8] animate-spin mb-4" />
                <p className="text-sm font-medium text-[#556987]">
                  Searching academic papers...
                </p>
                <p className="text-xs text-[#8DA0BC] mt-1">
                  Querying OpenAlex for &ldquo;{searchQuery}&rdquo;
                </p>
              </motion.div>
            ) : hasPapers ? (
              /* Results state */
              <motion.div
                key="results"
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Results header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-medium text-[#6B7FA2]">
                      Found <span className="font-bold text-[#07133D]">{totalResults.toLocaleString()}</span> papers
                      {" · "}Showing <span className="font-bold text-[#07133D]">{papers.length}</span>
                      {" · "}Sorted by <span className="font-semibold text-[#205DF8]">{sortBy === "relevance" ? "Relevance" : "Citations"} ({sortOrder === "desc" ? "Desc" : "Asc"})</span>
                      {researchReport?.researchIntelligence?.potentialGaps && (
                        <span>{" · "}<strong className="text-[#205DF8]">{researchReport.researchIntelligence.potentialGaps.length}</strong> Gaps Identified</span>
                      )}
                    </p>
                    {selectedYear && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF3FF] text-[#205DF8] border border-[#DCE7F6]">
                        📅 {selectedYear}
                        <button
                          type="button"
                          onClick={() => setSelectedYear(null)}
                          className="hover:text-red-500 ml-0.5 cursor-pointer font-bold leading-none"
                          title="Clear year filter"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                  {searchError && (
                    <span className="text-[11px] text-amber-600 font-medium">
                      ⚠ {searchError}
                    </span>
                  )}
                </div>

                {/* Tab Views */}
                {activeTab === "Papers" && (
                  <div className="space-y-3">
                    {papers.map((paper, idx) => (
                      <PaperCard
                        key={paper.id}
                        paper={paper}
                        index={idx}
                        onSelectTopic={onExampleSearch}
                      />
                    ))}
                  </div>
                )}

                {activeTab === "Gaps" && (
                  intelligenceLoading && !researchReport ? (
                    <div className="py-16 text-center">
                      <Loader2 className="w-7 h-7 text-[#205DF8] animate-spin mx-auto mb-3" />
                      <p className="text-xs font-semibold text-[#07133D]">Synthesizing Potential Research Gaps...</p>
                      <p className="text-[11px] text-[#6B7FA2] mt-1">Cross-referencing limitations and future work across analyzed papers (Agent 3)</p>
                    </div>
                  ) : (
                    <ResearchGapExplorer
                      gaps={researchReport?.researchIntelligence?.potentialGaps || []}
                      query={searchQuery}
                    />
                  )
                )}

                {activeTab === "Trends" && (
                  intelligenceLoading && !researchReport ? (
                    <div className="py-16 text-center">
                      <Loader2 className="w-7 h-7 text-[#205DF8] animate-spin mx-auto mb-3" />
                      <p className="text-xs font-semibold text-[#07133D]">Extracting Cross-Paper Trends...</p>
                      <p className="text-[11px] text-[#6B7FA2] mt-1">Analyzing architectural and benchmark trajectories</p>
                    </div>
                  ) : (
                    <ResearchTrendsView intelligence={researchReport?.researchIntelligence!} />
                  )
                )}

                {activeTab === "Methods" && (
                  intelligenceLoading && !researchReport ? (
                    <div className="py-16 text-center">
                      <Loader2 className="w-7 h-7 text-[#205DF8] animate-spin mx-auto mb-3" />
                      <p className="text-xs font-semibold text-[#07133D]">Comparing Methodologies...</p>
                    </div>
                  ) : (
                    <MethodsComparisonView intelligence={researchReport?.researchIntelligence!} />
                  )
                )}

                {activeTab === "Datasets" && (
                  intelligenceLoading && !researchReport ? (
                    <div className="py-16 text-center">
                      <Loader2 className="w-7 h-7 text-[#205DF8] animate-spin mx-auto mb-3" />
                      <p className="text-xs font-semibold text-[#07133D]">Analyzing Dataset Landscape...</p>
                    </div>
                  ) : (
                    <DatasetsAnalysisView intelligence={researchReport?.researchIntelligence!} />
                  )
                )}

                {activeTab === "Citations" && (
                  intelligenceLoading && !researchReport ? (
                    <div className="py-16 text-center">
                      <Loader2 className="w-7 h-7 text-[#205DF8] animate-spin mx-auto mb-3" />
                      <p className="text-xs font-semibold text-[#07133D]">Compiling Citation Mapping...</p>
                    </div>
                  ) : (
                    <CitationsView review={researchReport?.literatureReview!} />
                  )
                )}

                {activeTab === "Overview" && (
                  <div className="space-y-5">
                    {intelligenceLoading && !researchReport && (
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2 text-xs text-[#205DF8]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing Literature Review across {papers.length} papers in background...</span>
                      </div>
                    )}
                    {researchReport?.literatureReview && (
                      <LiteratureReviewView review={researchReport.literatureReview} />
                    )}
                    <div className="pt-3 border-t border-[#DCE7F6]">
                      <h3 className="text-xs font-bold text-[#07133D] mb-3 uppercase tracking-wide">
                        Discovered Literature ({papers.length} Papers)
                      </h3>
                      <div className="space-y-3">
                        {papers.map((paper, idx) => (
                          <PaperCard
                            key={paper.id}
                            paper={paper}
                            index={idx}
                            onSelectTopic={onExampleSearch}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                key={`empty-${activeTab}`}
                className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6 sm:px-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Show error if search returned nothing */}
                {hasSearched && searchError ? (
                  <>
                    <p className="text-sm font-medium text-[#556987] mb-2">
                      Search encountered an issue
                    </p>
                    <p className="text-xs text-[#8DA0BC] mb-6 max-w-xs">
                      {searchError}
                    </p>
                  </>
                ) : hasSearched ? (
                  <>
                    <p className="text-sm font-medium text-[#556987] mb-2">
                      No papers found for this query
                    </p>
                    <p className="text-xs text-[#8DA0BC] mb-6 max-w-xs">
                      Try using different keywords or broader search terms.
                    </p>
                  </>
                ) : null}

                {/* Illustration */}
                <ResearchIllustration />

                {/* Copy */}
                <h2 className="text-xl sm:text-2xl font-bold text-[#07133D] mb-3 mt-2">
                  {hasSearched ? "Try a different search" : "No research results yet"}
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7FA2] leading-relaxed mb-8 max-w-xs">
                  Start by entering a research question on the Research page. Your
                  analyzed results will appear here, including papers, insights,
                  trends, and research gaps.
                </p>

                {/* CTA */}
                <motion.button
                  type="button"
                  onClick={onStartNewResearch}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold cursor-pointer transition-shadow duration-200 mb-6"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    boxShadow: "0 4px 18px rgba(32,93,248,0.32)",
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 8px 28px rgba(32,93,248,0.38)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Start New Research
                </motion.button>

                {/* Example chips */}
                <div className="flex flex-col items-center gap-2.5 w-full max-w-sm">
                  <div
                    className="w-full h-px"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(180,200,230,0.6), transparent)",
                    }}
                  />
                  <span className="text-xs text-[#8DA0BC]">Or try an example</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {EXAMPLE_CHIPS.map((chip) => (
                      <motion.button
                        key={chip}
                        type="button"
                        onClick={() => onExampleSearch?.(chip)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#465E87] hover:text-[#205DF8] bg-white/85 hover:bg-white border border-[#DDE8F4] hover:border-[#B2C4E0] shadow-xs transition-all duration-200 cursor-pointer"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
