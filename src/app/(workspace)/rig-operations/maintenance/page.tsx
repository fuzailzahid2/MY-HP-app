"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { AlertCircle, CheckCircle2, Clock, Wrench, Zap, Settings, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EquipmentHealth = "operational" | "scheduled" | "in_repair" | "down";

interface Equipment {
  id: string;
  name: string;
  category: string;
  health: EquipmentHealth;
  lastServiceDate: string;
  nextDueDate: string;
  location: string;
  icon: React.ElementType;
}

interface PMTask {
  id: string;
  equipment: string;
  taskDescription: string;
  frequency: string;
  lastDone: string;
  nextDue: string;
  assignedTo: string;
  assignedInitials: string;
  assignedColor: string;
  status: "completed" | "due_soon" | "overdue" | "scheduled" | "in_progress";
  estimatedHours: number;
}

interface BreakdownRecord {
  id: string;
  equipment: string;
  failureDescription: string;
  reportedTime: string;
  reportedBy: string;
  resolutionTime: string | null;
  downtimeHrs: number | null;
  status: "open" | "in_progress" | "resolved";
  severity: "critical" | "high" | "medium" | "low";
}

// ─── Data ────────────────────────────────────────────────────────────────────

const EQUIPMENT_BOARD: Equipment[] = [
  { id: "EQ-001", name: "Top Drive — NOV TDS-11SA", category: "Rotating", health: "operational", lastServiceDate: "2026-02-10", nextDueDate: "2026-03-10", location: "Derrick", icon: Settings },
  { id: "EQ-002", name: "Mud Pump #1 — National 12-P-160", category: "Circulating", health: "scheduled", lastServiceDate: "2026-01-28", nextDueDate: "2026-03-01", location: "Pump Room", icon: Zap },
  { id: "EQ-003", name: "Mud Pump #2 — National 12-P-160", category: "Circulating", health: "in_repair", lastServiceDate: "2026-02-05", nextDueDate: "2026-02-25", location: "Pump Room", icon: Zap },
  { id: "EQ-004", name: "Generator #1 — CAT 3512C", category: "Power", health: "operational", lastServiceDate: "2026-02-15", nextDueDate: "2026-03-15", location: "Power House", icon: Zap },
  { id: "EQ-005", name: "Generator #2 — CAT 3512C", category: "Power", health: "operational", lastServiceDate: "2026-02-16", nextDueDate: "2026-03-16", location: "Power House", icon: Zap },
  { id: "EQ-006", name: "Generator #3 — CAT 3512C", category: "Power", health: "down", lastServiceDate: "2026-01-10", nextDueDate: "2026-02-10", location: "Power House", icon: Zap },
  { id: "EQ-007", name: "Drawworks — NOV TDS-700", category: "Hoisting", health: "operational", lastServiceDate: "2026-02-08", nextDueDate: "2026-03-08", location: "Drill Floor", icon: Settings },
  { id: "EQ-008", name: "BOP Stack — Shaffer 13-5/8\" 10K", category: "Well Control", health: "operational", lastServiceDate: "2026-01-20", nextDueDate: "2026-04-20", location: "Wellhead", icon: AlertCircle },
  { id: "EQ-009", name: "Rotary Table — National 27.5\"", category: "Rotating", health: "scheduled", lastServiceDate: "2026-01-15", nextDueDate: "2026-02-28", location: "Drill Floor", icon: Settings },
  { id: "EQ-010", name: "Shale Shaker #1 — Derrick FLC 500", category: "Solids Control", health: "operational", lastServiceDate: "2026-02-20", nextDueDate: "2026-03-20", location: "Mud Pit Area", icon: Wrench },
  { id: "EQ-011", name: "Air Compressor — Atlas Copco GA75", category: "Utilities", health: "operational", lastServiceDate: "2026-02-01", nextDueDate: "2026-03-01", location: "Utility Room", icon: Wrench },
  { id: "EQ-012", name: "Crown Block — NOV 500T", category: "Hoisting", health: "operational", lastServiceDate: "2026-02-12", nextDueDate: "2026-04-12", location: "Derrick Top", icon: Settings },
];

