"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Edit, ArrowRightLeft, Wrench, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordHeader } from "@/components/shared/record-header";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  ASSETS,
  Asset,
  AssetCategory,
  AssetStatus,
  AssetCertificate,
  AssetInspectionRecord,
  AssetMaintenanceRecord,
  AssetSpecification,
  InspectionResult,
} from "@/lib/dummy-data";

// ─── Criticality ──────────────────────────────────────────────────────────────

type Criticality = "A" | "B" | "C";

function getCriticality(asset: Asset): Criticality {
  const A_CATS: AssetCategory[] = ["well_control", "structural", "power_generation"];
  const B_CATS: AssetCategory[] = ["hoisting", "rotating", "circulating", "lifting"];
  if (A_CATS.includes(asset.category)) return "A";
  if (B_CATS.includes(asset.category)) return "B";
  return "C";
}

const CRITICALITY_LABEL: Record<Criticality, string> = {
  A: "A - Safety Critical",
  B: "B - Operations Critical",
  C: "C - Standard",
};

const CRITICALITY_COLORS: Record<Criticality, { color: string; bg: string }> = {
  A: { color: "#DC2626", bg: "#FEF2F2" },
  B: { color: "#2563EB", bg: "#EFF6FF" },
  C: { color: "#64748B", bg: "#F1F5F9" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCategory(cat: AssetCategory): string {
  const MAP: Record<AssetCategory, string> = {
    well_control: "Well Control",
    hoisting: "Hoisting",
    rotating: "Rotating",
    circulating: "Circulating",
    power_generation: "Power Generation",
    structural: "Structural",
    lifting: "Lifting",
    drill_string: "Drill String",
    safety_equipment: "Safety Equipment",
    instrumentation: "Instrumentation",
    vehicles: "Vehicles",
  };
  return MAP[cat] ?? cat;
}

function formatStatus(status: AssetStatus): string {
  const MAP: Record<AssetStatus, string> = {
    active: "active",
    in_service: "active",
    out_of_service: "inactive",
    maintenance: "in_progress",
    inspection_due: "overdue",
    quarantine: "on_hold",
    scrapped: "cancelled",
    on_order: "pending",
  };
  return MAP[status] ?? status;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-0">
      <dt className="text-xs font-medium text-slate-500 sm:w-40 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-slate-800 flex-1">{value ?? "—"}</dd>
    </div>
  );
}

// ─── Information Tab ──────────────────────────────────────────────────────────

function InformationTab({ asset }: { asset: Asset }) {
  const criticality = getCriticality(asset);
  const critColors = CRITICALITY_COLORS[criticality];

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Asset Information */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Asset Information</h3>
        </div>
        <div className="px-5 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InfoRow label="Tag Number" value={
              <span className="font-mono text-xs font-bold text-slate-800">{asset.assetTag}</span>
            } />
            <InfoRow label="Name" value={asset.description} />
            <InfoRow label="Category" value={formatCategory(asset.category)} />
            <InfoRow label="Manufacturer" value={asset.manufacturer} />
            <InfoRow label="Model" value={asset.model} />
            <InfoRow label="Serial Number" value={
              <span className="font-mono text-xs">{asset.serialNumber}</span>
            } />
            {asset.partNumber && (
              <InfoRow label="Part Number" value={
                <span className="font-mono text-xs">{asset.partNumber}</span>
              } />
            )}
            <InfoRow label="Location" value={asset.location} />
            <InfoRow label="Rig" value={asset.rigName ?? "Base / Not Assigned"} />
            <InfoRow
              label="Status"
              value={<StatusBadge status={formatStatus(asset.status)} size="sm" />}
            />
            <InfoRow
              label="Criticality"
              value={
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ color: critColors.color, backgroundColor: critColors.bg }}
                >
                  {CRITICALITY_LABEL[criticality]}
                </span>
              }
            />
            <InfoRow label="Install Date" value={asset.purchaseDate} />
            <InfoRow label="Last Service" value={asset.lastPMDate} />
            <InfoRow label="Next Service Due" value={
              <span className={cn(
                "text-sm font-medium",
                new Date(asset.nextPMDate) < new Date() ? "text-red-600" : "text-slate-800"
              )}>
                {asset.nextPMDate}
              </span>
            } />
            {asset.serviceHours !== undefined && (
              <InfoRow
                label="Service Hours"
                value={
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {asset.serviceHours.toLocaleString()}
                    </span>
                    {asset.maxServiceHours && (
                      <>
                        <span className="text-xs text-slate-400">
                          / {asset.maxServiceHours.toLocaleString()} hrs
                        </span>
                        <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              asset.serviceHours / asset.maxServiceHours > 0.85
                                ? "bg-red-500"
                                : asset.serviceHours / asset.maxServiceHours > 0.65
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            )}
                            style={{
                              width: `${Math.min(
                                100,
                                (asset.serviceHours / asset.maxServiceHours) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                }
              />
            )}
            {asset.notes && (
              <div className="col-span-2">
                <InfoRow
                  label="Notes"
                  value={<span className="text-slate-600 leading-relaxed">{asset.notes}</span>}
                />
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Specifications */}
      {asset.specifications.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Specifications</h3>
          </div>
          <div className="px-5 py-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {asset.specifications.map((spec: AssetSpecification, i: number) => (
                <InfoRow
                  key={i}
                  label={spec.key}
                  value={
                    <span className="font-medium">
                      {spec.value}
                      {spec.unit ? (
                        <span className="ml-1 text-slate-400 font-normal">{spec.unit}</span>
                      ) : null}
                    </span>
                  }
                />
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Certifications Tab ───────────────────────────────────────────────────────

function CertStatus({ status }: { status: AssetCertificate["status"] }) {
  const CONFIG = {
    valid: { label: "Valid", color: "#059669", bg: "#ECFDF5", Icon: CheckCircle2 },
    expiring_soon: { label: "Expiring Soon", color: "#D97706", bg: "#FFFBEB", Icon: Clock },
    expired: { label: "Expired", color: "#DC2626", bg: "#FEF2F2", Icon: XCircle },
  }[status];
  const { label, color, bg, Icon } = CONFIG;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}

function CertificationsTab({ asset }: { asset: Asset }) {
  const certs = asset.certificates;

  if (certs.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-slate-100 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
          No certifications recorded for this asset.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Certificate Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-48">
                  Issuing Body
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">
                  Certificate Number
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">
                  Issue Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">
                  Expiry Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {certs.map((cert: AssetCertificate) => (
                <tr
                  key={cert.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3 text-sm text-slate-800 font-medium">{cert.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{cert.issuedBy}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-600">{cert.certificateNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{cert.issuedDate}</td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={cn(
                        "font-medium",
                        cert.status === "expired"
                          ? "text-red-600"
                          : cert.status === "expiring_soon"
                          ? "text-amber-600"
                          : "text-slate-700"
                      )}
                    >
                      {cert.expiryDate}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <CertStatus status={cert.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function InspResultBadge({ result }: { result: InspectionResult }) {
  const CONFIG: Record<InspectionResult, { label: string; color: string; bg: string }> = {
    pass: { label: "Pass", color: "#059669", bg: "#ECFDF5" },
    conditional_pass: { label: "Conditional Pass", color: "#D97706", bg: "#FFFBEB" },
    fail: { label: "Fail", color: "#DC2626", bg: "#FEF2F2" },
    pending: { label: "Pending", color: "#64748B", bg: "#F1F5F9" },
  };
  const { label, color, bg } = CONFIG[result];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function HistoryTab({ asset }: { asset: Asset }) {
  // Combine inspection and maintenance records into a timeline
  const events: Array<{
    date: string;
    type: "inspection" | "maintenance";
    title: string;
    detail: string;
    badge?: React.ReactNode;
    ref?: string;
  }> = [
    ...asset.inspectionHistory.map((ins: AssetInspectionRecord) => ({
      date: ins.date,
      type: "inspection" as const,
      title: ins.type,
      detail: ins.findings,
      badge: <InspResultBadge result={ins.result} />,
      ref: ins.reportRef,
    })),
    ...asset.maintenanceHistory.map((mnt: AssetMaintenanceRecord) => ({
      date: mnt.date,
      type: "maintenance" as const,
      title: mnt.description,
      detail: `Performed by: ${mnt.performedBy} · WO: ${mnt.workOrderId} · ${mnt.laborHours}hrs · SAR ${mnt.cost.toLocaleString()}`,
      badge: (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 capitalize">
          {mnt.type}
        </span>
      ),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (events.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-slate-100 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
          No history records found for this asset.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200" />
        <div className="flex flex-col gap-5">
          {events.map((evt, idx) => (
            <div key={idx} className="relative flex gap-4 pl-10">
              {/* dot */}
              <div
                className={cn(
                  "absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  evt.type === "inspection" ? "bg-blue-100" : "bg-emerald-100"
                )}
              >
                {evt.type === "inspection" ? (
                  <AlertCircle className="size-4 text-blue-500" />
                ) : (
                  <Wrench className="size-4 text-emerald-600" />
                )}
              </div>

              <div className="flex-1 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-medium">{evt.date}</span>
                    {evt.badge}
                  </div>
                  {evt.ref && (
                    <span className="text-xs text-slate-400 font-mono">{evt.ref}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-800 mt-1.5 leading-snug">
                  {evt.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{evt.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Location Tab ─────────────────────────────────────────────────────────────

function LocationTab({ asset }: { asset: Asset }) {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Current location */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Current Location</h3>
        <dl className="flex flex-col gap-3">
          <InfoRow label="Location" value={asset.location} />
          <InfoRow label="Rig" value={asset.rigName ?? "Not assigned to rig"} />
          <InfoRow label="Rig ID" value={asset.rigId ?? "—"} />
        </dl>
      </div>

      {/* Transfer history placeholder */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Transfer History</h3>
        <div className="rounded-md border border-slate-100 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
          No transfer history available.
        </div>
      </div>
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function AssetNotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-slate-500">Asset not found: <strong>{id}</strong></p>
      <Link href="/assets/register" className="text-blue-600 hover:underline text-sm">
        Back to Asset Register
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetDetailPage() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const asset = ASSETS.find((a) => a.id === id);
  const [activeTab, setActiveTab] = React.useState("information");

  if (!asset) return <AssetNotFound id={id} />;

  const criticality = getCriticality(asset);
  const critColors = CRITICALITY_COLORS[criticality];

  const tabs = [
    { key: "information", label: "Information" },
    {
      key: "certifications",
      label: "Certifications",
      badge: asset.certificates.length,
    },
    {
      key: "history",
      label: "History",
      badge: asset.inspectionHistory.length + asset.maintenanceHistory.length,
    },
    { key: "location", label: "Location" },
  ];

  return (
    <div className="flex flex-col">
      {/* Record Header */}
      <RecordHeader
        breadcrumbs={[
          { label: "Assets", href: "/assets" },
          { label: "Register", href: "/assets/register" },
          { label: asset.assetTag },
        ]}
        recordId={asset.assetTag}
        subtitle={asset.description}
        badges={[
          { label: formatStatus(asset.status), status: formatStatus(asset.status) },
        ]}
        actions={[
          {
            label: "Edit",
            icon: <Edit className="size-3.5" />,
            variant: "outline",
          },
          {
            label: "Transfer",
            icon: <ArrowRightLeft className="size-3.5" />,
            variant: "outline",
          },
          {
            label: "Log Service",
            icon: <Wrench className="size-3.5" />,
            variant: "default",
          },
        ]}
      />

      {/* Criticality badge row */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Criticality:</span>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ color: critColors.color, backgroundColor: critColors.bg }}
        >
          {CRITICALITY_LABEL[criticality]}
        </span>
      </div>

      {/* Tab navigation */}
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === "information" && <InformationTab asset={asset} />}
      {activeTab === "certifications" && <CertificationsTab asset={asset} />}
      {activeTab === "history" && <HistoryTab asset={asset} />}
      {activeTab === "location" && <LocationTab asset={asset} />}
    </div>
  );
}
