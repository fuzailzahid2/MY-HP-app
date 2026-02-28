"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  AUDIT_RECORDS,
  ANNUAL_AUDIT_PROGRAMME_2025,
  AuditRecord,
  AuditProgrammeEntry,
  AuditType,
} from "@/lib/dummy-data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAuditType(type: AuditType): { label: string; color: string; bg: string } {
  const MAP: Record<AuditType, { label: string; color: string; bg: string }> = {
    internal_qms: { label: "Internal QMS", color: "#1D4ED8", bg: "#EFF6FF" },
    hse_rig: { label: "HSE Rig", color: "#0891B2", bg: "#ECFEFF" },
    bop_test_audit: { label: "BOP Test", color: "#7C3AED", bg: "#F3E8FF" },
    iadc: { label: "IADC", color: "#EA580C", bg: "#FFF7ED" },
    third_party_api: { label: "Third Party / API", color: "#D97706", bg: "#FFFBEB" },
    saudi_aramco: { label: "Saudi Aramco", color: "#059669", bg: "#ECFDF5" },
    management_review: { label: "Management Review", color: "#7C3AED", bg: "#F3E8FF" },
  };
  return MAP[type] ?? { label: type, color: "#64748B", bg: "#F1F5F9" };
}

function AuditTypePill({ type }: { type: AuditType }) {
  const { label, color, bg } = formatAuditType(type);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function ProgrammeStatusPill({
  status,
}: {
  status: "planned" | "completed" | "overdue" | "in_progress";
}) {
  const config = {
    completed: { label: "Completed", color: "#059669", bg: "#ECFDF5", Icon: CheckCircle2 },
    in_progress: { label: "In Progress", color: "#2563EB", bg: "#EFF6FF", Icon: Clock },
    overdue: { label: "Overdue", color: "#DC2626", bg: "#FEF2F2", Icon: AlertCircle },
    planned: { label: "Planned", color: "#64748B", bg: "#F1F5F9", Icon: Calendar },
  }[status];

  const { label, color, bg, Icon } = config;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}

// ─── Annual Programme Card ────────────────────────────────────────────────────

const MONTHS_ORDER = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function AnnualProgrammeCard() {
  const [collapsed, setCollapsed] = React.useState(false);

  // Group entries by month (handle duplicate months)
  const byMonth: Record<string, AuditProgrammeEntry[]> = {};
  for (const m of MONTHS_ORDER) byMonth[m] = [];
  for (const entry of ANNUAL_AUDIT_PROGRAMME_2025) {
    if (byMonth[entry.month]) byMonth[entry.month].push(entry);
    else byMonth[entry.month] = [entry];
  }

  // KPI counts
  const total = ANNUAL_AUDIT_PROGRAMME_2025.length;
  const completed = ANNUAL_AUDIT_PROGRAMME_2025.filter((e) => e.status === "completed").length;
  const inProgress = ANNUAL_AUDIT_PROGRAMME_2025.filter((e) => e.status === "in_progress").length;
  const overdue = ANNUAL_AUDIT_PROGRAMME_2025.filter((e) => e.status === "overdue").length;
  const planned = ANNUAL_AUDIT_PROGRAMME_2025.filter((e) => e.status === "planned").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {collapsed ? (
            <ChevronRight className="size-4 text-slate-400" />
          ) : (
            <ChevronDown className="size-4 text-slate-400" />
          )}
          <h2 className="text-base font-semibold text-slate-800">
            Annual Audit Programme 2025
          </h2>
          <span className="text-xs text-slate-500 ml-1">{total} audits scheduled</span>
        </div>

        {/* KPI summary pills */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="size-3.5" /> {completed} Completed
          </span>
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            <Clock className="size-3.5" /> {inProgress} In Progress
          </span>
          {overdue > 0 && (
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <AlertCircle className="size-3.5" /> {overdue} Overdue
            </span>
          )}
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <Calendar className="size-3.5" /> {planned} Planned
          </span>
        </div>
      </button>

      {!collapsed && (
        <>
          {/* Progress bar */}
          <div className="px-5 pb-3 border-t border-slate-100">
            <div className="flex items-center gap-3 pt-3">
              <span className="text-xs text-slate-500 shrink-0 w-20">
                {pct}% complete
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 shrink-0">
                {completed}/{total}
              </span>
            </div>
          </div>

          {/* Calendar table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">
                    Month
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Audit
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">
                    Type
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">
                    Location
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">
                    Auditor
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">
                    Date
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {MONTHS_ORDER.map((month) => {
                  const entries = byMonth[month] ?? [];
                  if (entries.length === 0) {
                    return (
                      <tr key={month} className="border-b border-slate-50">
                        <td className="px-5 py-2.5 text-xs font-medium text-slate-600">{month}</td>
                        <td colSpan={6} className="px-4 py-2.5 text-xs text-slate-400 italic">
                          No audit scheduled
                        </td>
                      </tr>
                    );
                  }
                  return entries.map((entry, idx) => (
                    <tr
                      key={`${month}-${idx}`}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                    >
                      {idx === 0 && (
                        <td
                          className="px-5 py-2.5 text-xs font-medium text-slate-700 align-top"
                          rowSpan={entries.length}
                        >
                          {month}
                        </td>
                      )}
                      <td className="px-4 py-2.5 text-sm text-slate-800">
                        {entry.auditId ? (
                          <Link
                            href={`/quality/audits/${entry.auditId}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {entry.title}
                          </Link>
                        ) : (
                          entry.title
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <AuditTypePill type={entry.type} />
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">
                        {entry.rigId ?? "HQ / All Rigs"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{entry.auditorName}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{entry.scheduledDate}</td>
                      <td className="px-4 py-2.5">
                        <ProgrammeStatusPill status={entry.status} />
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Audit Records Table ──────────────────────────────────────────────────────

const COLUMNS: Column<AuditRecord>[] = [
  {
    key: "id",
    header: "Number",
    sortable: true,
    width: "140px",
    render: (value: string) => (
      <Link
        href={`/quality/audits/${value}`}
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
      <span className="text-sm text-slate-800 line-clamp-2 max-w-xs">{value}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    width: "160px",
    render: (value: AuditType) => <AuditTypePill type={value} />,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "140px",
    render: (value: string) => <StatusBadge status={value} size="sm" />,
  },
  {
    key: "standardsApplicable",
    header: "Standard",
    width: "160px",
    render: (value: string[]) => (
      <span className="text-xs text-slate-600">{value?.[0] ?? "—"}</span>
    ),
  },
  {
    key: "leadAuditorName",
    header: "Lead Auditor",
    sortable: true,
    width: "150px",
    render: (value: string) => <span className="text-sm text-slate-700">{value}</span>,
  },
  {
    key: "findings",
    header: "Findings",
    width: "90px",
    render: (_: any, row: AuditRecord) => {
      const count = row.findings?.length ?? 0;
      return (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
            count === 0
              ? "text-slate-400 bg-slate-100"
              : count <= 2
              ? "text-amber-700 bg-amber-50"
              : "text-red-700 bg-red-50"
          )}
        >
          {count}
        </span>
      );
    },
  },
  {
    key: "plannedDate",
    header: "Date",
    sortable: true,
    width: "110px",
    render: (value: string) => <span className="text-xs text-slate-600">{value}</span>,
  },
  {
    key: "_actions",
    header: "Actions",
    width: "80px",
    render: (_: any, row: AuditRecord) => (
      <Link href={`/quality/audits/${row.id}`} onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="View">
          <Eye className="size-3.5" />
        </Button>
      </Link>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Audits</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage audit programme, records and findings
        </p>
      </div>

      {/* Annual Programme */}
      <AnnualProgrammeCard />

      {/* Audit Records */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Audit Records</h2>
        </div>
        <div className="p-5">
          <DataTable<AuditRecord>
            data={AUDIT_RECORDS}
            columns={COLUMNS}
            searchPlaceholder="Search audits..."
            searchKeys={["id", "title", "leadAuditorName", "location"]}
            filters={[
              {
                key: "type",
                label: "Type",
                options: [
                  { label: "Internal QMS", value: "internal_qms" },
                  { label: "HSE Rig", value: "hse_rig" },
                  { label: "BOP Test", value: "bop_test_audit" },
                  { label: "IADC", value: "iadc" },
                  { label: "Third Party / API", value: "third_party_api" },
                  { label: "Saudi Aramco", value: "saudi_aramco" },
                  { label: "Management Review", value: "management_review" },
                ],
              },
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Planned", value: "planned" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Report Issued", value: "report_issued" },
                  { label: "Findings Open", value: "findings_open" },
                  { label: "Closed", value: "closed" },
                ],
              },
            ]}
            itemLabel="audits"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
