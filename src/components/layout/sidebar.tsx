"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Box,
  Users,
  Package,
  Settings,
  Heart,
  Shield,
  ShieldCheck,
  FileEdit,
  AlertTriangle,
  Target,
  FileText,
  ClipboardList,
  Search,
  Database,
  List,
  Award,
  Truck,
  Send,
  MapPin,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  PackageSearch,
  Lock,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDownSquare,
  CreditCard,
  Bell,
  Building2,
  Store,
  Wifi,
  InboxIcon,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui-store";
import { useUserStore } from "@/lib/stores/user-store";
import type { User } from "@/lib/stores/user-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Types ──────────────────────────────────────────────────────────────────

interface NavChild {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
  /** If true, this is a top-level link with no children */
  isLink?: boolean;
}

interface NavGroup {
  /** Optional section heading shown above the items */
  heading?: string;
  items: NavSection[];
}

// ─── Full Nav Catalogue ──────────────────────────────────────────────────────
// Each portal / section is defined here. getNavItemsForUser() picks from these.

const ITEM_DASHBOARD: NavSection = {
  label: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
  isLink: true,
};

const ITEM_WORKSPACE: NavSection = {
  label: "My Workspace",
  href: "/workspace",
  icon: Briefcase,
  isLink: true,
};

const ITEM_MY_REQUESTS: NavSection = {
  label: "My Requests",
  href: "/workspace",
  icon: InboxIcon,
  isLink: true,
};

const SECTION_RIG_OPERATIONS: NavSection = {
  label: "Rig Operations",
  icon: Wrench,
  children: [
    { label: "Assets", href: "/rig-operations/assets", icon: Box },
    { label: "Admin", href: "/rig-operations/admin", icon: Users },
    { label: "Materials", href: "/rig-operations/materials", icon: Package },
    { label: "Maintenance", href: "/rig-operations/maintenance", icon: Settings },
    { label: "Clinic", href: "/rig-operations/clinic", icon: Heart },
    { label: "HSE", href: "/rig-operations/hse", icon: Shield },
  ],
};

const SECTION_RIG_OPERATIONS_LIMITED: NavSection = {
  label: "Rig Operations",
  icon: Wrench,
  children: [
    { label: "Materials", href: "/rig-operations/materials", icon: Package },
    { label: "Maintenance", href: "/rig-operations/maintenance", icon: Settings },
    { label: "HSE", href: "/rig-operations/hse", icon: Shield },
  ],
};

const SECTION_HSE_ONLY: NavSection = {
  label: "Rig Operations",
  icon: Wrench,
  children: [
    { label: "HSE", href: "/rig-operations/hse", icon: Shield },
  ],
};

const SECTION_CLINIC_ONLY: NavSection = {
  label: "Rig Operations",
  icon: Wrench,
  children: [
    { label: "Clinic", href: "/rig-operations/clinic", icon: Heart },
  ],
};

const SECTION_QUALITY: NavSection = {
  label: "Quality Portal",
  icon: ShieldCheck,
  children: [
    { label: "Documents", href: "/quality/ims-documents", icon: FileText },
    { label: "MOC", href: "/quality/moc", icon: FileEdit },
    { label: "NCO / Non-Conformance", href: "/quality/nco", icon: AlertTriangle },
    { label: "CAPA", href: "/quality/capa", icon: Target },
    { label: "Inspections", href: "/quality/inspections", icon: Search },
    { label: "Audits", href: "/quality/audits", icon: ClipboardList },
    { label: "Vendor Quality", href: "/quality/vendor-quality", icon: Store },
  ],
};

const SECTION_ASSETS: NavSection = {
  label: "Assets",
  icon: Database,
  children: [
    { label: "Register", href: "/assets/register", icon: List },
    { label: "Documentation", href: "/assets/certifications", icon: Award },
  ],
};

const SECTION_LOGISTICS: NavSection = {
  label: "Logistics Portal",
  icon: Truck,
  children: [
    { label: "Requests", href: "/logistics/requests", icon: Send },
    { label: "Rig Move", href: "/logistics/rig-move", icon: MapPin },
  ],
};

