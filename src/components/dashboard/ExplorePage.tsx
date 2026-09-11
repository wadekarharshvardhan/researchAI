"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Brain,
  Leaf,
  HeartPulse,
  Eye,
  FileText,
  Dna,
  Wind,
  Bot,
  Atom,
  Sprout,
  BarChart2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface ExplorePageProps {
  onSearch?: (query: string) => void;
  onSelectTopic?: (topic: string) => void;
}

/* ─── 10 Popular Research Areas ───────────────────────────────────────── */
const researchAreas = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    papers: "2.4M+ papers",
    icon: Brain,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-100/60",
    query: "Artificial Intelligence",
  },
  {
    id: "climate",
    title: "Climate Change",
    papers: "1.1M+ papers",
    icon: Leaf,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-100/60",
    query: "Climate Change impact and adaptation",
  },
  {
    id: "healthcare",
    title: "Healthcare & Medicine",
    papers: "1.8M+ papers",
    icon: HeartPulse,
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50 border-rose-100/60",
    query: "AI in healthcare and clinical medicine",
  },
  {
    id: "vision",
    title: "Computer Vision",
    papers: "890K+ papers",
    icon: Eye,
    iconColor: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-100/60",
    query: "Computer vision and image recognition",
  },
  {
    id: "nlp",
    title: "Natural Language Processing",
    papers: "760K+ papers",
    icon: FileText,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-50 border-cyan-100/60",
    query: "Natural Language Processing and LLMs",
  },
  {
    id: "bioinformatics",
    title: "Bioinformatics",
    papers: "620K+ papers",
    icon: Dna,
    iconColor: "text-teal-600",
    bgColor: "bg-teal-50 border-teal-100/60",
    query: "Bioinformatics and computational genomics",
  },
  {
    id: "energy",
    title: "Renewable Energy",
    papers: "540K+ papers",
    icon: Wind,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-100/60",
    query: "Renewable energy technologies",
  },
  {
    id: "robotics",
    title: "Robotics",
    papers: "480K+ papers",
    icon: Bot,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-100/60",
    query: "Autonomous robotics and reinforcement learning",
  },
  {
    id: "materials",
    title: "Materials Science",
    papers: "410K+ papers",
    icon: Atom,
    iconColor: "text-violet-600",
    bgColor: "bg-violet-50 border-violet-100/60",
    query: "Advanced materials and quantum structures",
  },
  {
    id: "agriculture",
    title: "Agriculture & Food Security",
    papers: "380K+ papers",
    icon: Sprout,
    iconColor: "text-green-600",
    bgColor: "bg-green-50 border-green-100/60",
    query: "Smart agriculture and food security",
  },
];

/* ─── 3 Curated Collections ──────────────────────────────────────────── */
const curatedCollections = [
  {
    id: "sustainability",
    badge: "FEATURED",
    badgeBg: "bg-emerald-500/90",
    title: "Sustainability & Green Innovation",
    desc: "Research for a more sustainable tomorrow.",
    count: "128 collections",
    image: "/images/curated_sustainability.jpg",
    query: "Sustainability and green energy innovation",
  },
  {
    id: "ai-future",
    badge: "TRENDING",
    badgeBg: "bg-blue-600/90",
    title: "The Future of AI",
    desc: "Explore the latest advancements in artificial intelligence.",
    count: "95 collections",
    image: "/images/curated_ai_brain.jpg",
    query: "Future of artificial intelligence advancements",
  },
  {
    id: "healthcare-breakthroughs",
    badge: "POPULAR",
    badgeBg: "bg-sky-600/90",
    title: "Breakthroughs in Healthcare",
    desc: "From diagnosis to drug discovery.",
    count: "112 collections",
    image: "/images/curated_healthcare_dna.jpg",
    query: "Breakthroughs in healthcare and medicine",
  },
];

/* ─── 4 Suggested Research Questions ─────────────────────────────────── */
const suggestedQuestions = [
  {
    id: "q1",
    icon: Sprout,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50/80 border-emerald-100/60",
    question: "How is AI transforming agriculture?",
  },
  {
    id: "q2",
    icon: BarChart2,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50/80 border-blue-100/60",
    question: "What are the latest advances in climate modeling?",
  },
  {
    id: "q3",
    icon: FileText,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-50/80 border-cyan-100/60",
    question: "How effective are large language models in education?",
  },
  {
    id: "q4",
    icon: Zap,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50/80 border-amber-100/60",
    question: "What are the emerging trends in renewable energy?",
  },
];

