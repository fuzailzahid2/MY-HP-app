"use client";

import * as React from "react";
import Link from "next/link";
import { REQUESTS } from "@/lib/dummy-data";
import type { Request } from "@/lib/dummy-data";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

// ─── My Approvals Tab ─────────────────────────────────────────────────────────

export function MyApprovalsTab() {
  const currentUser = useUserStore((s) => s.currentUser);

  const approvalRequests = React.useMemo(() => {
    if (!currentUser) return [];
    const isGlobal = currentUser.role === "company_manager" || currentUser.role === "system_admin";
    if (isGlobal) {
      return REQUESTS.filter((r) => r.status === "in_review");
    }
    const deptNames = DEPT_MAPPING[currentUser.department] ?? [currentUser.department];
    return REQUESTS.filter(
      (r) =>
        r.status === "in_review" &&
        deptNames.some((d) => r.department.toLowerCase() === d.toLowerCase())
    );
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
      key: "status",
      header: "Status",
      width: "130px",
      render: (val: string) => <StatusBadge status={val} size="sm" />,
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
      key: "sla",
      header: "SLA",
      width: "90px",
      render: (_val: unknown, row: Request) => (
        <SlaIndicator status={row.sla.status} size="sm" />
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

  return (
    <DataTable
      data={approvalRequests}
      columns={columns}
      searchPlaceholder="Search approvals..."
      searchKeys={["id", "title", "submittedByName"]}
      filters={[
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
      itemLabel="approvals"
      emptyMessage="No requests pending your approval."
    />
  );
}
