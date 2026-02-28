"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  UserCheck,
  PlayCircle,
  Lock,
  Paperclip,
  FileText,
  Download,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Tag,
  Building2,
  Clock,
  Link2,
} from "lucide-react";
import { RecordHeader } from "@/components/shared/record-header";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { Timeline, type TimelineItem } from "@/components/shared/timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { REQUESTS, getRequestById } from "@/lib/dummy-data/requests";
import type { Request, RequestStatus, RequestAttachment } from "@/lib/dummy-data/requests";

// ─── Type Definitions ─────────────────────────────────────────────────────────

type TabKey = "details" | "tasks" | "timeline" | "approvals" | "linked";

const TABS = [
  { key: "details", label: "Details" },
  { key: "tasks", label: "Tasks", badge: 0 },
  { key: "timeline", label: "Timeline" },
  { key: "approvals", label: "Approvals" },
  { key: "linked", label: "Linked Items" },
];

// ─── Status Transition Map ────────────────────────────────────────────────────

const STATUS_NEXT: Partial<Record<RequestStatus, RequestStatus>> = {
  submitted: "acknowledged",
  pending_ack: "acknowledged",
  acknowledged: "in_progress",
  in_progress: "in_review",
  in_review: "completed",
  completed: "closed",
};

// ─── Priority Badge Colour ────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border border-red-200",
  urgent: "bg-orange-100 text-orange-700 border border-orange-200",
  high: "bg-amber-100 text-amber-700 border border-amber-200",
  routine: "bg-blue-100 text-blue-700 border border-blue-200",
  planned: "bg-slate-100 text-slate-600 border border-slate-200",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | undefined): string {
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

function formatDateTime(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

// ─── Action Buttons Logic ─────────────────────────────────────────────────────

interface ActionConfig {
  label: string;
  variant: "default" | "outline" | "destructive";
  icon: React.ReactNode;
  action: "accept" | "assign" | "reject" | "complete" | "close" | "progress";
}

function getActionsForStatus(status: RequestStatus): ActionConfig[] {
  switch (status) {
    case "submitted":
    case "pending_ack":
      return [
        {
          label: "Accept",
          variant: "default",
          icon: <CheckCircle2 className="size-3.5" />,
          action: "accept",
        },
        {
          label: "Assign",
          variant: "outline",
          icon: <UserCheck className="size-3.5" />,
          action: "assign",
        },
        {
          label: "Reject",
          variant: "destructive",
          icon: <XCircle className="size-3.5" />,
          action: "reject",
        },
      ];
    case "acknowledged":
      return [
        {
          label: "Start",
          variant: "default",
          icon: <PlayCircle className="size-3.5" />,
          action: "progress",
        },
      ];
    case "in_progress":
    case "in_review":
      return [
        {
          label: "Complete",
          variant: "default",
          icon: <CheckCircle2 className="size-3.5" />,
          action: "complete",
        },
      ];
    case "completed":
      return [
        {
          label: "Close",
          variant: "default",
          icon: <Lock className="size-3.5" />,
          action: "close",
        },
      ];
    default:
      return [];
  }
}

// ─── Detail Row Component ─────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 shrink-0 text-slate-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        {children ? (
          children
        ) : (
          <p className="text-sm text-slate-900 font-medium">{value ?? "—"}</p>
        )}
      </div>
    </div>
  );
}

// ─── Attachment Item ──────────────────────────────────────────────────────────

