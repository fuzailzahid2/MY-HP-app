"use client";

import * as React from "react";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Truck,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type RigMoveStatus =
  | "Planning"
  | "In Progress"
  | "On Hold"
  | "Completed"
  | "Cancelled";

type PhaseStatus = "pending" | "in_progress" | "completed" | "blocked";

interface MovePhase {
  name: string;
  status: PhaseStatus;
  checklistTotal: number;
  checklistDone: number;
  assignee?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

interface RigMove {
  id: string;
  moveId: string;
  rig: string;
  fromLocation: string;
  toLocation: string;
  status: RigMoveStatus;
  currentPhase: string;
  targetDate: string;
  moveDirector: string;
  phases: MovePhase[];
  distanceKm?: number;
  estimatedDays?: number;
}

// ─── Inline Data ──────────────────────────────────────────────────────────────

const RIG_MOVES: RigMove[] = [
  {
    id: "RM-001",
    moveId: "MOVE-2026-001",
    rig: "Rig Charlie (AD-203)",
    fromLocation: "Block 7 — Well 7-C-15",
    toLocation: "Block 7 — Well 7-C-16",
    status: "In Progress",
    currentPhase: "Equipment Demobilization",
    targetDate: "2026-03-15",
    moveDirector: "Hassan Al-Sayed",
    distanceKm: 4.2,
    estimatedDays: 18,
    phases: [
      {
        name: "Pre-Move Assessment",
        status: "completed",
        checklistTotal: 12,
        checklistDone: 12,
        assignee: "Khalid Al-Zahrani",
        startDate: "2026-02-10",
        endDate: "2026-02-15",
        notes: "All pre-move surveys completed. Road survey approved.",
      },
      {
        name: "Equipment Demobilization",
        status: "in_progress",
        checklistTotal: 24,
        checklistDone: 16,
        assignee: "Mohammed Al-Rashid",
        startDate: "2026-02-16",
        notes: "Drill string pulled. BOP being rigged down.",
      },
      {
        name: "Transport",
        status: "pending",
        checklistTotal: 18,
        checklistDone: 0,
        assignee: "Faisal Al-Anzi",
        notes: "Awaiting demobilization completion. Transport convoy ready.",
      },
      {
        name: "Site Preparation",
        status: "pending",
        checklistTotal: 15,
        checklistDone: 0,
        assignee: "Omar Al-Ghamdi",
      },
      {
        name: "Mobilization",
        status: "pending",
        checklistTotal: 22,
        checklistDone: 0,
        assignee: "Mohammed Al-Rashid",
      },
      {
        name: "Commissioning",
        status: "pending",
        checklistTotal: 16,
        checklistDone: 0,
        assignee: "Khalid Al-Zahrani",
        notes: "Well 7-C-16 spud target: 2026-03-20",
      },
    ],
  },
  {
    id: "RM-002",
    moveId: "MOVE-2026-002",
    rig: "Rig Bravo (AD-202)",
    fromLocation: "Block 4 — Well 4-B-08",
    toLocation: "Block 5 — Well 5-A-01",
    status: "Planning",
    currentPhase: "Pre-Move Assessment",
    targetDate: "2026-04-30",
    moveDirector: "Tariq Al-Mutairi",
    distanceKm: 28.5,
    estimatedDays: 25,
    phases: [
      {
        name: "Pre-Move Assessment",
        status: "in_progress",
        checklistTotal: 12,
        checklistDone: 5,
        assignee: "Yasser Al-Barrak",
        startDate: "2026-02-20",
        notes: "Road survey ongoing. Environmental assessment submitted.",
      },
      {
        name: "Equipment Demobilization",
        status: "pending",
        checklistTotal: 24,
        checklistDone: 0,
      },
      {
        name: "Transport",
        status: "pending",
        checklistTotal: 18,
        checklistDone: 0,
        notes: "Long-haul move — requires oversize transport permits.",
      },
      {
        name: "Site Preparation",
        status: "pending",
        checklistTotal: 15,
        checklistDone: 0,
        notes: "New location — civils work required before rig arrival.",
      },
      {
        name: "Mobilization",
        status: "pending",
        checklistTotal: 22,
        checklistDone: 0,
      },
      {
        name: "Commissioning",
        status: "pending",
        checklistTotal: 16,
        checklistDone: 0,
      },
    ],
  },
  {
    id: "RM-003",
    moveId: "MOVE-2025-008",
    rig: "Rig Alpha (AD-201)",
    fromLocation: "Block 2 — Well 2-A-11",
    toLocation: "Block 2 — Well 2-A-12",
    status: "Completed",
    currentPhase: "Commissioning",
    targetDate: "2026-01-20",
    moveDirector: "Ali Hassan Al-Barrak",
    distanceKm: 1.8,
    estimatedDays: 12,
    phases: [
      {
        name: "Pre-Move Assessment",
        status: "completed",
        checklistTotal: 12,
        checklistDone: 12,
        assignee: "Ahmed Al-Rashidi",
        startDate: "2026-01-02",
        endDate: "2026-01-05",
      },
      {
        name: "Equipment Demobilization",
        status: "completed",
        checklistTotal: 24,
        checklistDone: 24,
        assignee: "Nasser Al-Qahtani",
        startDate: "2026-01-06",
        endDate: "2026-01-09",
      },
      {
        name: "Transport",
        status: "completed",
        checklistTotal: 18,
        checklistDone: 18,
        assignee: "Ibrahim Al-Juhani",
        startDate: "2026-01-09",
        endDate: "2026-01-10",
      },
      {
        name: "Site Preparation",
        status: "completed",
        checklistTotal: 15,
        checklistDone: 15,
        assignee: "Sultan Al-Anzi",
        startDate: "2026-01-10",
        endDate: "2026-01-13",
      },
      {
        name: "Mobilization",
        status: "completed",
        checklistTotal: 22,
        checklistDone: 22,
        assignee: "Nasser Al-Qahtani",
        startDate: "2026-01-13",
        endDate: "2026-01-16",
      },
      {
        name: "Commissioning",
        status: "completed",
        checklistTotal: 16,
        checklistDone: 16,
        assignee: "Ahmed Al-Rashidi",
        startDate: "2026-01-16",
        endDate: "2026-01-19",
        notes: "Spud achieved 2026-01-20. Well 2-A-12 drilling operations commenced.",
      },
    ],
  },
  {
    id: "RM-004",
    moveId: "MOVE-2026-003",
    rig: "Rig Alpha (AD-201)",
    fromLocation: "Block 2 — Well 2-A-14 (Projected)",
    toLocation: "Block 3 — Well 3-A-01 (Projected)",
    status: "Planning",
    currentPhase: "Pre-Move Assessment",
    targetDate: "2026-06-30",
    moveDirector: "Mohammed Al-Ghamdi",
    distanceKm: 52.0,
    estimatedDays: 30,
    phases: [
      {
        name: "Pre-Move Assessment",
        status: "pending",
        checklistTotal: 12,
        checklistDone: 0,
        notes: "Preliminary planning only — well 2-A-14 still in drilling phase.",
      },
      {
        name: "Equipment Demobilization",
        status: "pending",
        checklistTotal: 24,
        checklistDone: 0,
      },
      {
        name: "Transport",
        status: "pending",
        checklistTotal: 18,
        checklistDone: 0,
        notes: "Requires Aramco road approval for Block 3 access.",
      },
      {
        name: "Site Preparation",
        status: "pending",
        checklistTotal: 15,
        checklistDone: 0,
      },
      {
        name: "Mobilization",
        status: "pending",
        checklistTotal: 22,
        checklistDone: 0,
      },
      {
        name: "Commissioning",
        status: "pending",
        checklistTotal: 16,
        checklistDone: 0,
      },
    ],
  },
  {
    id: "RM-005",
    moveId: "MOVE-2025-007",
    rig: "Rig Charlie (AD-203)",
    fromLocation: "Block 7 — Well 7-C-13",
    toLocation: "Block 7 — Well 7-C-14",
    status: "Completed",
    currentPhase: "Commissioning",
    targetDate: "2025-11-30",
    moveDirector: "Hassan Al-Sayed",
    distanceKm: 3.1,
    estimatedDays: 14,
    phases: [
      {
        name: "Pre-Move Assessment",
        status: "completed",
        checklistTotal: 12,
        checklistDone: 12,
        startDate: "2025-11-10",
        endDate: "2025-11-14",
      },
      {
        name: "Equipment Demobilization",
        status: "completed",
        checklistTotal: 24,
        checklistDone: 24,
        startDate: "2025-11-14",
        endDate: "2025-11-18",
      },
      {
        name: "Transport",
        status: "completed",
        checklistTotal: 18,
        checklistDone: 18,
        startDate: "2025-11-18",
        endDate: "2025-11-19",
      },
      {
        name: "Site Preparation",
        status: "completed",
        checklistTotal: 15,
        checklistDone: 15,
        startDate: "2025-11-19",
        endDate: "2025-11-22",
      },
      {
        name: "Mobilization",
        status: "completed",
        checklistTotal: 22,
        checklistDone: 22,
        startDate: "2025-11-22",
        endDate: "2025-11-26",
      },
      {
        name: "Commissioning",
        status: "completed",
        checklistTotal: 16,
        checklistDone: 16,
        startDate: "2025-11-26",
        endDate: "2025-11-29",
        notes: "Spud achieved 2025-11-30. Well 7-C-14 drilling operations commenced.",
      },
    ],
  },
];

// ─── Phase Stepper Component ───────────────────────────────────────────────────

const PHASE_ORDER = [
  "Pre-Move Assessment",
  "Equipment Demobilization",
  "Transport",
  "Site Preparation",
  "Mobilization",
  "Commissioning",
];

function PhaseIcon({ status }: { status: PhaseStatus }) {
  if (status === "completed") {
    return <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />;
  }
  if (status === "in_progress") {
    return <Clock className="size-5 text-blue-600 shrink-0 animate-pulse" />;
  }
  if (status === "blocked") {
    return <AlertCircle className="size-5 text-red-500 shrink-0" />;
  }
  return <Circle className="size-5 text-slate-300 shrink-0" />;
}

function PhaseConnector({ status }: { status: PhaseStatus }) {
  return (
    <div
      className={cn(
        "w-0.5 h-6 ml-[9px] my-1",
        status === "completed" ? "bg-emerald-400" : "bg-slate-200"
      )}
    />
  );
}

function RigMoveStepper({ move }: { move: RigMove }) {
  return (
    <div className="p-5 border-t border-slate-100 bg-slate-50/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left — Phase Stepper */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Move Phases
          </h3>
          <div>
            {PHASE_ORDER.map((phaseName, idx) => {
              const phase = move.phases.find((p) => p.name === phaseName);
              const status: PhaseStatus = phase?.status ?? "pending";
              const isLast = idx === PHASE_ORDER.length - 1;
              return (
                <div key={phaseName}>
                  <div className="flex items-start gap-3">
                    <PhaseIcon status={status} />
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            status === "completed"
                              ? "text-emerald-700"
                              : status === "in_progress"
                              ? "text-blue-700"
                              : "text-slate-500"
                          )}
                        >
                          {phaseName}
                        </span>
                        {phase && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {phase.checklistDone}/{phase.checklistTotal} items
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {phase && phase.checklistTotal > 0 && (
                        <div className="mt-1 h-1 bg-slate-200 rounded-full w-full max-w-xs">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              status === "completed"
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            )}
                            style={{
                              width: `${Math.round(
                                (phase.checklistDone / phase.checklistTotal) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      )}

                      {phase?.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          {phase.notes}
                        </p>
                      )}
                      {phase?.assignee && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Assigned: {phase.assignee}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isLast && <PhaseConnector status={status} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Move Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Move Details</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {[
              { label: "Move ID", value: move.moveId },
              { label: "Move Director", value: move.moveDirector },
              { label: "Distance", value: move.distanceKm ? `${move.distanceKm} km` : "TBD" },
              { label: "Estimated Days", value: move.estimatedDays ? `${move.estimatedDays} days` : "TBD" },
              { label: "Target Date", value: move.targetDate },
              { label: "Current Phase", value: move.currentPhase },
              {
                label: "From",
                value: move.fromLocation,
              },
              {
                label: "To",
                value: move.toLocation,
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-slate-400 font-medium">{label}</p>
                <p className="text-slate-700 font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Overall Progress */}
          {(() => {
            const totalItems = move.phases.reduce((s, p) => s + p.checklistTotal, 0);
            const doneItems = move.phases.reduce((s, p) => s + p.checklistDone, 0);
            const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
            return (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="font-medium">Overall Checklist Progress</span>
                  <span className="font-mono">{doneItems}/{totalItems} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRigMoveStatusMapped(status: RigMoveStatus): string {
  const MAP: Record<RigMoveStatus, string> = {
    Planning: "planned",
    "In Progress": "in_progress",
    "On Hold": "on_hold",
    Completed: "completed",
    Cancelled: "cancelled",
  };
  return MAP[status] ?? "pending";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RigMovePage() {
  const [expandedId, setExpandedId] = React.useState<string | null>("RM-001");

  const columns: Column<RigMove>[] = [
    {
      key: "moveId",
      header: "Move ID",
      sortable: true,
      width: "140px",
      render: (v: string) => (
        <span className="font-mono text-xs font-semibold text-blue-600">{v}</span>
      ),
    },
    {
      key: "rig",
      header: "Rig",
      sortable: true,
      width: "160px",
      render: (v: string) => (
        <div className="flex items-center gap-1.5">
          <Truck className="size-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-800">{v}</span>
        </div>
      ),
    },
    {
      key: "fromLocation",
      header: "From Location",
      sortable: true,
      render: (v: string) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-[180px]">{v}</span>
      ),
    },
    {
      key: "toLocation",
      header: "To Location",
      sortable: true,
      render: (v: string) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-[180px]">{v}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "110px",
      render: (v: RigMoveStatus) => (
        <StatusBadge status={getRigMoveStatusMapped(v)} size="sm" />
      ),
    },
    {
      key: "currentPhase",
      header: "Phase",
      sortable: true,
      width: "180px",
      render: (v: string) => (
        <span className="text-xs text-slate-700 bg-slate-100 rounded-full px-2 py-0.5 whitespace-nowrap">
          {v}
        </span>
      ),
    },
    {
      key: "targetDate",
      header: "Target Date",
      sortable: true,
      width: "110px",
      render: (v: string) => {
        const isPast = new Date(v) < new Date() ? true : false;
        return (
          <span className={cn("text-xs", isPast ? "text-red-600 font-medium" : "text-slate-600")}>
            {v}
          </span>
        );
      },
    },
    {
      key: "moveDirector",
      header: "Move Director",
      sortable: true,
      width: "150px",
      render: (v: string) => <span className="text-xs text-slate-700">{v}</span>,
    },
    {
      key: "_actions",
      header: "Actions",
      width: "120px",
      render: (_: any, row: RigMove) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedId((prev) => (prev === row.id ? null : row.id));
            }}
          >
            {expandedId === row.id ? (
              <>
                <ChevronUp className="size-3.5 mr-1" />
                Close
              </>
            ) : (
              <>
                <Eye className="size-3.5 mr-1" />
                Details
              </>
            )}
          </Button>
        </div>
      ),
    },
  ];

  const inProgress = RIG_MOVES.filter((r) => r.status === "In Progress").length;
  const planning = RIG_MOVES.filter((r) => r.status === "Planning").length;
  const completed = RIG_MOVES.filter((r) => r.status === "Completed").length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Rig Move Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track and manage rig move operations across all active rigs
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Plus className="size-3.5" />
          New Rig Move
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Moves",
            value: RIG_MOVES.length,
            sub: "All records",
            color: "text-slate-800",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "In Progress",
            value: inProgress,
            sub: "Active moves",
            color: "text-blue-700",
            bg: "bg-blue-50 border-blue-200",
          },
          {
            label: "Planning",
            value: planning,
            sub: "Upcoming moves",
            color: "text-amber-700",
            bg: "bg-amber-50 border-amber-200",
          },
        ].map((kpi) => (
          <div key={kpi.label} className={cn("rounded-lg border px-4 py-3", kpi.bg)}>
            <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
            <p className={cn("text-2xl font-bold mt-0.5", kpi.color)}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Table with expandable detail rows */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            Rig Move Records
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({RIG_MOVES.length} records)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click "Details" to expand phase-by-phase workflow progress
          </p>
        </div>

        {/* Custom rendered list — table rows + expandable detail */}
        <div className="divide-y divide-slate-100">
          {/* Header row */}
          <div className="grid grid-cols-[140px_160px_1fr_1fr_110px_180px_110px_150px_120px] gap-3 px-5 py-3 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 hidden lg:grid">
            <span>Move ID</span>
            <span>Rig</span>
            <span>From Location</span>
            <span>To Location</span>
            <span>Status</span>
            <span>Phase</span>
            <span>Target Date</span>
            <span>Move Director</span>
            <span>Actions</span>
          </div>

          {RIG_MOVES.map((move) => (
            <div key={move.id}>
              {/* Main row */}
              <div className="px-5 py-3 grid grid-cols-1 lg:grid-cols-[140px_160px_1fr_1fr_110px_180px_110px_150px_120px] gap-3 items-center">
                <span className="font-mono text-xs font-semibold text-blue-600">
                  {move.moveId}
                </span>
                <div className="flex items-center gap-1.5">
                  <Truck className="size-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-800">{move.rig}</span>
                </div>
                <span className="text-xs text-slate-600 line-clamp-1">{move.fromLocation}</span>
                <span className="text-xs text-slate-600 line-clamp-1">{move.toLocation}</span>
                <StatusBadge status={getRigMoveStatusMapped(move.status)} size="sm" />
                <span className="text-xs text-slate-700 bg-slate-100 rounded-full px-2 py-0.5 whitespace-nowrap inline-block">
                  {move.currentPhase}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    new Date(move.targetDate) < new Date() && move.status !== "Completed"
                      ? "text-red-600 font-medium"
                      : "text-slate-600"
                  )}
                >
                  {move.targetDate}
                </span>
                <span className="text-xs text-slate-700">{move.moveDirector}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs w-fit"
                  onClick={() => setExpandedId((prev) => (prev === move.id ? null : move.id))}
                >
                  {expandedId === move.id ? (
                    <>
                      <ChevronUp className="size-3.5 mr-1" />
                      Close
                    </>
                  ) : (
                    <>
                      <Eye className="size-3.5 mr-1" />
                      Details
                    </>
                  )}
                </Button>
              </div>

              {/* Expandable Phase Stepper */}
              {expandedId === move.id && <RigMoveStepper move={move} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
