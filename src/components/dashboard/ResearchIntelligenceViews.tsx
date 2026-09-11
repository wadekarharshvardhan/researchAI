"use client";

import { useState } from "react";
import {
  TrendingUp,
  Layers,
  Database,
  BookOpen,
  Quote,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  Agent3Output,
  LiteratureReview,
  PaperAnalysis,
} from "@/types/research-paper";

/* ── Trends View ──────────────────────────────────────────────────────── */
export function ResearchTrendsView({ intelligence }: { intelligence: Agent3Output }) {
  if (!intelligence?.trends || intelligence.trends.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[#6B7FA2]">
        No trend data synthesized yet. Perform a search to generate cross-paper trends.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-[#DCE7F6]">
        <h2 className="text-sm font-extrabold text-[#07133D] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#205DF8]" />
          Cross-Paper Research Trends
        </h2>
        <p className="text-[11px] text-[#6B7FA2] mt-0.5">
          Identified evolutionary shifts in methodologies, benchmark datasets, and deployment considerations.
        </p>
      </div>

      <div className="space-y-3">
        {intelligence.trends.map((trend, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/95 border border-[#DCE7F6] shadow-2xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EEF3FF] text-[#205DF8] border border-[#DCE7F6]">
                {trend.category} Trend
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Confidence: {trend.confidence}%
              </span>
            </div>
            <p className="text-[#07133D] font-medium leading-relaxed">
              {trend.trendDescription}
            </p>
            <p className="text-[11px] text-[#556987] italic bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
              <strong>Evidence:</strong> {trend.evidence}
            </p>
          </div>
        ))}
      </div>

      {/* Agreements & Contradictions Section */}
      {intelligence.agreements.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold text-[#07133D] flex items-center gap-1.5 uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Consensus & Agreements
          </h3>
          <div className="space-y-2">
            {intelligence.agreements.map((ag, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-[#14532D] space-y-1"
              >
                <p className="font-semibold">{ag.claim}</p>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  Supported by {ag.supportingPaperIds.length} publications · Confidence: {ag.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {intelligence.contradictions.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold text-[#07133D] flex items-center gap-1.5 uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Contradictions & Architectural Divergence
          </h3>
          <div className="space-y-2">
            {intelligence.contradictions.map((ct, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#78350F] space-y-1.5"
              >
                <p className="font-bold">{ct.topic}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200/80">
                    <span className="font-bold block text-slate-800">Finding A:</span>
                    {ct.findingA}
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200/80">
                    <span className="font-bold block text-slate-800">Finding B:</span>
                    {ct.findingB}
                  </div>
                </div>
                <p className="text-[10.5px] text-amber-800 italic">
                  <strong>Attributable Factors:</strong> {ct.possibleReasons.join("; ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Methods View ─────────────────────────────────────────────────────── */
export function MethodsComparisonView({ intelligence }: { intelligence: Agent3Output }) {
  if (!intelligence?.methodComparisons || intelligence.methodComparisons.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[#6B7FA2]">
        No method comparison data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-[#DCE7F6]">
        <h2 className="text-sm font-extrabold text-[#07133D] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#205DF8]" />
          Methodology & Architecture Comparison
        </h2>
        <p className="text-[11px] text-[#6B7FA2] mt-0.5">
          Comparative breakdown of algorithmic strategies, reported metrics, and trade-offs.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#DCE7F6] bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse min-w-[540px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#DCE7F6] text-[#07133D] font-bold text-[11px] uppercase tracking-wider">
              <th className="p-3">Method / Backbone</th>
              <th className="p-3">Associated Datasets</th>
              <th className="p-3">Reported Metrics</th>
              <th className="p-3">Key Advantage</th>
              <th className="p-3">Stated Limitation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[#334155]">
            {intelligence.methodComparisons.map((m, i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-3 font-bold text-[#07133D] align-top whitespace-nowrap">
                  {m.methodName}
                </td>
                <td className="p-3 align-top">
                  {m.datasets.length > 0 ? m.datasets.join(", ") : "Domain benchmarks"}
                </td>
                <td className="p-3 align-top font-mono text-[11px] text-[#2563EB]">
                  {m.metrics.length > 0 ? m.metrics.slice(0, 2).join(" · ") : "Reported in text"}
                </td>
                <td className="p-3 align-top text-[11px] text-emerald-800">
                  {m.reportedAdvantages[0] || m.reportedResults.slice(0, 80) || "High empirical benchmark performance"}
                </td>
                <td className="p-3 align-top text-[11px] text-amber-800">
                  {m.reportedLimitations[0] || "Hardware & illumination sensitivity"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Datasets View ────────────────────────────────────────────────────── */
export function DatasetsAnalysisView({ intelligence }: { intelligence: Agent3Output }) {
  if (!intelligence?.datasetAnalyses || intelligence.datasetAnalyses.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[#6B7FA2]">
        No dataset intelligence available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-[#DCE7F6]">
        <h2 className="text-sm font-extrabold text-[#07133D] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#205DF8]" />
          Dataset & Benchmark Landscape
        </h2>
        <p className="text-[11px] text-[#6B7FA2] mt-0.5">
          Frequency distribution, environmental type (controlled vs real-world), and dataset boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {intelligence.datasetAnalyses.map((d, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white border border-[#DCE7F6] shadow-2xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-[#07133D]">{d.datasetName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#205DF8] border border-blue-200">
                {d.datasetType.replace("_", " ")}
              </span>
            </div>
            <p className="text-[11px] text-[#556987]">
              Utilized in <strong>{d.frequency}</strong> analyzed publications.
            </p>
            {d.limitations.length > 0 && (
              <p className="text-[10.5px] text-amber-800 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                <strong>Boundary:</strong> {d.limitations[0]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Literature Review / Overview View ────────────────────────────────── */
export function LiteratureReviewView({ review }: { review: LiteratureReview }) {
  if (!review) {
    return (
      <div className="py-12 text-center text-xs text-[#6B7FA2]">
        Synthesis in progress...
      </div>
    );
  }

  return (
    <div className="space-y-5 text-xs text-[#334155] leading-relaxed select-text">
      {/* Executive Summary */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/80 border border-[#B9D2F8] space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#205DF8] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Executive Synthesis
        </h2>
        <p className="text-[#07133D] font-medium leading-relaxed text-xs sm:text-sm">
          {review.executiveSummary}
        </p>
      </div>

      {/* Literature Overview */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-extrabold text-[#07133D] uppercase tracking-wide">
          Literature Overview
        </h3>
        <p className="bg-white p-3.5 rounded-2xl border border-[#DCE7F6]">
          {review.literatureOverview}
        </p>
      </div>

      {/* Results Comparison */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-extrabold text-[#07133D] uppercase tracking-wide">
          Empirical Results & Benchmark Comparison
        </h3>
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE7F6] whitespace-pre-line">
          {review.resultsComparison}
        </div>
      </div>

      {/* Common Limitations */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-extrabold text-[#07133D] uppercase tracking-wide">
          Shared Literature Limitations
        </h3>
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE7F6] whitespace-pre-line text-amber-900 bg-amber-50/30">
          {review.commonLimitations}
        </div>
      </div>

      {/* Conclusion */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-extrabold text-[#07133D] uppercase tracking-wide">
          Synthesis Conclusion
        </h3>
        <p className="bg-white p-3.5 rounded-2xl border border-[#DCE7F6]">
          {review.conclusion}
        </p>
      </div>

      {/* References */}
      {review.references.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#DCE7F6]">
          <h3 className="text-xs font-extrabold text-[#07133D] uppercase tracking-wide">
            Bibliographic References ({review.references.length})
          </h3>
          <div className="space-y-1.5">
            {review.references.map((ref, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[11px] text-[#475569] flex items-start gap-2"
              >
                <span className="font-bold text-[#07133D] shrink-0">[{idx + 1}]</span>
                <div className="flex-1">
                  <span className="font-semibold text-[#07133D]">{ref.authors.join(", ")}</span> ({ref.year || "n.d."}). &ldquo;{ref.title}&rdquo;. <span className="italic">{ref.venue || "Academic Publication"}</span>. {ref.doi && <span className="text-[#205DF8] font-mono ml-1">doi:{ref.doi}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Citations View ───────────────────────────────────────────────────── */
export function CitationsView({ review }: { review: LiteratureReview }) {
  if (!review?.references || review.references.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[#6B7FA2]">
        No bibliographic citations compiled yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-[#DCE7F6]">
        <h2 className="text-sm font-extrabold text-[#07133D] flex items-center gap-2">
          <Quote className="w-4 h-4 text-[#205DF8]" />
          Citations & Claim Traceability
        </h2>
        <p className="text-[11px] text-[#6B7FA2] mt-0.5">
          Direct mappings between synthesized claims and source paper publications.
        </p>
      </div>

      {/* Claim traceability map */}
      <div className="space-y-2">
        {review.claims.map((cl, i) => (
          <div
            key={i}
            className="p-3.5 rounded-2xl bg-white border border-[#DCE7F6] text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#205DF8] bg-[#EEF3FF] px-2 py-0.5 rounded-md">
                {cl.section}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                {cl.supportingPaperIds.length} source{cl.supportingPaperIds.length > 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-[#07133D] font-medium leading-relaxed">
              &ldquo;{cl.claim}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
