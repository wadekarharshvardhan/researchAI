"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Brain,
  Leaf,
  HeartPulse,
  Eye,
  FileText,
  Dna,
  Wind,
  Bot,
  Atom,
  Sprout,
  BarChart2,
  Zap,
  ShieldCheck,
  Cpu,
  Orbit,
  Coins,
  Database,
  Layers,
  Stethoscope,
  Microscope,
  Waves,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExplorePageProps {
  onSearch?: (query: string) => void;
  onSelectTopic?: (topic: string) => void;
}

/* ─── 20 Popular Research Areas ───────────────────────────────────────── */
const researchAreas = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    papers: "2.4M+ papers",
    icon: Brain,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-100/60",
    query: "Artificial Intelligence foundation models and reasoning",
    domain: "cs",
  },
  {
    id: "climate",
    title: "Climate Change",
    papers: "1.1M+ papers",
    icon: Leaf,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-100/60",
    query: "Climate Change impact and adaptation strategies",
    domain: "env",
  },
  {
    id: "healthcare",
    title: "Healthcare & Medicine",
    papers: "1.8M+ papers",
    icon: HeartPulse,
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50 border-rose-100/60",
    query: "AI in healthcare and clinical diagnosis",
    domain: "bio",
  },
  {
    id: "vision",
    title: "Computer Vision",
    papers: "890K+ papers",
    icon: Eye,
    iconColor: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-100/60",
    query: "Computer vision and multimodal image recognition",
    domain: "cs",
  },
  {
    id: "nlp",
    title: "Natural Language Processing",
    papers: "760K+ papers",
    icon: FileText,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-50 border-cyan-100/60",
    query: "Natural Language Processing and LLMs",
    domain: "cs",
  },
  {
    id: "bioinformatics",
    title: "Bioinformatics",
    papers: "620K+ papers",
    icon: Dna,
    iconColor: "text-teal-600",
    bgColor: "bg-teal-50 border-teal-100/60",
    query: "Bioinformatics and computational genomics",
    domain: "bio",
  },
  {
    id: "energy",
    title: "Renewable Energy",
    papers: "540K+ papers",
    icon: Wind,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-100/60",
    query: "Renewable energy technologies and storage",
    domain: "eng",
  },
  {
    id: "robotics",
    title: "Robotics & Cybernetics",
    papers: "480K+ papers",
    icon: Bot,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-100/60",
    query: "Autonomous robotics and reinforcement learning",
    domain: "cs",
  },
  {
    id: "materials",
    title: "Materials Science",
    papers: "410K+ papers",
    icon: Atom,
    iconColor: "text-violet-600",
    bgColor: "bg-violet-50 border-violet-100/60",
    query: "Advanced materials and quantum crystalline structures",
    domain: "eng",
  },
  {
    id: "agriculture",
    title: "Agriculture & Food Security",
    papers: "380K+ papers",
    icon: Sprout,
    iconColor: "text-green-600",
    bgColor: "bg-green-50 border-green-100/60",
    query: "Smart precision agriculture and food security",
    domain: "env",
  },
  {
    id: "quantum",
    title: "Quantum Computing",
    papers: "340K+ papers",
    icon: Cpu,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-100/60",
    query: "Quantum computing algorithms and superconducting qubits",
    domain: "cs",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Cryptography",
    papers: "510K+ papers",
    icon: ShieldCheck,
    iconColor: "text-red-600",
    bgColor: "bg-red-50 border-red-100/60",
    query: "Cybersecurity post-quantum cryptography and zero trust",
    domain: "cs",
  },
  {
    id: "astrophysics",
    title: "Astrophysics & Space Systems",
    papers: "290K+ papers",
    icon: Orbit,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-100/60",
    query: "Astrophysics cosmology and deep space exploration",
    domain: "eng",
  },
  {
    id: "neuroscience",
    title: "Neuroscience & BCI",
    papers: "440K+ papers",
    icon: Sparkles,
    iconColor: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50 border-fuchsia-100/60",
    query: "Cognitive neuroscience and brain-computer interfaces",
    domain: "bio",
  },
  {
    id: "fintech",
    title: "Economics & FinTech",
    papers: "390K+ papers",
    icon: Coins,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-100/60",
    query: "Quantitative finance and algorithmic game theory",
    domain: "soc",
  },
  {
    id: "nanotech",
    title: "Nanotechnology",
    papers: "310K+ papers",
    icon: Microscope,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-100/60",
    query: "Nanotechnology and nanoscale molecular engineering",
    domain: "eng",
  },
  {
    id: "bigdata",
    title: "Big Data & Distributed Systems",
    papers: "720K+ papers",
    icon: Database,
    iconColor: "text-slate-700",
    bgColor: "bg-slate-50 border-slate-200/60",
    query: "Distributed systems and high-performance cloud data pipelines",
    domain: "cs",
  },
  {
    id: "marine",
    title: "Oceanography & Marine Science",
    papers: "260K+ papers",
    icon: Waves,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-50 border-cyan-100/60",
    query: "Oceanography marine ecosystems and ocean carbon sinks",
    domain: "env",
  },
  {
    id: "pharma",
    title: "Pharmacology & Drug Discovery",
    papers: "580K+ papers",
    icon: Stethoscope,
    iconColor: "text-pink-600",
    bgColor: "bg-pink-50 border-pink-100/60",
    query: "AI molecular drug discovery and clinical pharmacology",
    domain: "bio",
  },
  {
    id: "synbio",
    title: "Synthetic Biology & CRISPR",
    papers: "350K+ papers",
    icon: Layers,
    iconColor: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-100/60",
    query: "CRISPR gene editing and synthetic biology pathways",
    domain: "bio",
  },
];

