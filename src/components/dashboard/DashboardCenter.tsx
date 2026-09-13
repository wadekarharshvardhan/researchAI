"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface DashboardCenterProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

const exampleQueries = [
  "AI in healthcare",
  "Climate change",
  "Crop disease detection",
  "Transformer models",
];

export default function DashboardCenter({ initialQuery = "", onSearch }: DashboardCenterProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!query.trim()) return;
      console.log("Searching:", query);
      onSearch?.(query);
    },
    [query, onSearch]
  );

  return (
    <main
      className="w-full h-full min-h-0 min-w-0 flex-1 relative flex flex-col justify-between overflow-y-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-6 select-none"
      aria-label="Dashboard research workspace"
    >
      {/* ── Background Landscape ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {/* Soft atmospheric gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #EBF2FA 0%, #EEF4FD 30%, #F4F8FE 55%, #E2EDFA 100%)",
          }}
        />

        {/* 2.5K Ultra High-Resolution Landscape */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero-bg.webp"
            alt="Mountain landscape background"
            fill
            priority
            unoptimized
            className="object-cover object-bottom"
            sizes="100vw"
          />
        </div>

        {/* Soft top gradient blend */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(235, 242, 250, 0.4) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Main Center Content ───────────────────────────────── */}
      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center my-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Top Eyebrow */}
        <motion.p
          className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-2.5 text-[#556987]"
          variants={fadeUp}
        >
          New Research
        </motion.p>

        {/* Headline with top-right doodle */}
        <div className="relative w-full flex items-center justify-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-extrabold text-[#07133D] tracking-tight leading-[1.15] mb-3 text-center"
            variants={fadeUp}
            transition={{ delay: 0.05 }}
          >
            What would you like to{" "}
            <span className="relative inline-block whitespace-nowrap">
              {/* Dynamic ambient blue gradient halo in background aligned with theme */}
              <motion.span
                className="absolute -inset-x-4 sm:-inset-x-6 -inset-y-2 sm:-inset-y-3 bg-gradient-to-r from-[#2563EB]/25 via-[#60A5FA]/35 to-[#38BDF8]/25 rounded-full blur-xl sm:blur-2xl pointer-events-none -z-10"
                animate={{
                  opacity: [0.55, 0.95, 0.55],
                  scale: [0.96, 1.06, 0.96],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Secondary soft luminous aura */}
              <motion.span
                className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-blue-600/30 to-cyan-400/30 rounded-xl blur-md pointer-events-none -z-10"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
              {/* Dynamic glowing gradient text */}
              <motion.span
                className="relative z-10 bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] via-[#38BDF8] to-[#1D4ED8] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(37,99,235,0.45)] select-none inline-block"
                style={{
                  backgroundSize: "200% auto",
                }}
                animate={{
                  backgroundPosition: ["0% center", "-200% center"],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                research?
              </motion.span>
              {/* Subtle dynamic AI sparkle accent */}
              <motion.span
                className="absolute -top-1.5 -right-3 sm:-right-4 text-[#38BDF8] pointer-events-none"
                animate={{
                  rotate: [0, 15, 0],
                  scale: [0.85, 1.15, 0.85],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#38BDF8]/40" />
              </motion.span>
            </span>
          </motion.h1>

          {/* Top-Right Handwritten Doodle ("From Questions to Discoveries.") */}
          <motion.div
            className="hidden lg:block absolute -top-12 -right-16 xl:-right-24 select-none rotate-[6deg]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <span
                className="text-[#205DF8] font-bold text-[18px] leading-tight select-none"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                From <br />
                Questions <br />
                to Discoveries.
              </span>
              <svg width="38" height="42" viewBox="0 0 38 42" fill="none" className="mt-0.5">
                <path
                  d="M26 2 C28 16 16 28 4 34"
                  stroke="#205DF8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M10 28 L4 34 L8 38"
                  stroke="#205DF8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-xs sm:text-sm md:text-[15px] text-[#556987] font-normal leading-relaxed mb-7 max-w-2xl px-2"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
        >
          Ask a question, enter a topic, or describe your research interest. ResearchAI will find,
          analyze and synthesize relevant papers for you.
        </motion.p>

        {/* Large Glassmorphic Search Bar */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
        >
          <div
            className="group flex items-center gap-3.5 w-full pl-6 pr-2.5 py-2.5 sm:py-3 rounded-full transition-all duration-300 hover:shadow-[0_16px_44px_-6px_rgba(40,80,160,0.18)] focus-within:shadow-[0_16px_44px_-6px_rgba(40,80,160,0.2),0_0_0_2px_rgba(46,104,248,0.25)] cursor-text min-h-[62px] sm:min-h-[68px]"
            style={{
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1.5px solid rgba(255, 255, 255, 0.95)",
              boxShadow:
                "0 12px 36px -8px rgba(35, 70, 140, 0.11), 0 2px 6px rgba(0, 0, 0, 0.02)",
            }}
            onClick={() => inputRef.current?.focus()}
          >
            <Search
              className="w-5 h-5 shrink-0 text-[#07133D]"
              strokeWidth={2.4}
              aria-hidden="true"
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... e.g. AI-based crop disease detection"
              className="flex-1 bg-transparent outline-none focus:outline-none focus:ring-0 border-none text-[#07133D] text-[15px] sm:text-base placeholder:text-[#8E9FB8] font-normal min-w-0"
              autoComplete="off"
              spellCheck="false"
            />

            <motion.button
              type="submit"
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #205DF8 0%, #1546CC 100%)",
                boxShadow: "0 4px 14px rgba(32, 93, 248, 0.38)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Submit search"
            >
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.form>

        {/* Example Chips */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs text-[#667C9D] font-medium mr-0.5">
            Try an example:
          </span>

          {exampleQueries.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuery(example);
                inputRef.current?.focus();
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-normal text-[#465E87] hover:text-[#205DF8] hover:bg-white/90 bg-white/65 backdrop-blur-md border border-white/85 transition-all duration-200 shadow-xs cursor-pointer"
            >
              {example}
            </button>
          ))}

          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#205DF8] hover:underline cursor-pointer ml-1"
          >
            <span>View more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </motion.div>

      {/* ── Bottom Horizon Text Above Snowy Mountains ─────────── */}
      <div className="relative z-10 text-center select-none pt-6">
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.32em] text-[#556987] uppercase opacity-75">
          Explore • Understand • Create Impact
        </p>
      </div>
    </main>
  );
}
