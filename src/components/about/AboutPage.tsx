"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Compass,
  Sparkles,
  HeartHandshake,
  Shield,
  Lightbulb,
  ArrowRight,
  Quote,
  GraduationCap,
  Microscope,
  Code2,
  Atom,
  CheckCircle2,
  Zap,
  Brain,
  Network,
  Orbit,
  Dna,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AboutPageProps {
  onStartResearch?: () => void;
  onExploreTopics?: () => void;
}

/* ─────────────────────────────────────────────────────────────
   PERSONAS DATA (No numerical values)
───────────────────────────────────────────────────────────── */
const personas = [
  {
    id: "students",
    title: "Learners & Students",
    badge: "Curiosity First",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 text-[#2563EB]",
    quote: "Demystifying dense academic literature so you can learn without intimidation or friction.",
    benefits: [
      "Translates complex academic jargon into clear, intuitive language",
      "Connects seminar papers to foundational textbook principles",
      "Highlights core experimental methods without reading repetitive intros",
    ],
  },
  {
    id: "researchers",
    title: "Scholars & Academics",
    badge: "Accelerated Synthesis",
    icon: Microscope,
    color: "from-indigo-500 to-purple-600",
    bg: "bg-purple-50 text-[#8B5CF6]",
    quote: "Uncovering unseen research gaps and contradictions across multidisciplinary literature.",
    benefits: [
      "Surfaces conflicting findings and consensus across global preprint servers",
      "Automated methodology and dataset comparison matrix",
      "Direct citation linking with seamless BibTeX bibliography exports",
    ],
  },
  {
    id: "builders",
    title: "Builders & Innovators",
    badge: "Idea to Impact",
    icon: Code2,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 text-[#10B981]",
    quote: "Translating cutting-edge laboratory breakthroughs into real-world applications.",
    benefits: [
      "Identifies state-of-the-art algorithms and algorithmic benchmarks",
      "Extracts practical implementation trade-offs and code repositories",
      "Spots emerging technology trends long before mainstream industry adoption",
    ],
  },
  {
    id: "thinkers",
    title: "Independent Thinkers",
    badge: "Boundless Wonder",
    icon: Atom,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 text-[#D97706]",
    quote: "Following intellectual passions wherever curiosity leads, across all sciences.",
    benefits: [
      "Cross-pollinates insights across physics, biology, ecology, and intelligence",
      "Personalized research journeys unconstrained by institutional gates",
      "Private reading workspace to cultivate your own intellectual ideas",
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   THE ARC OF DISCOVERY (Step-by-step interactive timeline)
───────────────────────────────────────────────────────────── */
const discoverySteps = [
  {
    step: "Phase I",
    title: "The Spark",
    subtitle: "A Question is Born",
    icon: Sparkles,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    desc: "Every world-changing insight starts as an unpretentious curiosity: a paradox noticed in lab notes, an unexpected anomaly in data, or a lingering 'what if' while reading.",
    highlight: "ResearchAI frames your initial inquiry into search vectors that span multiple disciplines.",
  },
  {
    step: "Phase II",
    title: "The Exploration",
    subtitle: "Navigating Global Literature",
    icon: Compass,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
    desc: "Instead of drowning in hundreds of siloed PDFs, you effortlessly traverse connected papers, understanding which authors agreed, debated, or tested the core hypothesis.",
    highlight: "Semantic mapping clusters papers by methodology rather than superficial keywords.",
  },
  {
    step: "Phase III",
    title: "The Synthesis",
    subtitle: "Connecting the Dots",
    icon: Network,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    desc: "The true magic occurs when ideas cross boundaries: computational physics meeting protein folding, or economic game theory informing decentralized consensus.",
    highlight: "Automated synthesis extracts consensus, conflicting evidence, and open frontiers.",
  },
  {
    step: "Phase IV",
    title: "The Breakthrough",
    subtitle: "Contributing New Knowledge",
    icon: Lightbulb,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    desc: "Armed with clarity, you formulate your own novel hypotheses, design experiments, write compelling literature reviews, and advance human understanding.",
    highlight: "Export anchored notes, structured bibliographies, and literature summaries seamlessly.",
  },
];

/* ─────────────────────────────────────────────────────────────
   CURIOUS INQUIRIES SHOWCASE (Interactive Live Sample)
───────────────────────────────────────────────────────────── */
const sampleInquiries = [
  {
    id: "neural-generalization",
    category: "Computer Science & AI",
    question: "Why do overparameterized neural networks generalize rather than simply memorizing?",
    consensus: "Modern theories show that stochastic gradient descent possesses an implicit regularization bias, guiding weights toward flatter, robust minima.",
    frontier: "How architectural inductive biases interact with non-Euclidean data geometries remains an active open frontier.",
    tags: ["Deep Learning", "Generalization Theory", "Optimization Landscapes"],
  },
  {
    id: "quantum-bio",
    category: "Biophysics & Quantum Mechanics",
    question: "Can quantum coherence persist in warm, wet biological environments like photosynthetic complexes?",
    consensus: "Spectroscopy indicates excitonic energy transfer in FMO complexes benefits from environmentally assisted quantum transport.",
    frontier: "The degree to which natural selection specifically optimized for quantum effects versus classical thermal diffusion is actively contested.",
    tags: ["Quantum Biology", "Exciton Dynamics", "Photosynthesis"],
  },
  {
    id: "mycelial-networks",
    category: "Ecology & Systems Biology",
    question: "How do mycorrhizal fungal networks redistribute resources and chemical signals across forest canopies?",
    consensus: "Mycelial common networks act as biological conduits, transferring carbon, nitrogen, and defensive volatiles between kin and non-kin trees.",
    frontier: "Distinguishing active altruistic signaling from passive source-sink physiological gradients remains a central debate.",
    tags: ["Mycorrhizal Ecology", "Chemical Signaling", "Forest Systems"],
  },
];

/* ─────────────────────────────────────────────────────────────
   CORE PRINCIPLES (No numerical values)
───────────────────────────────────────────────────────────── */
const principles = [
  {
    icon: Sparkles,
    title: "Rigorous & Grounded",
    subtitle: "Scientific Integrity",
    desc: "Every synthesis is tethered to verifiable citations and authentic literature, ensuring intellectual honesty in every sentence.",
    bg: "bg-blue-50 text-[#2563EB]",
    gradient: "group-hover:border-blue-300",
  },
  {
    icon: Compass,
    title: "Accessible to Everyone",
    subtitle: "No Elitism",
    desc: "Demystifying complex methodologies, acronyms, and mathematical formulas so curious minds can explore without intimidation.",
    bg: "bg-emerald-50 text-[#10B981]",
    gradient: "group-hover:border-emerald-300",
  },
  {
    icon: Shield,
    title: "Privacy & Respect",
    subtitle: "Your Intellectual Property",
    desc: "Your questions, private notes, and emerging hypotheses remain strictly yours. We protect your intellectual journey unconditionally.",
    bg: "bg-purple-50 text-[#8B5CF6]",
    gradient: "group-hover:border-purple-300",
  },
  {
    icon: HeartHandshake,
    title: "Human at the Core",
    subtitle: "Augmented Intelligence",
    desc: "AI is a companion to illuminate new pathways, but the human thrill of discovery, curiosity, and critical judgment is paramount.",
    bg: "bg-amber-50 text-[#D97706]",
    gradient: "group-hover:border-amber-300",
  },
];

/* ─────────────────────────────────────────────────────────────
   INSPIRATIONAL QUOTES (No numerical values)
───────────────────────────────────────────────────────────── */
const inspirationalQuotes = [
  {
    quote: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
    role: "Astronomer & Science Communicator",
  },
  {
    quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    role: "Physicist & Chemist, Nobel Laureate",
  },
  {
    quote: "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
    author: "Albert Einstein",
    role: "Theoretical Physicist",
  },
  {
    quote: "I would rather have questions that can't be answered than answers that can't be questioned.",
    author: "Richard Feynman",
    role: "Theoretical Physicist",
  },
];

/* ─────────────────────────────────────────────────────────────
   FLOATING DISCOVERY BADGES (Hero Visual Flourish)
───────────────────────────────────────────────────────────── */
const floatingBadges = [
  { label: "✦ Quantum Coherence", x: "top-4 -left-6", delay: 0, duration: 6 },
  { label: "✦ CRISPR Gene Drives", x: "bottom-8 -left-4", delay: 1, duration: 7 },
  { label: "✦ Neural Generalization", x: "top-2 -right-6", delay: 0.5, duration: 6.5 },
  { label: "✦ Dark Energy Curvature", x: "bottom-6 -right-4", delay: 1.5, duration: 8 },
];

export default function AboutPage({
  onStartResearch,
  onExploreTopics,
}: AboutPageProps) {
  const [selectedPersona, setSelectedPersona] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [activeInquiry, setActiveInquiry] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Auto cycle quote every few seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentPersona = personas[selectedPersona];
  const currentInquiry = sampleInquiries[activeInquiry];
  const currentStep = discoverySteps[activeStep];

  return (
    <div className="relative w-full h-full min-h-0 min-w-0 overflow-y-auto select-none pb-28">
      {/* ── Background Landscape ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #EBF2FA 0%, #EEF4FD 25%, #F4F8FE 50%, #E2EDFA 100%)",
          }}
        />

        {/* Alpine Mountain Background */}
        <div className="absolute inset-0 w-full h-full opacity-55">
          <Image
            src="/images/hero-bg.webp"
            alt="Alpine mountain landscape"
            fill
            priority
            unoptimized
            className="object-cover object-bottom"
            sizes="100vw"
          />
        </div>

        {/* Atmospheric Gradient Blend */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(235, 243, 252, 0.72) 0%, rgba(240, 246, 254, 0.45) 35%, rgba(226, 237, 250, 0.82) 100%)",
          }}
        />

        {/* Ethereal Floating Ambient Orbs */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -25, 0],
            opacity: [0.3, 0.55, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-[420px] h-[420px] rounded-full bg-blue-300/25 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 30, 0],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-10 w-[460px] h-[460px] rounded-full bg-sky-200/30 blur-[130px]"
        />
      </div>

      {/* ── Main Content Container ────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        {/* ── Hero Header with Animated Badges & Doodles ───────── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl relative"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-[#DCE7F6] shadow-2xs mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#2563EB] uppercase">
                About ResearchAI
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#07133D] tracking-tight leading-[1.12]">
              Empowering Curiosity.
              <br />
              <span className="bg-gradient-to-r from-[#205DF8] via-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
                Accelerating Discovery.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-[17px] text-[#556987] mt-4 leading-relaxed max-w-xl">
              We believe every breakthrough in human history began with a quiet question. ResearchAI turns scientific literature from an overwhelming maze into a living canvas for exploration and discovery.
            </p>

            {/* Micro Tags / Floating Concept Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-2">
              <span className="px-3 py-1 rounded-full bg-blue-50/90 border border-blue-100/80 text-[11px] font-semibold text-[#2563EB] flex items-center gap-1.5 shadow-2xs">
                <Brain className="w-3 h-3 text-[#2563EB]" /> Connected Thinking
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-50/90 border border-purple-100/80 text-[11px] font-semibold text-[#8B5CF6] flex items-center gap-1.5 shadow-2xs">
                <Orbit className="w-3 h-3 text-[#8B5CF6]" /> Multidisciplinary Horizons
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-100/80 text-[11px] font-semibold text-[#10B981] flex items-center gap-1.5 shadow-2xs">
                <Dna className="w-3 h-3 text-[#10B981]" /> Verifiable Integrity
              </span>
            </div>
          </motion.div>

          {/* Right: Handwritten Caveat Doodle with Animated Star, Arrow & Floating Badges */}
          <div className="flex flex-col items-end gap-2 self-start md:self-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="hidden md:flex flex-col items-center relative mr-8 mt-3 pointer-events-none select-none"
            >
              <div className="text-[#2563EB] font-['Caveat',cursive] text-2xl font-bold rotate-[-6deg] leading-tight text-right flex items-center gap-1.5">
                <span>&ldquo;Questions spark discoveries.&rdquo;</span>
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-amber-500 inline-block text-xl"
                >
                  ✦
                </motion.span>
              </div>

              {/* Hand-drawn curved SVG Arrow */}
              <svg
                className="w-12 h-12 text-[#2563EB] mt-1 -rotate-15 self-center opacity-80"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6 C 24 12, 28 24, 20 34" />
                <path d="M14 28 L 20 34 L 26 26" />
              </svg>

              {/* Floating Discovery Nodes */}
              <div className="flex flex-col gap-2 mt-2 items-end">
                {floatingBadges.map((badge, idx) => (
                  <motion.span
                    key={badge.label}
                    animate={{
                      y: [0, -5, 0],
                      x: [0, idx % 2 === 0 ? 3 : -3, 0],
                    }}
                    transition={{
                      duration: badge.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: badge.delay,
                    }}
                    className="px-3 py-1 rounded-full bg-white/85 border border-[#DCE7F6] text-[#475569] text-[11px] font-semibold shadow-2xs backdrop-blur-xs"
                  >
                    {badge.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Mission & Vision Interactive Cards ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-9 shadow-[0_4px_24px_rgba(30,60,120,0.04)] hover:shadow-[0_12px_36px_rgba(30,60,120,0.08)] hover:border-[#BFDBFE] transition-all overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-100/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-2xs mb-6 group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
              Guiding North Star
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#07133D]">Our Mission</h2>
            <p className="text-xs sm:text-sm text-[#556987] leading-relaxed mt-3">
              To dismantle the barriers separating people from scientific knowledge. We transform dense, siloed research papers into interconnected, lucid narratives so that anyone who seeks to understand can learn, question, and advance human knowledge.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-9 shadow-[0_4px_24px_rgba(30,60,120,0.04)] hover:shadow-[0_12px_36px_rgba(30,60,120,0.08)] hover:border-[#BFDBFE] transition-all overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-100/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10B981] shadow-2xs mb-6 group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] block mb-1">
              The Long Horizon
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#07133D]">Our Vision</h2>
            <p className="text-xs sm:text-sm text-[#556987] leading-relaxed mt-3">
              A world where discovering answers feels inspiring rather than exhausting. Where interdisciplinary breakthroughs happen naturally, and where students, researchers, and creators are equipped with an AI companion that elevates human creativity.
            </p>
          </motion.div>
        </div>

        {/* ── Interactive Feature 1: "The Arc of Discovery" ─────── */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#556987] uppercase block mb-1">
              How Wonder Becomes Knowledge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              The Arc of Discovery
            </h2>
            <p className="text-xs sm:text-sm text-[#556987] mt-1.5 leading-relaxed">
              Explore how ResearchAI guides you through each phase of intellectual exploration.
            </p>
          </div>

          {/* Interactive Stepper Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {discoverySteps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`relative p-4 rounded-2xl text-left border transition-all cursor-pointer backdrop-blur-sm ${
                    isActive
                      ? "bg-white border-[#2563EB] shadow-sm ring-1 ring-[#2563EB]/20"
                      : "bg-white/70 border-[#DCE7F6] hover:bg-white hover:border-[#BFDBFE]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-[#2563EB]" : "text-[#64748B]"}`}>
                      {s.step}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? s.color : "text-slate-400"}`} />
                  </div>
                  <h3 className={`text-sm font-bold truncate ${isActive ? "text-[#07133D]" : "text-[#475569]"}`}>
                    {s.title}
                  </h3>
                  {isActive && (
                    <motion.div
                      layoutId="active-step-bar"
                      className="absolute bottom-0 left-3 right-3 h-1 bg-[#2563EB] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Step Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-9 shadow-xs relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#475569] text-xs font-bold mb-3">
                    <span>{currentStep.step}</span>
                    <span>•</span>
                    <span className="text-[#2563EB]">{currentStep.subtitle}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#07133D] mb-3">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
                    {currentStep.desc}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#EDF2F9] rounded-2xl p-5 max-w-sm shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#2563EB]" /> ResearchAI Capability
                  </span>
                  <p className="text-xs text-[#334155] font-medium leading-relaxed">
                    {currentStep.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Interactive Feature 2: "Curiosity in Action" (Live Inquiries) ── */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#556987] uppercase block mb-1">
              Interactive Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              Curiosity in Action
            </h2>
            <p className="text-xs sm:text-sm text-[#556987] mt-1.5 leading-relaxed">
              Click on a real scientific inquiry to see how complex questions are synthesized into clarity.
            </p>
          </div>

          {/* Inquiry Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {sampleInquiries.map((inq, idx) => {
              const isActive = activeInquiry === idx;
              return (
                <button
                  key={inq.id}
                  onClick={() => setActiveInquiry(idx)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-xs font-bold"
                      : "bg-white/80 border border-[#DCE7F6] text-[#556987] hover:text-[#07133D] hover:bg-white"
                  }`}
                >
                  {inq.category}
                </button>
              );
            })}
          </div>

          {/* Interactive Inquiry Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentInquiry.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-9 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-bold uppercase tracking-wider">
                  {currentInquiry.category}
                </span>
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#07133D] mb-5 leading-snug">
                &ldquo;{currentInquiry.question}&rdquo;
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#EDF2F9]">
                  <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Scientific Consensus
                  </span>
                  <p className="text-xs text-[#334155] leading-relaxed font-medium">
                    {currentInquiry.consensus}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Open Frontier & Research Gap
                  </span>
                  <p className="text-xs text-[#334155] leading-relaxed font-medium">
                    {currentInquiry.frontier}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#F0F4FA]">
                <span className="text-[11px] text-[#64748B] font-semibold mr-1">Interdisciplinary Bridges:</span>
                {currentInquiry.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl bg-slate-100 text-[#475569] text-[10px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Interactive Feature 3: Persona Switcher ───────────── */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#556987] uppercase block mb-1">
              Who We Serve
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              Built for Every Kind of Thinker
            </h2>
            <p className="text-xs sm:text-sm text-[#556987] mt-1.5 leading-relaxed">
              Select your perspective to see how ResearchAI supports your research journey.
            </p>
          </div>

          {/* Persona Selector Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
            {personas.map((p, idx) => {
              const Icon = p.icon;
              const isActive = selectedPersona === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-sm font-bold scale-[1.02]"
                      : "bg-white/85 border border-[#DCE7F6] text-[#556987] hover:text-[#07133D] hover:bg-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Persona Card with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPersona.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-[#DCE7F6] p-7 sm:p-10 shadow-xs relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#F0F4FA]">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xs ${currentPersona.bg}`}>
                    <currentPersona.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#556987] text-[10px] font-bold uppercase tracking-wider">
                      {currentPersona.badge}
                    </span>
                    <h3 className="text-xl font-bold text-[#07133D] mt-1">
                      {currentPersona.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm italic text-[#2563EB] max-w-md font-medium">
                  &ldquo;{currentPersona.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentPersona.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8FAFC]/80 border border-[#EDF2F9]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#334155] leading-relaxed font-medium">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Interactive Comparison: Traditional Reading vs The ResearchAI Way ── */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#556987] uppercase block mb-1">
              A New Era of Scholarship
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              A Better Way to Understand
            </h2>
            <p className="text-xs sm:text-sm text-[#556987] mt-1.5 leading-relaxed">
              See how your research experience transforms when papers are synthesized intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Traditional Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200 p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#64748B] text-xs font-semibold mb-4">
                  <span>Traditional Research</span>
                </div>
                <h3 className="text-lg font-bold text-[#334155] mb-4">
                  Overwhelming, Siloed & Fragmented
                </h3>
                <ul className="space-y-3.5 text-xs text-[#64748B]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Drowning in monolithic PDF walls with repetitive introductory literature reviews</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Endless browser tabs and disjointed bookmarks scattered across multiple devices</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Difficult to spot contradictions and consensus across related authors</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Manual footnote citation tracking and formatting headaches</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ResearchAI Card */}
            <div className="bg-gradient-to-b from-white/95 to-[#EEF4FD]/80 backdrop-blur-xl rounded-3xl border border-[#BFDBFE] p-7 sm:p-8 shadow-[0_8px_32px_rgba(37,99,235,0.08)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF4FD] text-[#2563EB] text-xs font-bold mb-4 border border-[#BFDBFE]">
                  <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>The ResearchAI Way</span>
                </div>
                <h3 className="text-lg font-bold text-[#07133D] mb-4">
                  Connected, Intuitive & Actionable
                </h3>
                <ul className="space-y-3.5 text-xs text-[#07133D] font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>Instant synthesis of core questions, datasets, and methodologies</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>Living knowledge library that connects papers, topics, and your personal notes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>Surfaces hidden research gaps and suggestions for your next project</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>One-click export in BibTeX, Markdown, and PDF formats with anchored citations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: What Guides Us (Core Principles) ─────────── */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-9">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#556987] uppercase block mb-1">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              What Guides Our Work
            </h2>
            <p className="text-xs sm:text-sm text-[#556987] mt-1.5 leading-relaxed">
              Our foundations are built on scientific truth, user trust, and intellectual empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + idx * 0.06, duration: 0.35 }}
                  whileHover={{ y: -4 }}
                  className={`bg-white/85 backdrop-blur-xl rounded-2xl border border-[#DCE7F6] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${p.gradient}`}
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${p.bg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block mb-0.5">
                      {p.subtitle}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#07133D] leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#556987] leading-relaxed mt-2.5 font-normal">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Interactive Quotes of Wonder Carousel ─────────────── */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative bg-white/90 backdrop-blur-xl border border-[#DCE7F6] rounded-3xl p-8 sm:p-12 shadow-xs overflow-hidden text-center"
          >
            {/* Background alpine mist */}
            <div className="absolute inset-0 opacity-[0.16] pointer-events-none select-none">
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
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.75) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <Quote className="w-9 h-9 text-[#2563EB] mx-auto rotate-180 fill-[#2563EB]/15" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-base sm:text-xl md:text-[22px] font-medium text-[#07133D] italic leading-relaxed">
                    &ldquo;{inspirationalQuotes[quoteIdx].quote}&rdquo;
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#07133D] mt-3">
                    — {inspirationalQuotes[quoteIdx].author}
                  </p>
                  <p className="text-[11px] text-[#64748B] font-medium">
                    {inspirationalQuotes[quoteIdx].role}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Quote pagination dots */}
              <div className="flex items-center justify-center gap-2 pt-3">
                {inspirationalQuotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQuoteIdx(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      quoteIdx === i ? "w-6 bg-[#2563EB]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`View quote ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Callout Banner ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-3xl bg-gradient-to-r from-[#EEF4FD] via-[#F4F8FE] to-[#EEF4FD] border border-[#DCE7F6] p-8 sm:p-11 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs text-center sm:text-left relative overflow-hidden"
        >
          <div className="relative z-10">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#2563EB] uppercase block mb-1">
              Begin Your Journey
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-[#07133D] tracking-tight">
              Ready to turn curiosity into contribution?
            </h3>
            <p className="text-xs sm:text-sm text-[#556987] mt-2 max-w-lg leading-relaxed">
              Ask your first question, explore curated fields, and start building your personal library of knowledge today.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onStartResearch}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Researching</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onExploreTopics}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-[#DCE7F6] text-[#07133D] text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Topics</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
