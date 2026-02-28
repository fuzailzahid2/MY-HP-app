"use client";

import * as React from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { REQUESTS } from "@/lib/dummy-data";
import type { Request } from "@/lib/dummy-data";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { SlaIndicator } from "@/components/shared/sla-indicator";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { useUserStore } from "@/lib/stores/user-store";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_LABEL_MAP: Record<string, string> = {
  document_review: "Doc Review",
  document_approval: "Doc Approval",
  moc_review: "MOC Review",
  moc_approval: "MOC Approval",
  nco_review: "NCO Review",
  capa_review: "CAPA Review",
  audit_schedule: "Audit Sched.",
  audit_finding: "Audit Finding",
  asset_inspection: "Asset Insp.",
  maintenance_request: "Maintenance",
  material_request: "Material Req.",
  personnel_request: "Personnel",
  training_request: "Training",
  permit_request: "Permit",
  incident_report: "Incident",
};

const TYPE_COLOR_MAP: Record<string, { bg: string; color: string }> = {
  document_review: { bg: "#EFF6FF", color: "#2563EB" },
  document_approval: { bg: "#EFF6FF", color: "#1D4ED8" },
  moc_review: { bg: "#F5F3FF", color: "#7C3AED" },
  moc_approval: { bg: "#F5F3FF", color: "#6D28D9" },
  nco_review: { bg: "#FFF7ED", color: "#EA580C" },
  capa_review: { bg: "#FFFBEB", color: "#D97706" },
  audit_schedule: { bg: "#F0FDF4", color: "#16A34A" },
  audit_finding: { bg: "#FEF2F2", color: "#DC2626" },
  asset_inspection: { bg: "#ECFEFF", color: "#0891B2" },
  maintenance_request: { bg: "#FFF1F2", color: "#E11D48" },
  material_request: { bg: "#F0FDFA", color: "#0D9488" },
  personnel_request: { bg: "#ECFDF5", color: "#059669" },
  training_request: { bg: "#FDF4FF", color: "#A21CAF" },
  permit_request: { bg: "#FFF7ED", color: "#C2410C" },
  incident_report: { bg: "#FEF2F2", color: "#B91C1C" },
};

const DEPT_MAPPING: Record<string, string[]> = {
  rig_operations: ["Rig Operations", "Maintenance"],
  quality: ["Quality", "Drilling Engineering"],
  logistics: ["Logistics"],
  asset_management: ["Asset Management"],
  warehouse: ["Warehouse"],
  security: ["Security"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const label = TYPE_LABEL_MAP[type] ?? type;
  const colors = TYPE_COLOR_MAP[type] ?? { bg: "#F1F5F9", color: "#64748B" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.color }}
    >
      {label}
    </span>
  );
}

function RigBadge({ rigName }: { rigName: string | null }) {
  if (!rigName) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 whitespace-nowrap">
      {rigName}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

// ─── Incoming Queue Tab ───────────────────────────────────────────────────────

export function IncomingQueueTab() {
  const currentUser = useUserStore((s) => s.currentUser);

  const queueRequests = React.useMemo(() => {
    if (!currentUser) return [];
    const isGlobal = currentUser.role === "company_manager" || currentUser.role === "system_admin";
    const deptNames = isGlobal ? null : DEPT_MAPPING[currentUser.department] ?? [currentUser.department];
    return REQUESTS.filter((r) => {
      // Must be unaccepted
      if (!["submitted", "pending_ack"].includes(r.status)) return false;
      // Global roles see all
      if (isGlobal) return true;
      // Others see their department's incoming
      return deptNames!.some((d) => r.department.toLowerCase() === d.toLowerCase());
    });
  }, [currentUser]);

  const columns: Column<Request>[] = [
    {
      key: "id",
      header: "Number",
      sortable: true,
      width: "130px",
      render: (val: string) => (
        <Link
          href={`/workspace/requests/${val}`}
          className="font-mono text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
        >
          {val}
        </Link>
      ),
    },
    {
      key: "rigName",
      header: "Rig",
      width: "110px",
      render: (val: string | null) => <RigBadge rigName={val} />,
    },
    {
      key: "type",
      header: "Type",
      width: "110px",
      render: (val: string) => <TypeBadge type={val} />,
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (val: string) => (
        <span className="text-sm text-slate-700 line-clamp-2 max-w-[260px] block">
          {val}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      width: "90px",
      render: (val: string) => <PriorityIndicator priority={val} size="sm" />,
    },
    {
      key: "sla",
      header: "SLA",
      width: "90px",
      render: (_val: unknown, row: Request) => (
        <SlaIndicator status={row.sla.status} size="sm" />
      ),
    },
    {
      key: "submittedByName",
      header: "Submitted By",
      width: "160px",
      render: (_val: string, row: Request) => (
        <div className="flex items-center gap-1.5">
          <AvatarCircle
            initials={row.submittedByInitials}
            color={row.submittedByAvatarColor}
            size="xs"
            title={row.submittedByName}
          />
          <span className="text-xs text-slate-600 truncate max-w-[100px]">
            {row.submittedByName}
          </span>
        </div>
      ),
    },
    {
      key: "submittedDate",
      header: "Submitted",
      sortable: true,
      width: "100px",
      render: (val: string) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(val)}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due",
      sortable: true,
      width: "90px",
      render: (val: string) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(val)}
        </span>
      ),
    },
  ];

  const TYPE_FILTER_OPTIONS = Object.entries(TYPE_LABEL_MAP).map(
    ([value, label]) => ({ value, label })
  );

  return (
    <div className="space-y-4">
      {/* Prominent count header */}
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
          <Inbox className="h-4 w-4 text-amber-600" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-amber-900">
            {queueRequests.length}
          </span>
          <span className="text-sm text-amber-700">
            {queueRequests.length === 1 ? "item" : "items"} awaiting
            acknowledgment
          </span>
        </div>
        {queueRequests.filter((r) => r.priority === "critical" || r.priority === "urgent").length > 0 && (
          <span className="ml-auto inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
            {queueRequests.filter((r) => r.priority === "critical" || r.priority === "urgent").length} urgent/critical
          </span>
        )}
      </div>

      <DataTable
        data={queueRequests}
        columns={columns}
        searchPlaceholder="Search incoming requests..."
        searchKeys={["id", "title", "submittedByName", "rigName"]}
        filters={[
          {
            key: "type",
            label: "Request type",
            options: TYPE_FILTER_OPTIONS,
          },
          {
            key: "priority",
            label: "Priority",
            options: [
              { value: "critical", label: "Critical" },
              { value: "urgent", label: "Urgent" },
              { value: "high", label: "High" },
              { value: "routine", label: "Routine" },
              { value: "planned", label: "Planned" },
            ],
          },
        ]}
        pageSize={10}
        itemLabel="incoming requests"
        emptyMessage="No incoming requests awaiting acknowledgment."
      />
    </div>
  );
}
