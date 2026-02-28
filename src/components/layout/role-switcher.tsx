"use client";

import * as React from "react";
import { ChevronDown, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/user-store";
import type { User } from "@/lib/types/index";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// ─── Persona config ──────────────────────────────────────────────────────────

interface PersonaConfig {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
  user: User;
}

const PERSONA_CONFIGS: PersonaConfig[] = [
  {
    id: "employee",
    label: "Employee",
    color: "#64748B",
    bgColor: "#F1F5F9",
    description: "Regular rig worker",
    user: {
      id: "usr-emp-001",
      name: "Ahmed Al-Rashid",
      initials: "AA",
      email: "ahmed.alrashid@myhp.com",
      role: "employee",
      department: "rig_operations",
      rigAssignment: "rig-alpha",
      avatarColor: "#64748B",
      jobTitle: "Driller",
    },
  },
  {
    id: "rig_manager",
    label: "Rig Manager",
    color: "#1E40AF",
    bgColor: "#EFF6FF",
    description: "Oversees rig site operations",
    user: {
      id: "usr-rm-001",
      name: "Emma Richards",
      initials: "ER",
      email: "emma.richards@myhp.com",
      role: "rig_manager",
      department: "rig_operations",
      rigAssignment: "rig-alpha",
      avatarColor: "#1E3A5F",
      jobTitle: "Rig Manager",
    },
  },
  {
    id: "quality_manager",
    label: "Quality Manager",
    color: "#0891B2",
    bgColor: "#ECFEFF",
    description: "Manages quality department",
    user: {
      id: "usr-dm-001",
      name: "Sarah Johnson",
      initials: "SJ",
      email: "sarah.johnson@myhp.com",
      role: "department_manager",
      department: "quality",
      rigAssignment: "rig-alpha",
      avatarColor: "#0E7490",
      jobTitle: "Quality Manager",
    },
  },
  {
    id: "logistics_manager",
    label: "Logistics Manager",
    color: "#0D9488",
    bgColor: "#F0FDFA",
    description: "Manages logistics & rig moves",
    user: {
      id: "usr-lm-001",
      name: "Khalid Al-Mansour",
      initials: "KM",
      email: "khalid.almansour@myhp.com",
      role: "department_manager",
      department: "logistics",
      rigAssignment: "rig-alpha",
      avatarColor: "#0F766E",
      jobTitle: "Logistics Manager",
    },
  },
  {
    id: "hse_officer",
    label: "HSE Officer",
    color: "#EA580C",
    bgColor: "#FFF7ED",
    description: "Rig HSE — training & safety tasks",
    user: {
      id: "usr-hse-001",
      name: "James Okonkwo",
      initials: "JO",
      email: "james.okonkwo@myhp.com",
      role: "employee",
      department: "rig_operations",
      rigAssignment: "rig-alpha",
      avatarColor: "#C2410C",
      jobTitle: "HSE Officer",
    },
  },
  {
    id: "rig_medic",
    label: "Rig Medic",
    color: "#059669",
    bgColor: "#ECFDF5",
    description: "Rig medical — onboarding checks",
    user: {
      id: "usr-med-001",
      name: "Dr. Fatima Al-Harbi",
      initials: "FA",
      email: "fatima.alharbi@myhp.com",
      role: "employee",
      department: "rig_operations",
      rigAssignment: "rig-alpha",
      avatarColor: "#047857",
      jobTitle: "Rig Medic",
    },
  },
  {
    id: "rig_admin",
    label: "Rig Admin",
    color: "#7C3AED",
    bgColor: "#F3E8FF",
    description: "Rig admin — onboarding & scheduling",
    user: {
      id: "usr-adm-001",
      name: "Nadia Petrova",
      initials: "NP",
      email: "nadia.petrova@myhp.com",
      role: "employee",
      department: "rig_operations",
      rigAssignment: "rig-alpha",
      avatarColor: "#7C3AED",
      jobTitle: "Rig Administrator",
    },
  },
  {
    id: "quality_inspector",
    label: "Quality Inspector",
    color: "#1D4ED8",
    bgColor: "#EFF6FF",
    description: "Quality dept — inspections & docs",
    user: {
      id: "usr-qs-001",
      name: "Omar Al-Faiz",
      initials: "OF",
      email: "omar.alfaiz@myhp.com",
      role: "employee",
      department: "quality",
      rigAssignment: "rig-alpha",
      avatarColor: "#1D4ED8",
      jobTitle: "Quality Inspector",
    },
  },
  {
    id: "operations_director",
    label: "Operations Director",
    color: "#7C3AED",
    bgColor: "#F3E8FF",
    description: "Company-wide oversight — sees all",
    user: {
      id: "usr-cm-001",
      name: "David Okafor",
      initials: "DO",
      email: "david.okafor@myhp.com",
      role: "company_manager",
      department: "rig_operations",
      avatarColor: "#6D28D9",
      jobTitle: "Operations Director",
    },
  },
  {
    id: "system_admin",
    label: "System Admin",
    color: "#DC2626",
    bgColor: "#FEF2F2",
    description: "Full system access",
    user: {
      id: "usr-sa-001",
      name: "Michael Torres",
      initials: "MT",
      email: "michael.torres@myhp.com",
      role: "system_admin",
      department: "rig_operations",
      avatarColor: "#991B1B",
      jobTitle: "System Administrator",
    },
  },
];

// ─── Helper to find active persona ───────────────────────────────────────────

function getActivePersona(user: User | null): PersonaConfig {
  if (!user) return PERSONA_CONFIGS[0];
  // Match by user id first, then fall back to first match by role+department+jobTitle
  return (
    PERSONA_CONFIGS.find((p) => p.user.id === user.id) ??
    PERSONA_CONFIGS.find(
      (p) =>
        p.user.role === user.role &&
        p.user.department === user.department &&
        p.user.jobTitle === user.jobTitle
    ) ??
    PERSONA_CONFIGS[0]
  );
}

// ─── Role Switcher Component ──────────────────────────────────────────────────

export function RoleSwitcher() {
  const currentUser = useUserStore((s) => s.currentUser);
  const setCurrentUser = useUserStore((s) => s.setCurrentUser);

  const activePersona = getActivePersona(currentUser);

  function handlePersonaChange(value: string) {
    const persona = PERSONA_CONFIGS.find((p) => p.id === value);
    if (persona) {
      setCurrentUser(persona.user);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 gap-1.5 border text-xs font-medium px-2 py-0",
            "hover:opacity-90 transition-opacity"
          )}
          style={{
            color: activePersona.color,
            backgroundColor: activePersona.bgColor,
            borderColor: `${activePersona.color}30`,
          }}
          aria-label="Switch role"
        >
          <UserCog className="h-3 w-3 shrink-0" />
          <span className="hidden sm:inline">{activePersona.label}</span>
          <ChevronDown className="h-2.5 w-2.5 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-slate-500 font-normal pb-1">
          <UserCog className="h-3.5 w-3.5" />
          DEMO AS
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activePersona.id}
          onValueChange={handlePersonaChange}
        >
          {PERSONA_CONFIGS.map((persona) => (
            <DropdownMenuRadioItem
              key={persona.id}
              value={persona.id}
              className="flex items-start gap-2 py-2 cursor-pointer"
            >
              <div className="flex flex-col gap-0.5 ml-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{persona.label}</span>
                  {persona.id === activePersona.id && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 h-4 leading-none"
                      style={{
                        color: persona.color,
                        backgroundColor: persona.bgColor,
                      }}
                    >
                      Active
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {persona.description}
                </span>
                <span className="text-[10px] text-slate-400">
                  {persona.user.name} &bull; {persona.user.jobTitle}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
