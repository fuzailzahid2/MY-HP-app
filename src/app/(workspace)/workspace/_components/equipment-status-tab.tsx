"use client";

import * as React from "react";
import { ASSETS } from "@/lib/dummy-data";
import type { Asset } from "@/lib/dummy-data";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { useUIStore } from "@/lib/stores/ui-store";
import { useUserStore } from "@/lib/stores/user-store";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

const CATEGORY_LABEL: Record<string, string> = {
  well_control: "Well Control",
  hoisting: "Hoisting",
  rotating: "Rotating",
  circulating: "Circulating",
  power_generation: "Power Gen.",
  structural: "Structural",
  lifting: "Lifting",
  drill_string: "Drill String",
  safety_equipment: "Safety",
  instrumentation: "Instrumentation",
  vehicles: "Vehicles",
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "#ECFDF5", color: "#059669", label: "Active" },
  in_service: { bg: "#EFF6FF", color: "#2563EB", label: "In Service" },
  out_of_service: { bg: "#FEF2F2", color: "#DC2626", label: "Out of Service" },
  maintenance: { bg: "#FFF7ED", color: "#EA580C", label: "Maintenance" },
  inspection_due: { bg: "#FFFBEB", color: "#D97706", label: "Inspection Due" },
  quarantine: { bg: "#F5F3FF", color: "#7C3AED", label: "Quarantine" },
  scrapped: { bg: "#F1F5F9", color: "#64748B", label: "Scrapped" },
  on_order: { bg: "#ECFEFF", color: "#0891B2", label: "On Order" },
};

const RIG_ID_MAP: Record<string, string> = {
  "rig-alpha": "AD-201",
  "rig-bravo": "AD-202",
  "rig-charlie": "AD-203",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function AssetStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? {
    bg: "#F1F5F9",
    color: "#64748B",
    label: status.replace(/_/g, " "),
  };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}

// ─── Category Badge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const label = CATEGORY_LABEL[category] ?? category;
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 whitespace-nowrap">
      {label}
    </span>
  );
}

// ─── Equipment Status Tab ─────────────────────────────────────────────────────

export function EquipmentStatusTab() {
  const selectedRigId = useUIStore((s) => s.selectedRigId);
  const currentUser = useUserStore((s) => s.currentUser);

  const assets = React.useMemo(() => {
    if (!currentUser) return ASSETS;

    // Company manager / system admin see all assets
    if (
      currentUser.role === "company_manager" ||
      currentUser.role === "system_admin"
    ) {
      return ASSETS;
    }

    // Map selectedRigId to rig name suffix used in assets data
    const rigNameMap: Record<string, string> = {
      "rig-alpha": "Rig Alpha",
      "rig-bravo": "Rig Bravo",
      "rig-charlie": "Rig Charlie",
    };
    const rigName = rigNameMap[selectedRigId];
    if (!rigName) return ASSETS;

    return ASSETS.filter((a) => a.rigName === rigName);
  }, [selectedRigId, currentUser]);

  const columns: Column<Asset>[] = [
    {
      key: "assetTag",
      header: "Tag",
      sortable: true,
      width: "140px",
      render: (val: string) => (
        <span className="font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">
          {val}
        </span>
      ),
    },
    {
      key: "description",
      header: "Name / Description",
      sortable: true,
      render: (val: string) => (
        <span className="text-sm text-slate-700 line-clamp-2 max-w-[320px] block">
          {val}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "130px",
      render: (val: string) => <CategoryBadge category={val} />,
    },
    {
      key: "status",
      header: "Status",
      width: "130px",
      render: (val: string) => <AssetStatusBadge status={val} />,
    },
    {
      key: "lastInspectionDate",
      header: "Last Inspection",
      sortable: true,
      width: "120px",
      render: (val: string) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(val)}
        </span>
      ),
    },
    {
      key: "nextInspectionDate",
      header: "Next Inspection",
      sortable: true,
      width: "120px",
      render: (val: string) => {
        const next = new Date(val);
        const now = new Date();
        const daysUntil = Math.ceil(
          (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const isUrgent = daysUntil <= 30 && daysUntil > 0;
        const isOverdue = daysUntil <= 0;
        return (
          <span
            className={`text-xs whitespace-nowrap font-medium ${
              isOverdue
                ? "text-red-600"
                : isUrgent
                ? "text-amber-600"
                : "text-slate-500"
            }`}
          >
            {formatDate(val)}
          </span>
        );
      },
    },
    {
      key: "location",
      header: "Location",
      width: "150px",
      render: (val: string) => (
        <span className="text-xs text-slate-500 truncate max-w-[140px] block">
          {val}
        </span>
      ),
    },
  ];

  const categoryOptions = Object.entries(CATEGORY_LABEL).map(
    ([value, label]) => ({ value, label })
  );

  const statusOptions = Object.entries(STATUS_STYLE).map(
    ([value, { label }]) => ({ value, label })
  );

  return (
    <DataTable
      data={assets}
      columns={columns}
      searchPlaceholder="Search assets by tag, name, or location..."
      searchKeys={["assetTag", "description", "location", "manufacturer"]}
      filters={[
        {
          key: "category",
          label: "Category",
          options: categoryOptions,
        },
        {
          key: "status",
          label: "Status",
          options: statusOptions,
        },
      ]}
      pageSize={10}
      itemLabel="assets"
      emptyMessage="No equipment found."
    />
  );
}
