"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Pencil,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Link2,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordHeader } from "@/components/shared/record-header";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { Timeline, TimelineItem } from "@/components/shared/timeline";
import { CAPA_RECORDS, CapaRecord, CapaAction } from "@/lib/dummy-data";

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

type SourceType = CapaRecord["sourceType"];

function formatSourceType(type: SourceType): { label: string; color: string; bg: string } {
  const MAP: Record<SourceType, { label: string; color: string; bg: string }> = {
    nco: { label: "NCO", color: "#DC2626", bg: "#FEF2F2" },
    audit_finding: { label: "Audit Finding", color: "#7C3AED", bg: "#F3E8FF" },
    incident: { label: "Incident", color: "#EA580C", bg: "#FFF7ED" },
    management_review: { label: "Management Review", color: "#2563EB", bg: "#EFF6FF" },
    customer_feedback: { label: "Customer Complaint", color: "#D97706", bg: "#FFFBEB" },
  };
  return MAP[type] ?? { label: type, color: "#64748B", bg: "#F1F5F9" };
}

function SourceTypePill({ type }: { type: SourceType }) {
  const { label, color, bg } = formatSourceType(type);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function ActionStatusPill({ status }: { status: CapaAction["status"] }) {
  const CONFIG: Record<CapaAction["status"], { label: string; color: string; bg: string; Icon: React.ComponentType<{ className?: string }> }> = {
    completed: { label: "Completed", color: "#059669", bg: "#ECFDF5", Icon: CheckCircle2 },
    in_progress: { label: "In Progress", color: "#2563EB", bg: "#EFF6FF", Icon: Clock },
    overdue: { label: "Overdue", color: "#DC2626", bg: "#FEF2F2", Icon: AlertCircle },
    open: { label: "Open", color: "#64748B", bg: "#F1F5F9", Icon: HelpCircle },
  };
  const { label, color, bg, Icon } = CONFIG[status] ?? CONFIG.open;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      <Icon className="size-3" />
      {label}
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

function CapaNotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <p className="text-slate-500">
        CAPA record not found: <strong>{id}</strong>
      </p>
      <Link href="/quality/capa" className="text-blue-600 hover:underline text-sm">
        Back to CAPA List
      </Link>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ capa }: { capa: CapaRecord }) {
  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CAPA Information */}
        <SectionCard title="CAPA Information">
          <dl className="flex flex-col gap-3">
            <InfoRow label="CAPA Number" value={<span className="font-medium">{capa.id}</span>} />
            <InfoRow label="Title" value={<span className="leading-snug">{capa.title}</span>} />
            <InfoRow label="Status" value={<StatusBadge status={capa.status} size="sm" />} />
            <InfoRow
              label="Priority"
              value={<PriorityIndicator priority={capa.priority} size="sm" />}
            />
            <InfoRow label="Source Type" value={<SourceTypePill type={capa.sourceType} />} />
            <InfoRow
              label="Source ID"
              value={
                <Link
                  href={
                    capa.sourceType === "nco"
                      ? `/quality/nco/${capa.sourceRecordId}`
                      : capa.sourceType === "audit_finding"
                      ? `/quality/audits/${capa.sourceRecordId}`
                      : "#"
                  }
                  className="text-blue-600 hover:underline font-medium"
                >
                  {capa.sourceRecordId}
                </Link>
              }
            />
            <InfoRow label="Location" value={capa.rigName ?? "HQ / All Rigs"} />
            <InfoRow label="Department" value={capa.department} />
            <InfoRow label="Initiated By" value={capa.raisedByName} />
            <InfoRow label="Initiated Date" value={formatDate(capa.raisedDate)} />
            <InfoRow label="Assigned To" value={capa.assignedToName} />
            <InfoRow label="Target Date" value={formatDate(capa.dueDate)} />
            {capa.verificationDate && (
              <InfoRow label="Verification Date" value={formatDate(capa.verificationDate)} />
            )}
            {capa.verifiedByName && (
              <InfoRow label="Verified By" value={capa.verifiedByName} />
            )}
            {capa.effectivenessDate && (
              <InfoRow label="Effectiveness Date" value={formatDate(capa.effectivenessDate)} />
            )}
            {capa.closedDate && (
              <InfoRow label="Closed Date" value={formatDate(capa.closedDate)} />
            )}
          </dl>
        </SectionCard>

        {/* Right: problem + linked NCO */}
        <div className="flex flex-col gap-5">
          <SectionCard title="Problem Statement">
            <p className="text-sm text-slate-700 leading-relaxed">{capa.problemStatement}</p>
          </SectionCard>

          <SectionCard title="Immediate Actions">
            <p className="text-sm text-slate-700 leading-relaxed">{capa.immediateActions}</p>
          </SectionCard>
        </div>
      </div>

      {/* Linked Non-Conformances */}
      {capa.sourceType === "nco" && (
        <SectionCard title="Linked Non-Conformances">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/quality/nco/${capa.sourceRecordId}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2.5 hover:bg-red-100 transition-colors"
            >
              <span className="text-sm font-semibold text-red-700">{capa.sourceRecordId}</span>
              <ChevronRight className="size-3.5 text-red-400" />
            </Link>
          </div>
        </SectionCard>
      )}

      {/* Verification Method */}
      <SectionCard title="Verification Method">
        <p className="text-sm text-slate-700 leading-relaxed">{capa.verificationMethod}</p>
      </SectionCard>

      {/* Tags */}
      {capa.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {capa.tags.map((tag) => (
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

// ─── Tab: Root Cause Analysis (5-Why) ────────────────────────────────────────

function RcaTab({ capa }: { capa: CapaRecord }) {
  // Parse root cause analysis into 5-Why format
  // The rootCauseAnalysis field may contain structured text with 5-Why notation
  const rca = capa.rootCauseAnalysis;

  // Extract 5-why pairs via regex or fallback to a structured breakdown
  const whyPattern = /\((\d)\)\s*([^→\(]+?)(?:\s*→|\s*(?=\(\d\))|$)/g;
  const extracted: { why: string; because: string }[] = [];

  // Try to parse numbered items like "(1) X → (2) Y"
  const sentences = rca.split(/(?:\s*→\s*|\s*\(\d+\)\s*)/).filter(Boolean);
  const numbered = [...rca.matchAll(/\((\d)\)\s*([^(]+?)(?=\s*(?:\(|\d\)|$))/g)];

  let whys: { why: string; because: string }[] = [];

  if (numbered.length >= 3) {
    // Build 5-why from numbered list
    whys = numbered.map((m, i) => ({
      why: i === 0
        ? "Why did the primary failure occur?"
        : `Why did problem #${i} occur?`,
      because: m[2].trim().replace(/\.$/, ""),
    }));
  } else {
    // Fallback: split sentences into progressive whys
    const allSentences = rca
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    const count = Math.min(allSentences.length, 5);
    const labels = [
      "Why did the primary failure occur?",
      "Why did the contributing factor arise?",
      "Why was the root process inadequate?",
      "Why was the gap not detected?",
      "Why did the systemic root cause persist?",
    ];
    whys = allSentences.slice(0, count).map((s, i) => ({
      why: labels[i] ?? `Why #${i + 1}?`,
      because: s.replace(/\.$/, ""),
    }));
  }

  return (
    <div className="p-6 flex flex-col gap-5">
      <SectionCard title="5-Why Root Cause Analysis">
        <p className="text-sm text-slate-500 mb-6">
          Sequential causal chain leading to the root cause.
        </p>
        <div className="flex flex-col gap-0">
          {whys.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Connector */}
              {idx < whys.length - 1 && (
                <div className="absolute left-5 top-full w-px h-5 bg-slate-200 z-10" />
              )}
              <div
                className={cn(
                  "rounded-lg border p-4 mb-5 relative",
                  idx === whys.length - 1
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Step number */}
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      idx === whys.length - 1
                        ? "bg-red-600 text-white"
                        : "bg-slate-800 text-white"
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      {item.why}
                    </p>
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        idx === whys.length - 1 ? "text-red-800 font-medium" : "text-slate-800"
                      )}
                    >
                      {item.because}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Full RCA text */}
      <SectionCard title="Detailed Root Cause Analysis">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{rca}</p>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Action Plan ─────────────────────────────────────────────────────────

function ActionPlanTab({ capa }: { capa: CapaRecord }) {
  const completedCount = capa.actions.filter((a) => a.status === "completed").length;

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Progress summary */}
      <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <span className="font-medium text-slate-800">
            {completedCount} / {capa.actions.length}
          </span>
          <span className="text-slate-500">actions completed</span>
        </div>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{
              width: capa.actions.length > 0
                ? `${(completedCount / capa.actions.length) * 100}%`
                : "0%",
            }}
          />
        </div>
        <span className="text-sm text-slate-500 shrink-0">
          {capa.actions.length > 0
            ? `${Math.round((completedCount / capa.actions.length) * 100)}%`
            : "0%"}
        </span>
      </div>

      {/* Actions table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        {capa.actions.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No actions defined.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-44">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {capa.actions.map((action, idx) => (
                <tr key={action.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 leading-snug">
                    {action.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{action.responsiblePersonName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatDate(action.dueDate)}</td>
                  <td className="px-4 py-3">
                    <ActionStatusPill status={action.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {action.evidence ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        {action.evidence}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Effectiveness ───────────────────────────────────────────────────────

function EffectivenessTab({ capa }: { capa: CapaRecord }) {
  const isEffective = capa.status === "closed";
  const isPendingReview = capa.status === "effectiveness_review";

  const criteria = [
    {
      label: "All actions completed",
      met: capa.actions.every((a) => a.status === "completed"),
    },
    {
      label: "Root cause addressed",
      met: capa.rootCauseAnalysis.length > 50,
    },
    {
      label: "Verification completed",
      met: !!capa.verificationDate,
    },
    {
      label: "Recurrence check passed",
      met: isEffective,
    },
    {
      label: "Effectiveness review finalised",
      met: isEffective,
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Effectiveness status */}
      <SectionCard title="Effectiveness Status">
        <div className="flex items-center gap-3 mb-5">
          {isEffective ? (
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="size-4" />
              CAPA Effective — Closed
            </span>
          ) : isPendingReview ? (
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200">
              <Clock className="size-4" />
              Effectiveness Review in Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 border border-slate-200">
              <HelpCircle className="size-4" />
              Pending Effectiveness Review
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {criteria.map((c, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {c.met ? (
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              ) : (
                <div className="size-4 rounded-full border-2 border-slate-200 shrink-0" />
              )}
              <span className={cn("text-sm", c.met ? "text-slate-800" : "text-slate-400")}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Verification */}
      <SectionCard title="Verification">
        <dl className="flex flex-col gap-3">
          <InfoRow label="Verification Method" value={capa.verificationMethod} />
          {capa.verificationDate && (
            <InfoRow label="Verification Date" value={formatDate(capa.verificationDate)} />
          )}
          {capa.verifiedByName && (
            <InfoRow label="Verified By" value={capa.verifiedByName} />
          )}
          {capa.effectivenessDate && (
            <InfoRow label="Effectiveness Review Date" value={formatDate(capa.effectivenessDate)} />
          )}
        </dl>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Timeline ────────────────────────────────────────────────────────────

function CapaTimelineTab({ capa }: { capa: CapaRecord }) {
  const items: TimelineItem[] = [
    {
      id: "evt-1",
      actor: capa.raisedByName,
      actorInitials: capa.raisedByInitials,
      actorColor: capa.raisedByAvatarColor,
      action: "raised the CAPA",
      timestamp: capa.raisedDate,
      type: "created",
      details: `${capa.id}: ${capa.title}`,
    },
  ];

  if (capa.immediateActions) {
    items.push({
      id: "evt-2",
      actor: capa.assignedToName,
      action: "applied immediate actions",
      timestamp: capa.raisedDate,
      type: "updated",
      details: capa.immediateActions.substring(0, 100) + (capa.immediateActions.length > 100 ? "…" : ""),
    });
  }

  // Add action completion events
  capa.actions
    .filter((a) => a.completedDate)
    .forEach((action, idx) => {
      items.push({
        id: `action-${idx}`,
        actor: action.responsiblePersonName,
        action: `completed action: ${action.description.substring(0, 60)}${action.description.length > 60 ? "…" : ""}`,
        timestamp: action.completedDate!,
        type: "completed",
        details: action.evidence,
      });
    });

  if (capa.verificationDate && capa.verifiedByName) {
    items.push({
      id: "evt-verify",
      actor: capa.verifiedByName,
      action: "completed verification",
      timestamp: capa.verificationDate,
      type: "approval",
      details: capa.verificationMethod,
    });
  }

  if (capa.closedDate) {
    items.push({
      id: "evt-close",
      actor: capa.verifiedByName ?? capa.raisedByName,
      action: "closed the CAPA",
      timestamp: capa.closedDate,
      type: "completed",
      details: "CAPA closed — verified effective.",
    });
  }

  // Sort by timestamp ascending
  items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="p-6">
      <Timeline items={items} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CapaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [activeTab, setActiveTab] = React.useState("overview");

  const capa = CAPA_RECORDS.find((r) => r.id === id);

  if (!capa) return <CapaNotFound id={id} />;

  const completedActions = capa.actions.filter((a) => a.status === "completed").length;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "rca", label: "Root Cause Analysis (5-Why)" },
    {
      key: "action_plan",
      label: "Action Plan",
      count: { current: completedActions, total: capa.actions.length },
    },
    { key: "effectiveness", label: "Effectiveness" },
    { key: "timeline", label: "Timeline" },
  ];

  const badges = [
    { label: capa.status, status: capa.status },
    { label: capa.priority, status: capa.priority === "critical" ? "overdue" : capa.priority === "urgent" ? "risk_assessment" : capa.priority === "high" ? "under_review" : "planned" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <RecordHeader
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "CAPA", href: "/quality/capa" },
          { label: capa.id },
        ]}
        recordId={capa.id}
        subtitle={capa.title}
        badges={badges}
        actions={[
          {
            label: "Edit",
            icon: <Pencil />,
            variant: "outline" as const,
            onClick: () => {},
          },
          {
            label: "Print",
            icon: <Printer />,
            variant: "outline" as const,
            onClick: () => {},
          },
          {
            label: "Share",
            icon: <Share2 />,
            variant: "outline" as const,
            onClick: () => {},
          },
        ]}
        onBack={() => router.push("/quality/capa")}
      />

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1">
        {activeTab === "overview" && <OverviewTab capa={capa} />}
        {activeTab === "rca" && <RcaTab capa={capa} />}
        {activeTab === "action_plan" && <ActionPlanTab capa={capa} />}
        {activeTab === "effectiveness" && <EffectivenessTab capa={capa} />}
        {activeTab === "timeline" && <CapaTimelineTab capa={capa} />}
      </div>
    </div>
  );
}