const SECTION_WAREHOUSE: NavSection = {
  label: "Warehouse",
  icon: Warehouse,
  children: [
    { label: "Incoming", href: "/warehouse/incoming", icon: ArrowDownToLine },
    { label: "Outgoing", href: "/warehouse/outgoing", icon: ArrowUpFromLine },
    { label: "Inventory", href: "/warehouse/inventory", icon: PackageSearch },
  ],
};

const SECTION_SECURITY: NavSection = {
  label: "Security",
  icon: Lock,
  children: [
    { label: "Gate Pass", href: "/security/gate-pass", icon: CreditCard },
    { label: "Exit Pass", href: "/security/exit-pass", icon: LogOut },
  ],
};

const SECTION_ADMINISTRATION: NavSection = {
  label: "Administration",
  icon: SlidersHorizontal,
  children: [
    { label: "Users & Roles", href: "#", icon: Users },
    { label: "System Settings", href: "#", icon: Settings },
  ],
};

// ─── Role-based Nav Builder ──────────────────────────────────────────────────

function getNavItemsForUser(user: User | null): NavGroup[] {
  if (!user) {
    return [
      {
        items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
      },
    ];
  }

  const { role, department, jobTitle } = user;

  // System Admin — everything
  if (role === "system_admin") {
    return [
      {
        items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
      },
      {
        heading: "Operations",
        items: [SECTION_RIG_OPERATIONS],
      },
      {
        heading: "Dept Workspaces",
        items: [
          SECTION_QUALITY,
          SECTION_ASSETS,
          SECTION_LOGISTICS,
          SECTION_WAREHOUSE,
          SECTION_SECURITY,
        ],
      },
      {
        heading: "System",
        items: [SECTION_ADMINISTRATION],
      },
    ];
  }

  // Operations Director (company_manager) — all portals
  if (role === "company_manager") {
    return [
      {
        items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
      },
      {
        heading: "Operations",
        items: [SECTION_RIG_OPERATIONS],
      },
      {
        heading: "Dept Workspaces",
        items: [
          SECTION_QUALITY,
          SECTION_ASSETS,
          SECTION_LOGISTICS,
          SECTION_WAREHOUSE,
          SECTION_SECURITY,
        ],
      },
    ];
  }

  // Rig Manager
  if (role === "rig_manager") {
    return [
      {
        items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
      },
      {
        heading: "Rig Operations",
        items: [SECTION_RIG_OPERATIONS, SECTION_ASSETS],
      },
    ];
  }

  // Department Managers
  if (role === "department_manager") {
    if (department === "quality") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Dept Workspaces",
          items: [SECTION_QUALITY],
        },
      ];
    }

    if (department === "logistics") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Dept Workspaces",
          items: [SECTION_LOGISTICS],
        },
      ];
    }

    if (department === "asset_management") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Dept Workspaces",
          items: [SECTION_ASSETS],
        },
      ];
    }

    if (department === "warehouse") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Dept Workspaces",
          items: [SECTION_WAREHOUSE],
        },
      ];
    }

    if (department === "security") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Dept Workspaces",
          items: [SECTION_SECURITY],
        },
      ];
    }

    // Fallback for other department managers
    return [
      {
        items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
      },
    ];
  }

  // Employees
  if (role === "employee") {
    // HSE Officer
    if (jobTitle === "HSE Officer") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Rig Operations",
          items: [SECTION_HSE_ONLY],
        },
      ];
    }

    // Rig Medic
    if (jobTitle === "Rig Medic") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Rig Operations",
          items: [SECTION_CLINIC_ONLY],
        },
      ];
    }

    // Rig Administrator — full rig operations access (manages admin, rooms, POB)
    if (jobTitle === "Rig Administrator") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Rig Operations",
          items: [SECTION_RIG_OPERATIONS],
        },
      ];
    }

    // Quality department employee — sees quality portal
    if (department === "quality") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Dept Workspaces",
          items: [SECTION_QUALITY],
        },
      ];
    }

    // Rig operations department employee — limited access
    if (department === "rig_operations") {
      return [
        {
          items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
        },
        {
          heading: "Rig Operations",
          items: [SECTION_RIG_OPERATIONS_LIMITED],
        },
      ];
    }

    // Other employees
    return [
      {
        items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
      },
    ];
  }

  // Default fallback
  return [
    {
      items: [ITEM_DASHBOARD, ITEM_WORKSPACE],
    },
  ];
}