export default function ExplorePage({ onSearch, onSelectTopic }: ExplorePageProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch?.(searchInput.trim());
    }
  };

  const handleAreaClick = (query: string) => {
    if (onSelectTopic) {
      onSelectTopic(query);
    } else {
      onSearch?.(query);
    }
  };

  return (
    <motion.main
      className="flex-1 relative flex flex-col overflow-y-auto min-h-[calc(100vh-64px)] px-4 sm:px-8 lg:px-10 py-8 select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Explore research horizons"
    >
      {/* ── Soft Atmospheric Ambient Gradient + Mountain Landscape ─── */}
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

      <div className="relative z-10 max-w-5xl w-full mx-auto space-y-9 pb-12">
        {/* ── Top Header & Headline ───────────────────────────── */}
        <div className="relative flex items-start justify-between">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#556987]">
              EXPLORE
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#07133D] tracking-tight leading-tight">
              Discover New Research Horizons
            </h1>
            <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
              Explore trending topics, research fields, and curated collections. Find inspiration for your next research question.
            </p>
          </div>

          {/* Top-Right Handwritten Doodle ("Explore today. Build tomorrow." + Telescope on tripod) */}
          <div className="hidden lg:flex items-center gap-3 relative select-none pt-1">
            <div className="flex flex-col items-end">
              <span
                className="text-lg sm:text-[21px] font-bold text-[#2A57C8] leading-tight rotate-[-4deg]"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Explore today.
              </span>
              <span
                className="text-base sm:text-[19px] font-semibold text-[#3A6BC7] leading-tight rotate-[-2deg] mr-2"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Build tomorrow.
              </span>
              {/* Hand-drawn curved arrow pointing down and left */}
              <svg
                width="34"
                height="28"
                viewBox="0 0 34 28"
                fill="none"
                className="text-[#3A6BC7] rotate-[10deg] mr-6 mt-1"
              >
                <path
                  d="M28 2C24 10 16 18 4 23M4 23L12 21M4 23L7 15"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Hand-drawn sketch of telescope on tripod */}
            <div className="relative w-16 h-16 flex items-center justify-center text-[#3A6BC7]">
              <svg
                width="54"
                height="54"
                viewBox="0 0 56 56"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Main telescope barrel pointing up-right */}
                <path d="M15 33L37 17L41 20L19 36L15 33Z" fill="rgba(58,107,199,0.08)" />
                {/* Objective lens hood */}
                <path d="M37 17L42 13L46 16L41 20" fill="rgba(58,107,199,0.15)" />
                {/* Eyepiece */}
                <path d="M15 33L11 36L13 39L17 36" />
                {/* Mount center */}
                <circle cx="28" cy="28" r="2.5" fill="currentColor" />
                {/* Tripod legs */}
                <path d="M28 28L17 48" />
                <path d="M28 28L28 49" />
                <path d="M28 28L39 48" />
                {/* Tripod tray brace */}
                <path d="M22 39L34 39" strokeDasharray="1 1.5" strokeWidth="1.4" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Large Search Input ──────────────────────────────── */}
        <motion.form
          onSubmit={handleSearchSubmit}
          className="relative w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div
            className="relative flex items-center bg-white rounded-full shadow-[0_4px_24px_rgba(32,93,248,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-[#DCE7F6] focus-within:border-[#2563EB] focus-within:ring-3 focus-within:ring-[#2563EB]/15 transition-all duration-200 px-5 py-3.5"
          >
            <Search className="w-5 h-5 text-[#6B80A8] shrink-0 mr-3.5" strokeWidth={2} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search topics, keywords, or research areas..."
              className="w-full bg-transparent text-sm sm:text-base text-[#07133D] placeholder-[#8EA3C0] outline-none focus:outline-none focus:ring-0 border-none font-normal"
            />
            {searchInput && (
              <button
                type="submit"
                className="shrink-0 ml-2 px-4 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              >
                Search
              </button>
            )}
          </div>
        </motion.form>

        {/* ── Section 1: Popular Research Areas ───────────────── */}
        <section aria-labelledby="heading-popular-areas" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="heading-popular-areas" className="text-base sm:text-lg font-bold text-[#07133D] tracking-tight">
              Popular Research Areas
            </h2>
            <button
              type="button"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-3.5">
            {researchAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <motion.button
                  key={area.id}
                  type="button"
                  onClick={() => handleAreaClick(area.query)}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-[#E2EAF5] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.1)] hover:border-blue-200/90 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between group min-h-[122px]"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + idx * 0.03, duration: 0.3 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center ${area.bgColor} ${area.iconColor} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
                      {area.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-[11px] text-[#64748B] font-medium">
                      {area.papers}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Curated Collections ──────────────────── */}
        <section aria-labelledby="heading-curated-collections" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="heading-curated-collections" className="text-base sm:text-lg font-bold text-[#07133D] tracking-tight">
              Curated Collections
            </h2>
            <button
              type="button"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {curatedCollections.map((col, idx) => (
              <motion.div
                key={col.id}
                onClick={() => handleAreaClick(col.query)}
                className="relative rounded-2xl overflow-hidden min-h-[170px] sm:min-h-[185px] p-5 flex flex-col justify-between cursor-pointer group shadow-[0_6px_22px_rgba(0,0,0,0.06)] border border-white/40"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05, duration: 0.35 }}
                whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(15,23,42,0.16)" }}
              >
                {/* Background Image with Zoom on Hover */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-600 ease-out group-hover:scale-108"
                  />
                  {/* High quality overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`inline-block text-[9.5px] font-extrabold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs ${col.badgeBg}`}
                  >
                    {col.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-auto pt-4 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-blue-200 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-[11.5px] text-white/80 line-clamp-2 leading-relaxed font-normal">
                    {col.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-white/90 group-hover:text-white">
                    <span>{col.count}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Suggested Research Questions ─────────── */}
        <section aria-labelledby="heading-suggested-questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="heading-suggested-questions" className="text-base sm:text-lg font-bold text-[#07133D] tracking-tight">
              Suggested Research Questions
            </h2>
            <button
              type="button"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((q, idx) => {
              const Icon = q.icon;
              return (
                <motion.button
                  key={q.id}
                  type="button"
                  onClick={() => handleAreaClick(q.question)}
                  className="bg-white/95 rounded-2xl px-4 py-3.5 border border-[#E2EAF5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 cursor-pointer text-left flex items-center justify-between gap-3 group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.04, duration: 0.3 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${q.bgColor} ${q.iconColor}`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <span className="text-xs sm:text-[13px] font-medium text-[#1E293B] group-hover:text-[#2563EB] truncate transition-colors">
                      {q.question}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#94A3B8] shrink-0 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
