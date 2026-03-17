"use client"
import { useState } from "react";

interface TerminalInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TerminalInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: TerminalInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4 animate-fade-in">
      <label className="flex items-center gap-2 mb-2">
        <span className="text-primary terminal-glow-text font-bold">&gt;</span>
        <span className="text-terminal-text text-sm">{label}</span>
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-card border-2 rounded-md font-mono text-terminal-text placeholder:text-muted-foreground transition-all duration-300 focus:outline-none ${
            isFocused
              ? "border-primary terminal-glow"
              : "border-terminal-border"
          }`}
        />
        {isFocused && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-cursor-blink">
            |
          </span>
        )}
      </div>
    </div>
  );
};
