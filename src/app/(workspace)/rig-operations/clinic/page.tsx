"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { ChevronDown, ChevronRight, Heart, Activity, AlertTriangle, Stethoscope } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicalCheck {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  checkType: string;
  scheduledDate: string;
  result: "pass" | "fail" | "pending" | "conditional";
  status: "completed" | "scheduled" | "missed" | "in_progress";
  notes: string;
  conductedBy: string;
}

interface MedicalHistoryPerson {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  company: string;
  role: string;
  bloodGroup: string;
  records: {
    date: string;
    type: string;
    result: string;
    notes: string;
    conductedBy: string;
  }[];
}

interface HSEEvent {
  id: string;
  eventType: string;
  description: string;
  date: string;
  severity: "critical" | "high" | "medium" | "low";
  outcome: string;
  reportedBy: string;
  status: "open" | "closed" | "under_review";
}

interface FirstAidRecord {
  id: string;
  date: string;
  patient: string;
  patientInitials: string;
  patientColor: string;
  treatment: string;
  administeredBy: string;
  notes: string;
  category: "minor" | "moderate" | "serious";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MEDICAL_CHECKS: MedicalCheck[] = [
  {
    id: "MC-2026-001",
    name: "Omar Hassan",
    initials: "OH",
    avatarColor: "#00897B",
    checkType: "Pre-Mobilisation Medical",
    scheduledDate: "2026-03-10",
    result: "pending",
    status: "scheduled",
    notes: "Annual medical due before next rotation.",
    conductedBy: "TBD",
  },
  {
    id: "MC-2026-002",
    name: "Mohammed Al-Dosari",
    initials: "MD",
    avatarColor: "#BF360C",
    checkType: "H2S Medical Clearance",
    scheduledDate: "2026-02-20",
    result: "pass",
    status: "completed",
    notes: "Full clearance granted. Valid for 24 months.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-003",
    name: "Khalid Mahmoud",
    initials: "KM",
    avatarColor: "#0277BD",
    checkType: "Routine Physical Examination",
    scheduledDate: "2026-02-15",
    result: "conditional",
    status: "completed",
    notes: "BP slightly elevated. Recommend follow-up in 30 days.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-004",
    name: "Ali Hassan",
    initials: "AH",
    avatarColor: "#2E7D32",
    checkType: "Annual Medical Fitness Certificate",
    scheduledDate: "2026-02-22",
    result: "pass",
    status: "completed",
    notes: "Fit for offshore duty. Renewed for 12 months.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-005",
    name: "Emma Richards",
    initials: "ER",
    avatarColor: "#E91E63",
    checkType: "Drug & Alcohol Screening",
    scheduledDate: "2026-02-27",
    result: "pending",
    status: "in_progress",
    notes: "Random screening per rig policy.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-006",
    name: "Jack Anderson",
    initials: "JA",
    avatarColor: "#546E7A",
    checkType: "Audiometric Test",
    scheduledDate: "2026-02-10",
    result: "pass",
    status: "completed",
    notes: "Hearing within normal range. Ear protection compliance confirmed.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-007",
    name: "Tariq Al-Shammari",
    initials: "TS",
    avatarColor: "#FF8F00",
    checkType: "Vision Test",
    scheduledDate: "2026-02-08",
    result: "pass",
    status: "completed",
    notes: "20/20 corrected vision. Glasses required. Recorded.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-008",
    name: "Ricardo Santos",
    initials: "RS",
    avatarColor: "#00838F",
    checkType: "Pre-Mobilisation Medical",
    scheduledDate: "2026-02-23",
    result: "pass",
    status: "completed",
    notes: "Fit for duty. Project mobilisation approved.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-009",
    name: "Omar Hassan",
    initials: "OH",
    avatarColor: "#00897B",
    checkType: "Blood Pressure Monitoring",
    scheduledDate: "2026-02-25",
    result: "conditional",
    status: "completed",
    notes: "BP 145/92. Medication prescribed. Under monitoring.",
    conductedBy: "Dr. Samira Al-Masri",
  },
  {
    id: "MC-2026-010",
    name: "Khalid Mahmoud",
    initials: "KM",
    avatarColor: "#0277BD",
    checkType: "Blood Pressure Follow-up",
    scheduledDate: "2026-03-15",
    result: "pending",
    status: "scheduled",
    notes: "Follow-up to MC-2026-003.",
    conductedBy: "TBD",
  },
];

const MEDICAL_HISTORY_PERSONS: MedicalHistoryPerson[] = [
  {
    id: "PER-001",
    name: "Omar Hassan",
    initials: "OH",
    avatarColor: "#00897B",
    company: "ADI Drilling LLC",
    role: "Rig Manager",
    bloodGroup: "O+",
    records: [
      { date: "2026-02-25", type: "Blood Pressure Monitoring", result: "Conditional", notes: "BP 145/92. Medication prescribed.", conductedBy: "Dr. Samira Al-Masri" },
      { date: "2025-09-10", type: "Pre-Mobilisation Medical", result: "Pass", notes: "Fit for duty.", conductedBy: "Dr. Ahmed Nour" },
      { date: "2025-03-15", type: "Annual Physical", result: "Pass", notes: "All parameters within normal limits.", conductedBy: "Dr. Ahmed Nour" },
    ],
  },
  {
    id: "PER-002",
    name: "Mohammed Al-Dosari",
    initials: "MD",
    avatarColor: "#BF360C",
    company: "ADI Drilling LLC",
    role: "Sr. Driller / Well Control Specialist",
    bloodGroup: "A+",
    records: [
      { date: "2026-02-20", type: "H2S Medical Clearance", result: "Pass", notes: "Full clearance granted.", conductedBy: "Dr. Samira Al-Masri" },
      { date: "2025-09-12", type: "Annual Medical", result: "Pass", notes: "Fully fit.", conductedBy: "Dr. Ahmed Nour" },
    ],
  },
  {
    id: "PER-003",
    name: "Khalid Mahmoud",
    initials: "KM",
    avatarColor: "#0277BD",
    company: "ADI Drilling LLC",
    role: "Maintenance Manager",
    bloodGroup: "B+",
    records: [
      { date: "2026-02-15", type: "Routine Physical", result: "Conditional", notes: "Elevated BP. Follow-up scheduled.", conductedBy: "Dr. Samira Al-Masri" },
      { date: "2025-09-14", type: "Pre-Mob Medical", result: "Pass", notes: "Fit for duty.", conductedBy: "Dr. Ahmed Nour" },
      { date: "2025-04-01", type: "Cardiac Screening", result: "Pass", notes: "ECG normal.", conductedBy: "Dr. Ahmed Nour" },
    ],
  },
  {
    id: "PER-004",
    name: "Ali Hassan",
    initials: "AH",
    avatarColor: "#2E7D32",
    company: "ADI Drilling LLC",
    role: "HSE Officer",
    bloodGroup: "O+",
    records: [
      { date: "2026-02-22", type: "Annual Medical Certificate", result: "Pass", notes: "Fit for offshore. Renewed 12 months.", conductedBy: "Dr. Samira Al-Masri" },
      { date: "2025-09-14", type: "Pre-Mob Medical", result: "Pass", notes: "Fit for duty.", conductedBy: "Dr. Ahmed Nour" },
    ],
  },
];

const HSE_EVENTS: HSEEvent[] = [
  {
    id: "CLINIC-HSE-001",
    eventType: "Heat Stress",
    description: "Floorhand reported dizziness and nausea after 4-hour outdoor work session. Temperature 42°C. Relocated to AC area, rehydrated.",
    date: "2026-02-20",
    severity: "medium",
    outcome: "Recovery complete within 2 hours. Returned to light duties. Heat stress protocol reinforced.",
    reportedBy: "Ali Hassan",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-002",
    eventType: "Eye Irritation",
    description: "Mud splash to eye during shale shaker maintenance. Chemical exposure to drilling fluid.",
    date: "2026-02-18",
    severity: "low",
    outcome: "Eye flushed with saline for 15 min. No lasting damage. Goggles compliance re-briefed.",
    reportedBy: "Khalid Mahmoud",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-003",
    eventType: "Laceration",
    description: "Hand laceration — 3cm cut on left palm during routine valve maintenance. Required 4 sutures.",
    date: "2026-02-14",
    severity: "medium",
    outcome: "Wound sutured, dressing applied. Light duties only for 5 days. Investigated — improper glove use.",
    reportedBy: "Ali Hassan",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-004",
    eventType: "Chest Pain",
    description: "Personnel reported chest discomfort and shortness of breath. Isolated, ECG performed.",
    date: "2026-02-12",
    severity: "high",
    outcome: "ECG normal — stress-related. Medivac not required. Rested for 24 hrs. Medical clearance before return.",
    reportedBy: "Dr. Samira Al-Masri",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-005",
    eventType: "Chemical Exposure",
    description: "Barite exposure to unprotected skin during chemical mixing operation. Skin irritation reported.",
    date: "2026-02-08",
    severity: "low",
    outcome: "Skin washed thoroughly. No lasting reaction. PPE compliance session held for mud team.",
    reportedBy: "Ali Hassan",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-006",
    eventType: "Sprain",
    description: "Ankle sprain — slipped on wet grating near shaker deck.",
    date: "2026-02-05",
    severity: "low",
    outcome: "RICE treatment applied. Anti-inflammatory prescribed. Returned to office duties. Slip-resistant mat installed.",
    reportedBy: "Dr. Samira Al-Masri",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-007",
    eventType: "Noise Complaint",
    description: "Personnel reported persistent tinnitus following extended work near generators without hearing protection.",
    date: "2026-01-28",
    severity: "medium",
    outcome: "Audiometric test conducted. Mild temporary threshold shift. Mandatory hearing protection in generator area enforced.",
    reportedBy: "Ali Hassan",
    status: "under_review",
  },
  {
    id: "CLINIC-HSE-008",
    eventType: "Fatigue",
    description: "Multiple crew members reported excessive fatigue — 16-hr consecutive work period during well control incident.",
    date: "2026-01-15",
    severity: "high",
    outcome: "Crew rotated. Fatigue management policy reviewed. Minimum rest periods enforced.",
    reportedBy: "Omar Hassan",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-009",
    eventType: "Back Strain",
    description: "Lower back strain reported during manual handling — lifting heavy BOP component without mechanical aid.",
    date: "2026-01-10",
    severity: "medium",
    outcome: "Physiotherapy exercises provided. Manual handling training refresher completed for affected crew.",
    reportedBy: "Dr. Samira Al-Masri",
    status: "closed",
  },
  {
    id: "CLINIC-HSE-010",
    eventType: "Heat Exhaustion",
    description: "Outdoor worker collapsed — core temperature elevated, dehydration. Emergency response initiated.",
    date: "2026-01-05",
    severity: "high",
    outcome: "IV fluids administered. Full recovery within 4 hours. Heat work plan updated. Work/rest ratio revised.",
    reportedBy: "Dr. Samira Al-Masri",
    status: "closed",
  },
];

const FIRST_AID_RECORDS: FirstAidRecord[] = [
  {
    id: "FA-2026-001",
    date: "2026-02-24",
    patient: "Jack Anderson",
    patientInitials: "JA",
    patientColor: "#546E7A",
    treatment: "Blister treatment — multiple blisters on fingers from extended manual pipe work. Cleaned, antibiotic cream, waterproof dressing applied.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Advised to wear inner gloves under outer mechanic gloves.",
    category: "minor",
  },
  {
    id: "FA-2026-002",
    date: "2026-02-22",
    patient: "Omar Hassan",
    patientInitials: "OH",
    patientColor: "#00897B",
    treatment: "Headache — stress / dehydration. Paracetamol 500mg x2 administered. Fluids encouraged.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "No adverse reactions. Returned to duty after 1 hour.",
    category: "minor",
  },
  {
    id: "FA-2026-003",
    date: "2026-02-18",
    patient: "Tariq Al-Shammari",
    patientInitials: "TS",
    patientColor: "#FF8F00",
    treatment: "Eye irrigation — drilling fluid splash. Saline irrigation x15 min. Antibiotic eye drops prescribed.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Follow-up in 24 hours. No vision impairment.",
    category: "moderate",
  },
  {
    id: "FA-2026-004",
    date: "2026-02-14",
    patient: "Ricardo Santos",
    patientInitials: "RS",
    patientColor: "#00838F",
    treatment: "Laceration suturing — 3cm cut on left palm. Wound cleaned, 4 sutures placed, tetanus check performed.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Sutures to be removed in 7 days. Light duties until then.",
    category: "moderate",
  },
  {
    id: "FA-2026-005",
    date: "2026-02-12",
    patient: "Mohammed Al-Dosari",
    patientInitials: "MD",
    patientColor: "#BF360C",
    treatment: "Contusion — bruising to right forearm from accidental contact with drill collar during pipe handling.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "X-ray negative. Ice applied. Anti-inflammatory given.",
    category: "minor",
  },
  {
    id: "FA-2026-006",
    date: "2026-02-08",
    patient: "Khalid Mahmoud",
    patientInitials: "KM",
    patientColor: "#0277BD",
    treatment: "Skin irritation — barite chemical exposure. Affected area washed, hydrocortisone cream applied.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Reactions subsided within 2 hours. Allergen noted in medical file.",
    category: "minor",
  },
  {
    id: "FA-2026-007",
    date: "2026-02-05",
    patient: "Emma Richards",
    patientInitials: "ER",
    patientColor: "#E91E63",
    treatment: "Ankle sprain — RICE (rest, ice, compression, elevation). Compression bandage applied.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Crutches provided. Light/office duties for 5 days.",
    category: "moderate",
  },
  {
    id: "FA-2026-008",
    date: "2026-01-28",
    patient: "Jack Anderson",
    patientInitials: "JA",
    patientColor: "#546E7A",
    treatment: "Tinnitus — temporary. Audiometric test performed. Ear protection reinforced.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Referred for full audiometric evaluation next rotation.",
    category: "moderate",
  },
  {
    id: "FA-2026-009",
    date: "2026-01-15",
    patient: "Ali Hassan",
    patientInitials: "AH",
    patientColor: "#2E7D32",
    treatment: "Fatigue — extreme exhaustion post-extended shift. Rest ordered, electrolyte replacement.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "8-hour mandatory rest before return to duties.",
    category: "minor",
  },
  {
    id: "FA-2026-010",
    date: "2026-01-10",
    patient: "Khalid Mahmoud",
    patientInitials: "KM",
    patientColor: "#0277BD",
    treatment: "Lower back strain — manual handling injury. Analgesic administered. Physiotherapy exercises given.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Manual handling refresher training scheduled.",
    category: "moderate",
  },
  {
    id: "FA-2026-011",
    date: "2026-01-05",
    patient: "Ricardo Santos",
    patientInitials: "RS",
    patientColor: "#00838F",
    treatment: "Heat exhaustion — IV fluids (1L normal saline), temperature monitoring, cooling measures.",
    administeredBy: "Dr. Samira Al-Masri",
    notes: "Full recovery. Heat work plan updated. 24-hour observation before return.",
    category: "serious",
  },
];

// ─── Column definitions ───────────────────────────────────────────────────────

function getResultConfig(result: string) {
  const MAP: Record<string, { color: string; bg: string }> = {
    pass: { color: "#059669", bg: "#ECFDF5" },
    fail: { color: "#DC2626", bg: "#FEF2F2" },
    conditional: { color: "#D97706", bg: "#FFFBEB" },
    pending: { color: "#2563EB", bg: "#EFF6FF" },
  };
  return MAP[result] ?? { color: "#64748B", bg: "#F1F5F9" };
}

function getSeverityConfig(sev: HSEEvent["severity"]) {
  const MAP: Record<HSEEvent["severity"], { color: string; bg: string }> = {
    critical: { color: "#DC2626", bg: "#FEF2F2" },
    high: { color: "#EA580C", bg: "#FFF7ED" },
    medium: { color: "#D97706", bg: "#FFFBEB" },
    low: { color: "#059669", bg: "#ECFDF5" },
  };
  return MAP[sev];
}

function getCategoryConfig(cat: FirstAidRecord["category"]) {
  const MAP: Record<FirstAidRecord["category"], { color: string; bg: string; label: string }> = {
    minor: { color: "#059669", bg: "#ECFDF5", label: "Minor" },
    moderate: { color: "#D97706", bg: "#FFFBEB", label: "Moderate" },
    serious: { color: "#DC2626", bg: "#FEF2F2", label: "Serious" },
  };
  return MAP[cat];
}

const MC_COLUMNS: Column<MedicalCheck>[] = [
  {
    key: "id",
    header: "ID",
    width: "120px",
    render: (v: string) => <span className="font-mono text-xs text-blue-700 font-semibold">{v}</span>,
  },
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (v: string, row: MedicalCheck) => (
      <div className="flex items-center gap-2">
        <AvatarCircle initials={row.initials} color={row.avatarColor} size="sm" />
        <span className="text-sm font-medium text-slate-800">{v}</span>
      </div>
    ),
  },
  {
    key: "checkType",
    header: "Type",
    sortable: true,
    render: (v: string) => <span className="text-sm text-slate-700">{v}</span>,
  },
  {
    key: "scheduledDate",
    header: "Date",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "result",
    header: "Result",
    sortable: true,
    width: "110px",
    render: (v: string) => {
      const cfg = getResultConfig(v);
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
          {v}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: MedicalCheck["status"]) => {
      const MAP: Record<MedicalCheck["status"], string> = {
        completed: "completed",
        scheduled: "planned",
        missed: "overdue",
        in_progress: "in_progress",
      };
      return <StatusBadge status={MAP[v] ?? v} size="sm" />;
    },
  },
  {
    key: "conductedBy",
    header: "Conducted By",
    width: "160px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "notes",
    header: "Notes",
    render: (v: string) => <span className="text-xs text-slate-500 line-clamp-2 max-w-xs block">{v}</span>,
  },
];

