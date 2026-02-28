import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Size map ─────────────────────────────────────────────────────────────────

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
  xl: "h-14 w-14 text-base",
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AvatarCircleProps {
  initials: string;
  color?: string;
  size?: AvatarSize;
  className?: string;
  title?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AvatarCircle({
  initials,
  color = "#1E3A5F",
  size = "md",
  className,
  title,
}: AvatarCircleProps) {
  // Ensure we never show more than 2 characters
  const displayInitials = initials.slice(0, 2).toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white leading-none select-none",
        SIZE_CLASSES[size],
        className
      )}
      style={{ backgroundColor: color }}
      title={title}
      aria-label={title ?? `Avatar for ${displayInitials}`}
    >
      {displayInitials}
    </span>
  );
}

// ─── Avatar group (stacked avatars) ──────────────────────────────────────────

export interface AvatarGroupItem {
  initials: string;
  color?: string;
  title?: string;
}

export interface AvatarGroupProps {
  avatars: AvatarGroupItem[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = "sm",
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((avatar, idx) => (
        <span
          key={idx}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white leading-none select-none",
            "ring-2 ring-white",
            SIZE_CLASSES[size],
            idx > 0 && "-ml-2"
          )}
          style={{ backgroundColor: avatar.color ?? "#1E3A5F" }}
          title={avatar.title}
        >
          {avatar.initials.slice(0, 2).toUpperCase()}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full font-semibold leading-none select-none",
            "ring-2 ring-white bg-slate-200 text-slate-600",
            SIZE_CLASSES[size],
            "-ml-2"
          )}
          title={`${overflow} more`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
