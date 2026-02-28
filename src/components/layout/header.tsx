"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui-store";
import { useUserStore } from "@/lib/stores/user-store";
import type { UserRole } from "@/lib/types/index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleSwitcher } from "./role-switcher";

// ─── Breadcrumb builder ───────────────────────────────────────────────────────

const PATH_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  workspace: "Workspace",
  "rig-operations": "Rig Operations",
  assets: "Assets",
  admin: "Admin",
  materials: "Materials",
  maintenance: "Maintenance",
  clinic: "Clinic",
  hse: "HSE",
  quality: "Quality",
  moc: "MOC",
  nco: "NCO",
  capa: "CAPA",
  "ims-documents": "IMS Documents",
  audits: "Audits",
  inspections: "Inspections",
  register: "Register",
  certifications: "Documentation",
  logistics: "Logistics",
  requests: "Requests",
  "rig-move": "Rig Move",
  warehouse: "Warehouse",
  incoming: "Incoming",
  outgoing: "Outgoing",
  inventory: "Inventory",
  security: "Security",
  "gate-pass": "Gate Pass",
  "exit-pass": "Exit Pass",
};

interface BreadcrumbSegment {
  label: string;
  href: string;
}

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ label: "Dashboard", href: "/dashboard" }];

  const crumbs: BreadcrumbSegment[] = [];
  let accumulated = "";

  segments.forEach((seg) => {
    accumulated += `/${seg}`;
    crumbs.push({
      label: PATH_LABELS[seg] ?? seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: accumulated,
    });
  });

  return crumbs;
}

// ─── Role display helpers ─────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  system_admin: "System Admin",
  company_manager: "Company Manager",
  rig_manager: "Rig Manager",
  department_manager: "Dept. Manager",
  employee: "Employee",
};

// ─── Header Component ─────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname();
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen);
  const currentUser = useUserStore((s) => s.currentUser);

  const breadcrumbs = buildBreadcrumbs(pathname);
  const notificationCount = 3; // static for wireframe

  const roleLabel = currentUser
    ? ROLE_LABELS[currentUser.role] ?? currentUser.role
    : "Guest";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center border-b border-slate-200 bg-white px-4 gap-3">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-8 w-8 text-slate-500"
        onClick={() => setSidebarMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Connectivity indicator (visible on md+ screens) */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0 pl-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px] font-medium text-emerald-600 select-none">Synced</span>
      </div>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem className="whitespace-nowrap">
                    {isLast ? (
                      <BreadcrumbPage className="font-medium text-slate-800 text-sm">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.href}
                        className="text-slate-500 hover:text-slate-700 text-sm"
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
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Role switcher */}
        <RoleSwitcher />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-slate-500 hover:text-slate-700"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">MOC #MOC-2024-047 approved</span>
              <span className="text-xs text-slate-500">2 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">New NCR submitted for review</span>
              <span className="text-xs text-slate-500">1 hour ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">Gate Pass #GP-112 pending approval</span>
              <span className="text-xs text-slate-500">3 hours ago</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs text-blue-600">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar + info */}
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100 transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback
                    style={{ backgroundColor: currentUser.avatarColor }}
                    className="text-white text-xs font-semibold"
                  >
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {roleLabel}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-slate-800">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {currentUser.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
