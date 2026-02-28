"use client";

import * as React from "react";
import {
  Star,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

// ─── Types ────────────────────────────────────────────────────────────────────

type VendorStatus = "approved" | "conditional" | "under_review" | "suspended" | "blacklisted";
type PerformanceRating = "excellent" | "good" | "satisfactory" | "poor" | "critical";

interface VendorRecord {
  id: string;
  vendorCode: string;
  name: string;
  category: string;
  country: string;
  status: VendorStatus;
  rating: PerformanceRating;
  lastAuditDate: string;
  nextAuditDate: string;
  openNcos: number;
  certifications: string[];
  contractExpiry: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const VENDORS: VendorRecord[] = [
  {
    id: "VND-001",
    vendorCode: "VQ-2024-001",
    name: "Gulf Drilling Supplies Co.",
    category: "Drilling Equipment",
    country: "UAE",
    status: "approved",
    rating: "excellent",
    lastAuditDate: "2025-09-15",
    nextAuditDate: "2026-09-15",
    openNcos: 0,
    certifications: ["ISO 9001", "API Q1"],
    contractExpiry: "2027-03-31",
  },
  {
    id: "VND-002",
    vendorCode: "VQ-2024-002",
    name: "Petro Safety Systems LLC",
    category: "Safety Equipment",
    country: "Saudi Arabia",
    status: "approved",
    rating: "good",
    lastAuditDate: "2025-11-20",
    nextAuditDate: "2026-11-20",
    openNcos: 1,
    certifications: ["ISO 9001", "ISO 45001"],
    contractExpiry: "2026-12-31",
  },
  {
    id: "VND-003",
    vendorCode: "VQ-2024-003",
    name: "Al-Rashid Industrial Services",
    category: "Maintenance Services",
    country: "Kuwait",
    status: "conditional",
    rating: "satisfactory",
    lastAuditDate: "2025-06-10",
    nextAuditDate: "2026-06-10",
    openNcos: 3,
    certifications: ["ISO 9001"],
    contractExpiry: "2026-06-30",
  },
  {
    id: "VND-004",
    vendorCode: "VQ-2024-004",
    name: "Oilfield Logistics International",
    category: "Logistics & Transport",
    country: "Oman",
    status: "approved",
    rating: "good",
    lastAuditDate: "2025-08-05",
    nextAuditDate: "2026-08-05",
    openNcos: 0,
    certifications: ["ISO 9001", "ISO 14001"],
    contractExpiry: "2027-01-15",
  },
  {
    id: "VND-005",
    vendorCode: "VQ-2024-005",
    name: "Precision Tubulars Ltd.",
    category: "Tubular Goods",
    country: "India",
    status: "under_review",
    rating: "satisfactory",
    lastAuditDate: "2025-04-22",
    nextAuditDate: "2026-04-22",
    openNcos: 2,
    certifications: ["API 5CT", "ISO 9001"],
    contractExpiry: "2026-08-31",
  },
  {
    id: "VND-006",
    vendorCode: "VQ-2024-006",
    name: "Desert Welding & Fabrication",
    category: "Fabrication",
    country: "UAE",
    status: "approved",
    rating: "excellent",
    lastAuditDate: "2025-10-01",
    nextAuditDate: "2026-10-01",
    openNcos: 0,
    certifications: ["ISO 3834", "ASME"],
    contractExpiry: "2027-06-30",
  },
  {
    id: "VND-007",
    vendorCode: "VQ-2024-007",
    name: "Apex Mud Services",
    category: "Drilling Fluids",
    country: "Bahrain",
    status: "suspended",
    rating: "poor",
    lastAuditDate: "2025-03-18",
    nextAuditDate: "2026-03-18",
    openNcos: 5,
    certifications: ["ISO 9001"],
    contractExpiry: "2026-03-31",
  },
  {
    id: "VND-008",
    vendorCode: "VQ-2024-008",
    name: "Crescent Catering Services",
    category: "Catering",
    country: "Qatar",
    status: "approved",
    rating: "good",
    lastAuditDate: "2025-12-10",
    nextAuditDate: "2026-12-10",
    openNcos: 0,
    certifications: ["ISO 22000", "HACCP"],
    contractExpiry: "2027-02-28",
  },
  {
    id: "VND-009",
    vendorCode: "VQ-2024-009",
    name: "Falcon Crane & Lifting",
    category: "Lifting Equipment",
    country: "UAE",
    status: "conditional",
    rating: "satisfactory",
    lastAuditDate: "2025-07-14",
    nextAuditDate: "2026-07-14",
    openNcos: 2,
    certifications: ["ISO 9001"],
    contractExpiry: "2026-09-30",
  },
  {
    id: "VND-010",
    vendorCode: "VQ-2024-010",
    name: "Horizon Chemical Solutions",
    category: "Chemicals",
    country: "Saudi Arabia",
    status: "blacklisted",
    rating: "critical",
    lastAuditDate: "2025-01-25",
    nextAuditDate: "—",
    openNcos: 8,
    certifications: [],
    contractExpiry: "2025-06-30",
  },
  {
    id: "VND-011",
    vendorCode: "VQ-2024-011",
    name: "Atlas PPE Distributors",
    category: "PPE & Safety Wear",
    country: "UAE",
    status: "approved",
    rating: "good",
    lastAuditDate: "2025-11-05",
    nextAuditDate: "2026-11-05",
    openNcos: 0,
    certifications: ["ISO 9001", "CE Marking"],
    contractExpiry: "2027-04-30",
  },
  {
    id: "VND-012",
    vendorCode: "VQ-2024-012",
    name: "Nile Electrical Engineering",
    category: "Electrical Systems",
    country: "Egypt",
    status: "under_review",
    rating: "satisfactory",
    lastAuditDate: "2025-05-30",
    nextAuditDate: "2026-05-30",
    openNcos: 1,
    certifications: ["ISO 9001", "IEC 61439"],
    contractExpiry: "2026-10-31",
  },
];

// ─── Status & Rating Helpers ──────────────────────────────────────────────────

const VENDOR_STATUS_CONFIG: Record<VendorStatus, { label: string; bg: string; color: string }> = {
  approved: { label: "Approved", bg: "#F0FDF4", color: "#16A34A" },
  conditional: { label: "Conditional", bg: "#FFFBEB", color: "#D97706" },
  under_review: { label: "Under Review", bg: "#EFF6FF", color: "#2563EB" },
  suspended: { label: "Suspended", bg: "#FEF2F2", color: "#DC2626" },
  blacklisted: { label: "Blacklisted", bg: "#1E293B", color: "#FFFFFF" },
};

const RATING_CONFIG: Record<PerformanceRating, { label: string; stars: number; color: string }> = {
  excellent: { label: "Excellent", stars: 5, color: "#16A34A" },
  good: { label: "Good", stars: 4, color: "#2563EB" },
  satisfactory: { label: "Satisfactory", stars: 3, color: "#D97706" },
  poor: { label: "Poor", stars: 2, color: "#EA580C" },
  critical: { label: "Critical", stars: 1, color: "#DC2626" },
};

function VendorStatusBadge({ status }: { status: VendorStatus }) {
  const config = VENDOR_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function RatingStars({ rating }: { rating: PerformanceRating }) {
  const config = RATING_CONFIG[rating];
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3"
            style={{
              color: i < config.stars ? config.color : "#E2E8F0",
              fill: i < config.stars ? config.color : "none",
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-medium text-slate-500 ml-0.5">
        {config.label}
      </span>
    </div>
  );
}

function formatDate(dateStr: string) {
  if (dateStr === "—") return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCards() {
  const approved = VENDORS.filter((v) => v.status === "approved").length;
  const conditional = VENDORS.filter((v) => v.status === "conditional" || v.status === "under_review").length;
  const suspended = VENDORS.filter((v) => v.status === "suspended" || v.status === "blacklisted").length;
  const totalOpenNcos = VENDORS.reduce((sum, v) => sum + v.openNcos, 0);

  const cards = [
    {
      label: "Approved Vendors",
      count: approved,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
      iconBg: "#F0FDF4",
      color: "#16A34A",
    },
    {
      label: "Under Review / Conditional",
      count: conditional,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      iconBg: "#FFFBEB",
      color: "#D97706",
    },
    {
      label: "Suspended / Blacklisted",
      count: suspended,
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      iconBg: "#FEF2F2",
      color: "#DC2626",
    },
    {
      label: "Open NCOs",
      count: totalOpenNcos,
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      iconBg: "#EFF6FF",
      color: "#2563EB",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: card.iconBg }}
            >
              {card.icon}
            </div>
            <span className="text-xs font-medium text-slate-500">{card.label}</span>
          </div>
          <span className="text-3xl font-bold leading-none" style={{ color: card.color }}>
            {card.count}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Vendor Quality Page ──────────────────────────────────────────────────────

export default function VendorQualityPage() {
  const columns: Column<VendorRecord>[] = [
    {
      key: "vendorCode",
      header: "Code",
      sortable: true,
      width: "120px",
      render: (val: string) => (
        <span className="font-mono text-xs font-semibold text-blue-600 whitespace-nowrap">
          {val}
        </span>
      ),
    },
    {
      key: "name",
      header: "Vendor Name",
      sortable: true,
      render: (val: string) => (
        <span className="text-sm font-medium text-slate-800 block max-w-[200px] truncate">
          {val}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "140px",
      render: (val: string) => (
        <span className="text-xs text-slate-600 whitespace-nowrap">{val}</span>
      ),
    },
    {
      key: "country",
      header: "Country",
      width: "90px",
      render: (val: string) => (
        <span className="text-xs text-slate-500">{val}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      render: (val: VendorStatus) => <VendorStatusBadge status={val} />,
    },
    {
      key: "rating",
      header: "Rating",
      width: "140px",
      render: (val: PerformanceRating) => <RatingStars rating={val} />,
    },
    {
      key: "openNcos",
      header: "Open NCOs",
      width: "90px",
      sortable: true,
      render: (val: number) => (
        <span
          className={`text-xs font-semibold ${val > 0 ? "text-red-600" : "text-slate-400"}`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "certifications",
      header: "Certifications",
      width: "160px",
      render: (val: string[]) =>
        val.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {val.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600"
              >
                {cert}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-400">None</span>
        ),
    },
    {
      key: "nextAuditDate",
      header: "Next Audit",
      sortable: true,
      width: "100px",
      render: (val: string) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(val)}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Vendor Quality Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track vendor performance, audit schedules, and quality compliance
        </p>
      </div>

      <SummaryCards />

      <DataTable
        data={VENDORS}
        columns={columns}
        searchPlaceholder="Search vendors..."
        searchKeys={["vendorCode", "name", "category", "country"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "approved", label: "Approved" },
              { value: "conditional", label: "Conditional" },
              { value: "under_review", label: "Under Review" },
              { value: "suspended", label: "Suspended" },
              { value: "blacklisted", label: "Blacklisted" },
            ],
          },
          {
            key: "category",
            label: "Category",
            options: [
              { value: "Drilling Equipment", label: "Drilling Equipment" },
              { value: "Safety Equipment", label: "Safety Equipment" },
              { value: "Maintenance Services", label: "Maintenance Services" },
              { value: "Logistics & Transport", label: "Logistics & Transport" },
              { value: "Tubular Goods", label: "Tubular Goods" },
              { value: "Fabrication", label: "Fabrication" },
              { value: "Drilling Fluids", label: "Drilling Fluids" },
              { value: "Catering", label: "Catering" },
              { value: "Lifting Equipment", label: "Lifting Equipment" },
              { value: "Chemicals", label: "Chemicals" },
              { value: "PPE & Safety Wear", label: "PPE & Safety Wear" },
              { value: "Electrical Systems", label: "Electrical Systems" },
            ],
          },
          {
            key: "rating",
            label: "Rating",
            options: [
              { value: "excellent", label: "Excellent" },
              { value: "good", label: "Good" },
              { value: "satisfactory", label: "Satisfactory" },
              { value: "poor", label: "Poor" },
              { value: "critical", label: "Critical" },
            ],
          },
        ]}
        pageSize={10}
        itemLabel="vendors"
        emptyMessage="No vendors found."
      />
    </div>
  );
}
