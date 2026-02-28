"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarCircle } from "@/components/shared/avatar-circle";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERSONNEL, PersonnelRecord } from "@/lib/dummy-data";
import { ONBOARDING_RECORDS } from "@/lib/dummy-data/onboarding";
import { LEAVE_REQUESTS, HR_ACTIONS } from "@/lib/dummy-data/hr";
import type { OnboardingRecord, LeaveRequest, HrAction, Room, RoomOccupant } from "@/lib/types/index";
import {
  Users,
  BedDouble,
  CalendarDays,
  Plus,
  CheckCheck,
  ClipboardList,
  Activity,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Bed,
  Building2,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const CURRENT_RIG_ID = "AD-201";
const CURRENT_RIG_NAME = "Rig Alpha";

// ─── Room Allocations Data ────────────────────────────────────────────────────

const ROOM_DATA: Room[] = [
  // Singles (101-106)
  {
    number: "101",
    type: "single",
    beds: 1,
    deck: "A Deck",
    occupants: [
      { name: "Omar Hassan", initials: "OH", color: "#00897B", personnelId: "PER-001" },
    ],
  },
  {
    number: "102",
    type: "single",
    beds: 1,
    deck: "A Deck",
    occupants: [
      { name: "Mohammed Al-Dosari", initials: "MD", color: "#BF360C", personnelId: "PER-002" },
    ],
  },
  {
    number: "103",
    type: "single",
    beds: 1,
    deck: "A Deck",
    occupants: [
      { name: "Khalid Mahmoud", initials: "KM", color: "#0277BD", personnelId: "PER-003" },
    ],
  },
  {
    number: "104",
    type: "single",
    beds: 1,
    deck: "A Deck",
    occupants: [],
  },
  {
    number: "105",
    type: "single",
    beds: 1,
    deck: "A Deck",
    occupants: [
      { name: "Emma Richards", initials: "ER", color: "#E91E63", personnelId: "PER-005" },
    ],
  },
  {
    number: "106",
    type: "single",
    beds: 1,
    deck: "A Deck",
    occupants: [],
  },
  // Doubles (201-208)
  {
    number: "201",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [
      { name: "Ali Hassan", initials: "AH", color: "#2E7D32", personnelId: "PER-004" },
      { name: "Jack Anderson", initials: "JA", color: "#546E7A", personnelId: "PER-006" },
    ],
  },
  {
    number: "202",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [
      { name: "Tariq Al-Shammari", initials: "TS", color: "#FF8F00", personnelId: "PER-007" },
    ],
  },
  {
    number: "203",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [
      { name: "Ricardo Santos", initials: "RS", color: "#00838F", personnelId: "PER-008" },
      { name: "Mohammed Al-Farsi", initials: "MF", color: "#7B1FA2", personnelId: "ONB-001" },
    ],
  },
  {
    number: "204",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [],
  },
  {
    number: "205",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [],
  },
  {
    number: "206",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [
      { name: "Sung-Jin Park", initials: "SP", color: "#1565C0", personnelId: "ONB-006" },
    ],
  },
  {
    number: "207",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [],
  },
  {
    number: "208",
    type: "double",
    beds: 2,
    deck: "B Deck",
    occupants: [],
  },
  // Quads (301-304)
  {
    number: "301",
    type: "quad",
    beds: 4,
    deck: "C Deck",
    occupants: [
      { name: "Ahmed Al-Rashid", initials: "AR", color: "#F4511E", personnelId: "PER-012" },
      { name: "Bjorn Andersen", initials: "BA", color: "#37474F", personnelId: "PER-013" },
    ],
  },
  {
    number: "302",
    type: "quad",
    beds: 4,
    deck: "C Deck",
    occupants: [],
  },
  {
    number: "303",
    type: "quad",
    beds: 4,
    deck: "C Deck",
    occupants: [],
  },
  {
    number: "304",
    type: "quad",
    beds: 4,
    deck: "C Deck",
    occupants: [],
  },
];

// ─── Manpower Schedule Data ───────────────────────────────────────────────────

interface RotationEntry {
  name: string;
  position: string;
  onStart: number;
  onEnd: number;
}

const ROTATION_SCHEDULE: RotationEntry[] = [
  { name: "Omar Hassan", position: "Rig Manager", onStart: 1, onEnd: 28 },
  { name: "Mohammed Al-Dosari", position: "Sr. Driller", onStart: 1, onEnd: 28 },
  { name: "Mohammed Al-Farsi", position: "Derrickman", onStart: 1, onEnd: 14 },
  { name: "Tariq Al-Shammari", position: "Driller", onStart: 1, onEnd: 14 },
  { name: "Jack Anderson", position: "Mud Logging Supervisor", onStart: 1, onEnd: 28 },
  { name: "Emma Richards", position: "Quality Engineer", onStart: 15, onEnd: 28 },
  { name: "Ali Hassan", position: "HSE Officer", onStart: 1, onEnd: 28 },
  { name: "Khalid Mahmoud", position: "Maintenance Manager", onStart: 1, onEnd: 14 },
  { name: "Ricardo Santos", position: "Field Service Engineer", onStart: 1, onEnd: 10 },
  { name: "Sung-Jin Park", position: "Subsea Engineer", onStart: 20, onEnd: 28 },
];

function isPersonOnRig(entry: RotationEntry, day: number): boolean {
  return day >= entry.onStart && day <= entry.onEnd;
}

// ─── Helper: initials from name ──────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// ─── Avatar colors for onboarding records ────────────────────────────────────

const AVATAR_COLORS = [
  "#00897B", "#BF360C", "#0277BD", "#2E7D32", "#E91E63",
  "#546E7A", "#FF8F00", "#00838F", "#7B1FA2", "#F4511E",
];

function getOnbColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// ─── Training/Medical status badge ───────────────────────────────────────────

type TaskStatusType = "not_created" | "pending" | "in_progress" | "completed";

function TaskStatusBadge({ status }: { status: TaskStatusType }) {
  const config: Record<TaskStatusType, { label: string; cls: string }> = {
    not_created: { label: "Not Created", cls: "bg-slate-100 text-slate-500" },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700" },
    in_progress: { label: "In Progress", cls: "bg-blue-50 text-blue-700" },
    completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700" },
  };
  const { label, cls } = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", cls)}>
      {label}
    </span>
  );
}

