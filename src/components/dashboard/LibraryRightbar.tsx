"use client";

import Image from "next/image";
import { Folder, Sparkles, FileText, Lightbulb, Quote } from "lucide-react";
import { motion } from "motion/react";

interface LibraryRightbarProps {
  onAction?: (action: string) => void;
}

const tips = [
  {
    icon: Folder,
    title: "Create projects",
    desc: "Organize your research by topic.",
  },
  {
    icon: Sparkles,
    title: "Synthesize insights",
    desc: "Generate AI summaries across papers.",
  },
  {
    icon: FileText,
    title: "Add notes",
    desc: "Capture your thoughts and insights.",
  },
  {
    icon: Lightbulb,
    title: "Find research gaps",
    desc: "Revisit potential opportunities.",
  },
];

export default function LibraryRightbar({ onAction }: LibraryRightbarProps) {
  return (
    <motion.aside
      className="w-80 shrink-0 space-y-4 py-6 px-4 bg-white/70 backdrop-blur-xl border-l border-[#E8EFF8] h-full select-none overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
      aria-label="Library tips and inspiration"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Card 1: Library Tips ──────────────────────────────── */}
      <motion.div
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        {/* Header with blue lightbulb icon */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 shadow-2xs">
            <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.4} />
          </div>
          <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D]">
            Library Tips
          </h3>
        </div>

        {/* Tip List */}
        <div className="space-y-3.5">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={idx}
                className="flex items-start gap-3 group cursor-default"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <div className="w-7 h-7 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {tip.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed mt-0.5 font-normal">
                    {tip.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Card 2: Marie Curie Quote Card ────────────────────── */}
      <motion.div
        className="relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)] overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3 }}
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
            &ldquo;A well-organized mind leads to new discoveries.&rdquo;
          </p>
          <p className="text-[11px] font-medium text-[#64748B]">
            — Marie Curie
          </p>
        </div>
      </motion.div>
    </motion.aside>
  );
}
