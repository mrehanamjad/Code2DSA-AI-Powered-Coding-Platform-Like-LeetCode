import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsCardProps {
  label: string;
  value: string;
  description?: string;
  onEdit?: () => void;
  isPassword?: boolean;
  editable?: boolean;
}

export function SettingsCard({ label, value, description, onEdit, isPassword, editable = true }: SettingsCardProps) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-settings-card-hover sm:p-5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-base font-medium text-foreground">
          {isPassword ? "••••••••" : (value || "Not set")}
        </p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {editable && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="ml-4 h-9 gap-2 px-3 text-muted-foreground opacity- transition-all group-hover:opacity-100 hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      )}
    </div>
  );
}
