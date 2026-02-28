"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Users, AlertTriangle } from "lucide-react";
import { REQUESTS } from "@/lib/dummy-data";
import type { Request } from "@/lib/dummy-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { SlaIndicator } from "@/components/shared/sla-indicator";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { useUserStore } from "@/lib/stores/user-store";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPT_MAPPING: Record<string, string[]> = {
  rig_operations: ["Rig Operations", "Maintenance"],
  quality: ["Quality", "Drilling Engineering"],
  logistics: ["Logistics"],
  asset_management: ["Asset Management"],
  warehouse: ["Warehouse"],
  security: ["Security"],
};

const ACTIVE_STATUSES = [
  "acknowledged",
  "in_progress",
  "in_review",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

// ─── Team Member type ─────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  activeTasks: Request[];
  overdueTasks: Request[];
}

// ─── My Team Workloads Tab ────────────────────────────────────────────────────

export function MyTeamWorkloadsTab() {
  const currentUser = useUserStore((s) => s.currentUser);
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  // Build scoped active requests
  const scopedRequests = React.useMemo(() => {
    // Only active statuses, only assigned requests
    const active = REQUESTS.filter(
      (r) =>
        ACTIVE_STATUSES.includes(r.status) &&
        r.assignedToId !== null &&
        r.assignedToId !== undefined
    );

    if (!currentUser) return active;

    // company_manager / system_admin: see all
    if (
      currentUser.role === "company_manager" ||
      currentUser.role === "system_admin"
    ) {
      return active;
    }

    // Others: filter by department
    const deptNames =
      DEPT_MAPPING[currentUser.department] ?? [currentUser.department];

    return active.filter((r) =>
      deptNames.some((d) => r.department.toLowerCase() === d.toLowerCase())
    );
  }, [currentUser]);

  // Group by assignee
  const teamMembers = React.useMemo(() => {
    const map = new Map<string, TeamMember>();
    const now = new Date();

    for (const r of scopedRequests) {
      if (!r.assignedToId || !r.assignedToName) continue;

      let member = map.get(r.assignedToId);
      if (!member) {
        member = {
          id: r.assignedToId,
          name: r.assignedToName,
          initials: r.assignedToInitials ?? "??",
          avatarColor: r.assignedToAvatarColor ?? "#64748B",
          activeTasks: [],
          overdueTasks: [],
        };
        map.set(r.assignedToId, member);
      }

      member.activeTasks.push(r);

      if (r.sla.status === "overdue" || new Date(r.dueDate) < now) {
        member.overdueTasks.push(r);
      }
    }

    // Sort by number of active tasks descending (busiest first)
    return Array.from(map.values()).sort(
      (a, b) => b.activeTasks.length - a.activeTasks.length
    );
  }, [scopedRequests]);

  // Summary counts
  const totalMembers = teamMembers.length;
  const totalActiveTasks = scopedRequests.length;
  const totalOverdue = teamMembers.reduce(
    (sum, m) => sum + m.overdueTasks.length,
    0
  );

  // Toggle expand/collapse
  function toggleExpand(memberId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Summary Bar ── */}
      <div className="flex items-center gap-4 rounded-lg border bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Users className="h-4 w-4 text-slate-500" />
          <span>{totalMembers} team member{totalMembers !== 1 ? "s" : ""}</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {totalActiveTasks}
          </span>
          <span className="text-sm text-slate-600">active task{totalActiveTasks !== 1 ? "s" : ""}</span>
        </div>
        {totalOverdue > 0 && (
          <>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                {totalOverdue}
              </span>
              <span className="text-sm text-red-600">overdue</span>
            </div>
          </>
        )}
      </div>

      {/* ── Team Member List ── */}
      {teamMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-background py-16 text-center">
          <Users className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            No team members with active tasks.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Tasks assigned to team members in your department will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {teamMembers.map((member) => {
            const isExpanded = expandedIds.has(member.id);
            return (
              <div
                key={member.id}
                className="rounded-lg border bg-background overflow-hidden"
              >
                {/* ── Member Row ── */}
                <button
                  type="button"
                  onClick={() => toggleExpand(member.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  {/* Chevron */}
                  <span className="flex shrink-0 items-center justify-center text-slate-400">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>

                  {/* Avatar */}
                  <AvatarCircle
                    initials={member.initials}
                    color={member.avatarColor}
                    size="sm"
                    title={member.name}
                  />

                  {/* Name */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-slate-800 truncate">
                      {member.name}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {member.activeTasks.length} active
                    </span>
                    {member.overdueTasks.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        {member.overdueTasks.length} overdue
                      </span>
                    )}
                  </div>
                </button>

                {/* ── Expanded Task List ── */}
                {isExpanded && (
                  <div className="border-t bg-slate-50/50 px-4 py-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                            <th className="pb-2 pr-4 whitespace-nowrap" style={{ width: "130px" }}>
                              ID
                            </th>
                            <th className="pb-2 pr-4">Title</th>
                            <th className="pb-2 pr-4 whitespace-nowrap" style={{ width: "90px" }}>
                              Priority
                            </th>
                            <th className="pb-2 pr-4 whitespace-nowrap" style={{ width: "120px" }}>
                              Status
                            </th>
                            <th className="pb-2 pr-4 whitespace-nowrap" style={{ width: "90px" }}>
                              Due
                            </th>
                            <th className="pb-2 whitespace-nowrap" style={{ width: "90px" }}>
                              SLA
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {member.activeTasks.map((task) => (
                            <tr key={task.id} className="group">
                              <td className="py-2 pr-4">
                                <Link
                                  href={`/workspace/requests/${task.id}`}
                                  className="font-mono text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
                                >
                                  {task.id}
                                </Link>
                              </td>
                              <td className="py-2 pr-4">
                                <span className="text-sm text-slate-700 line-clamp-1 max-w-[280px] block">
                                  {task.title}
                                </span>
                              </td>
                              <td className="py-2 pr-4">
                                <PriorityIndicator
                                  priority={task.priority}
                                  size="sm"
                                />
                              </td>
                              <td className="py-2 pr-4">
                                <StatusBadge status={task.status} size="sm" />
                              </td>
                              <td className="py-2 pr-4">
                                <span
                                  className={`text-xs whitespace-nowrap font-medium ${
                                    new Date(task.dueDate) < new Date()
                                      ? "text-red-600"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {formatDate(task.dueDate)}
                                </span>
                              </td>
                              <td className="py-2">
                                <SlaIndicator
                                  status={task.sla.status}
                                  size="sm"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
