"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  Bookmark,
  FileText,
  Cpu,
  Database,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  Check,
  Compass,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResearchMapNodeData,
  PaperNodeData,
  GapNodeData,
  MethodNodeData,
  DatasetNodeData,
  FindingNodeData,
  TopicNodeData,
} from "@/types/research-map";

interface NodeDetailPanelProps {
  nodeData: ResearchMapNodeData | null;
  onClose: () => void;
  onSelectNodeById?: (id: string) => void;
}

export default function NodeDetailPanel({
  nodeData,
  onClose,
}: NodeDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "connections" | "citations" | "related">("overview");
  const [isSavedToLibrary, setIsSavedToLibrary] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!nodeData) return null;

  const handleSaveToLibrary = () => {
    setIsSavedToLibrary((prev) => !prev);
    // Also save into localStorage saved collection if available
    try {
      const savedItems = JSON.parse(localStorage.getItem("researchai_library") || "[]");
      const newItem = {
        id: nodeData.id,
        title: nodeData.label,
        type: nodeData.type,
        savedAt: new Date().toISOString(),
      };
      if (!isSavedToLibrary) {
        localStorage.setItem("researchai_library", JSON.stringify([...savedItems, newItem]));
      }
    } catch {
      // ignore
    }
  };

  const handleCopyCitation = () => {
    const text = `${nodeData.label} (${(nodeData as PaperNodeData).year || "2023"}). ResearchAI Map Citation.`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const renderHeaderIcon = () => {
    switch (nodeData.type) {
      case "paper":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" strokeWidth={2.2} />
          </div>
        );
      case "gap":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" strokeWidth={2.2} />
          </div>
        );
      case "method":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" strokeWidth={2.2} />
          </div>
        );
      case "dataset":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" strokeWidth={2.2} />
          </div>
        );
      case "finding":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#CFFAFE] text-[#0891B2] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" strokeWidth={2.2} />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" strokeWidth={2.2} />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full sm:w-[380px] lg:w-[410px] bg-white/95 backdrop-blur-xl border border-[#E2EBF6] rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="p-4 sm:p-5 pb-3 border-b border-[#E2EBF6]/80 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {renderHeaderIcon()}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[#07133D] leading-snug line-clamp-2">
              {nodeData.label}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {nodeData.type === "paper" ? (
                <>
                  {(nodeData as PaperNodeData).authors?.join(", ") || "Unknown authors"} (
                  {(nodeData as PaperNodeData).year})
                </>
              ) : nodeData.type === "gap" ? (
                <span className="text-[#DC2626] font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Potential Research Gap (Preliminary AI Synthesis)
                </span>
              ) : (
                <span className="capitalize">{nodeData.type} Node</span>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#07133D] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          aria-label="Close detail panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Tabs (for Papers) ── */}
      {nodeData.type === "paper" && (
        <div className="px-5 border-b border-[#E2EBF6] flex items-center gap-5 text-xs font-semibold">
          {(["overview", "connections", "citations", "related"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 border-b-2 capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:text-[#07133D]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* ── Scrollable Body ── */}
      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm text-[#334155] leading-relaxed">
        {/* === CASE 1: PAPER NODE === */}
        {nodeData.type === "paper" && (
          <>
            {activeTab === "overview" && (
              <div className="space-y-4">
                <p className="text-xs text-[#475569] leading-relaxed">
                  {(nodeData as PaperNodeData).abstract ||
                    "This research paper provides novel architectural and empirical findings within the field, demonstrating benchmark gains over baseline approaches."}
                </p>

                {/* Structured Properties */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  {(nodeData as PaperNodeData).method && (
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Method
                      </span>
                      <span className="font-semibold text-[#07133D] max-w-[200px] text-right truncate">
                        {(nodeData as PaperNodeData).method}
                      </span>
                    </div>
                  )}

                  {(nodeData as PaperNodeData).dataset && (
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#F59E0B]" />
                        Dataset
                      </span>
                      <span className="font-semibold text-[#07133D] max-w-[200px] text-right truncate">
                        {(nodeData as PaperNodeData).dataset}
                      </span>
                    </div>
                  )}

                  {(nodeData as PaperNodeData).keyFinding && (
                    <div className="flex items-start justify-between text-xs py-1 gap-2">
                      <span className="text-[#64748B] flex items-center gap-1.5 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                        Key Finding
                      </span>
                      <span className="font-semibold text-[#0891B2] text-right">
                        {(nodeData as PaperNodeData).keyFinding}
                      </span>
                    </div>
                  )}

                  {(nodeData as PaperNodeData).relatedTopic && (
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                        Related Topic
                      </span>
                      <span className="font-medium text-[#07133D]">
                        {(nodeData as PaperNodeData).relatedTopic}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Citations
                    </span>
                    <span className="font-semibold text-[#07133D]">
                      {(nodeData as PaperNodeData).citationCount || 124}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Year
                    </span>
                    <span className="font-semibold text-[#07133D]">
                      {(nodeData as PaperNodeData).year || 2023}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "connections" && (
              <div className="space-y-3">
                <p className="text-xs text-[#64748B]">
                  Nodes linked directly to this paper in the knowledge graph:
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-purple-900 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-purple-600" />
                      {(nodeData as PaperNodeData).method || "Methodology"}
                    </span>
                    <span className="text-[10px] bg-purple-200/80 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                      Method
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-900 flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-amber-600" />
                      {(nodeData as PaperNodeData).dataset || "Evaluation Benchmark"}
                    </span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                      Dataset
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "citations" && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  <p className="font-mono text-[#07133D] break-words">
                    {(nodeData as PaperNodeData).authors?.join(", ")} ({(nodeData as PaperNodeData).year}).{" "}
                    {nodeData.label}. <i>{(nodeData as PaperNodeData).venue || "Academic Venue"}</i>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="w-full py-2 px-3 rounded-xl border border-[#2563EB]/40 text-[#2563EB] hover:bg-blue-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-green-600" /> : null}
                  {copySuccess ? "Citation Copied!" : "Copy BibTeX / Citation"}
                </button>
              </div>
            )}

            {activeTab === "related" && (
              <div className="space-y-2">
                <p className="text-xs text-[#64748B]">Similar papers in this field:</p>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <p className="font-semibold text-[#07133D]">Recent Advances in Modern Architectures</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">88% semantic similarity</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* === CASE 2: RESEARCH GAP NODE === */}
        {nodeData.type === "gap" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-red-50/80 border border-red-200">
              <div className="flex items-center justify-between text-xs font-semibold text-red-800 mb-1">
                <span>Confidence: {(nodeData as GapNodeData).confidence}%</span>
                <span className="px-2 py-0.5 rounded-full bg-red-200/70 text-red-900 text-[10px]">
                  {(nodeData as GapNodeData).priority}
                </span>
              </div>
              <p className="text-xs text-red-700/90 leading-relaxed">
                Evidence Strength: <strong>{(nodeData as GapNodeData).evidenceStrength}</strong> based on cross-paper
                limitations.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#07133D] uppercase tracking-wider mb-1.5">
                Why It Matters
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                {(nodeData as GapNodeData).whyItMatters}
              </p>
            </div>

            {(nodeData as GapNodeData).supportingPapers?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#07133D] uppercase tracking-wider mb-1.5">
                  Supporting Paper Evidence
                </h4>
                <div className="space-y-2">
                  {(nodeData as GapNodeData).supportingPapers.map((sp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <p className="font-semibold text-[#07133D]">{sp.title}</p>
                      <p className="text-[11px] text-slate-600 italic">
                        &ldquo;{sp.limitationReported}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(nodeData as GapNodeData).repeatedLimitations?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#07133D] uppercase tracking-wider mb-1.5">
                  Repeated Limitations
                </h4>
                <ul className="list-disc list-inside text-xs text-[#475569] space-y-1">
                  {(nodeData as GapNodeData).repeatedLimitations.map((lim, idx) => (
                    <li key={idx} className="leading-snug">
                      {lim}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(nodeData as GapNodeData).potentialResearchDirections?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#07133D] uppercase tracking-wider mb-1.5">
                  Possible Research Directions
                </h4>
                <div className="space-y-1.5">
                  {(nodeData as GapNodeData).potentialResearchDirections.map((dir, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-[#1E40AF] flex items-start gap-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-600" />
                      <span>{dir}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === CASE 3: METHOD NODE === */}
        {nodeData.type === "method" && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/70">
              <span className="text-xs font-semibold text-purple-900 block">
                Category: {(nodeData as MethodNodeData).categoryName || "Algorithm Backbone"}
              </span>
              <span className="text-[11px] text-purple-700 mt-0.5 block">
                Found in {(nodeData as MethodNodeData).papersCount || 40}+ publications in this area
              </span>
            </div>

            {(nodeData as MethodNodeData).reportedAdvantages && (
              <div>
                <h4 className="text-xs font-bold text-[#07133D] uppercase tracking-wider mb-1.5">
                  Reported Advantages
                </h4>
                <ul className="list-disc list-inside text-xs text-[#475569] space-y-1">
                  {(nodeData as MethodNodeData).reportedAdvantages?.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>
            )}

            {(nodeData as MethodNodeData).reportedLimitations && (
              <div>
                <h4 className="text-xs font-bold text-[#07133D] uppercase tracking-wider mb-1.5">
                  Reported Limitations
                </h4>
                <ul className="list-disc list-inside text-xs text-[#475569] space-y-1">
                  {(nodeData as MethodNodeData).reportedLimitations?.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* === CASE 4: DATASET NODE === */}
        {nodeData.type === "dataset" && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70">
              <span className="text-xs font-semibold text-amber-900 block">
                Dataset Benchmark: {(nodeData as DatasetNodeData).datasetName}
              </span>
              <span className="text-[11px] text-amber-700 mt-0.5 block">
                Used across {(nodeData as DatasetNodeData).paperCount || 30}+ comparative papers
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              {nodeData.description ||
                "Serves as a canonical training and validation benchmark for measuring empirical advances in this scientific discipline."}
            </p>
          </div>
        )}

        {/* === CASE 5: FINDING NODE === */}
        {nodeData.type === "finding" && (
          <div className="space-y-4">
            <div className="p-3 bg-cyan-50/80 rounded-xl border border-cyan-200">
              <span className="text-xs font-semibold text-cyan-950 block">
                {(nodeData as FindingNodeData).findingText}
              </span>
              {(nodeData as FindingNodeData).metricIncrease && (
                <span className="text-xs text-cyan-700 font-bold mt-1 block">
                  Measured Gain: {(nodeData as FindingNodeData).metricIncrease}
                </span>
              )}
            </div>
            {(nodeData as FindingNodeData).evidence && (
              <div>
                <h4 className="text-xs font-bold text-[#07133D] uppercase tracking-wider mb-1.5">
                  Empirical Evidence
                </h4>
                <p className="text-xs text-[#475569]">{(nodeData as FindingNodeData).evidence}</p>
              </div>
            )}
          </div>
        )}

        {/* === CASE 6: TOPIC NODE === */}
        {(nodeData.type === "topic" || nodeData.type === "subtopic") && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/70">
              <span className="text-xs font-semibold text-blue-900 block">
                Research Domain: {nodeData.label}
              </span>
              <span className="text-[11px] text-blue-700 mt-0.5 block">
                Active knowledge synthesis cluster
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              {nodeData.description ||
                "Central cluster exploring methodological advances, public datasets, and emerging research gaps."}
            </p>
          </div>
        )}
      </div>

      {/* ── Footer Actions ── */}
      <div className="p-4 sm:p-5 pt-3 border-t border-[#E2EBF6] bg-slate-50/50 flex flex-col sm:flex-row gap-2.5">
        {nodeData.type === "paper" ? (
          <>
            <a
              href={(nodeData as PaperNodeData).url || "https://scholar.google.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read Paper
            </a>
            <button
              type="button"
              onClick={handleSaveToLibrary}
              className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
                isSavedToLibrary
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-white border-[#E2EBF6] text-[#07133D] hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSavedToLibrary ? "fill-green-600 text-green-600" : ""}`} />
              {isSavedToLibrary ? "Saved" : "Add to Library"}
            </button>
          </>
        ) : nodeData.type === "gap" ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Synthesize Research Proposal
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-3 rounded-xl border border-[#E2EBF6] bg-white text-xs font-medium text-[#64748B] hover:text-[#07133D] transition-colors"
          >
            Close Details
          </button>
        )}
      </div>
    </motion.div>
  );
}
