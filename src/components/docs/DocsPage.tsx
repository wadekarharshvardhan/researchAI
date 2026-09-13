"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Check,
  Copy,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  Compass,
  FileText,
  BarChart3,
  HelpCircle,
  Terminal,
  Bookmark,
  MessageSquare,
  Bot,
  Filter,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DocsPageProps {
  onStartResearch?: () => void;
  onBack?: () => void;
}

interface DocSection {
  id: string;
  category: string;
  title: string;
  badge?: string;
  summary: string;
}

const SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    category: "Overview",
    title: "Getting Started & Architecture",
    badge: "Core",
    summary: "High-level platform introduction, multi-agent architecture, and first research workflow.",
  },
  {
    id: "autonomous-search",
    category: "Core Features",
    title: "Autonomous Literature Search",
    badge: "OpenAlex",
    summary: "Corpus indexation of 250M+ papers, BM25 semantic reranking, and search parameter filters.",
  },
  {
    id: "multi-agent-pipeline",
    category: "Core Features",
    title: "4-Agent Intelligence Pipeline",
    badge: "Agents",
    summary: "Automated discovery, structural paper analysis, research gap detection, and literature review synthesis.",
  },
  {
    id: "ai-reader",
    category: "Core Features",
    title: "Interactive AI Reader & Copilot",
    badge: "Reader",
    summary: "Dual-mode parsing (Structured vs. PDF), quad-color highlights, margin notes, and in-context LLM copilot.",
  },
  {
    id: "analytics-engine",
    category: "Analytics",
    title: "Research Analytics Engine",
    badge: "Telemetry",
    summary: "Mathematical formulations for hours saved, period deltas, activity charts, and domain classification.",
  },
  {
    id: "library-collections",
    category: "Organization",
    title: "Personal Library & Collections",
    badge: "Library",
    summary: "Stateful paper curation, reading status workflows, and persistent annotation export.",
  },
  {
    id: "api-reference",
    category: "Developer",
    title: "API Reference & Integration",
    badge: "REST",
    summary: "HTTP endpoints for paper discovery, agent orchestration, reader copilot, and SDK usage examples.",
  },
  {
    id: "faq",
    category: "Support",
    title: "Frequently Asked Questions",
    summary: "Common queries regarding API keys, privacy isolation, citation indexing, and data export.",
  },
];

