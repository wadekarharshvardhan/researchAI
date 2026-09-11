"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResearchPaper } from "@/types/research-paper";

export type PaperReadingStatus = "unread" | "read" | "has_notes";

export interface SavedPaper extends ResearchPaper {
  savedAt: number;
  status: PaperReadingStatus;
  notes?: string;
}

const STORAGE_KEY = "researchai_library_papers";
const EVENT_NAME = "researchai:library-updated";

/**
 * Retrieve all saved papers from localStorage.
 */
export function getSavedPapers(): SavedPaper[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse saved papers from localStorage:", err);
    return [];
  }
}

/**
 * Check if a paper is currently saved in the library.
 */
export function isPaperSaved(paperId: string): boolean {
  if (!paperId) return false;
  const papers = getSavedPapers();
  return papers.some((p) => p.id === paperId);
}

/**
 * Save a paper to the library.
 */
export function savePaper(
  paper: ResearchPaper,
  status: PaperReadingStatus = "unread"
): SavedPaper {
  const existing = getSavedPapers();
  const index = existing.findIndex((p) => p.id === paper.id);

  const savedItem: SavedPaper = {
    ...paper,
    savedAt: index >= 0 ? existing[index].savedAt : Date.now(),
    status: index >= 0 ? existing[index].status : status,
    notes: index >= 0 ? existing[index].notes : undefined,
  };

  let updated: SavedPaper[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = savedItem;
  } else {
    updated = [savedItem, ...existing];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { paperId: paper.id, saved: true } }));
  } catch (err) {
    console.error("Failed to save paper:", err);
  }

  return savedItem;
}

/**
 * Remove a paper from the library.
 */
export function removePaper(paperId: string): void {
  const existing = getSavedPapers();
  const updated = existing.filter((p) => p.id !== paperId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { paperId, saved: false } }));
  } catch (err) {
    console.error("Failed to remove paper:", err);
  }
}

/**
 * Toggle paper saved status. Returns true if paper is now saved, false if removed.
 */
export function toggleSavePaper(paper: ResearchPaper): boolean {
  if (isPaperSaved(paper.id)) {
    removePaper(paper.id);
    return false;
  } else {
    savePaper(paper);
    return true;
  }
}

/**
 * Update reading status of a saved paper.
 */
export function updatePaperStatus(paperId: string, status: PaperReadingStatus): void {
  const existing = getSavedPapers();
  const index = existing.findIndex((p) => p.id === paperId);
  if (index === -1) return;

  const updated = [...existing];
  updated[index] = { ...updated[index], status };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { paperId, status } }));
  } catch (err) {
    console.error("Failed to update paper status:", err);
  }
}

/**
 * Update notes on a saved paper.
 */
export function updatePaperNotes(paperId: string, notes: string): void {
  const existing = getSavedPapers();
  const index = existing.findIndex((p) => p.id === paperId);
  if (index === -1) return;

  const updated = [...existing];
  updated[index] = {
    ...updated[index],
    notes,
    status: notes.trim().length > 0 ? "has_notes" : updated[index].status,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { paperId, notes } }));
  } catch (err) {
    console.error("Failed to update paper notes:", err);
  }
}

/**
 * Format relative time string matching the visual reference (e.g. "Saved 2 hours ago").
 */
export function formatSavedTime(timestamp: number): string {
  if (!timestamp) return "Saved recently";
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) return "Saved just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin === 1) return "Saved 1 min ago";
  if (diffMin < 60) return `Saved ${diffMin} mins ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return "Saved 1 hour ago";
  if (diffHours < 24) return `Saved ${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Saved 1 day ago";
  if (diffDays < 7) return `Saved ${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "Saved 1 week ago";
  if (diffWeeks < 4) return `Saved ${diffWeeks} weeks ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "Saved 1 month ago";
  return `Saved ${diffMonths} months ago`;
}

/**
 * Hook for consuming saved library papers reactively.
 */
export function useLibraryPapers() {
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setSavedPapers(getSavedPapers());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoaded(true);

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const isSaved = useCallback(
    (id: string) => savedPapers.some((p) => p.id === id),
    [savedPapers]
  );

  const toggle = useCallback((paper: ResearchPaper) => {
    return toggleSavePaper(paper);
  }, []);

  const remove = useCallback((id: string) => {
    removePaper(id);
  }, []);

  const setStatus = useCallback((id: string, status: PaperReadingStatus) => {
    updatePaperStatus(id, status);
  }, []);

  return {
    savedPapers,
    isLoaded,
    isSaved,
    toggleSave: toggle,
    removePaper: remove,
    updateStatus: setStatus,
    refresh,
  };
}
