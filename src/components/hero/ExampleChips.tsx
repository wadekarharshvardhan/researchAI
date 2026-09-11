"use client";

import { motion } from "motion/react";

const examples = ["AI in healthcare", "Climate change", "Crop disease detection"];

interface ExampleChipsProps {
  onSelect: (text: string) => void;
}

export default function ExampleChips({ onSelect }: ExampleChipsProps) {
  return (
    <motion.div
      className="flex flex-wrap items-center justify-center gap-3 mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
    >
      <span className="text-sm sm:text-[15px] text-[#667C9D] font-normal mr-1">
        Try example:
      </span>
      {examples.map((example) => (
        <motion.button
          key={example}
          type="button"
          onClick={() => onSelect(example)}
          className="px-4 sm:px-5 py-2 rounded-full text-sm sm:text-[14px] font-normal text-[#465E87] hover:text-[#2262FF] transition-all duration-200 cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.88)",
            boxShadow: "0 2px 10px rgba(35, 70, 140, 0.05)",
          }}
          whileHover={{
            scale: 1.04,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            boxShadow: "0 4px 16px rgba(35, 70, 140, 0.09)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          {example}
        </motion.button>
      ))}
    </motion.div>
  );
}
