"use client";

import * as React from "react";
import {
  Eye,
  Truck,
  Package,
  Users,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogisticsRequestType =
  | "Material Transfer"
  | "Equipment Move"
  | "Personnel Transport";

type LogisticsStatus =
  | "Requested"
  | "Approved"
  | "Loading"
  | "In Transit"
  | "Delivered"
  | "Completed";

type Priority = "Critical" | "High" | "Medium" | "Low";

interface LogisticsRequest {
  id: string;
  requestId: string;
  type: LogisticsRequestType;
  origin: string;
  destination: string;
  status: LogisticsStatus;
  priority: Priority;
  requestedBy: string;
  date: string;
  cargo?: string;
  vehicle?: string;
  eta?: string;
}

// ─── Inline Data ──────────────────────────────────────────────────────────────

const LOGISTICS_REQUESTS: LogisticsRequest[] = [
  {
    id: "LR-001",
    requestId: "LOG-2026-001",
    type: "Material Transfer",
    origin: "Dammam Base Warehouse",
    destination: "Rig Alpha (AD-201)",
    status: "In Transit",
    priority: "High",
    requestedBy: "Ahmed Al-Rashidi",
    date: "2026-02-25",
    cargo: "Mud pump liner sets x3, BOP seals",
    vehicle: "Flatbed Truck — TRK-001",
    eta: "2026-02-27",
  },
  {
    id: "LR-002",
    requestId: "LOG-2026-002",
    type: "Personnel Transport",
    origin: "Dammam Base Camp",
    destination: "Rig Bravo (AD-202)",
    status: "Completed",
    priority: "Medium",
    requestedBy: "Sara Al-Otaibi",
    date: "2026-02-24",
    cargo: "25 personnel — crew rotation",
    vehicle: "Bus TRK-004 + Supervisor SUV",
    eta: "2026-02-24",
  },
  {
    id: "LR-003",
    requestId: "LOG-2026-003",
    type: "Equipment Move",
    origin: "Rig Charlie (AD-203)",
    destination: "Dammam Base — Workshop",
    status: "Approved",
    priority: "Medium",
    requestedBy: "Khalid Al-Zahrani",
    date: "2026-02-26",
    cargo: "Top Drive assembly (TDS-11SA) — for overhaul",
    vehicle: "Heavy Lowbed — TRK-007",
    eta: "2026-02-28",
  },
  {
    id: "LR-004",
    requestId: "LOG-2026-004",
    type: "Material Transfer",
    origin: "Dammam Base Warehouse",
    destination: "Rig Charlie (AD-203)",
    status: "Loading",
    priority: "High",
    requestedBy: "Mohammed Al-Ghamdi",
    date: "2026-02-26",
    cargo: "Barite 800 bags, KCl 200 bags, PAC-LV 100 bags",
    vehicle: "Cargo Truck TRK-003",
    eta: "2026-02-27",
  },
  {
    id: "LR-005",
    requestId: "LOG-2026-005",
    type: "Material Transfer",
    origin: "Dammam Port (SASO Customs)",
    destination: "Dammam Base Warehouse",
    status: "Delivered",
    priority: "Critical",
    requestedBy: "Faisal Al-Shammari",
    date: "2026-02-23",
    cargo: "VSD Module ABB ACS880-37 — 500kW (critical spare)",
    vehicle: "Specialized Transport TRK-009",
    eta: "2026-02-23",
  },
  {
    id: "LR-006",
    requestId: "LOG-2026-006",
    type: "Personnel Transport",
    origin: "Rig Alpha (AD-201)",
    destination: "Dammam Base Camp",
    status: "Completed",
    priority: "Medium",
    requestedBy: "Omar Al-Dossary",
    date: "2026-02-20",
    cargo: "22 personnel — end of rotation",
    vehicle: "Bus TRK-004",
    eta: "2026-02-20",
  },
  {
    id: "LR-007",
    requestId: "LOG-2026-007",
    type: "Material Transfer",
    origin: "Dammam Base Warehouse",
    destination: "Rig Alpha (AD-201)",
    status: "Requested",
    priority: "Medium",
    requestedBy: "Tariq Al-Mutairi",
    date: "2026-02-27",
    cargo: "Shale shaker screens x40, drill pipe thread compound x20 tins",
    vehicle: "Pending Assignment",
    eta: "2026-02-28",
  },
  {
    id: "LR-008",
    requestId: "LOG-2026-008",
    type: "Equipment Move",
    origin: "Dammam Base — Workshop",
    destination: "Rig Bravo (AD-202)",
    status: "Approved",
    priority: "High",
    requestedBy: "Ali Hassan Al-Barrak",
    date: "2026-02-27",
    cargo: "Refurbished mud pump fluid end assembly — National 12-P-160",
    vehicle: "Flatbed TRK-002",
    eta: "2026-03-01",
  },
  {
    id: "LR-009",
    requestId: "LOG-2026-009",
    type: "Material Transfer",
    origin: "Dammam Base Warehouse",
    destination: "Rig Bravo (AD-202)",
    status: "In Transit",
    priority: "Low",
    requestedBy: "Yasser Al-Malik",
    date: "2026-02-26",
    cargo: "PPE bulk order — helmets x50, gloves x100 pairs, vests x60",
    vehicle: "Light Truck TRK-005",
    eta: "2026-02-27",
  },
  {
    id: "LR-010",
    requestId: "LOG-2026-010",
    type: "Personnel Transport",
    origin: "King Fahd International Airport",
    destination: "Dammam Base Camp",
    status: "Completed",
    priority: "Medium",
    requestedBy: "Ibrahim Al-Juhani",
    date: "2026-02-25",
    cargo: "8 personnel — expat specialists arrival",
    vehicle: "SUV Fleet x3",
    eta: "2026-02-25",
  },
  {
    id: "LR-011",
    requestId: "LOG-2026-011",
    type: "Material Transfer",
    origin: "Rig Alpha (AD-201)",
    destination: "Dammam Base Warehouse",
    status: "Requested",
    priority: "Low",
    requestedBy: "Nasser Al-Qahtani",
    date: "2026-02-27",
    cargo: "Used drill bits x3 (for inspection), worn drill pipe subs",
    vehicle: "Pending Assignment",
    eta: "2026-03-02",
  },
  {
    id: "LR-012",
    requestId: "LOG-2026-012",
    type: "Equipment Move",
    origin: "Dammam Base Warehouse",
    destination: "Rig Charlie (AD-203)",
    status: "Approved",
    priority: "Critical",
    requestedBy: "Sultan Al-Anzi",
    date: "2026-02-27",
    cargo: "Emergency BOP pipe ram block assembly — Shaffer 13-5/8\" 10,000 PSI",
    vehicle: "Express Truck TRK-008",
    eta: "2026-02-27",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusMapped(status: LogisticsStatus): string {
  const MAP: Record<LogisticsStatus, string> = {
    Requested: "pending",
    Approved: "approved",
    Loading: "in_progress",
    "In Transit": "in_progress",
    Delivered: "accepted",
    Completed: "completed",
  };
  return MAP[status] ?? "pending";
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const CONFIG: Record<Priority, { color: string; bg: string }> = {
    Critical: { color: "#DC2626", bg: "#FEF2F2" },
    High: { color: "#EA580C", bg: "#FFF7ED" },
    Medium: { color: "#D97706", bg: "#FFFBEB" },
    Low: { color: "#64748B", bg: "#F1F5F9" },
  };
  const { color, bg } = CONFIG[priority];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {priority}
    </span>
  );
}

function TypeIcon({ type }: { type: LogisticsRequestType }) {
  if (type === "Material Transfer") return <Package className="size-3.5 text-blue-500 shrink-0" />;
  if (type === "Equipment Move") return <Truck className="size-3.5 text-orange-500 shrink-0" />;
  return <Users className="size-3.5 text-purple-500 shrink-0" />;
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const COLUMNS: Column<LogisticsRequest>[] = [
  {
    key: "requestId",
    header: "Request ID",
    sortable: true,
    width: "130px",
    render: (v: string) => (
      <span className="font-mono text-xs font-semibold text-blue-600">{v}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    width: "170px",
    render: (v: LogisticsRequestType) => (
      <div className="flex items-center gap-1.5">
        <TypeIcon type={v} />
        <span className="text-xs text-slate-700">{v}</span>
      </div>
    ),
  },
  {
    key: "origin",
    header: "Origin",
    sortable: true,
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-1 max-w-[160px]">{v}</span>
    ),
  },
  {
    key: "destination",
    header: "Destination",
    sortable: true,
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-1 max-w-[160px]">{v}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: LogisticsStatus) => <StatusBadge status={getStatusMapped(v)} size="sm" />,
  },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    width: "90px",
    render: (v: Priority) => <PriorityBadge priority={v} />,
  },
  {
    key: "requestedBy",
    header: "Requested By",
    sortable: true,
    width: "150px",
    render: (v: string) => <span className="text-xs text-slate-700">{v}</span>,
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "100px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "_actions",
    header: "Actions",
    width: "120px",
    render: (_: any, row: LogisticsRequest) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Eye className="size-3.5 mr-1" />
          View
        </Button>
        {(row.status === "Requested") && (
          <Button size="sm" className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white">
            Approve
          </Button>
        )}
      </div>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LogisticsRequestsPage() {
  const counts = React.useMemo(() => {
    return {
      total: LOGISTICS_REQUESTS.length,
      inTransit: LOGISTICS_REQUESTS.filter((r) => r.status === "In Transit").length,
      pending: LOGISTICS_REQUESTS.filter(
        (r) => r.status === "Requested" || r.status === "Approved" || r.status === "Loading"
      ).length,
      completed: LOGISTICS_REQUESTS.filter(
        (r) => r.status === "Completed" || r.status === "Delivered"
      ).length,
      critical: LOGISTICS_REQUESTS.filter((r) => r.priority === "Critical").length,
    };
  }, []);

  const kpis = [
    {
      label: "Total Requests",
      value: counts.total,
      sub: "All time",
      color: "text-slate-800",
      bg: "bg-slate-50 border-slate-200",
      icon: <Package className="size-4 text-slate-400" />,
    },
    {
      label: "In Transit",
      value: counts.inTransit,
      sub: "Currently moving",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
      icon: <Truck className="size-4 text-blue-500" />,
    },
    {
      label: "Pending Action",
      value: counts.pending,
      sub: "Awaiting processing",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
      icon: <Clock className="size-4 text-amber-500" />,
    },
    {
      label: "Completed",
      value: counts.completed,
      sub: "This cycle",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Logistics Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage material transfers, equipment moves and personnel transport across all rigs
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Plus className="size-3.5" />
          New Request
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={cn("rounded-lg border px-4 py-3 flex items-start gap-3", kpi.bg)}>
            <div className="mt-0.5">{kpi.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
              <p className={cn("text-2xl font-bold mt-0.5", kpi.color)}>{kpi.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            All Logistics Requests
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({LOGISTICS_REQUESTS.length} requests)
            </span>
          </h2>
        </div>
        <div className="p-5">
          <DataTable<LogisticsRequest>
            data={LOGISTICS_REQUESTS}
            columns={COLUMNS}
            searchPlaceholder="Search requests, cargo, locations..."
            searchKeys={["requestId", "origin", "destination", "requestedBy", "cargo"]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Requested", value: "Requested" },
                  { label: "Approved", value: "Approved" },
                  { label: "Loading", value: "Loading" },
                  { label: "In Transit", value: "In Transit" },
                  { label: "Delivered", value: "Delivered" },
                  { label: "Completed", value: "Completed" },
                ],
              },
              {
                key: "type",
                label: "Type",
                options: [
                  { label: "Material Transfer", value: "Material Transfer" },
                  { label: "Equipment Move", value: "Equipment Move" },
                  { label: "Personnel Transport", value: "Personnel Transport" },
                ],
              },
              {
                key: "priority",
                label: "Priority",
                options: [
                  { label: "Critical", value: "Critical" },
                  { label: "High", value: "High" },
                  { label: "Medium", value: "Medium" },
                  { label: "Low", value: "Low" },
                ],
              },
            ]}
            itemLabel="requests"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
