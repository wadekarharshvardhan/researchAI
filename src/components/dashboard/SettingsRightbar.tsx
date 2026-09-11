"use client";

import Image from "next/image";
import { Sliders, FileText, Palette, Bell, Quote, LifeBuoy, BookOpen, Mail, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

const setupItems = [
  {
    icon: Sliders,
    title: "Set your preferred sources",
    desc: "Choose databases like OpenAlex, Semantic Scholar, arXiv.",
  },
  {
    icon: FileText,
    title: "Select citation style",
    desc: "APA, IEEE, MLA and more.",
  },
  {
    icon: Palette,
    title: "Customize appearance",
    desc: "Light or dark mode.",
  },
  {
    icon: Bell,
    title: "Manage notifications",
    desc: "Get notified when research is complete.",
  },
];

export default function SettingsRightbar() {
  return (
    <motion.aside
      className="w-80 shrink-0 space-y-4 py-6 px-4 bg-white/70 backdrop-blur-xl border-l border-[#E8EFF8] h-[calc(100vh-64px)] sticky top-16 select-none overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
      aria-label="Settings tips and assistance"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Card 1: Your Research Setup ───────────────────────── */}
      <motion.div
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D]">
          Your Research Setup
        </h3>
        <p className="text-[11px] text-[#556987] mt-0.5 mb-4">
          Configure how ResearchAI works for you.
        </p>

        <div className="space-y-3.5">
          {setupItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className="flex items-start gap-3 group cursor-default"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5 group-hover:bg-blue-100 group-hover:scale-105 transition-all shadow-2xs">
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed mt-0.5 font-normal">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Card 2: Zora Neale Hurston Quote with Mountains ────── */}
      <motion.div
        className="relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)] overflow-hidden min-h-[165px] flex flex-col justify-between"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {/* Soft mountain silhouette backdrop */}
        <div className="absolute inset-0 opacity-[0.22] pointer-events-none select-none">
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
              "linear-gradient(to top, rgba(255,255,255,0.65) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 space-y-2.5">
          <div className="text-[#2563EB]">
            <Quote className="w-5 h-5 rotate-180 fill-[#2563EB]/15 text-[#2563EB]" strokeWidth={2} />
          </div>
          <p className="text-xs sm:text-[13px] font-medium text-[#07133D] italic leading-relaxed">
            &ldquo;Research is formalized curiosity. It is poking and prying with a purpose.&rdquo;
          </p>
          <p className="text-[11px] font-semibold text-[#64748B]">
            — Zora Neale Hurston
          </p>
        </div>
      </motion.div>

      {/* ── Card 3: Need Help? ─────────────────────────────────── */}
      <motion.div
        className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-[0_2px_14px_rgba(30,60,120,0.04)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-2xs">
            <LifeBuoy className="w-3.5 h-3.5" strokeWidth={2.4} />
          </div>
          <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D]">
            Need Help?
          </h3>
        </div>

        <p className="text-[11px] text-[#556987] leading-relaxed mb-4">
          Find answers in our documentation or contact our support team.
        </p>

        <div className="space-y-2.5 pt-0.5">
          <a
            href="#docs"
            className="flex items-center gap-2.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#2563EB] group-hover:scale-105 transition-transform" />
            <span>View Documentation</span>
          </a>
          <a
            href="#support"
            className="flex items-center gap-2.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#2563EB] group-hover:scale-105 transition-transform" />
            <span>Contact Support</span>
          </a>
          <a
            href="#feedback"
            className="flex items-center gap-2.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#2563EB] group-hover:scale-105 transition-transform" />
            <span>Give Feedback</span>
          </a>
        </div>
      </motion.div>
    </motion.aside>
  );
}
