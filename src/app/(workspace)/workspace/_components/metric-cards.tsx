"use client";

import * as React from "react";
import { Send, Clock, AlertCircle, Wrench } from "lucide-react";
import { REQUESTS } from "@/lib/dummy-data";
import { useUserStore } from "@/lib/stores/user-store";

// ─── Department filter helpers ────────────────────────────────────────────────

const DEPT_MAPPING: Record<string, string[]> = {
  rig_operations: ["Rig Operations", "Maintenance"],
  quality: ["Quality", "Drilling Engineering"],
  logistics: ["Logistics"],
  asset_management: ["Asset Management"],
  warehouse: ["Warehouse"],
  security: ["Security"],
};

// ─── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  count: number;
  accentColor: string;
  subtitle?: string;
}

function MetricCard({
  icon,
  iconBg,
  label,
  count,
  accentColor,
  subtitle,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span
          className="text-3xl font-bold leading-none"
          style={{ color: accentColor }}
        >
          {count}
        </span>
        {subtitle && (
          <span className="text-[11px] text-slate-400 pb-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

// ─── Metric Cards Section ─────────────────────────────────────────────────────

export function MetricCards() {
  const currentUser = useUserStore((s) => s.currentUser);

  const filteredRequests = React.useMemo(() => {
    if (!currentUser) return REQUESTS;
    if (
      currentUser.role === "company_manager" ||
      currentUser.role === "system_admin"
    ) {
      return REQUESTS;
    }
    const deptNames =
      DEPT_MAPPING[currentUser.department] ?? [currentUser.department];
    return REQUESTS.filter((r) =>
      deptNames.some((d) => r.department.toLowerCase() === d.toLowerCase())
    );
  }, [currentUser]);

  const outgoingCount = React.useMemo(() => {
    if (!currentUser) return 0;
    return filteredRequests.filter(
      (r) =>
        r.submittedById === currentUser.id &&
        ["submitted", "pending_ack"].includes(r.status)
    ).length;
  }, [filteredRequests, currentUser]);

  const awaitingAckCount = React.useMemo(() => {
    return filteredRequests.filter((r) =>
      ["submitted", "pending_ack"].includes(r.status)
    ).length;
  }, [filteredRequests]);

  const overdueCount = React.useMemo(() => {
    return filteredRequests.filter((r) => r.sla.status === "overdue").length;
  }, [filteredRequests]);

  const maintenanceCount = React.useMemo(() => {
    return filteredRequests.filter((r) => r.type === "maintenance_request")
      .length;
  }, [filteredRequests]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-4">
      <MetricCard
        icon={<Send className="h-4 w-4 text-blue-600" />}
        iconBg="#EFF6FF"
        label="Outgoing Requests"
        count={outgoingCount}
        accentColor="#2563EB"
        subtitle="Pending response"
      />
      <MetricCard
        icon={<Clock className="h-4 w-4 text-amber-500" />}
        iconBg="#FFFBEB"
        label="Awaiting Acknowledgment"
        count={awaitingAckCount}
        accentColor="#D97706"
        subtitle="Submitted / Pending ack"
      />
      <MetricCard
        icon={<AlertCircle className="h-4 w-4 text-red-600" />}
        iconBg="#FEF2F2"
        label="Overdue Items"
        count={overdueCount}
        accentColor="#DC2626"
        subtitle="SLA breached"
      />
      <MetricCard
        icon={<Wrench className="h-4 w-4 text-violet-600" />}
        iconBg="#F5F3FF"
        label="Upcoming Maintenance"
        count={maintenanceCount}
        accentColor="#7C3AED"
        subtitle="Maintenance requests"
      />
    </div>
  );
}
