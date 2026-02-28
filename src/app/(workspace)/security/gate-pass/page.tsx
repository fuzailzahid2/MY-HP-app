"use client";

import * as React from "react";
import {
  Eye,
  Printer,
  ShieldX,
  ShieldCheck,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type GatePassStatus =
  | "Pending Approval"
  | "Approved"
  | "Active"
  | "Expired"
  | "Revoked";

interface GatePass {
  id: string;
  passId: string;
  visitorName: string;
  company: string;
  purpose: string;
  host: string;
  validFrom: string;
  validUntil: string;
  status: GatePassStatus;
  vehicleReg?: string;
  accessAreas?: string;
  approvedBy?: string;
  issuedBy?: string;
  notes?: string;
}

// ─── Inline Data ──────────────────────────────────────────────────────────────

const GATE_PASSES: GatePass[] = [
  {
    id: "GP-001",
    passId: "GP-2026-001",
    visitorName: "Jean-Pierre Dupont",
    company: "NOV Parts & Aftermarket",
    purpose: "Mud pump maintenance — Rig Alpha",
    host: "Ahmed Al-Rashidi",
    validFrom: "2026-02-27",
    validUntil: "2026-02-28",
    status: "Active",
    vehicleReg: "ABC-1234 (White Van)",
    accessAreas: "Dammam Base Warehouse, Workshops",
    approvedBy: "Hassan Al-Sayed",
    issuedBy: "Gate Control — Ali Hassan",
  },
  {
    id: "GP-002",
    passId: "GP-2026-002",
    visitorName: "Mark Henderson",
    company: "Halliburton Drilling Services",
    purpose: "PDC bit run — technical supervision",
    host: "Mohammed Al-Ghamdi",
    validFrom: "2026-02-26",
    validUntil: "2026-03-05",
    status: "Active",
    vehicleReg: "XYZ-5678 (Pick-up)",
    accessAreas: "All Rig Alpha areas",
    approvedBy: "Hassan Al-Sayed",
    issuedBy: "Gate Control — Fahad Al-Dosari",
  },
  {
    id: "GP-003",
    passId: "GP-2026-003",
    visitorName: "Dr. Laila Al-Mansouri",
    company: "Saudi Occupational Health (SANA)",
    purpose: "Annual OHSE audit — Rig Bravo & Charlie",
    host: "Khalid Al-Zahrani",
    validFrom: "2026-02-25",
    validUntil: "2026-02-27",
    status: "Expired",
    vehicleReg: "DEF-9012 (White Toyota)",
    accessAreas: "All areas — Rig Bravo, Rig Charlie, Dammam Base",
    approvedBy: "Mohammed Al-Ghamdi",
    issuedBy: "Gate Control — Ali Hassan",
  },
  {
    id: "GP-004",
    passId: "GP-2026-004",
    visitorName: "Carlos Mendez",
    company: "ABB Saudi Arabia",
    purpose: "VSD commissioning — Rig Bravo electrical",
    host: "Ali Hassan Al-Barrak",
    validFrom: "2026-02-28",
    validUntil: "2026-03-03",
    status: "Approved",
    vehicleReg: "GHI-3456 (Company Van)",
    accessAreas: "Rig Bravo — Electrical Room, VSD Room",
    approvedBy: "Hassan Al-Sayed",
    notes: "Requires electrical safety induction before entry.",
  },
  {
    id: "GP-005",
    passId: "GP-2026-005",
    visitorName: "Rajan Krishnamurthy",
    company: "Siemens Saudi Arabia",
    purpose: "SCR module inspection — Rig Alpha power room",
    host: "Tariq Al-Mutairi",
    validFrom: "2026-03-01",
    validUntil: "2026-03-02",
    status: "Pending Approval",
    vehicleReg: "JKL-7890 (SUV)",
    accessAreas: "Rig Alpha — Power Generation Area",
    notes: "Awaiting security clearance confirmation.",
  },
  {
    id: "GP-006",
    passId: "GP-2026-006",
    visitorName: "Ahmed Ibrahim Al-Farsi",
    company: "Saudi Aramco HSE Inspectorate",
    purpose: "Compliance inspection — all rigs",
    host: "Mohammed Al-Ghamdi",
    validFrom: "2026-02-20",
    validUntil: "2026-02-22",
    status: "Expired",
    vehicleReg: "MNO-1111 (Aramco Vehicle)",
    accessAreas: "All areas — unrestricted",
    approvedBy: "CEO Office",
    issuedBy: "Gate Control — Fahad Al-Dosari",
    notes: "Aramco regulatory inspector — full access granted.",
  },
  {
    id: "GP-007",
    passId: "GP-2026-007",
    visitorName: "Thomas Weber",
    company: "Derrick Equipment ME",
    purpose: "Shale shaker screen evaluation and installation",
    host: "Nasser Al-Qahtani",
    validFrom: "2026-03-03",
    validUntil: "2026-03-04",
    status: "Pending Approval",
    vehicleReg: "Pending",
    accessAreas: "Rig Alpha — Solids Control Area",
  },
  {
    id: "GP-008",
    passId: "GP-2026-008",
    visitorName: "Yuki Tanaka",
    company: "MSA Safety Arabia",
    purpose: "Gas monitor calibration service — all rigs",
    host: "Sara Al-Otaibi",
    validFrom: "2026-02-24",
    validUntil: "2026-02-26",
    status: "Expired",
    vehicleReg: "PQR-2222 (Service Van)",
    accessAreas: "Dammam Base Warehouse, Safety Store",
    approvedBy: "Hassan Al-Sayed",
    issuedBy: "Gate Control — Ali Hassan",
  },
  {
    id: "GP-009",
    passId: "GP-2025-198",
    visitorName: "Omar Khalid Al-Bassam",
    company: "Al-Bassam Catering Services",
    purpose: "Monthly catering supply delivery — Base Camp",
    host: "Faisal Al-Shammari",
    validFrom: "2025-12-01",
    validUntil: "2025-12-01",
    status: "Revoked",
    vehicleReg: "STU-3333 (Delivery Truck)",
    accessAreas: "Base Camp Catering Area only",
    approvedBy: "Administration",
    issuedBy: "Gate Control — Fahad Al-Dosari",
    notes: "Revoked — vehicle failed security check at gate.",
  },
  {
    id: "GP-010",
    passId: "GP-2026-009",
    visitorName: "David Clarke",
    company: "Bureau Veritas",
    purpose: "Third-party lifting equipment inspection — Rig Alpha & Bravo",
    host: "Khalid Al-Zahrani",
    validFrom: "2026-03-05",
    validUntil: "2026-03-07",
    status: "Approved",
    vehicleReg: "VWX-4444 (BV Company Car)",
    accessAreas: "Rig Alpha — All, Rig Bravo — Crane/Lifting Areas",
    approvedBy: "Mohammed Al-Ghamdi",
  },
  {
    id: "GP-011",
    passId: "GP-2026-010",
    visitorName: "Priya Sharma",
    company: "Baker Hughes ME",
    purpose: "Mud system review and drilling fluids optimization",
    host: "Ibrahim Al-Juhani",
    validFrom: "2026-02-27",
    validUntil: "2026-03-01",
    status: "Active",
    vehicleReg: "YZA-5555 (Company SUV)",
    accessAreas: "Rig Charlie — Mud Pit Area, Chemical Store",
    approvedBy: "Hassan Al-Sayed",
    issuedBy: "Gate Control — Ali Hassan",
  },
  {
    id: "GP-012",
    passId: "GP-2026-011",
    visitorName: "Abdullah Al-Harbi",
    company: "General Civil Defense Directorate",
    purpose: "Annual fire safety inspection — Dammam Base",
    host: "Sultan Al-Anzi",
    validFrom: "2026-03-10",
    validUntil: "2026-03-10",
    status: "Pending Approval",
    vehicleReg: "Civil Defense Vehicle",
    accessAreas: "Dammam Base — all areas",
    notes: "Government authority — priority approval required.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusMapped(status: GatePassStatus): string {
  const MAP: Record<GatePassStatus, string> = {
    "Pending Approval": "pending",
    Approved: "approved",
    Active: "active",
    Expired: "inactive",
    Revoked: "cancelled",
  };
  return MAP[status] ?? "pending";
}

// ─── Columns ─────────────────────────────────────────────────────────────────

function buildColumns(onView: (pass: GatePass) => void): Column<GatePass>[] {
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
      key: "visitorName",
      header: "Visitor Name",
      sortable: true,
      width: "180px",
      render: (v: string) => (
        <span className="text-xs font-medium text-slate-800">{v}</span>
      ),
    },
    {
      key: "company",
      header: "Company",
      sortable: true,
      width: "180px",
      render: (v: string) => (
        <span className="text-xs text-slate-600 line-clamp-1">{v}</span>
      ),
    },
    {
      key: "purpose",
      header: "Purpose",
      render: (v: string) => (
        <span className="text-xs text-slate-600 line-clamp-2 max-w-xs">{v}</span>
      ),
    },
    {
      key: "host",
      header: "Host",
      sortable: true,
      width: "150px",
      render: (v: string) => <span className="text-xs text-slate-700">{v}</span>,
    },
    {
      key: "validFrom",
      header: "Valid From",
      sortable: true,
      width: "100px",
      render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
    },
    {
      key: "validUntil",
      header: "Valid Until",
      sortable: true,
      width: "100px",
      render: (v: string) => {
        const isExpired = new Date(v) < new Date();
        return (
          <span className={cn("text-xs", isExpired ? "text-red-600 font-medium" : "text-slate-500")}>
            {v}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "130px",
      render: (v: GatePassStatus) => <StatusBadge status={getStatusMapped(v)} size="sm" />,
    },
    {
      key: "_actions",
      header: "Actions",
      width: "200px",
      render: (_: any, row: GatePass) => (
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
          {row.status === "Pending Approval" && (
            <Button
              size="sm"
              className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <ShieldCheck className="size-3.5 mr-1" />
              Approve
            </Button>
          )}
          {(row.status === "Approved" || row.status === "Active") && (
            <>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <Printer className="size-3.5 mr-1" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs border-red-300 text-red-600 hover:bg-red-50"
              >
                <ShieldX className="size-3.5 mr-1" />
                Revoke
              </Button>
            </>
          )}
          {row.status === "Expired" && (
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

// ─── View Dialog ─────────────────────────────────────────────────────────────

function GatePassDetailDialog({
  pass,
  open,
  onClose,
}: {
  pass: GatePass | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!pass) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeCheck className="size-5 text-blue-600" />
            Gate Pass — {pass.passId}
          </DialogTitle>
          <DialogDescription>
            <StatusBadge status={getStatusMapped(pass.status)} size="sm" />
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-2">
          {[
            { label: "Visitor Name", value: pass.visitorName },
            { label: "Company", value: pass.company },
            { label: "Purpose", value: pass.purpose },
            { label: "Host", value: pass.host },
            { label: "Valid From", value: pass.validFrom },
            { label: "Valid Until", value: pass.validUntil },
            { label: "Vehicle Reg.", value: pass.vehicleReg ?? "N/A" },
            { label: "Access Areas", value: pass.accessAreas ?? "N/A" },
            { label: "Approved By", value: pass.approvedBy ?? "Pending" },
            { label: "Issued By", value: pass.issuedBy ?? "Not yet issued" },
          ].map(({ label, value }) => (
            <div key={label}>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GatePassPage() {
  const [activeTab, setActiveTab] = React.useState("active");
  const [viewPass, setViewPass] = React.useState<GatePass | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleView(pass: GatePass) {
    setViewPass(pass);
    setDialogOpen(true);
  }

  const activePasses = React.useMemo(
    () => GATE_PASSES.filter((p) => p.status === "Active" || p.status === "Approved"),
    []
  );

  const allPasses = GATE_PASSES;

  const tableData = activeTab === "active" ? activePasses : allPasses;

  const counts = React.useMemo(
    () => ({
      pending: GATE_PASSES.filter((p) => p.status === "Pending Approval").length,
      active: GATE_PASSES.filter((p) => p.status === "Active").length,
      approved: GATE_PASSES.filter((p) => p.status === "Approved").length,
      expired: GATE_PASSES.filter((p) => p.status === "Expired").length,
      revoked: GATE_PASSES.filter((p) => p.status === "Revoked").length,
    }),
    []
  );

  const columns = React.useMemo(() => buildColumns(handleView), []);

  const kpis = [
    {
      label: "Active Passes",
      value: counts.active,
      sub: "Currently on site",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      icon: <Users className="size-4 text-emerald-500" />,
    },
    {
      label: "Pending Approval",
      value: counts.pending,
      sub: "Awaiting security clearance",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
      icon: <Clock className="size-4 text-amber-500" />,
    },
    {
      label: "Approved",
      value: counts.approved,
      sub: "Valid — not yet active",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
      icon: <CheckCircle2 className="size-4 text-blue-500" />,
    },
    {
      label: "Expired / Revoked",
      value: counts.expired + counts.revoked,
      sub: "Closed passes",
      color: "text-slate-600",
      bg: "bg-slate-50 border-slate-200",
      icon: <AlertCircle className="size-4 text-slate-400" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gate Pass Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Control and track all visitor and contractor access passes
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Plus className="size-3.5" />
          New Gate Pass
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

      {/* Tabs + Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <TabNavigation
          tabs={[
            {
              key: "active",
              label: "Active Passes",
              badge: activePasses.length,
            },
            {
              key: "all",
              label: "All Passes",
              badge: allPasses.length,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="p-5">
          <DataTable<GatePass>
            data={tableData}
            columns={columns}
            searchPlaceholder="Search by name, company, purpose, pass ID..."
            searchKeys={[
              "passId",
              "visitorName",
              "company",
              "purpose",
              "host",
              "vehicleReg",
            ]}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Pending Approval", value: "Pending Approval" },
                  { label: "Approved", value: "Approved" },
                  { label: "Active", value: "Active" },
                  { label: "Expired", value: "Expired" },
                  { label: "Revoked", value: "Revoked" },
                ],
              },
            ]}
            itemLabel="passes"
            pageSize={10}
          />
        </div>
      </div>

      {/* Detail Dialog */}
      <GatePassDetailDialog
        pass={viewPass}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
