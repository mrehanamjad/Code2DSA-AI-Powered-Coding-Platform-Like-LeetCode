import { cn } from "@/lib/utils";

interface TopicBadgeProps {
  topic: string;
  className?: string;
  onRemove?: () => void;
}

export function TopicBadge({ topic, className, onRemove }: TopicBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground",
        className
      )}
    >
      {topic}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-muted p-0.5"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4 4l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}