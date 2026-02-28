"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  AlertTriangle,
  Clock,
  Drill,
  TrendingUp,
  TrendingDown,
  Minus,
  User as UserIcon,
  ClipboardList,
} from "lucide-react";
import { REQUESTS, RIGS } from "@/lib/dummy-data";
import { useUserStore } from "@/lib/stores/user-store";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import type { Department } from "@/lib/stores/user-store";

// ─── Department Mapping ──────────────────────────────────────────────────────
// Maps the User.department enum to the department strings used in request data.

const DEPARTMENT_MAPPING: Record<string, string[]> = {
  rig_operations: ["Rig Operations", "Maintenance"],
  quality: ["Quality", "Drilling Engineering"],
  logistics: ["Logistics"],
  asset_management: ["Asset Management"],
  warehouse: ["Warehouse"],
  security: ["Security"],
};

// ─── Role Helpers ────────────────────────────────────────────────────────────

type ViewMode = "company" | "rig" | "department" | "personal";

function getViewMode(role: string): ViewMode {
  if (role === "company_manager" || role === "system_admin") return "company";
  if (role === "rig_manager") return "rig";
  if (role === "department_manager") return "department";
  return "personal";
}

function getGreeting(
  role: string,
  department: Department
): string {
  const viewMode = getViewMode(role);
  switch (viewMode) {
    case "company":
      return "Here's what's happening across ADI operations today.";
    case "rig":
      return "Here's your rig overview.";
    case "department": {
      const deptLabels: Record<string, string> = {
        quality: "quality department",
        logistics: "logistics",
        rig_operations: "rig operations",
        asset_management: "asset management",
        warehouse: "warehouse",
        security: "security",
      };
      const label = deptLabels[department] ?? department;
      return `Here's your ${label} overview.`;
    }
    case "personal":
    default:
      return "Here's your personal overview.";
  }
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { direction: "up" | "down" | "neutral"; value: string };
  accentColor: string;
}

function MetricCard({ label, value, icon, iconBg, trend, accentColor }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend.direction === "up"
                ? "bg-red-50 text-red-600"
                : trend.direction === "down"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-50 text-slate-500"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : trend.direction === "down" ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800" style={{ color: accentColor }}>
          {value}
        </div>
        <div className="text-sm text-slate-500 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ─── Chart Constants ─────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
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

const PIE_COLORS = [
  "#3B82F6", "#8B5CF6", "#0891B2", "#10B981", "#F59E0B",
  "#EF4444", "#6366F1", "#EC4899", "#14B8A6", "#F97316",
];

// Weekly activity data — past 8 weeks (synthetic but plausible)
const WEEKLY_ACTIVITY_DATA = [
  { week: "W47 '25", submitted: 4, completed: 3 },
  { week: "W48 '25", submitted: 6, completed: 5 },
  { week: "W49 '25", submitted: 3, completed: 4 },
  { week: "W50 '25", submitted: 7, completed: 6 },
  { week: "W51 '25", submitted: 5, completed: 3 },
  { week: "W52 '25", submitted: 2, completed: 5 },
  { week: "W1 '26", submitted: 6, completed: 4 },
  { week: "W8 '26", submitted: 8, completed: 5 },
];

// ─── Custom Tooltips ─────────────────────────────────────────────────────────

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill ?? p.color }}>
          {p.value} request{p.value !== 1 ? "s" : ""}
        </p>
      ))}
    </div>
  );
}

function CustomLineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-slate-700">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }}>
        {payload[0].value} request{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const currentUser = useUserStore((s) => s.currentUser);

  // Fallback while store is hydrating
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  const viewMode = getViewMode(currentUser.role);

  // ── Filter requests based on role ──────────────────────────────────────────

  const filteredRequests = React.useMemo(() => {
    switch (viewMode) {
      case "company":
        // Company managers and system admins see ALL requests
        return REQUESTS;

      case "rig": {
        // Rig managers see requests from their assigned rig,
        // filtered to rig_operations departments
        const rigDepts = DEPARTMENT_MAPPING["rig_operations"] ?? [];
        return REQUESTS.filter(
          (r) =>
            r.rigId === currentUser.rigAssignment &&
            rigDepts.some((d) => r.department.toLowerCase() === d.toLowerCase())
        );
      }

      case "department": {
        // Department managers see their department's requests
        const deptNames = DEPARTMENT_MAPPING[currentUser.department] ?? [currentUser.department];
        return REQUESTS.filter((r) =>
          deptNames.some((d) => r.department.toLowerCase() === d.toLowerCase())
        );
      }

      case "personal":
      default: {
        // Employees, HSE Officers, Rig Medics see their own requests
        // (submitted by them OR assigned to them)
        return REQUESTS.filter(
          (r) =>
            r.submittedById === currentUser.id ||
            r.assignedToId === currentUser.id
        );
      }
    }
  }, [viewMode, currentUser.id, currentUser.department, currentUser.rigAssignment]);

  // ── Computed Metrics ───────────────────────────────────────────────────────

  const openRequests = React.useMemo(
    () =>
      filteredRequests.filter((r) =>
        ["submitted", "pending_ack", "acknowledged", "in_progress", "in_review"].includes(r.status)
      ).length,
    [filteredRequests]
  );

  const overdueTasks = React.useMemo(
    () => filteredRequests.filter((r) => r.sla.status === "overdue").length,
    [filteredRequests]
  );

  const pendingApprovals = React.useMemo(
    () =>
      filteredRequests.filter((r) =>
        ["submitted", "pending_ack", "acknowledged"].includes(r.status)
      ).length,
    [filteredRequests]
  );

  const activeRigs = React.useMemo(
    () => RIGS.filter((r) => r.status === "active").length,
    []
  );

  // ── Rig data for display ──────────────────────────────────────────────────

  const displayRigs = React.useMemo(() => {
    switch (viewMode) {
      case "company":
        return RIGS;
      case "rig":
        return RIGS.filter((r) => r.id === currentUser.rigAssignment);
      case "department":
        // Department managers do not see rig status cards
        return [];
      case "personal":
      default:
        // Employees assigned to a rig see that rig only
        if (currentUser.rigAssignment) {
          return RIGS.filter((r) => r.id === currentUser.rigAssignment);
        }
        return [];
    }
  }, [viewMode, currentUser.rigAssignment]);

  // ── Chart Data ────────────────────────────────────────────────────────────

  const statusChartData = React.useMemo(
    () => [
      {
        status: "Submitted",
        count: filteredRequests.filter((r) => r.status === "submitted").length,
        fill: "#3B82F6",
      },
      {
        status: "In Progress",
        count: filteredRequests.filter((r) => r.status === "in_progress").length,
        fill: "#8B5CF6",
      },
      {
        status: "In Review",
        count: filteredRequests.filter((r) => r.status === "in_review").length,
        fill: "#0891B2",
      },
      {
        status: "Approved",
        count: filteredRequests.filter((r) => r.status === "approved").length,
        fill: "#10B981",
      },
      {
        status: "Completed",
        count: filteredRequests.filter((r) => r.status === "completed").length,
        fill: "#059669",
      },
      {
        status: "Closed",
        count: filteredRequests.filter((r) => r.status === "closed").length,
        fill: "#64748B",
      },
    ],
    [filteredRequests]
  );

  const pieData = React.useMemo(() => {
    const typeCount: Record<string, number> = {};
    filteredRequests.forEach((r) => {
      typeCount[r.type] = (typeCount[r.type] ?? 0) + 1;
    });
    return Object.entries(typeCount).map(([type, count], idx) => ({
      name: TYPE_LABELS[type] ?? type,
      value: count,
      fill: PIE_COLORS[idx % PIE_COLORS.length],
    }));
  }, [filteredRequests]);

  const recentRequests = React.useMemo(
    () =>
      [...filteredRequests]
        .sort(
          (a, b) =>
            new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
        )
        .slice(0, 5),
    [filteredRequests]
  );

  // ── Metric cards config ───────────────────────────────────────────────────

  const metricCards = React.useMemo(() => {
    const baseCards = [
      {
        label: viewMode === "personal" ? "My Open Requests" : "Open Requests",
        value: openRequests,
        accentColor: "#3B82F6",
        iconBg: "#EFF6FF",
        icon: <FileText className="h-5 w-5 text-blue-600" />,
        trend: { direction: "up" as const, value: "+3 this week" },
      },
      {
        label: viewMode === "personal" ? "My Overdue Tasks" : "Overdue Tasks",
        value: overdueTasks,
        accentColor: "#EF4444",
        iconBg: "#FEF2F2",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        trend: overdueTasks > 0
          ? { direction: "up" as const, value: "Needs attention" }
          : { direction: "neutral" as const, value: "All clear" },
      },
      {
        label: viewMode === "personal" ? "My Pending Approvals" : "Pending Approvals",
        value: pendingApprovals,
        accentColor: "#F59E0B",
        iconBg: "#FFFBEB",
        icon: <Clock className="h-5 w-5 text-amber-500" />,
        trend: { direction: "neutral" as const, value: "No change" },
      },
    ];

    // Fourth card depends on the view mode
    if (viewMode === "company") {
      baseCards.push({
        label: "Active Rigs",
        value: activeRigs,
        accentColor: "#10B981",
        iconBg: "#ECFDF5",
        icon: <Drill className="h-5 w-5 text-emerald-600" />,
        trend: { direction: "neutral" as const, value: "All operational" },
      });
    } else if (viewMode === "rig") {
      baseCards.push({
        label: "Total Rig Requests",
        value: filteredRequests.length,
        accentColor: "#10B981",
        iconBg: "#ECFDF5",
        icon: <Drill className="h-5 w-5 text-emerald-600" />,
        trend: { direction: "neutral" as const, value: "Rig scope" },
      });
    } else if (viewMode === "department") {
      baseCards.push({
        label: "Dept. Requests",
        value: filteredRequests.length,
        accentColor: "#10B981",
        iconBg: "#ECFDF5",
        icon: <ClipboardList className="h-5 w-5 text-emerald-600" />,
        trend: { direction: "neutral" as const, value: "Dept. scope" },
      });
    } else {
      // personal
      baseCards.push({
        label: "My Total Requests",
        value: filteredRequests.length,
        accentColor: "#10B981",
        iconBg: "#ECFDF5",
        icon: <UserIcon className="h-5 w-5 text-emerald-600" />,
        trend: { direction: "neutral" as const, value: "Personal scope" },
      });
    }

    return baseCards;
  }, [viewMode, openRequests, overdueTasks, pendingApprovals, activeRigs, filteredRequests.length]);

  // ── Section titles (context-aware) ────────────────────────────────────────

  const statusChartTitle = React.useMemo(() => {
    switch (viewMode) {
      case "company":
        return "Requests by Status";
      case "rig":
        return "Rig Requests by Status";
      case "department":
        return "Department Requests by Status";
      case "personal":
      default:
        return "My Requests by Status";
    }
  }, [viewMode]);

  const typeChartTitle = React.useMemo(() => {
    switch (viewMode) {
      case "company":
        return "Request Types";
      case "rig":
        return "Rig Request Types";
      case "department":
        return "Department Request Types";
      case "personal":
      default:
        return "My Request Types";
    }
  }, [viewMode]);

  const weeklyChartTitle = React.useMemo(() => {
    switch (viewMode) {
      case "company":
        return "Weekly Request Activity (Past 8 Weeks)";
      case "rig":
        return "Rig Weekly Activity (Past 8 Weeks)";
      case "department":
        return "Dept. Weekly Activity (Past 8 Weeks)";
      case "personal":
      default:
        return "My Weekly Activity (Past 8 Weeks)";
    }
  }, [viewMode]);

  const recentTitle = React.useMemo(() => {
    switch (viewMode) {
      case "company":
        return "Recent Activity";
      case "rig":
        return "Recent Rig Activity";
      case "department":
        return "Recent Dept. Activity";
      case "personal":
      default:
        return "My Recent Activity";
    }
  }, [viewMode]);

  // ── Determine whether to show rig section ─────────────────────────────────

  const showRigSection = displayRigs.length > 0;

  const rigSectionTitle = React.useMemo(() => {
    if (viewMode === "rig") return "My Rig Status";
    if (viewMode === "personal" && currentUser.rigAssignment) return "My Assigned Rig";
    return "Active Rig Status";
  }, [viewMode, currentUser.rigAssignment]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          Good morning, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {getGreeting(currentUser.role, currentUser.department)}
        </p>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            accentColor={card.accentColor}
            iconBg={card.iconBg}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart — Requests by Status */}
        <SectionCard title={statusChartTitle} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusChartData} barSize={32} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="status"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Pie chart — Request Types */}
        <SectionCard title={typeChartTitle}>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-col gap-1 mt-2 max-h-32 overflow-y-auto pr-1">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-600">
                    <span
                      className="inline-block h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="truncate">{entry.name}</span>
                    <span className="ml-auto font-medium text-slate-700">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[240px]">
              <p className="text-sm text-slate-400">No requests to display</p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Charts Row 2 + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart — Weekly Activity */}
        <SectionCard title={weeklyChartTitle} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={WEEKLY_ACTIVITY_DATA}
              margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="submitted"
                name="Submitted"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#3B82F6" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10B981" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard title={recentTitle}>
          {recentRequests.length > 0 ? (
            <div className="flex flex-col divide-y divide-slate-100">
              {recentRequests.map((req) => (
                <div key={req.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono text-slate-400">{req.id}</span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-snug line-clamp-2 mb-1.5">
                    {req.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <PriorityIndicator priority={req.priority} size="sm" />
                    <span className="text-[10px] text-slate-400">
                      {new Date(req.submittedDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-slate-400">No recent activity</p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Rig Status Row ── */}
      {showRigSection && (
        <SectionCard title={rigSectionTitle}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayRigs.map((rig) => (
              <div
                key={rig.id}
                className="rounded-lg border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{rig.name}</div>
                    <div className="text-xs text-slate-500">{rig.assetNumber}</div>
                  </div>
                  <StatusBadge status={rig.status} size="sm" />
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Well</span>
                    <span className="font-medium">{rig.wellName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phase</span>
                    <span className="font-medium text-right max-w-[160px] truncate">{rig.currentPhase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Depth</span>
                    <span className="font-medium">{rig.currentDepth_m.toLocaleString()} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">POB</span>
                    <span className="font-medium">{rig.crew.totalOnboard}/{rig.crew.maxPOB}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Days LTI-free</span>
                    <span className="font-medium text-emerald-600">{rig.hseStats.daysWithoutLTI}</span>
                  </div>
                </div>
                {/* Depth progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Drilling Progress</span>
                    <span>
                      {Math.round((rig.currentDepth_m / rig.targetTD_m) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${Math.round((rig.currentDepth_m / rig.targetTD_m) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
