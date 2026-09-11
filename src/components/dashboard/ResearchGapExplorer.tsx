"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Lightbulb,
  Sparkles,
  Target,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResearchGap } from "@/types/research-paper";

interface ResearchGapExplorerProps {
  gaps: ResearchGap[];
  query?: string;
  onSelectPaper?: (paperId: string) => void;
}

export default function ResearchGapExplorer({
  gaps,
  query,
  onSelectPaper,
}: ResearchGapExplorerProps) {
  const [expandedGapId, setExpandedGapId] = useState<string | null>(
    gaps.length > 0 ? gaps[0].gapId : null
  );

  if (!gaps || gaps.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#205DF8] flex items-center justify-center mx-auto mb-3">
          <Lightbulb className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#07133D]">
          No Research Gaps Identified
        </h3>
        <p className="text-xs text-[#6B7FA2] max-w-sm mx-auto mt-1">
          Perform a paper discovery search to extract cross-paper patterns, repeated limitations, and underexplored methodologies.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-1 border-b border-[#DCE7F6]">
        <div>
          <h2 className="text-sm font-extrabold text-[#07133D] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#205DF8]" />
            Research Gap Explorer
          </h2>
          <p className="text-[11px] text-[#6B7FA2] mt-0.5">
            System-derived candidate research gaps synthesized from cross-paper limitations and underrepresented evaluation dimensions.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEF3FF] text-[#205DF8] border border-[#DCE7F6]">
          {gaps.length} Potential Gaps
        </span>
      </div>

      {/* Gap Cards */}
      <div className="space-y-3.5">
        {gaps.map((gap, idx) => {
          const isExpanded = expandedGapId === gap.gapId;

          // Evidence badge color
          const strengthColor =
            gap.evidenceStrength === "High"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : gap.evidenceStrength === "Medium"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-slate-50 text-slate-700 border-slate-200";

          return (
            <motion.div
              key={gap.gapId || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/95 rounded-2xl border border-[#DCE7F6] shadow-[0_2px_12px_rgba(20,40,90,0.03)] hover:border-[#B9D2F8] transition-all overflow-hidden"
            >
              {/* Card Header Top */}
              <div
                onClick={() => setExpandedGapId(isExpanded ? null : gap.gapId)}
                className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#205DF8] bg-[#EEF3FF] px-2 py-0.5 rounded-md border border-[#DCE7F6]">
                      POTENTIAL RESEARCH GAP
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${strengthColor}`}
                    >
                      Evidence: {gap.evidenceStrength}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Gap Confidence: {gap.confidence}%
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#07133D] hover:text-[#205DF8] transition-colors leading-snug">
                    {gap.title}
                  </h3>

                  <p className="text-xs text-[#556987] mt-1.5 leading-relaxed line-clamp-2">
                    {gap.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                  aria-label={isExpanded ? "Collapse gap" : "Expand gap"}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Collapsible Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#E8F0FA] bg-[#F9FBFE] p-4 sm:p-5 space-y-4 text-xs text-[#334155]"
                  >
                    {/* Why It Matters */}
                    <div>
                      <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-[#07133D] flex items-center gap-1.5 mb-1">
                        <Target className="w-3.5 h-3.5 text-[#205DF8]" />
                        Why It Matters
                      </h4>
                      <p className="leading-relaxed text-[#475467] bg-white p-3 rounded-xl border border-[#DCE7F6]">
                        {gap.whyItMatters}
                      </p>
                    </div>

                    {/* Potential Research Direction */}
                    <div>
                      <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-[#07133D] flex items-center gap-1.5 mb-1">
                        <Compass className="w-3.5 h-3.5 text-[#205DF8]" />
                        Potential Research Direction
                      </h4>
                      <p className="leading-relaxed text-[#07133D] font-medium bg-[#EEF3FF] p-3 rounded-xl border border-[#B9D2F8]">
                        {gap.potentialResearchDirection}
                      </p>
                    </div>

                    {/* Related Methods & Datasets */}
                    <div className="flex flex-wrap gap-4 pt-1">
                      {gap.relatedMethods.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-[#8DA0BC] uppercase tracking-wider block mb-1">
                            Related Methods
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {gap.relatedMethods.map((m) => (
                              <span
                                key={m}
                                className="px-2 py-0.5 rounded-md bg-white border border-[#DCE7F6] text-[11px] font-semibold text-[#334155]"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {gap.relatedDatasets.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-[#8DA0BC] uppercase tracking-wider block mb-1">
                            Associated Datasets
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {gap.relatedDatasets.map((d) => (
                              <span
                                key={d}
                                className="px-2 py-0.5 rounded-md bg-white border border-[#DCE7F6] text-[11px] font-semibold text-[#334155]"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Supporting Evidence Drawer */}
                    <div>
                      <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-[#07133D] flex items-center gap-1.5 mb-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#205DF8]" />
                        Supporting Evidence ({gap.supportingEvidence.length} papers cited)
                      </h4>
                      <div className="space-y-2">
                        {gap.supportingEvidence.map((ev, evIdx) => (
                          <div
                            key={evIdx}
                            className="bg-white p-3 rounded-xl border border-[#DCE7F6] space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-[#07133D] text-[11px] truncate">
                                {ev.paperTitle || `Paper ID: ${ev.paperId}`}
                              </span>
                              {ev.section && (
                                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {ev.section}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#556987] italic">
                              &ldquo;{ev.evidence}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
