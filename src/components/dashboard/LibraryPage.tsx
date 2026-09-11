"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Folder,
  Bookmark,
  Lightbulb,
  FileText,
  Search,
  LayoutGrid,
  List,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LibraryPageProps {
  onStartResearch?: () => void;
  onSelectTopic?: (topic: string) => void;
}

type LibraryTab = "projects" | "saved" | "gaps" | "notes";
type ViewMode = "grid" | "list";

const popularTopics = [
  "AI in Healthcare",
  "Climate Change",
  "Crop Disease Detection",
  "Renewable Energy",
  "Large Language Models",
];

/* ─── Animated 3D Folder & Documents Illustration ───────────────────────── */
function LibraryIllustration() {
  return (
    <div className="relative w-72 h-56 flex items-center justify-center select-none mx-auto mb-2">
      {/* Soft Dotted Orbital / Constellation Circles */}
      <svg
        className="absolute inset-0 w-full h-full text-blue-200/60 pointer-events-none"
        viewBox="0 0 280 220"
        fill="none"
      >
        <ellipse
          cx="140"
          cy="115"
          rx="115"
          ry="65"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <ellipse
          cx="140"
          cy="115"
          rx="75"
          ry="40"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity="0.5"
        />
      </svg>

      {/* Floating Badge 1: Document (Top Left) */}
      <motion.div
        className="absolute left-6 top-16 w-9 h-9 rounded-full bg-white shadow-[0_4px_16px_rgba(37,99,235,0.12)] border border-blue-100 flex items-center justify-center text-[#2563EB] z-20"
        animate={{ y: [-4, 4, -4], x: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <FileText className="w-4 h-4" strokeWidth={2.2} />
      </motion.div>

      {/* Floating Badge 2: Bookmark Ribbon (Top Right) */}
      <motion.div
        className="absolute right-12 top-8 w-9 h-9 rounded-full bg-white shadow-[0_4px_16px_rgba(37,99,235,0.12)] border border-blue-100 flex items-center justify-center text-[#2563EB] z-20"
        animate={{ y: [4, -4, 4], x: [2, -2, 2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bookmark className="w-4 h-4" strokeWidth={2.2} />
      </motion.div>

      {/* Floating Badge 3: Lightbulb (Mid Right) */}
      <motion.div
        className="absolute right-8 bottom-14 w-9 h-9 rounded-full bg-white shadow-[0_4px_16px_rgba(37,99,235,0.12)] border border-blue-100 flex items-center justify-center text-[#2563EB] z-20"
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lightbulb className="w-4 h-4" strokeWidth={2.2} />
      </motion.div>

      {/* Center 3D Isometric Folder + Papers Illustration */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Paper 1 (Back left, tilted) */}
        <motion.div
          className="absolute -top-10 -left-6 w-24 h-32 bg-white rounded-xl shadow-[0_8px_20px_rgba(30,60,120,0.08)] border border-slate-100 p-2.5 flex flex-col gap-1.5 rotate-[-12deg]"
          animate={{ rotate: [-12, -10, -12], y: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-1.5 bg-blue-100 rounded-full" />
          <div className="w-16 h-1 bg-slate-100 rounded-full" />
          <div className="w-14 h-1 bg-slate-100 rounded-full" />
          <div className="w-12 h-1 bg-slate-100 rounded-full" />
        </motion.div>

        {/* Paper 2 (Back center/right, upright) */}
        <motion.div
          className="absolute -top-12 left-2 w-26 h-34 bg-white/95 rounded-xl shadow-[0_10px_24px_rgba(30,60,120,0.1)] border border-slate-100 p-3 flex flex-col gap-2 rotate-[4deg]"
          animate={{ rotate: [4, 6, 4], y: [2, -2, 2] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-10 h-1.5 bg-blue-200 rounded-full" />
          <div className="w-18 h-1 bg-slate-100 rounded-full" />
          <div className="w-16 h-1 bg-slate-100 rounded-full" />
          <div className="w-20 h-1 bg-slate-100 rounded-full" />
          <div className="w-14 h-1 bg-slate-100 rounded-full" />
        </motion.div>

        {/* Blue Open Folder (Front) */}
        <motion.div
          className="relative w-36 h-28 rounded-2xl p-3 flex flex-col justify-between shadow-[0_16px_36px_rgba(37,99,235,0.32)] border border-blue-400/40"
          style={{
            background: "linear-gradient(145deg, #4A8BF8 0%, #2563EB 55%, #1D4ED8 100%)",
          }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
        >
          {/* Folder Tab at top-left */}
          <div
            className="absolute -top-3 left-2 w-14 h-4 rounded-t-lg"
            style={{ background: "#3B7BF6" }}
          />

          {/* Folder interior shading */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="w-3 h-3 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
          </div>

          {/* Sparkle emblem in center of folder */}
          <div className="relative z-10 flex items-center justify-center my-auto">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white drop-shadow-md"
            >
              <path
                d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Subtle bottom glossy reflection */}
          <div className="relative z-10 h-1 w-full bg-white/25 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

export default function LibraryPage({ onStartResearch, onSelectTopic }: LibraryPageProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("projects");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const tabs = [
    { id: "projects" as const, label: "Projects", icon: Folder },
    { id: "saved" as const, label: "Saved Papers", icon: Bookmark },
    { id: "gaps" as const, label: "Research Gaps", icon: Lightbulb },
    { id: "notes" as const, label: "Notes", icon: FileText },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      setNewProjectModalOpen(false);
      setProjectName("");
      // Trigger research or navigation
      onStartResearch?.();
    }
  };

  return (
    <motion.main
      className="w-full h-full min-h-0 min-w-0 flex-1 relative flex flex-col overflow-y-auto px-4 sm:px-6 lg:px-8 py-7 select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Your research library"
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

      <div className="relative z-10 w-full max-w-[1360px] mx-auto space-y-7 pb-12">
        {/* ── Top Header Section with Headline & Action Button ──── */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#556987]">
              LIBRARY
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#07133D] tracking-tight leading-tight">
              Your Research Library
            </h1>
            <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
              Keep all your research projects, saved papers, notes, and insights in one place. Organize, revisit, and turn your reading into real progress.
            </p>
          </div>

          {/* Right Action: "+ New Project" button + Handwritten Doodle */}
          <div className="flex flex-col items-end gap-2.5 shrink-0 self-start sm:self-auto">
            {/* Top-Right Handwritten Doodle ("Save. Organize. Build your research story.") */}
            <div className="hidden lg:flex flex-col items-end mr-4 select-none">
              <span
                className="text-base font-bold text-[#2A57C8] leading-tight rotate-[-3deg]"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Save.
              </span>
              <span
                className="text-base font-bold text-[#2A57C8] leading-tight rotate-[-1deg]"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Organize.
              </span>
              <span
                className="text-lg font-bold text-[#3A6BC7] leading-tight rotate-[-2deg]"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Build your research story.
              </span>
              {/* Curved arrow pointing downwards */}
              <svg
                width="28"
                height="32"
                viewBox="0 0 28 32"
                fill="none"
                className="text-[#3A6BC7] mr-4 mt-0.5"
              >
                <path
                  d="M18 2C18 12 12 20 4 28M4 28L12 28M4 28L6 20"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* "+ New Project" Button */}
            <motion.button
              type="button"
              onClick={() => setNewProjectModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.32)] transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.03, boxShadow: "0 6px 22px rgba(37,99,235,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.6} />
              <span>New Project</span>
            </motion.button>
          </div>
        </div>

        {/* ── Filter / Tab Toolbar & Search Row ─────────────────── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Left: 4 Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#EEF4FE] text-[#205DF8] border border-blue-200/70 shadow-xs"
                      : "bg-white/80 text-[#556987] hover:bg-white hover:text-[#07133D] border border-[#E2EAF4]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.4 : 2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Search + View Mode Switcher */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64 flex items-center bg-white/90 border border-[#DCE7F6] rounded-full px-3.5 py-1.5 shadow-2xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all">
              <Search className="w-3.5 h-3.5 text-[#6B80A8] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your library..."
                className="w-full bg-transparent text-xs text-[#07133D] placeholder-[#8EA3C0] outline-none focus:outline-none focus:ring-0 border-none font-normal"
              />
            </div>

            {/* Grid & List View Toggle */}
            <div className="flex items-center bg-white border border-[#DCE7F6] rounded-xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#EEF4FE] text-[#205DF8]"
                    : "text-[#64748B] hover:text-[#07133D]"
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#EEF4FE] text-[#205DF8]"
                    : "text-[#64748B] hover:text-[#07133D]"
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Empty State Glass Card ──────────────────────── */}
        <motion.div
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-[#E2EAF5] shadow-[0_4px_30px_rgba(32,93,248,0.06),0_1px_3px_rgba(0,0,0,0.03)] px-6 sm:px-12 py-12 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Central 3D Animated Illustration */}
          <LibraryIllustration />

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#07133D] tracking-tight mb-2">
            Your library is empty
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#556987] max-w-lg mx-auto leading-relaxed mb-6 font-normal">
            Start a research project, save interesting papers, and organize your thoughts. Everything you discover will appear here.
          </p>

          {/* CTA Button: "+ Start Your First Research" */}
          <div className="flex justify-center mb-8">
            <motion.button
              type="button"
              onClick={onStartResearch}
              className="px-6 py-3 rounded-2xl text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(37,99,235,0.38)] cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 28px rgba(37,99,235,0.48)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.8} />
              <span>Start Your First Research</span>
            </motion.button>
          </div>

          {/* "Or explore popular topics" Divider */}
          <div className="relative max-w-lg mx-auto flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80" />
            </div>
            <span className="relative bg-white px-4 text-[11px] font-semibold text-[#8DA0BC] uppercase tracking-wider">
              Or explore popular topics
            </span>
          </div>

          {/* Popular Topic Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-2xl mx-auto mb-8">
            {popularTopics.map((topic, idx) => (
              <motion.button
                key={topic}
                type="button"
                onClick={() => onSelectTopic?.(topic)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#4B6285] bg-[#F4F8FD] border border-[#DCE7F5] hover:bg-[#EEF4FF] hover:text-[#2563EB] hover:border-blue-200 transition-all duration-150 cursor-pointer shadow-2xs"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + idx * 0.04, duration: 0.25 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                {topic}
              </motion.button>
            ))}
          </div>

          {/* Bottom Slogan with Sparkle */}
          <p className="text-[11.5px] font-medium text-[#7C93B2] flex items-center justify-center gap-1.5">
            <span>Your next big idea could be just one paper away.</span>
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          </p>
        </motion.div>
      </div>

      {/* ── "New Project" Modal ───────────────────────────────── */}
      <AnimatePresence>
        {newProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewProjectModalOpen(false)}
            />

            {/* Modal Dialog */}
            <motion.div
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <Folder className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#07133D]">Create New Project</h3>
                  <p className="text-xs text-[#64748B]">Organize papers and research notes together</p>
                </div>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Deep Learning in Oncology"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] cursor-pointer shadow-sm"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
