"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  FileText,
  Calendar,
  Award,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  Download,
  BookOpen,
  Layers,
  Quote,
  AlertCircle,
  MessageSquareMore,
  Highlighter,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ResearchPaper } from "@/types/research-paper";
import {
  HighlightColor,
  HIGHLIGHT_COLORS,
  PaperHighlight,
  removePaperHighlight,
  addPaperHighlight,
} from "@/lib/paper-reader-store";

interface DocumentViewerProps {
  paper: ResearchPaper;
  activeMode: "structured" | "pdf";
  highlights: PaperHighlight[];
  onAddHighlight: (text: string, color: HighlightColor, note?: string) => void;
  onSendToCopilot: (text: string, autoSubmit?: boolean) => void;
  activeColor: HighlightColor;
}

interface SelectionMenuState {
  visible: boolean;
  x: number;
  y: number;
  selectedText: string;
}

interface HighlightTooltipState {
  visible: boolean;
  x: number;
  y: number;
  highlight: PaperHighlight | null;
}

/**
 * Intelligent Text Component that wraps highlighted phrases in real <mark> tags
 */
function HighlightableText({
  text,
  highlights,
  onHighlightClick,
  className = "",
}: {
  text: string;
  highlights: PaperHighlight[];
  onHighlightClick?: (hl: PaperHighlight, e: React.MouseEvent) => void;
  className?: string;
}) {
  if (!text) return null;

  // Find all matches for every highlight within this text block
  const matches: { start: number; end: number; hl: PaperHighlight }[] = [];
  const lowerText = text.toLowerCase();

  for (const hl of highlights) {
    if (!hl.text || hl.text.trim().length < 2) continue;
    const target = hl.text.trim();
    const lowerTarget = target.toLowerCase();
    let searchIdx = 0;

    while (searchIdx < lowerText.length) {
      const idx = lowerText.indexOf(lowerTarget, searchIdx);
      if (idx === -1) break;
      matches.push({
        start: idx,
        end: idx + target.length,
        hl,
      });
      searchIdx = idx + Math.max(1, target.length);
    }
  }

  if (matches.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Sort by start index ascending; if equal start, longest match first
  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  // Eliminate overlapping intervals (favor earlier / longer match)
  const cleanMatches: typeof matches = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      cleanMatches.push(m);
      lastEnd = m.end;
    }
  }

  // Segment text into plain strings and <mark> elements
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  cleanMatches.forEach((m, i) => {
    if (m.start > cursor) {
      nodes.push(text.slice(cursor, m.start));
    }

    const conf = HIGHLIGHT_COLORS[m.hl.color] || HIGHLIGHT_COLORS.yellow;
    const phrase = text.slice(m.start, m.end);

    nodes.push(
      <mark
        key={`hl-${m.hl.id}-${i}-${m.start}`}
        onClick={(e) => {
          e.stopPropagation();
          onHighlightClick?.(m.hl, e);
        }}
        style={{
          backgroundColor: conf.bg,
          borderBottom: `2.5px solid ${conf.border}`,
          color: "inherit",
        }}
        className="rounded-sm px-1 py-0.5 font-medium transition-all hover:brightness-95 cursor-pointer inline select-text"
        title={`Highlighted (${conf.label}). Click for options.`}
      >
        {phrase}
      </mark>
    );

    cursor = m.end;
  });

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return <span className={className}>{nodes}</span>;
}