// ─── Onboarding pipeline badge ────────────────────────────────────────────────

type OnboardingStatus =
  | "pending_info"
  | "info_submitted"
  | "tasks_created"
  | "training_complete"
  | "medical_complete"
  | "ready_for_checkin"
  | "checked_in";

function OnboardingStatusBadge({ status }: { status: OnboardingStatus }) {
  const config: Record<OnboardingStatus, { label: string; cls: string }> = {
    pending_info: { label: "Pending Info", cls: "bg-slate-100 text-slate-500" },
    info_submitted: { label: "Info Submitted", cls: "bg-violet-50 text-violet-700" },
    tasks_created: { label: "Tasks Created", cls: "bg-blue-50 text-blue-700" },
    training_complete: { label: "Training Done", cls: "bg-indigo-50 text-indigo-700" },
    medical_complete: { label: "Medical Done", cls: "bg-teal-50 text-teal-700" },
    ready_for_checkin: { label: "Ready for Check-In", cls: "bg-amber-50 text-amber-700" },
    checked_in: { label: "Checked In", cls: "bg-emerald-50 text-emerald-700" },
  };
  const { label, cls } = config[status] ?? { label: status, cls: "bg-slate-100 text-slate-500" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", cls)}>
      {label}
    </span>
  );
}

// ─── Leave type badge ─────────────────────────────────────────────────────────

function LeaveTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    annual: { label: "Annual", cls: "bg-blue-50 text-blue-700" },
    sick: { label: "Sick", cls: "bg-amber-50 text-amber-700" },
    emergency: { label: "Emergency", cls: "bg-red-50 text-red-700" },
    compassionate: { label: "Compassionate", cls: "bg-purple-50 text-purple-700" },
    unpaid: { label: "Unpaid", cls: "bg-slate-100 text-slate-600" },
  };
  const { label, cls } = config[type] ?? { label: type, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", cls)}>
      {label}
    </span>
  );
}

// ─── HR Action type badge ─────────────────────────────────────────────────────

function HrActionBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    promotion: { label: "Promotion", cls: "bg-emerald-50 text-emerald-700" },
    demotion: { label: "Demotion", cls: "bg-amber-50 text-amber-700" },
    transfer: { label: "Transfer", cls: "bg-blue-50 text-blue-700" },
    termination: { label: "Termination", cls: "bg-red-50 text-red-700" },
    warning: { label: "Warning", cls: "bg-orange-50 text-orange-700" },
  };
  const { label, cls } = config[type] ?? { label: type, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", cls)}>
      {label}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  color = "blue",
  icon: Icon,
}: {
  label: string;
  value: number | string;
  color?: "blue" | "emerald" | "amber" | "red" | "slate" | "violet";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    red: "bg-red-50 border-red-200 text-red-700",
    slate: "bg-slate-50 border-slate-200 text-slate-600",
    violet: "bg-violet-50 border-violet-200 text-violet-700",
  };
  const valueMap = {
    blue: "text-blue-800",
    emerald: "text-emerald-800",
    amber: "text-amber-800",
    red: "text-red-800",
    slate: "text-slate-700",
    violet: "text-violet-800",
  };
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-center min-w-[110px]", colorMap[color])}>
      {Icon && <Icon className={cn("size-4 mx-auto mb-1", colorMap[color].split(" ").slice(2).join(" "))} />}
      <p className={cn("text-xs font-medium", colorMap[color].split(" ").slice(2).join(" "))}>{label}</p>
      <p className={cn("text-2xl font-bold mt-0.5", valueMap[color])}>{value}</p>
    </div>
  );
}

