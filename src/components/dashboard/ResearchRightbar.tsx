"use client";

import Image from "next/image";
import { Lightbulb, Target, Layers, Bookmark } from "lucide-react";
import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/animations";

const tips = [
  {
    icon: Target,
    title: "Be specific",
    desc: "A clear question gives better results.",
  },
  {
    icon: Layers,
    title: "Explore different angles",
    desc: "Try related topics and keywords.",
  },
  {
    icon: Lightbulb,
    title: "Use examples",
    desc: "See how others frame their research questions.",
  },
  {
    icon: Bookmark,
    title: "Save your work",
    desc: "Keep important papers and insights in your library.",
  },
];

export default function ResearchRightbar() {
  return (
    <motion.aside
      className="w-80 shrink-0 space-y-4 py-6 px-4 bg-white/70 backdrop-blur-xl border-l border-[#E8EFF8] h-[calc(100vh-64px)] sticky top-16 select-none overflow-y-auto"
      aria-label="Research tips and resources"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* ── Card 1: Tips for great research ─────────────────── */}
      <motion.div
        variants={fadeUp}
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(30,60,120,0.04)]"
      >
        {/* Header with lightbulb icon */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-100/80 flex items-center justify-center text-amber-500 shrink-0 shadow-xs">
            <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.2} />
          </div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#556987]">
            Tips for great research
          </h3>
        </div>

        <ul className="space-y-3.5" role="list">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <motion.li
                key={idx}
                className="flex items-start gap-3 group"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + idx * 0.07,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50/90 border border-blue-100/70 flex items-center justify-center text-[#205DF8] shrink-0 mt-0.5 group-hover:bg-blue-100/80 transition-colors shadow-xs">
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-[#07133D] group-hover:text-[#205DF8] transition-colors leading-tight">
                    {tip.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7FA2] leading-tight mt-0.5">
                    {tip.desc}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      {/* ── Card 2: Quote card ───────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-2xl p-4 sm:p-5 overflow-hidden border border-white/90 bg-gradient-to-b from-white/90 to-[#EBF3FE]/85 shadow-[0_2px_12px_rgba(30,60,120,0.04)]"
      >
        {/* Mountain illustration background */}
        <div className="absolute inset-x-0 bottom-0 h-28 opacity-30 pointer-events-none">
          <Image
            src="/images/hero-bg.webp"
            alt=""
            fill
            className="object-cover object-bottom"
            unoptimized
            aria-hidden="true"
          />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(235,243,254,0.6))",
          }}
        />

        <div className="relative z-10">
          <span className="text-[#205DF8] text-2xl font-serif font-black select-none leading-none block mb-2">
            "
          </span>
          <p className="text-xs font-medium text-[#334155] leading-relaxed">
            The best research begins with a better question.
          </p>
          <span className="text-xs font-bold text-[#07133D] block mt-3">
            — Unknown
          </span>
        </div>
      </motion.div>
    </motion.aside>
  );
}
