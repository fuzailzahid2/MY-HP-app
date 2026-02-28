"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocType =
  | "policy"
  | "procedure"
  | "work_instruction"
  | "form"
  | "plan"
  | "specification"
  | "manual";

type DocStatus = "active" | "under_review" | "obsolete" | "draft";

interface ImsDocument {
  id: string;
  documentNumber: string;
  title: string;
  type: DocType;
  owner: string;
  revision: string;
  effectiveDate: string;
  nextReviewDate: string;
  status: DocStatus;
}

// ─── Inline Dummy Data ────────────────────────────────────────────────────────

const IMS_DOCUMENTS: ImsDocument[] = [
  {
    id: "DOC-001",
    documentNumber: "ADI-QMS-POL-001",
    title: "Quality Policy — ADI Integrated Management System",
    type: "policy",
    owner: "Hassan Al-Qahtani",
    revision: "Rev 4",
    effectiveDate: "2024-01-01",
    nextReviewDate: "2026-01-01",
    status: "active",
  },
  {
    id: "DOC-002",
    documentNumber: "ADI-HSE-POL-001",
    title: "Health, Safety & Environment Policy",
    type: "policy",
    owner: "Ali Hassan",
    revision: "Rev 3",
    effectiveDate: "2024-03-01",
    nextReviewDate: "2026-03-01",
    status: "active",
  },
  {
    id: "DOC-003",
    documentNumber: "ADI-QMS-PROC-001",
    title: "Document and Records Control Procedure",
    type: "procedure",
    owner: "Fatima Al-Subaie",
    revision: "Rev 5",
    effectiveDate: "2024-06-15",
    nextReviewDate: "2026-06-15",
    status: "active",
  },
  {
    id: "DOC-004",
    documentNumber: "ADI-QMS-PROC-002",
    title: "Management Review Procedure",
    type: "procedure",
    owner: "Hassan Al-Qahtani",
    revision: "Rev 3",
    effectiveDate: "2024-02-01",
    nextReviewDate: "2026-02-01",
    status: "active",
  },
  {
    id: "DOC-005",
    documentNumber: "ADI-QMS-PROC-006",
    title: "Supplier Qualification and Approved Supplier List Management",
    type: "procedure",
    owner: "Khalid Al-Harbi",
    revision: "Rev 2",
    effectiveDate: "2024-10-01",
    nextReviewDate: "2026-10-01",
    status: "active",
  },
  {
    id: "DOC-006",
    documentNumber: "ADI-OPS-PROC-028",
    title: "BOP Inspection, Testing and Maintenance Procedure",
    type: "procedure",
    owner: "Emma Richards",
    revision: "Rev 5",
    effectiveDate: "2025-01-20",
    nextReviewDate: "2027-01-20",
    status: "active",
  },
  {
    id: "DOC-007",
    documentNumber: "ADI-OPS-PROC-041",
    title: "Casing Cementing Quality Assurance Procedure",
    type: "procedure",
    owner: "Emma Richards",
    revision: "Rev 3",
    effectiveDate: "2025-03-12",
    nextReviewDate: "2027-03-12",
    status: "active",
  },
  {
    id: "DOC-008",
    documentNumber: "ADI-HSE-PROC-002",
    title: "Wellsite HSE Inspection Procedure",
    type: "procedure",
    owner: "Peter Okafor",
    revision: "Rev 4",
    effectiveDate: "2024-04-01",
    nextReviewDate: "2026-04-01",
    status: "active",
  },
  {
    id: "DOC-009",
    documentNumber: "ADI-HSE-PROC-011",
    title: "Chemical Management and MSDS Control",
    type: "procedure",
    owner: "Ali Hassan",
    revision: "Rev 2",
    effectiveDate: "2023-09-01",
    nextReviewDate: "2025-09-01",
    status: "under_review",
  },
  {
    id: "DOC-010",
    documentNumber: "ADI-MAINT-PROC-001",
    title: "Critical Equipment Maintenance Management Procedure",
    type: "procedure",
    owner: "Khalid Mahmoud",
    revision: "Rev 3",
    effectiveDate: "2025-02-26",
    nextReviewDate: "2027-02-26",
    status: "active",
  },
  {
    id: "DOC-011",
    documentNumber: "ADI-QMS-WI-003",
    title: "Non-Conformance Reporting — Work Instruction",
    type: "work_instruction",
    owner: "Emma Richards",
    revision: "Rev 2",
    effectiveDate: "2024-07-01",
    nextReviewDate: "2026-07-01",
    status: "active",
  },
  {
    id: "DOC-012",
    documentNumber: "ADI-QMS-FORM-003",
    title: "Pre-Job Safety Meeting Checklist",
    type: "form",
    owner: "Fatima Al-Subaie",
    revision: "Rev 4",
    effectiveDate: "2025-03-12",
    nextReviewDate: "2027-03-12",
    status: "active",
  },
  {
    id: "DOC-013",
    documentNumber: "ADI-SCM-ASL-001",
    title: "Approved Supplier List — Critical Spare Parts",
    type: "specification",
    owner: "Khalid Al-Harbi",
    revision: "Rev 1",
    effectiveDate: "2025-03-28",
    nextReviewDate: "2027-03-28",
    status: "active",
  },
  {
    id: "DOC-014",
    documentNumber: "ADI-OPS-MAN-001",
    title: "Rig Operations Manual — Standard Practices",
    type: "manual",
    owner: "Omar Hassan",
    revision: "Rev 6",
    effectiveDate: "2023-11-01",
    nextReviewDate: "2025-11-01",
    status: "under_review",
  },
  {
    id: "DOC-015",
    documentNumber: "ADI-HSE-PLAN-001",
    title: "Emergency Response Plan — All Rigs",
    type: "plan",
    owner: "Ali Hassan",
    revision: "Rev 3",
    effectiveDate: "2024-12-01",
    nextReviewDate: "2026-12-01",
    status: "active",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function DocTypePill({ type }: { type: DocType }) {
  const CONFIG: Record<DocType, { label: string; color: string; bg: string }> = {
    policy: { label: "Policy", color: "#7C3AED", bg: "#F3E8FF" },
    procedure: { label: "Procedure", color: "#1D4ED8", bg: "#EFF6FF" },
    work_instruction: { label: "Work Instruction", color: "#0891B2", bg: "#ECFEFF" },
    form: { label: "Form", color: "#D97706", bg: "#FFFBEB" },
    plan: { label: "Plan", color: "#059669", bg: "#ECFDF5" },
    specification: { label: "Specification", color: "#EA580C", bg: "#FFF7ED" },
    manual: { label: "Manual", color: "#64748B", bg: "#F1F5F9" },
  };
  const { label, color, bg } = CONFIG[type];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function ReviewDateCell({ date, status }: { date: string; status: DocStatus }) {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffDays = Math.floor((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (status === "obsolete") {
    return <span className="text-xs text-slate-400">{date}</span>;
  }

  if (diffDays < 0) {
    return (
      <span className="text-xs text-red-600 font-medium">
        {date}
        <span className="ml-1 text-[10px] text-red-500 bg-red-50 rounded-full px-1.5 py-0.5">
          Overdue
        </span>
      </span>
    );
  }

  if (diffDays <= 90) {
    return (
      <span className="text-xs text-amber-600 font-medium">
        {date}
        <span className="ml-1 text-[10px] text-amber-600 bg-amber-50 rounded-full px-1.5 py-0.5">
          {diffDays}d
        </span>
      </span>
    );
  }

  return <span className="text-xs text-slate-600">{date}</span>;
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const COLUMNS: Column<ImsDocument>[] = [
  {
    key: "documentNumber",
    header: "Document Number",
    sortable: true,
    width: "180px",
    render: (v: string) => (
      <span className="font-mono text-xs font-semibold text-blue-700">{v}</span>
    ),
  },
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (v: string) => (
      <span className="text-sm text-slate-800">{v}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    width: "150px",
    render: (v: DocType) => <DocTypePill type={v} />,
  },
  {
    key: "owner",
    header: "Owner",
    sortable: true,
    width: "150px",
    render: (v: string) => <span className="text-sm text-slate-700">{v}</span>,
  },
  {
    key: "revision",
    header: "Revision",
    width: "90px",
    render: (v: string) => (
      <span className="text-xs font-medium text-slate-600 bg-slate-100 rounded px-1.5 py-0.5">
        {v}
      </span>
    ),
  },
  {
    key: "effectiveDate",
    header: "Effective Date",
    sortable: true,
    width: "120px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "nextReviewDate",
    header: "Next Review",
    sortable: true,
    width: "130px",
    render: (v: string, row: ImsDocument) => (
      <ReviewDateCell date={v} status={row.status} />
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "120px",
    render: (v: string) => <StatusBadge status={v} size="sm" />,
  },
  {
    key: "_actions",
    header: "Actions",
    width: "80px",
    render: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="View">
          <Eye className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" title="Download">
          <Download className="size-3.5" />
        </Button>
      </div>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImsDocumentsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">IMS Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Integrated Management System document registry
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs">
          + New Document
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Documents",
            value: IMS_DOCUMENTS.length,
            color: "text-slate-800",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "Active",
            value: IMS_DOCUMENTS.filter((d) => d.status === "active").length,
            color: "text-emerald-700",
            bg: "bg-emerald-50 border-emerald-200",
          },
          {
            label: "Under Review",
            value: IMS_DOCUMENTS.filter((d) => d.status === "under_review").length,
            color: "text-amber-700",
            bg: "bg-amber-50 border-amber-200",
          },
          {
            label: "Draft",
            value: IMS_DOCUMENTS.filter((d) => d.status === "draft").length,
            color: "text-blue-700",
            bg: "bg-blue-50 border-blue-200",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={cn("rounded-lg border px-4 py-3", kpi.bg)}
          >
            <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
            <p className={cn("text-2xl font-bold mt-0.5", kpi.color)}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Document Register</h2>
        </div>
        <div className="p-5">
          <DataTable<ImsDocument>
            data={IMS_DOCUMENTS}
            columns={COLUMNS}
            searchPlaceholder="Search documents..."
            searchKeys={["documentNumber", "title", "owner"]}
            filters={[
              {
                key: "type",
                label: "Document Type",
                options: [
                  { label: "Policy", value: "policy" },
                  { label: "Procedure", value: "procedure" },
                  { label: "Work Instruction", value: "work_instruction" },
                  { label: "Form", value: "form" },
                  { label: "Plan", value: "plan" },
                  { label: "Specification", value: "specification" },
                  { label: "Manual", value: "manual" },
                ],
              },
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "active" },
                  { label: "Under Review", value: "under_review" },
                  { label: "Draft", value: "draft" },
                  { label: "Obsolete", value: "obsolete" },
                ],
              },
            ]}
            itemLabel="documents"
            pageSize={25}
          />
        </div>
      </div>
    </div>
  );
}
