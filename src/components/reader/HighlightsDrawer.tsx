"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Sparkles, Copy, Printer, Bookmark } from "lucide-react";
import {
  HIGHLIGHT_COLORS,
  PaperHighlight,
  HighlightColor,
} from "@/lib/paper-reader-store";

interface HighlightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  highlights: PaperHighlight[];
  onRemoveHighlight: (id: string) => void;
  onSendToCopilot: (text: string) => void;
  onPrintExport: () => void;
  paperTitle: string;
}

export default function HighlightsDrawer({
  isOpen,
  onClose,
  highlights,
  onRemoveHighlight,
  onSendToCopilot,
  onPrintExport,
  paperTitle,
}: HighlightsDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10 select-none"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#07133D]">Saved Highlights</h3>
                  <p className="text-[11px] text-slate-500">
                    {highlights.length} highlighted points in this paper
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Highlights List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
              {highlights.length > 0 ? (
                highlights.map((hl) => {
                  const conf = HIGHLIGHT_COLORS[hl.color || "yellow"];
                  return (
                    <div
                      key={hl.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full border shrink-0 mt-1"
                          style={{ backgroundColor: conf.bg, borderColor: conf.border }}
                        />
                        <p className="text-xs text-[#07133D] font-medium leading-relaxed flex-1 select-text">
                          &ldquo;{hl.text}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400 font-medium">{conf.label}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onSendToCopilot(hl.text);
                              onClose();
                            }}
                            className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Ask AI</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveHighlight(hl.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Delete highlight"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#07133D]">No highlights yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Select any text in the paper on the left to highlight key points and save them here.
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {highlights.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {highlights.length} total saved
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPrintExport();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export Highlights</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