const domainFilters = [
  { id: "all", label: "All Topics" },
  { id: "cs", label: "Computer Science & AI" },
  { id: "bio", label: "Life Sciences & Medicine" },
  { id: "eng", label: "Engineering & Space" },
  { id: "env", label: "Climate & Agriculture" },
  { id: "soc", label: "Social & Economics" },
];

/* ─── 6 Curated Collections with Cinematic Images ────────────────────── */
const curatedCollections = [
  {
    id: "sustainability",
    badge: "FEATURED",
    badgeBg: "bg-emerald-500/90",
    title: "Sustainability & Green Innovation",
    desc: "Pioneering research in carbon neutrality, circular economies, and regenerative ecosystems.",
    count: "128 collections",
    image: "/images/curated_sustainability.jpg",
    query: "Sustainability and green energy innovation",
  },
  {
    id: "ai-future",
    badge: "TRENDING",
    badgeBg: "bg-blue-600/90",
    title: "The Future of AI & Reasoning",
    desc: "Frontier foundation models, multimodal agents, neuro-symbolic logic, and AI alignment.",
    count: "154 collections",
    image: "/images/curated_ai_brain.jpg",
    query: "Future of artificial intelligence advancements",
  },
  {
    id: "healthcare-breakthroughs",
    badge: "POPULAR",
    badgeBg: "bg-rose-600/90",
    title: "Breakthroughs in Healthcare",
    desc: "Next-generation genomic medicine, automated clinical diagnostics, and targeted therapies.",
    count: "112 collections",
    image: "/images/curated_healthcare_dna.jpg",
    query: "Breakthroughs in healthcare and medicine",
  },
  {
    id: "quantum-space",
    badge: "NEW",
    badgeBg: "bg-indigo-600/90",
    title: "Quantum Computing & Deep Space",
    desc: "Superconducting qubits, quantum entanglement, exoplanet spectroscopy, and relativistic astrophysics.",
    count: "86 collections",
    image: "/images/curated_quantum_space.jpg",
    query: "Quantum computing and space astrophysics",
  },
  {
    id: "robotics-cyber",
    badge: "FEATURED",
    badgeBg: "bg-amber-600/90",
    title: "Autonomous Robotics & Cybernetics",
    desc: "Humanoid kinematics, tactile reinforcement learning, teleoperation, and embodied artificial intelligence.",
    count: "98 collections",
    image: "/images/curated_robotics_cyber.jpg",
    query: "Autonomous robotics and cybernetics",
  },
  {
    id: "neuroscience-bci",
    badge: "HOT",
    badgeBg: "bg-fuchsia-600/90",
    title: "Neuroscience & Connectomics",
    desc: "Mapping whole-brain synaptic circuits, cortical neural decoding, and brain-machine interfaces.",
    count: "74 collections",
    image: "/images/curated_neuroscience.jpg",
    query: "Neuroscience and neural interfaces",
  },
];

