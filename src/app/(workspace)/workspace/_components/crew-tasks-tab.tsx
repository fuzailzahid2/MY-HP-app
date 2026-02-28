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
import { useUIStore } from "@/lib/stores/ui-store";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

const RIG_NAME_MAP: Record<string, string> = {
  "rig-alpha": "Rig Alpha",
  "rig-bravo": "Rig Bravo",
  "rig-charlie": "Rig Charlie",
};

const DEPT_MAPPING: Record<string, string[]> = {
  rig_operations: ["Rig Operations", "Maintenance"],
  quality: ["Quality", "Drilling Engineering"],
  logistics: ["Logistics"],
  asset_management: ["Asset Management"],
  warehouse: ["Warehouse"],
  security: ["Security"],
};

// ─── Crew Tasks Tab ──────────────────────────────────────────────────────────

export function CrewTasksTab() {
  const currentUser = useUserStore((s) => s.currentUser);
  const selectedRigId = useUIStore((s) => s.selectedRigId);

  const crewTasks = React.useMemo(() => {
    // Requests that are assigned to someone (have an assignee)
    const assigned = REQUESTS.filter(
      (r) => r.assignedToId !== null && r.assignedToId !== undefined
    );

    if (!currentUser) return assigned;

    if (
      currentUser.role === "company_manager" ||
      currentUser.role === "system_admin"
    ) {
      return assigned;
    }

    // Filter by rig or department
    const rigName = RIG_NAME_MAP[selectedRigId];
    const deptNames =
      DEPT_MAPPING[currentUser.department] ?? [currentUser.department];

    return assigned.filter((r) => {
      const matchesRig = rigName ? r.rigName === rigName : false;
      const matchesDept = deptNames.some(
        (d) => r.department.toLowerCase() === d.toLowerCase()
      );
      return matchesRig || matchesDept;
    });
  }, [currentUser, selectedRigId]);

  const columns: Column<Request>[] = [
    {
      key: "assignedToName",
      header: "Assignee",
      width: "160px",
      render: (_val: string | null, row: Request) => {
        if (!row.assignedToId || !row.assignedToName) {
          return <span className="text-xs text-slate-400">—</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <AvatarCircle
              initials={row.assignedToInitials ?? "?"}
              color={row.assignedToAvatarColor ?? "#64748B"}
              size="xs"
              title={row.assignedToName}
            />
            <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">
              {row.assignedToName}
            </span>
          </div>
        );
      },
    },
    {
      key: "id",
      header: "Task ID",
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
      key: "title",
      header: "Task Title",
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
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      width: "100px",
      render: (val: string) => {
        const due = new Date(val);
        const now = new Date();
        const isOverdue = due < now;
        return (
          <span
            className={`text-xs whitespace-nowrap font-medium ${
              isOverdue ? "text-red-600" : "text-slate-500"
            }`}
          >
            {formatDate(val)}
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
  ];

  return (
    <DataTable
      data={crewTasks}
      columns={columns}
      searchPlaceholder="Search crew tasks by assignee or title..."
      searchKeys={["id", "title", "assignedToName", "submittedByName"]}
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
            { value: "in_review", label: "In Review" },
            { value: "completed", label: "Completed" },
            { value: "approved", label: "Approved" },
          ],
        },
      ]}
      pageSize={10}
      itemLabel="crew tasks"
      emptyMessage="No crew tasks found."
    />
  );
}
