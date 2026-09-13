"use client";

import { useState, useRef, useEffect } from "react";
import {
  Star,
  MoreVertical,
  ExternalLink,
  Download,
  Copy,
  Check,
  BookOpen,
  Trash2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ResearchPaper } from "@/types/research-paper";
import {
  useLibraryPapers,
  formatSavedTime,
  PaperReadingStatus,
  SavedPaper,
} from "@/lib/library-papers";
import { addNotification } from "@/lib/notifications";
import { setActiveReaderPaper } from "@/lib/paper-reader-store";
import { recordPaperView } from "@/lib/analytics-store";

interface PaperCardProps {
  paper: ResearchPaper;
  index?: number;
  onSelectTopic?: (topic: string) => void;
}

/* ── Intelligent Topic Fallback Extraction ────────────────────────────── */
function getPaperTopics(paper: ResearchPaper): string[] {
  if (paper.topics && paper.topics.length > 0) {
    return paper.topics.slice(0, 4);
  }

  const foundTopics: string[] = [];
  const text = `${paper.title} ${paper.abstract || ""}`.toLowerCase();

  const curatedTopics = [
    "Computer Vision",
    "Deep Learning",
    "Machine Learning",
    "Vision Transformer",
    "Crop Disease",
    "Plant Disease",
    "Agriculture",
    "Precision Agriculture",
    "Mobile Computing",
    "Edge AI",
    "Sensor Data",
    "Multimodal AI",
    "Early Detection",
    "Transfer Learning",
    "Domain Adaptation",
    "Large Language Models",
    "Natural Language Processing",
    "Healthcare AI",
    "Neural Networks",
    "Data Science",
    "Biomedical Informatics",
  ];

  for (const topic of curatedTopics) {
    if (text.includes(topic.toLowerCase())) {
      foundTopics.push(topic);
      if (foundTopics.length >= 4) break;
    }
  }

  if (foundTopics.length === 0) {
    // Extract capitalized words from title as fallback tags
    const titleWords = paper.title
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 3 &&
          !["with", "from", "that", "this", "based", "using", "into", "their", "about", "study", "review"].includes(
            w.toLowerCase()
          )
      );
    foundTopics.push(
      ...titleWords.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    );
  }

  return foundTopics.slice(0, 4);
}

/* ── Author Line Formatter (e.g. Zhang et al.) ─────────────────────────── */
function formatAuthorString(authors: string[]): string {
  if (!authors || authors.length === 0) return "Unknown authors";
  if (authors.length === 1) return authors[0];
  const first = authors[0].trim();
  // Extract last name or full first author
  const lastName = first.split(" ").slice(-1)[0] || first;
  return `${lastName} et al.`;
}

/* ── Venue / Journal Formatter ────────────────────────────────────────── */
function formatVenue(paper: ResearchPaper): string {
  if (paper.venue && paper.venue.trim().length > 0) {
    return paper.venue.trim();
  }
  if (paper.source && paper.source !== "OpenAlex") {
    return paper.source;
  }
  return "Academic Journal";
}