const PM_TASKS: PMTask[] = [
  {
    id: "PM-2026-001",
    equipment: "Top Drive — NOV TDS-11SA",
    taskDescription: "Gearbox oil change + filter replacement (500-hr interval)",
    frequency: "500 operating hours",
    lastDone: "2026-01-10",
    nextDue: "2026-03-10",
    assignedTo: "K. Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    status: "scheduled",
    estimatedHours: 4,
  },
  {
    id: "PM-2026-002",
    equipment: "Mud Pump #1 — National 12-P-160",
    taskDescription: "Liner & piston assembly replacement — planned overhaul",
    frequency: "1,500 running hours",
    lastDone: "2025-11-20",
    nextDue: "2026-03-01",
    assignedTo: "R. Santos",
    assignedInitials: "RS",
    assignedColor: "#00838F",
    status: "due_soon",
    estimatedHours: 8,
  },
  {
    id: "PM-2026-003",
    equipment: "Generator #1 — CAT 3512C",
    taskDescription: "Engine oil, filters, coolant, belt inspection (S·O·S analysis)",
    frequency: "250 operating hours",
    lastDone: "2026-02-15",
    nextDue: "2026-03-15",
    assignedTo: "S. Al-Otaibi",
    assignedInitials: "SO",
    assignedColor: "#33691E",
    status: "scheduled",
    estimatedHours: 3,
  },
  {
    id: "PM-2026-004",
    equipment: "Generator #2 — CAT 3512C",
    taskDescription: "Engine oil, filters, coolant, belt inspection",
    frequency: "250 operating hours",
    lastDone: "2026-02-16",
    nextDue: "2026-03-16",
    assignedTo: "S. Al-Otaibi",
    assignedInitials: "SO",
    assignedColor: "#33691E",
    status: "scheduled",
    estimatedHours: 3,
  },
  {
    id: "PM-2026-005",
    equipment: "Generator #3 — CAT 3512C",
    taskDescription: "Emergency overhaul — main bearing replacement",
    frequency: "Corrective",
    lastDone: "—",
    nextDue: "2026-02-28",
    assignedTo: "K. Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    status: "in_progress",
    estimatedHours: 16,
  },
  {
    id: "PM-2026-006",
    equipment: "BOP Stack — Shaffer 13-5/8\"",
    taskDescription: "Function test, seal integrity check, pressure test to rated WP",
    frequency: "Every 90 days",
    lastDone: "2026-01-20",
    nextDue: "2026-04-20",
    assignedTo: "M. Al-Dosari",
    assignedInitials: "MD",
    assignedColor: "#BF360C",
    status: "scheduled",
    estimatedHours: 6,
  },
  {
    id: "PM-2026-007",
    equipment: "Drawworks — NOV TDS-700",
    taskDescription: "Brake lining inspection, drum bearing lubrication, wire rope inspection",
    frequency: "Monthly",
    lastDone: "2026-02-08",
    nextDue: "2026-03-08",
    assignedTo: "K. Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    status: "scheduled",
    estimatedHours: 5,
  },
  {
    id: "PM-2026-008",
    equipment: "Rotary Table — National 27.5\"",
    taskDescription: "Main bearing inspection, lubrication, table bushing check",
    frequency: "Monthly",
    lastDone: "2026-01-15",
    nextDue: "2026-02-28",
    assignedTo: "K. Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    status: "overdue",
    estimatedHours: 4,
  },
  {
    id: "PM-2026-009",
    equipment: "Mud Pump #2 — National 12-P-160",
    taskDescription: "Valve assembly inspection — suction & discharge valves",
    frequency: "Weekly",
    lastDone: "2026-02-20",
    nextDue: "2026-02-27",
    assignedTo: "R. Santos",
    assignedInitials: "RS",
    assignedColor: "#00838F",
    status: "in_progress",
    estimatedHours: 3,
  },
  {
    id: "PM-2026-010",
    equipment: "Air Compressor — Atlas Copco GA75",
    taskDescription: "Air filter replacement, oil check, belt tension inspection",
    frequency: "Monthly",
    lastDone: "2026-02-01",
    nextDue: "2026-03-01",
    assignedTo: "S. Al-Otaibi",
    assignedInitials: "SO",
    assignedColor: "#33691E",
    status: "scheduled",
    estimatedHours: 2,
  },
  {
    id: "PM-2026-011",
    equipment: "Shale Shaker #1 — Derrick FLC 500",
    taskDescription: "Screen deck inspection, screen replacement if damaged, vibrator bearing check",
    frequency: "Bi-weekly",
    lastDone: "2026-02-20",
    nextDue: "2026-03-06",
    assignedTo: "K. Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    status: "scheduled",
    estimatedHours: 2,
  },
  {
    id: "PM-2026-012",
    equipment: "Crown Block — NOV 500T",
    taskDescription: "Sheave inspection, bearing lubrication, crown line inspection",
    frequency: "Every 60 days",
    lastDone: "2026-02-12",
    nextDue: "2026-04-12",
    assignedTo: "K. Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    status: "scheduled",
    estimatedHours: 3,
  },
  {
    id: "PM-2026-013",
    equipment: "Top Drive — NOV TDS-11SA",
    taskDescription: "Main shaft seal inspection and greasing",
    frequency: "Weekly",
    lastDone: "2026-02-20",
    nextDue: "2026-02-27",
    assignedTo: "R. Santos",
    assignedInitials: "RS",
    assignedColor: "#00838F",
    status: "due_soon",
    estimatedHours: 1,
  },
  {
    id: "PM-2026-014",
    equipment: "BOP Control Unit",
    taskDescription: "Accumulator pressure check, fluid level top-up, function test pilot valves",
    frequency: "Every 30 days",
    lastDone: "2026-01-28",
    nextDue: "2026-02-28",
    assignedTo: "M. Al-Dosari",
    assignedInitials: "MD",
    assignedColor: "#BF360C",
    status: "due_soon",
    estimatedHours: 2,
  },
];