const HSE_COLUMNS: Column<HSEEvent>[] = [
  {
    key: "id",
    header: "ID",
    width: "140px",
    render: (v: string) => <span className="font-mono text-xs text-slate-600 font-semibold">{v}</span>,
  },
  {
    key: "eventType",
    header: "Event Type",
    sortable: true,
    width: "130px",
    render: (v: string) => <span className="text-sm font-medium text-slate-800">{v}</span>,
  },
  {
    key: "description",
    header: "Description",
    render: (v: string) => <span className="text-xs text-slate-600 line-clamp-2 max-w-[280px] block">{v}</span>,
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "severity",
    header: "Severity",
    sortable: true,
    width: "90px",
    render: (v: HSEEvent["severity"]) => {
      const cfg = getSeverityConfig(v);
      return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
          {v}
        </span>
      );
    },
  },
  {
    key: "outcome",
    header: "Outcome",
    render: (v: string) => <span className="text-xs text-slate-500 line-clamp-2 max-w-[200px] block">{v}</span>,
  },
  {
    key: "reportedBy",
    header: "Reported By",
    width: "140px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "110px",
    render: (v: HSEEvent["status"]) => {
      const MAP: Record<HSEEvent["status"], string> = {
        open: "open",
        closed: "closed",
        under_review: "in_review",
      };
      return <StatusBadge status={MAP[v] ?? v} size="sm" />;
    },
  },
];

