"use client";

import { CheckCircle2, Circle, CircleDot } from "lucide-react";

// Matches the API response types + allows string for flexibility
export type Status = "Solved" | "Attempted" | "Unsolved";

interface StatusIconProps {
  status: Status;
}

const StatusIcon = ({ status }: StatusIconProps) => {
  // Normalize: API returns "Solved", but we map using "solved" keys
  // This handles both "Solved" and "solved"
  const normalizedStatus = (status?.toLowerCase() || "unsolved") as "solved" | "attempted" | "unsolved";

  const icons = {
    solved: <CheckCircle2 className="h-5 w-5 text-green-500" />,     // Was: text-status-solved
    attempted: <CircleDot className="h-5 w-5 text-yellow-500" />,    // Was: text-status-attempted
    unsolved: <Circle className="h-5 w-5 text-gray-400" />,          // Was: text-status-unsolved
  };

  // Return the icon, defaulting to 'unsolved' if the key doesn't match
  return icons[normalizedStatus] || icons.unsolved;
};

export default StatusIcon;