// ─── Rig selector data ───────────────────────────────────────────────────────

const RIGS = [
  { id: "rig-alpha", label: "Rig Alpha" },
  { id: "rig-bravo", label: "Rig Bravo" },
  { id: "rig-charlie", label: "Rig Charlie" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

interface NavSectionRowProps {
  section: NavSection;
  collapsed: boolean;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function NavSectionRow({
  section,
  collapsed,
  isActive,
  isOpen,
  onToggle,
}: NavSectionRowProps) {
  const Icon = section.icon;
  const hasChildren = Boolean(section.children?.length);

  const rowContent = (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-slate-300 hover:bg-slate-700/60 hover:text-white",
        isActive && !hasChildren && "text-blue-300",
        collapsed && "justify-center px-2"
      )}
    >
      {/* Active left border indicator */}
      {isActive && !hasChildren && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-blue-500" />
      )}
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{section.label}</span>
          {hasChildren && (
            <span className="ml-auto">
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </span>
          )}
        </>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{rowContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {section.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return rowContent;
}

interface NavChildRowProps {
  child: NavChild;
  collapsed: boolean;
  isActive: boolean;
}

function NavChildRow({ child, collapsed, isActive }: NavChildRowProps) {
  const Icon = child.icon;

  const rowContent = (
    <Link
      href={child.href}
      className={cn(
        "relative flex items-center gap-3 rounded-md py-1.5 text-sm transition-colors",
        "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200",
        isActive && "text-blue-300 font-medium bg-blue-600/10",
        collapsed ? "justify-center px-2" : "pl-9 pr-3"
      )}
    >
      {/* Active left border indicator for child */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-blue-500" />
      )}
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {!collapsed && <span>{child.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{rowContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {child.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return rowContent;
}

interface NavLinkRowProps {
  section: NavSection;
  collapsed: boolean;
  isActive: boolean;
}

function NavLinkRow({ section, collapsed, isActive }: NavLinkRowProps) {
  const Icon = section.icon;

  const rowContent = (
    <Link
      href={section.href!}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-slate-300 hover:bg-slate-700/60 hover:text-white",
        isActive && "text-blue-300",
        collapsed && "justify-center px-2"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-blue-500" />
      )}
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{section.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{rowContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {section.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return rowContent;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isSectionActive(section: NavSection, pathname: string): boolean {
  if (section.href && section.href !== "#") {
    return pathname === section.href || pathname.startsWith(section.href + "/");
  }
  if (section.children) {
    return section.children.some(
      (c) => c.href !== "#" && (pathname === c.href || pathname.startsWith(c.href + "/"))
    );
  }
  return false;
}

function collectAllSectionLabels(groups: NavGroup[]): string[] {
  const labels: string[] = [];
  groups.forEach((g) => g.items.forEach((s) => labels.push(s.label)));
  return labels;
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const selectedRigId = useUIStore((s) => s.selectedRigId);
  const setSelectedRigId = useUIStore((s) => s.setSelectedRigId);
  const pathname = usePathname();
  const currentUser = useUserStore((s) => s.currentUser);

  const navGroups = getNavItemsForUser(currentUser);

  // Collect all section labels for stable open-sections tracking
  const allLabels = collectAllSectionLabels(navGroups);

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      group.items.forEach((section) => {
        if (section.children) {
          const childActive = section.children.some(
            (c) => c.href !== "#" && pathname.startsWith(c.href)
          );
          if (childActive) initial[section.label] = true;
        }
      });
    });
    return initial;
  });

  // Auto-open section when pathname changes and a child matches
  React.useEffect(() => {
    const updates: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      group.items.forEach((section) => {
        if (section.children) {
          const childActive = section.children.some(
            (c) => c.href !== "#" && pathname.startsWith(c.href)
          );
          if (childActive && !openSections[section.label]) {
            updates[section.label] = true;
          }
        }
      });
    });
    if (Object.keys(updates).length > 0) {
      setOpenSections((prev) => ({ ...prev, ...updates }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function toggleSection(label: string) {
    if (collapsed) {
      toggleSidebar();
      setOpenSections((prev) => ({ ...prev, [label]: true }));
      return;
    }
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-900 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* ── Brand Header ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-slate-700/60 px-3 shrink-0 gap-2",
          collapsed && "justify-center px-2"
        )}
      >
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
                <Bell className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Big Blue Operations Platform
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-white leading-tight">
                Big Blue
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                Operations Platform
              </span>
            </div>
            {/* Connectivity indicator */}
            <div className="ml-auto flex items-center gap-1 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[9px] text-emerald-400 font-medium">Synced</span>
            </div>
          </>
        )}
      </div>

      {/* ── Rig Selector ─────────────────────────────────────────────────────── */}
      {!collapsed ? (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <Select value={selectedRigId} onValueChange={setSelectedRigId}>
            <SelectTrigger
              className={cn(
                "h-8 border-slate-600 bg-slate-800 text-slate-200 text-xs",
                "hover:bg-slate-700 focus:ring-0 focus:ring-offset-0"
              )}
            >
              <SelectValue placeholder="Select rig" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {RIGS.map((rig) => (
                <SelectItem
                  key={rig.id}
                  value={rig.id}
                  className="text-slate-200 text-xs focus:bg-slate-700 focus:text-white"
                >
                  {rig.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="flex justify-center px-2 pt-3 pb-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => toggleSidebar()}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label="Select Rig"
              >
                <ChevronDownSquare className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Select Rig
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-3">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {/* Section heading */}
            {group.heading && !collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 select-none">
                {group.heading}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map((section) => {
                const active = isSectionActive(section, pathname);
                const open = openSections[section.label] ?? false;
                const hasChildren = Boolean(section.children?.length);

                if (section.isLink || (!hasChildren && section.href)) {
                  return (
                    <NavLinkRow
                      key={section.label}
                      section={section}
                      collapsed={collapsed}
                      isActive={active}
                    />
                  );
                }

                return (
                  <div key={section.label}>
                    <NavSectionRow
                      section={section}
                      collapsed={collapsed}
                      isActive={active}
                      isOpen={open}
                      onToggle={() => toggleSection(section.label)}
                    />
                    {hasChildren && !collapsed && open && (
                      <div className="mt-0.5 space-y-0.5">
                        {section.children!.map((child) => {
                          const childActive =
                            child.href !== "#" &&
                            (pathname === child.href ||
                              pathname.startsWith(child.href + "/"));
                          return (
                            <NavChildRow
                              key={child.href + child.label}
                              child={child}
                              collapsed={collapsed}
                              isActive={childActive}
                            />
                          );
                        })}
                      </div>
                    )}
                    {/* Collapsed: show children as individual tooltip icons */}
                    {hasChildren && collapsed && (
                      <div className="space-y-0.5">
                        {section.children!.map((child) => {
                          const childActive =
                            child.href !== "#" &&
                            (pathname === child.href ||
                              pathname.startsWith(child.href + "/"));
                          return (
                            <NavChildRow
                              key={child.href + child.label}
                              child={child}
                              collapsed={collapsed}
                              isActive={childActive}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Collapse Toggle ───────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-slate-700/60 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleSidebar}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-400",
                "hover:bg-slate-700/60 hover:text-white transition-colors",
                collapsed && "justify-center px-2"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronsLeft className="h-4 w-4" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={8}>
              Expand sidebar
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}
