import { Badge } from "@/components/ui/badge";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const variants = {
    Easy: "bg-green-500/50",
    Medium: "bg-yellow-500/50",
    Hard: "bg-red-500/50",
  };

  return (
    <Badge variant="secondary" className={`${variants[difficulty]} border-0 font-medium`}>
      {difficulty}
    </Badge>
  );
};

export default DifficultyBadge;
