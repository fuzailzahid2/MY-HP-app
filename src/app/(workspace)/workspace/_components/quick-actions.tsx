"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Wrench,
  ArrowLeftRight,
  Truck,
  AlertTriangle,
  ClipboardCheck,
  Users,
  FileText,
  FilePlus,
  BarChart3,
  ShieldCheck,
  Calendar,
  MessageSquare,
  ClipboardList,
  Ship,
  Box,
  Car,
  SendHorizonal,
  Settings,
  FileSearch,
  Key,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/user-store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  href: string;
  borderColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

// ─── All Quick Actions Catalogue ─────────────────────────────────────────────

const ALL_ACTIONS: Record<string, QuickAction> = {
  request_material: {
    id: "request_material",
    label: "Request Material",
    href: "/workspace/requests/new/material",
    borderColor: "#3B82F6",
    iconBg: "#EFF6FF",
    icon: <Package className="h-5 w-5 text-blue-600" />,
  },
  request_equipment: {
    id: "request_equipment",
    label: "Request Equipment",
    href: "/workspace/requests/new/equipment",
    borderColor: "#F97316",
    iconBg: "#FFF7ED",
    icon: <Wrench className="h-5 w-5 text-orange-500" />,
  },
  request_reamer: {
    id: "request_reamer",
    label: "Request Reamer",
    href: "/workspace/requests/new/equipment",
    borderColor: "#8B5CF6",
    iconBg: "#F5F3FF",
    icon: <Settings className="h-5 w-5 text-violet-600" />,
  },
  temporary_rental: {
    id: "temporary_rental",
    label: "Temporary Rental",
    href: "/workspace/requests/new/rental",
    borderColor: "#14B8A6",
    iconBg: "#F0FDFA",
    icon: <ArrowLeftRight className="h-5 w-5 text-teal-600" />,
  },
  request_rig_move: {
    id: "request_rig_move",
    label: "Request Rig Move",
    href: "/workspace/requests/new/rig_move",
    borderColor: "#EC4899",
    iconBg: "#FDF2F8",
    icon: <Truck className="h-5 w-5 text-pink-500" />,
  },
  report_nco: {
    id: "report_nco",
    label: "Report NCO",
    href: "/workspace/requests/new/nco",
    borderColor: "#F59E0B",
    iconBg: "#FFFBEB",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  request_inspection: {
    id: "request_inspection",
    label: "Request Inspection",
    href: "/workspace/requests/new/inspection",
    borderColor: "#22C55E",
    iconBg: "#F0FDF4",
    icon: <ClipboardCheck className="h-5 w-5 text-green-600" />,
  },
  request_manpower: {
    id: "request_manpower",
    label: "Request Manpower",
    href: "/workspace/requests/new/manpower",
    borderColor: "#64748B",
    iconBg: "#F8FAFC",
    icon: <Users className="h-5 w-5 text-slate-500" />,
  },
  create_moc: {
    id: "create_moc",
    label: "Create MOC",
    href: "#",
    borderColor: "#7C3AED",
    iconBg: "#F5F3FF",
    icon: <FilePlus className="h-5 w-5 text-violet-600" />,
  },
  document_review: {
    id: "document_review",
    label: "Document Review",
    href: "#",
    borderColor: "#2563EB",
    iconBg: "#EFF6FF",
    icon: <FileSearch className="h-5 w-5 text-blue-600" />,
  },
  request_capa: {
    id: "request_capa",
    label: "Request CAPA",
    href: "#",
    borderColor: "#EA580C",
    iconBg: "#FFF7ED",
    icon: <ClipboardList className="h-5 w-5 text-orange-600" />,
  },
  audit_schedule: {
    id: "audit_schedule",
    label: "Audit Schedule",
    href: "#",
    borderColor: "#16A34A",
    iconBg: "#F0FDF4",
    icon: <Calendar className="h-5 w-5 text-green-600" />,
  },
  quality_support: {
    id: "quality_support",
    label: "Quality Support",
    href: "#",
    borderColor: "#0891B2",
    iconBg: "#ECFEFF",
    icon: <ShieldCheck className="h-5 w-5 text-cyan-600" />,
  },
  submit_report: {
    id: "submit_report",
    label: "Submit Report",
    href: "#",
    borderColor: "#059669",
    iconBg: "#ECFDF5",
    icon: <BarChart3 className="h-5 w-5 text-emerald-600" />,
  },
  logistics_request: {
    id: "logistics_request",
    label: "Logistics Request",
    href: "#",
    borderColor: "#3B82F6",
    iconBg: "#EFF6FF",
    icon: <Ship className="h-5 w-5 text-blue-600" />,
  },
  rig_move_request: {
    id: "rig_move_request",
    label: "Rig Move Request",
    href: "/workspace/requests/new/rig_move",
    borderColor: "#EC4899",
    iconBg: "#FDF2F8",
    icon: <Truck className="h-5 w-5 text-pink-500" />,
  },
  transfer_request: {
    id: "transfer_request",
    label: "Transfer Request",
    href: "#",
    borderColor: "#8B5CF6",
    iconBg: "#F5F3FF",
    icon: <ArrowLeftRight className="h-5 w-5 text-violet-600" />,
  },
  backload_request: {
    id: "backload_request",
    label: "Backload Request",
    href: "#",
    borderColor: "#F97316",
    iconBg: "#FFF7ED",
    icon: <Box className="h-5 w-5 text-orange-500" />,
  },
  material_order: {
    id: "material_order",
    label: "Material Order",
    href: "#",
    borderColor: "#14B8A6",
    iconBg: "#F0FDFA",
    icon: <Package className="h-5 w-5 text-teal-600" />,
  },
  equipment_rental: {
    id: "equipment_rental",
    label: "Equipment Rental",
    href: "#",
    borderColor: "#22C55E",
    iconBg: "#F0FDF4",
    icon: <Wrench className="h-5 w-5 text-green-600" />,
  },
  vehicle_request: {
    id: "vehicle_request",
    label: "Vehicle Request",
    href: "#",
    borderColor: "#F59E0B",
    iconBg: "#FFFBEB",
    icon: <Car className="h-5 w-5 text-amber-500" />,
  },
  shipping_request: {
    id: "shipping_request",
    label: "Shipping Request",
    href: "#",
    borderColor: "#64748B",
    iconBg: "#F8FAFC",
    icon: <SendHorizonal className="h-5 w-5 text-slate-500" />,
  },
  gate_pass: {
    id: "gate_pass",
    label: "Gate Pass",
    href: "#",
    borderColor: "#D97706",
    iconBg: "#FFFBEB",
    icon: <Key className="h-5 w-5 text-amber-600" />,
  },
  feedback: {
    id: "feedback",
    label: "Submit Feedback",
    href: "#",
    borderColor: "#64748B",
    iconBg: "#F8FAFC",
    icon: <MessageSquare className="h-5 w-5 text-slate-500" />,
  },
  document_submit: {
    id: "document_submit",
    label: "Submit Document",
    href: "#",
    borderColor: "#2563EB",
    iconBg: "#EFF6FF",
    icon: <FileText className="h-5 w-5 text-blue-600" />,
  },
};

// ─── Department → Action IDs Map ─────────────────────────────────────────────

type Department = string;
type UserRole = string;

function getActionsForUser(role: UserRole, department: Department): QuickAction[] {
  if (role === "company_manager" || role === "system_admin") {
    return [
      ALL_ACTIONS.request_material,
      ALL_ACTIONS.request_equipment,
      ALL_ACTIONS.create_moc,
      ALL_ACTIONS.report_nco,
      ALL_ACTIONS.request_inspection,
      ALL_ACTIONS.rig_move_request,
      ALL_ACTIONS.gate_pass,
      ALL_ACTIONS.request_manpower,
    ];
  }

  switch (department) {
    case "rig_operations":
      return [
        ALL_ACTIONS.request_material,
        ALL_ACTIONS.request_equipment,
        ALL_ACTIONS.request_reamer,
        ALL_ACTIONS.temporary_rental,
        ALL_ACTIONS.request_rig_move,
        ALL_ACTIONS.report_nco,
        ALL_ACTIONS.request_inspection,
        ALL_ACTIONS.request_manpower,
      ];
    case "quality":
      return [
        ALL_ACTIONS.create_moc,
        ALL_ACTIONS.report_nco,
        ALL_ACTIONS.request_inspection,
        ALL_ACTIONS.document_review,
        ALL_ACTIONS.request_capa,
        ALL_ACTIONS.audit_schedule,
        ALL_ACTIONS.quality_support,
        ALL_ACTIONS.submit_report,
      ];
    case "logistics":
      return [
        ALL_ACTIONS.logistics_request,
        ALL_ACTIONS.rig_move_request,
        ALL_ACTIONS.transfer_request,
        ALL_ACTIONS.backload_request,
        ALL_ACTIONS.material_order,
        ALL_ACTIONS.equipment_rental,
        ALL_ACTIONS.vehicle_request,
        ALL_ACTIONS.shipping_request,
      ];
    default:
      return [
        ALL_ACTIONS.request_material,
        ALL_ACTIONS.request_equipment,
        ALL_ACTIONS.report_nco,
        ALL_ACTIONS.request_inspection,
        ALL_ACTIONS.document_submit,
        ALL_ACTIONS.feedback,
        ALL_ACTIONS.gate_pass,
        ALL_ACTIONS.request_manpower,
      ];
  }
}

// ─── Customization Dialog ─────────────────────────────────────────────────────

interface CustomizeDialogProps {
  open: boolean;
  onClose: () => void;
  actions: QuickAction[];
  hiddenIds: Set<string>;
  onToggle: (id: string) => void;
}

function CustomizeDialog({
  open,
  onClose,
  actions,
  hiddenIds,
  onToggle,
}: CustomizeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Quick Actions</DialogTitle>
          <DialogDescription>
            Toggle visibility for quick actions. Changes are temporary and reset
            on page reload.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: action.iconBg }}
                >
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {action.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onToggle(action.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  !hiddenIds.has(action.id)
                    ? "bg-blue-600"
                    : "bg-slate-200"
                }`}
                role="switch"
                aria-checked={!hiddenIds.has(action.id)}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    !hiddenIds.has(action.id)
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Quick Actions Component ──────────────────────────────────────────────────

export function QuickActions() {
  const currentUser = useUserStore((s) => s.currentUser);
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const [hiddenIds, setHiddenIds] = React.useState<Set<string>>(new Set());

  const actions = React.useMemo(() => {
    if (!currentUser) return [];
    return getActionsForUser(currentUser.role, currentUser.department);
  }, [currentUser]);

  const visibleActions = actions.filter((a) => !hiddenIds.has(a.id));

  function toggleAction(id: string) {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Quick Actions
        </h2>
        <button
          type="button"
          onClick={() => setCustomizeOpen(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Customize quick actions"
        >
          <Settings className="h-3.5 w-3.5" />
          Customize
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {visibleActions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="group flex items-center gap-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 p-2.5 transition-all"
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: action.borderColor,
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: action.iconBg }}
            >
              {action.icon}
            </div>
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      <CustomizeDialog
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        actions={actions}
        hiddenIds={hiddenIds}
        onToggle={toggleAction}
      />
    </div>
  );
}