// ─── Tab 1: Onboarding ────────────────────────────────────────────────────────

function OnboardingTab() {
  const [records, setRecords] = React.useState<OnboardingRecord[]>(ONBOARDING_RECORDS);
  const [newArrivalOpen, setNewArrivalOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    company: "",
    role: "",
    nationality: "",
    passportNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    arrivalDate: "",
  });

  function handleFormChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmitArrival() {
    if (!form.name.trim() || !form.company.trim()) return;
    const newRecord: OnboardingRecord = {
      id: `ONB-${String(records.length + 1).padStart(3, "0")}`,
      name: form.name,
      company: form.company,
      role: form.role,
      nationality: form.nationality,
      passportNumber: form.passportNumber,
      emergencyContact: form.emergencyContact,
      emergencyPhone: form.emergencyPhone,
      arrivalDate: form.arrivalDate || new Date().toISOString().slice(0, 10),
      status: "pending_info",
      trainingTaskId: null,
      trainingStatus: "not_created",
      trainingAssignedTo: null,
      medicalTaskId: null,
      medicalStatus: "not_created",
      medicalAssignedTo: null,
      rigId: CURRENT_RIG_ID,
    };
    setRecords((prev) => [newRecord, ...prev]);
    setForm({ name: "", company: "", role: "", nationality: "", passportNumber: "", emergencyContact: "", emergencyPhone: "", arrivalDate: "" });
    setNewArrivalOpen(false);
  }

  function createTasks(id: string) {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "tasks_created" as OnboardingStatus,
              trainingTaskId: `TSK-ONB-${id}`,
              trainingStatus: "pending" as const,
              trainingAssignedTo: "usr-hse-001",
              medicalTaskId: `TSK-MED-${id}`,
              medicalStatus: "pending" as const,
              medicalAssignedTo: "usr-med-001",
            }
          : r
      )
    );
  }

  function checkIn(id: string) {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "checked_in" as OnboardingStatus } : r
      )
    );
  }

  const totalPending = records.filter((r) => r.status !== "checked_in").length;
  const trainingPending = records.filter(
    (r) => r.trainingStatus === "pending" || r.trainingStatus === "in_progress"
  ).length;
  const medicalPending = records.filter(
    (r) => r.medicalStatus === "pending" || r.medicalStatus === "in_progress"
  ).length;
  const readyForCheckIn = records.filter((r) => r.status === "ready_for_checkin").length;

  const COLUMNS: Column<OnboardingRecord>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (v: string, row: OnboardingRecord) => (
        <div className="flex items-center gap-2.5">
          <AvatarCircle
            initials={getInitials(v)}
            color={getOnbColor(records.indexOf(row))}
            size="sm"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">{v}</p>
            <p className="text-xs text-slate-400">{row.nationality}</p>
          </div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      sortable: true,
      render: (v: string) => <span className="text-sm text-slate-700">{v}</span>,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      key: "arrivalDate",
      header: "Arrival",
      sortable: true,
      width: "110px",
      render: (v: string) => <span className="text-xs font-mono text-slate-600">{v}</span>,
    },
    {
      key: "trainingStatus",
      header: "Training",
      width: "130px",
      render: (v: string) => <TaskStatusBadge status={v as TaskStatusType} />,
    },
    {
      key: "medicalStatus",
      header: "Medical",
      width: "130px",
      render: (v: string) => <TaskStatusBadge status={v as TaskStatusType} />,
    },
    {
      key: "status",
      header: "Pipeline Status",
      width: "160px",
      render: (v: string) => <OnboardingStatusBadge status={v as OnboardingStatus} />,
    },
    {
      key: "_actions",
      header: "Actions",
      width: "140px",
      render: (_: unknown, row: OnboardingRecord) => {
        if (row.status === "info_submitted") {
          return (
            <Button
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={(e) => { e.stopPropagation(); createTasks(row.id); }}
            >
              <ClipboardList className="size-3" /> Create Tasks
            </Button>
          );
        }
        if (row.status === "ready_for_checkin") {
          return (
            <Button
              size="sm"
              className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={(e) => { e.stopPropagation(); checkIn(row.id); }}
            >
              <UserCheck className="size-3" /> Check In
            </Button>
          );
        }
        if (row.status === "checked_in") {
          return <span className="text-xs text-emerald-600 font-medium">Onboarded</span>;
        }
        return <span className="text-xs text-slate-400">—</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* KPI Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <KpiCard label="Total Pending" value={totalPending} color="slate" />
        <KpiCard label="Training Pending" value={trainingPending} color="amber" />
        <KpiCard label="Medical Pending" value={medicalPending} color="red" />
        <KpiCard label="Ready for Check-In" value={readyForCheckIn} color="emerald" />
        <div className="ml-auto">
          <Dialog open={newArrivalOpen} onOpenChange={setNewArrivalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5">
                <Plus className="size-4" /> New Arrival
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Arrival</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-name" className="text-xs">Full Name</Label>
                    <Input id="arr-name" placeholder="e.g. John Smith" className="h-8 text-sm" value={form.name} onChange={(e) => handleFormChange("name", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-company" className="text-xs">Company</Label>
                    <Input id="arr-company" placeholder="e.g. Halliburton" className="h-8 text-sm" value={form.company} onChange={(e) => handleFormChange("company", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-role" className="text-xs">Role / Position</Label>
                    <Input id="arr-role" placeholder="e.g. MWD Engineer" className="h-8 text-sm" value={form.role} onChange={(e) => handleFormChange("role", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-nat" className="text-xs">Nationality</Label>
                    <Input id="arr-nat" placeholder="e.g. American" className="h-8 text-sm" value={form.nationality} onChange={(e) => handleFormChange("nationality", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-passport" className="text-xs">Passport Number</Label>
                    <Input id="arr-passport" placeholder="e.g. US1234567" className="h-8 text-sm" value={form.passportNumber} onChange={(e) => handleFormChange("passportNumber", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-date" className="text-xs">Arrival Date</Label>
                    <Input id="arr-date" type="date" className="h-8 text-sm" value={form.arrivalDate} onChange={(e) => handleFormChange("arrivalDate", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-ec" className="text-xs">Emergency Contact</Label>
                    <Input id="arr-ec" placeholder="Contact name" className="h-8 text-sm" value={form.emergencyContact} onChange={(e) => handleFormChange("emergencyContact", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="arr-phone" className="text-xs">Emergency Phone</Label>
                    <Input id="arr-phone" placeholder="+1-555-000-0000" className="h-8 text-sm" value={form.emergencyPhone} onChange={(e) => handleFormChange("emergencyPhone", e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setNewArrivalOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSubmitArrival} disabled={!form.name.trim() || !form.company.trim()}>
                  Register Arrival
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <DataTable<OnboardingRecord>
        data={records}
        columns={COLUMNS}
        searchPlaceholder="Search name, company or role..."
        searchKeys={["name", "company", "role", "nationality"]}
        emptyMessage="No onboarding records found."
        itemLabel="arrivals"
        pageSize={10}
      />
    </div>
  );
}

// ─── Tab 2: Room Allocations ──────────────────────────────────────────────────

function RoomAllocationsTab() {
  const [rooms, setRooms] = React.useState<Room[]>(ROOM_DATA);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);

  const totalBeds = rooms.reduce((sum, r) => sum + r.beds, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupants.length, 0);
  const availableBeds = totalBeds - occupiedBeds;

  function getRoomBorderClass(room: Room): string {
    const ratio = room.occupants.length / room.beds;
    if (ratio === 0) return "border-emerald-200 bg-emerald-50/30";
    if (ratio < 1) return "border-blue-200 bg-blue-50/30";
    return "border-amber-300 bg-amber-50/30";
  }

  function getRoomDotClass(room: Room): string {
    const ratio = room.occupants.length / room.beds;
    if (ratio === 0) return "bg-emerald-400";
    if (ratio < 1) return "bg-blue-400";
    return "bg-amber-400";
  }

  function roomTypeLabel(type: string): string {
    return type === "single" ? "Single" : type === "double" ? "Double" : "Quad";
  }

  function removeOccupant(roomNumber: string, personnelId: string) {
    setRooms((prev) =>
      prev.map((r) =>
        r.number === roomNumber
          ? { ...r, occupants: r.occupants.filter((o) => o.personnelId !== personnelId) }
          : r
      )
    );
    setSelectedRoom((prev) =>
      prev && prev.number === roomNumber
        ? { ...prev, occupants: prev.occupants.filter((o) => o.personnelId !== personnelId) }
        : prev
    );
  }

  const ROOM_TYPE_ICON_MAP: Record<string, React.ReactNode> = {
    single: <Bed className="size-3 text-slate-400" />,
    double: <Bed className="size-3 text-slate-400" />,
    quad: <Bed className="size-3 text-slate-400" />,
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Summary cards */}
      <div className="flex items-center gap-3 flex-wrap">
        <KpiCard label="Total Rooms" value={rooms.length} color="blue" />
        <KpiCard label="Occupied Beds" value={`${occupiedBeds} / ${totalBeds}`} color="amber" />
        <KpiCard label="Available Beds" value={availableBeds} color="emerald" />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />Vacant</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-400 inline-block" />Partially Occupied</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />Full</span>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {rooms.map((room) => {
          const isSelected = selectedRoom?.number === room.number;
          return (
            <button
              key={room.number}
              type="button"
              onClick={() => setSelectedRoom(isSelected ? null : room)}
              className={cn(
                "rounded-lg border p-3 text-left transition-all duration-150",
                "flex flex-col gap-2 hover:shadow-md focus:outline-none",
                isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "",
                getRoomBorderClass(room)
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Room {room.number}</span>
                <span className={cn("h-2 w-2 rounded-full", getRoomDotClass(room))} />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                {ROOM_TYPE_ICON_MAP[room.type]}
                {roomTypeLabel(room.type)}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {room.occupants.length}/{room.beds} occupied
              </p>
              <div className="flex flex-wrap gap-0.5">
                {room.occupants.slice(0, 2).map((o) => (
                  <AvatarCircle key={o.personnelId} initials={o.initials} color={o.color} size="xs" title={o.name} />
                ))}
                {room.occupants.length > 2 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[9px] font-semibold text-slate-600">
                    +{room.occupants.length - 2}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected room detail panel */}
      {selectedRoom && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-blue-800">
                Room {selectedRoom.number} — {roomTypeLabel(selectedRoom.type)} ({selectedRoom.deck})
              </h4>
              <p className="text-xs text-blue-600 mt-0.5">
                {selectedRoom.occupants.length} of {selectedRoom.beds} bed(s) occupied
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="text-blue-400 hover:text-blue-600 text-xs font-medium"
            >
              Close
            </button>
          </div>

          <div className="grid gap-2">
            {Array.from({ length: selectedRoom.beds }).map((_, idx) => {
              const occupant: RoomOccupant | undefined = selectedRoom.occupants[idx];
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-blue-100 bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-slate-400 font-mono w-12">Bed {idx + 1}</span>
                    {occupant ? (
                      <>
                        <AvatarCircle initials={occupant.initials} color={occupant.color} size="sm" />
                        <span className="text-sm font-medium text-slate-800">{occupant.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Vacant</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {occupant ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => removeOccupant(selectedRoom.number, occupant.personnelId)}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: POB ───────────────────────────────────────────────────────────────

function POBTab() {
  const rigPersonnel = PERSONNEL.filter(
    (p) => p.rigId === CURRENT_RIG_ID && p.status === "onboard"
  );
  const onboardedArrivals = ONBOARDING_RECORDS.filter(
    (r) => r.status === "checked_in" && r.rigId === CURRENT_RIG_ID
  );

  const byCompany = rigPersonnel.reduce<Record<string, number>>((acc, p) => {
    acc[p.company] = (acc[p.company] ?? 0) + 1;
    return acc;
  }, {});

  const byDept = rigPersonnel.reduce<Record<string, number>>((acc, p) => {
    acc[p.department] = (acc[p.department] ?? 0) + 1;
    return acc;
  }, {});

  const COLUMNS: Column<PersonnelRecord>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (v: string, row: PersonnelRecord) => (
        <div className="flex items-center gap-2.5">
          <AvatarCircle initials={row.initials} color={row.avatarColor} size="sm" />
          <div>
            <p className="text-sm font-medium text-slate-800">{v}</p>
            <p className="text-xs text-slate-400">{row.employeeId ?? row.vendorId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "jobTitle",
      header: "Role",
      sortable: true,
      render: (v: string) => <span className="text-sm text-slate-700">{v}</span>,
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
      width: "150px",
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      key: "company",
      header: "Company",
      sortable: true,
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      key: "nationality",
      header: "Nationality",
      sortable: true,
      width: "120px",
      render: (v: string) => <span className="text-xs text-slate-600">{v}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
      render: (v: string) => <StatusBadge status={v} size="sm" />,
    },
  ];

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total POB</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{rigPersonnel.length + onboardedArrivals.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {rigPersonnel.length} regular + {onboardedArrivals.length} recent arrivals
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="size-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">By Company</span>
          </div>
          <div className="flex flex-col gap-1">
            {Object.entries(byCompany).slice(0, 4).map(([company, count]) => (
              <div key={company} className="flex items-center justify-between">
                <span className="text-xs text-slate-600 truncate max-w-[170px]">{company}</span>
                <span className="text-xs font-bold text-slate-800 ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">By Department</span>
          </div>
          <div className="flex flex-col gap-1">
            {Object.entries(byDept).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{dept}</span>
                <span className="text-xs font-bold text-slate-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personnel table */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Full Personnel List</h3>
        <DataTable<PersonnelRecord>
          data={rigPersonnel}
          columns={COLUMNS}
          searchPlaceholder="Search name, role, company..."
          searchKeys={["name", "jobTitle", "department", "company", "nationality"]}
          emptyMessage="No personnel on board."
          itemLabel="personnel"
          pageSize={10}
        />
      </div>
    </div>
  );
}

// ─── Tab 4: Manpower Scheduling (Monthly Gantt) ───────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function ManpowerSchedulingTab() {
  const [year, setYear] = React.useState(2026);
  const [month, setMonth] = React.useState(1); // 0-indexed, 1 = February

  const daysInMonth = getDaysInMonth(month, year);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  // Check if a position has any coverage gap in current month
  function hasCoverageGap(entry: RotationEntry): boolean {
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return days.some((d) => !isPersonOnRig(entry, d));
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Manpower Schedule</h3>
          <p className="text-sm text-slate-500 mt-0.5">Monthly rotation Gantt — {MONTHS[month]} {year}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-medium text-slate-700 w-36 text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-6 rounded bg-emerald-200 border border-emerald-300 inline-block" />ON
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-6 rounded bg-slate-100 border border-slate-200 inline-block" />OFF
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-6 rounded bg-red-100 border border-red-300 inline-block" />Gap (No Coverage)
        </span>
      </div>

      {/* Gantt table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th
                className="sticky left-0 z-10 bg-slate-50 px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap border-r border-slate-200"
                style={{ minWidth: "180px" }}
              >
                Personnel / Position
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <th
                  key={day}
                  className="px-1 py-2.5 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wide"
                  style={{ minWidth: "28px", width: "28px" }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROTATION_SCHEDULE.map((entry, idx) => (
              <tr
                key={entry.name}
                className={cn(
                  "border-b border-slate-100 last:border-0",
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                )}
              >
                <td
                  className="sticky left-0 z-10 bg-inherit px-3 py-2 border-r border-slate-100 whitespace-nowrap"
                  style={{ minWidth: "180px" }}
                >
                  <p className="text-xs font-semibold text-slate-800">{entry.name}</p>
                  <p className="text-[10px] text-slate-400">{entry.position}</p>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const on = isPersonOnRig(entry, day);
                  return (
                    <td
                      key={day}
                      className="p-0.5 text-center"
                      style={{ minWidth: "28px", width: "28px" }}
                    >
                      <div
                        className={cn(
                          "rounded text-[9px] font-bold leading-none py-1",
                          on
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        )}
                      >
                        {on ? "ON" : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coverage warnings */}
      {ROTATION_SCHEDULE.some((e) => hasCoverageGap(e)) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-800 mb-1.5">Coverage Gaps This Month</p>
          <div className="flex flex-wrap gap-2">
            {ROTATION_SCHEDULE.filter((e) => hasCoverageGap(e)).map((e) => (
              <span key={e.name} className="inline-flex items-center rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-xs text-amber-700">
                {e.position} — {e.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 5: HR Activities ─────────────────────────────────────────────────────

function HRActivitiesTab() {
  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>(LEAVE_REQUESTS);
  const [hrActions, setHrActions] = React.useState<HrAction[]>(HR_ACTIONS);
  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false);

  const [leaveForm, setLeaveForm] = React.useState({
    employeeName: "",
    leaveType: "annual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [actionForm, setActionForm] = React.useState({
    employeeName: "",
    actionType: "promotion",
    fromPosition: "",
    toPosition: "",
    effectiveDate: "",
    description: "",
  });

  function calcDays(start: string, end: string): number {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.round(diff / 86400000) + 1);
  }

  function submitLeave() {
    if (!leaveForm.employeeName.trim() || !leaveForm.startDate) return;
    const newReq: LeaveRequest = {
      id: `LVR-${String(leaveRequests.length + 1).padStart(3, "0")}`,
      employeeId: "ADI-EMP-0000",
      employeeName: leaveForm.employeeName,
      leaveType: leaveForm.leaveType as LeaveRequest["leaveType"],
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate || leaveForm.startDate,
      days: calcDays(leaveForm.startDate, leaveForm.endDate || leaveForm.startDate),
      reason: leaveForm.reason,
      status: "pending",
      approvedBy: null,
      submittedDate: new Date().toISOString().slice(0, 10),
      rigId: CURRENT_RIG_ID,
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
    setLeaveForm({ employeeName: "", leaveType: "annual", startDate: "", endDate: "", reason: "" });
    setLeaveDialogOpen(false);
  }

  function submitAction() {
    if (!actionForm.employeeName.trim() || !actionForm.effectiveDate) return;
    const newAction: HrAction = {
      id: `HRA-${String(hrActions.length + 1).padStart(3, "0")}`,
      employeeId: "ADI-EMP-0000",
      employeeName: actionForm.employeeName,
      actionType: actionForm.actionType as HrAction["actionType"],
      effectiveDate: actionForm.effectiveDate,
      description: actionForm.description,
      fromPosition: actionForm.fromPosition,
      toPosition: actionForm.toPosition,
      status: "pending",
      initiatedBy: "Current User",
      initiatedDate: new Date().toISOString().slice(0, 10),
      rigId: CURRENT_RIG_ID,
    };
    setHrActions((prev) => [newAction, ...prev]);
    setActionForm({ employeeName: "", actionType: "promotion", fromPosition: "", toPosition: "", effectiveDate: "", description: "" });
    setActionDialogOpen(false);
  }

  const LEAVE_COLUMNS: Column<LeaveRequest>[] = [
    {
      key: "employeeName",
      header: "Employee",
      sortable: true,
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <AvatarCircle initials={getInitials(v)} color="#1E3A5F" size="sm" />
          <span className="text-sm font-medium text-slate-800">{v}</span>
        </div>
      ),
    },
    {
      key: "leaveType",
      header: "Type",
      width: "130px",
      render: (v: string) => <LeaveTypeBadge type={v} />,
    },
    {
      key: "startDate",
      header: "Start Date",
      sortable: true,
      width: "110px",
      render: (v: string) => <span className="text-xs font-mono text-slate-600">{v}</span>,
    },
    {
      key: "endDate",
      header: "End Date",
      width: "110px",
      render: (v: string) => <span className="text-xs font-mono text-slate-600">{v}</span>,
    },
    {
      key: "days",
      header: "Days",
      width: "70px",
      render: (v: number) => (
        <span className="text-sm font-semibold text-slate-700">{v}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "110px",
      render: (v: string) => <StatusBadge status={v} size="sm" />,
    },
    {
      key: "submittedDate",
      header: "Submitted",
      sortable: true,
      width: "110px",
      render: (v: string) => <span className="text-xs font-mono text-slate-500">{v}</span>,
    },
  ];

  const ACTION_COLUMNS: Column<HrAction>[] = [
    {
      key: "employeeName",
      header: "Employee",
      sortable: true,
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <AvatarCircle initials={getInitials(v)} color="#1E3A5F" size="sm" />
          <span className="text-sm font-medium text-slate-800">{v}</span>
        </div>
      ),
    },
    {
      key: "actionType",
      header: "Action Type",
      width: "130px",
      render: (v: string) => <HrActionBadge type={v} />,
    },
    {
      key: "fromPosition",
      header: "From Position",
      render: (v: string) => <span className="text-xs text-slate-600 line-clamp-2">{v || "—"}</span>,
    },
    {
      key: "toPosition",
      header: "To Position",
      render: (v: string) => <span className="text-xs text-slate-700 font-medium line-clamp-2">{v || "—"}</span>,
    },
    {
      key: "effectiveDate",
      header: "Effective Date",
      sortable: true,
      width: "120px",
      render: (v: string) => <span className="text-xs font-mono text-slate-600">{v}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "110px",
      render: (v: string) => <StatusBadge status={v} size="sm" />,
    },
  ];

  return (
    <div className="p-5 flex flex-col gap-8">
      {/* Leave Requests */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Leave Requests</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {leaveRequests.filter((r) => r.status === "pending").length} pending approval
            </p>
          </div>
          <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5">
                <Plus className="size-4" /> Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Leave Request</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lv-emp" className="text-xs">Employee Name</Label>
                  <Input id="lv-emp" placeholder="Full name" className="h-8 text-sm" value={leaveForm.employeeName} onChange={(e) => setLeaveForm((p) => ({ ...p, employeeName: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lv-type" className="text-xs">Leave Type</Label>
                  <Select value={leaveForm.leaveType} onValueChange={(v) => setLeaveForm((p) => ({ ...p, leaveType: v }))}>
                    <SelectTrigger id="lv-type" className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="sick">Sick</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="compassionate">Compassionate</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lv-start" className="text-xs">Start Date</Label>
                    <Input id="lv-start" type="date" className="h-8 text-sm" value={leaveForm.startDate} onChange={(e) => setLeaveForm((p) => ({ ...p, startDate: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lv-end" className="text-xs">End Date</Label>
                    <Input id="lv-end" type="date" className="h-8 text-sm" value={leaveForm.endDate} onChange={(e) => setLeaveForm((p) => ({ ...p, endDate: e.target.value }))} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lv-reason" className="text-xs">Reason</Label>
                  <Input id="lv-reason" placeholder="Brief reason for leave" className="h-8 text-sm" value={leaveForm.reason} onChange={(e) => setLeaveForm((p) => ({ ...p, reason: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={submitLeave} disabled={!leaveForm.employeeName.trim() || !leaveForm.startDate}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable<LeaveRequest>
          data={leaveRequests}
          columns={LEAVE_COLUMNS}
          searchPlaceholder="Search employee or leave type..."
          searchKeys={["employeeName", "leaveType", "status"]}
          emptyMessage="No leave requests found."
          itemLabel="leave requests"
          pageSize={5}
        />
      </section>

      {/* Employee Actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Employee Actions</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Promotions, transfers, warnings and other HR actions
            </p>
          </div>
          <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 gap-1.5">
                <Plus className="size-4" /> New Action
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create HR Action</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ac-emp" className="text-xs">Employee Name</Label>
                  <Input id="ac-emp" placeholder="Full name" className="h-8 text-sm" value={actionForm.employeeName} onChange={(e) => setActionForm((p) => ({ ...p, employeeName: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ac-type" className="text-xs">Action Type</Label>
                  <Select value={actionForm.actionType} onValueChange={(v) => setActionForm((p) => ({ ...p, actionType: v }))}>
                    <SelectTrigger id="ac-type" className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="demotion">Demotion</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="termination">Termination</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ac-from" className="text-xs">From Position</Label>
                    <Input id="ac-from" placeholder="Current position" className="h-8 text-sm" value={actionForm.fromPosition} onChange={(e) => setActionForm((p) => ({ ...p, fromPosition: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ac-to" className="text-xs">To Position</Label>
                    <Input id="ac-to" placeholder="New position" className="h-8 text-sm" value={actionForm.toPosition} onChange={(e) => setActionForm((p) => ({ ...p, toPosition: e.target.value }))} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ac-date" className="text-xs">Effective Date</Label>
                  <Input id="ac-date" type="date" className="h-8 text-sm" value={actionForm.effectiveDate} onChange={(e) => setActionForm((p) => ({ ...p, effectiveDate: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ac-desc" className="text-xs">Description</Label>
                  <Input id="ac-desc" placeholder="Brief description" className="h-8 text-sm" value={actionForm.description} onChange={(e) => setActionForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={submitAction} disabled={!actionForm.employeeName.trim() || !actionForm.effectiveDate}>
                  Create Action
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable<HrAction>
          data={hrActions}
          columns={ACTION_COLUMNS}
          searchPlaceholder="Search employee or action type..."
          searchKeys={["employeeName", "actionType", "fromPosition", "toPosition", "status"]}
          emptyMessage="No HR actions found."
          itemLabel="actions"
          pageSize={5}
        />
      </section>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "onboarding", label: "Onboarding" },
  { key: "rooms", label: "Room Allocations" },
  { key: "pob", label: "POB" },
  { key: "schedule", label: "Manpower Scheduling" },
  { key: "hr", label: "HR Activities" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = React.useState("onboarding");

  const rigPersonnel = PERSONNEL.filter(
    (p) => p.rigId === CURRENT_RIG_ID && p.status === "onboard"
  );
  const onboardedArrivals = ONBOARDING_RECORDS.filter(
    (r) => r.status === "checked_in" && r.rigId === CURRENT_RIG_ID
  );
  const totalPOB = rigPersonnel.length + onboardedArrivals.length;
  const pendingOnboarding = ONBOARDING_RECORDS.filter(
    (r) => r.status !== "checked_in" && r.rigId === CURRENT_RIG_ID
  ).length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {CURRENT_RIG_NAME} — Onboarding, room allocations, POB & HR
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-center">
              <p className="text-xs text-emerald-600 font-medium">Total POB</p>
              <p className="text-lg font-bold text-emerald-800">{totalPOB}</p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-center">
              <p className="text-xs text-amber-700 font-medium">Pending Onboarding</p>
              <p className="text-lg font-bold text-amber-800">{pendingOnboarding}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab content */}
      <div className="flex-1 bg-white">
        {activeTab === "onboarding" && <OnboardingTab />}
        {activeTab === "rooms" && <RoomAllocationsTab />}
        {activeTab === "pob" && <POBTab />}
        {activeTab === "schedule" && <ManpowerSchedulingTab />}
        {activeTab === "hr" && <HRActivitiesTab />}
      </div>
    </div>
  );
}
