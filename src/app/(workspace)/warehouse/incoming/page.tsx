"use client";

import * as React from "react";
import {
  Eye,
  PackageCheck,
  ClipboardList,
  Package,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type IncomingStatus =
  | "Expected"
  | "Received"
  | "QC Review"
  | "Released"
  | "Rejected";

interface IncomingShipment {
  id: string;
  poNumber: string;
  supplier: string;
  items: string;
  itemCount: number;
  expectedDate: string;
  receivedDate?: string;
  status: IncomingStatus;
  receivedBy?: string;
  invoiceRef?: string;
  deliveryNote?: string;
  qcNotes?: string;
  totalValueSAR?: number;
}

// ─── Inline Data ──────────────────────────────────────────────────────────────

const INCOMING_SHIPMENTS: IncomingShipment[] = [
  {
    id: "INC-001",
    poNumber: "PO-2026-0145",
    supplier: "NOV Parts & Aftermarket",
    items: "Mud pump liner & piston sets (6.5\") x3, Valve assembly x2",
    itemCount: 5,
    expectedDate: "2026-02-28",
    receivedDate: "2026-02-27",
    status: "QC Review",
    receivedBy: "Ahmed Al-Rashidi",
    invoiceRef: "NOV-INV-28891",
    deliveryNote: "DN-28891-A",
    qcNotes: "Visual inspection in progress. Part numbers being verified against PO.",
    totalValueSAR: 62500,
  },
  {
    id: "INC-002",
    poNumber: "PO-2026-0098",
    supplier: "MSA Safety Arabia",
    items: "H2S Multi-gas monitors (Altair 5X) x15, Safety helmets (yellow) x200",
    itemCount: 215,
    expectedDate: "2026-02-25",
    receivedDate: "2026-02-25",
    status: "Released",
    receivedBy: "Sara Al-Otaibi",
    invoiceRef: "MSA-INV-45621",
    deliveryNote: "DN-45621-B",
    totalValueSAR: 54450,
  },
  {
    id: "INC-003",
    poNumber: "PO-2026-0112",
    supplier: "Tenaris ME",
    items: "9-5/8\" K-55 BTC Casing joints x60, 7\" L-80 BTC Production Casing x40",
    itemCount: 100,
    expectedDate: "2026-03-05",
    status: "Expected",
    invoiceRef: "TEN-INV-78032",
    totalValueSAR: 1438000,
  },
  {
    id: "INC-004",
    poNumber: "PO-2026-0089",
    supplier: "Halliburton Drilling Fluids",
    items: "PAC-LV fluid loss control (25kg bags) x200",
    itemCount: 200,
    expectedDate: "2026-02-26",
    receivedDate: "2026-02-26",
    status: "Released",
    receivedBy: "Mohammed Al-Ghamdi",
    invoiceRef: "HAL-INV-11204",
    deliveryNote: "DN-11204-A",
    totalValueSAR: 24000,
  },
  {
    id: "INC-005",
    poNumber: "PO-2026-0077",
    supplier: "Yamama Cement Company",
    items: "API Class G HSR Cement (50kg bags) x2000",
    itemCount: 2000,
    expectedDate: "2026-02-24",
    receivedDate: "2026-02-24",
    status: "Released",
    receivedBy: "Khalid Al-Zahrani",
    invoiceRef: "YAM-INV-99234",
    deliveryNote: "DN-99234",
    totalValueSAR: 56000,
  },
  {
    id: "INC-006",
    poNumber: "PO-2026-0131",
    supplier: "NOV Process & Flow Technologies",
    items: "BOP Blind-Shear Ram Block Assembly (13-5/8\" 10,000 PSI) x1",
    itemCount: 1,
    expectedDate: "2026-03-10",
    status: "Expected",
    invoiceRef: "NOV-PFT-INV-20045",
    totalValueSAR: 125000,
  },
  {
    id: "INC-007",
    poNumber: "PO-2026-0055",
    supplier: "Safety Supplies Arabia",
    items: "Safety boots (steel toe, sizes 7-12) x80 pairs, Chemical splash goggles x100",
    itemCount: 180,
    expectedDate: "2026-02-20",
    receivedDate: "2026-02-22",
    status: "Rejected",
    receivedBy: "Faisal Al-Shammari",
    invoiceRef: "SSA-INV-34510",
    deliveryNote: "DN-34510",
    qcNotes: "Boot sizing incorrect — sizes 13-15 received instead of 7-12. NCO raised. Supplier to collect and redeliver.",
    totalValueSAR: 36950,
  },
  {
    id: "INC-008",
    poNumber: "PO-2026-0119",
    supplier: "Schlumberger Supply Chain",
    items: "Barite weighting agent API Grade (50kg bags) x1500",
    itemCount: 1500,
    expectedDate: "2026-03-02",
    status: "Expected",
    invoiceRef: "SLB-INV-60112",
    totalValueSAR: 127500,
  },
  {
    id: "INC-009",
    poNumber: "PO-2026-0042",
    supplier: "ABB Saudi Arabia",
    items: "VSD Module ABB ACS880-37 500kW 690V x1 (critical spare)",
    itemCount: 1,
    expectedDate: "2026-02-10",
    receivedDate: "2026-02-10",
    status: "Released",
    receivedBy: "Ali Hassan Al-Barrak",
    invoiceRef: "ABB-INV-98714",
    deliveryNote: "DN-98714-A",
    qcNotes: "OEM documentation verified. Serial number logged. Stored in electrical store H-01-01.",
    totalValueSAR: 185000,
  },
  {
    id: "INC-010",
    poNumber: "PO-2026-0160",
    supplier: "Derrick Equipment ME",
    items: "Shale shaker screens FLC500 API 100 mesh x80 panels",
    itemCount: 80,
    expectedDate: "2026-03-01",
    receivedDate: "2026-02-28",
    status: "QC Review",
    receivedBy: "Omar Al-Dossary",
    invoiceRef: "DER-INV-21567",
    deliveryNote: "DN-21567",
    qcNotes: "Mesh count verification in progress against API specification.",
    totalValueSAR: 30400,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusMapped(status: IncomingStatus): string {
  const MAP: Record<IncomingStatus, string> = {
    Expected: "pending",
    Received: "submitted",
    "QC Review": "in_review",
    Released: "completed",
    Rejected: "rejected",
  };
  return MAP[status] ?? "pending";
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const COLUMNS: Column<IncomingShipment>[] = [
  {
    key: "poNumber",
    header: "PO Number",
    sortable: true,
    width: "140px",
    render: (v: string) => (
      <span className="font-mono text-xs font-semibold text-blue-600">{v}</span>
    ),
  },
  {
    key: "supplier",
    header: "Supplier",
    sortable: true,
    width: "200px",
    render: (v: string) => (
      <span className="text-xs font-medium text-slate-800 line-clamp-1">{v}</span>
    ),
  },
  {
    key: "items",
    header: "Items",
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-xs">{v}</span>
    ),
  },
  {
    key: "itemCount",
    header: "Qty",
    sortable: true,
    width: "70px",
    render: (v: number) => (
      <span className="text-xs font-medium text-slate-700">{v.toLocaleString()}</span>
    ),
  },
  {
    key: "expectedDate",
    header: "Expected Date",
    sortable: true,
    width: "120px",
    render: (v: string, row: IncomingShipment) => {
      const isOverdue = !row.receivedDate && new Date(v) < new Date();
      return (
        <span
          className={cn(
            "text-xs",
            isOverdue ? "text-red-600 font-medium" : "text-slate-600"
          )}
        >
          {v}
        </span>
      );
    },
  },
  {
    key: "receivedDate",
    header: "Received Date",
    sortable: true,
    width: "120px",
    render: (v: string | undefined) => (
      <span className="text-xs text-slate-500">{v ?? "—"}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: IncomingStatus) => <StatusBadge status={getStatusMapped(v)} size="sm" />,
  },
  {
    key: "_actions",
    header: "Actions",
    width: "180px",
    render: (_: any, row: IncomingShipment) => (
      <div className="flex items-center gap-1 flex-wrap">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Eye className="size-3.5 mr-1" />
          View
        </Button>
        {row.status === "Expected" && (
          <Button
            size="sm"
            className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <PackageCheck className="size-3.5 mr-1" />
            Receive
          </Button>
        )}
        {row.status === "Received" && (
          <Button
            size="sm"
            className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ClipboardList className="size-3.5 mr-1" />
            QC Review
          </Button>
        )}
        {row.status === "QC Review" && (
          <>
            <Button
              size="sm"
              className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Release
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs border-red-300 text-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
          </>
        )}
      </div>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IncomingMaterialsPage() {
  const counts = React.useMemo(() => ({
    expected: INCOMING_SHIPMENTS.filter((s) => s.status === "Expected").length,
    qcReview: INCOMING_SHIPMENTS.filter((s) => s.status === "QC Review").length,
    released: INCOMING_SHIPMENTS.filter((s) => s.status === "Released").length,
    rejected: INCOMING_SHIPMENTS.filter((s) => s.status === "Rejected").length,
    totalValue: INCOMING_SHIPMENTS.reduce((s, i) => s + (i.totalValueSAR ?? 0), 0),
  }), []);

  const kpis = [
    {
      label: "Expected Shipments",
      value: counts.expected,
      sub: "Awaiting receipt",
      color: "text-slate-700",
      bg: "bg-slate-50 border-slate-200",
      icon: <Package className="size-4 text-slate-400" />,
    },
    {
      label: "In QC Review",
      value: counts.qcReview,
      sub: "Pending inspection",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
      icon: <ClipboardList className="size-4 text-blue-500" />,
    },
    {
      label: "Released",
      value: counts.released,
      sub: "This period",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
    },
    {
      label: "Rejected",
      value: counts.rejected,
      sub: "Non-conforming",
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
      icon: <AlertTriangle className="size-4 text-red-500" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Incoming Materials</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track inbound shipments from PO through receipt, QC review and stock release
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Plus className="size-3.5" />
          Register Shipment
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
            Incoming Shipments
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({INCOMING_SHIPMENTS.length} records)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Total value on order / in review:{" "}
            <span className="font-semibold text-slate-600">
              SAR {counts.totalValue.toLocaleString()}
            </span>
          </p>
        </div>
        <div className="p-5">
          <DataTable<IncomingShipment>
            data={INCOMING_SHIPMENTS}
            columns={COLUMNS}
            searchPlaceholder="Search PO number, supplier, items..."
            searchKeys={["poNumber", "supplier", "items", "invoiceRef", "receivedBy"]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Expected", value: "Expected" },
                  { label: "Received", value: "Received" },
                  { label: "QC Review", value: "QC Review" },
                  { label: "Released", value: "Released" },
                  { label: "Rejected", value: "Rejected" },
                ],
              },
            ]}
            itemLabel="shipments"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
