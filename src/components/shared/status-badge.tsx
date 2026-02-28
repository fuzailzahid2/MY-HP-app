import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Status config ────────────────────────────────────────────────────────────

type StatusKey =
  | "in_progress"
  | "completed"
  | "pending"
  | "pending_ack"
  | "acknowledged"
  | "submitted"
  | "approved"
  | "rejected"
  | "in_review"
  | "under_review"
  | "open"
  | "closed"
  | "draft"
  | "cancelled"
  | "on_hold"
  | "overdue"
  | "active"
  | "inactive"
  | "initiated"
  | "risk_assessment"
  | "implementing"
  | "verification"
  | "verifying"
  | "action_planning"
  | "rca_in_progress"
  | "effectiveness_review"
  | "planned"
  | "started"
  | "accepted";

interface StatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
}

const STATUS_CONFIG: Record<StatusKey, StatusConfig> = {
  in_progress: {
    label: "In Progress",
    color: "var(--status-in-progress)",
    backgroundColor: "var(--status-in-progress-bg)",
  },
  completed: {
    label: "Completed",
    color: "var(--status-completed)",
    backgroundColor: "var(--status-completed-bg)",
  },
  pending: {
    label: "Pending",
    color: "var(--status-pending)",
    backgroundColor: "var(--status-pending-bg)",
  },
  submitted: {
    label: "Submitted",
    color: "var(--status-submitted)",
    backgroundColor: "var(--status-submitted-bg)",
  },
  approved: {
    label: "Approved",
    color: "var(--status-approved)",
    backgroundColor: "var(--status-approved-bg)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--status-rejected)",
    backgroundColor: "var(--status-rejected-bg)",
  },
  open: {
    label: "Open",
    color: "#0891B2",
    backgroundColor: "#ECFEFF",
  },
  closed: {
    label: "Closed",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
  },
  draft: {
    label: "Draft",
    color: "#9CA3AF",
    backgroundColor: "#F9FAFB",
  },
  cancelled: {
    label: "Cancelled",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  on_hold: {
    label: "On Hold",
    color: "#D97706",
    backgroundColor: "#FFFBEB",
  },
  overdue: {
    label: "Overdue",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  active: {
    label: "Active",
    color: "#059669",
    backgroundColor: "#ECFDF5",
  },
  inactive: {
    label: "Inactive",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
  },
  pending_ack: {
    label: "Pending Ack",
    color: "#0891B2",
    backgroundColor: "#ECFEFF",
  },
  acknowledged: {
    label: "Acknowledged",
    color: "#0D9488",
    backgroundColor: "#F0FDFA",
  },
  in_review: {
    label: "In Review",
    color: "#0891B2",
    backgroundColor: "#ECFEFF",
  },
  under_review: {
    label: "Under Review",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  initiated: {
    label: "Initiated",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
  },
  risk_assessment: {
    label: "Risk Assessment",
    color: "#EA580C",
    backgroundColor: "#FFF7ED",
  },
  implementing: {
    label: "Implementing",
    color: "#7C3AED",
    backgroundColor: "#F3E8FF",
  },
  verification: {
    label: "Verification",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  verifying: {
    label: "Verifying",
    color: "#0891B2",
    backgroundColor: "#ECFEFF",
  },
  action_planning: {
    label: "Action Planning",
    color: "#EA580C",
    backgroundColor: "#FFF7ED",
  },
  rca_in_progress: {
    label: "RCA In Progress",
    color: "#E11D48",
    backgroundColor: "#FFF1F2",
  },
  effectiveness_review: {
    label: "Effectiveness Review",
    color: "#D97706",
    backgroundColor: "#FFFBEB",
  },
  planned: {
    label: "Planned",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
  },
  started: {
    label: "Started",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  accepted: {
    label: "Accepted",
    color: "#059669",
    backgroundColor: "#ECFDF5",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
  status: StatusKey | string;
  className?: string;
  size?: "sm" | "md";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusBadge({
  status,
  className,
  size = "md",
}: StatusBadgeProps) {
  const normalizedKey = status
    .toLowerCase()
    .replace(/\s+/g, "_") as StatusKey;

  const config = STATUS_CONFIG[normalizedKey] ?? {
    label: status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    color: "#64748B",
    backgroundColor: "#F1F5F9",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
      style={{
        color: config.color,
        backgroundColor: config.backgroundColor,
      }}
    >
      {config.label}
    </span>
  );
}
