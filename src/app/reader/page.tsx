"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowLeft, AlertCircle, Bot, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ResearchPaper } from "@/types/research-paper";
import {
  getActiveReaderPaper,
  HighlightColor,
  usePaperHighlights,
} from "@/lib/paper-reader-store";
import ReaderToolbar from "@/components/reader/ReaderToolbar";
import DocumentViewer from "@/components/reader/DocumentViewer";
import AICopilotPanel from "@/components/reader/AICopilotPanel";
import HighlightsDrawer from "@/components/reader/HighlightsDrawer";

function ReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paperId = searchParams.get("id");

  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<"structured" | "pdf">("structured");
  const [activeColor, setActiveColor] = useState<HighlightColor>("yellow");
  const [highlightsDrawerOpen, setHighlightsDrawerOpen] = useState(false);
  const [copilotMode, setCopilotMode] = useState<"docked" | "floating" | "hidden">("docked");
  const [copilotMinimized, setCopilotMinimized] = useState(false);
  const [mobileCopilotOpen, setMobileCopilotOpen] = useState(false);
  const [activeHighlightForCopilot, setActiveHighlightForCopilot] = useState<{
    text: string;
    autoSubmit?: boolean;
  } | null>(null);

  // Load paper data
  useEffect(() => {
    let active = true;

    async function loadPaper() {
      setLoading(true);
      const cached = getActiveReaderPaper(paperId);
      if (cached) {
        if (active) {
          setPaper(cached);
          if (cached.pdfUrl) {
            // Default to structured for highlighting, but direct pdf is available
            setActiveMode("structured");
          }
          setLoading(false);
        }
        return;
      }

      // If not cached, fetch fallback details if id present
      if (paperId) {
        try {
          const res = await fetch("/api/test/openalex", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: paperId, limit: 1 }),
          });
          const data = await res.json();
          if (active && data.papers && data.papers.length > 0) {
            setPaper(data.papers[0]);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Failed to load paper by ID:", err);
        }
      }

      if (active) {
        setLoading(false);
      }
    }

    loadPaper();

    return () => {
      active = false;
    };
  }, [paperId]);

  const { highlights, addHighlight, removeHighlight } = usePaperHighlights(paper?.id || "");

  const handlePrintExport = () => {
    window.print();
  };

  const handleToggleCopilot = () => {
    // If on mobile screen (< 768px), toggle the mobile copilot sheet
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileCopilotOpen((prev) => !prev);
      return;
    }

    if (copilotMode === "docked") {
      setCopilotMode("floating");
      setCopilotMinimized(false);
    } else if (copilotMode === "floating") {
      setCopilotMode("docked");
      setCopilotMinimized(false);
    } else {
      setCopilotMode("docked");
      setCopilotMinimized(false);
    }
  };

  const handleSendToCopilot = (text: string, autoSubmit: boolean = false) => {
    // On mobile, automatically pop open the mobile copilot sheet
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileCopilotOpen(true);
    }
    if (copilotMode === "hidden") {
      setCopilotMode("floating");
    }
    setCopilotMinimized(false);
    setActiveHighlightForCopilot({ text, autoSubmit });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#EEF4FD]">
        <Loader2 className="w-9 h-9 text-[#2563EB] animate-spin mb-3" />
        <p className="text-sm font-bold text-[#07133D]">Loading Paper Workspace...</p>
        <p className="text-xs text-slate-500 mt-1">Priming ResearchAI Reader & AI Copilot</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-[#EEF4FD] text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#07133D] mb-1">Paper Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-5">
          We could not load the requested research document. It may have expired from your active session.
        </p>
        <button
          type="button"
          onClick={() => router.push("/library")}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#1D4ED8]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Library</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#F0F6FE]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #F0F6FE 0%, #EEF4FD 30%, #F7FAFE 60%, #EBF3FD 100%)",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[300px] bg-sky-200/25 rounded-full blur-[90px]" />
      </div>

      {/* Blue Themed Reader Toolbar */}
      <ReaderToolbar
        paper={paper}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        activeColor={activeColor}
        onColorChange={setActiveColor}
        highlights={highlights}
        onToggleHighlightsDrawer={() => setHighlightsDrawerOpen(!highlightsDrawerOpen)}
        onPrintExport={handlePrintExport}
        copilotMode={copilotMode}
        isMobileCopilotOpen={mobileCopilotOpen}
        onToggleCopilot={handleToggleCopilot}
      />

      {/* Main Workspace (Full-width for paper on mobile and when copilot is floating/hidden) */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Document Viewer with Highlighting & PDF Embed (Takes 100% width on mobile and when floating) */}
        <section className="flex-1 w-full h-full min-w-0 flex flex-col overflow-hidden transition-all duration-300" aria-label="Paper document content">
          <DocumentViewer
            paper={paper}
            activeMode={activeMode}
            highlights={highlights}
            onAddHighlight={addHighlight}
            onSendToCopilot={handleSendToCopilot}
            activeColor={activeColor}
          />
        </section>

        {/* Right Side: AI Research Copilot when Docked (Desktop Only - md:flex!) */}
        {copilotMode === "docked" && (
          <aside className="hidden md:flex md:w-[380px] lg:w-[430px] shrink-0 h-full flex-col overflow-hidden shadow-sm" aria-label="AI Research Copilot">
            <AICopilotPanel
              paper={paper}
              activeHighlightContext={activeHighlightForCopilot}
              onClearHighlightContext={() => setActiveHighlightForCopilot(null)}
              isFloating={false}
              onToggleDock={() => setCopilotMode("floating")}
            />
          </aside>
        )}
      </main>

      {/* ── Mobile Slide-Up AI Copilot Sheet (Full Paper Context + Easy Dismiss) ── */}
      <AnimatePresence>
        {mobileCopilotOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileCopilotOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            />
            {/* Slide-Up Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="relative z-10 w-full h-[88vh] max-h-[92vh] bg-white rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.24)] border-t border-blue-200 flex flex-col overflow-hidden"
            >
              {/* Mobile Header Bar */}
              <div className="px-4 py-2.5 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between shrink-0">
                <div className="w-12 h-1 rounded-full bg-slate-300 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                <button
                  type="button"
                  onClick={() => setMobileCopilotOpen(false)}
                  className="mt-1 text-xs font-bold text-[#2563EB] flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Paper</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileCopilotOpen(false)}
                  className="mt-1 p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Close Copilot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Copilot Body */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <AICopilotPanel
                  paper={paper}
                  activeHighlightContext={activeHighlightForCopilot}
                  onClearHighlightContext={() => setActiveHighlightForCopilot(null)}
                  isFloating={false}
                  onClose={() => setMobileCopilotOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Floating Action Button (Ask AI) ── */}
      {!mobileCopilotOpen && (
        <motion.button
          key="mobile-copilot-fab"
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileCopilotOpen(true)}
          className="fixed bottom-5 right-4 z-40 md:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)] border border-blue-400/40 cursor-pointer"
          title="Ask AI Copilot"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-tight">Ask AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.button>
      )}

      {/* ── Floating Dockable Copilot Window (Full PDF visibility on Desktop) ── */}
      <AnimatePresence>
        {copilotMode === "floating" && (
          <>
            {copilotMinimized ? (
              /* Minimized Floating Pill Button (Desktop) */
              <motion.button
                key="copilot-minimized-pill"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCopilotMinimized(false)}
                className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_12px_36px_rgba(37,99,235,0.4)] border border-blue-400/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer group"
                title="Expand AI Copilot"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold tracking-tight">ResearchAI Copilot</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </motion.button>
            ) : (
              /* Draggable Full Floating Window (Desktop) */
              <motion.div
                key="copilot-floating-window"
                drag
                dragMomentum={false}
                dragElastic={0.04}
                dragConstraints={{ left: -700, right: 20, top: -550, bottom: 20 }}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-5 right-5 z-50 w-[420px] max-w-[calc(100vw-28px)] h-[620px] max-h-[calc(100vh-96px)] rounded-3xl shadow-[0_24px_70px_rgba(15,35,90,0.28),0_4px_20px_rgba(0,0,0,0.08)] border border-[#C5DCFF] bg-white overflow-hidden hidden md:flex flex-col"
              >
                <AICopilotPanel
                  paper={paper}
                  activeHighlightContext={activeHighlightForCopilot}
                  onClearHighlightContext={() => setActiveHighlightForCopilot(null)}
                  isFloating={true}
                  onToggleDock={() => setCopilotMode("docked")}
                  onMinimize={() => setCopilotMinimized(true)}
                  onClose={() => setCopilotMode("hidden")}
                />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* ── Floating Launcher when Copilot is Hidden (Desktop) ── */}
      <AnimatePresence>
        {copilotMode === "hidden" && (
          <motion.button
            key="copilot-hidden-trigger"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            onClick={() => {
              setCopilotMode("floating");
              setCopilotMinimized(false);
            }}
            className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_12px_36px_rgba(37,99,235,0.38)] border border-blue-400/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Open AI Copilot"
          >
            <Bot className="w-4 h-4" />
            <span className="text-xs font-bold">Ask AI Copilot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Highlights & Notes Slide-Over Drawer */}
      <HighlightsDrawer
        isOpen={highlightsDrawerOpen}
        onClose={() => setHighlightsDrawerOpen(false)}
        highlights={highlights}
        onRemoveHighlight={removeHighlight}
        onSendToCopilot={handleSendToCopilot}
        onPrintExport={handlePrintExport}
        paperTitle={paper.title}
      />
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-[#EEF4FD]">
          <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        </div>
      }
    >
      <ReaderContent />
    </Suspense>
  );
}
