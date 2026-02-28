"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { AvatarCircle } from "@/components/shared/avatar-circle";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineItemType =
  | "created"
  | "updated"
  | "status_change"
  | "comment"
  | "approval"
  | "completed";

export interface TimelineItem {
  id: string;
  actor: string;
  actorInitials?: string;
  actorColor?: string;
  action: string;
  timestamp: string;
  details?: string;
  type?: TimelineItemType;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

// ─── Dot config ───────────────────────────────────────────────────────────────

interface DotConfig {
  ringColor: string;
  dotColor: string;
}

const TYPE_DOT_CONFIG: Record<TimelineItemType, DotConfig> = {
  created: {
    ringColor: "ring-slate-300",
    dotColor: "bg-slate-400",
  },
  updated: {
    ringColor: "ring-blue-300",
    dotColor: "bg-blue-500",
  },
  status_change: {
    ringColor: "ring-violet-300",
    dotColor: "bg-violet-500",
  },
  comment: {
    ringColor: "ring-slate-300",
    dotColor: "bg-slate-400",
  },
  approval: {
    ringColor: "ring-amber-300",
    dotColor: "bg-amber-500",
  },
  completed: {
    ringColor: "ring-emerald-300",
    dotColor: "bg-emerald-500",
  },
};

const DEFAULT_DOT_CONFIG: DotConfig = {
  ringColor: "ring-slate-300",
  dotColor: "bg-slate-400",
};

// ─── Actor color palette (deterministic from initials) ────────────────────────

const AVATAR_COLORS = [
  "#1E3A5F",
  "#0891B2",
  "#7C3AED",
  "#059669",
  "#EA580C",
  "#E11D48",
  "#D97706",
  "#2563EB",
];

function deriveAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Relative time helper ─────────────────────────────────────────────────────

function relativeTime(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
    return timestamp;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Timeline({ items, className }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-slate-400 text-sm",
          className
        )}
      >
        No timeline events yet.
      </div>
    );
  }

  return (
    <ol className={cn("relative", className)} aria-label="Activity timeline">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const dotConfig = TYPE_DOT_CONFIG[item.type ?? "updated"] ?? DEFAULT_DOT_CONFIG;
        const initials = item.actorInitials ?? deriveInitials(item.actor);
        const avatarColor = item.actorColor ?? deriveAvatarColor(item.actor);

        return (
          <li key={item.id} className="relative flex gap-4">
            {/* Vertical connector line */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={cn(
                  "relative z-10 mt-1 flex shrink-0 items-center justify-center",
                  "h-3 w-3 rounded-full ring-2 ring-offset-2 ring-offset-white",
                  dotConfig.ringColor,
                  dotConfig.dotColor
                )}
                aria-hidden="true"
              />
              {/* Connector below the dot (hidden for last item) */}
              {!isLast && (
                <div className="mt-1 w-px flex-1 bg-slate-200 min-h-[1.5rem]" />
              )}
            </div>

            {/* Event body */}
            <div
              className={cn(
                "flex-1 pb-6",
                isLast && "pb-0"
              )}
            >
              <div className="flex items-start gap-2.5">
                {/* Actor avatar */}
                <AvatarCircle
                  initials={initials}
                  color={avatarColor}
                  size="xs"
                  title={item.actor}
                  className="mt-0.5 shrink-0"
                />

                {/* Action + meta */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800 leading-snug">
                    <span className="font-semibold text-slate-900">
                      {item.actor}
                    </span>{" "}
                    {item.action}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {relativeTime(item.timestamp)}
                  </p>
                  {item.details && (
                    <p className="mt-1.5 text-xs text-slate-500 bg-slate-50 rounded-md px-3 py-2 border border-slate-100 leading-relaxed">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