function AttachmentItem({ attachment }: { attachment: RequestAttachment }) {
  const iconColor =
    attachment.fileType === "pdf"
      ? "text-red-500"
      : attachment.fileType === "xlsx"
      ? "text-emerald-600"
      : attachment.fileType === "zip"
      ? "text-amber-600"
      : "text-slate-500";

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className={`size-4 shrink-0 ${iconColor}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {attachment.fileName}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {attachment.fileSize} &middot; Uploaded by {attachment.uploadedBy} &middot;{" "}
            {formatDate(attachment.uploadedAt)}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
        aria-label={`Download ${attachment.fileName}`}
      >
        <Download className="size-4" />
      </button>
    </div>
  );
}

// ─── Approval Step Card ───────────────────────────────────────────────────────

interface ApprovalStep {
  step: number;
  role: string;
  name: string | null;
  status: "approved" | "pending" | "rejected" | "awaiting";
  date?: string;
}

function ApprovalStepCard({ step }: { step: ApprovalStep }) {
  const statusIcon = {
    approved: <CheckCircle2 className="size-4 text-emerald-600" />,
    pending: <Clock className="size-4 text-amber-500" />,
    rejected: <XCircle className="size-4 text-red-500" />,
    awaiting: <Clock className="size-4 text-slate-400" />,
  }[step.status];

  const statusLabel = {
    approved: "Approved",
    pending: "Pending Review",
    rejected: "Rejected",
    awaiting: "Awaiting",
  }[step.status];

  const containerClass = {
    approved: "border-emerald-200 bg-emerald-50",
    pending: "border-amber-200 bg-amber-50",
    rejected: "border-red-200 bg-red-50",
    awaiting: "border-slate-200 bg-slate-50",
  }[step.status];

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border ${containerClass} transition-colors`}
    >
      <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">
        {step.step}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {step.role}
        </p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5">
          {step.name ?? "Unassigned"}
        </p>
        {step.date && (
          <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(step.date)}</p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-1.5">
        {statusIcon}
        <span className="text-xs font-medium text-slate-700">{statusLabel}</span>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function DetailsTab({ request }: { request: Request }) {
  const priorityClass = PRIORITY_COLORS[request.priority] ?? PRIORITY_COLORS.routine;

  return (
    <div className="space-y-6">
      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Primary Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Request Details</h3>
          </div>
          <div className="px-6 py-2">
            <DetailRow
              icon={<Tag className="size-4" />}
              label="Type"
              value={request.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            />
            <DetailRow
              icon={<AlertTriangle className="size-4" />}
              label="Priority"
            >
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${priorityClass}`}
              >
                {request.priority}
              </span>
            </DetailRow>
            <DetailRow
              icon={<Building2 className="size-4" />}
              label="Department"
              value={request.department}
            />
            <DetailRow
              icon={<MapPin className="size-4" />}
              label="Rig / Location"
              value={request.rigName ?? "N/A"}
            />
            <DetailRow
              icon={<Calendar className="size-4" />}
              label="Submitted"
              value={formatDateTime(request.submittedDate)}
            />
            <DetailRow
              icon={<Calendar className="size-4" />}
              label="Due Date"
              value={formatDate(request.dueDate)}
            />
            {request.acknowledgedDate && (
              <DetailRow
                icon={<Calendar className="size-4" />}
                label="Acknowledged"
                value={formatDateTime(request.acknowledgedDate)}
              />
            )}
            {request.completedDate && (
              <DetailRow
                icon={<Calendar className="size-4" />}
                label="Completed"
                value={formatDateTime(request.completedDate)}
              />
            )}
            {request.relatedDocumentNumber && (
              <DetailRow
                icon={<Link2 className="size-4" />}
                label="Related Document"
                value={request.relatedDocumentNumber}
              />
            )}
            {request.relatedRecordId && (
              <DetailRow
                icon={<Link2 className="size-4" />}
                label="Related Record"
                value={request.relatedRecordId}
              />
            )}
          </div>
        </div>

        {/* Right — Submitter & Assignee */}
        <div className="space-y-4">
          {/* Submitted By */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Submitted By</h3>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="shrink-0 size-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: request.submittedByAvatarColor }}
                >
                  {request.submittedByInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {request.submittedByName}
                  </p>
                  <p className="text-xs text-slate-500">Submitter</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned To */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Assigned To</h3>
            </div>
            <div className="px-5 py-4">
              {request.assignedToId ? (
                <div className="flex items-center gap-3">
                  <div
                    className="shrink-0 size-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: request.assignedToAvatarColor ?? "#64748B" }}
                  >
                    {request.assignedToInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {request.assignedToName}
                    </p>
                    <p className="text-xs text-slate-500">Assignee</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-slate-400">
                  <User className="size-5" />
                  <p className="text-sm">Unassigned</p>
                </div>
              )}
            </div>
          </div>

          {/* SLA Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">SLA</h3>
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Status</span>
                <StatusBadge status={request.sla.status} size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Deadline</span>
                <span className="text-xs font-semibold text-slate-900">
                  {formatDate(request.sla.deadlineDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Target Response</span>
                <span className="text-xs font-semibold text-slate-900">
                  {request.sla.targetResponseHours}h
                </span>
              </div>
              {request.sla.hoursRemaining !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Hours Remaining</span>
                  <span
                    className={`text-xs font-semibold ${
                      request.sla.hoursRemaining < 0
                        ? "text-red-600"
                        : request.sla.hoursRemaining < 24
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {request.sla.hoursRemaining < 0
                      ? `${Math.abs(request.sla.hoursRemaining)}h overdue`
                      : `${request.sla.hoursRemaining}h remaining`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Description</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {request.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {request.tags.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Tags</h3>
          </div>
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {request.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="size-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              Attachments
            </h3>
            {request.attachments.length > 0 && (
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                {request.attachments.length}
              </span>
            )}
          </div>
        </div>
        <div className="px-6 py-4">
          {request.attachments.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">
              No attachments uploaded.
            </p>
          ) : (
            <div className="space-y-2">
              {request.attachments.map((att) => (
                <AttachmentItem key={att.id} attachment={att} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TasksTab({ request }: { request: Request }) {
  // Mock tasks derived from the request
  const mockTasks = request.status !== "submitted" && request.status !== "pending_ack"
    ? [
        {
          id: `TSK-${request.id}-001`,
          title: `Review and process: ${request.title}`,
          assignedTo: request.assignedToName ?? "Unassigned",
          status: request.status === "completed" || request.status === "closed" ? "completed" : "in_progress",
          dueDate: request.dueDate,
        },
      ]
    : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">Related Tasks</h3>
      </div>
      {mockTasks.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <CheckCircle2 className="size-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">No tasks generated yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Tasks will appear here once this request is accepted and processed.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Task ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Assigned To
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Due Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs font-semibold text-blue-700">
                    {task.id}
                  </td>
                  <td className="px-6 py-3 text-slate-800 max-w-xs truncate">
                    {task.title}
                  </td>
                  <td className="px-6 py-3 text-slate-700">{task.assignedTo}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={task.status} size="sm" />
                  </td>
                  <td className="px-6 py-3 text-slate-600">{formatDate(task.dueDate)}</td>
                  <td className="px-6 py-3">
                    <Button variant="outline" size="xs">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TimelineTab({ request }: { request: Request }) {
  const events: TimelineItem[] = [];

  // Build lifecycle events
  events.push({
    id: `${request.id}-submitted`,
    actor: request.submittedByName,
    actorInitials: request.submittedByInitials,
    actorColor: request.submittedByAvatarColor,
    action: "submitted this request",
    timestamp: request.submittedDate,
    type: "created",
    details: request.description.substring(0, 120) + (request.description.length > 120 ? "..." : ""),
  });

  if (request.acknowledgedDate) {
    events.push({
      id: `${request.id}-acknowledged`,
      actor: request.assignedToName ?? "System",
      actorInitials: request.assignedToInitials ?? "SYS",
      actorColor: request.assignedToAvatarColor ?? "#64748B",
      action: "acknowledged and accepted this request",
      timestamp: request.acknowledgedDate,
      type: "status_change",
    });
  }

  if (
    request.status === "in_progress" ||
    request.status === "in_review" ||
    request.status === "completed" ||
    request.status === "closed"
  ) {
    events.push({
      id: `${request.id}-started`,
      actor: request.assignedToName ?? "System",
      actorInitials: request.assignedToInitials ?? "SYS",
      actorColor: request.assignedToAvatarColor ?? "#64748B",
      action: "started working on this request",
      timestamp: request.acknowledgedDate ?? request.submittedDate,
      type: "updated",
    });
  }

  // Add comments as timeline events
  for (const comment of request.comments) {
    events.push({
      id: comment.id,
      actor: comment.authorName,
      actorInitials: comment.authorInitials,
      actorColor: comment.authorAvatarColor,
      action: comment.isInternal ? "added an internal note" : "posted a comment",
      timestamp: comment.timestamp,
      type: "comment",
      details: comment.content,
    });
  }

  if (request.completedDate) {
    events.push({
      id: `${request.id}-completed`,
      actor: request.assignedToName ?? "System",
      actorInitials: request.assignedToInitials ?? "SYS",
      actorColor: request.assignedToAvatarColor ?? "#64748B",
      action: "marked this request as completed",
      timestamp: request.completedDate,
      type: "completed",
    });
  }

  if (request.status === "closed") {
    events.push({
      id: `${request.id}-closed`,
      actor: request.assignedToName ?? "System",
      actorInitials: request.assignedToInitials ?? "SYS",
      actorColor: request.assignedToAvatarColor ?? "#64748B",
      action: "closed this request",
      timestamp: request.completedDate ?? request.dueDate,
      type: "status_change",
    });
  }

  // Sort chronologically
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">Activity Timeline</h3>
        <p className="text-xs text-slate-500 mt-0.5">{events.length} events</p>
      </div>
      <div className="px-6 py-6">
        <Timeline items={events} />
      </div>
    </div>
  );
}

function ApprovalsTab({ request }: { request: Request }) {
  const isApprovedOrBeyond = ["approved", "completed", "closed"].includes(request.status);
  const isSubmittedOrPending = ["submitted", "pending_ack"].includes(request.status);
  const isAcknowledgedOrProgress = ["acknowledged", "in_progress", "in_review"].includes(request.status);

  const steps: ApprovalStep[] = [
    {
      step: 1,
      role: "Submitter",
      name: request.submittedByName,
      status: "approved",
      date: request.submittedDate,
    },
    {
      step: 2,
      role: "Department Manager",
      name: request.assignedToName,
      status: isSubmittedOrPending
        ? "pending"
        : "approved",
      date: request.acknowledgedDate,
    },
    {
      step: 3,
      role: "Technical Review",
      name: isAcknowledgedOrProgress || isApprovedOrBeyond ? request.assignedToName : null,
      status: isSubmittedOrPending
        ? "awaiting"
        : isAcknowledgedOrProgress
        ? "pending"
        : "approved",
    },
    {
      step: 4,
      role: "Final Approval",
      name: isApprovedOrBeyond ? "Hassan Al-Qahtani" : null,
      status: isApprovedOrBeyond ? "approved" : "awaiting",
      date: request.completedDate,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">Approval Chain</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Current approval status for this request
        </p>
      </div>
      <div className="px-6 py-5 space-y-3">
        {steps.map((step) => (
          <ApprovalStepCard key={step.step} step={step} />
        ))}
      </div>
    </div>
  );
}

function LinkedItemsTab({ request }: { request: Request }) {
  const linkedItems = [];

  if (request.relatedRecordId) {
    const prefix = request.relatedRecordId.split("-")[0];
    const type =
      prefix === "MOC"
        ? "Management of Change"
        : prefix === "NCO"
        ? "Non-Conformance"
        : prefix === "CAPA"
        ? "CAPA"
        : prefix === "AUD"
        ? "Audit"
        : "Record";

    linkedItems.push({
      id: request.relatedRecordId,
      type,
      label: request.relatedRecordId,
      href: "#",
    });
  }

  if (request.relatedDocumentNumber) {
    linkedItems.push({
      id: request.relatedDocumentNumber,
      type: "Document",
      label: request.relatedDocumentNumber,
      href: "#",
    });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">Linked Items</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Related records, documents and items
        </p>
      </div>
      <div className="px-6 py-5">
        {linkedItems.length === 0 ? (
          <div className="text-center py-8">
            <Link2 className="size-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">No linked items</p>
            <p className="text-xs text-slate-400 mt-1">
              There are no MOCs, NCOs, CAPAs, or documents linked to this request.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {linkedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <Link2 className="size-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.type}</p>
                  </div>
                </div>
                <Button variant="outline" size="xs">
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [activeTab, setActiveTab] = useState<TabKey>("details");
  const [currentStatus, setCurrentStatus] = useState<RequestStatus | null>(null);

  // Find request by ID (fall back to first request for demo)
  const baseRequest = getRequestById(rawId) ?? REQUESTS[0];

  // Build a mutable version with the current status override
  const request: Request = {
    ...baseRequest,
    status: currentStatus ?? baseRequest.status,
  };

  const requestId = baseRequest.id;
  const actions = getActionsForStatus(request.status);

  function handleAction(action: ActionConfig["action"]) {
    switch (action) {
      case "accept":
        setCurrentStatus("acknowledged");
        break;
      case "assign":
        setCurrentStatus("pending_ack");
        break;
      case "reject":
        setCurrentStatus("rejected");
        break;
      case "progress":
        setCurrentStatus("in_progress");
        break;
      case "complete":
        setCurrentStatus("completed");
        break;
      case "close":
        setCurrentStatus("closed");
        break;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Record Header */}
      <RecordHeader
        breadcrumbs={[
          { label: "Workspace", href: "/workspace" },
          { label: "Requests", href: "/workspace" },
          { label: requestId },
        ]}
        recordId={requestId}
        subtitle={request.title}
        badges={[
          { label: request.status, status: request.status },
          { label: request.priority, status: request.priority },
        ]}
        actions={actions.map((a) => ({
          label: a.label,
          icon: a.icon,
          variant: a.variant,
          onClick: () => handleAction(a.action),
        }))}
        onBack={() => router.push("/workspace")}
      />

      {/* Tab Navigation */}
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as TabKey)}
      />

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === "details" && <DetailsTab request={request} />}
        {activeTab === "tasks" && <TasksTab request={request} />}
        {activeTab === "timeline" && <TimelineTab request={request} />}
        {activeTab === "approvals" && <ApprovalsTab request={request} />}
        {activeTab === "linked" && <LinkedItemsTab request={request} />}
      </div>
    </div>
  );
}
