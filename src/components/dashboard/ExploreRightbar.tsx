"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Flame,
  Settings,
  Microscope,
  Atom,
  Users,
  BookOpen,
  ChevronRight,
  Quote,
  Cpu,
  Leaf,
  BarChart2,
  Coins,
  HeartPulse,
} from "lucide-react";
import { motion } from "motion/react";

interface ExploreRightbarProps {
  onSelectTopic?: (topic: string) => void;
}

const trendingTopics = [
  {
    rank: 1,
    title: "Large Language Models",
    growth: "+320% this year",
    circleBg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    rank: 2,
    title: "Climate Resilience",
    growth: "+280% this year",
    circleBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    rank: 3,
    title: "AI in Healthcare",
    growth: "+250% this year",
    circleBg: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    rank: 4,
    title: "Sustainable Agriculture",
    growth: "+210% this year",
    circleBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    rank: 5,
    title: "Quantum Computing",
    growth: "+180% this year",
    circleBg: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    rank: 6,
    title: "CRISPR Gene Editing",
    growth: "+165% this year",
    circleBg: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    rank: 7,
    title: "Autonomous Robotics",
    growth: "+145% this year",
    circleBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    rank: 8,
    title: "Brain-Computer Interfaces",
    growth: "+130% this year",
    circleBg: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
  },
  {
    rank: 9,
    title: "Nuclear Fusion Energy",
    growth: "+115% this year",
    circleBg: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    rank: 10,
    title: "Post-Quantum Cryptography",
    growth: "+95% this year",
    circleBg: "bg-red-50 text-red-600 border-red-100",
  },
];

const subjects = [
  { id: "eng", name: "Engineering & Tech", icon: Settings, color: "text-blue-600" },
  { id: "life", name: "Life Sciences & Medicine", icon: Microscope, color: "text-emerald-600" },
  { id: "phys", name: "Physical & Space Sciences", icon: Atom, color: "text-violet-600" },
  { id: "soc", name: "Social & Behavioral Sciences", icon: Users, color: "text-sky-600" },
  { id: "arts", name: "Arts & Humanities", icon: BookOpen, color: "text-amber-600" },
  { id: "comp", name: "Computer & Information Sci", icon: Cpu, color: "text-indigo-600" },
  { id: "env", name: "Environmental & Earth Sci", icon: Leaf, color: "text-green-600" },
  { id: "math", name: "Mathematics & Statistics", icon: BarChart2, color: "text-cyan-600" },
  { id: "econ", name: "Economics & Finance", icon: Coins, color: "text-yellow-600" },
  { id: "bio", name: "Biomedical Engineering", icon: HeartPulse, color: "text-rose-600" },
];

export default function ExploreRightbar({ onSelectTopic }: ExploreRightbarProps) {
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const displayedTrending = showAllTrending ? trendingTopics : trendingTopics.slice(0, 5);
  const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, 5);

  return (
    <motion.aside
      className="w-80 shrink-0 space-y-4 py-6 px-4 bg-white/70 backdrop-blur-xl border-l border-[#E8EFF8] h-full select-none overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
      aria-label="Explore trends and subjects"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Card 1: Trending Topics ───────────────────────────── */}
      <motion.div
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-500">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </span>
            <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D]">
              Trending Topics
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAllTrending((v) => !v)}
            className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
          >
            {showAllTrending ? "Show less" : "View all"}
          </button>
        </div>

        <div className="space-y-2">
          {displayedTrending.map((item) => (
            <button
              key={item.rank}
              type="button"
              onClick={() => onSelectTopic?.(item.title)}
              className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left group"
            >
              {/* Number circle */}
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${item.circleBg} shadow-2xs group-hover:scale-105 transition-transform`}
              >
                {item.rank}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#07133D] group-hover:text-[#2563EB] truncate transition-colors leading-tight">
                  {item.title}
                </p>
                <p className="text-[10.5px] font-medium text-emerald-600 leading-tight mt-0.5">
                  {item.growth}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Card 2: Explore by Subject ────────────────────────── */}
      <motion.div
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D]">
            Explore by Subject
          </h3>
          <button
            type="button"
            onClick={() => setShowAllSubjects((v) => !v)}
            className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
          >
            {showAllSubjects ? "Show less" : "View all"}
          </button>
        </div>

        <div className="space-y-1">
          {displayedSubjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectTopic?.(sub.name)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/90 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-blue-50/70 flex items-center justify-center text-[#475569] group-hover:text-[#2563EB] group-hover:bg-blue-100/70 transition-colors">
                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-medium text-[#334155] group-hover:text-[#07133D] transition-colors truncate">
                    {sub.name}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Card 3: Quote Card ────────────────────────────────── */}
      <motion.div
        className="relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)] overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.3 }}
      >
        {/* Soft mountain silhouette backdrop */}
        <div className="absolute inset-0 opacity-[0.14] pointer-events-none select-none">
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
              "linear-gradient(to top, rgba(255,255,255,0.7) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 space-y-2.5">
          <div className="text-[#2563EB]">
            <Quote className="w-6 h-6 rotate-180 fill-[#2563EB]/15 text-[#2563EB]" strokeWidth={2} />
          </div>
          <p className="text-xs sm:text-[13px] font-medium text-[#07133D] italic leading-relaxed">
            &ldquo;The important thing is not to stop questioning.&rdquo;
          </p>
          <p className="text-[11px] font-medium text-[#64748B]">
            — Albert Einstein
          </p>
        </div>
      </motion.div>
    </motion.aside>
  );
}
