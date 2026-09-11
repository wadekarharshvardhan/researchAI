"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Highlighter,
  FileText,
  Eye,
  Bookmark,
  Printer,
  ChevronDown,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ResearchPaper } from "@/types/research-paper";
import {
  HighlightColor,
  HIGHLIGHT_COLORS,
  PaperHighlight,
} from "@/lib/paper-reader-store";

interface ReaderToolbarProps {
  paper: ResearchPaper;
  activeMode: "structured" | "pdf";
  onModeChange: (mode: "structured" | "pdf") => void;
  activeColor: HighlightColor;
  onColorChange: (color: HighlightColor) => void;
  highlights: PaperHighlight[];
  onToggleHighlightsDrawer: () => void;
  onPrintExport: () => void;
  onBack?: () => void;
}

export default function ReaderToolbar({
  paper,
  activeMode,
  onModeChange,
  activeColor,
  onColorChange,
  highlights,
  onToggleHighlightsDrawer,
  onPrintExport,
  onBack,
}: ReaderToolbarProps) {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setDownloadMenuOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadOriginalPdf = () => {
    setDownloadMenuOpen(false);
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, "_blank");
    } else if (paper.url) {
      window.open(paper.url, "_blank");
    } else {
      window.print();
    }
  };

  const handleExportAnnotated = () => {
    setDownloadMenuOpen(false);
    onPrintExport();
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/85 backdrop-blur-xl border-b border-[#D8E6F8] flex items-center justify-between gap-3 select-none z-30 shrink-0 sticky top-0">
      {/* Left: Back button + Logo + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
            } else if (window.history.length > 1) {
              window.history.back();
            } else {
              window.close();
            }
          }}
          className="p-2 rounded-xl text-[#556987] hover:text-[#07133D] hover:bg-blue-50/80 transition-colors cursor-pointer shrink-0"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="w-4.5 h-4.5" strokeWidth={2.4} />
        </button>

        <Link href="/" className="shrink-0 flex items-center mr-1 hidden sm:flex">
          <Image
            src="/images/logoblue.png"
            alt="ResearchAI"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>

        <div className="h-5 w-px bg-slate-200 hidden sm:block shrink-0" />

        <div className="min-w-0 flex-1">
          <h1
            className="text-xs sm:text-sm font-bold text-[#07133D] truncate"
            title={paper.title}
          >
            {paper.title}
          </h1>
          <p className="text-[11px] text-[#6B7FA2] truncate hidden md:block">
            {paper.authors?.slice(0, 3).join(", ") || "Unknown authors"} • {paper.year || 2024} • {paper.venue || "Academic Publication"}
          </p>
        </div>
      </div>

      {/* Middle: Mode Switcher (Structured Reader vs Direct PDF) */}
      <div className="flex items-center bg-[#F1F6FE] border border-[#D5E3FF] rounded-xl p-0.5 shrink-0">
        <button
          type="button"
          onClick={() => onModeChange("structured")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeMode === "structured"
              ? "bg-white text-[#205DF8] shadow-xs"
              : "text-[#556987] hover:text-[#07133D]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Interactive Reader</span>
          <span className="sm:hidden">Reader</span>
        </button>

        {paper.pdfUrl && (
          <button
            type="button"
            onClick={() => onModeChange("pdf")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "pdf"
                ? "bg-white text-[#205DF8] shadow-xs"
                : "text-[#556987] hover:text-[#07133D]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Direct PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        )}
      </div>

      {/* Right: Highlighter Tool + Highlights Drawer + Download Menu */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Highlighter Color Picker Dropdown */}
        <div className="relative" ref={colorRef}>
          <button
            type="button"
            onClick={() => setColorMenuOpen(!colorMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#D5E3FF] bg-white hover:bg-blue-50/50 text-[#07133D] text-xs font-medium cursor-pointer shadow-2xs transition-colors"
            title="Highlighter Color"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border shadow-2xs shrink-0"
              style={{
                backgroundColor: HIGHLIGHT_COLORS[activeColor].bg,
                borderColor: HIGHLIGHT_COLORS[activeColor].border,
              }}
            />
            <Highlighter className="w-3.5 h-3.5 text-[#205DF8]" />
            <ChevronDown className="w-3 h-3 text-[#6B7FA2]" />
          </button>

          <AnimatePresence>
            {colorMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40"
              >
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Highlight Color
                </div>
                {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((colorKey) => {
                  const conf = HIGHLIGHT_COLORS[colorKey];
                  const isSelected = activeColor === colorKey;
                  return (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => {
                        onColorChange(colorKey);
                        setColorMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? "font-bold text-[#205DF8]" : "text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border shrink-0"
                          style={{ backgroundColor: conf.bg, borderColor: conf.border }}
                        />
                        <span>{conf.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#205DF8]" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Highlights Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleHighlightsDrawer}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
            highlights.length > 0
              ? "bg-[#EEF4FE] text-[#205DF8] border-blue-200"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
          title="View saved highlights and notes"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Highlights</span>
          {highlights.length > 0 && (
            <span className="w-4.5 h-4.5 rounded-full bg-[#205DF8] text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
              {highlights.length}
            </span>
          )}
        </button>

        {/* Download & Export Menu Button */}
        <div className="relative" ref={downloadRef}>
          <motion.button
            type="button"
            onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
            className="px-3.5 py-1.5 rounded-xl text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_2px_10px_rgba(37,99,235,0.32)] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2.4} />
            <span className="hidden sm:inline">Download</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </motion.button>

          <AnimatePresence>
            {downloadMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-40 text-xs text-slate-700"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Download Options
                </div>

                <button
                  type="button"
                  onClick={handleDownloadOriginalPdf}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-blue-50 hover:text-[#2563EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800">Original PDF Document</div>
                    <div className="text-[10px] text-slate-400">High-resolution publisher PDF</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportAnnotated}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-blue-50 hover:text-[#2563EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800">Export with Highlights</div>
                    <div className="text-[10px] text-slate-400">Print or save annotated PDF</div>
                  </div>
                </button>

                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDownloadMenuOpen(false)}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">Publisher Landing Page</div>
                      <div className="text-[10px] text-slate-400">View on official website</div>
                    </div>
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
