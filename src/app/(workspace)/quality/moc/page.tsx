"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { Button } from "@/components/ui/button";
import { MOC_RECORDS, MocRecord, MocType } from "@/lib/dummy-data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MocTypePill({ type }: { type: MocType }) {
  const CONFIG: Record<MocType, { label: string; color: string; bg: string }> = {
    permanent: { label: "Permanent", color: "#1D4ED8", bg: "#EFF6FF" },
    temporary: { label: "Temporary", color: "#EA580C", bg: "#FFF7ED" },
    emergency: { label: "Emergency", color: "#DC2626", bg: "#FEF2F2" },
  };
  const { label, color, bg } = CONFIG[type] ?? { label: type, color: "#64748B", bg: "#F1F5F9" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function formatDate(dateStr: string): string {
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

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS: Column<MocRecord>[] = [
  {
    key: "id",
    header: "Number",
    sortable: true,
    width: "148px",
    render: (value: string) => (
      <Link
        href={`/quality/moc/${value}`}
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
    key: "type",
    header: "Type",
    sortable: true,
    width: "120px",
    render: (value: MocType) => <MocTypePill type={value} />,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "148px",
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
    key: "rigName",
    header: "Location",
    sortable: true,
    width: "120px",
    render: (value: string | null) => (
      <span className="text-sm text-slate-600">{value ?? "HQ / All"}</span>
    ),
  },
  {
    key: "initiatedByName",
    header: "Requested By",
    sortable: true,
    width: "150px",
    render: (value: string) => <span className="text-sm text-slate-700">{value}</span>,
  },
  {
    key: "reviewDeadline",
    header: "Target Date",
    sortable: true,
    width: "110px",
    render: (value: string) => (
      <span className="text-xs text-slate-600">{formatDate(value)}</span>
    ),
  },
  {
    key: "_actions",
    header: "Actions",
    width: "80px",
    render: (_: unknown, row: MocRecord) => (
      <Link href={`/quality/moc/${row.id}`} onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="View">
          <Eye className="size-3.5" />
        </Button>
      </Link>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MocListPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Management of Change (MOC)</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review and track all change requests across operations
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">MOC Records</h2>
        </div>
        <div className="p-5">
          <DataTable<MocRecord>
            data={MOC_RECORDS}
            columns={COLUMNS}
            searchPlaceholder="Search MOCs..."
            searchKeys={["id", "title", "initiatedByName", "rigName", "department"]}
            filters={[
              {
                key: "type",
                label: "Type",
                options: [
                  { label: "Permanent", value: "permanent" },
                  { label: "Temporary", value: "temporary" },
                  { label: "Emergency", value: "emergency" },
                ],
              },
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Initiated", value: "initiated" },
                  { label: "Under Review", value: "under_review" },
                  { label: "Risk Assessment", value: "risk_assessment" },
                  { label: "Approved", value: "approved" },
                  { label: "Implementing", value: "implementing" },
                  { label: "Verification", value: "verification" },
                  { label: "Closed", value: "closed" },
                  { label: "Rejected", value: "rejected" },
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
                  { label: "Planned", value: "planned" },
                ],
              },
            ]}
            onRowClick={(row) => router.push(`/quality/moc/${row.id}`)}
            itemLabel="MOCs"
            pageSize={10}
            emptyMessage="No MOC records found."
          />
        </div>
      </div>
    </div>
  );
}
