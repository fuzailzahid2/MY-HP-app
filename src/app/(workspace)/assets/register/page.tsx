"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ASSETS, Asset, AssetCategory, AssetStatus } from "@/lib/dummy-data";

// ─── Criticality mapping (derived from category) ──────────────────────────────

type Criticality = "A" | "B" | "C";

function getCriticality(asset: Asset): Criticality {
  const A_CATEGORIES: AssetCategory[] = ["well_control", "structural", "power_generation"];
  const B_CATEGORIES: AssetCategory[] = ["hoisting", "rotating", "circulating", "lifting"];
  if (A_CATEGORIES.includes(asset.category)) return "A";
  if (B_CATEGORIES.includes(asset.category)) return "B";
  return "C";
}

const CRITICALITY_LABEL: Record<Criticality, string> = {
  A: "A - Safety Critical",
  B: "B - Operations Critical",
  C: "C - Standard",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCategory(cat: AssetCategory): { label: string; color: string } {
  const MAP: Record<AssetCategory, { label: string; color: string }> = {
    well_control: { label: "Well Control", color: "#DC2626" },
    hoisting: { label: "Hoisting", color: "#7C3AED" },
    rotating: { label: "Rotating", color: "#2563EB" },
    circulating: { label: "Circulating", color: "#0891B2" },
    power_generation: { label: "Power Generation", color: "#D97706" },
    structural: { label: "Structural", color: "#EA580C" },
    lifting: { label: "Lifting", color: "#059669" },
    drill_string: { label: "Drill String", color: "#64748B" },
    safety_equipment: { label: "Safety", color: "#E11D48" },
    instrumentation: { label: "Instrumentation", color: "#6366F1" },
    vehicles: { label: "Vehicles", color: "#8B5CF6" },
  };
  return MAP[cat] ?? { label: cat, color: "#64748B" };
}

function CriticalityBadge({ criticality }: { criticality: Criticality }) {
  const CONFIG: Record<Criticality, { color: string; bg: string }> = {
    A: { color: "#DC2626", bg: "#FEF2F2" },
    B: { color: "#2563EB", bg: "#EFF6FF" },
    C: { color: "#64748B", bg: "#F1F5F9" },
  };
  const { color, bg } = CONFIG[criticality];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {criticality}
    </span>
  );
}

