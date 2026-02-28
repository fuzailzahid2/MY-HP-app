"use client";

import * as React from "react";
import {
  Eye,
  Printer,
  Send,
  Package,
  Truck,
  CheckCircle2,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type OutgoingStatus =
  | "Draft"
  | "Pending Logistics"
  | "Loading"
  | "Dispatched"
  | "Delivered";

interface OutgoingManifest {
  id: string;
  manifestId: string;
  destination: string;
  itemsCount: number;
  itemsSummary: string;
  status: OutgoingStatus;
  preparedBy: string;
  date: string;
  approvedBy?: string;
  vehicleRef?: string;
  dispatchedDate?: string;
  deliveredDate?: string;
  logisticsRequestRef?: string;
  totalWeightKg?: number;
}

// ─── Inline Data ──────────────────────────────────────────────────────────────

const OUTGOING_MANIFESTS: OutgoingManifest[] = [
  {
    id: "OUT-001",
    manifestId: "MAN-2026-001",
    destination: "Rig Alpha (AD-201)",
    itemsCount: 6,
    itemsSummary: "Mud pump liner sets x3, valve assemblies x2, thread compound x20 tins",
    status: "Dispatched",
    preparedBy: "Ahmed Al-Rashidi",
    date: "2026-02-25",
    approvedBy: "Hassan Al-Sayed",
    vehicleRef: "TRK-001 (LOG-2026-001)",
    dispatchedDate: "2026-02-25",
    logisticsRequestRef: "LOG-2026-001",
    totalWeightKg: 1250,
  },
  {
    id: "OUT-002",
    manifestId: "MAN-2026-002",
    destination: "Rig Bravo (AD-202)",
    itemsCount: 3,
    itemsSummary: "Safety helmets x50, mechanic gloves x100 pairs, HiVis vests x60",
    status: "Delivered",
    preparedBy: "Sara Al-Otaibi",
    date: "2026-02-24",
    approvedBy: "Mohammed Al-Ghamdi",
    vehicleRef: "TRK-005 (LOG-2026-009)",
    dispatchedDate: "2026-02-26",
    deliveredDate: "2026-02-26",
    logisticsRequestRef: "LOG-2026-009",
    totalWeightKg: 320,
  },
  {
    id: "OUT-003",
    manifestId: "MAN-2026-003",
    destination: "Rig Charlie (AD-203)",
    itemsCount: 4,
    itemsSummary: "Barite bags x800, KCl bags x200, PAC-LV bags x100, biocide drums x4",
    status: "Loading",
    preparedBy: "Mohammed Al-Ghamdi",
    date: "2026-02-26",
    approvedBy: "Faisal Al-Shammari",
    vehicleRef: "TRK-003 (LOG-2026-004)",
    logisticsRequestRef: "LOG-2026-004",
    totalWeightKg: 56200,
  },
  {
    id: "OUT-004",
    manifestId: "MAN-2026-004",
    destination: "Rig Charlie (AD-203)",
    itemsCount: 1,
    itemsSummary: "Emergency BOP pipe ram block assembly — Shaffer 13-5/8\" 10,000 PSI x1",
    status: "Pending Logistics",
    preparedBy: "Sultan Al-Anzi",
    date: "2026-02-27",
    approvedBy: "Hassan Al-Sayed",
    logisticsRequestRef: "LOG-2026-012",
    totalWeightKg: 680,
  },
  {
    id: "OUT-005",
    manifestId: "MAN-2026-005",
    destination: "Rig Bravo (AD-202)",
    itemsCount: 2,
    itemsSummary: "Refurbished mud pump fluid end assembly x1, shale shaker screens x20",
    status: "Pending Logistics",
    preparedBy: "Ali Hassan Al-Barrak",
    date: "2026-02-27",
    logisticsRequestRef: "LOG-2026-008",
    totalWeightKg: 2100,
  },
  {
    id: "OUT-006",
    manifestId: "MAN-2026-006",
    destination: "Rig Alpha (AD-201)",
    itemsCount: 8,
    itemsSummary: "Shale shaker screens x40, drill bits PDC x1, thread compound x10, gear oil x8",
    status: "Draft",
    preparedBy: "Tariq Al-Mutairi",
    date: "2026-02-27",
    totalWeightKg: 890,
  },
  {
    id: "OUT-007",
    manifestId: "MAN-2025-089",
    destination: "Rig Alpha (AD-201)",
    itemsCount: 5,
    itemsSummary: "Drilling line spool x1, saver subs x2, rotary bearing x1, accumulator bladders x12",
    status: "Delivered",
    preparedBy: "Nasser Al-Qahtani",
    date: "2025-12-15",
    approvedBy: "Hassan Al-Sayed",
    vehicleRef: "TRK-007",
    dispatchedDate: "2025-12-16",
    deliveredDate: "2025-12-16",
    totalWeightKg: 4200,
  },
  {
    id: "OUT-008",
    manifestId: "MAN-2026-007",
    destination: "Dammam Base — Workshop",
    itemsCount: 3,
    itemsSummary: "Failed VSD module (for evaluation) x1, worn drill pipe subs x2",
    status: "Draft",
    preparedBy: "Ibrahim Al-Juhani",
    date: "2026-02-27",
    totalWeightKg: 520,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusMapped(status: OutgoingStatus): string {
  const MAP: Record<OutgoingStatus, string> = {
    Draft: "draft",
    "Pending Logistics": "pending",
    Loading: "in_progress",
    Dispatched: "submitted",
    Delivered: "completed",
  };
  return MAP[status] ?? "draft";
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const COLUMNS: Column<OutgoingManifest>[] = [
  {
    key: "manifestId",
    header: "Manifest ID",
    sortable: true,
    width: "140px",
    render: (v: string) => (
      <span className="font-mono text-xs font-semibold text-blue-600">{v}</span>
    ),
  },
  {
    key: "destination",
    header: "Destination (Rig)",
    sortable: true,
    width: "190px",
    render: (v: string) => (
      <div className="flex items-center gap-1.5">
        <Truck className="size-3.5 text-slate-400 shrink-0" />
        <span className="text-xs font-medium text-slate-800">{v}</span>
      </div>
    ),
  },
  {
    key: "itemsCount",
    header: "Items",
    sortable: true,
    width: "70px",
    render: (v: number) => (
      <span className="text-xs font-semibold text-slate-700">{v}</span>
    ),
  },
  {
    key: "itemsSummary",
    header: "Items Description",
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-xs">{v}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "140px",
    render: (v: OutgoingStatus) => <StatusBadge status={getStatusMapped(v)} size="sm" />,
  },
  {
    key: "preparedBy",
    header: "Prepared By",
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
    width: "200px",
    render: (_: any, row: OutgoingManifest) => (
      <div className="flex items-center gap-1 flex-wrap">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Eye className="size-3.5 mr-1" />
          View
        </Button>
        {(row.status === "Dispatched" || row.status === "Delivered" || row.status === "Loading") && (
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
            <Printer className="size-3.5 mr-1" />
            Print
          </Button>
        )}
        {row.status === "Draft" && (
          <Button
            size="sm"
            className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="size-3.5 mr-1" />
            Submit to Logistics
          </Button>
        )}
        {row.status === "Pending Logistics" && (
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
            <Printer className="size-3.5 mr-1" />
            Print Manifest
          </Button>
        )}
      </div>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OutgoingMaterialsPage() {
  const counts = React.useMemo(() => ({
    draft: OUTGOING_MANIFESTS.filter((m) => m.status === "Draft").length,
    pending: OUTGOING_MANIFESTS.filter((m) => m.status === "Pending Logistics").length,
    dispatched: OUTGOING_MANIFESTS.filter(
      (m) => m.status === "Dispatched" || m.status === "Loading"
    ).length,
    delivered: OUTGOING_MANIFESTS.filter((m) => m.status === "Delivered").length,
  }), []);

  const kpis = [
    {
      label: "Total Manifests",
      value: OUTGOING_MANIFESTS.length,
      sub: "All records",
      color: "text-slate-800",
      bg: "bg-slate-50 border-slate-200",
      icon: <FileText className="size-4 text-slate-400" />,
    },
    {
      label: "Draft",
      value: counts.draft,
      sub: "Awaiting submission",
      color: "text-slate-700",
      bg: "bg-slate-50 border-slate-200",
      icon: <Package className="size-4 text-slate-400" />,
    },
    {
      label: "In Transit",
      value: counts.dispatched,
      sub: "Loading or dispatched",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
      icon: <Truck className="size-4 text-blue-500" />,
    },
    {
      label: "Delivered",
      value: counts.delivered,
      sub: "Confirmed received",
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
          <h1 className="text-xl font-bold text-slate-900">Outgoing Materials</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Prepare dispatch manifests and track outbound material movements to rigs
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Plus className="size-3.5" />
          New Manifest
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
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            Dispatch Manifests
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({OUTGOING_MANIFESTS.length} records)
            </span>
          </h2>
        </div>
        <div className="p-5">
          <DataTable<OutgoingManifest>
            data={OUTGOING_MANIFESTS}
            columns={COLUMNS}
            searchPlaceholder="Search manifest ID, destination, items..."
            searchKeys={["manifestId", "destination", "itemsSummary", "preparedBy", "vehicleRef"]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Draft", value: "Draft" },
                  { label: "Pending Logistics", value: "Pending Logistics" },
                  { label: "Loading", value: "Loading" },
                  { label: "Dispatched", value: "Dispatched" },
                  { label: "Delivered", value: "Delivered" },
                ],
              },
              {
                key: "destination",
                label: "Destination",
                options: [
                  { label: "Rig Alpha", value: "Rig Alpha (AD-201)" },
                  { label: "Rig Bravo", value: "Rig Bravo (AD-202)" },
                  { label: "Rig Charlie", value: "Rig Charlie (AD-203)" },
                  { label: "Dammam Base", value: "Dammam Base — Workshop" },
                ],
              },
            ]}
            itemLabel="manifests"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
