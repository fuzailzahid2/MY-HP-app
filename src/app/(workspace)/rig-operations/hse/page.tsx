"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { TRAINING_RECORDS, HSE_EVENTS } from "@/lib/dummy-data/hse";
import type { TrainingRecord, HseEvent } from "@/lib/types/index";
import {
  AlertTriangle,
  Shield,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Local Types ──────────────────────────────────────────────────────────────

type StopCardCategory =
  | "unsafe_act"
  | "unsafe_condition"
  | "positive_observation"
  | "environmental";

interface StopCard {
  id: string;
  category: StopCardCategory;
  description: string;
  location: string;
  reportedBy: string;
  reportedByInitials: string;
  reportedByColor: string;
  date: string;
  status: "open" | "closed" | "in_progress";
  correctiveAction: string | null;
  closedDate: string | null;
}

type NearMissSeverity =
  | "high_potential"
  | "medium_potential"
  | "low_potential";

interface NearMiss {
  id: string;
  description: string;
  severity: NearMissSeverity;
  location: string;
  reportedBy: string;
  reportedByInitials: string;
  reportedByColor: string;
  date: string;
  correctiveAction: string;
  status: "open" | "closed" | "in_progress";
  capaRef: string | null;
}

type AuditFindingCategory =
  | "safety"
  | "environmental"
  | "process"
  | "equipment"
  | "housekeeping"
  | "documentation";
type AuditItemStatus = "open" | "closed" | "overdue" | "in_progress";

interface AuditItem {
  id: string;
  auditRef: string;
  finding: string;
  category: AuditFindingCategory;
  status: AuditItemStatus;
  dueDate: string;
  assignedTo: string;
  assignedInitials: string;
  assignedColor: string;
  priority: "critical" | "major" | "minor" | "observation";
  closedDate: string | null;
  notes: string;
}

// ─── Inline Data ──────────────────────────────────────────────────────────────

const STOP_CARDS: StopCard[] = [
  {
    id: "SC-2026-001",
    category: "unsafe_condition",
    description:
      "Loose grating panel on shaker deck walkway — potential trip hazard. Panel unseated from frame after vibration.",
    location: "Shaker Deck — Area B",
    reportedBy: "Ali Hassan",
    reportedByInitials: "AH",
    reportedByColor: "#2E7D32",
    date: "2026-02-26",
    status: "in_progress",
    correctiveAction:
      "Work order raised — grating panel to be re-secured with safety clips. Temporary barrier installed pending repair.",
    closedDate: null,
  },
  {
    id: "SC-2026-002",
    category: "unsafe_act",
    description:
      "Personnel observed working at height on derrick without secondary fall arrest (lanyard not attached to anchor point).",
    location: "Derrick — Level 4",
    reportedBy: "Omar Hassan",
    reportedByInitials: "OH",
    reportedByColor: "#00897B",
    date: "2026-02-25",
    status: "closed",
    correctiveAction:
      "Personnel stopped, retrained on fall protection procedures. Toolbox talk issued to all derrick crew.",
    closedDate: "2026-02-25",
  },
  {
    id: "SC-2026-003",
    category: "positive_observation",
    description:
      "Excellent housekeeping observed on drill floor — all hand tools secured, no trip hazards, clear escape routes.",
    location: "Drill Floor",
    reportedBy: "Ali Hassan",
    reportedByInitials: "AH",
    reportedByColor: "#2E7D32",
    date: "2026-02-24",
    status: "closed",
    correctiveAction:
      "Recognised drill floor crew. Best practice shared in morning safety meeting.",
    closedDate: "2026-02-24",
  },
  {
    id: "SC-2026-004",
    category: "unsafe_condition",
    description:
      "Oil spill (approx 5L hydraulic oil) on generator deck — no drip tray in place under hydraulic line connection point.",
    location: "Power House — Generator Deck",
    reportedBy: "Khalid Mahmoud",
    reportedByInitials: "KM",
    reportedByColor: "#0277BD",
    date: "2026-02-23",
    status: "closed",
    correctiveAction:
      "Spill contained and cleaned. Drip tray installed. Hydraulic line connection inspected and tightened.",
    closedDate: "2026-02-23",
  },
  {
    id: "SC-2026-005",
    category: "unsafe_act",
    description:
      "Chemical transfer from drum performed without chemical splash goggles — only safety glasses worn.",
    location: "Chemical Store",
    reportedBy: "Ali Hassan",
    reportedByInitials: "AH",
    reportedByColor: "#2E7D32",
    date: "2026-02-22",
    status: "closed",
    correctiveAction:
      "Task stopped. Chemical splash goggles issued. SDS reviewed with personnel. Chemical handling procedure posted at store entrance.",
    closedDate: "2026-02-22",
  },
  {
    id: "SC-2026-006",
    category: "unsafe_condition",
    description:
      "Fire extinguisher bracket empty — CO2 extinguisher missing from designated location near pump room entrance.",
    location: "Pump Room Entrance",
    reportedBy: "Emma Richards",
    reportedByInitials: "ER",
    reportedByColor: "#E91E63",
    date: "2026-02-20",
    status: "closed",
    correctiveAction:
      "Extinguisher located (in maintenance workshop — removed for inspection). Replaced immediately. Monthly inspection schedule reviewed.",
    closedDate: "2026-02-21",
  },
  {
    id: "SC-2026-007",
    category: "unsafe_act",
    description:
      "Bypass of gas detector alarm — detector alarm acknowledged and muted without investigation of source.",
    location: "Mud Pit Area",
    reportedBy: "Ali Hassan",
    reportedByInitials: "AH",
    reportedByColor: "#2E7D32",
    date: "2026-02-18",
    status: "closed",
    correctiveAction:
      "Personnel counselled. Alarm response procedure refresher issued. H2S alarm response added to next drill.",
    closedDate: "2026-02-19",
  },
  {
    id: "SC-2026-008",
    category: "environmental",
    description:
      "Barite dust dispersal observed during bag-breaking operations — no dust suppression measures in place.",
    location: "Chemical Mixing Area",
    reportedBy: "Ali Hassan",
    reportedByInitials: "AH",
    reportedByColor: "#2E7D32",
    date: "2026-02-15",
    status: "closed",
    correctiveAction:
      "Water misting system activated during chemical handling. Respiratory protection requirements reinforced.",
    closedDate: "2026-02-16",
  },
  {
    id: "SC-2026-009",
    category: "unsafe_condition",
    description:
      "Emergency escape route partially blocked by stored pipe tong equipment — egress compromised.",
    location: "Drill Floor — East Side",
    reportedBy: "Jack Anderson",
    reportedByInitials: "JA",
    reportedByColor: "#546E7A",
    date: "2026-02-13",
    status: "closed",
    correctiveAction:
      "Equipment relocated to designated storage area. Escape route markings repainted. Weekly walkthrough added.",
    closedDate: "2026-02-13",
  },
  {
    id: "SC-2026-010",
    category: "unsafe_act",
    description:
      "Personnel using mobile phone on active drill floor during pipe handling operations — distraction hazard.",
    location: "Drill Floor",
    reportedBy: "Omar Hassan",
    reportedByInitials: "OH",
    reportedByColor: "#00897B",
    date: "2026-02-10",
    status: "open",
    correctiveAction: null,
    closedDate: null,
  },
];

const NEAR_MISSES: NearMiss[] = [
  {
    id: "NM-2026-001",
    description:
      "Dropped object — 2kg wrench fell from derrick work basket (Level 3) to drill floor. No personnel below at time of drop. Landed within exclusion zone.",
    severity: "high_potential",
    location: "Derrick — Level 3 / Drill Floor",
    reportedBy: "Mohammed Al-Dosari",
    reportedByInitials: "MD",
    reportedByColor: "#BF360C",
    date: "2026-02-24",
    correctiveAction:
      "Dropped object inspection of all derrick work areas initiated. Tool tethering mandatory for all height work. Tool bags inspected.",
    status: "in_progress",
    capaRef: "CAPA-RIG-2026-001",
  },
  {
    id: "NM-2026-002",
    description:
      "Near struck-by incident — crane load swung unexpectedly during offloading due to sudden wind gust. Load came within 1m of floorhand.",
    severity: "high_potential",
    location: "Pipe Deck — Crane Lay-Down Area",
    reportedBy: "Omar Hassan",
    reportedByInitials: "OH",
    reportedByColor: "#00897B",
    date: "2026-02-21",
    correctiveAction:
      "Lifting operation suspended. Crane lift plan reviewed. Wind speed limits enforced. Exclusion zone perimeter expanded.",
    status: "in_progress",
    capaRef: "CAPA-RIG-2026-002",
  },
  {
    id: "NM-2026-003",
    description:
      "Well control near miss — unexpected pressure surge (350 PSI above planned) during tripping out. Emergency response activated. Well secured without incident.",
    severity: "high_potential",
    location: "Wellhead / BOP Area",
    reportedBy: "Mohammed Al-Dosari",
    reportedByInitials: "MD",
    reportedByColor: "#BF360C",
    date: "2026-02-17",
    correctiveAction:
      "Wellbore pressure model re-evaluated. Trip margin increased. Well control drill conducted. RCA completed.",
    status: "closed",
    capaRef: "CAPA-RIG-2026-003",
  },
  {
    id: "NM-2026-004",
    description:
      "Fire alarm activation in generator room — investigation revealed minor oil smoke from overheating. No fire, but fire team responded.",
    severity: "medium_potential",
    location: "Power House — Generator Room",
    reportedBy: "Khalid Mahmoud",
    reportedByInitials: "KM",
    reportedByColor: "#0277BD",
    date: "2026-02-19",
    correctiveAction:
      "Generator inspected. Overheating cause identified as blocked cooling air inlet. Cleaned and inspected. Alarm system verified functional.",
    status: "closed",
    capaRef: null,
  },
  {
    id: "NM-2026-005",
    description:
      "Chemical line over-pressure — mud pump pressure unexpectedly high during connection. Relief valve activated. No injury but potential for line failure.",
    severity: "medium_potential",
    location: "Pump Room — High Pressure Manifold",
    reportedBy: "Ricardo Santos",
    reportedByInitials: "RS",
    reportedByColor: "#00838F",
    date: "2026-02-16",
    correctiveAction:
      "Line pressure checked, relief valve tested. Pressure gauge calibration verified. Pre-job planning updated.",
    status: "closed",
    capaRef: null,
  },
  {
    id: "NM-2026-006",
    description:
      "Slip on wet deck — personnel slipped on water-wet pipe rack grating during rain shower. Caught handrail, no injury.",
    severity: "low_potential",
    location: "Pipe Rack Deck",
    reportedBy: "Ali Hassan",
    reportedByInitials: "AH",
    reportedByColor: "#2E7D32",
    date: "2026-02-12",
    correctiveAction:
      "Anti-slip coating applied to pipe rack grating. Warning signs posted during wet weather.",
    status: "closed",
    capaRef: null,
  },
  {
    id: "NM-2026-007",
    description:
      "Fork-lift near miss — forklift operator and pedestrian in blind spot of vehicle at base of access ramp.",
    severity: "medium_potential",
    location: "Rig Base — Vehicle Access Ramp",
    reportedBy: "Omar Hassan",
    reportedByInitials: "OH",
    reportedByColor: "#00897B",
    date: "2026-02-08",
    correctiveAction:
      "Traffic management plan revised. Pedestrian walkway painted. Horn mandatory at blind corners. Spotter required.",
    status: "closed",
    capaRef: null,
  },
  {
    id: "NM-2026-008",
    description:
      "Electrical arc — while replacing faulty breaker, inadvertent energisation of panel. Technician wearing correct PPE — no injury.",
    severity: "high_potential",
    location: "MCC Room — Electrical Panel A",
    reportedBy: "Khalid Mahmoud",
    reportedByInitials: "KM",
    reportedByColor: "#0277BD",
    date: "2026-02-05",
    correctiveAction:
      "Lockout/Tagout procedure reviewed. Electrical isolation training refresher completed. Panel labelling improved.",
    status: "closed",
    capaRef: "CAPA-RIG-2026-004",
  },
  {
    id: "NM-2026-009",
    description:
      "BOP function test failure — annular preventer failed to close on command during weekly function test. Backup system operated.",
    severity: "high_potential",
    location: "BOP Stack / Wellhead Area",
    reportedBy: "Mohammed Al-Dosari",
    reportedByInitials: "MD",
    reportedByColor: "#BF360C",
    date: "2026-01-28",
    correctiveAction:
      "BOP control system inspected. Faulty solenoid valve identified and replaced. Retest passed. Maintenance records updated.",
    status: "closed",
    capaRef: "CAPA-RIG-2026-005",
  },
];

const AUDIT_ITEMS: AuditItem[] = [
  {
    id: "AI-2026-001",
    auditRef: "AUDIT-RIG-2026-Q1",
    finding:
      "HSE Management Walk-throughs not conducted at required frequency — records show only 2 of 4 scheduled walks completed in January 2026.",
    category: "safety",
    status: "in_progress",
    dueDate: "2026-03-15",
    assignedTo: "Ali Hassan",
    assignedInitials: "AH",
    assignedColor: "#2E7D32",
    priority: "major",
    closedDate: null,
    notes:
      "HSE officer to complete remaining walkthroughs and maintain log. Frequency to be verified monthly.",
  },
  {
    id: "AI-2026-002",
    auditRef: "AUDIT-RIG-2026-Q1",
    finding:
      "2 of 8 fire extinguishers in pump room area past annual inspection date. Inspection tags expired Dec 2025.",
    category: "safety",
    status: "open",
    dueDate: "2026-03-01",
    assignedTo: "Khalid Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    priority: "major",
    closedDate: null,
    notes:
      "Fire extinguishers to be removed, recharged and re-certified. Certification log to be updated.",
  },
  {
    id: "AI-2026-003",
    auditRef: "AUDIT-RIG-2026-Q1",
    finding:
      "Drip trays absent under several lubricant storage drums in maintenance workshop — environmental spill risk.",
    category: "environmental",
    status: "closed",
    dueDate: "2026-02-20",
    assignedTo: "Khalid Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    priority: "minor",
    closedDate: "2026-02-18",
    notes:
      "Drip trays installed under all storage drums. Housekeeping standards posted in workshop.",
  },
  {
    id: "AI-2026-004",
    auditRef: "AUDIT-RIG-2026-Q1",
    finding:
      "BOP pressure test records incomplete — test certificate for January 2026 missing witness signatures from Aramco Company Man.",
    category: "documentation",
    status: "closed",
    dueDate: "2026-02-15",
    assignedTo: "Mohammed Al-Dosari",
    assignedInitials: "MD",
    assignedColor: "#BF360C",
    priority: "major",
    closedDate: "2026-02-12",
    notes:
      "Retroactive signatures obtained. BOP test record template updated to include mandatory witness signature block.",
  },
  {
    id: "AI-2026-005",
    auditRef: "AUDIT-RIG-2026-Q1",
    finding:
      "Emergency response drill — muster time of 8 min 42 sec exceeds 7-minute target. 3 personnel did not muster at correct station.",
    category: "safety",
    status: "in_progress",
    dueDate: "2026-03-10",
    assignedTo: "Ali Hassan",
    assignedInitials: "AH",
    assignedColor: "#2E7D32",
    priority: "major",
    closedDate: null,
    notes:
      "Re-drill to be conducted. Muster station assignments re-communicated to all new mobilisers.",
  },
  {
    id: "AI-2026-006",
    auditRef: "AUDIT-RIG-2026-Q1",
    finding:
      "H2S monitor calibration records incomplete — 3 of 22 personal gas monitors lack calibration record for Q4 2025.",
    category: "equipment",
    status: "in_progress",
    dueDate: "2026-03-05",
    assignedTo: "Ali Hassan",
    assignedInitials: "AH",
    assignedColor: "#2E7D32",
    priority: "critical",
    closedDate: null,
    notes:
      "Affected units to be pulled from service and calibrated. Calibration frequency reminder issued.",
  },
  {
    id: "AI-2026-007",
    auditRef: "AUDIT-RIG-2025-Q4",
    finding:
      "Chemical hazard labels (GHS) missing or faded on 4 chemical storage containers in the mud pit chemical store.",
    category: "safety",
    status: "closed",
    dueDate: "2026-01-31",
    assignedTo: "Ali Hassan",
    assignedInitials: "AH",
    assignedColor: "#2E7D32",
    priority: "minor",
    closedDate: "2026-01-28",
    notes:
      "All containers relabelled. GHS label inspection added to monthly housekeeping checklist.",
  },
  {
    id: "AI-2026-008",
    auditRef: "AUDIT-RIG-2025-Q4",
    finding:
      "PTW (Permit To Work) records — 3 cold work permits found without supervisor sign-off on completion. Permits not formally closed.",
    category: "process",
    status: "closed",
    dueDate: "2026-01-20",
    assignedTo: "Omar Hassan",
    assignedInitials: "OH",
    assignedColor: "#00897B",
    priority: "major",
    closedDate: "2026-01-18",
    notes:
      "All open permits audited and retroactively closed. PTW procedure training re-issued to all PTW issuers and receivers.",
  },
  {
    id: "AI-2026-009",
    auditRef: "AUDIT-RIG-2025-Q4",
    finding:
      "Housekeeping: Mud chemicals and barite bags found incorrectly stacked exceeding safe stacking height on chemical pallet rack.",
    category: "housekeeping",
    status: "closed",
    dueDate: "2025-12-31",
    assignedTo: "Khalid Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    priority: "minor",
    closedDate: "2025-12-29",
    notes:
      "Stacking corrected. Maximum stacking height signs posted. Monthly audit added.",
  },
  {
    id: "AI-2026-010",
    auditRef: "AUDIT-RIG-2026-Q1",
    finding:
      "Safety shower and eye wash station near chemical mixing area — water supply was found to be inadequate (low pressure). Functionality test failed.",
    category: "equipment",
    status: "overdue",
    dueDate: "2026-02-15",
    assignedTo: "Khalid Mahmoud",
    assignedInitials: "KM",
    assignedColor: "#0277BD",
    priority: "critical",
    closedDate: null,
    notes:
      "Water supply line inspection required. Interim portable eye wash bottles placed at location. Urgent repair needed.",
  },
];

// ─── Config Helpers ───────────────────────────────────────────────────────────

function getCategoryConfig(cat: StopCardCategory) {
  const MAP: Record<
    StopCardCategory,
    { label: string; color: string; bg: string }
  > = {
    unsafe_act: { label: "Unsafe Act", color: "#DC2626", bg: "#FEF2F2" },
    unsafe_condition: {
      label: "Unsafe Condition",
      color: "#EA580C",
      bg: "#FFF7ED",
    },
    positive_observation: {
      label: "Positive Obs.",
      color: "#059669",
      bg: "#ECFDF5",
    },
    environmental: { label: "Environmental", color: "#0891B2", bg: "#ECFEFF" },
  };
  return MAP[cat];
}

function getNearMissSevConfig(sev: NearMissSeverity) {
  const MAP: Record<
    NearMissSeverity,
    { label: string; color: string; bg: string }
  > = {
    high_potential: {
      label: "High Potential",
      color: "#DC2626",
      bg: "#FEF2F2",
    },
    medium_potential: {
      label: "Medium Potential",
      color: "#D97706",
      bg: "#FFFBEB",
    },
    low_potential: {
      label: "Low Potential",
      color: "#059669",
      bg: "#ECFDF5",
    },
  };
  return MAP[sev];
}

function getAuditPriorityConfig(priority: AuditItem["priority"]) {
  const MAP: Record<
    AuditItem["priority"],
    { label: string; color: string; bg: string }
  > = {
    critical: { label: "Critical", color: "#DC2626", bg: "#FEF2F2" },
    major: { label: "Major", color: "#EA580C", bg: "#FFF7ED" },
    minor: { label: "Minor", color: "#D97706", bg: "#FFFBEB" },
    observation: { label: "Observation", color: "#64748B", bg: "#F1F5F9" },
  };
  return MAP[priority];
}

function getAuditCategoryConfig(cat: AuditFindingCategory) {
  const MAP: Record<AuditFindingCategory, { label: string; color: string }> = {
    safety: { label: "Safety", color: "#DC2626" },
    environmental: { label: "Environmental", color: "#0891B2" },
    process: { label: "Process", color: "#7C3AED" },
    equipment: { label: "Equipment", color: "#D97706" },
    housekeeping: { label: "Housekeeping", color: "#059669" },
    documentation: { label: "Documentation", color: "#64748B" },
  };
  return MAP[cat];
}

function getTrainingStatusConfig(status: TrainingRecord["status"]) {
  const MAP: Record<
    TrainingRecord["status"],
    { label: string; color: string; bg: string }
  > = {
    valid: { label: "Valid", color: "#059669", bg: "#ECFDF5" },
    expiring: { label: "Expiring Soon", color: "#D97706", bg: "#FFFBEB" },
    expired: { label: "Expired", color: "#DC2626", bg: "#FEF2F2" },
  };
  return MAP[status];
}

function getHseEventTypeConfig(type: HseEvent["type"]) {
  const MAP: Record<
    HseEvent["type"],
    { label: string; color: string; bg: string }
  > = {
    toolbox_talk: { label: "Toolbox Talk", color: "#0891B2", bg: "#ECFEFF" },
    safety_meeting: {
      label: "Safety Meeting",
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    drill: { label: "Drill", color: "#DC2626", bg: "#FEF2F2" },
    inspection: { label: "Inspection", color: "#D97706", bg: "#FFFBEB" },
    training_session: {
      label: "Training Session",
      color: "#059669",
      bg: "#ECFDF5",
    },
  };
  return MAP[type];
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date("2026-02-28");
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
}

function KpiCard({ label, value, color, bg }: KpiCardProps) {
  return (
    <div
      className={cn("rounded-lg px-3 py-2 text-center border shrink-0", bg)}
    >
      <p className="text-[10px] font-medium" style={{ color }}>
        {label}
      </p>
      <p className="text-lg font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// ─── Tab Header ───────────────────────────────────────────────────────────────

interface TabHeaderProps {
  title: string;
  description: string;
  icon: React.ElementType;
  kpis: KpiCardProps[];
  action?: React.ReactNode;
}

function TabHeader({
  title,
  description,
  icon: Icon,
  kpis,
  action,
}: TabHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-100 p-2">
          <Icon className="size-5 text-slate-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
        {action && action}
      </div>
    </div>
  );
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const STOP_CARD_COLUMNS: Column<StopCard>[] = [
  {
    key: "id",
    header: "ID",
    width: "120px",
    render: (v: string) => (
      <span className="font-mono text-xs text-blue-700 font-semibold">{v}</span>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    width: "140px",
    render: (v: StopCardCategory) => {
      const cfg = getCategoryConfig(v);
      return (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "description",
    header: "Description",
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-[300px] block">
        {v}
      </span>
    ),
  },
  {
    key: "location",
    header: "Location",
    width: "160px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "reportedBy",
    header: "Reported By",
    width: "140px",
    render: (v: string, row: StopCard) => (
      <div className="flex items-center gap-1.5">
        <AvatarCircle
          initials={row.reportedByInitials}
          color={row.reportedByColor}
          size="xs"
        />
        <span className="text-xs text-slate-700">{v}</span>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "100px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: StopCard["status"]) => {
      const MAP: Record<StopCard["status"], string> = {
        open: "open",
        in_progress: "in_progress",
        closed: "closed",
      };
      return <StatusBadge status={MAP[v] ?? v} size="sm" />;
    },
  },
];

const NEAR_MISS_COLUMNS: Column<NearMiss>[] = [
  {
    key: "id",
    header: "ID",
    width: "120px",
    render: (v: string) => (
      <span className="font-mono text-xs text-blue-700 font-semibold">{v}</span>
    ),
  },
  {
    key: "description",
    header: "Description",
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-[300px] block">
        {v}
      </span>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    sortable: true,
    width: "140px",
    render: (v: NearMissSeverity) => {
      const cfg = getNearMissSevConfig(v);
      return (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "location",
    header: "Location",
    width: "160px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "reportedBy",
    header: "Reported By",
    width: "140px",
    render: (v: string, row: NearMiss) => (
      <div className="flex items-center gap-1.5">
        <AvatarCircle
          initials={row.reportedByInitials}
          color={row.reportedByColor}
          size="xs"
        />
        <span className="text-xs text-slate-700">{v}</span>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "100px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "correctiveAction",
    header: "Corrective Action",
    render: (v: string) => (
      <span className="text-xs text-slate-500 line-clamp-2 max-w-[240px] block">
        {v}
      </span>
    ),
  },
  {
    key: "capaRef",
    header: "CAPA Ref",
    width: "150px",
    render: (v: string | null) =>
      v ? (
        <span className="font-mono text-xs text-purple-700 font-medium">{v}</span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: NearMiss["status"]) => {
      const MAP: Record<NearMiss["status"], string> = {
        open: "open",
        in_progress: "in_progress",
        closed: "closed",
      };
      return <StatusBadge status={MAP[v] ?? v} size="sm" />;
    },
  },
];

const AUDIT_COLUMNS: Column<AuditItem>[] = [
  {
    key: "id",
    header: "Item #",
    width: "110px",
    render: (v: string) => (
      <span className="font-mono text-xs text-slate-600 font-semibold">{v}</span>
    ),
  },
  {
    key: "auditRef",
    header: "Audit Ref",
    width: "170px",
    render: (v: string) => (
      <span className="font-mono text-xs text-blue-700">{v}</span>
    ),
  },
  {
    key: "finding",
    header: "Finding",
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-[280px] block">
        {v}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    width: "120px",
    render: (v: AuditFindingCategory) => {
      const cfg = getAuditCategoryConfig(v);
      return (
        <span className="text-xs font-semibold" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    width: "100px",
    render: (v: AuditItem["priority"]) => {
      const cfg = getAuditPriorityConfig(v);
      return (
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: AuditItemStatus) => {
      const MAP: Record<AuditItemStatus, string> = {
        open: "open",
        in_progress: "in_progress",
        closed: "closed",
        overdue: "overdue",
      };
      return <StatusBadge status={MAP[v] ?? v} size="sm" />;
    },
  },
  {
    key: "dueDate",
    header: "Due Date",
    sortable: true,
    width: "110px",
    render: (v: string, row: AuditItem) => {
      const isOverdue =
        row.status === "overdue" ||
        (row.status !== "closed" && new Date(v) < new Date());
      return (
        <span
          className={cn(
            "text-xs font-medium",
            isOverdue ? "text-red-600" : "text-slate-600"
          )}
        >
          {v}
        </span>
      );
    },
  },
  {
    key: "assignedTo",
    header: "Assigned To",
    width: "140px",
    render: (v: string, row: AuditItem) => (
      <div className="flex items-center gap-1.5">
        <AvatarCircle
          initials={row.assignedInitials}
          color={row.assignedColor}
          size="xs"
        />
        <span className="text-xs text-slate-700">{v}</span>
      </div>
    ),
  },
];

const TRAINING_COLUMNS: Column<TrainingRecord>[] = [
  {
    key: "personnelName",
    header: "Personnel Name",
    width: "160px",
    render: (v: string) => (
      <span className="text-xs font-medium text-slate-800">{v}</span>
    ),
  },
  {
    key: "trainingName",
    header: "Training / Certification",
    render: (v: string) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-[260px] block">
        {v}
      </span>
    ),
  },
  {
    key: "provider",
    header: "Provider",
    width: "170px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "completedDate",
    header: "Completed",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "expiryDate",
    header: "Expiry Date",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "expiryDate",
    header: "Days Until Expiry",
    width: "130px",
    render: (v: string, row: TrainingRecord) => {
      const days = getDaysUntilExpiry(v);
      const cfg = getTrainingStatusConfig(row.status);
      if (row.status === "expired") {
        return (
          <span className="text-xs font-semibold text-red-600">
            {Math.abs(days)}d overdue
          </span>
        );
      }
      return (
        <span className="text-xs font-semibold" style={{ color: cfg.color }}>
          {days}d
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "120px",
    render: (v: TrainingRecord["status"]) => {
      const cfg = getTrainingStatusConfig(v);
      return (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "certificateNumber",
    header: "Certificate #",
    width: "190px",
    render: (v: string) => (
      <span className="font-mono text-xs text-slate-500">{v}</span>
    ),
  },
];

const HSE_EVENT_COLUMNS: Column<HseEvent>[] = [
  {
    key: "id",
    header: "ID",
    width: "90px",
    render: (v: string) => (
      <span className="font-mono text-xs text-blue-700 font-semibold">{v}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    width: "140px",
    render: (v: HseEvent["type"]) => {
      const cfg = getHseEventTypeConfig(v);
      return (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "title",
    header: "Title",
    render: (v: string) => (
      <span className="text-xs font-medium text-slate-700 line-clamp-2 max-w-[260px] block">
        {v}
      </span>
    ),
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "time",
    header: "Time",
    width: "70px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "location",
    header: "Location",
    width: "160px",
    render: (v: string) => <span className="text-xs text-slate-500">{v}</span>,
  },
  {
    key: "conductor",
    header: "Conductor",
    width: "140px",
    render: (v: string) => (
      <span className="text-xs text-slate-700">{v}</span>
    ),
  },
  {
    key: "attendeeCount",
    header: "Attendees",
    width: "90px",
    render: (v: number, row: HseEvent) => (
      <span className="text-xs text-slate-600">
        {row.status === "scheduled" ? "—" : v}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: HseEvent["status"]) => {
      const MAP: Record<HseEvent["status"], string> = {
        completed: "completed",
        scheduled: "open",
        cancelled: "closed",
      };
      return <StatusBadge status={MAP[v] ?? v} size="sm" />;
    },
  },
];

// ─── Dialog Forms ─────────────────────────────────────────────────────────────

function NewStopCardDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Stop Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Stop Card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sc-category">Category</Label>
            <Select>
              <SelectTrigger id="sc-category" className="w-full">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unsafe_act">Unsafe Act</SelectItem>
                <SelectItem value="unsafe_condition">
                  Unsafe Condition
                </SelectItem>
                <SelectItem value="positive_observation">
                  Positive Observation
                </SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sc-description">Description</Label>
            <Textarea
              id="sc-description"
              placeholder="Describe the observation..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sc-location">Location</Label>
            <Input id="sc-location" placeholder="e.g. Drill Floor — Area B" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Submit Stop Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportNearMissDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Report Near Miss
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Near Miss</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nm-description">Description</Label>
            <Textarea
              id="nm-description"
              placeholder="Describe what happened..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nm-severity">Severity</Label>
            <Select>
              <SelectTrigger id="nm-severity" className="w-full">
                <SelectValue placeholder="Select severity..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_potential">High Potential</SelectItem>
                <SelectItem value="medium_potential">
                  Medium Potential
                </SelectItem>
                <SelectItem value="low_potential">Low Potential</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nm-location">Location</Label>
            <Input id="nm-location" placeholder="e.g. Pump Room — Level 2" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nm-corrective">Corrective Action</Label>
            <Textarea
              id="nm-corrective"
              placeholder="Immediate actions taken..."
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewAuditFindingDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Finding
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Audit Finding</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="af-ref">Audit Reference</Label>
            <Input
              id="af-ref"
              placeholder="e.g. AUDIT-RIG-2026-Q1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="af-finding">Finding Description</Label>
            <Textarea
              id="af-finding"
              placeholder="Describe the finding in detail..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="af-category">Category</Label>
              <Select>
                <SelectTrigger id="af-category" className="w-full">
                  <SelectValue placeholder="Category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="housekeeping">Housekeeping</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="af-priority">Priority</Label>
              <Select>
                <SelectTrigger id="af-priority" className="w-full">
                  <SelectValue placeholder="Priority..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="observation">Observation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="af-due">Due Date</Label>
              <Input id="af-due" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="af-assigned">Assigned To</Label>
              <Input id="af-assigned" placeholder="Name..." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Add Finding</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewHseEventDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log HSE Event</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evt-type">Event Type</Label>
            <Select>
              <SelectTrigger id="evt-type" className="w-full">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toolbox_talk">Toolbox Talk</SelectItem>
                <SelectItem value="safety_meeting">Safety Meeting</SelectItem>
                <SelectItem value="drill">Drill</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="training_session">
                  Training Session
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evt-title">Title</Label>
            <Input id="evt-title" placeholder="Event title..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="evt-date">Date</Label>
              <Input id="evt-date" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="evt-time">Time</Label>
              <Input id="evt-time" type="time" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evt-location">Location</Label>
            <Input id="evt-location" placeholder="e.g. Drill Floor — Rig Alpha" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evt-notes">Notes</Label>
            <Textarea
              id="evt-notes"
              placeholder="Topics covered, outcomes, observations..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Log Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tab Content Components ───────────────────────────────────────────────────

function StopCardsTab() {
  const openCount = STOP_CARDS.filter((c) => c.status !== "closed").length;
  const thisMonth = STOP_CARDS.filter((c) =>
    c.date.startsWith("2026-02")
  ).length;

  return (
    <div className="p-5">
      <TabHeader
        title="Stop Cards"
        description={`${STOP_CARDS.length} total — ${openCount} open`}
        icon={Shield}
        kpis={[
          {
            label: "Total",
            value: STOP_CARDS.length,
            color: "#334155",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "Open",
            value: openCount,
            color: "#D97706",
            bg: "bg-amber-50 border-amber-200",
          },
          {
            label: "Closed",
            value: STOP_CARDS.length - openCount,
            color: "#059669",
            bg: "bg-emerald-50 border-emerald-200",
          },
          {
            label: "This Month",
            value: thisMonth,
            color: "#0891B2",
            bg: "bg-cyan-50 border-cyan-200",
          },
        ]}
        action={<NewStopCardDialog />}
      />
      <DataTable<StopCard>
        data={STOP_CARDS}
        columns={STOP_CARD_COLUMNS}
        searchPlaceholder="Search stop cards..."
        searchKeys={["description", "location", "reportedBy", "id"]}
        filters={[
          {
            key: "category",
            label: "Category",
            options: [
              { label: "Unsafe Act", value: "unsafe_act" },
              { label: "Unsafe Condition", value: "unsafe_condition" },
              { label: "Positive Observation", value: "positive_observation" },
              { label: "Environmental", value: "environmental" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Open", value: "open" },
              { label: "In Progress", value: "in_progress" },
              { label: "Closed", value: "closed" },
            ],
          },
        ]}
        emptyMessage="No stop cards found."
        itemLabel="stop cards"
        pageSize={10}
      />
    </div>
  );
}

function NearMissesTab() {
  const highPotential = NEAR_MISSES.filter(
    (n) => n.severity === "high_potential"
  ).length;
  const openCount = NEAR_MISSES.filter((n) => n.status !== "closed").length;

  return (
    <div className="p-5">
      <TabHeader
        title="Near Miss Events"
        description={`${NEAR_MISSES.length} recorded — ${highPotential} high potential`}
        icon={AlertTriangle}
        kpis={[
          {
            label: "Total",
            value: NEAR_MISSES.length,
            color: "#334155",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "High Potential",
            value: highPotential,
            color: "#DC2626",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Open",
            value: openCount,
            color: "#D97706",
            bg: "bg-amber-50 border-amber-200",
          },
          {
            label: "Closed",
            value: NEAR_MISSES.length - openCount,
            color: "#059669",
            bg: "bg-emerald-50 border-emerald-200",
          },
        ]}
        action={<ReportNearMissDialog />}
      />
      <DataTable<NearMiss>
        data={NEAR_MISSES}
        columns={NEAR_MISS_COLUMNS}
        searchPlaceholder="Search near miss events..."
        searchKeys={["description", "location", "reportedBy", "correctiveAction", "id"]}
        filters={[
          {
            key: "severity",
            label: "Severity",
            options: [
              { label: "High Potential", value: "high_potential" },
              { label: "Medium Potential", value: "medium_potential" },
              { label: "Low Potential", value: "low_potential" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Open", value: "open" },
              { label: "In Progress", value: "in_progress" },
              { label: "Closed", value: "closed" },
            ],
          },
        ]}
        emptyMessage="No near miss events found."
        itemLabel="events"
        pageSize={10}
      />
    </div>
  );
}

function AuditFindingsTab() {
  const criticalCount = AUDIT_ITEMS.filter(
    (a) => a.priority === "critical"
  ).length;
  const overdueCount = AUDIT_ITEMS.filter(
    (a) => a.status === "overdue"
  ).length;
  const openCount = AUDIT_ITEMS.filter((a) => a.status !== "closed").length;

  return (
    <div className="p-5">
      <TabHeader
        title="Audit Findings"
        description={`${AUDIT_ITEMS.length} findings — ${overdueCount} overdue`}
        icon={ClipboardCheck}
        kpis={[
          {
            label: "Total",
            value: AUDIT_ITEMS.length,
            color: "#334155",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "Critical",
            value: criticalCount,
            color: "#DC2626",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Overdue",
            value: overdueCount,
            color: "#DC2626",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Open",
            value: openCount,
            color: "#D97706",
            bg: "bg-amber-50 border-amber-200",
          },
        ]}
        action={<NewAuditFindingDialog />}
      />
      <DataTable<AuditItem>
        data={AUDIT_ITEMS}
        columns={AUDIT_COLUMNS}
        searchPlaceholder="Search audit findings..."
        searchKeys={["finding", "auditRef", "assignedTo", "notes", "id"]}
        filters={[
          {
            key: "category",
            label: "Category",
            options: [
              { label: "Safety", value: "safety" },
              { label: "Environmental", value: "environmental" },
              { label: "Process", value: "process" },
              { label: "Equipment", value: "equipment" },
              { label: "Housekeeping", value: "housekeeping" },
              { label: "Documentation", value: "documentation" },
            ],
          },
          {
            key: "priority",
            label: "Priority",
            options: [
              { label: "Critical", value: "critical" },
              { label: "Major", value: "major" },
              { label: "Minor", value: "minor" },
              { label: "Observation", value: "observation" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Open", value: "open" },
              { label: "In Progress", value: "in_progress" },
              { label: "Overdue", value: "overdue" },
              { label: "Closed", value: "closed" },
            ],
          },
        ]}
        emptyMessage="No audit items found."
        itemLabel="findings"
        pageSize={10}
      />
    </div>
  );
}

function TrainingsTab() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const expiringCount = TRAINING_RECORDS.filter(
    (t) => t.status === "expiring"
  ).length;
  const expiredCount = TRAINING_RECORDS.filter(
    (t) => t.status === "expired"
  ).length;
  const validCount = TRAINING_RECORDS.filter(
    (t) => t.status === "valid"
  ).length;

  const sortedByExpiry = [...TRAINING_RECORDS].sort((a, b) => {
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });

  const filtered =
    statusFilter === "all"
      ? sortedByExpiry
      : sortedByExpiry.filter((t) => t.status === statusFilter);

  return (
    <div className="p-5">
      <TabHeader
        title="Trainings & Certifications"
        description={`${TRAINING_RECORDS.length} certifications tracked — ${expiringCount} expiring within 90 days`}
        icon={GraduationCap}
        kpis={[
          {
            label: "Total",
            value: TRAINING_RECORDS.length,
            color: "#334155",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "Expiring",
            value: expiringCount,
            color: "#D97706",
            bg: "bg-amber-50 border-amber-200",
          },
          {
            label: "Expired",
            value: expiredCount,
            color: "#DC2626",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Valid",
            value: validCount,
            color: "#059669",
            bg: "bg-emerald-50 border-emerald-200",
          },
        ]}
      />

      {/* Status filter pills */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { value: "all", label: "All" },
          { value: "valid", label: "Valid" },
          { value: "expiring", label: "Expiring" },
          { value: "expired", label: "Expired" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === opt.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <DataTable<TrainingRecord>
        data={filtered}
        columns={TRAINING_COLUMNS}
        searchPlaceholder="Search by name or certification..."
        searchKeys={["personnelName", "trainingName", "provider", "certificateNumber", "id"]}
        emptyMessage="No training records found."
        itemLabel="records"
        pageSize={10}
      />
    </div>
  );
}

function HseEventsTab() {
  const thisMonth = HSE_EVENTS.filter((e) =>
    e.date.startsWith("2026-02")
  ).length;
  const completedCount = HSE_EVENTS.filter(
    (e) => e.status === "completed"
  ).length;
  const scheduledCount = HSE_EVENTS.filter(
    (e) => e.status === "scheduled"
  ).length;

  return (
    <div className="p-5">
      <TabHeader
        title="HSE Events"
        description="Safety meetings, drills, toolbox talks & inspections"
        icon={Calendar}
        kpis={[
          {
            label: "Total Events",
            value: HSE_EVENTS.length,
            color: "#334155",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "This Month",
            value: thisMonth,
            color: "#0891B2",
            bg: "bg-cyan-50 border-cyan-200",
          },
          {
            label: "Completed",
            value: completedCount,
            color: "#059669",
            bg: "bg-emerald-50 border-emerald-200",
          },
          {
            label: "Scheduled",
            value: scheduledCount,
            color: "#7C3AED",
            bg: "bg-violet-50 border-violet-200",
          },
        ]}
        action={<NewHseEventDialog />}
      />
      <DataTable<HseEvent>
        data={HSE_EVENTS}
        columns={HSE_EVENT_COLUMNS}
        searchPlaceholder="Search events..."
        searchKeys={["title", "location", "conductor", "notes", "id"]}
        filters={[
          {
            key: "type",
            label: "Type",
            options: [
              { label: "Toolbox Talk", value: "toolbox_talk" },
              { label: "Safety Meeting", value: "safety_meeting" },
              { label: "Drill", value: "drill" },
              { label: "Inspection", value: "inspection" },
              { label: "Training Session", value: "training_session" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Completed", value: "completed" },
              { label: "Scheduled", value: "scheduled" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
        emptyMessage="No HSE events found."
        itemLabel="events"
        pageSize={10}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "stop_cards", label: "Stop Cards", badge: STOP_CARDS.filter((c) => c.status !== "closed").length },
  { key: "near_misses", label: "Near Misses", badge: NEAR_MISSES.filter((n) => n.status !== "closed").length },
  { key: "audit_findings", label: "Audit Findings", badge: AUDIT_ITEMS.filter((a) => a.status === "overdue" || a.status === "open").length },
  { key: "trainings", label: "Trainings", badge: TRAINING_RECORDS.filter((t) => t.status === "expired" || t.status === "expiring").length },
  { key: "hse_events", label: "HSE Events" },
];

export default function HSEPage() {
  const [activeTab, setActiveTab] = React.useState("stop_cards");

  const criticalAuditItems = AUDIT_ITEMS.filter(
    (a) => a.priority === "critical" && a.status !== "closed"
  ).length;
  const highPotentialNM = NEAR_MISSES.filter(
    (n) => n.severity === "high_potential"
  ).length;
  const totalOpenActions =
    STOP_CARDS.filter((c) => c.status !== "closed").length +
    NEAR_MISSES.filter((n) => n.status !== "closed").length +
    AUDIT_ITEMS.filter((a) => a.status !== "closed").length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">HSE</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Rig Alpha — Stop cards, near misses, audit findings, trainings &
            HSE events
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {criticalAuditItems > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center">
              <p className="text-xs text-red-600 font-medium">
                Critical Findings
              </p>
              <p className="text-lg font-bold text-red-800">
                {criticalAuditItems}
              </p>
            </div>
          )}
          {highPotentialNM > 0 && (
            <div className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-center">
              <p className="text-xs text-orange-600 font-medium">
                Hi-Pot Near Misses
              </p>
              <p className="text-lg font-bold text-orange-800">
                {highPotentialNM}
              </p>
            </div>
          )}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-center">
            <p className="text-xs text-slate-500 font-medium">Open Actions</p>
            <p className="text-lg font-bold text-slate-800">
              {totalOpenActions}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="flex-1 bg-white">
        {activeTab === "stop_cards" && <StopCardsTab />}
        {activeTab === "near_misses" && <NearMissesTab />}
        {activeTab === "audit_findings" && <AuditFindingsTab />}
        {activeTab === "trainings" && <TrainingsTab />}
        {activeTab === "hse_events" && <HseEventsTab />}
      </div>
    </div>
  );
}
