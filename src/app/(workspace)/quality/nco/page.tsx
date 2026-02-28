"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { NCO_RECORDS, NcoRecord, NcoSeverity, NcoType } from "@/lib/dummy-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NcoSeverityPill({ severity }: { severity: NcoSeverity }) {
  const CONFIG: Record<NcoSeverity, { label: string; color: string; bg: string }> = {
    critical: { label: "Critical", color: "#DC2626", bg: "#FEF2F2" },
    major: { label: "Major", color: "#EA580C", bg: "#FFF7ED" },
    minor: { label: "Minor", color: "#059669", bg: "#ECFDF5" },
    observation: { label: "Observation", color: "#2563EB", bg: "#EFF6FF" },
  };
  const { label, color, bg } = CONFIG[severity] ?? { label: severity, color: "#64748B", bg: "#F1F5F9" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function formatNcoType(type: NcoType): string {
  const MAP: Record<NcoType, string> = {
    equipment_failure: "Equipment Failure",
    procedure_deviation: "Procedure Deviation",
    material_defect: "Material Defect",
    documentation: "Documentation",
    personnel_competency: "Personnel Competency",
    environmental: "Environmental",
    safety_observation: "Safety Observation",
  };
  return MAP[type] ?? type;
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

function isOverdue(dueDate: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS: Column<NcoRecord>[] = [
  {
    key: "id",
    header: "Number",
    sortable: true,
    width: "148px",
    render: (value: string) => (
      <Link
        href={`/quality/nco/${value}`}
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
    key: "severity",
    header: "Severity",
    sortable: true,
    width: "120px",
    render: (value: NcoSeverity) => <NcoSeverityPill severity={value} />,
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    width: "160px",
    render: (value: NcoType) => (
      <span className="text-xs text-slate-600 whitespace-nowrap">{formatNcoType(value)}</span>
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
    key: "rigName",
    header: "Location",
    sortable: true,
    width: "120px",
    render: (value: string | null) => (
      <span className="text-sm text-slate-600">{value ?? "HQ / Base"}</span>
    ),
  },
  {
    key: "raisedByName",
    header: "Reported By",
    sortable: true,
    width: "140px",
    render: (value: string) => <span className="text-sm text-slate-700">{value}</span>,
  },
  {
    key: "dueDate",
    header: "Due Date",
    sortable: true,
    width: "110px",
    render: (value: string, row: NcoRecord) => {
      const overdue = row.status !== "closed" && isOverdue(value);
      return (
        <span
          className={cn(
            "text-xs font-medium",
            overdue ? "text-red-600" : "text-slate-600"
          )}
        >
          {formatDate(value)}
          {overdue && " (Overdue)"}
        </span>
      );
    },
  },
  {
    key: "relatedCapaId",
    header: "CAPA",
    width: "80px",
    render: (value: string | undefined) => (
      value ? (
        <span title={value} className="flex items-center justify-center">
          <CheckCircle2 className="size-4 text-emerald-500" />
        </span>
      ) : (
        <span className="text-xs text-slate-300">—</span>
      )
    ),
  },
  {
    key: "_actions",
    header: "Actions",
    width: "80px",
    render: (_: unknown, row: NcoRecord) => (
      <Link href={`/quality/nco/${row.id}`} onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="View">
          <Eye className="size-3.5" />
        </Button>
      </Link>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NcoListPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Non-Conformance Orders (NCO)</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track and resolve non-conformances across all operations
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">NCO Records</h2>
        </div>
        <div className="p-5">
          <DataTable<NcoRecord>
            data={NCO_RECORDS}
            columns={COLUMNS}
            searchPlaceholder="Search NCOs..."
            searchKeys={["id", "title", "raisedByName", "rigName", "department"]}
            filters={[
              {
                key: "severity",
                label: "Severity",
                options: [
                  { label: "Critical", value: "critical" },
                  { label: "Major", value: "major" },
                  { label: "Minor", value: "minor" },
                  { label: "Observation", value: "observation" },
                ],
              },
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Open", value: "open" },
                  { label: "Under Investigation", value: "under_investigation" },
                  { label: "Containment Applied", value: "containment_applied" },
                  { label: "Root Cause Identified", value: "root_cause_identified" },
                  { label: "Disposition Pending", value: "disposition_pending" },
                  { label: "CAPA Raised", value: "capa_raised" },
                  { label: "Closed", value: "closed" },
                ],
              },
              {
                key: "type",
                label: "Type",
                options: [
                  { label: "Equipment Failure", value: "equipment_failure" },
                  { label: "Procedure Deviation", value: "procedure_deviation" },
                  { label: "Material Defect", value: "material_defect" },
                  { label: "Documentation", value: "documentation" },
                  { label: "Personnel Competency", value: "personnel_competency" },
                  { label: "Environmental", value: "environmental" },
                  { label: "Safety Observation", value: "safety_observation" },
                ],
              },
            ]}
            onRowClick={(row) => router.push(`/quality/nco/${row.id}`)}
            itemLabel="NCOs"
            pageSize={10}
            emptyMessage="No NCO records found."
          />
        </div>
      </div>
    </div>
  );
}
