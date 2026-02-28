import * as React from "react";
import { cn } from "@/lib/utils";
import type { SlaStatus as BaseSlaStatus } from "@/lib/types/index";

// ─── SLA config ───────────────────────────────────────────────────────────────

// Extend the base type with additional UI-only states
export type SlaStatus = BaseSlaStatus | "breached" | "paused";

interface SlaConfig {
  label: string;
  dotColor: string;
  textColor: string;
}

const SLA_CONFIG: Record<SlaStatus, SlaConfig> = {
  on_track: {
    label: "On Track",
    dotColor: "#10B981",
    textColor: "#059669",
  },
  at_risk: {
    label: "At Risk",
    dotColor: "#F59E0B",
    textColor: "#D97706",
  },
  overdue: {
    label: "Overdue",
    dotColor: "#EF4444",
    textColor: "#DC2626",
  },
  breached: {
    label: "Breached",
    dotColor: "#EF4444",
    textColor: "#DC2626",
  },
  paused: {
    label: "Paused",
    dotColor: "#94A3B8",
    textColor: "#64748B",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SlaIndicatorProps {
  status: SlaStatus | string;
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SlaIndicator({
  status,
  showLabel = true,
  className,
  size = "md",
}: SlaIndicatorProps) {
  const normalizedKey = status.toLowerCase() as SlaStatus;
  const config = SLA_CONFIG[normalizedKey] ?? {
    label: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    dotColor: "#94A3B8",
    textColor: "#64748B",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
      style={{ color: config.textColor }}
    >
      {/* Pulsing dot for at-risk, solid for others */}
      <span className="relative flex shrink-0">
        {status === "at_risk" ? (
          <>
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ backgroundColor: config.dotColor }}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full",
                size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
              )}
              style={{ backgroundColor: config.dotColor }}
            />
          </>
        ) : (
          <span
            className={cn(
              "inline-flex rounded-full",
              size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
            )}
            style={{ backgroundColor: config.dotColor }}
          />
        )}
      </span>
      {showLabel && <span className="font-medium">{config.label}</span>}
    </span>
  );
}
