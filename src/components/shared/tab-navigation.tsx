"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  key: string;
  label: string;
  /** Renders as "Label (current/total)" — e.g. "Tasks (2/5)" */
  count?: { current: number; total: number };
  /** Simple numeric badge displayed inline */
  badge?: number;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildLabel(tab: TabItem): string {
  if (tab.count !== undefined) {
    return `${tab.label} (${tab.count.current}/${tab.count.total})`;
  }
  return tab.label;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabNavigationProps) {
  return (
    <div
      className={cn(
        "bg-white border-b border-slate-200",
        className
      )}
      role="tablist"
      aria-label="Record sections"
    >
      {/* Horizontally scrollable on narrow viewports */}
      <div className="overflow-x-auto scrollbar-none px-6">
        <div className="flex items-end gap-0 whitespace-nowrap min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  // Base styles
                  "relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium",
                  "transition-colors duration-150 select-none outline-none",
                  "border-b-2",
                  // Focus ring
                  "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0 rounded-t-sm",
                  // Active vs inactive
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                )}
              >
                {buildLabel(tab)}

                {/* Simple numeric badge (e.g. unread count) */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full text-[10px] font-semibold leading-none h-4 min-w-4 px-1",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
