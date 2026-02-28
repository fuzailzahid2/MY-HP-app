"use client";

import * as React from "react";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  Building2,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { INVENTORY_ITEMS, InventoryItem, StockStatus, ItemCategory } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";

// ─── Location Config ──────────────────────────────────────────────────────────

type LocationKey = "dammam" | "rig-alpha" | "rig-bravo" | "rig-charlie";

const LOCATIONS: { key: LocationKey; label: string; rigId?: string }[] = [
  { key: "dammam", label: "Dammam Base" },
  { key: "rig-alpha", label: "Rig Alpha", rigId: "AD-201" },
  { key: "rig-bravo", label: "Rig Bravo", rigId: "AD-202" },
  { key: "rig-charlie", label: "Rig Charlie", rigId: "AD-203" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function filterByLocation(items: InventoryItem[], location: LocationKey): InventoryItem[] {
  const loc = LOCATIONS.find((l) => l.key === location);
  if (!loc) return items;
  if (location === "dammam") {
    return items.filter((i) => i.location.toLowerCase().includes("dammam"));
  }
  if (loc.rigId) {
    return items.filter((i) => i.applicableRigs.includes(loc.rigId!));
  }
  return items;
}

function formatCategory(cat: ItemCategory): string {
  const MAP: Record<ItemCategory, string> = {
    ppe: "PPE",
    spares_mechanical: "Mech. Spares",
    spares_electrical: "Elec. Spares",
    spares_well_control: "Well Control",
    capital_goods: "Capital Goods",
    tools_hand: "Hand Tools",
    tools_power: "Power Tools",
    drill_string: "Drill String",
    mud_chemicals: "Mud Chemicals",
    cement_chemicals: "Cement",
    consumables: "Consumables",
    safety_equipment: "Safety Equip.",
    tubular_goods: "Tubular Goods",
  };
  return MAP[cat] ?? cat;
}

function getCategoryColor(cat: ItemCategory): string {
  const MAP: Record<ItemCategory, string> = {
    ppe: "#7C3AED",
    spares_mechanical: "#2563EB",
    spares_electrical: "#0891B2",
    spares_well_control: "#DC2626",
    capital_goods: "#D97706",
    tools_hand: "#059669",
    tools_power: "#0D9488",
    drill_string: "#EA580C",
    mud_chemicals: "#64748B",
    cement_chemicals: "#8B5CF6",
    consumables: "#6366F1",
    safety_equipment: "#E11D48",
    tubular_goods: "#475569",
  };
  return MAP[cat] ?? "#64748B";
}

function getStockStatusConfig(item: InventoryItem): {
  label: string;
  color: string;
  bg: string;
} {
  if (item.status === "out_of_stock") {
    return { label: "Critical", color: "#DC2626", bg: "#FEF2F2" };
  }
  if (item.status === "low_stock" || item.currentStock <= item.reorderPoint) {
    if (item.currentStock === 0) {
      return { label: "Critical", color: "#DC2626", bg: "#FEF2F2" };
    }
    if (item.currentStock <= item.minStockLevel) {
      return { label: "Low", color: "#D97706", bg: "#FFFBEB" };
    }
    return { label: "Low", color: "#D97706", bg: "#FFFBEB" };
  }
  if (item.status === "quarantine") {
    return { label: "Quarantine", color: "#7C3AED", bg: "#F3E8FF" };
  }
  if (item.status === "on_order") {
    return { label: "On Order", color: "#0891B2", bg: "#ECFEFF" };
  }
  return { label: "OK", color: "#059669", bg: "#ECFDF5" };
}

function StockLevelBar({ item }: { item: InventoryItem }) {
  const pct = item.maxStockLevel > 0
    ? Math.min(100, Math.round((item.currentStock / item.maxStockLevel) * 100))
    : 0;
  const isLow = item.currentStock <= item.reorderPoint;
  const isCritical = item.currentStock === 0 || item.status === "out_of_stock";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-200 rounded-full shrink-0">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isCritical ? "bg-red-500" : isLow ? "bg-amber-400" : "bg-emerald-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-slate-400 font-mono shrink-0">{pct}%</span>
    </div>
  );
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const COLUMNS: Column<InventoryItem>[] = [
  {
    key: "description",
    header: "Item Name",
    sortable: true,
    render: (v: string, row: InventoryItem) => (
      <div>
        <p className="text-xs font-medium text-slate-800 line-clamp-2 max-w-xs">{v}</p>
        {row.isCriticalSpare && (
          <span className="inline-flex items-center gap-0.5 text-[9px] text-red-600 font-semibold mt-0.5">
            <AlertCircle className="size-2.5" />
            CRITICAL SPARE
          </span>
        )}
      </div>
    ),
  },
  {
    key: "partNumber",
    header: "Part Number",
    sortable: true,
    width: "150px",
    render: (v: string) => (
      <span className="font-mono text-[11px] text-slate-600">{v}</span>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    width: "120px",
    render: (v: ItemCategory) => (
      <span
        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
        style={{
          color: getCategoryColor(v),
          backgroundColor: getCategoryColor(v) + "15",
        }}
      >
        {formatCategory(v)}
      </span>
    ),
  },
  {
    key: "currentStock",
    header: "Qty",
    sortable: true,
    width: "80px",
    render: (v: number, row: InventoryItem) => {
      const isLow = v <= row.reorderPoint;
      const isCritical = v === 0 || v < row.minStockLevel;
      return (
        <span
          className={cn(
            "text-sm font-bold",
            isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-slate-800"
          )}
        >
          {v.toLocaleString()}
        </span>
      );
    },
  },
  {
    key: "unit",
    header: "Unit",
    sortable: true,
    width: "70px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "minStockLevel",
    header: "Min Stock",
    sortable: true,
    width: "90px",
    render: (v: number) => (
      <span className="text-xs text-slate-500 font-mono">{v.toLocaleString()}</span>
    ),
  },
  {
    key: "_stockStatus",
    header: "Stock Status",
    width: "120px",
    render: (_: any, row: InventoryItem) => {
      const cfg = getStockStatusConfig(row);
      return (
        <div className="flex flex-col gap-1">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
            style={{ color: cfg.color, backgroundColor: cfg.bg }}
          >
            {cfg.label}
          </span>
          <StockLevelBar item={row} />
        </div>
      );
    },
  },
  {
    key: "lastIssuedDate",
    header: "Last Movement",
    sortable: true,
    width: "115px",
    render: (v: string | undefined, row: InventoryItem) => {
      const date = v ?? row.lastReceivedDate;
      return (
        <div>
          <p className="text-[10px] text-slate-500">{date}</p>
          {row.lastIssuedTo && (
            <p className="text-[9px] text-slate-400 line-clamp-1 max-w-[100px]">
              {row.lastIssuedTo}
            </p>
          )}
        </div>
      );
    },
  },
  {
    key: "totalValueSAR",
    header: "Value (SAR)",
    sortable: true,
    width: "110px",
    render: (v: number) => (
      <span className="text-xs font-medium text-slate-700">
        {v > 0 ? `${v.toLocaleString()}` : "—"}
      </span>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [activeLocation, setActiveLocation] = React.useState<LocationKey>("dammam");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const filteredByLocation = React.useMemo(
    () => filterByLocation(INVENTORY_ITEMS, activeLocation),
    [activeLocation]
  );

  const filteredItems = React.useMemo(() => {
    if (categoryFilter === "all") return filteredByLocation;
    return filteredByLocation.filter((i) => i.category === categoryFilter);
  }, [filteredByLocation, categoryFilter]);

  const summaryStats = React.useMemo(() => {
    const items = filteredByLocation;
    return {
      total: items.length,
      lowStock: items.filter(
        (i) => i.status === "low_stock" || (i.currentStock <= i.reorderPoint && i.currentStock > 0)
      ).length,
      critical: items.filter(
        (i) => i.status === "out_of_stock" || (i.currentStock === 0)
      ).length,
      totalValue: items.reduce((s, i) => s + i.totalValueSAR, 0),
    };
  }, [filteredByLocation]);

  const categoryOptions = [
    { label: "All Categories", value: "all" },
    { label: "PPE", value: "ppe" },
    { label: "Mechanical Spares", value: "spares_mechanical" },
    { label: "Electrical Spares", value: "spares_electrical" },
    { label: "Well Control", value: "spares_well_control" },
    { label: "Capital Goods", value: "capital_goods" },
    { label: "Hand Tools", value: "tools_hand" },
    { label: "Power Tools", value: "tools_power" },
    { label: "Drill String", value: "drill_string" },
    { label: "Mud Chemicals", value: "mud_chemicals" },
    { label: "Cement Chemicals", value: "cement_chemicals" },
    { label: "Consumables", value: "consumables" },
    { label: "Safety Equipment", value: "safety_equipment" },
    { label: "Tubular Goods", value: "tubular_goods" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Stock levels, critical spares and movement tracking across all locations
          </p>
        </div>
      </div>

      {/* Location Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-slate-500 mr-1">Location:</span>
        {LOCATIONS.map((loc) => (
          <button
            key={loc.key}
            onClick={() => setActiveLocation(loc.key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              activeLocation === loc.key
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800"
            )}
          >
            {loc.key === "dammam" ? (
              <Building2 className="size-3" />
            ) : (
              <Warehouse className="size-3" />
            )}
            {loc.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Items",
            value: summaryStats.total,
            sub: "In selected location",
            color: "text-slate-800",
            bg: "bg-slate-50 border-slate-200",
            icon: <Package className="size-4 text-slate-400" />,
          },
          {
            label: "Low Stock",
            value: summaryStats.lowStock,
            sub: "At or below reorder point",
            color: "text-amber-700",
            bg: "bg-amber-50 border-amber-200",
            icon: <AlertTriangle className="size-4 text-amber-500" />,
          },
          {
            label: "Critical Stock",
            value: summaryStats.critical,
            sub: "Zero stock — action required",
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
            icon: <AlertCircle className="size-4 text-red-500" />,
          },
          {
            label: "Total Value",
            value: `SAR ${(summaryStats.totalValue / 1000000).toFixed(2)}M`,
            sub: "Combined inventory value",
            color: "text-emerald-700",
            bg: "bg-emerald-50 border-emerald-200",
            icon: <DollarSign className="size-4 text-emerald-500" />,
          },
        ].map((kpi) => (
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

      {/* Alert Banner for Low/Critical Stock */}
      {(summaryStats.lowStock > 0 || summaryStats.critical > 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Stock Alert</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {summaryStats.critical > 0 && (
                <span className="font-semibold text-red-700">
                  {summaryStats.critical} item(s) at zero stock.{" "}
                </span>
              )}
              {summaryStats.lowStock > 0 && (
                <span>
                  {summaryStats.lowStock} item(s) below reorder point — review and raise purchase orders.
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Category Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-slate-500 mr-1">Category:</span>
        {categoryOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setCategoryFilter(opt.value)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap",
              categoryFilter === opt.value
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Inventory Items —{" "}
              {LOCATIONS.find((l) => l.key === activeLocation)?.label}
              <span className="ml-2 text-slate-400 font-normal text-sm">
                ({filteredItems.length} items shown)
              </span>
            </h2>
          </div>
        </div>
        <div className="p-5">
          <DataTable<InventoryItem>
            data={filteredItems}
            columns={COLUMNS}
            searchPlaceholder="Search items, part numbers, manufacturer..."
            searchKeys={[
              "description",
              "partNumber",
              "oemPartNumber",
              "manufacturer",
              "supplierName",
              "tags",
              "binLocation",
            ]}
            filters={[
              {
                key: "status",
                label: "Stock Status",
                options: [
                  { label: "In Stock", value: "in_stock" },
                  { label: "Low Stock", value: "low_stock" },
                  { label: "Out of Stock", value: "out_of_stock" },
                  { label: "On Order", value: "on_order" },
                  { label: "Quarantine", value: "quarantine" },
                  { label: "Reserved", value: "reserved" },
                ],
              },
            ]}
            itemLabel="items"
            pageSize={25}
          />
        </div>
      </div>
    </div>
  );
}
