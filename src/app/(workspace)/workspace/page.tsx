"use client";

import * as React from "react";
import { REQUESTS } from "@/lib/dummy-data";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { useUserStore } from "@/lib/stores/user-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { QuickActions } from "./_components/quick-actions";
import { MetricCards } from "./_components/metric-cards";
import { MyRequestsTab } from "./_components/my-requests-tab";
import { IncomingQueueTab } from "./_components/incoming-queue-tab";
import { MyTasksTab } from "./_components/my-tasks-tab";
import { MySubmittedTab } from "./_components/my-submitted-tab";
import { MyApprovalsTab } from "./_components/my-approvals-tab";
import { CompletedTasksTab } from "./_components/completed-tasks-tab";
import { MyTeamWorkloadsTab } from "./_components/my-team-workloads-tab";

// ─── Rig ID to display info map ───────────────────────────────────────────────

const RIG_INFO: Record<string, { code: string; name: string }> = {
  "rig-alpha": { code: "AD-201", name: "Rig Alpha" },
  "rig-bravo": { code: "AD-202", name: "Rig Bravo" },
  "rig-charlie": { code: "AD-203", name: "Rig Charlie" },
};

const DEPT_MAPPING: Record<string, string[]> = {
  rig_operations: ["Rig Operations", "Maintenance"],
  quality: ["Quality", "Drilling Engineering"],
  logistics: ["Logistics"],
  asset_management: ["Asset Management"],
  warehouse: ["Warehouse"],
  security: ["Security"],
};

// ─── Workspace Page ───────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const currentUser = useUserStore((s) => s.currentUser);
  const selectedRigId = useUIStore((s) => s.selectedRigId);
  const [activeTab, setActiveTab] = React.useState("incoming_queue");

  const rigInfo = RIG_INFO[selectedRigId] ?? { code: "AD-201", name: "Rig Alpha" };

  // Compute badge counts for tabs
  const tabCounts = React.useMemo(() => {
    if (!currentUser)
      return {
        incomingQueue: 0,
        myTasks: 0,
        mySubmitted: 0,
        myRequests: 0,
        myApprovals: 0,
      };

    const isGlobal =
      currentUser.role === "company_manager" ||
      currentUser.role === "system_admin";

    const deptNames = isGlobal
      ? null
      : DEPT_MAPPING[currentUser.department] ?? [currentUser.department];

    // Helper: does a request belong to the user's department?
    const inDept = (r: (typeof REQUESTS)[number]) =>
      isGlobal ||
      (deptNames &&
        deptNames.some(
          (d) => r.department.toLowerCase() === d.toLowerCase()
        ));

    // Incoming Queue: requests in user's department with status "submitted" or "pending_ack"
    const incomingQueue = REQUESTS.filter(
      (r) =>
        inDept(r) &&
        ["submitted", "pending_ack"].includes(r.status)
    ).length;

    // My Tasks: assigned to current user AND status in acknowledged/in_progress/in_review
    const myTasks = REQUESTS.filter(
      (r) =>
        r.assignedToId === currentUser.id &&
        ["acknowledged", "in_progress", "in_review"].includes(r.status)
    ).length;

    // My Submitted: submitted by current user AND status in submitted/pending_ack
    const mySubmitted = REQUESTS.filter(
      (r) =>
        r.submittedById === currentUser.id &&
        ["submitted", "pending_ack"].includes(r.status)
    ).length;

    // My Requests: submitted by current user AND status in acknowledged/in_progress/in_review/approved
    const myRequests = REQUESTS.filter(
      (r) =>
        r.submittedById === currentUser.id &&
        ["acknowledged", "in_progress", "in_review", "approved"].includes(r.status)
    ).length;

    // My Approvals: requests in user's department with status "in_review"
    const myApprovals = REQUESTS.filter(
      (r) => inDept(r) && r.status === "in_review"
    ).length;

    return { incomingQueue, myTasks, mySubmitted, myRequests, myApprovals };
  }, [currentUser]);

  // ─── Role-specific tab configuration ──────────────────────────────────────
  const tabs = React.useMemo(() => {
    const allTabs = {
      incoming_queue: {
        key: "incoming_queue",
        label: "Incoming Queue",
        badge:
          tabCounts.incomingQueue > 0 ? tabCounts.incomingQueue : undefined,
      },
      my_tasks: {
        key: "my_tasks",
        label: "My Tasks",
        badge: tabCounts.myTasks > 0 ? tabCounts.myTasks : undefined,
      },
      my_submitted: {
        key: "my_submitted",
        label: "My Submitted",
        badge: tabCounts.mySubmitted > 0 ? tabCounts.mySubmitted : undefined,
      },
      my_requests: {
        key: "my_requests",
        label: "My Requests",
        badge: tabCounts.myRequests > 0 ? tabCounts.myRequests : undefined,
      },
      team_workloads: {
        key: "team_workloads",
        label: "My Team Workloads",
      },
      my_approvals: {
        key: "my_approvals",
        label: "My Approvals",
        badge: tabCounts.myApprovals > 0 ? tabCounts.myApprovals : undefined,
      },
      completed_tasks: {
        key: "completed_tasks",
        label: "Completed Tasks",
      },
    };

    // Manager roles: all 7 tabs
    const managerTabs = [
      allTabs.incoming_queue,
      allTabs.my_tasks,
      allTabs.my_submitted,
      allTabs.my_requests,
      allTabs.team_workloads,
      allTabs.my_approvals,
      allTabs.completed_tasks,
    ];

    // Employee roles: 5 tabs (no Team Workloads, no My Approvals)
    const employeeTabs = [
      allTabs.incoming_queue,
      allTabs.my_tasks,
      allTabs.my_submitted,
      allTabs.my_requests,
      allTabs.completed_tasks,
    ];

    if (!currentUser) return managerTabs;

    const { role } = currentUser;

    // company_manager / system_admin / rig_manager / department_manager — all 7 tabs
    if (
      role === "company_manager" ||
      role === "system_admin" ||
      role === "rig_manager" ||
      role === "department_manager"
    ) {
      return managerTabs;
    }

    // employee (regular, HSE Officer, Rig Medic) — 5 tabs
    if (role === "employee") {
      return employeeTabs;
    }

    return managerTabs;
  }, [currentUser, tabCounts]);

  // Reset activeTab when role changes and current tab is no longer available
  React.useEffect(() => {
    const tabKeys = tabs.map((t) => t.key);
    if (!tabKeys.includes(activeTab)) {
      setActiveTab("incoming_queue");
    }
  }, [tabs, activeTab]);

  function renderTabContent() {
    switch (activeTab) {
      case "incoming_queue":
        return <IncomingQueueTab />;
      case "my_tasks":
        return <MyTasksTab />;
      case "my_submitted":
        return <MySubmittedTab />;
      case "my_requests":
        return <MyRequestsTab />;
      case "team_workloads":
        return <MyTeamWorkloadsTab />;
      case "my_approvals":
        return <MyApprovalsTab />;
      case "completed_tasks":
        return <CompletedTasksTab />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Workspace
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {rigInfo.code}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight mt-0.5">
                {rigInfo.name} ({rigInfo.code}) Workspace
              </h1>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-800">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-500">{currentUser.jobTitle}</div>
              </div>
              <AvatarCircle
                initials={currentUser.initials}
                color={currentUser.avatarColor}
                size="md"
                title={currentUser.name}
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Metric Cards */}
      <div className="bg-slate-50 border-b border-slate-200">
        <MetricCards />
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="flex-1 p-6 bg-slate-50 min-h-0 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}