const BREAKDOWN_LOG: BreakdownRecord[] = [
  {
    id: "BD-2026-001",
    equipment: "Generator #3 — CAT 3512C",
    failureDescription: "Main bearing failure — excessive vibration, loss of power output. Emergency shutdown initiated.",
    reportedTime: "2026-02-22 03:15",
    reportedBy: "K. Mahmoud",
    resolutionTime: null,
    downtimeHrs: null,
    status: "in_progress",
    severity: "critical",
  },
  {
    id: "BD-2026-002",
    equipment: "Mud Pump #2 — National 12-P-160",
    failureDescription: "Liner failure — loss of pressure, mud leakage from pump housing. Pump taken offline.",
    reportedTime: "2026-02-19 14:30",
    reportedBy: "R. Santos",
    resolutionTime: null,
    downtimeHrs: null,
    status: "in_progress",
    severity: "high",
  },
  {
    id: "BD-2026-003",
    equipment: "Rotary Table — National 27.5\"",
    failureDescription: "Unusual noise during rotation — suspected bearing wear. Operations slowed for inspection.",
    reportedTime: "2026-02-24 08:45",
    reportedBy: "K. Mahmoud",
    resolutionTime: null,
    downtimeHrs: null,
    status: "open",
    severity: "medium",
  },
  {
    id: "BD-2026-004",
    equipment: "Shale Shaker #2 — Derrick FLC 513",
    failureDescription: "Screen panel torn — mud bypass to mud pit. Screen replaced. Unit back online.",
    reportedTime: "2026-02-18 10:00",
    reportedBy: "K. Mahmoud",
    resolutionTime: "2026-02-18 12:30",
    downtimeHrs: 2.5,
    status: "resolved",
    severity: "low",
  },
  {
    id: "BD-2026-005",
    equipment: "Top Drive — NOV TDS-11SA",
    failureDescription: "Gearbox oil leak from top seal — reduced rotation speed, oil top-up and monitoring.",
    reportedTime: "2026-02-10 16:00",
    reportedBy: "R. Santos",
    resolutionTime: "2026-02-11 09:00",
    downtimeHrs: 17.0,
    status: "resolved",
    severity: "medium",
  },
  {
    id: "BD-2026-006",
    equipment: "Air Compressor — Atlas Copco GA75",
    failureDescription: "Automatic drain valve stuck open — air pressure dropping below setpoint. Valve replaced.",
    reportedTime: "2026-02-15 11:30",
    reportedBy: "S. Al-Otaibi",
    resolutionTime: "2026-02-15 14:00",
    downtimeHrs: 2.5,
    status: "resolved",
    severity: "low",
  },
  {
    id: "BD-2026-007",
    equipment: "Drawworks — NOV TDS-700",
    failureDescription: "Emergency brake auto-activation during tripping — investigation revealed faulty sensor. Sensor replaced.",
    reportedTime: "2026-02-13 22:00",
    reportedBy: "M. Al-Dosari",
    resolutionTime: "2026-02-14 04:00",
    downtimeHrs: 6.0,
    status: "resolved",
    severity: "high",
  },
];

