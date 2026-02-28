"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StatusBadge } from "@/components/shared/status-badge";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecordHeaderAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline";
  onClick?: () => void;
  disabled?: boolean;
}

export interface RecordHeaderBadge {
  label: string;
  status: string;
}

export interface RecordHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  recordId: string;
  subtitle?: string;
  badges?: RecordHeaderBadge[];
  actions?: RecordHeaderAction[];
  onBack?: () => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RecordHeader({
  breadcrumbs,
  recordId,
  subtitle,
  badges,
  actions,
  onBack,
  className,
}: RecordHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  return (
    <div className={cn("bg-white border-b border-slate-200", className)}>
      <div className="px-6 pt-4 pb-0">
        {/* Top row: breadcrumbs + actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: breadcrumb trail */}
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-slate-600 text-xs font-medium">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href ?? "#"}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Right: action buttons */}
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant ?? "outline"}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="h-8 text-xs gap-1.5"
                >
                  {action.icon && (
                    <span className="[&_svg]:size-3.5">{action.icon}</span>
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Main record identity row */}
        <div className="flex items-start gap-3 mt-3 pb-4">
          {/* Back button */}
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="mt-0.5 shrink-0 flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Record ID + badges + subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                {recordId}
              </h1>
              {badges && badges.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {badges.map((badge, idx) => (
                    <StatusBadge key={idx} status={badge.status} size="md" />
                  ))}
                </div>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 leading-snug truncate max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
