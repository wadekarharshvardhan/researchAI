"use client";

import Image from "next/image";
import { Bookmark, FileText, Tag, Clock, Lightbulb, Quote } from "lucide-react";
import { motion } from "motion/react";

const reasons = [
  {
    icon: Bookmark,
    title: "Build your collection",
    desc: "Keep important papers in one place.",
  },
  {
    icon: FileText,
    title: "Add personal notes",
    desc: "Capture your thoughts and insights.",
  },
  {
    icon: Tag,
    title: "Organize with tags",
    desc: "Easily categorize by topic, method, or research area.",
  },
  {
    icon: Clock,
    title: "Read later",
    desc: "Never lose track of interesting research again.",
  },
];

export default function SavedPapersRightbar() {
  return (
    <motion.aside
      className="w-80 shrink-0 space-y-4 py-6 px-4 bg-white/70 backdrop-blur-xl border-l border-[#E8EFF8] h-full select-none overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
      aria-label="Saved papers tips and inspiration"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Card 1: Why Save Papers? ──────────────────────────── */}
      <motion.div
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D] mb-4">
          Why Save Papers?
        </h3>

        <div className="space-y-3.5">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={idx}
                className="flex items-start gap-3 group cursor-default"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                {/* Blue circular badge */}
                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5 group-hover:bg-blue-100 group-hover:scale-105 transition-all shadow-2xs">
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {reason.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed mt-0.5 font-normal">
                    {reason.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Card 2: Pro Tip Card with Plane Illustration ──────── */}
      <motion.div
        className="relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 sm:p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)] overflow-hidden"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
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
              "linear-gradient(to top, rgba(255,255,255,0.75) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-2xs">
              <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.4} />
            </div>
            <h4 className="text-xs sm:text-[12.5px] font-bold text-[#07133D]">
              Pro Tip
            </h4>
          </div>

          <p className="text-[11px] text-[#556987] leading-relaxed font-normal">
            Click the bookmark icon on any paper in the research results to save it instantly to your library.
          </p>

          {/* Paper airplane sketch in bottom-right */}
          <div className="flex justify-end pt-1">
            <svg
              width="32"
              height="32"
              viewBox="0 0 48 48"
              fill="none"
              className="text-blue-300/80"
            >
              <path
                d="M44 4L22 26M44 4L30 44L22 26M44 4L4 18L22 26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(59,130,246,0.1)"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── Card 3: Marie Curie Quote Card ────────────────────── */}
      <motion.div
        className="relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)] overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
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
            &ldquo;The more you read, the more you see.&rdquo;
          </p>
          <p className="text-[11px] font-medium text-[#64748B]">
            — Marie Curie
          </p>
        </div>
      </motion.div>
    </motion.aside>
  );
}
