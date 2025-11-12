import { useEffect, useState } from "react";

interface OutputLine {
  text: string;
  delay: number;
}

interface TerminalOutputProps {
  outputLines: OutputLine[]
  onComplete: () => void;
}

export const TerminalOutput = ({ onComplete,outputLines }: TerminalOutputProps) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);


  useEffect(() => {
    // console.log(outputLines)
    outputLines.forEach((line, index) => {
      setTimeout(() => {
        if (!visibleLines.includes(line.text)) {
          setVisibleLines((prev) => [...prev, line.text]);
        }

        if (index === outputLines.length - 1) {
          setTimeout(onComplete, 1000);
        }
      }, line.delay);
    });
  }, []);

  return (
    <div className="bg-card border-2 border-primary rounded-md p-6 font-mono text-sm space-y-2 scanline">
      {visibleLines.map((line, index) => (
        <div
          key={index}
          className="text-terminal-text animate-fade-in flex items-center gap-2"
        >
          <span className="text-primary terminal-glow-text">$</span>
          <span>
            {line}
          </span>
          {index === visibleLines.length - 1 && (
            <span className="animate-cursor-blink text-primary">|</span>
          )}
        </div>
      ))}
    </div>
  );
};
