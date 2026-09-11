"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Sliders,
  Database,
  FileText,
  Palette,
  Bell,
  Camera,
  Check,
  ChevronDown,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

type SettingsTab =
  | "profile"
  | "preferences"
  | "sources"
  | "citations"
  | "appearance"
  | "notifications";

const menuItems: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Research Preferences", icon: Sliders },
  { id: "sources", label: "Sources & Databases", icon: Database },
  { id: "citations", label: "Citation & Export", icon: FileText },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const academicRoles = [
  "Student",
  "PhD Candidate",
  "Postdoc Researcher",
  "Professor / Faculty",
  "Independent Researcher",
  "Industry R&D Professional",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form State
  const [fullName, setFullName] = useState("Harshvardhan Wadekar");
  const [email, setEmail] = useState("harshvardhan@example.com");
  const [academicRole, setAcademicRole] = useState("Student");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preference State
  const [searchDepth, setSearchDepth] = useState("comprehensive");
  const [synthesisLength, setSynthesisLength] = useState("detailed");

  // Sources State
  const [sources, setSources] = useState({
    openalex: true,
    semanticscholar: true,
    arxiv: true,
    pubmed: true,
    ieeexplore: false,
    crossref: true,
  });

  // Citations State
  const [citationFormat, setCitationFormat] = useState("apa");

  // Appearance State
  const [themeMode, setThemeMode] = useState("light");

  // Notifications State
  const [notifs, setNotifs] = useState({
    researchUpdates: true,
    weeklyDigest: true,
    recommendations: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-10 max-w-[1280px] w-full mx-auto select-none"
      aria-label="Settings Dashboard"
    >
      {/* ── Page Header with Doodle ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 relative">
        <div>
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#556987] uppercase block mb-1">
            Settings
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#07133D] tracking-tight">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-[#556987] mt-1.5 max-w-2xl">
            Customize your ResearchAI experience and manage your preferences.
          </p>
        </div>

        {/* Caveat Handwritten Doodle & Cogs */}
        <div className="hidden lg:flex flex-col items-center relative -top-3 right-4 pointer-events-none">
          <div className="flex items-center gap-2 text-[#2563EB] font-['Caveat',cursive] text-lg font-bold rotate-[-5deg] leading-tight">
            <div>
              <span>Personalize.</span>
              <br />
              <span className="text-[#1D4ED8]">Research better.</span>
            </div>
            {/* Cute Cogs / Gear SVG doodle */}
            <div className="flex items-center gap-1 text-[#60A5FA] ml-1">
              <svg className="w-6 h-6 animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
              <svg className="w-4 h-4 text-[#93C5FD] -ml-2 -mt-3 animate-[spin_9s_linear_infinite_reverse]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
            </div>
          </div>
          {/* Curved Arrow pointing down-left */}
          <svg
            className="w-8 h-8 text-[#2563EB] mt-0.5 -rotate-12"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 8 C 24 14, 28 24, 20 32" />
            <path d="M14 28 L 20 32 L 24 26" />
          </svg>
        </div>
      </div>

      {/* ── 2-Column Settings Layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Subnav Tabs */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? "bg-[#EEF4FD] text-[#2563EB] shadow-2xs font-bold"
                    : "text-[#556987] hover:bg-white/80 hover:text-[#07133D]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2563EB]" : "text-[#64748B]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Profile Information Card */}
                <div className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs">
                  {/* Card Header + Avatar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBF2FA]">
                    <div>
                      <h2 className="text-lg font-bold text-[#07133D]">Profile Information</h2>
                      <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
                        Manage your personal information and academic details.
                      </p>
                    </div>

                    {/* Avatar with Change Photo Button */}
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
                        H
                      </div>
                      <div className="space-y-1">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF4FD] text-[#2563EB] hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <p className="text-[10px] text-[#64748B]">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleSave} className="pt-6 space-y-5">
                    {/* Row 1: Full Name & Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-[#07133D] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F6] bg-white text-sm text-[#07133D] outline-none focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      {/* Email Address with Verified Badge */}
                      <div>
                        <label className="block text-xs font-bold text-[#07133D] mb-1.5">
                          Email Address
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-3.5 pr-24 py-2.5 rounded-xl border border-[#DCE7F6] bg-white text-sm text-[#07133D] outline-none focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                            placeholder="you@example.com"
                            required
                          />
                          <div className="absolute right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold">
                            <Check className="w-3 h-3" strokeWidth={3} />
                            <span>Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Academic Role & Institution */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Academic Role Dropdown */}
                      <div className="relative">
                        <label className="block text-xs font-bold text-[#07133D] mb-1.5">
                          Academic Role
                        </label>
                        <button
                          type="button"
                          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#DCE7F6] bg-white text-sm text-[#07133D] outline-none hover:bg-slate-50 transition-all text-left cursor-pointer"
                        >
                          <span className="font-medium">{academicRole}</span>
                          <ChevronDown className={`w-4 h-4 text-[#556987] transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {roleDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-[#DCE7F6] py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                            {academicRoles.map((role) => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => {
                                  setAcademicRole(role);
                                  setRoleDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                                  academicRole === role
                                    ? "bg-[#EEF4FD] text-[#2563EB] font-bold"
                                    : "text-[#556987] hover:bg-[#F8FAFC] hover:text-[#07133D]"
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Institution */}
                      <div>
                        <label className="block text-xs font-bold text-[#07133D] mb-1.5">
                          Institution <span className="font-normal text-[#64748B]">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F6] bg-white text-sm text-[#07133D] outline-none focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                          placeholder="e.g. IIT, Stanford, University of Mumbai"
                        />
                      </div>
                    </div>

                    {/* Row 3: Bio */}
                    <div>
                      <label className="block text-xs font-bold text-[#07133D] mb-1.5">
                        Bio <span className="font-normal text-[#64748B]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <textarea
                          rows={4}
                          maxLength={300}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F6] bg-white text-sm text-[#07133D] outline-none focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all resize-none"
                          placeholder="Tell us about yourself, your research interests, or your goals..."
                        />
                        <span className="absolute right-3 bottom-2 text-[11px] text-[#8EA3C0] font-medium">
                          {bio.length}/300
                        </span>
                      </div>
                    </div>

                    {/* Form Footer with Save Changes Button */}
                    <div className="flex items-center justify-between pt-2">
                      <AnimatePresence>
                        {savedSuccess ? (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#10B981]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Changes saved successfully!</span>
                          </motion.div>
                        ) : (
                          <div />
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs">
                  <div>
                    <h3 className="text-base font-bold text-[#07133D]">Quick Actions</h3>
                    <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
                      Manage your account and data.
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    {/* Action 1: Export My Data */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#DCE7F6] hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#EEF4FD] text-[#2563EB] flex items-center justify-center shrink-0">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#07133D]">Export My Data</h4>
                          <p className="text-xs text-[#556987] mt-0.5">
                            Download a copy of your research projects, saved papers, notes, and settings.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[#EEF4FD] hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        Export
                      </button>
                    </div>

                    {/* Action 2: Delete Account */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-red-100 hover:bg-red-50/40 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
                          <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#07133D]">Delete Account</h4>
                          <p className="text-xs text-[#556987] mt-0.5">
                            Permanently delete your account and all associated data.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[#FEF2F2] hover:bg-red-100 text-[#EF4444] text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Research Preferences Tab */}
            {activeTab === "preferences" && (
              <motion.div
                key="tab-preferences"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-[#07133D]">Research Preferences</h2>
                  <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
                    Fine-tune AI search depth, synthesis modes, and scientific focus.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#07133D] mb-2">
                      Default Search Scope
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "broad", label: "Broad Overview", desc: "Covers general survey and seminal papers" },
                        { id: "comprehensive", label: "Comprehensive (Recommended)", desc: "Balanced depth and state-of-the-art literature" },
                        { id: "deep", label: "Deep Specialized", desc: "Rigorous technical formulas, code, and methodology" },
                      ].map((scope) => (
                        <button
                          key={scope.id}
                          type="button"
                          onClick={() => setSearchDepth(scope.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            searchDepth === scope.id
                              ? "border-[#2563EB] bg-[#EEF4FD]/70 ring-1 ring-[#2563EB]"
                              : "border-[#DCE7F6] hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-xs font-bold text-[#07133D]">{scope.label}</div>
                          <div className="text-[11px] text-[#556987] mt-1">{scope.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#07133D] mb-2">
                      Synthesis Length
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "concise", label: "Executive Summary", desc: "Bullet-pointed highlights in under 2 minutes reading time" },
                        { id: "detailed", label: "Full Academic Synthesis", desc: "Deep structured narrative with citation anchors" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSynthesisLength(item.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            synthesisLength === item.id
                              ? "border-[#2563EB] bg-[#EEF4FD]/70 ring-1 ring-[#2563EB]"
                              : "border-[#DCE7F6] hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-xs font-bold text-[#07133D]">{item.label}</div>
                          <div className="text-[11px] text-[#556987] mt-1">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sources & Databases Tab */}
            {activeTab === "sources" && (
              <motion.div
                key="tab-sources"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-[#07133D]">Sources & Databases</h2>
                  <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
                    Connect and toggle academic databases scanned during research.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: "openalex", name: "OpenAlex", count: "250M+ scientific records, global coverage" },
                    { id: "semanticscholar", name: "Semantic Scholar", count: "210M+ academic publications with citation graphs" },
                    { id: "arxiv", name: "arXiv", count: "2.4M+ preprints in physics, math, computer science" },
                    { id: "pubmed", name: "PubMed / MEDLINE", count: "36M+ biomedical and life science citations" },
                    { id: "ieeexplore", name: "IEEE Xplore", count: "Engineering and technology standards" },
                    { id: "crossref", name: "CrossRef Metadata", count: "Digital object identifiers and publisher linkages" },
                  ].map((src) => {
                    const key = src.id as keyof typeof sources;
                    const isEnabled = sources[key];
                    return (
                      <div
                        key={src.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-[#DCE7F6] hover:bg-slate-50/60 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#07133D]">{src.name}</div>
                          <div className="text-[11px] text-[#556987] mt-0.5">{src.count}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSources((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            isEnabled ? "bg-[#2563EB]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                              isEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Citation & Export Tab */}
            {activeTab === "citations" && (
              <motion.div
                key="tab-citations"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-[#07133D]">Citation & Export Style</h2>
                  <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
                    Select your primary reference format for copying and exporting bibliographies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { id: "apa", name: "APA 7th Edition", example: "Author, A. (Year). Title of article. Journal Name, Vol(Issue), Pages." },
                    { id: "ieee", name: "IEEE Standard", example: "[1] A. Author, 'Title of paper,' Abbrev. Title of Periodical, vol. x, 2024." },
                    { id: "mla", name: "MLA 9th Edition", example: "Author. 'Title of Article.' Title of Periodical, vol. 28, 2024, pp. 1-10." },
                    { id: "chicago", name: "Chicago Author-Date", example: "Author, First. 2024. 'Title of Article.' Journal Name 15 (2): 45-67." },
                    { id: "bibtex", name: "BibTeX", example: "@article{author2024title, title={...}, journal={...}}" },
                  ].map((cit) => (
                    <button
                      key={cit.id}
                      type="button"
                      onClick={() => setCitationFormat(cit.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        citationFormat === cit.id
                          ? "border-[#2563EB] bg-[#EEF4FD]/70 ring-1 ring-[#2563EB]"
                          : "border-[#DCE7F6] hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#07133D]">{cit.name}</div>
                      <div className="text-[11px] font-mono text-[#556987] mt-1.5 truncate">{cit.example}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <motion.div
                key="tab-appearance"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-[#07133D]">Appearance</h2>
                  <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
                    Customize the interface visual theme and display contrast.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { id: "light", name: "Light Mode (Active)", desc: "Clean alpine blue and crisp white" },
                    { id: "dark", name: "Dark Mode", desc: "Deep navy and slate contrasts" },
                    { id: "system", name: "System Default", desc: "Sync with your OS color scheme" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setThemeMode(mode.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        themeMode === mode.id
                          ? "border-[#2563EB] bg-[#EEF4FD]/70 ring-1 ring-[#2563EB]"
                          : "border-[#DCE7F6] hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#07133D]">{mode.name}</div>
                      <div className="text-[11px] text-[#556987] mt-1">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <motion.div
                key="tab-notifications"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-[#07133D]">Notifications & Alerts</h2>
                  <p className="text-xs sm:text-sm text-[#556987] mt-0.5">
                    Choose when and how ResearchAI reaches out to you.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { key: "researchUpdates" as const, title: "Research Synthesis Complete", desc: "Notify when long background research searches finish" },
                    { key: "weeklyDigest" as const, title: "Weekly Discovery Digest", desc: "Curated new papers matching your saved topics" },
                    { key: "recommendations" as const, title: "Emerging Topic Recommendations", desc: "Early alerts on trending preprint breakthroughs" },
                  ].map((n) => (
                    <div
                      key={n.key}
                      className="flex items-center justify-between p-4 rounded-xl border border-[#DCE7F6] hover:bg-slate-50/60 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#07133D]">{n.title}</div>
                        <div className="text-[11px] text-[#556987] mt-0.5">{n.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          notifs[n.key] ? "bg-[#2563EB]" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                            notifs[n.key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  );
}