function CertStatusCell({ asset }: { asset: Asset }) {
  // Find worst cert status
  const allCerts = asset.certificates;
  if (allCerts.length === 0) {
    if (!asset.certificationExpiryDate) {
      return <span className="text-xs text-slate-400">N/A</span>;
    }
    // Use certificationExpiryDate
    const expiry = new Date(asset.certificationExpiryDate);
    const now = new Date();
    const diffDays = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return (
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50">
            Expired
          </span>
          <AlertCircle className="size-3.5 text-red-500" />
        </div>
      );
    }
    if (diffDays <= 90) {
      return (
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50">
            Expiring
          </span>
          <span className="text-[10px] text-amber-600 font-medium">{diffDays}d</span>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50">
        Valid
      </span>
    );
  }

  const hasExpired = allCerts.some((c) => c.status === "expired");
  const hasExpiring = allCerts.some((c) => c.status === "expiring_soon");

  if (hasExpired) {
    return (
      <div className="flex items-center gap-1">
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50">
          Expired
        </span>
        <AlertCircle className="size-3.5 text-red-500" />
      </div>
    );
  }
  if (hasExpiring) {
    return (
      <div className="flex items-center gap-1">
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50">
          Expiring
        </span>
        <span className="text-[10px] text-amber-600 font-medium bg-amber-50 rounded-full px-1">!</span>
      </div>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50">
      Valid
    </span>
  );
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const COLUMNS: Column<Asset>[] = [
  {
    key: "assetTag",
    header: "Tag Number",
    sortable: true,
    width: "160px",
    render: (v: string, row: Asset) => (
      <Link
        href={`/assets/register/${row.id}`}
        className="text-blue-600 hover:underline font-mono text-xs font-semibold"
        onClick={(e) => e.stopPropagation()}
      >
        {v}
      </Link>
    ),
  },
  {
    key: "description",
    header: "Name",
    sortable: true,
    render: (v: string) => (
      <span className="text-sm text-slate-800 line-clamp-2 max-w-xs">{v}</span>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    width: "140px",
    render: (v: AssetCategory) => {
      const { label, color } = formatCategory(v);
      return (
        <span className="text-xs font-medium" style={{ color }}>
          {label}
        </span>
      );
    },
  },
  {
    key: "manufacturer",
    header: "Manufacturer",
    sortable: true,
    width: "140px",
    render: (v: string) => <span className="text-sm text-slate-700">{v}</span>,
  },
  {
    key: "location",
    header: "Location",
    sortable: true,
    width: "180px",
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-2">{v}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: AssetStatus) => {
      const statusMap: Record<AssetStatus, string> = {
        active: "active",
        in_service: "active",
        out_of_service: "inactive",
        maintenance: "in_progress",
        inspection_due: "overdue",
        quarantine: "on_hold",
        scrapped: "cancelled",
        on_order: "pending",
      };
      return <StatusBadge status={statusMap[v] ?? v} size="sm" />;
    },
  },
  {
    key: "_criticality",
    header: "Criticality",
    width: "90px",
    render: (_: any, row: Asset) => <CriticalityBadge criticality={getCriticality(row)} />,
  },
  {
    key: "_certStatus",
    header: "Cert Status",
    width: "110px",
    render: (_: any, row: Asset) => <CertStatusCell asset={row} />,
  },
  {
    key: "nextPMDate",
    header: "Next Service",
    sortable: true,
    width: "110px",
    render: (v: string) => {
      const now = new Date();
      const d = new Date(v);
      const diffDays = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return (
        <span
          className={cn(
            "text-xs",
            diffDays < 0
              ? "text-red-600 font-medium"
              : diffDays <= 30
              ? "text-amber-600 font-medium"
              : "text-slate-600"
          )}
        >
          {v}
        </span>
      );
    },
  },
  {
    key: "_actions",
    header: "Actions",
    width: "70px",
    render: (_: any, row: Asset) => (
      <Link href={`/assets/register/${row.id}`} onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="View">
          <Eye className="size-3.5" />
        </Button>
      </Link>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetRegisterPage() {
  const activeAssets = ASSETS.filter(
    (a) => a.status === "active" || a.status === "in_service"
  );
  const criticalCount = ASSETS.filter((a) => getCriticality(a) === "A").length;
  const expiredCerts = ASSETS.filter((a) =>
    a.certificates.some((c) => c.status === "expired") ||
    (a.certificationExpiryDate &&
      new Date(a.certificationExpiryDate) < new Date() &&
      a.certificates.length === 0)
  ).length;
  const expiringSoon = ASSETS.filter((a) =>
    a.certificates.some((c) => c.status === "expiring_soon") ||
    (a.certificationExpiryDate &&
      (() => {
        const diffDays = Math.floor(
          (new Date(a.certificationExpiryDate!).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return diffDays >= 0 && diffDays <= 90;
      })())
  ).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Asset Register</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Complete inventory of equipment and assets across all rigs
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs">
          + Register Asset
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Assets",
            value: ASSETS.length,
            sub: `${activeAssets.length} active`,
            color: "text-slate-800",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "Safety Critical (A)",
            value: criticalCount,
            sub: "Criticality A",
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Expired Certs",
            value: expiredCerts,
            sub: "Action required",
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Expiring Soon",
            value: expiringSoon,
            sub: "Within 90 days",
            color: "text-amber-700",
            bg: "bg-amber-50 border-amber-200",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={cn("rounded-lg border px-4 py-3", kpi.bg)}
          >
            <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
            <p className={cn("text-2xl font-bold mt-0.5", kpi.color)}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            All Assets
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({ASSETS.length} assets)
            </span>
          </h2>
        </div>
        <div className="p-5">
          <DataTable<Asset>
            data={ASSETS}
            columns={COLUMNS}
            searchPlaceholder="Search assets..."
            searchKeys={["assetTag", "description", "manufacturer", "model", "location", "rigName"]}
            filters={[
              {
                key: "category",
                label: "Category",
                options: [
                  { label: "Well Control", value: "well_control" },
                  { label: "Hoisting", value: "hoisting" },
                  { label: "Rotating", value: "rotating" },
                  { label: "Circulating", value: "circulating" },
                  { label: "Power Generation", value: "power_generation" },
                  { label: "Structural", value: "structural" },
                  { label: "Lifting", value: "lifting" },
                  { label: "Drill String", value: "drill_string" },
                  { label: "Safety Equipment", value: "safety_equipment" },
                  { label: "Instrumentation", value: "instrumentation" },
                ],
              },
              {
                key: "rigName",
                label: "Rig",
                options: [
                  { label: "Rig Alpha", value: "Rig Alpha" },
                  { label: "Rig Bravo", value: "Rig Bravo" },
                  { label: "Rig Charlie", value: "Rig Charlie" },
                ],
              },
            ]}
            itemLabel="assets"
            pageSize={25}
          />
        </div>
      </div>
    </div>
  );
}
