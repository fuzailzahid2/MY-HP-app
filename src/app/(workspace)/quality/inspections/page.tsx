"use client";

import * as React from "react";
import { Eye, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type InspectionStatus = "under_review" | "finalized" | "in_progress" | "overdue";

interface InspectionRecord {
  id: string;
  reportNumber: string;
  equipmentLocation: string;
  inspector: string;
  date: string;
  findingsCount: number;
  criticalFindings: number;
  status: InspectionStatus;
  rigId: string;
  type: "bop" | "structural" | "mechanical" | "electrical" | "fire_safety" | "ppe" | "general";
}

// ─── Inline Dummy Data ────────────────────────────────────────────────────────

const INSPECTION_RECORDS: InspectionRecord[] = [
  {
    id: "INS-001",
    reportNumber: "INS-2025-001",
    equipmentLocation: "AD-201-BOP-001 — Rig Alpha Wellhead",
    inspector: "Emma Richards",
    date: "2025-01-10",
    findingsCount: 0,
    criticalFindings: 0,
    status: "finalized",
    rigId: "AD-201",
    type: "bop",
  },
  {
    id: "INS-002",
    reportNumber: "INS-2025-002",
    equipmentLocation: "AD-202 — Rig Bravo Derrick Structural",
    inspector: "Bureau Veritas / Abdullah Qasim",
    date: "2025-01-15",
    findingsCount: 1,
    criticalFindings: 1,
    status: "finalized",
    rigId: "AD-202",
    type: "structural",
  },
  {
    id: "INS-003",
    reportNumber: "INS-2025-003",
    equipmentLocation: "AD-201-TDS-001 — Top Drive Rig Alpha",
    inspector: "Khalid Mahmoud / Intertek",
    date: "2025-01-08",
    findingsCount: 1,
    criticalFindings: 0,
    status: "finalized",
    rigId: "AD-201",
    type: "mechanical",
  },
  {
    id: "INS-004",
    reportNumber: "INS-2025-004",
    equipmentLocation: "AD-203 — Rig Charlie Fire Safety Walk-Down",
    inspector: "Peter Okafor",
    date: "2025-01-22",
    findingsCount: 1,
    criticalFindings: 0,
    status: "finalized",
    rigId: "AD-203",
    type: "fire_safety",
  },
  {
    id: "INS-005",
    reportNumber: "INS-2025-005",
    equipmentLocation: "AD-201 — Rig Alpha Thread Gauge Calibration Check",
    inspector: "Emma Richards",
    date: "2025-05-10",
    findingsCount: 2,
    criticalFindings: 0,
    status: "finalized",
    rigId: "AD-201",
    type: "general",
  },
  {
    id: "INS-006",
    reportNumber: "INS-2025-006",
    equipmentLocation: "AD-203 — Rig Charlie Diesel Fuel Tank",
    inspector: "Sami Al-Otaibi",
    date: "2025-04-02",
    findingsCount: 1,
    criticalFindings: 0,
    status: "finalized",
    rigId: "AD-203",
    type: "general",
  },
  {
    id: "INS-007",
    reportNumber: "INS-2025-007",
    equipmentLocation: "AD-202 — Kill Line Manifold Weld (RT Inspection)",
    inspector: "David Chen / TÜV NDE Team",
    date: "2025-08-14",
    findingsCount: 2,
    criticalFindings: 1,
    status: "under_review",
    rigId: "AD-202",
    type: "structural",
  },
  {
    id: "INS-008",
    reportNumber: "INS-2025-008",
    equipmentLocation: "AD-203 — Rig Charlie DROPS Crown Block Inspection",
    inspector: "Andrew Campbell",
    date: "2025-10-15",
    findingsCount: 1,
    criticalFindings: 0,
    status: "under_review",
    rigId: "AD-203",
    type: "structural",
  },
  {
    id: "INS-009",
    reportNumber: "INS-2025-009",
    equipmentLocation: "AD-201 — BOP Maintenance Records Audit",
    inspector: "Andrew Campbell / Emma Richards",
    date: "2025-11-20",
    findingsCount: 3,
    criticalFindings: 0,
    status: "under_review",
    rigId: "AD-201",
    type: "bop",
  },
  {
    id: "INS-010",
    reportNumber: "INS-2026-001",
    equipmentLocation: "AD-201-RTB-001 — Rotary Table Emergency Inspection",
    inspector: "Khalid Mahmoud",
    date: "2026-02-26",
    findingsCount: 1,
    criticalFindings: 0,
    status: "under_review",
    rigId: "AD-201",
    type: "mechanical",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function InspectionTypeBadge({
  type,
}: {
  type: InspectionRecord["type"];
}) {
  const CONFIG: Record<InspectionRecord["type"], { label: string; color: string; bg: string }> = {
    bop: { label: "BOP", color: "#7C3AED", bg: "#F3E8FF" },
    structural: { label: "Structural", color: "#0891B2", bg: "#ECFEFF" },
    mechanical: { label: "Mechanical", color: "#2563EB", bg: "#EFF6FF" },
    electrical: { label: "Electrical", color: "#D97706", bg: "#FFFBEB" },
    fire_safety: { label: "Fire Safety", color: "#DC2626", bg: "#FEF2F2" },
    ppe: { label: "PPE", color: "#059669", bg: "#ECFDF5" },
    general: { label: "General", color: "#64748B", bg: "#F1F5F9" },
  };
  const { label, color, bg } = CONFIG[type];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function FindingsCountCell({
  count,
  critical,
}: {
  count: number;
  critical: number;
}) {
  if (count === 0) {
    return (
      <span className="text-xs text-emerald-600 font-medium bg-emerald-50 rounded-full px-2 py-0.5">
        0
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "text-xs font-semibold rounded-full px-2 py-0.5",
          critical > 0 ? "text-red-700 bg-red-50" : "text-amber-700 bg-amber-50"
        )}
      >
        {count}
      </span>
      {critical > 0 && (
        <span className="text-[10px] text-red-600 font-medium">
          {critical} critical
        </span>
      )}
    </div>
  );
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const COLUMNS: Column<InspectionRecord>[] = [
  {
    key: "reportNumber",
    header: "Report No.",
    sortable: true,
    width: "130px",
    render: (v: string) => (
      <span className="font-mono text-xs font-semibold text-blue-700">{v}</span>
    ),
  },
  {
    key: "equipmentLocation",
    header: "Equipment / Location",
    sortable: true,
    render: (v: string) => (
      <span className="text-sm text-slate-800">{v}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    width: "120px",
    render: (v: InspectionRecord["type"]) => <InspectionTypeBadge type={v} />,
  },
  {
    key: "inspector",
    header: "Inspector",
    sortable: true,
    width: "180px",
    render: (v: string) => <span className="text-sm text-slate-700">{v}</span>,
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "findingsCount",
    header: "Findings",
    sortable: true,
    width: "110px",
    render: (v: number, row: InspectionRecord) => (
      <FindingsCountCell count={v} critical={row.criticalFindings} />
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "130px",
    render: (v: string) => <StatusBadge status={v} size="sm" />,
  },
  {
    key: "_actions",
    header: "Actions",
    width: "80px",
    render: () => (
      <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="View">
        <Eye className="size-3.5" />
      </Button>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InspectionsPage() {
  const [activeTab, setActiveTab] = React.useState<"under_review" | "finalized">("under_review");

  const underReview = INSPECTION_RECORDS.filter((r) => r.status === "under_review");
  const finalized = INSPECTION_RECORDS.filter((r) => r.status === "finalized");

  const tableData = activeTab === "under_review" ? underReview : finalized;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Inspections</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Equipment and facility inspection reports
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs">
          + New Inspection
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Inspections",
            value: INSPECTION_RECORDS.length,
            color: "text-slate-800",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "Under Review",
            value: underReview.length,
            color: "text-blue-700",
            bg: "bg-blue-50 border-blue-200",
          },
          {
            label: "Finalized",
            value: finalized.length,
            color: "text-emerald-700",
            bg: "bg-emerald-50 border-emerald-200",
          },
          {
            label: "Critical Findings",
            value: INSPECTION_RECORDS.reduce((s, r) => s + r.criticalFindings, 0),
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={cn("rounded-lg border px-4 py-3", kpi.bg)}
          >
            <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
            <p className={cn("text-2xl font-bold mt-0.5", kpi.color)}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Table card with tabs */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="border-b border-slate-200 px-5 flex items-center gap-0">
          {(
            [
              { key: "under_review", label: "Under Review", count: underReview.length },
              { key: "finalized", label: "Finalized", count: finalized.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full text-[10px] font-semibold h-4 min-w-4 px-1",
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-5">
          <DataTable<InspectionRecord>
            data={tableData}
            columns={COLUMNS}
            searchPlaceholder="Search inspections..."
            searchKeys={["reportNumber", "equipmentLocation", "inspector", "rigId"]}
            filters={[
              {
                key: "type",
                label: "Type",
                options: [
                  { label: "BOP", value: "bop" },
                  { label: "Structural", value: "structural" },
                  { label: "Mechanical", value: "mechanical" },
                  { label: "Electrical", value: "electrical" },
                  { label: "Fire Safety", value: "fire_safety" },
                  { label: "PPE", value: "ppe" },
                  { label: "General", value: "general" },
                ],
              },
              {
                key: "rigId",
                label: "Rig",
                options: [
                  { label: "Rig Alpha (AD-201)", value: "AD-201" },
                  { label: "Rig Bravo (AD-202)", value: "AD-202" },
                  { label: "Rig Charlie (AD-203)", value: "AD-203" },
                ],
              },
            ]}
            emptyMessage={
              activeTab === "under_review"
                ? "No inspections currently under review."
                : "No finalized inspections found."
            }
            itemLabel="inspections"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
