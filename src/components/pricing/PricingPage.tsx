"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  User,
  Building2,
  Check,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Lock,
  Globe,
  Layers,
  Users,
  Quote,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

interface PricingPageProps {
  onGetStarted?: () => void;
  onContactSales?: () => void;
}

export default function PricingPage({
  onGetStarted,
  onContactSales,
}: PricingPageProps) {
  return (
    <div className="relative w-full h-full min-h-0 min-w-0 overflow-y-auto select-none pb-16">
      {/* ── Background Landscape ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {/* Atmospheric tint */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #E8EFF9 0%, #EEF4FD 25%, #F4F8FE 50%, #E2EDFA 100%)",
          }}
        />

        {/* Mountain Landscape Background */}
        <div className="absolute inset-0 w-full h-full opacity-60">
          <Image
            src="/images/hero-bg.webp"
            alt="Alpine background"
            fill
            priority
            unoptimized
            className="object-cover object-bottom"
            sizes="100vw"
          />
        </div>

        {/* Soft atmospheric gradient veil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(235, 243, 252, 0.7) 0%, rgba(240, 246, 254, 0.4) 40%, rgba(226, 237, 250, 0.75) 100%)",
          }}
        />
      </div>

      {/* ── Main Content Container ────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Top Header Row with Doodles and Slogan */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 sm:mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#556987] uppercase block mb-2">
              Pricing
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#07133D] tracking-tight leading-[1.12]">
              Research Without Limits
            </h1>
            <p className="text-sm sm:text-base md:text-[17px] text-[#556987] mt-3 leading-relaxed">
              Choose the plan that fits your research journey. Powerful AI agents, trusted sources, and tools built for students, researchers, and institutions.
            </p>
          </motion.div>

          {/* Right Header: Handwritten Caveat Doodle + Slogan */}
          <div className="flex flex-col items-end gap-3 self-start md:self-auto">
            {/* Top-right subtle brand slogan */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-right hidden sm:block"
            >
              <span className="text-xs font-medium text-[#64748B] block">Knowledge for a brighter</span>
              <span className="text-xs font-medium text-[#64748B] block">tomorrow.</span>
              <div className="w-6 h-0.5 bg-[#CBD5E1] ml-auto mt-1 rounded-full" />
            </motion.div>

            {/* Handwritten Caveat Doodle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex flex-col items-center relative mr-8 mt-2 pointer-events-none"
            >
              <div className="text-[#2563EB] font-['Caveat',cursive] text-lg sm:text-xl font-bold rotate-[-6deg] leading-tight text-right">
                <span>&ldquo;Ideas today.</span>
                <br />
                <span className="text-[#1D4ED8]">Impact tomorrow.&rdquo;</span>
              </div>
              {/* Curved Hand-drawn SVG Arrow */}
              <svg
                className="w-10 h-10 text-[#2563EB] mt-1 -rotate-25 self-center"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 6 C 24 10, 30 22, 22 34" />
                <path d="M16 30 L 22 34 L 28 28" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* ── 3 Pricing Cards Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 items-stretch">
          {/* ── Card 1: Students ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-8 shadow-[0_8px_30px_rgba(30,60,120,0.06)] hover:shadow-[0_12px_40px_rgba(30,60,120,0.12)] hover:border-[#BFDBFE] transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Background Faint Illustration: Graduation Cap / Books */}
            <div className="absolute -bottom-6 -right-6 w-44 h-44 opacity-[0.06] text-[#2563EB] pointer-events-none select-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>

            <div>
              {/* Header: Icon + Title + Badge */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-2xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#07133D]">Students</h3>
                    <p className="text-xs text-[#556987]">For learners and students</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-xs font-bold tracking-tight">
                  Free Forever
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl sm:text-[42px] font-extrabold text-[#07133D] tracking-tight block">
                  Free
                </span>
                <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                  Start your research journey with essential tools at no cost.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3.5 mb-8">
                {[
                  "Limited research queries (e.g. 10 per month)",
                  "Access to major academic sources",
                  "AI-powered paper summaries",
                  "Basic research gap suggestions",
                  "Save papers to your library",
                  "Export results (PDF, Markdown, BibTeX)",
                  "Community support",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-[13px] text-[#334155] leading-snug font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onGetStarted}
              className="relative z-10 w-full py-3.5 px-6 rounded-2xl text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)",
              }}
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* ── Card 2: Researchers ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-8 shadow-[0_8px_30px_rgba(30,60,120,0.06)] hover:shadow-[0_12px_40px_rgba(30,60,120,0.12)] hover:border-[#BFDBFE] transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Background Faint Illustration: Books Stack */}
            <div className="absolute -bottom-6 -right-6 w-44 h-44 opacity-[0.06] text-[#8B5CF6] pointer-events-none select-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
              </svg>
            </div>

            <div>
              {/* Header: Icon + Title + Badge */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#8B5CF6] shadow-2xs">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#07133D]">Researchers</h3>
                    <p className="text-xs text-[#556987]">For academics and independent researchers</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[#8B5CF6] text-xs font-bold tracking-tight">
                  Custom
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#07133D] tracking-tight block">
                  Custom Plan
                </span>
                <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                  Pay as you go — based on your usage.
                </p>
              </div>

              {/* Highlight Callout Box */}
              <div className="p-3.5 rounded-2xl bg-[#EEF4FD]/80 border border-[#D8E6F8] mb-6 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white text-[#2563EB] shadow-2xs shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#07133D]">Flexible and transparent pricing.</h4>
                  <p className="text-[11px] text-[#556987] mt-0.5 leading-relaxed">
                    You only pay for what you use, with no long-term commitments.
                  </p>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3.5 mb-8">
                {[
                  "Everything in Student plan, plus",
                  "Higher query limits (usage-based)",
                  "Advanced AI agents (methodology, dataset, citation & trend analysis)",
                  "Research gap validation and deeper insights",
                  "Priority access to new features",
                  "Export in multiple formats (PDF, DOCX, CSV, BibTeX)",
                  "Email support",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-[13px] text-[#334155] leading-snug font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onContactSales}
              className="relative z-10 w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-[#2563EB]/40 text-[#2563EB] text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Contact Sales</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* ── Card 3: Enterprises ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.4 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-8 shadow-[0_8px_30px_rgba(30,60,120,0.06)] hover:shadow-[0_12px_40px_rgba(30,60,120,0.12)] hover:border-[#BFDBFE] transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Background Faint Illustration: Skyscrapers */}
            <div className="absolute -bottom-6 -right-6 w-44 h-44 opacity-[0.06] text-[#D97706] pointer-events-none select-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M19 2H9c-1.1 0-2 .9-2 2v16H3v2h18V4c0-1.1-.9-2-2-2zm-8 4h2v2h-2V6zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm6 0h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z" />
              </svg>
            </div>

            <div>
              {/* Header: Icon + Title + Badge */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] shadow-2xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#07133D]">Enterprises</h3>
                    <p className="text-xs text-[#556987]">For universities, research labs and organizations</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-[#D97706] text-xs font-bold tracking-tight">
                  Custom
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#07133D] tracking-tight block">
                  Custom Plan
                </span>
                <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                  Tailored to your institutional needs.
                </p>
              </div>

              {/* Highlight Callout Box */}
              <div className="p-3.5 rounded-2xl bg-[#EEF4FD]/80 border border-[#D8E6F8] mb-6 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white text-[#2563EB] shadow-2xs shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#07133D]">Scalable solutions for teams and institutions.</h4>
                  <p className="text-[11px] text-[#556987] mt-0.5 leading-relaxed">
                    Pricing depends on usage, team size, and specific requirements.
                  </p>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3.5 mb-8">
                {[
                  "Everything in Researcher plan, plus",
                  "Team collaboration & shared libraries",
                  "Organization-wide knowledge base",
                  "Custom integrations (API access, SSO, LMS)",
                  "Dedicated support & onboarding",
                  "Usage-based or annual pricing (flexible)",
                  "Custom feature development (on request)",
                  "SLA and enterprise security",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-[13px] text-[#334155] leading-snug font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onContactSales}
              className="relative z-10 w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-[#2563EB]/40 text-[#2563EB] text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* ── Trust / Value Proposition Strip ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white/85 backdrop-blur-xl border border-[#DCE7F6] rounded-2xl p-5 sm:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E8EFF8] mb-8"
        >
          {/* Trust 1: No hidden fees */}
          <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:pl-0 sm:first:pl-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#07133D]">No hidden fees</h4>
              <p className="text-[11px] text-[#64748B]">Transparent and fair usage</p>
            </div>
          </div>

          {/* Trust 2: Pay only for what you use */}
          <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#07133D]">Pay only for what you use</h4>
              <p className="text-[11px] text-[#64748B]">Flexible and scalable</p>
            </div>
          </div>

          {/* Trust 3: Your data, your control */}
          <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#07133D]">Your data, your control</h4>
              <p className="text-[11px] text-[#64748B]">Secure and private</p>
            </div>
          </div>

          {/* Trust 4: Trusted academic sources */}
          <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#07133D]">Trusted academic sources</h4>
              <p className="text-[11px] text-[#64748B]">OpenAlex, Semantic Scholar, arXiv and more</p>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom Section: Callout Card + Carl Sagan Quote ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Still Have Questions Banner (8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.4 }}
            className="lg:col-span-8 bg-white/85 backdrop-blur-xl border border-[#DCE7F6] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs"
          >
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#556987] uppercase block mb-1">
                Still have questions?
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#07133D]">
                Let&apos;s find the right plan for you.
              </h3>
              <p className="text-xs sm:text-sm text-[#556987] mt-1 max-w-lg">
                Our team is here to help you choose the best option for your research goals.
              </p>
            </div>

            <button
              onClick={onContactSales}
              className="px-6 py-3 rounded-xl bg-[#07133D] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Contact Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Carl Sagan Quote Card (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.4 }}
            className="lg:col-span-4 relative bg-white/85 backdrop-blur-xl border border-[#DCE7F6] rounded-2xl p-6 shadow-xs overflow-hidden flex flex-col justify-between min-h-[140px]"
          >
            {/* Background Mountain Silhouette */}
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
                  "linear-gradient(to top, rgba(255,255,255,0.7) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10 space-y-2">
              <p className="text-xs sm:text-[13px] font-medium text-[#07133D] italic leading-relaxed">
                &ldquo;Research is a conversation across time.&rdquo;
              </p>
              <p className="text-[11px] font-semibold text-[#64748B]">
                — Carl Sagan
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