export default function PaperCard({ paper, index = 0, onSelectTopic }: PaperCardProps) {
  const { savedPapers, isSaved, toggleSave, updateStatus, removePaper } = useLibraryPapers();
  const saved = isSaved(paper.id);
  const savedEntry = savedPapers.find((p) => p.id === paper.id);

  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowSaved = toggleSave(paper);
    if (nowSaved) {
      addNotification("Paper Saved to Library", `"${paper.title}" was added to your library.`, "save");
    } else {
      addNotification("Paper Removed", `"${paper.title}" was removed from your library.`, "library");
    }
  };

  const handleStatusCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!saved) {
      toggleSave(paper);
      addNotification("Paper Saved to Library", `"${paper.title}" was added to your library.`, "save");
      return;
    }
    const currentStatus = savedEntry?.status || "unread";
    const nextStatus: PaperReadingStatus =
      currentStatus === "unread"
        ? "read"
        : currentStatus === "read"
        ? "has_notes"
        : "unread";
    updateStatus(paper.id, nextStatus);
    const label = nextStatus === "read" ? "Read" : nextStatus === "has_notes" ? "Has Notes" : "Unread";
    addNotification("Status Updated", `Marked "${paper.title}" as ${label}.`, "status");
  };

  const handleCopyDoi = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (paper.doi) {
      navigator.clipboard.writeText(`https://doi.org/${paper.doi}`);
      setCopiedDoi(true);
      setTimeout(() => setCopiedDoi(false), 2000);
      setMenuOpen(false);
      addNotification("DOI Copied", `Copied DOI for "${paper.title}" to clipboard.`, "copy");
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = paper.url || paper.pdfUrl || (paper.doi ? `https://doi.org/${paper.doi}` : "");
    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setMenuOpen(false);
      addNotification("Link Copied", `Copied link for "${paper.title}" to clipboard.`, "copy");
    }
  };

  const handleOpenReader = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setActiveReaderPaper(paper);
    recordPaperView(paper);
    window.open(`/reader?id=${encodeURIComponent(paper.id)}`, "_blank");
    addNotification("Paper Opened", `Opened "${paper.title}" in AI Reader.`, "library");
  };

  const topics = getPaperTopics(paper);
  const authorStr = formatAuthorString(paper.authors);
  const venueStr = formatVenue(paper);
  const yearStr = paper.year ? String(paper.year) : "2024";

  const targetLink = paper.url || paper.pdfUrl || (paper.doi ? `https://doi.org/${paper.doi}` : null);

  // Determine right side status pill configuration
  const currentStatus: PaperReadingStatus = savedEntry?.status || "unread";

  return (
    <motion.article
      className="relative bg-white/95 rounded-2xl border border-slate-200/80 hover:border-blue-300/80 p-4 sm:p-5 shadow-[0_2px_10px_rgba(30,60,120,0.03)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 flex items-start sm:items-center justify-between gap-3 sm:gap-5 group"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label={paper.title}
    >
      {/* ── Left Column: Dedicated PDF Document Badge Thumbnail ─── */}
      <button
        type="button"
        onClick={handleOpenReader}
        title="Open in AI Reader with interactive highlighting"
        className="w-13 h-16 sm:w-16 sm:h-20 bg-[#F1F6FD] border border-[#D7E5F8] rounded-xl flex flex-col items-center justify-center p-2 shrink-0 group-hover:border-blue-300 group-hover:bg-[#EBF3FD] transition-all cursor-pointer shadow-2xs select-none"
      >
        {/* Document Icon with folded top-right corner and horizontal lines */}
        <div className="relative">
          <svg
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            className="text-slate-400 group-hover:text-blue-600 transition-colors"
          >
            {/* Sheet of paper */}
            <path
              d="M4 2C2.89543 2 2 2.89543 2 4V24C2 25.1046 2.89543 26 4 26H20C21.1046 26 22 25.1046 22 24V8.5L15.5 2H4Z"
              fill="#FFFFFF"
              stroke="#A0B3CC"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Folded corner tab */}
            <path
              d="M15 2V8.5H21.5"
              stroke="#A0B3CC"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Horizontal line details simulating text */}
            <line
              x1="6"
              y1="12"
              x2="15"
              y2="12"
              stroke="#B8C8DD"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="6"
              y1="16"
              x2="13"
              y2="16"
              stroke="#B8C8DD"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="6"
              y1="20"
              x2="16"
              y2="20"
              stroke="#B8C8DD"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {/* PDF bold badge text */}
        <span className="text-[10px] sm:text-[11px] font-black text-[#1E5BF0] tracking-wide mt-1 uppercase">
          PDF
        </span>
      </button>

      {/* ── Middle Column: Title, Author/Year/Venue & Topic Pills ─── */}
      <div className="flex-1 min-w-0 pr-2">
        {/* Paper Title */}
        <h2 className="text-sm sm:text-[16px] font-bold text-[#07133D] leading-snug line-clamp-2 mb-1 group-hover:text-[#2563EB] transition-colors">
          <button
            type="button"
            onClick={handleOpenReader}
            className="text-left font-bold hover:underline focus:outline-none cursor-pointer"
            title="Open in ResearchAI Reader & AI Copilot"
          >
            {paper.title}
          </button>
        </h2>

        {/* Subtitle: Author • Year • Journal / Venue */}
        <p className="text-xs text-[#556987] font-medium flex items-center gap-1.5 mb-2.5 flex-wrap">
          <span className="text-[#334155] font-semibold">{authorStr}</span>
          <span className="text-slate-400">•</span>
          <span>{yearStr}</span>
          <span className="text-slate-400">•</span>
          <span className="text-[#556987] truncate max-w-[280px] sm:max-w-md">
            {venueStr}
          </span>
        </p>

        {/* Topic Tag Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTopic?.(topic);
              }}
              className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-[#F1F5F9] text-[#475569] border border-slate-200/60 hover:bg-[#E2E8F0] hover:text-[#1E293B] transition-colors whitespace-nowrap cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right Column: Save Star Icon, 3-dots Menu, Timestamp & Status Pill ─── */}
      <div className="flex flex-col items-end justify-between self-stretch gap-2 shrink-0 min-w-[110px] sm:min-w-[130px]">
        {/* Top Action Buttons (Star + More) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Star Save Button */}
          <motion.button
            type="button"
            onClick={handleToggleSave}
            title={saved ? "Saved in Library (Click to remove)" : "Save to Library"}
            aria-label={saved ? "Remove paper from library" : "Save paper to library"}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              saved
                ? "text-[#2563EB] hover:bg-blue-50"
                : "text-slate-400 hover:text-[#2563EB] hover:bg-blue-50/60"
            }`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
          >
            <Star
              className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-all duration-200 ${
                saved
                  ? "fill-[#2563EB] text-[#2563EB] drop-shadow-[0_2px_6px_rgba(37,99,235,0.35)]"
                  : "text-slate-400 hover:text-[#2563EB]"
              }`}
              strokeWidth={saved ? 0 : 2}
            />
          </motion.button>

          {/* 3-dots Menu Dropdown Button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="More options"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Menu Popover */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs text-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleOpenReader();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-blue-50 hover:text-[#2563EB] flex items-center gap-2 cursor-pointer font-semibold text-[#2563EB]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open in AI Reader</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className="w-full text-left px-3.5 py-2 hover:bg-blue-50 hover:text-[#2563EB] flex items-center gap-2 cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        saved ? "fill-[#2563EB] text-[#2563EB]" : "text-slate-500"
                      }`}
                    />
                    <span>{saved ? "Remove from Library" : "Save to Library"}</span>
                  </button>

                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setMenuOpen(false);
                        addNotification("PDF Download", `Opening PDF for "${paper.title}".`, "download");
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download PDF</span>
                    </a>
                  )}

                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setMenuOpen(false);
                        addNotification("Source Opened", `Navigated to source page for "${paper.title}".`, "library");
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Open Source Page</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{copiedLink ? "Link Copied!" : "Copy Paper Link"}</span>
                  </button>

                  {paper.doi && (
                    <button
                      type="button"
                      onClick={handleCopyDoi}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      {copiedDoi ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{copiedDoi ? "DOI Copied!" : "Copy DOI"}</span>
                    </button>
                  )}

                  {saved && (
                    <div className="border-t border-slate-100 my-1 pt-1">
                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Reading Status
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateStatus(paper.id, "unread");
                          setMenuOpen(false);
                          addNotification("Reading Status", `Marked "${paper.title}" as Unread.`, "status");
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Unread</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateStatus(paper.id, "read");
                          setMenuOpen(false);
                          addNotification("Reading Status", `Marked "${paper.title}" as Read.`, "status");
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>Read</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateStatus(paper.id, "has_notes");
                          setMenuOpen(false);
                          addNotification("Reading Status", `Marked "${paper.title}" as Has Notes.`, "status");
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                        <span>Has Notes</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Timestamp or Citations Line */}
        <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
          {saved && savedEntry ? (
            formatSavedTime(savedEntry.savedAt)
          ) : (
            <span title={`${paper.citationCount} citations`}>
              {paper.citationCount > 0
                ? `${paper.citationCount.toLocaleString()} citations`
                : "Open Access"}
            </span>
          )}
        </div>

        {/* Bottom Status Badge (● Unread / ● Read / ● Has Notes) */}
        {saved ? (
          <button
            type="button"
            onClick={handleStatusCycle}
            title="Click to cycle status: Unread → Read → Has Notes"
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentStatus === "read"
                ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/80"
                : currentStatus === "has_notes"
                ? "bg-purple-50/80 text-purple-700 border-purple-200/60 hover:bg-purple-100/80"
                : "bg-blue-50/80 text-blue-700 border-blue-200/60 hover:bg-blue-100/80"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentStatus === "read"
                  ? "bg-emerald-600"
                  : currentStatus === "has_notes"
                  ? "bg-purple-600"
                  : "bg-blue-600"
              }`}
            />
            <span>
              {currentStatus === "read"
                ? "Read"
                : currentStatus === "has_notes"
                ? "Has Notes"
                : "Unread"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggleSave}
            title="Click to save in your Library"
            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100/70 text-slate-600 border border-slate-200/60 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Save</span>
          </button>
        )}
      </div>
    </motion.article>
  );
}