// ─── Health config ────────────────────────────────────────────────────────────

function getHealthConfig(health: EquipmentHealth) {
  const MAP: Record<EquipmentHealth, { label: string; color: string; bg: string; dotColor: string; borderColor: string }> = {
    operational: { label: "Operational", color: "#059669", bg: "#ECFDF5", dotColor: "#10B981", borderColor: "#A7F3D0" },
    scheduled: { label: "Scheduled PM", color: "#2563EB", bg: "#EFF6FF", dotColor: "#3B82F6", borderColor: "#BFDBFE" },
    in_repair: { label: "In Repair", color: "#D97706", bg: "#FFFBEB", dotColor: "#F59E0B", borderColor: "#FDE68A" },
    down: { label: "Down", color: "#DC2626", bg: "#FEF2F2", dotColor: "#EF4444", borderColor: "#FECACA" },
  };
  return MAP[health];
}

// ─── PM task status config ────────────────────────────────────────────────────

function getPmStatusConfig(status: PMTask["status"]) {
  const MAP: Record<PMTask["status"], { label: string; color: string; bg: string }> = {
    completed: { label: "Completed", color: "#059669", bg: "#ECFDF5" },
    scheduled: { label: "Scheduled", color: "#64748B", bg: "#F1F5F9" },
    due_soon: { label: "Due Soon", color: "#D97706", bg: "#FFFBEB" },
    overdue: { label: "Overdue", color: "#DC2626", bg: "#FEF2F2" },
    in_progress: { label: "In Progress", color: "#2563EB", bg: "#EFF6FF" },
  };
  return MAP[status];
}

// ─── Breakdown severity config ────────────────────────────────────────────────

function getSeverityConfig(sev: BreakdownRecord["severity"]) {
  const MAP: Record<BreakdownRecord["severity"], { color: string; bg: string }> = {
    critical: { color: "#DC2626", bg: "#FEF2F2" },
    high: { color: "#EA580C", bg: "#FFF7ED" },
    medium: { color: "#D97706", bg: "#FFFBEB" },
    low: { color: "#059669", bg: "#ECFDF5" },
  };
  return MAP[sev];
}

// ─── PM Columns ───────────────────────────────────────────────────────────────

