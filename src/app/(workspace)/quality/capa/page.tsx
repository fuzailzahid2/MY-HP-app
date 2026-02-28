"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { Button } from "@/components/ui/button";
import { CAPA_RECORDS, CapaRecord } from "@/lib/dummy-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SourceType = CapaRecord["sourceType"];

function formatSourceType(type: SourceType): { label: string; color: string; bg: string } {
  const MAP: Record<SourceType, { label: string; color: string; bg: string }> = {
    nco: { label: "NCO", color: "#DC2626", bg: "#FEF2F2" },
    audit_finding: { label: "Audit Finding", color: "#7C3AED", bg: "#F3E8FF" },
    incident: { label: "Incident", color: "#EA580C", bg: "#FFF7ED" },
    management_review: { label: "Management Review", color: "#2563EB", bg: "#EFF6FF" },
    customer_feedback: { label: "Customer Complaint", color: "#D97706", bg: "#FFFBEB" },
  };
  return MAP[type] ?? { label: type, color: "#64748B", bg: "#F1F5F9" };
}

function SourceTypePill({ type }: { type: SourceType }) {
  const { label, color, bg } = formatSourceType(type);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isNearDue(dueDate: string): boolean {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 14;
}

function isOverdue(dueDate: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function EffectivenessBadge({ status }: { status: CapaRecord["status"] }) {
  if (status === "closed") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50">
        Effective
      </span>
    );
  }
  if (status === "effectiveness_review") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-amber-700 bg-amber-50">
        Under Review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-500 bg-slate-100">
      Pending
    </span>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS: Column<CapaRecord>[] = [
  {
    key: "id",
    header: "Number",
    sortable: true,
    width: "148px",
    render: (value: string) => (
      <Link
        href={`/quality/capa/${value}`}
        className="text-blue-600 hover:underline font-medium text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {value}
      </Link>
    ),
  },
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (value: string) => (
      <span className="text-sm text-slate-800 line-clamp-2 max-w-xs leading-snug">{value}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "160px",
    render: (value: string) => <StatusBadge status={value} size="sm" />,
  },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    width: "110px",
    render: (value: string) => <PriorityIndicator priority={value} size="sm" />,
  },
  {
    key: "sourceType",
    header: "Source",
    sortable: true,
    width: "150px",
    render: (value: SourceType) => <SourceTypePill type={value} />,
  },
  {
    key: "rootCauseAnalysis",
    header: "Root Cause",
    width: "200px",
    render: (value: string) => (
      <span className="text-xs text-slate-600 line-clamp-2 leading-snug">{value}</span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    width: "90px",
    render: (_: unknown, row: CapaRecord) => {
      const total = row.actions.length;
      const completed = row.actions.filter((a) => a.status === "completed").length;
      return (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
            completed === total && total > 0
              ? "text-emerald-700 bg-emerald-50"
              : completed > 0
              ? "text-blue-700 bg-blue-50"
              : "text-slate-500 bg-slate-100"
          )}
        >
          {completed}/{total}
        </span>
      );
    },
  },
  {
    key: "dueDate",
    header: "Target Date",
    sortable: true,
    width: "120px",
    render: (value: string, row: CapaRecord) => {
      const nearDue = row.status !== "closed" && isNearDue(value);
      const overdue = row.status !== "closed" && isOverdue(value);
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            overdue ? "text-red-600" : nearDue ? "text-amber-600" : "text-slate-600"
          )}
        >
          {(nearDue || overdue) && <AlertTriangle className="size-3 shrink-0" />}
          {formatDate(value)}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Effectiveness",
    width: "120px",
    render: (value: CapaRecord["status"]) => <EffectivenessBadge status={value} />,
  },
  {
    key: "_actions",
    header: "",
    width: "60px",
    render: (_: unknown, row: CapaRecord) => (
      <Link href={`/quality/capa/${row.id}`} onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="View">
          <Eye className="size-3.5" />
        </Button>
      </Link>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CapaListPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Corrective & Preventive Actions (CAPA)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage corrective and preventive action plans across quality records
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">CAPA Records</h2>
        </div>
        <div className="p-5">
          <DataTable<CapaRecord>
            data={CAPA_RECORDS}
            columns={COLUMNS}
            searchPlaceholder="Search CAPAs..."
            searchKeys={["id", "title", "assignedToName", "sourceRecordId", "department"]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Open", value: "open" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Pending Verification", value: "pending_verification" },
                  { label: "Effectiveness Review", value: "effectiveness_review" },
                  { label: "Closed", value: "closed" },
                  { label: "Overdue", value: "overdue" },
                ],
              },
              {
                key: "priority",
                label: "Priority",
                options: [
                  { label: "Critical", value: "critical" },
                  { label: "Urgent", value: "urgent" },
                  { label: "High", value: "high" },
                  { label: "Routine", value: "routine" },
                ],
              },
              {
                key: "sourceType",
                label: "Source Type",
                options: [
                  { label: "NCO", value: "nco" },
                  { label: "Audit Finding", value: "audit_finding" },
                  { label: "Incident", value: "incident" },
                  { label: "Management Review", value: "management_review" },
                  { label: "Customer Complaint", value: "customer_feedback" },
                ],
              },
            ]}
            onRowClick={(row) => router.push(`/quality/capa/${row.id}`)}
            itemLabel="CAPAs"
            pageSize={10}
            emptyMessage="No CAPA records found."
          />
        </div>
      </div>
    </div>
  );
}