const FA_COLUMNS: Column<FirstAidRecord>[] = [
  {
    key: "id",
    header: "ID",
    width: "120px",
    render: (v: string) => <span className="font-mono text-xs text-slate-600 font-semibold">{v}</span>,
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "110px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "patient",
    header: "Patient",
    sortable: true,
    render: (v: string, row: FirstAidRecord) => (
      <div className="flex items-center gap-2">
        <AvatarCircle initials={row.patientInitials} color={row.patientColor} size="sm" />
        <span className="text-sm font-medium text-slate-800">{v}</span>
      </div>
    ),
  },
  {
    key: "treatment",
    header: "Treatment",
    render: (v: string) => <span className="text-xs text-slate-600 line-clamp-2 max-w-[320px] block">{v}</span>,
  },
  {
    key: "administeredBy",
    header: "Administered By",
    width: "160px",
    render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    width: "100px",
    render: (v: FirstAidRecord["category"]) => {
      const cfg = getCategoryConfig(v);
      return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "notes",
    header: "Notes",
    render: (v: string) => <span className="text-xs text-slate-500 line-clamp-2 max-w-xs block">{v}</span>,
  },
];

// ─── Medical History Tab ──────────────────────────────────────────────────────

function MedicalHistoryTab() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return MEDICAL_HISTORY_PERSONS;
    return MEDICAL_HISTORY_PERSONS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Medical History</h3>
          <p className="text-sm text-slate-500 mt-0.5">Click on a person to expand their medical records</p>
        </div>
        <input
          type="text"
          placeholder="Search personnel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 rounded-md border border-slate-200 px-3 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((person) => {
          const isExpanded = expandedId === person.id;
          return (
            <div
              key={person.id}
              className="rounded-lg border border-slate-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : person.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <AvatarCircle initials={person.initials} color={person.avatarColor} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{person.name}</p>
                  <p className="text-xs text-slate-500">{person.role} — {person.company}</p>
                </div>
                <div className="flex items-center gap-4 mr-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Blood Group</p>
                    <p className="text-sm font-bold text-slate-700">{person.bloodGroup}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Records</p>
                    <p className="text-sm font-bold text-slate-700">{person.records.length}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="size-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="size-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex flex-col gap-2">
                    {person.records.map((rec, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-slate-200 bg-white p-3 flex items-start gap-3"
                      >
                        <div className="rounded-full bg-blue-50 p-1.5 mt-0.5 shrink-0">
                          <Heart className="size-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-semibold text-slate-700">{rec.type}</p>
                            <span className="text-xs text-slate-400">{rec.date}</span>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                getResultConfig(rec.result.toLowerCase()).color,
                              )}
                              style={{
                                color: getResultConfig(rec.result.toLowerCase()).color,
                                backgroundColor: getResultConfig(rec.result.toLowerCase()).bg,
                              }}
                            >
                              {rec.result}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{rec.notes}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Conducted by: {rec.conductedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "checks", label: "Medical Checks", icon: Stethoscope },
  { key: "history", label: "Medical History", icon: Heart },
  { key: "hse", label: "HSE Events", icon: AlertTriangle },
  { key: "firstaid", label: "First Aid", icon: Activity },
];

export default function ClinicPage() {
  const [activeTab, setActiveTab] = React.useState("checks");

  // Badge counts
  const scheduledChecks = MEDICAL_CHECKS.filter((c) => c.status === "scheduled").length;
  const openHseEvents = HSE_EVENTS.filter((e) => e.status !== "closed").length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Clinic</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Rig Alpha — Medical checks, health records &amp; HSE health events
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-center">
              <p className="text-xs text-blue-600 font-medium">Scheduled Medicals</p>
              <p className="text-lg font-bold text-blue-800">{scheduledChecks}</p>
            </div>
            {openHseEvents > 0 && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-center">
                <p className="text-xs text-amber-600 font-medium">Open HSE Events</p>
                <p className="text-lg font-bold text-amber-800">{openHseEvents}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation
        tabs={TABS.map((t) => ({
          key: t.key,
          label: t.label,
          badge:
            t.key === "checks" && scheduledChecks > 0 ? scheduledChecks :
            t.key === "hse" && openHseEvents > 0 ? openHseEvents :
            undefined,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="flex-1 bg-white">
        {activeTab === "checks" && (
          <div className="p-5">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800">Medical Checks Schedule</h3>
              <p className="text-sm text-slate-500 mt-0.5">{MEDICAL_CHECKS.length} records — ongoing and scheduled medical examinations</p>
            </div>
            <DataTable<MedicalCheck>
              data={MEDICAL_CHECKS}
              columns={MC_COLUMNS}
              searchPlaceholder="Search by name or check type..."
              searchKeys={["name", "checkType", "conductedBy"]}
              filters={[
                {
                  key: "result",
                  label: "Result",
                  options: [
                    { label: "Pass", value: "pass" },
                    { label: "Fail", value: "fail" },
                    { label: "Conditional", value: "conditional" },
                    { label: "Pending", value: "pending" },
                  ],
                },
                {
                  key: "status",
                  label: "Status",
                  options: [
                    { label: "Scheduled", value: "scheduled" },
                    { label: "In Progress", value: "in_progress" },
                    { label: "Completed", value: "completed" },
                    { label: "Missed", value: "missed" },
                  ],
                },
              ]}
              emptyMessage="No medical check records found."
              itemLabel="records"
              pageSize={10}
            />
          </div>
        )}

        {activeTab === "history" && <MedicalHistoryTab />}

        {activeTab === "hse" && (
          <div className="p-5">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800">HSE Health Events</h3>
              <p className="text-sm text-slate-500 mt-0.5">{HSE_EVENTS.length} recorded events — injuries, illnesses &amp; exposures</p>
            </div>
            <DataTable<HSEEvent>
              data={HSE_EVENTS}
              columns={HSE_COLUMNS}
              searchPlaceholder="Search events..."
              searchKeys={["eventType", "description", "reportedBy", "outcome"]}
              filters={[
                {
                  key: "severity",
                  label: "Severity",
                  options: [
                    { label: "Critical", value: "critical" },
                    { label: "High", value: "high" },
                    { label: "Medium", value: "medium" },
                    { label: "Low", value: "low" },
                  ],
                },
                {
                  key: "status",
                  label: "Status",
                  options: [
                    { label: "Open", value: "open" },
                    { label: "Under Review", value: "under_review" },
                    { label: "Closed", value: "closed" },
                  ],
                },
              ]}
              emptyMessage="No HSE events recorded."
              itemLabel="events"
              pageSize={10}
            />
          </div>
        )}

        {activeTab === "firstaid" && (
          <div className="p-5">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800">First Aid Log</h3>
              <p className="text-sm text-slate-500 mt-0.5">{FIRST_AID_RECORDS.length} recorded treatments</p>
            </div>
            <DataTable<FirstAidRecord>
              data={FIRST_AID_RECORDS}
              columns={FA_COLUMNS}
              searchPlaceholder="Search by patient or treatment..."
              searchKeys={["patient", "treatment", "administeredBy", "notes"]}
              filters={[
                {
                  key: "category",
                  label: "Category",
                  options: [
                    { label: "Minor", value: "minor" },
                    { label: "Moderate", value: "moderate" },
                    { label: "Serious", value: "serious" },
                  ],
                },
              ]}
              emptyMessage="No first aid records found."
              itemLabel="records"
              pageSize={10}
            />
          </div>
        )}
      </div>
    </div>
  );
}
