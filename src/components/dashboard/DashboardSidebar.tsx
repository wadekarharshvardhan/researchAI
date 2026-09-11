"use client";

import Image from "next/image";
import {
  Plus,
  Search,
  Library,
  BarChart3,
  Settings,
  GraduationCap,
  Clock,
  ChevronRight,
  FlaskConical,
  Dna,
  Cpu,
  CloudSun,
  Wheat,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRecentSearches, formatRelativeTime } from "@/lib/recent-searches";

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNewResearch?: () => void;
  onSelectQuery?: (query: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileDrawer?: boolean;
  className?: string;
}

/* ── Data ────────────────────────────────────────────────────────────── */
const navItems = [
  { id: "home", label: "Home", icon: Search, tip: "Search & research workspace" },
  { id: "explore", label: "Explore", icon: Compass, tip: "Discover new research horizons" },
  { id: "library", label: "Library", icon: Library, tip: "Your research collection" },
  { id: "analytics", label: "Analytics", icon: BarChart3, tip: "Research metrics" },
  { id: "settings", label: "Settings", icon: Settings, tip: "Preferences & account" },
];

const recentCategoryIcons = [Cpu, FlaskConical, CloudSun, Dna, Wheat, Compass];

const trendingTags = ["Machine Learning", "Genomics", "Climate AI", "NLP", "Robotics"];

/* ── Helpers ─────────────────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const staggerList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.08 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.36, ease } },
};

/* ── Text + section fade helper ─────────────────────────────────────── */
function FadeText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={`overflow-hidden whitespace-nowrap ${className}`}
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.22, ease }}
    >
      {children}
    </motion.span>
  );
}

