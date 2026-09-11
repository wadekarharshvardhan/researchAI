"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardCenter from "@/components/dashboard/DashboardCenter";
import DashboardRightbar from "@/components/dashboard/DashboardRightbar";
import ResearchPage from "@/components/dashboard/ResearchPage";
import ResearchRightbar from "@/components/dashboard/ResearchRightbar";
import ExplorePage from "@/components/dashboard/ExplorePage";
import ExploreRightbar from "@/components/dashboard/ExploreRightbar";
import LibraryPage from "@/components/dashboard/LibraryPage";
import LibraryRightbar from "@/components/dashboard/LibraryRightbar";
import SavedPapersPage from "@/components/dashboard/SavedPapersPage";
import SavedPapersRightbar from "@/components/dashboard/SavedPapersRightbar";
import AnalyticsPage from "@/components/dashboard/AnalyticsPage";
import AnalyticsRightbar from "@/components/dashboard/AnalyticsRightbar";
import SettingsPage from "@/components/dashboard/SettingsPage";
import SettingsRightbar from "@/components/dashboard/SettingsRightbar";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface DashboardProps {
  onSignOut?: () => void;
  initialQuery?: string;
  initialView?: View;
}

/**
 * view:
 *  "home"      — DashboardCenter (the search homepage shown right after sign-in)
 *  "research"  — ResearchPage (Research Intelligence view with tabs + empty state)
 *  "explore"   — ExplorePage (Discover New Research Horizons with cards & collections)
 *  "library"   — LibraryPage (Your Research Library with projects, notes, and gaps)
 *  "saved"     — SavedPapersPage (Your Saved Papers with unread, read, and notes)
 *  "analytics" — AnalyticsPage (Your Research Analytics with stat cards and insights)
 *  "settings"  — SettingsPage (Profile, preferences, sources, and quick actions)
 */
export type View = "home" | "research" | "explore" | "library" | "saved" | "analytics" | "settings";

export default function Dashboard({
  onSignOut,
  initialQuery = "",
  initialView = "settings",
}: DashboardProps) {
  const [view, setView] = useState<View>(initialView);
  const [activeTab, setActiveTab] = useState(
    initialView === "settings"
      ? "settings"
      : initialView === "analytics"
      ? "analytics"
      : initialView === "saved"
      ? "saved"
      : initialView === "library"
      ? "library"
      : initialView === "explore"
      ? "explore"
      : "home"
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSelectQuery = (query: string) => {
    setSearchQuery(query);
    setView("research");
    setActiveTab("home");
  };

  const handleNewResearch = () => {
    setSearchQuery("");
    setView("home");
    setActiveTab("home");
    setMobileSidebarOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "research" || tab === "home") {
      setView("home");
    } else if (tab === "explore") {
      setView("explore");
    } else if (tab === "library") {
      setView("library");
    } else if (tab === "saved") {
      setView("saved");
    } else if (tab === "analytics") {
      setView("analytics");
    } else if (tab === "settings") {
      setView("settings");
    } else {
      setView("home");
    }
    setMobileSidebarOpen(false);
  };

  const handleNavbarNavigate = (targetView: string) => {
    if (targetView === "explore") {
      setView("explore");
      setActiveTab("explore");
    } else if (targetView === "library") {
      setView("library");
      setActiveTab("library");
    } else if (targetView === "home") {
      setView("home");
      setActiveTab("home");
    } else {
      setView("home");
      setActiveTab(targetView);
    }
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileSidebarOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF4FD] flex flex-col overflow-x-hidden text-[#07133D]">
      {/* ── Top Navbar ────────────────────────────────────────── */}
      <DashboardNavbar
        onSignOut={onSignOut}
        onToggleSidebar={handleToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        activeView={view}
        onNavigate={handleNavbarNavigate}
      />

      {/* ── 3-Column Workspace Layout (Flush to screen edges, no empty space on left) ── */}
      <div className="flex-1 w-full flex overflow-hidden">
        {/* Left Navigation Sidebar (Visible from md / tablet and desktop) */}
        <DashboardSidebar
          className="hidden md:flex"
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewResearch={handleNewResearch}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Center — switches between Home, Research, Explore, Library, Saved, Analytics, and Settings views */}
        <AnimatePresence mode="wait">
          {view === "settings" ? (
            <SettingsPage key="settings-page" />
          ) : view === "analytics" ? (
            <AnalyticsPage
              key="analytics-page"
              onStartResearch={handleNewResearch}
              onExploreTopics={() => {
                setView("explore");
                setActiveTab("explore");
              }}
              onGoToLibrary={() => {
                setView("library");
                setActiveTab("library");
              }}
            />
          ) : view === "saved" ? (
            <SavedPapersPage
              key="saved-page"
              onStartResearch={handleNewResearch}
              onExploreTopics={() => {
                setView("explore");
                setActiveTab("explore");
              }}
              onGoToLibrary={() => {
                setView("library");
                setActiveTab("library");
              }}
            />
          ) : view === "library" ? (
            <LibraryPage
              key="library-page"
              onStartResearch={handleNewResearch}
              onSelectTopic={(topic) => {
                setSearchQuery(topic);
                setView("research");
                setActiveTab("home");
              }}
            />
          ) : view === "explore" ? (
            <ExplorePage
              key="explore-page"
              onSearch={(q) => {
                setSearchQuery(q);
                setView("research");
                setActiveTab("home");
              }}
              onSelectTopic={(topic) => {
                setSearchQuery(topic);
                setView("research");
                setActiveTab("home");
              }}
            />
          ) : view === "research" ? (
            <ResearchPage
              key="research-page"
              onBack={() => {
                setView("home");
                setActiveTab("home");
              }}
              onStartNewResearch={handleNewResearch}
              onExampleSearch={(query) => {
                setSearchQuery(query);
                setView("home");
              }}
            />
          ) : (
            <DashboardCenter
              key={`home-${searchQuery}`}
              initialQuery={searchQuery}
              onSearch={(q) => {
                setSearchQuery(q);
                // After a search from home, navigate to research results
                setView("research");
                setActiveTab("home");
              }}
            />
          )}
        </AnimatePresence>

        {/* Right Sidebar (Desktop) — switches content based on view */}
        <div className="hidden xl:block">
          <AnimatePresence mode="wait">
            {view === "settings" ? (
              <SettingsRightbar key="settings-rightbar" />
            ) : view === "analytics" ? (
              <AnalyticsRightbar key="analytics-rightbar" />
            ) : view === "saved" ? (
              <SavedPapersRightbar key="saved-rightbar" />
            ) : view === "library" ? (
              <LibraryRightbar key="library-rightbar" />
            ) : view === "explore" ? (
              <ExploreRightbar
                key="explore-rightbar"
                onSelectTopic={(topic) => {
                  setSearchQuery(topic);
                  setView("research");
                  setActiveTab("home");
                }}
              />
            ) : view === "research" ? (
              <ResearchRightbar key="research-rightbar" />
            ) : (
              <DashboardRightbar
                key="home-rightbar"
                onSelectQuery={handleSelectQuery}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ─────────────────────────────── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <span className="font-bold text-sm text-[#07133D]">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <DashboardSidebar
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  onNewResearch={handleNewResearch}
                  isMobileDrawer
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