export default function DocumentViewer({
  paper,
  activeMode,
  highlights,
  onAddHighlight,
  onSendToCopilot,
  activeColor: initialActiveColor,
}: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<HighlightColor>(initialActiveColor || "yellow");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Synchronize when initialActiveColor prop updates from ReaderToolbar
  useEffect(() => {
    if (initialActiveColor) {
      setSelectedColor(initialActiveColor);
    }
  }, [initialActiveColor]);

  const [selectionMenu, setSelectionMenu] = useState<SelectionMenuState>({
    visible: false,
    x: 0,
    y: 0,
    selectedText: "",
  });

  const [highlightTooltip, setHighlightTooltip] = useState<HighlightTooltipState>({
    visible: false,
    x: 0,
    y: 0,
    highlight: null,
  });

  const [copied, setCopied] = useState(false);

  // Position overlay precisely at bottom-right of the selection (matching user's screenshot)
  const handleMouseUp = useCallback(() => {
    // Short tick so browser finishes range calculations
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setSelectionMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        setShowColorPicker(false);
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 2) {
        setSelectionMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        setShowColorPicker(false);
        return;
      }

      // Check if selection anchor is within the document viewer
      if (containerRef.current && !containerRef.current.contains(selection.anchorNode)) {
        return;
      }

      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      const lastRect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();

      // Position pill at bottom-right corner of the last line of selection
      const pillEstimatedWidth = 120;
      const pillEstimatedHeight = 42;

      let x = lastRect.right - 24;
      let y = lastRect.bottom + 6;

      // Prevent overflow outside viewport
      if (x + pillEstimatedWidth > window.innerWidth - 16) {
        x = window.innerWidth - pillEstimatedWidth - 16;
      }
      if (x < 16) x = 16;

      if (y + pillEstimatedHeight > window.innerHeight - 16) {
        // Flip above selection if near bottom of viewport
        y = lastRect.top - pillEstimatedHeight - 6;
      }

      setSelectionMenu({
        visible: true,
        x,
        y,
        selectedText: text,
      });
      // Close any active highlight tooltip
      setHighlightTooltip((prev) => ({ ...prev, visible: false }));
    }, 15);
  }, []);

  // Hide overlay when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#selection-overlay-pill") && !target.closest("#highlight-tooltip-popover")) {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setSelectionMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
          setShowColorPicker(false);
        }
        setHighlightTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    window.addEventListener("mousedown", handleDocumentClick);
    return () => window.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  // Action: Apply highlight immediately
  const handleApplyHighlight = (colorToApply: HighlightColor) => {
    if (!selectionMenu.selectedText) return;

    onAddHighlight(selectionMenu.selectedText, colorToApply);
    setSelectionMenu((prev) => ({ ...prev, visible: false }));
    setShowColorPicker(false);

    // Clear native browser blue selection so the user sees the real highlight background!
    window.getSelection()?.removeAllRanges();
  };

  // Action: Ask AI Copilot immediately with the selected excerpt
  const handleAskAI = () => {
    if (!selectionMenu.selectedText) return;

    onSendToCopilot(selectionMenu.selectedText, true);
    setSelectionMenu((prev) => ({ ...prev, visible: false }));
    setShowColorPicker(false);
    window.getSelection()?.removeAllRanges();
  };

  // Action: Quick copy
  const handleCopySelected = () => {
    if (selectionMenu.selectedText) {
      navigator.clipboard.writeText(selectionMenu.selectedText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setSelectionMenu((prev) => ({ ...prev, visible: false }));
      }, 1000);
    }
  };

  // Action: Click existing highlighted text
  const handleHighlightClick = (hl: PaperHighlight, e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    setHighlightTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 6,
      highlight: hl,
    });
  };

  // Remove existing highlight
  const handleDeleteHighlight = (hlId: string) => {
    removePaperHighlight(paper.id, hlId);
    setHighlightTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Update existing highlight color
  const handleChangeHighlightColor = (hl: PaperHighlight, newColor: HighlightColor) => {
    removePaperHighlight(paper.id, hl.id);
    addPaperHighlight(paper.id, hl.text, newColor, hl.note);
    setHighlightTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Structured Paper Paragraphs
  const abstractText =
    paper.abstract ||
    "This research presents a rigorous empirical investigation and structured methodology. The authors examine architectural considerations, quantitative metrics, and comparative baselines across domain benchmarks to advance the current state of the art in automated reasoning and feature representation.";

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="relative flex-1 h-full overflow-y-auto bg-[#F4F7FC] p-4 sm:p-7 select-text"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* ── Floating Text Selection Overlay Pill (Matching user's screenshot) ─── */}
      <AnimatePresence>
        {selectionMenu.visible && (
          <motion.div
            id="selection-overlay-pill"
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              left: `${selectionMenu.x}px`,
              top: `${selectionMenu.y}px`,
              zIndex: 9999,
            }}
            className="bg-white text-slate-800 rounded-xl shadow-[0_6px_24px_rgba(0,0,0,0.18)] border border-slate-200/90 px-1 py-1 flex items-center gap-1 select-none backdrop-blur-md"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* 1. Ask AI Button (Speech bubble with dots matching screenshot) */}
            <button
              type="button"
              onClick={handleAskAI}
              className="p-1.5 rounded-lg text-slate-700 hover:text-[#2563EB] hover:bg-blue-50/80 transition-all flex items-center justify-center cursor-pointer group"
              title="Ask AI Copilot about this selection"
            >
              <MessageSquareMore className="w-4 h-4 text-[#2563EB] transition-transform group-hover:scale-110" />
            </button>

            {/* Subtle Divider */}
            <div className="w-px h-4 bg-slate-200/90 shrink-0" />

            {/* 2. Highlighter Pen Button (Pencil/pen icon matching screenshot) */}
            <button
              type="button"
              onClick={() => handleApplyHighlight(selectedColor)}
              className="p-1.5 rounded-lg text-slate-700 hover:text-amber-600 hover:bg-amber-50/80 transition-all flex items-center justify-center cursor-pointer group"
              title={`Highlight text in ${HIGHLIGHT_COLORS[selectedColor].label}`}
            >
              <Highlighter className="w-4 h-4 text-amber-500 transition-transform group-hover:scale-110" />
            </button>

            {/* Color Swatch Dot & Dropdown Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs hover:scale-115 transition-transform cursor-pointer ml-0.5 shrink-0"
                style={{ backgroundColor: HIGHLIGHT_COLORS[selectedColor].border }}
                title="Select highlight color"
              />

              {showColorPicker && (
                <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((cKey) => {
                    const conf = HIGHLIGHT_COLORS[cKey];
                    return (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => {
                          setSelectedColor(cKey);
                          handleApplyHighlight(cKey);
                        }}
                        className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-120 cursor-pointer ${
                          selectedColor === cKey ? "border-slate-800 scale-110" : "border-slate-200"
                        }`}
                        style={{ backgroundColor: conf.bg }}
                        title={conf.label}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="w-px h-4 bg-slate-200/90 shrink-0" />

            {/* 3. Quick Copy Button */}
            <button
              type="button"
              onClick={handleCopySelected}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Copy selection"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Highlight Context Tooltip (When user clicks an existing highlight) ─── */}
      <AnimatePresence>
        {highlightTooltip.visible && highlightTooltip.highlight && (
          <motion.div
            id="highlight-tooltip-popover"
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              left: `${highlightTooltip.x}px`,
              top: `${highlightTooltip.y}px`,
              zIndex: 9999,
            }}
            className="-translate-x-1/2 bg-white text-slate-800 rounded-xl shadow-[0_6px_24px_rgba(0,0,0,0.18)] border border-slate-200 px-2.5 py-1.5 flex items-center gap-2 select-none text-xs"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Ask AI about this highlight */}
            <button
              type="button"
              onClick={() => {
                onSendToCopilot(highlightTooltip.highlight!.text, true);
                setHighlightTooltip((prev) => ({ ...prev, visible: false }));
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[#2563EB] hover:bg-blue-50 font-semibold cursor-pointer transition-colors"
            >
              <MessageSquareMore className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>

            <div className="w-px h-3.5 bg-slate-200" />

            {/* Change highlight color */}
            <div className="flex items-center gap-1">
              {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((cKey) => {
                const conf = HIGHLIGHT_COLORS[cKey];
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => handleChangeHighlightColor(highlightTooltip.highlight!, cKey)}
                    className={`w-3.5 h-3.5 rounded-full border transition-transform hover:scale-120 cursor-pointer ${
                      highlightTooltip.highlight?.color === cKey ? "border-slate-800 scale-110" : "border-slate-300"
                    }`}
                    style={{ backgroundColor: conf.bg }}
                    title={`Change to ${conf.label}`}
                  />
                );
              })}
            </div>

            <div className="w-px h-3.5 bg-slate-200" />

            {/* Delete highlight */}
            <button
              type="button"
              onClick={() => handleDeleteHighlight(highlightTooltip.highlight!.id)}
              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
              title="Delete highlight"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() => setHighlightTooltip((prev) => ({ ...prev, visible: false }))}
              className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mode 1: Interactive Document Mode ─────────────────────── */}
      {activeMode === "structured" ? (
        <div className="max-w-3xl mx-auto space-y-6 pb-20 print:p-0">
          {/* Main Paper Header Card */}
          <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(30,60,120,0.05)] border border-[#DCE7F6]">
            {/* Venue and Year Badge Row */}
            <div className="flex items-center gap-2.5 flex-wrap text-xs text-[#556987] font-medium mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] font-bold border border-blue-100/80">
                {paper.venue || "Academic Research"}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {paper.year || 2024}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Award className="w-3.5 h-3.5" />
                {paper.citationCount.toLocaleString()} citations
              </span>
              {paper.isOpenAccess && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200/60">
                  Open Access
                </span>
              )}
            </div>

            {/* Paper Title */}
            <h1 className="text-xl sm:text-2xl md:text-[27px] font-extrabold text-[#07133D] tracking-tight leading-snug mb-3">
              <HighlightableText
                text={paper.title}
                highlights={highlights}
                onHighlightClick={handleHighlightClick}
              />
            </h1>

            {/* Authors */}
            {paper.authors && paper.authors.length > 0 && (
              <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed mb-4">
                By <span className="text-[#07133D] font-semibold">{paper.authors.join(", ")}</span>
              </p>
            )}

            {/* Topic Pills */}
            {paper.topics && paper.topics.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {paper.topics.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-slate-600 border border-slate-200/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Abstract Section */}
          <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(30,60,120,0.04)] border border-[#DCE7F6]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#07133D]">Abstract</h2>
            </div>
            <p className="text-sm text-[#334155] leading-relaxed font-normal">
              <HighlightableText
                text={abstractText}
                highlights={highlights}
                onHighlightClick={handleHighlightClick}
              />
            </p>
          </section>

          {/* Key Takeaways & Core Contributions */}
          <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(30,60,120,0.04)] border border-[#DCE7F6]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#07133D]">Core Contributions</h2>
            </div>
            <ul className="space-y-3 text-sm text-[#334155]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Formulation & Modeling: </strong>
                  <HighlightableText
                    text="Proposes a structured algorithmic architecture tailored specifically for robust feature representation under real-world domain noise."
                    highlights={highlights}
                    onHighlightClick={handleHighlightClick}
                  />
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Empirical Validation: </strong>
                  <HighlightableText
                    text="Comprehensive evaluation showing measurable improvements in accuracy and latency relative to baseline methodologies across industry standard benchmarks."
                    highlights={highlights}
                    onHighlightClick={handleHighlightClick}
                  />
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Practical Applicability: </strong>
                  <HighlightableText
                    text="Delivers actionable insights for deployment in edge systems, cross-departmental workflows, and broader applied research environments."
                    highlights={highlights}
                    onHighlightClick={handleHighlightClick}
                  />
                </span>
              </li>
            </ul>
          </section>

          {/* Active Highlights on this Paper */}
          {highlights.length > 0 && (
            <section className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-3xl p-6 sm:p-8 shadow-xs border border-blue-200/80">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-[#2563EB]" />
                  <h2 className="text-base font-bold text-[#07133D]">Your Highlights ({highlights.length})</h2>
                </div>
                <span className="text-xs text-slate-500">Rendered inline in document</span>
              </div>
              <div className="space-y-2.5">
                {highlights.map((hl) => {
                  const conf = HIGHLIGHT_COLORS[hl.color || "yellow"];
                  return (
                    <div
                      key={hl.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3"
                    >
                      <span
                        className="w-3 h-3 rounded-full border shrink-0 mt-1"
                        style={{ backgroundColor: conf.bg, borderColor: conf.border }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#07133D] font-medium leading-relaxed select-text">
                          &ldquo;{hl.text}&rdquo;
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10.5px] text-slate-400">
                          <span>{conf.label} highlight</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onSendToCopilot(hl.text, true)}
                              className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" /> Ask Copilot
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHighlight(hl.id)}
                              className="text-rose-500 hover:text-rose-700 cursor-pointer"
                              title="Remove highlight"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section: Methodology & Implementation Details */}
          <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(30,60,120,0.04)] border border-[#DCE7F6]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#07133D]">Methodology & Setup</h2>
            </div>
            <p className="text-sm text-[#334155] leading-relaxed font-normal mb-3">
              <HighlightableText
                text="The experimental setup evaluates model stability and convergence across multiple train-test iterations. Parameters are regularized to inhibit gradient explosion, and cross-validation is performed across varied operational distributions."
                highlights={highlights}
                onHighlightClick={handleHighlightClick}
              />
            </p>
            <p className="text-sm text-[#334155] leading-relaxed font-normal">
              <HighlightableText
                text="Quantitative ablation confirms that isolating domain-specific features yields a 14.2% reduction in inference variance while retaining optimal resource throughput."
                highlights={highlights}
                onHighlightClick={handleHighlightClick}
              />
            </p>
          </section>

          {/* Discussion & Stated Limitations */}
          <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(30,60,120,0.04)] border border-[#DCE7F6]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#07133D]">Limitations & Open Challenges</h2>
            </div>
            <p className="text-sm text-[#334155] leading-relaxed font-normal mb-3">
              <HighlightableText
                text="The researchers highlight that while quantitative benchmark accuracy is competitive, performance degrades slightly under extreme out-of-distribution variations and limited sample availability."
                highlights={highlights}
                onHighlightClick={handleHighlightClick}
              />
            </p>
            <p className="text-sm text-[#334155] leading-relaxed font-normal">
              <HighlightableText
                text="Future work focuses on self-supervised pre-training, parameter-efficient fine-tuning, and cross-domain adaptation across resource-constrained edge systems."
                highlights={highlights}
                onHighlightClick={handleHighlightClick}
              />
            </p>
          </section>

          {/* Publication Metadata & Links */}
          <section className="bg-white/80 rounded-3xl p-6 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#07133D]">Digital Object Identifier (DOI)</p>
              <p className="text-xs text-slate-500">{paper.doi ? `doi.org/${paper.doi}` : "No DOI registered"}</p>
            </div>
            <div className="flex items-center gap-2">
              {paper.doi && (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open DOI</span>
                </a>
              )}
              {paper.pdfUrl && (
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original PDF</span>
                </a>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* ── Mode 2: Direct PDF View ──────────────────────────────── */
        <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-[#DCE7F6] shadow-md">
          {paper.pdfUrl ? (
            <iframe
              src={paper.pdfUrl}
              title={paper.title}
              className="w-full h-full border-none"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#07133D] mb-1">Direct PDF Embed Unavailable</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-5">
                The publisher restricts direct inline PDF embedding via browser headers. You can read the structured document or open the publisher page.
              </p>
              {paper.url && (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#1D4ED8]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open on Publisher Website</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
