"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Share2,
  Download,
  Plus,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/animations";

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

interface ResearchPageProps {
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
  onBack,
  onStartNewResearch,
  onExampleSearch,
}: ResearchPageProps) {
  const [activeTab, setActiveTab] = useState("Overview");

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
              Your research results will appear here after analyzing your query.
              Explore papers, key insights, methodologies, trends, citations,
              and research gaps — all in one place.
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
          <div className="flex items-center flex-wrap gap-0.5 flex-1 min-w-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#205DF8]/40 ${
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

        {/* Main panel — empty state */}
        <motion.div
          variants={fadeUp}
          className="flex-1 flex flex-col items-center justify-center rounded-2xl py-12 px-6 sm:px-10 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.86)",
            boxShadow: "0 4px 24px rgba(30,60,120,0.05)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`empty-${activeTab}`}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Illustration */}
              <ResearchIllustration />

              {/* Copy */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#07133D] mb-3 mt-2">
                No research results yet
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
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
