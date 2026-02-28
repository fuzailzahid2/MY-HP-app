import * as React from "react";
import { Flame, Clock, ArrowUp, Minus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types/index";

export type { Priority };

interface PriorityConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  critical: {
    label: "Critical",
    color: "var(--priority-critical)",
    icon: Flame,
  },
  urgent: {
    label: "Urgent",
    color: "var(--priority-urgent)",
    icon: Clock,
  },
  high: {
    label: "High",
    color: "var(--priority-high)",
    icon: ArrowUp,
  },
  routine: {
    label: "Routine",
    color: "var(--priority-routine)",
    icon: Minus,
  },
  planned: {
    label: "Planned",
    color: "var(--priority-planned)",
    icon: Calendar,
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PriorityIndicatorProps {
  priority: Priority | string;
  showLabel?: boolean;
  iconOnly?: boolean;
  className?: string;
  size?: "sm" | "md";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PriorityIndicator({
  priority,
  showLabel = true,
  iconOnly = false,
  className,
  size = "md",
}: PriorityIndicatorProps) {
  const normalizedKey = priority.toLowerCase() as Priority;
  const config = PRIORITY_CONFIG[normalizedKey] ?? {
    label: priority.replace(/\b\w/g, (c) => c.toUpperCase()),
    color: "#64748B",
    icon: Minus,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
      style={{ color: config.color }}
    >
      <Icon
        className={cn(
          "shrink-0",
          size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"
        )}
      />
      {!iconOnly && showLabel && (
        <span>{config.label}</span>
      )}
    </span>
  );
}