const PM_COLUMNS: Column<PMTask>[] = [
  {
    key: "id",
    header: "WO#",
    width: "110px",
    render: (v: string) => <span className="font-mono text-xs text-blue-700 font-semibold">{v}</span>,
  },
  {
    key: "equipment",
    header: "Equipment",
    sortable: true,
    render: (v: string) => <span className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[180px] block">{v}</span>,
  },
  {
    key: "taskDescription",
    header: "Task Description",
    render: (v: string) => <span className="text-xs text-slate-600 line-clamp-2 max-w-[280px] block">{v}</span>,
  },
  {
    key: "frequency",
    header: "Frequency",
    width: "130px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "lastDone",
    header: "Last Done",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "nextDue",
    header: "Next Due",
    sortable: true,
    width: "110px",
    render: (v: string, row: PMTask) => {
      const isOverdue = row.status === "overdue";
      const isDueSoon = row.status === "due_soon";
      return (
        <span
          className={cn(
            "text-xs font-medium",
            isOverdue ? "text-red-600" : isDueSoon ? "text-amber-600" : "text-slate-600"
          )}
        >
          {v}
        </span>
      );
    },
  },
  {
    key: "assignedTo",
    header: "Assigned To",
    width: "140px",
    render: (v: string, row: PMTask) => (
      <div className="flex items-center gap-2">
        <AvatarCircle initials={row.assignedInitials} color={row.assignedColor} size="xs" />
        <span className="text-xs text-slate-700">{v}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: PMTask["status"]) => {
      const cfg = getPmStatusConfig(v);
      return (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "estimatedHours",
    header: "Est. Hrs",
    width: "80px",
    render: (v: number) => <span className="text-xs text-slate-500">{v}h</span>,
  },
];

// ─── Breakdown Columns ────────────────────────────────────────────────────────

const BREAKDOWN_COLUMNS: Column<BreakdownRecord>[] = [
  {
    key: "id",
    header: "ID",
    width: "110px",
    render: (v: string) => <span className="font-mono text-xs text-slate-600 font-semibold">{v}</span>,
  },
  {
    key: "equipment",
    header: "Equipment",
    sortable: true,
    render: (v: string) => <span className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[160px] block">{v}</span>,
  },
  {
    key: "failureDescription",
    header: "Failure Description",
    render: (v: string) => <span className="text-xs text-slate-600 line-clamp-2 max-w-[280px] block">{v}</span>,
  },
  {
    key: "reportedTime",
    header: "Reported",
    sortable: true,
    width: "140px",
    render: (v: string, row: BreakdownRecord) => (
      <div>
        <p className="text-xs font-mono text-slate-700">{v}</p>
        <p className="text-xs text-slate-400">{row.reportedBy}</p>
      </div>
    ),
  },
  {
    key: "resolutionTime",
    header: "Resolved",
    width: "120px",
    render: (v: string | null) => (
      <span className="text-xs font-mono text-slate-600">{v ?? "—"}</span>
    ),
  },
  {
    key: "downtimeHrs",
    header: "Downtime",
    sortable: true,
    width: "100px",
    render: (v: number | null) => (
      <span className={cn("text-xs font-semibold", v && v > 8 ? "text-red-600" : "text-slate-700")}>
        {v != null ? `${v}h` : "Ongoing"}
      </span>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    sortable: true,
    width: "90px",
    render: (v: BreakdownRecord["severity"]) => {
      const cfg = getSeverityConfig(v);
      return (
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {v}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: BreakdownRecord["status"]) => {
      const MAP: Record<BreakdownRecord["status"], string> = {
        open: "open",
        in_progress: "in_progress",
        resolved: "completed",
      };
      return <StatusBadge status={MAP[v] ?? v} size="sm" />;
    },
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MaintenancePage() {
  // KPI summary
  const operational = EQUIPMENT_BOARD.filter((e) => e.health === "operational").length;
  const scheduled = EQUIPMENT_BOARD.filter((e) => e.health === "scheduled").length;
  const inRepair = EQUIPMENT_BOARD.filter((e) => e.health === "in_repair").length;
  const down = EQUIPMENT_BOARD.filter((e) => e.health === "down").length;
  const openBreakdowns = BREAKDOWN_LOG.filter((b) => b.status !== "resolved").length;
  const overduepm = PM_TASKS.filter((t) => t.status === "overdue").length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Maintenance</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Rig Alpha — Equipment status, preventive maintenance schedule &amp; breakdown log
          </p>
        </div>
        <div className="flex items-center gap-2">
          {down > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center">
              <p className="text-xs text-red-600 font-medium">Equipment Down</p>
              <p className="text-lg font-bold text-red-800">{down}</p>
            </div>
          )}
          {openBreakdowns > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-center">
              <p className="text-xs text-amber-600 font-medium">Open Breakdowns</p>
              <p className="text-lg font-bold text-amber-800">{openBreakdowns}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 1: Equipment Status Board ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-slate-800">Equipment Status Board</h2>
          <div className="flex items-center gap-1.5 ml-2 flex-wrap">
            {[
              { label: `${operational} Operational`, color: "#059669", bg: "#ECFDF5" },
              { label: `${scheduled} Scheduled PM`, color: "#2563EB", bg: "#EFF6FF" },
              { label: `${inRepair} In Repair`, color: "#D97706", bg: "#FFFBEB" },
              { label: `${down} Down`, color: "#DC2626", bg: "#FEF2F2" },
            ].map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ color: chip.color, backgroundColor: chip.bg }}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {EQUIPMENT_BOARD.map((eq) => {
            const cfg = getHealthConfig(eq.health);
            const Icon = eq.icon;
            const isOverdue = new Date(eq.nextDueDate) < new Date();
            return (
              <div
                key={eq.id}
                className={cn(
                  "rounded-lg border p-4 flex flex-col gap-3 transition-all hover:shadow-sm",
                  eq.health === "down" ? "border-red-200 bg-red-50/30" :
                  eq.health === "in_repair" ? "border-amber-200 bg-amber-50/20" :
                  "border-slate-200 bg-white"
                )}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-md p-1.5"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <Icon className="size-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2">{eq.name}</p>
                      <p className="text-[10px] text-slate-400">{eq.category}</p>
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0"
                    style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.borderColor }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                    {cfg.label}
                  </span>
                </div>
                {/* Details */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Last Service</span>
                    <span className="text-[10px] text-slate-600 font-medium">{eq.lastServiceDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Next Due</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        isOverdue ? "text-red-600" : "text-slate-600"
                      )}
                    >
                      {eq.nextDueDate}
                      {isOverdue && " (OVERDUE)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Location</span>
                    <span className="text-[10px] text-slate-500">{eq.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: Preventive Maintenance Schedule ── */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Preventive Maintenance Schedule
              {overduepm > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold bg-red-50 text-red-700">
                  <AlertTriangle className="size-3" /> {overduepm} Overdue
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{PM_TASKS.length} scheduled tasks</p>
          </div>
        </div>
        <div className="p-5">
          <DataTable<PMTask>
            data={PM_TASKS}
            columns={PM_COLUMNS}
            searchPlaceholder="Search tasks..."
            searchKeys={["equipment", "taskDescription", "assignedTo", "id"]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Scheduled", value: "scheduled" },
                  { label: "Due Soon", value: "due_soon" },
                  { label: "Overdue", value: "overdue" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Completed", value: "completed" },
                ],
              },
            ]}
            emptyMessage="No PM tasks found."
            itemLabel="tasks"
            pageSize={10}
          />
        </div>
      </div>

      {/* ── SECTION 3: Breakdown Log ── */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Breakdown Log
              {openBreakdowns > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold bg-amber-50 text-amber-700">
                  <AlertCircle className="size-3" /> {openBreakdowns} Open
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{BREAKDOWN_LOG.length} records</p>
          </div>
        </div>
        <div className="p-5">
          <DataTable<BreakdownRecord>
            data={BREAKDOWN_LOG}
            columns={BREAKDOWN_COLUMNS}
            searchPlaceholder="Search breakdowns..."
            searchKeys={["equipment", "failureDescription", "reportedBy", "id"]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Open", value: "open" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Resolved", value: "resolved" },
                ],
              },
              {
                key: "severity",
                label: "Severity",
                options: [
                  { label: "Critical", value: "critical" },
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ],
              },
            ]}
            emptyMessage="No breakdown records found."
            itemLabel="breakdowns"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
