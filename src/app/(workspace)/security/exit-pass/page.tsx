"use client";

import * as React from "react";
import {
  Eye,
  Printer,
  ShieldCheck,
  Package,
  UserCheck,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExitPassStatus = "Pending" | "Approved" | "Used";

type ExitPassCategory = "Material Exit" | "Personnel Exit" | "Equipment Return";

interface ExitPass {
  id: string;
  passId: string;
  personOrCompany: string;
  category: ExitPassCategory;
  itemsDescription: string;
  authorization: string;
  authorizationRef?: string;
  status: ExitPassStatus;
  date: string;
  requestedBy: string;
  approvedBy?: string;
  usedAt?: string;
  vehicleReg?: string;
  destination?: string;
  notes?: string;
}

// ─── Inline Data ──────────────────────────────────────────────────────────────

const EXIT_PASSES: ExitPass[] = [
  {
    id: "EP-001",
    passId: "EP-2026-001",
    personOrCompany: "NOV Parts & Aftermarket",
    category: "Material Exit",
    itemsDescription: "Used mud pump fluid end assembly (failed) — for remanufacture; 2x worn valve assemblies",
    authorization: "Maintenance Manager",
    authorizationRef: "WO-2026-0045",
    status: "Used",
    date: "2026-02-26",
    requestedBy: "Ahmed Al-Rashidi",
    approvedBy: "Hassan Al-Sayed",
    usedAt: "2026-02-26 10:30",
    vehicleReg: "ABC-1234 (NOV Service Van)",
    destination: "NOV Workshop — Dammam Industrial Area",
  },
  {
    id: "EP-002",
    passId: "EP-2026-002",
    personOrCompany: "Jean-Pierre Dupont / NOV",
    category: "Personnel Exit",
    itemsDescription: "NOV service engineer — departure after pump maintenance completion",
    authorization: "Ahmed Al-Rashidi (Host)",
    authorizationRef: "GP-2026-001",
    status: "Approved",
    date: "2026-02-27",
    requestedBy: "Ahmed Al-Rashidi",
    approvedBy: "Gate Control — Ali Hassan",
    vehicleReg: "ABC-1234 (White Van)",
    destination: "Dammam Base Exit",
  },
  {
    id: "EP-003",
    passId: "EP-2026-003",
    personOrCompany: "Safety Supplies Arabia",
    category: "Material Exit",
    itemsDescription: "Rejected safety boot shipment — 80 pairs (wrong sizes). Ref: NCO raised. Return to supplier.",
    authorization: "Warehouse Manager",
    authorizationRef: "NCO-2026-012 / PO-2026-0055",
    status: "Approved",
    date: "2026-02-27",
    requestedBy: "Faisal Al-Shammari",
    approvedBy: "Mohammed Al-Ghamdi",
    vehicleReg: "SSA-DEL-77 (Delivery Truck)",
    destination: "Supplier Warehouse — Jeddah",
    notes: "Non-conforming goods return. NCO-2026-012 reference must be on waybill.",
  },
  {
    id: "EP-004",
    passId: "EP-2026-004",
    personOrCompany: "Dr. Laila Al-Mansouri / Bureau Veritas",
    category: "Personnel Exit",
    itemsDescription: "OHSE auditor — departure; taking audit documentation and photos (pre-approved)",
    authorization: "Khalid Al-Zahrani (Host)",
    authorizationRef: "GP-2026-003",
    status: "Used",
    date: "2026-02-27",
    requestedBy: "Khalid Al-Zahrani",
    approvedBy: "Gate Control — Fahad Al-Dosari",
    usedAt: "2026-02-27 16:45",
    vehicleReg: "DEF-9012 (White Toyota)",
    destination: "Dammam City Office",
  },
  {
    id: "EP-005",
    passId: "EP-2026-005",
    personOrCompany: "Rig Alpha — Operations",
    category: "Equipment Return",
    itemsDescription: "Failed VSD module ABB ACS880-37 (serial: ABB-SN-20240811) x1 — for OEM evaluation",
    authorization: "Chief Electrical Engineer",
    authorizationRef: "WO-2026-0051 / NCO-2026-008",
    status: "Pending",
    date: "2026-02-27",
    requestedBy: "Ibrahim Al-Juhani",
    vehicleReg: "TBD",
    destination: "ABB Service Center — Riyadh",
    notes: "High-value equipment (SAR 185,000). Requires security escort to gate.",
  },
  {
    id: "EP-006",
    passId: "EP-2026-006",
    personOrCompany: "Halliburton Drilling Services",
    category: "Equipment Return",
    itemsDescription: "3x used PDC drill bits (Smith SDi616 12-1/4\") — rental return; condition: worn/pulled at TD",
    authorization: "Drilling Superintendent",
    authorizationRef: "DRQ-2026-041 / Rental Acct HAL-R-2024-078",
    status: "Pending",
    date: "2026-02-27",
    requestedBy: "Mohammed Al-Ghamdi",
    vehicleReg: "XYZ-5678 (Halliburton Pick-up)",
    destination: "Halliburton Dammam Tool Store",
    notes: "Rental bit return — ensure dull grading sheet signed by DSup before exit.",
  },
  {
    id: "EP-007",
    passId: "EP-2025-198",
    personOrCompany: "Al-Bassam Catering Services",
    category: "Personnel Exit",
    itemsDescription: "Driver — catering delivery exit (vehicle failed security check on arrival)",
    authorization: "Security Supervisor",
    authorizationRef: "Incident Report SEC-2025-021",
    status: "Used",
    date: "2025-12-01",
    requestedBy: "Gate Control — Fahad Al-Dosari",
    approvedBy: "Security Supervisor — Omar Saleh",
    usedAt: "2025-12-01 11:20",
    vehicleReg: "STU-3333 (Delivery Truck)",
    destination: "Off-site (vehicle barred)",
    notes: "Vehicle barred from future entry. Gate pass GP-2025-198 revoked.",
  },
  {
    id: "EP-008",
    passId: "EP-2026-007",
    personOrCompany: "Rig Charlie — Warehouse",
    category: "Material Exit",
    itemsDescription: "Expired/waste chemicals for licensed disposal: used KCl bags x30, oil-based waste drums x5",
    authorization: "OHSE Manager",
    authorizationRef: "WO-WASTE-2026-003 / Environmental Permit EP-2026-11",
    status: "Approved",
    date: "2026-02-25",
    requestedBy: "Khalid Al-Zahrani",
    approvedBy: "Sultan Al-Anzi",
    vehicleReg: "ENV-WAS-01 (Licensed Waste Carrier)",
    destination: "NCEC Licensed Disposal Facility — Jubail",
    notes: "Environmental permit required on transport documentation.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusMapped(status: ExitPassStatus): string {
  const MAP: Record<ExitPassStatus, string> = {
    Pending: "pending",
    Approved: "approved",
    Used: "completed",
  };
  return MAP[status] ?? "pending";
}

function CategoryBadge({ category }: { category: ExitPassCategory }) {
  const CONFIG: Record<ExitPassCategory, { color: string; bg: string; icon: React.ReactNode }> = {
    "Material Exit": {
      color: "#2563EB",
      bg: "#EFF6FF",
      icon: <Package className="size-3 shrink-0" />,
    },
    "Personnel Exit": {
      color: "#7C3AED",
      bg: "#F3E8FF",
      icon: <UserCheck className="size-3 shrink-0" />,
    },
    "Equipment Return": {
      color: "#EA580C",
      bg: "#FFF7ED",
      icon: <Package className="size-3 shrink-0" />,
    },
  };
  const { color, bg, icon } = CONFIG[category];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {icon}
      {category}
    </span>
  );
}

// ─── View Dialog ─────────────────────────────────────────────────────────────

function ExitPassDetailDialog({
  pass,
  open,
  onClose,
}: {
  pass: ExitPass | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!pass) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-blue-600" />
            Exit Pass — {pass.passId}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={getStatusMapped(pass.status)} size="sm" />
              <CategoryBadge category={pass.category} />
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-2">
          {[
            { label: "Pass ID", value: pass.passId },
            { label: "Person / Company", value: pass.personOrCompany },
            { label: "Items Description", value: pass.itemsDescription },
            { label: "Authorization", value: pass.authorization },
            { label: "Auth. Reference", value: pass.authorizationRef ?? "N/A" },
            { label: "Requested By", value: pass.requestedBy },
            { label: "Approved By", value: pass.approvedBy ?? "Pending" },
            { label: "Date", value: pass.date },
            { label: "Vehicle Reg.", value: pass.vehicleReg ?? "N/A" },
            { label: "Destination", value: pass.destination ?? "N/A" },
            ...(pass.usedAt ? [{ label: "Used At", value: pass.usedAt }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="col-span-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                {label}
              </p>
              <p className="text-xs text-slate-800 mt-0.5 font-medium">{value}</p>
            </div>
          ))}
        </div>

        {pass.notes && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide mb-1">
              Notes
            </p>
            <p className="text-xs text-amber-800">{pass.notes}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Columns ─────────────────────────────────────────────────────────────────

function buildColumns(onView: (pass: ExitPass) => void): Column<ExitPass>[] {
  return [
    {
      key: "passId",
      header: "Pass ID",
      sortable: true,
      width: "130px",
      render: (v: string) => (
        <span className="font-mono text-xs font-semibold text-blue-600">{v}</span>
      ),
    },
    {
      key: "personOrCompany",
      header: "Person / Company",
      sortable: true,
      width: "190px",
      render: (v: string) => (
        <span className="text-xs font-medium text-slate-800 line-clamp-1">{v}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      width: "150px",
      render: (v: ExitPassCategory) => <CategoryBadge category={v} />,
    },
    {
      key: "itemsDescription",
      header: "Items Description",
      render: (v: string) => (
        <span className="text-xs text-slate-600 line-clamp-2 max-w-xs">{v}</span>
      ),
    },
    {
      key: "authorization",
      header: "Authorization",
      sortable: true,
      width: "170px",
      render: (v: string, row: ExitPass) => (
        <div>
          <p className="text-xs text-slate-700">{v}</p>
          {row.authorizationRef && (
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{row.authorizationRef}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "100px",
      render: (v: ExitPassStatus) => <StatusBadge status={getStatusMapped(v)} size="sm" />,
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
      width: "180px",
      render: (_: any, row: ExitPass) => (
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onView(row);
            }}
          >
            <Eye className="size-3.5 mr-1" />
            View
          </Button>
          {row.status === "Pending" && (
            <Button
              size="sm"
              className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <ShieldCheck className="size-3.5 mr-1" />
              Approve
            </Button>
          )}
          {(row.status === "Approved" || row.status === "Used") && (
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
              <Printer className="size-3.5 mr-1" />
              Print
            </Button>
          )}
        </div>
      ),
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExitPassPage() {
  const [viewPass, setViewPass] = React.useState<ExitPass | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleView(pass: ExitPass) {
    setViewPass(pass);
    setDialogOpen(true);
  }

  const counts = React.useMemo(
    () => ({
      pending: EXIT_PASSES.filter((p) => p.status === "Pending").length,
      approved: EXIT_PASSES.filter((p) => p.status === "Approved").length,
      used: EXIT_PASSES.filter((p) => p.status === "Used").length,
      materialExit: EXIT_PASSES.filter((p) => p.category === "Material Exit").length,
      personnelExit: EXIT_PASSES.filter((p) => p.category === "Personnel Exit").length,
      equipmentReturn: EXIT_PASSES.filter((p) => p.category === "Equipment Return").length,
    }),
    []
  );

  const columns = React.useMemo(() => buildColumns(handleView), []);

  const kpis = [
    {
      label: "Pending Approval",
      value: counts.pending,
      sub: "Awaiting security sign-off",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
      icon: <Clock className="size-4 text-amber-500" />,
    },
    {
      label: "Approved",
      value: counts.approved,
      sub: "Ready for exit",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
      icon: <ShieldCheck className="size-4 text-blue-500" />,
    },
    {
      label: "Used",
      value: counts.used,
      sub: "Exits completed",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
    },
    {
      label: "By Type",
      value: `${counts.materialExit}M / ${counts.personnelExit}P / ${counts.equipmentReturn}E`,
      sub: "Materials / Personnel / Equipment",
      color: "text-slate-700",
      bg: "bg-slate-50 border-slate-200",
      icon: <Package className="size-4 text-slate-400" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Exit Pass Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Authorize and track material exits, personnel departures and equipment returns
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Plus className="size-3.5" />
          New Exit Pass
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={cn("rounded-lg border px-4 py-3 flex items-start gap-3", kpi.bg)}>
            <div className="mt-0.5">{kpi.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
              <p className={cn("text-xl font-bold mt-0.5", kpi.color)}>{kpi.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            Exit Passes
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({EXIT_PASSES.length} records)
            </span>
          </h2>
        </div>
        <div className="p-5">
          <DataTable<ExitPass>
            data={EXIT_PASSES}
            columns={columns}
            searchPlaceholder="Search person, company, items, authorization ref..."
            searchKeys={[
              "passId",
              "personOrCompany",
              "itemsDescription",
              "authorization",
              "authorizationRef",
              "requestedBy",
              "vehicleReg",
            ]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Pending", value: "Pending" },
                  { label: "Approved", value: "Approved" },
                  { label: "Used", value: "Used" },
                ],
              },
              {
                key: "category",
                label: "Category",
                options: [
                  { label: "Material Exit", value: "Material Exit" },
                  { label: "Personnel Exit", value: "Personnel Exit" },
                  { label: "Equipment Return", value: "Equipment Return" },
                ],
              },
            ]}
            itemLabel="exit passes"
            pageSize={10}
          />
        </div>
      </div>

      {/* Detail Dialog */}
      <ExitPassDetailDialog
        pass={viewPass}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
