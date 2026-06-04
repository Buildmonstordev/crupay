"use client";

import { useRef } from "react";
import { motion } from "motion/react";

interface SolAmountInputProps {
  value: string;
  onChange: (val: string) => void;
  solPrice?: number;
}

export function SolAmountInput({ value, onChange, solPrice = 150 }: SolAmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inrValue = value ? (parseFloat(value) * solPrice).toFixed(0) : "0";

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-text bg-card border border-border p-8 transition-all hover:border-primary/50 shadow-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="bg-muted text-muted-foreground px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px] font-bold font-mono">
          Amount to Send
        </div>

        <div className="flex items-baseline justify-center w-full relative">
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
            }}
            className="bg-transparent text-center font-display text-7xl font-bold tracking-tighter outline-none w-48 sm:w-64 placeholder:text-muted-foreground/30 text-foreground caret-primary"
          />
          <span className="font-display text-2xl font-semibold text-primary ml-2">SOL</span>
        </div>

        <motion.div
          key={inrValue}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 bg-surface-1 border border-border rounded-xl px-6 py-3 w-full mt-2"
        >
          <span className="text-lg font-bold text-foreground font-mono">≈ ₹{Number(inrValue).toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted-foreground font-mono font-medium ml-2">
            @ ₹{solPrice}/SOL
          </span>
        </motion.div>
      </div>
    </div>
  );
}