/* ─── 14 Suggested Research Questions ────────────────────────────────── */
const suggestedQuestions = [
  {
    id: "q1",
    icon: Sprout,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50/80 border-emerald-100/60",
    question: "How is AI transforming agriculture and precision crop yield?",
    category: "Agriculture & Environment",
  },
  {
    id: "q2",
    icon: BarChart2,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50/80 border-blue-100/60",
    question: "What are the latest advances in high-resolution climate modeling?",
    category: "Climate Science",
  },
  {
    id: "q3",
    icon: FileText,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-50/80 border-cyan-100/60",
    question: "How effective are large language models in individualized higher education?",
    category: "AI & Education",
  },
  {
    id: "q4",
    icon: Zap,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50/80 border-amber-100/60",
    question: "What are the emerging breakthroughs in solid-state lithium battery tech?",
    category: "Renewable Energy",
  },
  {
    id: "q5",
    icon: Cpu,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50/80 border-blue-100/60",
    question: "How do quantum variational algorithms solve complex molecular simulation?",
    category: "Quantum Computing",
  },
  {
    id: "q6",
    icon: Dna,
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50/80 border-rose-100/60",
    question: "What are the latest breakthroughs in CRISPR base editing for genetic therapy?",
    category: "Genomics",
  },
  {
    id: "q7",
    icon: Brain,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50/80 border-purple-100/60",
    question: "How can neuromorphic computing architectures lower power consumption in LLMs?",
    category: "Computer Architecture",
  },
  {
    id: "q8",
    icon: Eye,
    iconColor: "text-sky-600",
    bgColor: "bg-sky-50/80 border-sky-100/60",
    question: "What are the state-of-the-art vision-language models for robotic manipulation?",
    category: "Robotics & Vision",
  },
  {
    id: "q9",
    icon: Layers,
    iconColor: "text-teal-600",
    bgColor: "bg-teal-50/80 border-teal-100/60",
    question: "How is synthetic biology engineered to biosynthesize recyclable bioplastics?",
    category: "Biotechnology",
  },
  {
    id: "q10",
    icon: Sparkles,
    iconColor: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50/80 border-fuchsia-100/60",
    question: "What are the cognitive implications of algorithmic recommendations on youth?",
    category: "Behavioral Science",
  },
  {
    id: "q11",
    icon: Atom,
    iconColor: "text-violet-600",
    bgColor: "bg-violet-50/80 border-violet-100/60",
    question: "How can deep reinforcement learning stabilize tokamak plasma in nuclear fusion?",
    category: "Plasma Physics",
  },
  {
    id: "q12",
    icon: ShieldCheck,
    iconColor: "text-red-600",
    bgColor: "bg-red-50/80 border-red-100/60",
    question: "What differential privacy mechanisms best prevent leakage in federated learning?",
    category: "Cybersecurity",
  },
  {
    id: "q13",
    icon: Waves,
    iconColor: "text-cyan-700",
    bgColor: "bg-cyan-50/80 border-cyan-100/60",
    question: "How does ocean acidification affect marine biodiversity and carbon sinks?",
    category: "Marine Science",
  },
  {
    id: "q14",
    icon: HeartPulse,
    iconColor: "text-pink-600",
    bgColor: "bg-pink-50/80 border-pink-100/60",
    question: "What are the clinical hurdles in non-invasive neural interface prosthetics?",
    category: "Neural Engineering",
  },
];