export default function DashboardSidebar({
  activeTab = "research",
  onTabChange,
  onNewResearch,
  onSelectQuery,
  collapsed: propCollapsed = false,
  isMobileDrawer = false,
  className = "",
}: DashboardSidebarProps) {
  const collapsed = isMobileDrawer ? false : propCollapsed;
  const { recentSearches, clearRecentSearches } = useRecentSearches();

  return (
    <motion.aside
      className={`shrink-0 flex flex-col bg-white/80 backdrop-blur-2xl border-r border-[#E2EBF6]/90 select-none overflow-y-auto overflow-x-hidden ${
        isMobileDrawer
          ? "w-full h-full p-4"
          : "h-full"
      } ${className}`}
      style={{ scrollbarWidth: "none" }}
      aria-label="Sidebar navigation"
      animate={{
        width: isMobileDrawer ? "100%" : collapsed ? 72 : 260,
        opacity: 1,
        x: 0,
      }}
      initial={false}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <div className={`flex flex-col h-full ${isMobileDrawer ? "py-4 px-2" : "py-5 px-3"}`}>

        {/* ── TOP: CTA + Nav ───────────────────────────────────── */}
        <motion.div
          className="space-y-3.5 flex-none"
          variants={staggerList}
          initial="hidden"
          animate="visible"
        >
          {/* + New Research */}
          <motion.div variants={slideLeft}>
            <motion.button
              type="button"
              onClick={onNewResearch}
              title="New Research"
              className={`relative overflow-hidden text-white text-sm font-semibold flex items-center cursor-pointer transition-all duration-200 ${
                collapsed
                  ? "w-11 h-11 mx-auto rounded-xl justify-center"
                  : "w-full py-2.5 px-4 rounded-2xl justify-center gap-2.5"
              }`}
              style={{
                background: "linear-gradient(130deg, #4F8EF7 0%, #2563EB 45%, #1D4ED8 100%)",
                boxShadow: "0 4px 18px rgba(37,99,235,0.38), 0 1px 3px rgba(37,99,235,0.15)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 7px 26px rgba(37,99,235,0.45), 0 2px 6px rgba(37,99,235,0.2)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              {/* Shimmer */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
              <motion.span
                className="relative z-10 shrink-0"
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 340, damping: 18 }}
              >
                <Plus className="w-4 h-4" strokeWidth={2.7} />
              </motion.span>
              <AnimatePresence>
                {!collapsed && (
                  <FadeText className="relative z-10 tracking-tight">
                    New Research
                  </FadeText>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Nav links */}
          <nav aria-label="Dashboard navigation" className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === "home" && (activeTab === "research" || activeTab === "home"));

              return (
                <motion.div
                  key={item.id}
                  variants={slideLeft}
                  className="relative"
                >
                  {/* Active pill */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, #EEF2FF 0%, #E0E9FF 100%)",
                        boxShadow: "inset 0 0 0 1px rgba(99,125,255,0.12)",
                      }}
                      transition={{ type: "spring", damping: 28, stiffness: 320 }}
                    />
                  )}

                  <motion.button
                    type="button"
                    onClick={() => onTabChange?.(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`relative w-full flex items-center rounded-xl text-sm cursor-pointer z-10 group transition-colors duration-150 ${
                      collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "font-semibold text-[#1D4ED8]"
                        : "font-medium text-[#6678A0] hover:text-[#07133D]"
                    }`}
                    whileHover={!isActive ? { x: collapsed ? 0 : 4 } : {}}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* Icon box */}
                    <motion.span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors duration-150 ${
                        isActive
                          ? "bg-blue-100/80 text-[#1D4ED8]"
                          : "text-[#8DA0BC] group-hover:bg-slate-100/80 group-hover:text-[#3B4F70]"
                      }`}
                      animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                      whileHover={!isActive ? { scale: 1.1 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon
                        className="w-[17px] h-[17px]"
                        strokeWidth={isActive ? 2.4 : 1.9}
                      />
                    </motion.span>

                    <AnimatePresence>
                      {!collapsed && (
                        <FadeText className="leading-none truncate flex-1">
                          {item.label}
                        </FadeText>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {!collapsed && isActive && (
                        <motion.span
                          className="ml-auto shrink-0"
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[#6080D0]" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              );
            })}
          </nav>

          {/* ── Divider ─────────────────────────────────────────── */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="mx-1"
                style={{
                  height: 1,
                  background: "linear-gradient(to right, transparent, rgba(174,196,232,0.5), transparent)",
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.25 }}
              />
            )}
          </AnimatePresence>

          {/* ── Recent Research ──────────────────────────────────── */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease }}
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10.5px] font-bold tracking-wider uppercase text-[#8DA0BC]">
                    Recent
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => clearRecentSearches()}
                      className="text-[10.5px] font-semibold text-[#5B7FCC] hover:text-[#DC2626] cursor-pointer transition-colors"
                      title="Clear recent searches"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {recentSearches.length === 0 ? (
                  <div className="px-2.5 py-3 rounded-xl bg-slate-50/60 border border-dashed border-slate-200/80 text-center">
                    <p className="text-[11px] font-medium text-[#7E93B0] leading-tight">
                      No recent searches yet
                    </p>
                    <p className="text-[10px] text-[#A0B4D0] mt-1 leading-snug">
                      Searches you perform will appear here in real time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {recentSearches.slice(0, 6).map((item, idx) => {
                      const Icon = recentCategoryIcons[idx % recentCategoryIcons.length];
                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectQuery?.(item.query)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left group cursor-pointer hover:bg-white/70 transition-colors duration-150"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + idx * 0.03, duration: 0.25, ease }}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          title={item.query}
                        >
                          <span className="w-6 h-6 rounded-lg bg-blue-50/90 border border-blue-100/60 flex items-center justify-center text-[#6B9AE8] shrink-0 group-hover:bg-blue-100/80 group-hover:text-[#2563EB] transition-colors duration-150">
                            <Icon className="w-3 h-3" strokeWidth={2} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[11px] font-medium text-[#3D5275] group-hover:text-[#07133D] truncate leading-tight transition-colors">
                              {item.query}
                            </span>
                          </span>
                          <span className="text-[9.5px] text-[#9FB3CE] shrink-0 font-medium flex items-center gap-0.5 tabular-nums">
                            <Clock className="w-2.5 h-2.5" />
                            {formatRelativeTime(item.timestamp)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Trending Topics ──────────────────────────────────── */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease }}
              >
                <div className="px-1">
                  <span className="text-[10.5px] font-bold tracking-wider uppercase text-[#8DA0BC]">
                    Trending
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {trendingTags.map((tag, i) => (
                    <motion.button
                      key={tag}
                      type="button"
                      onClick={() => onSelectQuery?.(tag)}
                      className="px-2.5 py-1 rounded-full text-[10.5px] font-medium text-[#4E6FA0] bg-white/80 border border-[#D4E2F4]/80 hover:bg-[#EEF3FF] hover:text-[#1D4ED8] hover:border-[#B8CEFB] transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.08 + i * 0.04, duration: 0.28, ease }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── BOTTOM: Promo card + Footer ───────────────────────── */}
        <motion.div
          className="mt-auto pt-5 space-y-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.48, ease }}
        >
          {/* Collapsed: just graduation cap icon */}
          {collapsed ? (
            <div className="flex justify-center">
              <motion.div
                className="w-10 h-10 rounded-xl bg-blue-50/90 border border-blue-100/60 flex items-center justify-center text-[#2563EB] shadow-xs cursor-default"
                title="Turn Curiosity Into Contribution"
                whileHover={{ rotate: -8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
              >
                <GraduationCap className="w-4.5 h-4.5" strokeWidth={2.1} />
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="relative rounded-2xl p-4 overflow-hidden cursor-default"
              style={{
                background: "linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(228,240,255,0.85) 100%)",
                border: "1px solid rgba(200,220,248,0.5)",
                boxShadow: "0 4px 22px rgba(32,93,248,0.07), 0 1px 3px rgba(0,0,0,0.03)",
              }}
              whileHover={{
                y: -2,
                boxShadow: "0 10px 30px rgba(32,93,248,0.12), 0 2px 6px rgba(0,0,0,0.05)",
              }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Mountain backdrop */}
              <div className="absolute inset-0 opacity-[0.16] pointer-events-none">
                <Image
                  src="/images/hero-bg.webp"
                  alt=""
                  fill
                  className="object-cover object-bottom"
                  unoptimized
                  aria-hidden="true"
                />
              </div>
              <div
                className="absolute inset-x-0 bottom-0 h-14 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(228,240,255,0.75))" }}
              />
              <div className="relative z-10">
                <motion.div
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/60 flex items-center justify-center text-[#2563EB] mb-3 shadow-xs"
                  whileHover={{ rotate: -8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                >
                  <GraduationCap className="w-4 h-4" strokeWidth={2.1} />
                </motion.div>
                <h4 className="text-[13px] font-bold text-[#07133D] leading-snug mb-1.5">
                  Turn Curiosity<br />Into Contribution.
                </h4>
                <p className="text-[11.5px] text-[#5B6F8D] leading-relaxed">
                  ResearchAI helps you discover, understand and advance human knowledge.
                </p>
              </div>
            </motion.div>
          )}

          {/* Footer (hidden when collapsed) */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="px-1 pb-1 text-[10.5px] leading-tight space-y-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <p className="font-semibold text-[#4C6282]">© 2025 ResearchAI</p>
                <p className="text-[#8FA5C0]">Knowledge for a brighter tomorrow.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
}
