"use client";

import { useRef, useCallback } from "react";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fadeScale } from "@/lib/animations";

interface HeroSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function HeroSearch({ value, onChange, onSubmit }: HeroSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSubmit();
    },
    [onSubmit]
  );

  return (
    <motion.div
      className="w-full max-w-[740px] mx-auto"
      variants={fadeScale}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.25 }}
    >
      <div
        className="group flex items-center gap-4 w-full pl-6 sm:pl-8 pr-2.5 sm:pr-3 py-2.5 sm:py-3 rounded-full transition-all duration-300 hover:shadow-[0_18px_50px_-6px_rgba(40,80,160,0.18)] focus-within:shadow-[0_18px_50px_-6px_rgba(40,80,160,0.2),0_0_0_2px_rgba(46,104,248,0.25)] cursor-text min-h-[64px] sm:min-h-[72px]"
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(255, 255, 255, 0.95)",
          boxShadow:
            "0 14px 40px -8px rgba(35, 70, 140, 0.12), 0 2px 6px rgba(0, 0, 0, 0.02)",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <Search
          className="w-5 sm:w-6 h-5 sm:h-6 shrink-0 text-[#07133D]"
          strokeWidth={2.4}
          aria-hidden="true"
        />

        <label htmlFor="research-search" className="sr-only">
          Search research questions
        </label>
        <input
          ref={inputRef}
          id="research-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... e.g. AI-based crop disease detection"
          className="flex-1 bg-transparent outline-none focus:outline-none focus:ring-0 border-none text-[#07133D] text-[15px] sm:text-[17px] placeholder:text-[#8E9FB8] font-normal min-w-0"
          autoComplete="off"
          spellCheck="false"
        />

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onSubmit();
          }}
          className="shrink-0 w-11 sm:w-[50px] h-11 sm:h-[50px] rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #3870FF 0%, #255EEC 100%)",
            boxShadow: "0 4px 16px rgba(46, 104, 248, 0.4)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Submit search"
        >
          <motion.span
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={2.4} />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
