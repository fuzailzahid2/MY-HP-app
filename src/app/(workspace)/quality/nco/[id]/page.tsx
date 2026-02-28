"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Lock,
  FileImage,
  FileText,
  Link2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordHeader } from "@/components/shared/record-header";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import { Timeline, TimelineItem } from "@/components/shared/timeline";
import { NCO_RECORDS, NcoRecord, NcoSeverity, NcoType, NcoDisposition } from "@/lib/dummy-data";

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

function isOverdue(dueDate: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function formatNcoType(type: NcoType): string {
  const MAP: Record<NcoType, string> = {
    equipment_failure: "Equipment Failure",
    procedure_deviation: "Procedure Deviation",
    material_defect: "Material Defect",
    documentation: "Documentation",
    personnel_competency: "Personnel Competency",
    environmental: "Environmental",
    safety_observation: "Safety Observation",
  };
  return MAP[type] ?? type;
}

function formatDisposition(disposition: NcoDisposition): string {
  const MAP: Record<NcoDisposition, string> = {
    scrap: "Scrap",
    rework: "Rework",
    use_as_is: "Use As-Is",
    return_to_supplier: "Return to Supplier",
    conditional_use: "Conditional Use",
    pending: "Pending",
  };
  return MAP[disposition] ?? disposition;
}

function NcoSeverityPill({ severity }: { severity: NcoSeverity }) {
  const CONFIG: Record<NcoSeverity, { label: string; color: string; bg: string }> = {
    critical: { label: "Critical", color: "#DC2626", bg: "#FEF2F2" },
    major: { label: "Major", color: "#EA580C", bg: "#FFF7ED" },
    minor: { label: "Minor", color: "#059669", bg: "#ECFDF5" },
    observation: { label: "Observation", color: "#2563EB", bg: "#EFF6FF" },
  };
  const { label, color, bg } = CONFIG[severity] ?? { label: severity, color: "#64748B", bg: "#F1F5F9" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function DispositionPill({ disposition }: { disposition: NcoDisposition }) {
  const CONFIG: Record<NcoDisposition, { color: string; bg: string }> = {
    scrap: { color: "#DC2626", bg: "#FEF2F2" },
    rework: { color: "#2563EB", bg: "#EFF6FF" },
    use_as_is: { color: "#059669", bg: "#ECFDF5" },
    return_to_supplier: { color: "#EA580C", bg: "#FFF7ED" },
    conditional_use: { color: "#D97706", bg: "#FFFBEB" },
    pending: { color: "#64748B", bg: "#F1F5F9" },
  };
  const { color, bg } = CONFIG[disposition] ?? { color: "#64748B", bg: "#F1F5F9" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {formatDisposition(disposition)}
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

function NcoNotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <p className="text-slate-500">
        NCO record not found: <strong>{id}</strong>
      </p>
      <Link href="/quality/nco" className="text-blue-600 hover:underline text-sm">
        Back to NCO List
      </Link>
    </div>
  );
}

// ─── Tab: Details ─────────────────────────────────────────────────────────────

function DetailsTab({ nco }: { nco: NcoRecord }) {
  const overdue = nco.status !== "closed" && isOverdue(nco.dueDate);

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* NCO Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="NCO Information">
          <dl className="flex flex-col gap-3">
            <InfoRow label="NCO Number" value={<span className="font-medium">{nco.id}</span>} />
            <InfoRow
              label="Title"
              value={<span className="leading-snug">{nco.title}</span>}
            />
            <InfoRow label="Type" value={formatNcoType(nco.type)} />
            <InfoRow label="Severity" value={<NcoSeverityPill severity={nco.severity} />} />
            <InfoRow label="Status" value={<StatusBadge status={nco.status} size="sm" />} />
            <InfoRow label="Reported By" value={nco.raisedByName} />
            <InfoRow label="Report Date" value={formatDate(nco.raisedDate)} />
            <InfoRow label="Location" value={nco.rigName ?? "HQ / Base"} />
            <InfoRow label="Department" value={nco.department} />
            {nco.assignedToName && (
              <InfoRow label="Assigned To" value={nco.assignedToName} />
            )}
            <InfoRow
              label="Due Date"
              value={
                <span className={cn("font-medium", overdue ? "text-red-600" : "text-slate-800")}>
                  {formatDate(nco.dueDate)}
                  {overdue && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs text-red-600">
                      <AlertTriangle className="size-3" />
                      Overdue
                    </span>
                  )}
                </span>
              }
            />
            {nco.closedDate && (
              <InfoRow label="Closed Date" value={formatDate(nco.closedDate)} />
            )}
            {nco.relatedCapaId && (
              <InfoRow
                label="Related CAPA"
                value={
                  <Link
                    href={`/quality/capa/${nco.relatedCapaId}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {nco.relatedCapaId}
                  </Link>
                }
              />
            )}
          </dl>
        </SectionCard>

        {/* Right column: cost + disposition */}
        <div className="flex flex-col gap-5">
          {/* Cost Impact */}
          {(nco.estimatedCost !== undefined || nco.actualCost !== undefined) && (
            <SectionCard title="Cost Impact">
              <div className="flex flex-col gap-3">
                {nco.estimatedCost !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Estimated Cost</span>
                    <span className="text-lg font-bold text-amber-600">
                      ${nco.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                )}
                {nco.actualCost !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Actual Cost</span>
                    <span
                      className={cn(
                        "text-lg font-bold",
                        nco.actualCost > (nco.estimatedCost ?? 0)
                          ? "text-red-600"
                          : "text-emerald-600"
                      )}
                    >
                      ${nco.actualCost.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Disposition */}
          {nco.disposition && (
            <SectionCard title="Disposition">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Type:</span>
                  <DispositionPill disposition={nco.disposition} />
                </div>
                {nco.dispositionJustification && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {nco.dispositionJustification}
                  </p>
                )}
              </div>
            </SectionCard>
          )}

          {/* Affected Items */}
          {nco.affectedItems.length > 0 && (
            <SectionCard title="Affected Items">
              <div className="flex flex-wrap gap-2">
                {nco.affectedItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* Description */}
      <SectionCard title="Description">
        <p className="text-sm text-slate-700 leading-relaxed">{nco.description}</p>
      </SectionCard>

      {/* Containment Action */}
      {nco.containmentAction && (
        <SectionCard title="Containment Action">
          <p className="text-sm text-slate-700 leading-relaxed">{nco.containmentAction}</p>
        </SectionCard>
      )}

      {/* Root Cause */}
      {nco.rootCause && (
        <SectionCard title="Root Cause">
          <p className="text-sm text-slate-700 leading-relaxed">{nco.rootCause}</p>
        </SectionCard>
      )}

      {/* Tags */}
      {nco.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {nco.tags.map((tag) => (
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

// ─── Tab: Evidence ────────────────────────────────────────────────────────────

function EvidenceTab({ nco }: { nco: NcoRecord }) {
  const MOCK_EVIDENCE = [
    { name: "Inspection-Photo-001.jpg", type: "image", size: "2.4 MB" },
    { name: "MPI-Report.pdf", type: "pdf", size: "1.1 MB" },
    { name: "Measurement-Record.xlsx", type: "document", size: "340 KB" },
  ];

  return (
    <div className="p-6 flex flex-col gap-5">
      <SectionCard title="Evidence Files">
        {MOCK_EVIDENCE.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No evidence files attached.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {MOCK_EVIDENCE.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {file.type === "image" ? (
                  <FileImage className="size-5 text-blue-500 shrink-0" />
                ) : (
                  <FileText className="size-5 text-red-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Linked documents from data */}
      {nco.relatedDocuments.length > 0 && (
        <SectionCard title="Referenced Documents">
          <div className="flex flex-wrap gap-2">
            {nco.relatedDocuments.map((doc) => (
              <span
                key={doc}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <FileText className="size-3.5 text-slate-400" />
                {doc}
              </span>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ─── Tab: Linked Items ────────────────────────────────────────────────────────

function LinkedItemsTab({ nco }: { nco: NcoRecord }) {
  return (
    <div className="p-6 flex flex-col gap-5">
      {nco.relatedCapaId ? (
        <SectionCard title="Linked CAPA">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-200">
              <Link2 className="size-5 text-amber-600" />
            </div>
            <div>
              <Link
                href={`/quality/capa/${nco.relatedCapaId}`}
                className="text-base font-semibold text-blue-600 hover:underline"
              >
                {nco.relatedCapaId}
              </Link>
              <p className="text-xs text-slate-500 mt-0.5">
                Corrective & Preventive Action linked to this NCO
              </p>
            </div>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Linked CAPA">
          <p className="text-sm text-slate-400 italic">No CAPA linked to this NCO.</p>
        </SectionCard>
      )}

      {/* Related Documents */}
      {nco.relatedDocuments.length > 0 && (
        <SectionCard title="Related Documents">
          <div className="flex flex-wrap gap-2">
            {nco.relatedDocuments.map((doc) => (
              <span
                key={doc}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <FileText className="size-3.5 text-slate-400" />
                {doc}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Affected Items */}
      {nco.affectedItems.length > 0 && (
        <SectionCard title="Affected Assets">
          <div className="flex flex-wrap gap-2">
            {nco.affectedItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ─── Tab: Timeline ────────────────────────────────────────────────────────────

function NcoTimelineTab({ nco }: { nco: NcoRecord }) {
  const items: TimelineItem[] = [
    {
      id: "evt-1",
      actor: nco.raisedByName,
      actorInitials: nco.raisedByInitials,
      actorColor: nco.raisedByAvatarColor,
      action: "raised the NCO",
      timestamp: nco.raisedDate,
      type: "created",
      details: nco.title,
    },
  ];

  if (nco.containmentAction) {
    items.push({
      id: "evt-2",
      actor: nco.assignedToName ?? nco.raisedByName,
      action: "applied containment action",
      timestamp: nco.raisedDate,
      type: "updated",
      details: nco.containmentAction.substring(0, 120) + (nco.containmentAction.length > 120 ? "…" : ""),
    });
  }

  if (nco.rootCause) {
    items.push({
      id: "evt-3",
      actor: nco.assignedToName ?? nco.raisedByName,
      action: "identified root cause",
      timestamp: nco.dueDate,
      type: "status_change",
    });
  }

  if (nco.relatedCapaId) {
    items.push({
      id: "evt-4",
      actor: nco.assignedToName ?? nco.raisedByName,
      action: `raised CAPA — ${nco.relatedCapaId}`,
      timestamp: nco.dueDate,
      type: "approval",
    });
  }

  if (nco.closedDate) {
    items.push({
      id: "evt-5",
      actor: nco.assignedToName ?? nco.raisedByName,
      action: "closed the NCO",
      timestamp: nco.closedDate,
      type: "completed",
      details: nco.disposition
        ? `Disposition: ${formatDisposition(nco.disposition)}`
        : undefined,
    });
  }

  return (
    <div className="p-6">
      <Timeline items={items} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NcoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [activeTab, setActiveTab] = React.useState("details");

  const nco = NCO_RECORDS.find((r) => r.id === id);

  if (!nco) return <NcoNotFound id={id} />;

  const tabs = [
    { key: "details", label: "Details" },
    { key: "evidence", label: "Evidence" },
    { key: "linked_items", label: "Linked Items" },
    { key: "timeline", label: "Timeline" },
  ];

  const badges = [
    { label: nco.severity, status: nco.severity === "critical" ? "overdue" : nco.severity === "major" ? "risk_assessment" : nco.severity === "minor" ? "active" : "under_review" },
    { label: nco.status, status: nco.status },
  ];

  const canInvestigate = ["open", "containment_applied"].includes(nco.status);
  const canClose = ["root_cause_identified", "disposition_pending", "capa_raised"].includes(nco.status);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <RecordHeader
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "NCO", href: "/quality/nco" },
          { label: nco.id },
        ]}
        recordId={nco.id}
        subtitle={nco.title}
        badges={badges}
        actions={[
          ...(canInvestigate
            ? [
                {
                  label: "Investigate",
                  icon: <Search />,
                  variant: "default" as const,
                  onClick: () => {},
                },
              ]
            : []),
          ...(canClose
            ? [
                {
                  label: "Close NCO",
                  icon: <Lock />,
                  variant: "outline" as const,
                  onClick: () => {},
                },
              ]
            : []),
        ]}
        onBack={() => router.push("/quality/nco")}
      />

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1">
        {activeTab === "details" && <DetailsTab nco={nco} />}
        {activeTab === "evidence" && <EvidenceTab nco={nco} />}
        {activeTab === "linked_items" && <LinkedItemsTab nco={nco} />}
        {activeTab === "timeline" && <NcoTimelineTab nco={nco} />}
      </div>
    </div>
  );
}
