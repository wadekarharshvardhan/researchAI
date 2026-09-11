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
import AnalyticsPage from "@/components/dashboard/AnalyticsPage";
import AnalyticsRightbar from "@/components/dashboard/AnalyticsRightbar";
import SettingsPage from "@/components/dashboard/SettingsPage";
import SettingsRightbar from "@/components/dashboard/SettingsRightbar";
import PricingPage from "@/components/pricing/PricingPage";
import AboutPage from "@/components/about/AboutPage";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { addRecentSearch } from "@/lib/recent-searches";

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
 *  "analytics" — AnalyticsPage (Your Research Analytics with stat cards and insights)
 *  "settings"  — SettingsPage (Profile, preferences, sources, and quick actions)
 *  "pricing"   — PricingPage (Research Without Limits pricing plans)
 *  "about"     — AboutPage (Our mission, values, and journey)
 */
export type View =
  | "home"
  | "research"
  | "explore"
  | "library"
  | "analytics"
  | "settings"
  | "pricing"
  | "about";

export default function Dashboard({
  onSignOut,
  initialQuery = "",
  initialView = "home",
}: DashboardProps) {
  const [view, setView] = useState<View>(initialView);
  const [activeTab, setActiveTab] = useState(
    initialView === "about"
      ? "about"
      : initialView === "pricing"
      ? "pricing"
      : initialView === "settings"
      ? "settings"
      : initialView === "analytics"
      ? "analytics"
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
    if (query && query.trim()) {
      addRecentSearch(query.trim());
    }
    setSearchQuery(query);
    setView("research");
    setActiveTab("home");
    setMobileSidebarOpen(false);
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
    } else if (tab === "analytics") {
      setView("analytics");
    } else if (tab === "settings") {
      setView("settings");
    } else if (tab === "pricing") {
      setView("pricing");
    } else if (tab === "about") {
      setView("about");
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
    } else if (targetView === "pricing") {
      setView("pricing");
      setActiveTab("pricing");
    } else if (targetView === "about") {
      setView("about");
      setActiveTab("about");
    } else if (targetView === "home") {
      setView("home");
      setActiveTab("home");
    } else if (targetView === "settings" || targetView === "profile") {
      setView("settings");
      setActiveTab("settings");
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

  const isFullWidth = view === "pricing" || view === "about";

  return (
    <div className="h-screen max-h-screen bg-[#EEF4FD] flex flex-col overflow-hidden text-[#07133D]">
      {/* ── Top Navbar ────────────────────────────────────────── */}
      <DashboardNavbar
        onSignOut={onSignOut}
        onToggleSidebar={handleToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        activeView={view}
        onNavigate={handleNavbarNavigate}
      />

      {/* ── 3-Column Workspace Layout (Flush to screen edges, no empty space on left) ── */}
      <div className="flex-1 w-full flex overflow-hidden min-h-0">
        {/* Left Navigation Sidebar (Visible from md / tablet and desktop; hidden on full-width views like pricing and about) */}
        {!isFullWidth && (
          <DashboardSidebar
            className="hidden md:flex shrink-0 h-full"
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onNewResearch={handleNewResearch}
            onSelectQuery={handleSelectQuery}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
          />
        )}

        {/* Center Workspace — Dedicated scrollable flex container */}
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
          {view === "about" ? (
            <AboutPage
              key="about-page"
              onStartResearch={handleNewResearch}
              onExploreTopics={() => {
                setView("explore");
                setActiveTab("explore");
              }}
            />
          ) : view === "pricing" ? (
            <PricingPage
              key="pricing-page"
              onGetStarted={handleNewResearch}
              onContactSales={() => {}}
            />
          ) : view === "settings" ? (
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
          ) : view === "library" ? (
            <LibraryPage
              key="library-page"
              onStartResearch={handleNewResearch}
              onSelectTopic={(topic) => {
                handleSelectQuery(topic);
              }}
            />
          ) : view === "explore" ? (
            <ExplorePage
              key="explore-page"
              onSearch={(q) => {
                handleSelectQuery(q);
              }}
              onSelectTopic={(topic) => {
                handleSelectQuery(topic);
              }}
            />
          ) : view === "research" ? (
            <ResearchPage
              key={`research-page-${searchQuery}`}
              searchQuery={searchQuery}
              onBack={() => {
                setView("home");
                setActiveTab("home");
              }}
              onStartNewResearch={handleNewResearch}
              onExampleSearch={(query) => {
                handleSelectQuery(query);
              }}
            />
          ) : (
            <DashboardCenter
              key={`home-${searchQuery}`}
              initialQuery={searchQuery}
              onSearch={(q) => {
                handleSelectQuery(q);
              }}
            />
          )}
        </AnimatePresence>
        </div>

        {/* Right Sidebar (Desktop) — switches content based on view (hidden on full-width views like pricing and about) */}
        {!isFullWidth && (
          <div className="hidden xl:flex shrink-0 h-full">
            <AnimatePresence mode="wait">
              {view === "settings" ? (
                <SettingsRightbar key="settings-rightbar" />
              ) : view === "analytics" ? (
                <AnalyticsRightbar key="analytics-rightbar" />
              ) : view === "library" ? (
                <LibraryRightbar key="library-rightbar" />
              ) : view === "explore" ? (
                <ExploreRightbar
                  key="explore-rightbar"
                  onSelectTopic={(topic) => {
                    handleSelectQuery(topic);
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
        )}
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
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
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
                  onSelectQuery={handleSelectQuery}
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
