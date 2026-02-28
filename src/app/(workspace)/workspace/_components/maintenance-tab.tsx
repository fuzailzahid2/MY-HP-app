"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Minus } from "lucide-react";
import { REQUESTS } from "@/lib/dummy-data";
import type { Request } from "@/lib/dummy-data";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { SlaIndicator } from "@/components/shared/sla-indicator";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { useUserStore } from "@/lib/stores/user-store";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEPT_MAPPING: Record<string, string[]> = {
  rig_operations: ["Rig Operations", "Maintenance"],
  quality: ["Quality", "Drilling Engineering"],
  logistics: ["Logistics"],
  asset_management: ["Asset Management"],
  warehouse: ["Warehouse"],
  security: ["Security"],
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function RigBadge({ rigName }: { rigName: string | null }) {
  if (!rigName) {
    return <span className="text-xs text-slate-400">Base</span>;
  }
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 whitespace-nowrap">
      {rigName}
    </span>
  );
}

// ─── Maintenance Tab ──────────────────────────────────────────────────────────

export function MaintenanceTab() {
  const currentUser = useUserStore((s) => s.currentUser);

  const maintenanceRequests = React.useMemo(() => {
    const allMaintenance = REQUESTS.filter(
      (r) => r.type === "maintenance_request"
    );

    if (!currentUser) return allMaintenance;

    if (
      currentUser.role === "company_manager" ||
      currentUser.role === "system_admin"
    ) {
      return allMaintenance;
    }

    const deptNames =
      DEPT_MAPPING[currentUser.department] ?? [currentUser.department];
    return allMaintenance.filter((r) =>
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
      key: "rigName",
      header: "Rig",
      width: "110px",
      render: (val: string | null) => <RigBadge rigName={val} />,
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (val: string) => (
        <span className="text-sm text-slate-700 line-clamp-2 max-w-[280px] block">
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
      key: "acknowledgedDate",
      header: "Acknowledged?",
      width: "120px",
      render: (val: string | undefined, row: Request) => {
        if (
          val ||
          [
            "acknowledged",
            "in_progress",
            "in_review",
            "approved",
            "completed",
            "closed",
          ].includes(row.status)
        ) {
          return (
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Yes
            </span>
          );
        }
        return (
          <span className="flex items-center gap-1 text-slate-400 text-xs">
            <Minus className="h-3.5 w-3.5" />
            No
          </span>
        );
      },
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
      width: "150px",
      render: (_val: string, row: Request) => (
        <div className="flex items-center gap-1.5">
          <AvatarCircle
            initials={row.submittedByInitials}
            color={row.submittedByAvatarColor}
            size="xs"
            title={row.submittedByName}
          />
          <span className="text-xs text-slate-600 truncate max-w-[90px]">
            {row.submittedByName}
          </span>
        </div>
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
      data={maintenanceRequests}
      columns={columns}
      searchPlaceholder="Search maintenance requests..."
      searchKeys={["id", "title", "submittedByName", "rigName"]}
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
        {
          key: "status",
          label: "Status",
          options: [
            { value: "submitted", label: "Submitted" },
            { value: "pending_ack", label: "Pending Ack" },
            { value: "acknowledged", label: "Acknowledged" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
            { value: "closed", label: "Closed" },
          ],
        },
      ]}
      pageSize={10}
      itemLabel="maintenance requests"
      emptyMessage="No maintenance requests found for your department."
    />
  );
}
