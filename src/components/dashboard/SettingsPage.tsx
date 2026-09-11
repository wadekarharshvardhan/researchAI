"use client";

import { useState, useEffect } from "react";
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
  KeyRound,
  Calendar,
  Fingerprint,
  Loader2,
} from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";

type SettingsTab =
  | "profile"
  | "preferences"
  | "sources"
  | "citations"
  | "appearance"
  | "notifications";

const menuItems: { id: SettingsTab; label: string; desc: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", desc: "Account & identity", icon: User },
  { id: "preferences", label: "Research Preferences", desc: "AI depth & synthesis", icon: Sliders },
  { id: "sources", label: "Sources & Databases", desc: "6 connected libraries", icon: Database },
  { id: "citations", label: "Citation & Export", desc: "Formats & styles", icon: FileText },
  { id: "appearance", label: "Appearance", desc: "Theme & display", icon: Palette },
  { id: "notifications", label: "Notifications", desc: "Alerts & digests", icon: Bell },
];

const academicRoles = [
  "Student",
  "PhD Candidate",
  "Postdoc Researcher",
  "Professor / Faculty",
  "Independent Researcher",
  "Industry R&D Professional",
];

interface SettingsPageProps {
  initialTab?: SettingsTab;
}

export default function SettingsPage({ initialTab = "profile" }: SettingsPageProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Profile Form State initialized from authenticated session
  const [fullName, setFullName] = useState(session?.user?.name || "Harshvardhan Wadekar");
  const [email, setEmail] = useState(session?.user?.email || "wadekarharshvardhan@gmail.com");
  const [academicRole, setAcademicRole] = useState("Student");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever session updates
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setFullName(session.user.name);
      if (session.user.email) setEmail(session.user.email);
    }
  }, [session]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (session?.user && fullName !== session.user.name) {
        await authClient.updateUser({
          name: fullName,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile name:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full min-h-0 min-w-0 flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-10 max-w-[1360px] mx-auto select-none"
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
        {/* Mobile / Tablet Horizontal Scrollable Tab Bar (< md) */}
        <div className="md:hidden col-span-12 -mx-4 px-4 overflow-x-auto scrollbar-none pb-1 flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-xs font-bold"
                    : "bg-white/90 border border-[#DCE7F6] text-[#556987] hover:text-[#07133D]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Vertical Tabs Card (>= md) */}
        <div className="hidden md:block md:col-span-5 lg:col-span-4 xl:col-span-3 sticky top-20">
          <div className="bg-white/90 backdrop-blur-xl border border-[#DCE7F6] rounded-2xl p-2 sm:p-2.5 shadow-[0_2px_14px_rgba(30,60,120,0.04)] space-y-1 relative">
            <div className="px-3 pt-2 pb-1.5 border-b border-[#F0F4FA] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8EA3C0]">
                Navigation
              </span>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? "text-[#1D4ED8] font-bold"
                      : "text-[#556987] hover:text-[#07133D]"
                  }`}
                >
                  {/* Sliding animated active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="settings-active-tab-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#EEF4FD] via-[#F4F8FE] to-[#E2EDFA] border border-[#BFDBFE] shadow-xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "bg-slate-100 text-[#64748B] group-hover:bg-blue-50 group-hover:text-[#2563EB]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs sm:text-[13px] font-bold truncate leading-tight">
                        {item.label}
                      </span>
                      <span className="block text-[11px] text-[#64748B] font-normal truncate mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="relative z-10 w-1.5 h-4 bg-[#2563EB] rounded-full mr-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Settings Content Area */}
        <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 space-y-6">
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

                    {/* Avatar with User Details */}
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      {session?.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#DCE7F6] shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
                          {(fullName.charAt(0) || "H").toUpperCase()}
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#07133D] truncate">{fullName}</p>
                        <p className="text-[11px] text-[#64748B] truncate">{email}</p>
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
                            readOnly
                            className="w-full pl-3.5 pr-24 py-2.5 rounded-xl border border-[#DCE7F6] bg-slate-50/70 text-sm text-[#07133D] outline-none cursor-default transition-all select-all"
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
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
                      >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Connected Identity & Account Security Card */}
                <div className="bg-white rounded-2xl border border-[#DCE7F6] p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EBF2FA]">
                    <div>
                      <h3 className="text-base font-bold text-[#07133D] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                        <span>Authentication & Identity</span>
                      </h3>
                      <p className="text-xs text-[#556987] mt-0.5">
                        Verified security credentials and authentication provider details.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      Active Session
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                    {/* Identity 1: Auth Method */}
                    <div className="p-4 rounded-xl border border-[#EBF2FA] bg-[#F8FAFC]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-1">
                        <KeyRound className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Sign-in Provider</span>
                      </div>
                      <p className="text-sm font-bold text-[#07133D]">
                        {session?.user?.image?.includes("github")
                          ? "GitHub OAuth"
                          : session?.user?.image?.includes("google")
                          ? "Google OAuth"
                          : "Better Auth OAuth"}
                      </p>
                    </div>

                    {/* Identity 2: Account ID */}
                    <div className="p-4 rounded-xl border border-[#EBF2FA] bg-[#F8FAFC]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-1">
                        <Fingerprint className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>User ID</span>
                      </div>
                      <p className="text-xs font-mono font-medium text-[#07133D] truncate" title={session?.user?.id}>
                        {session?.user?.id || "usr_verified"}
                      </p>
                    </div>

                    {/* Identity 3: Member Since */}
                    <div className="p-4 rounded-xl border border-[#EBF2FA] bg-[#F8FAFC]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-1">
                        <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Member Since</span>
                      </div>
                      <p className="text-sm font-bold text-[#07133D]">
                        {session?.user?.createdAt
                          ? new Date(session.user.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              year: "numeric",
                            })
                          : "September 2026"}
                      </p>
                    </div>
                  </div>
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
