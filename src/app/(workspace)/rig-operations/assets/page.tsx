"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ASSETS, Asset, AssetCategory, AssetStatus } from "@/lib/dummy-data";

// ─── Constants ───────────────────────────────────────────────────────────────

const CURRENT_RIG_ID = "AD-201";
const CURRENT_RIG_NAME = "Rig Alpha";

// ─── Category Chip Config ────────────────────────────────────────────────────

type CategoryFilter = AssetCategory | "all";

interface CategoryChip {
  key: CategoryFilter;
  label: string;
  color: string;
  activeBg: string;
  activeBorder: string;
}

const CATEGORY_CHIPS: CategoryChip[] = [
  { key: "all", label: "All", color: "#334155", activeBg: "#F1F5F9", activeBorder: "#94A3B8" },
  { key: "well_control", label: "Well Control", color: "#DC2626", activeBg: "#FEF2F2", activeBorder: "#DC2626" },
  { key: "rotating", label: "Rotating", color: "#2563EB", activeBg: "#EFF6FF", activeBorder: "#2563EB" },
  { key: "hoisting", label: "Hoisting", color: "#7C3AED", activeBg: "#F3E8FF", activeBorder: "#7C3AED" },
  { key: "circulating", label: "Circulating", color: "#0891B2", activeBg: "#ECFEFF", activeBorder: "#0891B2" },
  { key: "power_generation", label: "Power", color: "#D97706", activeBg: "#FFFBEB", activeBorder: "#D97706" },
  { key: "safety_equipment", label: "Safety", color: "#E11D48", activeBg: "#FFF1F2", activeBorder: "#E11D48" },
  { key: "drill_string", label: "Tubulars", color: "#64748B", activeBg: "#F8FAFC", activeBorder: "#64748B" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Criticality = "A" | "B" | "C";

function getCriticality(asset: Asset): Criticality {
  const A_CATS: AssetCategory[] = ["well_control", "structural", "power_generation"];
  const B_CATS: AssetCategory[] = ["hoisting", "rotating", "circulating", "lifting"];
  if (A_CATS.includes(asset.category)) return "A";
  if (B_CATS.includes(asset.category)) return "B";
  return "C";
}

function formatCategory(cat: AssetCategory): string {
  const MAP: Record<AssetCategory, string> = {
    well_control: "Well Control",
    hoisting: "Hoisting",
    rotating: "Rotating",
    circulating: "Circulating",
    power_generation: "Power Generation",
    structural: "Structural",
    lifting: "Lifting",
    drill_string: "Drill String",
    safety_equipment: "Safety",
    instrumentation: "Instrumentation",
    vehicles: "Vehicles",
  };
  return MAP[cat] ?? cat;
}

function getCategoryColor(cat: AssetCategory): string {
  const MAP: Record<AssetCategory, string> = {
    well_control: "#DC2626",
    hoisting: "#7C3AED",
    rotating: "#2563EB",
    circulating: "#0891B2",
    power_generation: "#D97706",
    structural: "#EA580C",
    lifting: "#059669",
    drill_string: "#64748B",
    safety_equipment: "#E11D48",
    instrumentation: "#6366F1",
    vehicles: "#8B5CF6",
  };
  return MAP[cat] ?? "#64748B";
}

function getLastInspectionDate(asset: Asset): string {
  if (asset.inspectionHistory && asset.inspectionHistory.length > 0) {
    const sorted = [...asset.inspectionHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].date;
  }
  return asset.lastInspectionDate ?? "—";
}

function getCertExpiryStatus(asset: Asset): { date: string; status: "valid" | "expiring" | "expired" | "na" } {
  if (asset.certificationExpiryDate) {
    const expiry = new Date(asset.certificationExpiryDate);
    const now = new Date();
    const diffDays = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { date: asset.certificationExpiryDate, status: "expired" };
    if (diffDays <= 90) return { date: asset.certificationExpiryDate, status: "expiring" };
    return { date: asset.certificationExpiryDate, status: "valid" };
  }
  if (asset.certificates && asset.certificates.length > 0) {
    const worst = asset.certificates.find((c) => c.status === "expired")
      ?? asset.certificates.find((c) => c.status === "expiring_soon")
      ?? asset.certificates[0];
    const st =
      worst.status === "expired"
        ? "expired"
        : worst.status === "expiring_soon"
        ? "expiring"
        : "valid";
    return { date: worst.expiryDate, status: st };
  }
  return { date: "—", status: "na" };
}

// ─── KPI Strip ───────────────────────────────────────────────────────────────

function KpiStrip({ assets }: { assets: Asset[] }) {
  const active = assets.filter((a) => a.status === "active" || a.status === "in_service").length;
  const inMaint = assets.filter((a) => a.status === "maintenance").length;
  const critA = assets.filter((a) => getCriticality(a) === "A").length;
  const certIssues = assets.filter((a) => {
    const { status } = getCertExpiryStatus(a);
    return status === "expired" || status === "expiring";
  }).length;

  const kpis = [
    { label: "Total Assets on Rig", value: assets.length, sub: `${active} active`, color: "text-slate-800", bg: "bg-white border-slate-200" },
    { label: "In Maintenance", value: inMaint, sub: "Undergoing work", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    { label: "Safety Critical (A)", value: critA, sub: "Criticality A", color: "text-red-700", bg: "bg-red-50 border-red-200" },
    { label: "Cert Issues", value: certIssues, sub: "Expired or expiring", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {kpis.map((k) => (
        <div key={k.label} className={cn("rounded-lg border px-4 py-3", k.bg)}>
          <p className="text-xs text-slate-500 font-medium">{k.label}</p>
          <p className={cn("text-2xl font-bold mt-0.5", k.color)}>{k.value}</p>
          <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Columns ─────────────────────────────────────────────────────────────────

function buildColumns(): Column<Asset>[] {
  return [
    {
      key: "assetTag",
      header: "Tag Number",
      sortable: true,
      width: "150px",
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
        <span className="text-sm text-slate-800 line-clamp-2 max-w-[240px] block">{v}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      width: "140px",
      render: (v: AssetCategory) => (
        <span
          className="text-xs font-semibold rounded-full px-2 py-0.5"
          style={{ color: getCategoryColor(v), backgroundColor: getCategoryColor(v) + "18" }}
        >
          {formatCategory(v)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "120px",
      render: (v: AssetStatus) => {
        const MAP: Record<AssetStatus, string> = {
          active: "active",
          in_service: "active",
          out_of_service: "inactive",
          maintenance: "in_progress",
          inspection_due: "overdue",
          quarantine: "on_hold",
          scrapped: "cancelled",
          on_order: "pending",
        };
        return <StatusBadge status={MAP[v] ?? v} size="sm" />;
      },
    },
    {
      key: "_criticality",
      header: "Criticality",
      width: "100px",
      render: (_: unknown, row: Asset) => {
        const c = getCriticality(row);
        const CONFIG: Record<Criticality, { color: string; bg: string; label: string }> = {
          A: { color: "#DC2626", bg: "#FEF2F2", label: "A — Safety" },
          B: { color: "#2563EB", bg: "#EFF6FF", label: "B — Ops" },
          C: { color: "#64748B", bg: "#F1F5F9", label: "C — Std" },
        };
        const { color, bg, label } = CONFIG[c];
        return (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ color, backgroundColor: bg }}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: "_lastInspection",
      header: "Last Inspection",
      width: "130px",
      render: (_: unknown, row: Asset) => {
        const date = getLastInspectionDate(row);
        return <span className="text-xs text-slate-600">{date}</span>;
      },
    },
    {
      key: "_certExpiry",
      header: "Cert Expiry",
      width: "130px",
      render: (_: unknown, row: Asset) => {
        const { date, status } = getCertExpiryStatus(row);
        if (status === "na") return <span className="text-xs text-slate-400">N/A</span>;
        const colorMap = {
          valid: { color: "#059669", bg: "#ECFDF5" },
          expiring: { color: "#D97706", bg: "#FFFBEB" },
          expired: { color: "#DC2626", bg: "#FEF2F2" },
          na: { color: "#64748B", bg: "#F1F5F9" },
        };
        const { color, bg } = colorMap[status];
        return (
          <div className="flex items-center gap-1">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ color, backgroundColor: bg }}
            >
              {date}
            </span>
            {status === "expired" && <AlertCircle className="size-3.5 text-red-500 shrink-0" />}
          </div>
        );
      },
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetsOnRigPage() {
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>("all");

  const rigAssets = ASSETS.filter((a) => a.rigId === CURRENT_RIG_ID);

  const filteredAssets = React.useMemo(() => {
    if (activeCategory === "all") return rigAssets;
    return rigAssets.filter((a) => a.category === activeCategory);
  }, [rigAssets, activeCategory]);

  const columns = React.useMemo(() => buildColumns(), []);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assets on Rig</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {CURRENT_RIG_NAME} — Equipment register and certification status
          </p>
        </div>
        <div className="shrink-0 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-center">
          <p className="text-xs text-blue-600 font-medium">Current Rig</p>
          <p className="text-sm font-bold text-blue-800">{CURRENT_RIG_NAME}</p>
        </div>
      </div>

      {/* KPIs */}
      <KpiStrip assets={rigAssets} />

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_CHIPS.map((chip) => {
          const isActive = activeCategory === chip.key;
          const count =
            chip.key === "all"
              ? rigAssets.length
              : rigAssets.filter((a) => a.category === chip.key).length;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setActiveCategory(chip.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold",
                "border transition-all duration-150 select-none",
                isActive
                  ? "shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
              )}
              style={
                isActive
                  ? {
                      backgroundColor: chip.activeBg,
                      borderColor: chip.activeBorder,
                      color: chip.color,
                    }
                  : undefined
              }
            >
              {chip.label}
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1 text-[10px] font-bold",
                  isActive ? "bg-white/70" : "bg-slate-100"
                )}
                style={isActive ? { color: chip.color } : undefined}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            {activeCategory === "all" ? "All Assets" : formatCategory(activeCategory as AssetCategory)}
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({filteredAssets.length} assets)
            </span>
          </h2>
        </div>
        <div className="p-5">
          <DataTable<Asset>
            data={filteredAssets}
            columns={columns}
            searchPlaceholder="Search by tag, name, manufacturer..."
            searchKeys={["assetTag", "description", "manufacturer", "model", "serialNumber"]}
            onRowClick={(row) => {
              window.location.href = `/assets/register/${row.id}`;
            }}
            emptyMessage="No assets found for the selected category."
            itemLabel="assets"
            pageSize={25}
          />
        </div>
      </div>
    </div>
  );
}
