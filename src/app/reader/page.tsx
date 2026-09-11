"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
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

  const handleSendToCopilot = (text: string, autoSubmit: boolean = false) => {
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
      />

      {/* Main Split-Screen Workspace */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Side: Document Viewer with Highlighting & PDF Embed */}
        <section className="flex-1 h-full min-w-0 flex flex-col overflow-hidden" aria-label="Paper document content">
          <DocumentViewer
            paper={paper}
            activeMode={activeMode}
            highlights={highlights}
            onAddHighlight={addHighlight}
            onSendToCopilot={handleSendToCopilot}
            activeColor={activeColor}
          />
        </section>

        {/* Right Side: AI Research Copilot with Dynamic Suggestions */}
        <aside className="w-full md:w-[380px] lg:w-[430px] shrink-0 h-full flex flex-col overflow-hidden shadow-sm" aria-label="AI Research Copilot">
          <AICopilotPanel
            paper={paper}
            activeHighlightContext={activeHighlightForCopilot}
            onClearHighlightContext={() => setActiveHighlightForCopilot(null)}
          />
        </aside>
      </main>

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
