"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, XCircle, Eye, FileText, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ASSETS, Asset, AssetCertificate } from "@/lib/dummy-data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CertRow {
  asset: Asset;
  cert: AssetCertificate;
  diffDays: number;
}

interface SelectedDoc {
  certType: string;
  certNumber: string;
  issuingBody: string;
  assetTag: string;
  assetName: string;
  expiryDate: string;
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function buildCertRows(): { expiringSoon: CertRow[]; alreadyExpired: CertRow[] } {
  const now = new Date();
  const expiringSoon: CertRow[] = [];
  const alreadyExpired: CertRow[] = [];

  for (const asset of ASSETS) {
    // Check explicit certificate records
    for (const cert of asset.certificates) {
      const expiry = new Date(cert.expiryDate);
      const diffDays = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        alreadyExpired.push({ asset, cert, diffDays });
      } else if (diffDays <= 90) {
        expiringSoon.push({ asset, cert, diffDays });
      }
    }

    // Also handle certificationExpiryDate with no explicit cert record
    if (
      asset.certificationExpiryDate &&
      asset.certificates.length === 0
    ) {
      const expiry = new Date(asset.certificationExpiryDate);
      const diffDays = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const syntheticCert: AssetCertificate = {
        id: `${asset.id}-synthetic`,
        type: "Certification",
        issuedBy: "—",
        issuedDate: "—",
        expiryDate: asset.certificationExpiryDate,
        certificateNumber: "—",
        status: diffDays < 0 ? "expired" : diffDays <= 90 ? "expiring_soon" : "valid",
      };
      if (diffDays < 0) {
        alreadyExpired.push({ asset, cert: syntheticCert, diffDays });
      } else if (diffDays <= 90) {
        expiringSoon.push({ asset, cert: syntheticCert, diffDays });
      }
    }
  }

  // Sort: expiring soon by soonest first, expired by most recently expired first
  expiringSoon.sort((a, b) => a.diffDays - b.diffDays);
  alreadyExpired.sort((a, b) => a.diffDays - b.diffDays);

  return { expiringSoon, alreadyExpired };
}

// ─── Day badge ────────────────────────────────────────────────────────────────

function DaysBadge({ diffDays, type }: { diffDays: number; type: "expiring" | "expired" }) {
  if (type === "expiring") {
    const urgent = diffDays <= 30;
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold min-w-[64px]",
          urgent ? "text-red-700 bg-red-50" : "text-amber-700 bg-amber-50"
        )}
      >
        {diffDays}d left
      </span>
    );
  }
  const daysAgo = Math.abs(diffDays);
  const urgent = daysAgo > 60;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold min-w-[64px]",
        urgent ? "text-red-800 bg-red-100" : "text-red-600 bg-red-50"
      )}
    >
      {daysAgo}d ago
    </span>
  );
}

// ─── Section tables ───────────────────────────────────────────────────────────

