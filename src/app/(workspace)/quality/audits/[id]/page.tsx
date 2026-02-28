"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordHeader } from "@/components/shared/record-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { AUDIT_RECORDS, AuditRecord, AuditFinding, FindingSeverity, AuditType } from "@/lib/dummy-data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAuditType(type: AuditType): string {
  const MAP: Record<AuditType, string> = {
    internal_qms: "Internal QMS",
    hse_rig: "HSE Rig Audit",
    bop_test_audit: "BOP Test Audit",
    iadc: "IADC",
    third_party_api: "Third Party / API",
    saudi_aramco: "Saudi Aramco",
    management_review: "Management Review",
  };
  return MAP[type] ?? type;
}

function FindingTypeBadge({ severity }: { severity: FindingSeverity }) {
  const CONFIG: Record<FindingSeverity, { label: string; color: string; bg: string }> = {
    major: { label: "Major", color: "#DC2626", bg: "#FEF2F2" },
    minor: { label: "Minor", color: "#EA580C", bg: "#FFF7ED" },
    observation: { label: "Observation", color: "#2563EB", bg: "#EFF6FF" },
    opportunity_for_improvement: { label: "OFI", color: "#059669", bg: "#ECFDF5" },
  };
  const { label, color, bg } = CONFIG[severity] ?? {
    label: severity,
    color: "#64748B",
    bg: "#F1F5F9",
  };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-0">
      <dt className="text-xs font-medium text-slate-500 sm:w-44 shrink-0">{label}</dt>
      <dd className="text-sm text-slate-800">{value ?? "—"}</dd>
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function AuditNotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <p className="text-slate-500">Audit record not found: <strong>{id}</strong></p>
      <Link href="/quality/audits" className="text-blue-600 hover:underline text-sm">
        Back to Audits
      </Link>
    </div>
  );
}

// ─── Findings Table ───────────────────────────────────────────────────────────

function FindingsTable({ findings }: { findings: AuditFinding[] }) {
  if (findings.length === 0) {
    return (
      <div className="rounded-md border border-slate-100 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
        No findings recorded for this audit.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Description
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">
              Type
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-44">
              Clause Reference
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">
              Status
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">
              Assigned To
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">
              Due Date
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">
              Linked CAPA
            </th>
          </tr>
        </thead>
        <tbody>
          {findings.map((f, idx) => (
            <tr
              key={f.id}
              className={cn("border-b border-slate-100 last:border-0", "hover:bg-slate-50/60")}
            >
              <td className="px-4 py-3 text-sm text-slate-800">
                <p className="line-clamp-2 max-w-sm">{f.description}</p>
              </td>
              <td className="px-4 py-3">
                <FindingTypeBadge severity={f.severity} />
              </td>
              <td className="px-4 py-3 text-xs text-slate-600">{f.clauseReference}</td>
              <td className="px-4 py-3">
                <StatusBadge status={f.status} size="sm" />
              </td>
              <td className="px-4 py-3 text-xs text-slate-700">{f.assignedToName}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{f.dueDate}</td>
              <td className="px-4 py-3 text-xs">
                {/* CAPA link — in real app this would come from finding data */}
                <span className="text-slate-400">—</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const audit = AUDIT_RECORDS.find((a) => a.id === id);

  if (!audit) {
    return <AuditNotFound id={id} />;
  }

  const openFindings = audit.findings.filter((f) => f.status !== "closed").length;
  const closedFindings = audit.findings.filter((f) => f.status === "closed").length;

  return (
    <div className="flex flex-col">
      {/* Record Header */}
      <RecordHeader
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "Audits", href: "/quality/audits" },
          { label: audit.id },
        ]}
        recordId={audit.id}
        subtitle={audit.title}
        badges={[{ label: audit.status, status: audit.status }]}
      />

      {/* Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* Info card */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Audit Information</h2>
          </div>
          <div className="px-5 py-5">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Audit Number" value={audit.id} />
              <InfoRow label="Title" value={audit.title} />
              <InfoRow label="Type" value={formatAuditType(audit.type)} />
              <InfoRow
                label="Status"
                value={<StatusBadge status={audit.status} size="sm" />}
              />
              <InfoRow
                label="Standard(s)"
                value={audit.standardsApplicable.join(", ")}
              />
              <InfoRow label="Location" value={audit.location} />
              <InfoRow label="Scope" value={<span className="text-slate-700 leading-relaxed">{audit.scope}</span>} />
              <InfoRow label="Planned Date" value={audit.plannedDate} />
              <InfoRow
                label="Completed Date"
                value={audit.actualEndDate ?? "Not yet completed"}
              />
              <InfoRow label="Lead Auditor" value={audit.leadAuditorName} />
              <InfoRow
                label="Audit Team"
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {audit.auditTeam.map((name, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                }
              />
              {audit.summaryScore !== undefined && (
                <InfoRow
                  label="Score"
                  value={
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        audit.summaryScore >= 90
                          ? "text-emerald-600"
                          : audit.summaryScore >= 75
                          ? "text-amber-600"
                          : "text-red-600"
                      )}
                    >
                      {audit.summaryScore}%
                    </span>
                  }
                />
              )}
            </dl>
          </div>
        </div>

        {/* Overall Conclusion */}
        {audit.summaryNotes && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 flex gap-3">
            <Info className="size-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-0.5">Overall Conclusion</p>
              <p className="text-sm text-blue-700 leading-relaxed">{audit.summaryNotes}</p>
            </div>
          </div>
        )}

        {/* Findings */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Findings
              <span className="ml-2 text-slate-400 font-normal text-xs">
                ({audit.findings.length} total · {openFindings} open · {closedFindings} closed)
              </span>
            </h2>
          </div>
          <div className="p-5">
            <FindingsTable findings={audit.findings} />
          </div>
        </div>

        {/* Next Audit Date */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm px-5 py-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <span className="text-lg">📅</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Next Audit Date</p>
            <p className="text-sm font-semibold text-slate-800">
              {audit.reportIssuedDate
                ? (() => {
                    const d = new Date(audit.plannedDate);
                    d.setFullYear(d.getFullYear() + 1);
                    return d.toISOString().split("T")[0];
                  })()
                : "TBD — to be scheduled"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