export default function ExplorePage({ onSearch, onSelectTopic }: ExplorePageProps) {
  const [searchInput, setSearchInput] = useState("");
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch?.(searchInput.trim());
    }
  };

  const handleAreaClick = (query: string) => {
    if (onSelectTopic) {
      onSelectTopic(query);
    } else {
      onSearch?.(query);
    }
  };

  // Filter research areas based on expanded state and domain tab
  const filteredAreas = researchAreas.filter((area) => {
    if (!showAllAreas) return true;
    if (selectedDomain === "all") return true;
    return area.domain === selectedDomain;
  });

  const displayedAreas = showAllAreas ? filteredAreas : researchAreas.slice(0, 10);
  const displayedCollections = showAllCollections ? curatedCollections : curatedCollections.slice(0, 3);
  const displayedQuestions = showAllQuestions ? suggestedQuestions : suggestedQuestions.slice(0, 4);

  return (
    <motion.main
      className="w-full h-full min-h-0 min-w-0 flex-1 relative flex flex-col overflow-y-auto px-4 sm:px-6 lg:px-8 py-7 select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Explore research horizons"
    >
      {/* ── Soft Atmospheric Ambient Gradient + Mountain Landscape ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage: "radial-gradient(ellipse at 50% -10%, #C3DAFE 0%, transparent 60%)",
          }}
        />
        {/* Soft mountain silhouette backdrop */}
        <div className="absolute top-0 right-0 left-0 h-96 opacity-[0.16] pointer-events-none select-none">
          <Image
            src="/images/hero-bg.webp"
            alt=""
            fill
            className="object-cover object-top"
            unoptimized
            priority
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(238,244,253,0.7) 40%, #EEF4FD 100%)",
          }}
        />
      </div>

      {/* ── Main Content Container ────────────────────────────── */}
      <div className="relative z-10 max-w-[1100px] w-full mx-auto space-y-8 pb-14">
        {/* ── Header Title & Doodles ──────────────────────────── */}
        <div className="relative flex items-center justify-between pt-2 pb-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase bg-blue-100/80 text-[#2563EB] border border-blue-200/60">
                Discover Knowledge
              </span>
              <span className="text-xs text-[#64748B] font-medium hidden sm:inline">
                • 200M+ Academic Papers & Datasets
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              Explore Research
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-xl leading-relaxed">
              Browse emerging disciplines, examine curated collections with high-impact breakthroughs, or explore suggested inquiries across science and engineering.
            </p>
          </div>

          {/* Whimsical Scientific Sketch Illustration (Right) */}
          <div className="hidden lg:block relative w-36 h-28 shrink-0 pointer-events-none select-none -mt-3">
            <div className="absolute right-0 top-0 w-32 h-24 text-[#2563EB]/40 flex items-center justify-center">
              <svg
                viewBox="0 0 120 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-65 drop-shadow-xs"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Orbit with electrons */}
                <ellipse cx="60" cy="45" rx="42" ry="18" strokeDasharray="3 3" />
                <ellipse
                  cx="60"
                  cy="45"
                  rx="42"
                  ry="18"
                  transform="rotate(60 60 45)"
                  strokeDasharray="3 3"
                />
                <ellipse
                  cx="60"
                  cy="45"
                  rx="42"
                  ry="18"
                  transform="rotate(-60 60 45)"
                  strokeDasharray="3 3"
                />
                {/* Nucleus */}
                <circle cx="60" cy="45" r="5" fill="#2563EB" fillOpacity="0.6" />
                {/* Orbiting particles */}
                <circle cx="95" cy="42" r="3" fill="#2563EB" />
                <circle cx="36" cy="28" r="2.5" fill="#2563EB" />
                <circle cx="78" cy="65" r="2.5" fill="#2563EB" />
                {/* Constellation sparkle stars */}
                <path d="M102 16L104 22L110 24L104 26L102 32L100 26L94 24L100 22Z" fill="#3B82F6" fillOpacity="0.5" stroke="none" />
                <path d="M16 64L17.5 68L22 69.5L17.5 71L16 75L14.5 71L10 69.5L14.5 68Z" fill="#3B82F6" fillOpacity="0.5" stroke="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Large Search Input ──────────────────────────────── */}
        <motion.form
          onSubmit={handleSearchSubmit}
          className="relative w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div
            className="relative flex items-center bg-white rounded-full shadow-[0_4px_24px_rgba(32,93,248,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-[#DCE7F6] focus-within:border-[#2563EB] focus-within:ring-3 focus-within:ring-[#2563EB]/15 transition-all duration-200 px-5 py-3.5"
          >
            <Search className="w-5 h-5 text-[#6B80A8] shrink-0 mr-3.5" strokeWidth={2} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search topics, keywords, or research areas..."
              className="w-full bg-transparent text-sm sm:text-base text-[#07133D] placeholder-[#8EA3C0] outline-none focus:outline-none focus:ring-0 border-none font-normal"
            />
            {searchInput && (
              <button
                type="submit"
                className="shrink-0 ml-2 px-4 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              >
                Search
              </button>
            )}
          </div>
        </motion.form>

        {/* ── Section 1: Popular Research Areas ───────────────── */}
        <section aria-labelledby="heading-popular-areas" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="heading-popular-areas" className="text-base sm:text-lg font-bold text-[#07133D] tracking-tight">
                  Popular Research Areas
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-100">
                  {researchAreas.length} Areas
                </span>
              </div>
              <p className="text-xs text-[#556987] mt-0.5 hidden sm:block">
                Explore foundational and emerging fields across global scientific literature
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllAreas((prev) => !prev)}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-blue-50/80 border border-[#E2EAF5] hover:border-blue-200 transition-all cursor-pointer group shadow-2xs"
            >
              <span>{showAllAreas ? "Show less" : `View all (${researchAreas.length})`}</span>
              <ArrowRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showAllAreas ? "rotate-90 text-[#2563EB]" : "group-hover:translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Category Filter Chips when expanded */}
          <AnimatePresence>
            {showAllAreas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5"
                style={{ scrollbarWidth: "none" }}
              >
                {domainFilters.map((tab) => {
                  const isCurrent = selectedDomain === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedDomain(tab.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[#2563EB] text-white shadow-2xs"
                          : "bg-white/80 text-[#556987] hover:bg-white hover:text-[#07133D] border border-[#E2EAF5]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5">
            {displayedAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <motion.button
                  key={area.id}
                  type="button"
                  onClick={() => handleAreaClick(area.query)}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-[#E2EAF5] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.1)] hover:border-blue-200/90 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between group min-h-[122px]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + (idx % 10) * 0.02, duration: 0.25 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center ${area.bgColor} ${area.iconColor} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#07133D] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
                      {area.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                    <span className="text-[11px] text-[#64748B] font-medium">
                      {area.papers}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Curated Collections ──────────────────── */}
        <section aria-labelledby="heading-curated-collections" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="heading-curated-collections" className="text-base sm:text-lg font-bold text-[#07133D] tracking-tight">
                  Curated Collections
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {curatedCollections.length} Handpicked
                </span>
              </div>
              <p className="text-xs text-[#556987] mt-0.5 hidden sm:block">
                Deep-dive into landmark papers, benchmark datasets, and interdisciplinary reading lists
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllCollections((prev) => !prev)}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-blue-50/80 border border-[#E2EAF5] hover:border-blue-200 transition-all cursor-pointer group shadow-2xs"
            >
              <span>{showAllCollections ? "Show less" : `View all (${curatedCollections.length})`}</span>
              <ArrowRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showAllCollections ? "rotate-90 text-[#2563EB]" : "group-hover:translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCollections.map((col, idx) => (
              <motion.div
                key={col.id}
                onClick={() => handleAreaClick(col.query)}
                className="relative rounded-2xl overflow-hidden min-h-[185px] sm:min-h-[200px] p-5 flex flex-col justify-between cursor-pointer group shadow-[0_6px_22px_rgba(0,0,0,0.06)] border border-white/40"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.04, duration: 0.3 }}
                whileHover={{ y: -3, boxShadow: "0 14px 34px rgba(15,23,42,0.18)" }}
              >
                {/* Background Image with Zoom on Hover */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-600 ease-out group-hover:scale-108"
                  />
                  {/* High quality overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`inline-block text-[9.5px] font-extrabold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs ${col.badgeBg}`}
                  >
                    {col.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-auto pt-4 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-blue-200 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-[11.5px] text-white/80 line-clamp-2 leading-relaxed font-normal">
                    {col.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-white/90 group-hover:text-white">
                    <span>{col.count}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Suggested Research Questions ─────────── */}
        <section aria-labelledby="heading-suggested-questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="heading-suggested-questions" className="text-base sm:text-lg font-bold text-[#07133D] tracking-tight">
                  Suggested Research Questions
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-violet-50 text-violet-700 border border-violet-200/60">
                  {suggestedQuestions.length} Prompts
                </span>
              </div>
              <p className="text-xs text-[#556987] mt-0.5 hidden sm:block">
                Investigate pressing questions with AI-synthesized research summaries and citations
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllQuestions((prev) => !prev)}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-blue-50/80 border border-[#E2EAF5] hover:border-blue-200 transition-all cursor-pointer group shadow-2xs"
            >
              <span>{showAllQuestions ? "Show less" : `View all (${suggestedQuestions.length})`}</span>
              <ArrowRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showAllQuestions ? "rotate-90 text-[#2563EB]" : "group-hover:translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayedQuestions.map((q, idx) => {
              const Icon = q.icon;
              return (
                <motion.button
                  key={q.id}
                  type="button"
                  onClick={() => handleAreaClick(q.question)}
                  className="bg-white/95 rounded-2xl px-4 py-3.5 border border-[#E2EAF5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 cursor-pointer text-left flex items-center justify-between gap-3 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + (idx % 8) * 0.02, duration: 0.25 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${q.bgColor} ${q.iconColor}`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-[13px] font-medium text-[#1E293B] group-hover:text-[#2563EB] truncate block transition-colors">
                        {q.question}
                      </span>
                      {q.category && (
                        <span className="text-[10.5px] text-[#64748B] font-medium block mt-0.5">
                          {q.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#94A3B8] shrink-0 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
