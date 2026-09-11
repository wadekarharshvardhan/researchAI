"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import HeroSearch from "@/components/hero/HeroSearch";
import ExampleChips from "@/components/hero/ExampleChips";
import FloatingDoodles from "@/components/hero/FloatingDoodles";
import { fadeUp, staggerContainer } from "@/lib/animations";

const rotatingPhrases = [
  "Real Insights",
  "Clear Answers",
  "Key Findings",
  "Breakthroughs",
  "Real Impact",
];

export default function Hero({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    // Fire parent callback (opens auth modal) instead of navigating
    onSearch?.(query.trim());
  }, [query, onSearch]);

  const handleChipSelect = useCallback((text: string) => {
    setQuery(text);
    // Immediately trigger search when a chip is clicked
    onSearch?.(text);
  }, [onSearch]);

  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 sm:pb-20 select-none"
      aria-label="Hero section"
    >
      {/* ── Background Landscape ──────────────────────────────── */}
      <HeroBackground />

      {/* ── Floating Doodles & Handwritten Accents ────────────── */}
      <FloatingDoodles />

      {/* ── Hero Center Content (Big & In Middle) ─────────────── */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl mx-auto my-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          className="text-xs sm:text-[13px] font-semibold tracking-[0.3em] uppercase mb-4 sm:mb-5 text-[#4A6289]"
          variants={fadeUp}
        >
          Your AI Research Partner
        </motion.p>

        {/* Big Bold Headline */}
        <motion.h1
          className="text-[2.25rem] xs:text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-extrabold leading-[1.12] sm:leading-[1.08] tracking-[-0.03em] text-[#07133D] mb-5 sm:mb-6 max-w-5xl"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
        >
          <span>Turn Research Questions</span>
          <br className="hidden sm:inline" />
          <span className="flex flex-col sm:inline-flex sm:flex-row items-center justify-center gap-y-1 sm:gap-x-3.5 mt-1 sm:mt-1">
            <span className="select-none shrink-0 text-center">into</span>
            <span className="inline-grid text-center sm:text-left align-bottom overflow-hidden relative pb-1">
              {/* Invisible ghost elements locking the exact max width and height permanently */}
              {rotatingPhrases.map((phrase) => (
                <span
                  key={phrase}
                  className="invisible pointer-events-none select-none col-start-1 row-start-1 whitespace-nowrap text-center sm:text-left"
                  aria-hidden="true"
                >
                  {phrase}
                </span>
              ))}

              {/* Active animated phrase rotating in place */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={phraseIndex}
                  initial={{ y: 36, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -36, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                  className="col-start-1 row-start-1 inline-block bg-gradient-to-r from-[#205DF8] via-[#3275FF] to-[#3B86FF] bg-clip-text text-transparent select-none whitespace-nowrap text-center sm:text-left"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {rotatingPhrases[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-xl md:text-[21px] text-[#4E6386] font-normal leading-relaxed mb-9 sm:mb-11 max-w-2xl px-2"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
        >
          Discover papers. Understand methods. Identify gaps.
          <br />
          Build what&apos;s next.
        </motion.p>

        {/* Big Search Bar & Chips */}
        <motion.div
          className="w-full max-w-3xl px-2 sm:px-0"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
        >
          <HeroSearch
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
          />
          <ExampleChips onSelect={handleChipSelect} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Hero Background ─────────────────────────────────────────────── */

function HeroBackground() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Base atmospheric tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #E6EEF9 0%, #EEF4FD 28%, #F2F7FE 50%, #E2EDF9 100%)",
        }}
      />

      {/* Realistic 2.5K Ultra High-Resolution Landscape */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-bg.webp"
          alt="Ethereal snowy mountains background"
          fill
          priority
          unoptimized
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>

      {/* Top gentle atmospheric blend */}
      <div
        className="absolute top-0 left-0 right-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(230, 238, 249, 0.35) 0%, transparent 100%)",
        }}
      />

      {/* Center soft glow behind search & headline */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[850px] h-[580px] rounded-full opacity-45 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, rgba(220,235,255,0.25) 55%, transparent 80%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