function ExpiringSoonTable({
  rows,
  onView,
}: {
  rows: CertRow[];
  onView: (doc: SelectedDoc) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-slate-100 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
        No certificates expiring within the next 90 days.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-amber-50 border-b border-amber-200">
            <th className="text-left px-5 py-2.5 text-xs font-semibold text-amber-800 uppercase tracking-wide">
              Asset
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-amber-800 uppercase tracking-wide w-52">
              Certificate Type
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-amber-800 uppercase tracking-wide w-44">
              Issuing Body
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-amber-800 uppercase tracking-wide w-28">
              Expiry Date
            </th>
            <th className="text-center px-4 py-2.5 text-xs font-semibold text-amber-800 uppercase tracking-wide w-28">
              Days Remaining
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-amber-800 uppercase tracking-wide w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ asset, cert, diffDays }, idx) => (
            <tr
              key={`${asset.id}-${cert.id}`}
              className={cn(
                "border-b border-amber-100 last:border-0 cursor-pointer",
                diffDays <= 30 ? "bg-red-50/40 hover:bg-red-50/70" : "hover:bg-amber-50/50"
              )}
              onClick={() =>
                onView({
                  certType: cert.type,
                  certNumber: cert.certificateNumber,
                  issuingBody: cert.issuedBy,
                  assetTag: asset.assetTag,
                  assetName: asset.description,
                  expiryDate: cert.expiryDate,
                })
              }
            >
              <td className="px-5 py-3">
                <div>
                  <Link
                    href={`/assets/register/${asset.id}`}
                    className="text-blue-600 hover:underline font-mono text-xs font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {asset.assetTag}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                    {asset.description}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-slate-700 font-medium">{cert.type}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{cert.issuedBy}</td>
              <td className="px-4 py-3 text-xs font-medium text-amber-700">{cert.expiryDate}</td>
              <td className="px-4 py-3 text-center">
                <DaysBadge diffDays={diffDays} type="expiring" />
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView({
                      certType: cert.type,
                      certNumber: cert.certificateNumber,
                      issuingBody: cert.issuedBy,
                      assetTag: asset.assetTag,
                      assetName: asset.description,
                      expiryDate: cert.expiryDate,
                    });
                  }}
                >
                  <Eye className="size-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlreadyExpiredTable({
  rows,
  onView,
}: {
  rows: CertRow[];
  onView: (doc: SelectedDoc) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-slate-100 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
        No expired certificates found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-red-50 border-b border-red-200">
            <th className="text-left px-5 py-2.5 text-xs font-semibold text-red-800 uppercase tracking-wide">
              Asset
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-800 uppercase tracking-wide w-52">
              Certificate Type
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-800 uppercase tracking-wide w-44">
              Issuing Body
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-800 uppercase tracking-wide w-28">
              Expiry Date
            </th>
            <th className="text-center px-4 py-2.5 text-xs font-semibold text-red-800 uppercase tracking-wide w-28">
              Days Expired
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-red-800 uppercase tracking-wide w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ asset, cert, diffDays }) => (
            <tr
              key={`${asset.id}-${cert.id}`}
              className="border-b border-red-100 last:border-0 hover:bg-red-50/50 cursor-pointer"
              onClick={() =>
                onView({
                  certType: cert.type,
                  certNumber: cert.certificateNumber,
                  issuingBody: cert.issuedBy,
                  assetTag: asset.assetTag,
                  assetName: asset.description,
                  expiryDate: cert.expiryDate,
                })
              }
            >
              <td className="px-5 py-3">
                <div>
                  <Link
                    href={`/assets/register/${asset.id}`}
                    className="text-blue-600 hover:underline font-mono text-xs font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {asset.assetTag}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                    {asset.description}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-slate-700 font-medium">{cert.type}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{cert.issuedBy}</td>
              <td className="px-4 py-3 text-xs font-medium text-red-700">{cert.expiryDate}</td>
              <td className="px-4 py-3 text-center">
                <DaysBadge diffDays={diffDays} type="expired" />
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView({
                      certType: cert.type,
                      certNumber: cert.certificateNumber,
                      issuingBody: cert.issuedBy,
                      assetTag: asset.assetTag,
                      assetName: asset.description,
                      expiryDate: cert.expiryDate,
                    });
                  }}
                >
                  <Eye className="size-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CertificationsDashboardPage() {
  const { expiringSoon, alreadyExpired } = React.useMemo(() => buildCertRows(), []);
  const [selectedDoc, setSelectedDoc] = React.useState<SelectedDoc | null>(null);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Documentation</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Monitor asset documentation status and upcoming renewals
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Assets",
            value: ASSETS.length,
            color: "text-slate-800",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "Expired Docs",
            value: alreadyExpired.length,
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Expiring ≤30 days",
            value: expiringSoon.filter((r) => r.diffDays <= 30).length,
            color: "text-red-600",
            bg: "bg-red-50 border-red-100",
          },
          {
            label: "Expiring 31–90 days",
            value: expiringSoon.filter((r) => r.diffDays > 30).length,
            color: "text-amber-700",
            bg: "bg-amber-50 border-amber-200",
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

      {/* Expiring Soon Section */}
      <div className="rounded-lg border border-amber-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-200 bg-amber-50 flex items-center gap-2">
          <AlertCircle className="size-4 text-amber-600 shrink-0" />
          <h2 className="text-sm font-semibold text-amber-800">
            Expiring Soon
            <span className="ml-2 text-amber-600 font-normal text-xs">
              within 90 days · {expiringSoon.length} document{expiringSoon.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>
        <div className="p-5">
          <ExpiringSoonTable rows={expiringSoon} onView={setSelectedDoc} />
        </div>
      </div>

      {/* Already Expired Section */}
      <div className="rounded-lg border border-red-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-red-200 bg-red-50 flex items-center gap-2">
          <XCircle className="size-4 text-red-600 shrink-0" />
          <h2 className="text-sm font-semibold text-red-800">
            Already Expired
            <span className="ml-2 text-red-600 font-normal text-xs">
              {alreadyExpired.length} document{alreadyExpired.length !== 1 ? "s" : ""} require immediate action
            </span>
          </h2>
        </div>
        <div className="p-5">
          <AlreadyExpiredTable rows={alreadyExpired} onView={setSelectedDoc} />
        </div>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={selectedDoc !== null} onOpenChange={(open) => { if (!open) setSelectedDoc(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.certType}</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              {/* Document metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Certificate Number:</span>
                  <p className="font-medium">{selectedDoc.certNumber || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-500">Issuing Body:</span>
                  <p className="font-medium">{selectedDoc.issuingBody}</p>
                </div>
                <div>
                  <span className="text-slate-500">Asset:</span>
                  <p className="font-medium">{selectedDoc.assetTag} — {selectedDoc.assetName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Expiry Date:</span>
                  <p className="font-medium">{selectedDoc.expiryDate}</p>
                </div>
              </div>

              {/* Mock PDF viewer */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
                <FileText className="h-16 w-16 text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">Document Preview</p>
                <p className="text-slate-400 text-sm mt-1">
                  {selectedDoc.certType} — {selectedDoc.assetTag}
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  PDF document preview will be available in the production version
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
