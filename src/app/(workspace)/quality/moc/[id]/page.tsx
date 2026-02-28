"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Lock,
  FileText,
  Box,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordHeader } from "@/components/shared/record-header";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { Timeline, TimelineItem } from "@/components/shared/timeline";
import { MOC_RECORDS, MocRecord, MocType } from "@/lib/dummy-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatMocType(type: MocType): string {
  const MAP: Record<MocType, string> = {
    permanent: "Permanent",
    temporary: "Temporary",
    emergency: "Emergency",
  };
  return MAP[type] ?? type;
}

function MocTypePill({ type }: { type: MocType }) {
  const CONFIG: Record<MocType, { color: string; bg: string }> = {
    permanent: { color: "#1D4ED8", bg: "#EFF6FF" },
    temporary: { color: "#EA580C", bg: "#FFF7ED" },
    emergency: { color: "#DC2626", bg: "#FEF2F2" },
  };
  const { color, bg } = CONFIG[type] ?? { color: "#64748B", bg: "#F1F5F9" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {formatMocType(type)}
    </span>
  );
}

function RiskLevelBadge({ level }: { level: string }) {
  const CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    low: { label: "Low", color: "#059669", bg: "#ECFDF5" },
    medium: { label: "Medium", color: "#D97706", bg: "#FFFBEB" },
    high: { label: "High", color: "#EA580C", bg: "#FFF7ED" },
    critical: { label: "Critical", color: "#DC2626", bg: "#FEF2F2" },
  };
  const { label, color, bg } = CONFIG[level] ?? { label: level, color: "#64748B", bg: "#F1F5F9" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {label} Risk
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-0">
      <dt className="text-xs font-medium text-slate-500 sm:w-44 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-slate-800">{value ?? "—"}</dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white", className)}>
      <div className="px-5 py-3.5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function MocNotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <p className="text-slate-500">
        MOC record not found: <strong>{id}</strong>
      </p>
      <Link href="/quality/moc" className="text-blue-600 hover:underline text-sm">
        Back to MOC List
      </Link>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ moc }: { moc: MocRecord }) {
  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Grid: Basic Info + Change Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Basic Information */}
        <SectionCard title="Basic Information">
          <dl className="flex flex-col gap-3">
            <InfoRow label="MOC Number" value={<span className="font-medium">{moc.id}</span>} />
            <InfoRow
              label="Title"
              value={<span className="leading-snug">{moc.title}</span>}
            />
            <InfoRow label="Type" value={<MocTypePill type={moc.type} />} />
            <InfoRow label="Category" value={moc.department} />
            <InfoRow label="Status" value={<StatusBadge status={moc.status} size="sm" />} />
            <InfoRow
              label="Priority"
              value={<PriorityIndicator priority={moc.priority} size="sm" />}
            />
            <InfoRow label="Requested By" value={moc.initiatedByName} />
            <InfoRow label="Request Date" value={formatDate(moc.initiatedDate)} />
            <InfoRow label="Location" value={moc.rigName ?? "HQ / All Rigs"} />
            <InfoRow label="Target Date" value={formatDate(moc.reviewDeadline)} />
            {moc.temporaryDuration && (
              <InfoRow label="Temp. Duration" value={moc.temporaryDuration} />
            )}
            <InfoRow label="Risk Level" value={<RiskLevelBadge level={moc.riskLevel} />} />
            {moc.approvedByName && (
              <InfoRow label="Approved By" value={moc.approvedByName} />
            )}
            {moc.approvedDate && (
              <InfoRow label="Approved Date" value={formatDate(moc.approvedDate)} />
            )}
          </dl>
        </SectionCard>

        {/* Change Details */}
        <div className="flex flex-col gap-5">
          <SectionCard title="Description">
            <p className="text-sm text-slate-700 leading-relaxed">{moc.description}</p>
          </SectionCard>
          <SectionCard title="Justification">
            <p className="text-sm text-slate-700 leading-relaxed">{moc.justification}</p>
          </SectionCard>
        </div>
      </div>

      {/* Impact Areas */}
      <SectionCard title="Impact Assessment">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Safety */}
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="size-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Safety Impact
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{moc.safetyImpact}</p>
          </div>
          {/* Environmental */}
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="size-4 text-green-600" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Environmental Impact
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{moc.environmentalImpact}</p>
          </div>
          {/* Operational */}
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="size-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Operational Impact
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{moc.operationalImpact}</p>
          </div>
        </div>

        {/* Impact tag chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["Safety", "Operations", "Quality", "Maintenance"].map((area) => (
            <span
              key={area}
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
            >
              {area}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Linked Documents & Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Linked Documents */}
        <SectionCard title="Linked Documents">
          {moc.relatedDocuments.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No documents linked.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {moc.relatedDocuments.map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <FileText className="size-3.5 text-slate-400" />
                  {doc}
                </span>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Linked Assets */}
        <SectionCard title="Linked Assets">
          {moc.affectedEquipment.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No assets linked.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {moc.affectedEquipment.map((asset) => (
                <span
                  key={asset}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Box className="size-3.5 text-slate-400" />
                  {asset}
                </span>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Tags */}
      {moc.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {moc.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Risk Assessment ─────────────────────────────────────────────────────

function RiskAssessmentTab({ moc }: { moc: MocRecord }) {
  const LIKELIHOOD = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
  const CONSEQUENCE = ["Insignificant", "Minor", "Moderate", "Major", "Catastrophic"];

  const COLORS: Record<number, string> = {
    1: "#ECFDF5",
    2: "#ECFDF5",
    3: "#FEF9C3",
    4: "#FEF9C3",
    5: "#FEF9C3",
    6: "#FEF9C3",
    8: "#FFF7ED",
    9: "#FEF2F2",
    10: "#FEF2F2",
    12: "#FEF2F2",
    15: "#FEF2F2",
    16: "#FEF2F2",
    20: "#FEF2F2",
    25: "#FEF2F2",
  };

  function cellColor(l: number, c: number): string {
    const score = l * c;
    if (score <= 4) return "#ECFDF5"; // green
    if (score <= 9) return "#FEF9C3"; // yellow
    if (score <= 15) return "#FFF7ED"; // orange
    return "#FEF2F2"; // red
  }

  function cellTextColor(l: number, c: number): string {
    const score = l * c;
    if (score <= 4) return "#059669";
    if (score <= 9) return "#92400E";
    if (score <= 15) return "#C2410C";
    return "#DC2626";
  }

  return (
    <div className="p-6 flex flex-col gap-5">
      <SectionCard title="Risk Matrix">
        <p className="text-sm text-slate-500 mb-5">
          5×5 Risk Matrix — Likelihood vs Consequence. Current MOC risk level:{" "}
          <RiskLevelBadge level={moc.riskLevel} />
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-500 font-medium w-36">
                  Likelihood \ Consequence
                </th>
                {CONSEQUENCE.map((c) => (
                  <th key={c} className="p-2 text-center text-slate-600 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIKELIHOOD.map((l, li) => (
                <tr key={l}>
                  <td className="p-2 text-slate-600 font-medium border-t border-slate-100">{l}</td>
                  {CONSEQUENCE.map((c, ci) => {
                    const score = (li + 1) * (ci + 1);
                    const bg = cellColor(li + 1, ci + 1);
                    const color = cellTextColor(li + 1, ci + 1);
                    return (
                      <td
                        key={c}
                        className="p-2 text-center border border-slate-100 font-semibold rounded"
                        style={{ backgroundColor: bg, color }}
                      >
                        {score}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          {[
            { label: "Low (1–4)", bg: "#ECFDF5", color: "#059669" },
            { label: "Medium (5–9)", bg: "#FEF9C3", color: "#92400E" },
            { label: "High (10–15)", bg: "#FFF7ED", color: "#C2410C" },
            { label: "Critical (16–25)", bg: "#FEF2F2", color: "#DC2626" },
          ].map(({ label, bg, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium"
              style={{ backgroundColor: bg, color }}
            >
              {label}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="HAZOP Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Safety Impact</p>
            <p className="text-sm text-slate-700 leading-relaxed">{moc.safetyImpact}</p>
          </div>
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Environmental Impact</p>
            <p className="text-sm text-slate-700 leading-relaxed">{moc.environmentalImpact}</p>
          </div>
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Operational Impact</p>
            <p className="text-sm text-slate-700 leading-relaxed">{moc.operationalImpact}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Tasks ───────────────────────────────────────────────────────────────

function TasksTab({ moc }: { moc: MocRecord }) {
  const tasks = [
    { id: 1, description: "Initiate MOC request and complete form", owner: moc.initiatedByName, dueDate: moc.initiatedDate, status: "completed" },
    { id: 2, description: "Technical review by Engineering department", owner: moc.reviewedByName ?? "—", dueDate: moc.reviewDeadline, status: moc.approvedDate ? "completed" : "in_progress" },
    { id: 3, description: "Risk assessment / HAZOP completion", owner: moc.reviewedByName ?? "—", dueDate: moc.reviewDeadline, status: moc.approvedDate ? "completed" : "open" },
    { id: 4, description: "Management approval", owner: moc.approvedByName ?? "—", dueDate: moc.approvedDate ?? moc.reviewDeadline, status: moc.approvedDate ? "completed" : "open" },
    { id: 5, description: "Implementation and close-out verification", owner: moc.initiatedByName, dueDate: moc.implementationDate ?? moc.reviewDeadline, status: moc.closedDate ? "completed" : "open" },
  ];

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: "Completed", color: "#059669", bg: "#ECFDF5" },
    in_progress: { label: "In Progress", color: "#2563EB", bg: "#EFF6FF" },
    open: { label: "Open", color: "#64748B", bg: "#F1F5F9" },
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <CheckCircle2 className="size-4 text-emerald-500" />
        <span>
          {completedCount} of {tasks.length} tasks completed
        </span>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Task</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-44">Owner</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.open;
              return (
                <tr key={task.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-xs text-slate-400">{task.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{task.description}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{task.owner}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatDate(task.dueDate)}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ color: cfg.color, backgroundColor: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Approvals ───────────────────────────────────────────────────────────

function ApprovalsTab({ moc }: { moc: MocRecord }) {
  const approvals = [
    {
      step: 1,
      role: "Initiator",
      name: moc.initiatedByName,
      action: "Submitted",
      date: moc.initiatedDate,
      status: "approved",
    },
    {
      step: 2,
      role: "Technical Reviewer",
      name: moc.reviewedByName ?? "—",
      action: moc.reviewedByName ? "Reviewed" : "Pending Review",
      date: moc.reviewedByName ? moc.reviewDeadline : undefined,
      status: moc.reviewedByName ? "approved" : "pending",
    },
    {
      step: 3,
      role: "Approving Authority",
      name: moc.approvedByName ?? "—",
      action: moc.approvedByName ? "Approved" : "Pending Approval",
      date: moc.approvedDate,
      status: moc.approvedDate ? "approved" : moc.reviewedByName ? "pending" : "not_started",
    },
  ];

  const STATUS_ICON: Record<string, React.ReactNode> = {
    approved: <CheckCircle2 className="size-4 text-emerald-500" />,
    pending: <AlertTriangle className="size-4 text-amber-500" />,
    not_started: <div className="size-4 rounded-full border-2 border-slate-200" />,
    rejected: <XCircle className="size-4 text-red-500" />,
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        {approvals.map((approval) => (
          <div
            key={approval.step}
            className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 shrink-0">
              {approval.step}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-800">{approval.name}</p>
                  <p className="text-xs text-slate-500">{approval.role}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {STATUS_ICON[approval.status]}
                  <span className="text-sm text-slate-600">{approval.action}</span>
                  {approval.date && (
                    <span className="text-xs text-slate-400">{formatDate(approval.date)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Timeline ────────────────────────────────────────────────────────────

function TimelineTab({ moc }: { moc: MocRecord }) {
  const items: TimelineItem[] = [
    {
      id: "evt-1",
      actor: moc.initiatedByName,
      actorInitials: moc.initiatedByInitials,
      actorColor: moc.initiatedByAvatarColor,
      action: "initiated the MOC request",
      timestamp: moc.initiatedDate,
      type: "created",
      details: `MOC ${moc.id} created for: ${moc.title}`,
    },
  ];

  if (moc.reviewedByName) {
    items.push({
      id: "evt-2",
      actor: moc.reviewedByName,
      action: "completed technical review",
      timestamp: moc.reviewDeadline,
      type: "updated",
    });
  }

  if (moc.approvedDate && moc.approvedByName) {
    items.push({
      id: "evt-3",
      actor: moc.approvedByName,
      action: "approved the MOC",
      timestamp: moc.approvedDate,
      type: "approval",
      details: "MOC approved for implementation.",
    });
  }

  if (moc.implementationDate) {
    items.push({
      id: "evt-4",
      actor: moc.initiatedByName,
      actorInitials: moc.initiatedByInitials,
      actorColor: moc.initiatedByAvatarColor,
      action: "commenced implementation",
      timestamp: moc.implementationDate,
      type: "status_change",
    });
  }

  if (moc.closedDate) {
    items.push({
      id: "evt-5",
      actor: moc.approvedByName ?? moc.reviewedByName ?? moc.initiatedByName,
      action: "closed the MOC",
      timestamp: moc.closedDate,
      type: "completed",
      details: "MOC closed after successful implementation and verification.",
    });
  }

  return (
    <div className="p-6">
      <Timeline items={items} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MocDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [activeTab, setActiveTab] = React.useState("overview");

  const moc = MOC_RECORDS.find((r) => r.id === id);

  if (!moc) return <MocNotFound id={id} />;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "risk_assessment", label: "Risk Assessment" },
    {
      key: "tasks",
      label: "Tasks",
      count: {
        current: [moc.initiatedDate, moc.reviewedByName, moc.approvedDate, moc.implementationDate, moc.closedDate].filter(Boolean).length,
        total: 5,
      },
    },
    { key: "approvals", label: "Approvals" },
    { key: "timeline", label: "Timeline" },
  ];

  const badges = [
    { label: moc.status, status: moc.status },
    { label: moc.type, status: moc.type === "permanent" ? "approved" : moc.type === "temporary" ? "on_hold" : "overdue" },
  ];

  const canApprove = ["under_review", "risk_assessment"].includes(moc.status);
  const canReject = ["under_review", "risk_assessment", "implementing"].includes(moc.status);
  const canClose = ["verification", "approved", "implementing"].includes(moc.status);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <RecordHeader
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "MOC", href: "/quality/moc" },
          { label: moc.id },
        ]}
        recordId={moc.id}
        subtitle={moc.title}
        badges={badges}
        actions={[
          ...(canApprove
            ? [
                {
                  label: "Approve",
                  icon: <CheckCircle2 />,
                  variant: "default" as const,
                  onClick: () => {},
                },
              ]
            : []),
          ...(canReject
            ? [
                {
                  label: "Reject",
                  icon: <XCircle />,
                  variant: "destructive" as const,
                  onClick: () => {},
                },
              ]
            : []),
          ...(canClose
            ? [
                {
                  label: "Close",
                  icon: <Lock />,
                  variant: "outline" as const,
                  onClick: () => {},
                },
              ]
            : []),
        ]}
        onBack={() => router.push("/quality/moc")}
      />

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1">
        {activeTab === "overview" && <OverviewTab moc={moc} />}
        {activeTab === "risk_assessment" && <RiskAssessmentTab moc={moc} />}
        {activeTab === "tasks" && <TasksTab moc={moc} />}
        {activeTab === "approvals" && <ApprovalsTab moc={moc} />}
        {activeTab === "timeline" && <TimelineTab moc={moc} />}
      </div>
    </div>
  );
}