export default function DocsPage({ onStartResearch, onBack }: DocsPageProps) {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeApiTab, setActiveApiTab] = useState<"curl" | "typescript" | "python">("typescript");
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Grouped sections for sidebar navigation
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const categories = useMemo(() => {
    const map = new Map<string, DocSection[]>();
    filteredSections.forEach((s) => {
      const list = map.get(s.category) || [];
      list.push(s);
      map.set(s.category, list);
    });
    return Array.from(map.entries());
  }, [filteredSections]);

  const currentSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const prevSection = currentSectionIndex > 0 ? SECTIONS[currentSectionIndex - 1] : null;
  const nextSection = currentSectionIndex < SECTIONS.length - 1 ? SECTIONS[currentSectionIndex + 1] : null;

  return (
    <div className="relative w-full h-full min-h-0 min-w-0 overflow-y-auto bg-[#F8FAFC] text-[#07133D] select-none">
      {/* ── Background Subtle Atmospheric Tint ────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 15% 10%, #DBEAFE 0%, transparent 45%), radial-gradient(ellipse at 85% 20%, #EEF4FD 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ── Top Header Bar ──────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DCE7F6]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-[#2563EB] border border-blue-100">
                Documentation
              </span>
              <span className="text-xs text-[#556987]">v1.0.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              ResearchAI Platform Documentation
            </h1>
            <p className="text-sm text-[#556987] mt-1">
              Comprehensive reference for autonomous academic discovery, multi-agent workflows, reader telemetry, and APIs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#556987] border border-[#DCE7F6] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>
            )}
            {onStartResearch && (
              <button
                type="button"
                onClick={onStartResearch}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Search</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Documentation Layout: Sidebar + Main Content + Right TOC ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          {/* ── Left Sidebar Navigation (col-span-3) ──────────── */}
          <aside className="lg:col-span-3 sticky top-6 space-y-6">
            {/* Search Documentation Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#556987] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#DCE7F6] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-[#07133D] placeholder-[#94A3B8]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Tree */}
            <nav className="space-y-5" aria-label="Documentation sections">
              {categories.map(([category, items]) => (
                <div key={category} className="space-y-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#556987] px-3">
                    {category}
                  </h3>
                  <div className="space-y-0.5">
                    {items.map((sec) => {
                      const isActive = activeSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            setActiveSection(sec.id);
                            const el = document.getElementById(sec.id);
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                            isActive
                              ? "bg-blue-50 text-[#2563EB] font-bold border border-blue-200/80 shadow-2xs"
                              : "text-[#475569] hover:bg-white hover:text-[#07133D]"
                          }`}
                        >
                          <span className="truncate">{sec.title}</span>
                          {sec.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold shrink-0 ${
                                isActive
                                  ? "bg-[#2563EB] text-white"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                              }`}
                            >
                              {sec.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Quick Helper Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#DCE7F6] shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#07133D]">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                <span>Need Direct Support?</span>
              </div>
              <p className="text-[11px] text-[#556987] leading-relaxed">
                Connect with our academic engineering team for custom enterprise API integrations.
              </p>
              <a
                href="mailto:support@researchai.org"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline pt-1"
              >
                <span>Contact Engineering</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </aside>

          {/* ── Center Content Body (col-span-9) ───────────────── */}
          <main className="lg:col-span-9 space-y-12 pb-16">
            {/* Section 1: Getting Started */}
            <article id="getting-started" className="scroll-mt-6 space-y-6">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 01 &bull; Platform Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07133D]">
                  Getting Started &amp; System Architecture
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  ResearchAI is an autonomous scientific discovery and literature intelligence platform designed for scholars, scientists, and enterprise R&amp;D teams.
                </p>
              </div>

              {/* Callout Box: Note */}
              <div className="p-4 rounded-2xl bg-[#EEF4FD] border border-[#BFDBFE] flex items-start gap-3 text-xs leading-relaxed text-[#1E40AF]">
                <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#2563EB]" />
                <div>
                  <strong className="font-bold text-[#07133D] block mb-0.5">Zero API Key Barrier for Searches</strong>
                  Literature searches across OpenAlex and preprint indexes run natively through ResearchAI servers without requiring individual OpenAI or database credentials.
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#07133D] pt-2">System Topology</h3>
              <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
                The architecture is decoupled into three primary tiers: client presentation, local privacy telemetry, and a multi-agent orchestration service:
              </p>

              {/* Architecture 3-Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-[#07133D]">Discovery Tier</h4>
                  <p className="text-xs text-[#556987] leading-relaxed">
                    Indexes 250M+ OpenAlex records with BM25 citation-aware ranking and parametric filtering.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-[#07133D]">Multi-Agent Pipeline</h4>
                  <p className="text-xs text-[#556987] leading-relaxed">
                    4 specialized agents extract methodology, evaluate datasets, detect contradictions, and synthesize reviews.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h4 className="text-sm font-bold text-[#07133D]">Telemetry Engine</h4>
                  <p className="text-xs text-[#556987] leading-relaxed">
                    Client-side event-driven store tracking queries, paper reading velocity, and hours saved metrics.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 2: Autonomous Literature Search */}
            <article id="autonomous-search" className="scroll-mt-6 space-y-6 pt-6 border-t border-[#DCE7F6]">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 02 &bull; Search Indexation
                </span>
                <h2 className="text-2xl font-extrabold text-[#07133D]">
                  Autonomous Literature Search &amp; BM25 Reranking
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  Query global scholarly indexes with citation weighting, publication velocity, and field of study filtering.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#556987] leading-relaxed">
                <p>
                  When a query is dispatched, ResearchAI normalizes terms, generates semantic sub-queries, and communicates directly with the OpenAlex REST API. Results are then processed through a BM25 relevance scorer:
                </p>
                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] font-mono text-xs text-[#07133D] overflow-x-auto">
                  {'BM25(D, Q) = ∑ IDF(q_i) · [f(q_i, D) · (k_1 + 1)] / [f(q_i, D) + k_1 · (1 - b + b · |D| / avgdl)]'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF3C7]/40 border border-[#FDE68A] flex items-start gap-3 text-xs leading-relaxed text-[#92400E]">
                <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-[#D97706]" />
                <div>
                  <strong className="font-bold text-[#78350F] block mb-0.5">Filtering Capabilities</strong>
                  You can restrict searches by exact year preset (e.g. 2026, 2025, 2024), custom result limits (5 to 50 papers), sorting by relevance, latest publication date, or citation count.
                </div>
              </div>
            </article>

            {/* Section 3: 4-Agent Intelligence Pipeline */}
            <article id="multi-agent-pipeline" className="scroll-mt-6 space-y-6 pt-6 border-t border-[#DCE7F6]">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 03 &bull; Autonomous Synthesis
                </span>
                <h2 className="text-2xl font-extrabold text-[#07133D]">
                  The 4-Agent Research Intelligence Pipeline
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  Deep cross-paper synthesis powered by a specialized sequential agent chain.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    A1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#07133D]">Agent 1: Discovery &amp; Query Formulation</h4>
                    <p className="text-xs text-[#556987] mt-1 leading-relaxed">
                      Decomposes broad research queries into precise academic keywords, handles multi-repository pagination, and dedupes overlapping works via DOI/OpenAlex ID.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#059669] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    A2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#07133D]">Agent 2: Paper Structural Extraction</h4>
                    <p className="text-xs text-[#556987] mt-1 leading-relaxed">
                      Scans abstracts and full-text corpora to extract explicit research problems, experimental methodology, neural architectures, benchmark datasets, and empirical metrics.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    A3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#07133D]">Agent 3: Research Gap &amp; Trend Exploration</h4>
                    <p className="text-xs text-[#556987] mt-1 leading-relaxed">
                      Cross-references findings to isolate points of scientific agreement, conflicting claims, methodological drift across publication years, and candidate research voids.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    A4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#07133D]">Agent 4: Literature Synthesis</h4>
                    <p className="text-xs text-[#556987] mt-1 leading-relaxed">
                      Compiles executive summaries, comparative tables, and literature review sections supported by verified inline academic references.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 4: Interactive AI Reader & Copilot */}
            <article id="ai-reader" className="scroll-mt-6 space-y-6 pt-6 border-t border-[#DCE7F6]">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 04 &bull; Document Telemetry
                </span>
                <h2 className="text-2xl font-extrabold text-[#07133D]">
                  Interactive AI Reader &amp; Research Copilot
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  In-browser document reader accessible at <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[#2563EB]">/reader?id=...</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] space-y-2">
                  <h4 className="text-xs font-bold text-[#07133D] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                    <span>Dual Viewing Modes</span>
                  </h4>
                  <p className="text-xs text-[#556987] leading-relaxed">
                    Toggle between structured section view for fast mobile reading and direct embedded PDF viewer for high-fidelity equations and tables.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#DCE7F6] space-y-2">
                  <h4 className="text-xs font-bold text-[#07133D] flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#2563EB]" />
                    <span>Context-Aware Copilot</span>
                  </h4>
                  <p className="text-xs text-[#556987] leading-relaxed">
                    Ask questions grounded in the current document context. Highlight any passage and click &quot;Ask AI&quot; for instant mathematical or methodological explanations.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 5: Research Analytics Engine */}
            <article id="analytics-engine" className="scroll-mt-6 space-y-6 pt-6 border-t border-[#DCE7F6]">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 05 &bull; Quantitative Telemetry
                </span>
                <h2 className="text-2xl font-extrabold text-[#07133D]">
                  Research Analytics Engine &amp; Formulations
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  Real-time analytics engine tracking searches, document reads, and productivity gains.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
                The analytics engine runs in <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[#2563EB]">src/lib/analytics-store.ts</code>. It listens to client research events, reconciles historical library saves, and applies standard academic acceleration metrics:
              </p>

              {/* Mathematical formulation table */}
              <div className="overflow-x-auto rounded-xl border border-[#DCE7F6] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#DCE7F6] text-[#07133D]">
                    <tr>
                      <th className="p-3 font-bold">Metric</th>
                      <th className="p-3 font-bold">Mathematical Formulation</th>
                      <th className="p-3 font-bold">Operational Definition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE7F6] text-[#475569]">
                    <tr>
                      <td className="p-3 font-semibold text-[#07133D]">Hours Saved</td>
                      <td className="p-3 font-mono text-[#2563EB]">round(1.5 &bull; Q + 2.0 &bull; V + 0.5 &bull; S)</td>
                      <td className="p-3">1.5h per search synthesis, 2.0h per paper parsed, 0.5h per saved paper.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#07133D]">Period Growth Delta</td>
                      <td className="p-3 font-mono text-[#2563EB]">round((M_curr - M_prev) / M_prev) &bull; 100%</td>
                      <td className="p-3">Percentage growth compared to identical prior period duration.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#07133D]">Open Access Rate</td>
                      <td className="p-3 font-mono text-[#2563EB]">round(V_OA / V_total) &bull; 100%</td>
                      <td className="p-3">Ratio of publicly accessible open literature reviewed.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#07133D]">Mean Citation Impact</td>
                      <td className="p-3 font-mono text-[#2563EB]">round(sum(Citations) / Total_Papers)</td>
                      <td className="p-3">Average citation density across examined documents.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            {/* Section 6: Personal Library & Collections */}
            <article id="library-collections" className="scroll-mt-6 space-y-6 pt-6 border-t border-[#DCE7F6]">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 06 &bull; Organization
                </span>
                <h2 className="text-2xl font-extrabold text-[#07133D]">
                  Personal Research Library &amp; Annotations
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  Persistent workspace for cataloging papers, organizing notes, and tracking reading status.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#556987] leading-relaxed">
                <p>
                  Documents can be saved with one click from any search card. The library organizes items under three explicit reading states:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white border border-[#DCE7F6]">
                    <span className="text-xs font-bold text-slate-700 block mb-1">Unread</span>
                    <p className="text-[11px] text-[#556987]">Queued papers scheduled for literature review.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#DCE7F6]">
                    <span className="text-xs font-bold text-[#10B981] block mb-1">Read</span>
                    <p className="text-[11px] text-[#556987]">Documents opened and inspected in AI Reader.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#DCE7F6]">
                    <span className="text-xs font-bold text-[#2563EB] block mb-1">Has Notes</span>
                    <p className="text-[11px] text-[#556987]">Contains personal annotations or quad-color highlights.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 7: API Reference */}
            <article id="api-reference" className="scroll-mt-6 space-y-6 pt-6 border-t border-[#DCE7F6]">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 07 &bull; Developer API
                </span>
                <h2 className="text-2xl font-extrabold text-[#07133D]">
                  API Reference &amp; Code Samples
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  Programmatic endpoints for executing academic discovery and agent orchestration.
                </p>
              </div>

              {/* Tabbed Code Snippet */}
              <div className="rounded-2xl border border-[#DCE7F6] bg-[#07133D] overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 bg-[#0B1A4D] border-b border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-bold text-white">POST /api/test/openalex</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(["typescript", "curl", "python"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveApiTab(tab)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors cursor-pointer ${
                          activeApiTab === tab
                            ? "bg-[#2563EB] text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 text-xs font-mono text-slate-200 relative overflow-x-auto">
                  {activeApiTab === "typescript" && (
                    <pre className="leading-relaxed">
                      {`const response = await fetch("/api/test/openalex", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "Vision Transformers for plant disease classification",
    limit: 15,
    sortBy: "relevance",
    yearFrom: 2022
  })
});

const { papers, totalResults } = await response.json();
console.log(\`Found \${totalResults} papers; received \${papers.length}\`);`}
                    </pre>
                  )}

                  {activeApiTab === "curl" && (
                    <pre className="leading-relaxed">
                      {`curl -X POST http://localhost:3000/api/test/openalex \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Large language models for clinical diagnosis",
    "limit": 10,
    "sortBy": "citations"
  }'`}
                    </pre>
                  )}

                  {activeApiTab === "python" && (
                    <pre className="leading-relaxed">
                      {`import requests

payload = {
    "query": "Quantum computing algorithms for optimization",
    "limit": 15,
    "sortBy": "latest"
}

response = requests.post("http://localhost:3000/api/test/openalex", json=payload)
data = response.json()
print("Indexed publications:", data["totalResults"])`}
                    </pre>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        activeApiTab === "typescript"
                          ? `const res = await fetch("/api/test/openalex", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: "Vision Transformers", limit: 15 }) });`
                          : activeApiTab === "curl"
                          ? `curl -X POST http://localhost:3000/api/test/openalex -H "Content-Type: application/json" -d '{"query":"AI healthcare","limit":10}'`
                          : `import requests\nr = requests.post("http://localhost:3000/api/test/openalex", json={"query": "AI healthcare", "limit": 10})\nprint(r.json())`,
                        "code-api"
                      )
                    }
                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy code snippet"
                  >
                    {copiedKey === "code-api" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </article>

            {/* Section 8: FAQ */}
            <article id="faq" className="scroll-mt-6 space-y-6 pt-6 border-t border-[#DCE7F6]">
              <div className="border-b border-[#DCE7F6] pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                  Section 08 &bull; FAQs
                </span>
                <h2 className="text-2xl font-extrabold text-[#07133D]">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-[#556987] mt-1.5 leading-relaxed">
                  Common questions regarding platform deployment, search indexing, and security.
                </p>
              </div>

              <div className="space-y-3">
                <details className="p-4 rounded-xl bg-white border border-[#DCE7F6] group">
                  <summary className="font-bold text-xs sm:text-sm text-[#07133D] cursor-pointer flex items-center justify-between">
                    <span>Do I need an OpenAI API key to perform paper searches?</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="text-xs text-[#556987] mt-2.5 leading-relaxed">
                    No. The primary literature search, BM25 relevance reranking, and metadata extraction communicate with OpenAlex directly on the server without requiring any LLM API key. An OpenAI API key is only required if you invoke the AI Copilot inside the Reader or request full literature synthesis.
                  </p>
                </details>

                <details className="p-4 rounded-xl bg-white border border-[#DCE7F6] group">
                  <summary className="font-bold text-xs sm:text-sm text-[#07133D] cursor-pointer flex items-center justify-between">
                    <span>How does ResearchAI protect user research privacy?</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="text-xs text-[#556987] mt-2.5 leading-relaxed">
                    Personal analytics, reading logs, quad-color highlights, and search history remain strictly on the client device via standard browser storage. We do not inject third-party advertising or commercial behavioral tracking pixels.
                  </p>
                </details>

                <details className="p-4 rounded-xl bg-white border border-[#DCE7F6] group">
                  <summary className="font-bold text-xs sm:text-sm text-[#07133D] cursor-pointer flex items-center justify-between">
                    <span>Can I export citations into BibTeX or Zotero?</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="text-xs text-[#556987] mt-2.5 leading-relaxed">
                    Yes. Every paper card and reading drawer features standard citation copying (APA, IEEE, BibTeX) and direct DOI link resolution.
                  </p>
                </details>
              </div>
            </article>

            {/* ── Bottom Section Navigation ──────────────────────── */}
            <div className="pt-8 border-t border-[#DCE7F6] flex items-center justify-between gap-4">
              {prevSection ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection(prevSection.id);
                    document.getElementById(prevSection.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F6] hover:border-[#2563EB] text-xs font-bold text-[#07133D] flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB]" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-medium block">Previous</span>
                    <span>{prevSection.title}</span>
                  </div>
                </button>
              ) : <div />}

              {nextSection ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection(nextSection.id);
                    document.getElementById(nextSection.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F6] hover:border-[#2563EB] text-xs font-bold text-[#07133D] flex items-center gap-2 cursor-pointer shadow-2xs transition-all text-right"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Next</span>
                    <span>{nextSection.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                </button>
              ) : <div />}
            </div>

            {/* ── Feedback Widget ─────────────────────────────────── */}
            <div className="p-4 rounded-2xl bg-white border border-[#DCE7F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#07133D]">
                Was this documentation helpful for your research?
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {feedbackGiven === null ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setFeedbackGiven(true)}
                      className="px-3 py-1.5 rounded-lg border border-[#DCE7F6] hover:bg-slate-50 font-semibold text-[#07133D] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Yes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackGiven(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#DCE7F6] hover:bg-slate-50 font-semibold text-[#07133D] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                      <span>No</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[#10B981] font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Thank you for your feedback!</span>
                  </span>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
