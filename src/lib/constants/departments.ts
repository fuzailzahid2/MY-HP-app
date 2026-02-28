// =============================================================================
// MY HP APP — Oil & Gas Operations Management Platform
// Department Configurations
// =============================================================================

import type { Department, UserRole } from '@/lib/types'

// -----------------------------------------------------------------------------
// Config shape
// -----------------------------------------------------------------------------

export interface SubModule {
  key: string
  label: string
  path: string
  icon: string
}

export interface DepartmentConfig {
  label: string
  shortLabel: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  subModules: SubModule[]
  /** Roles that have access to this department section */
  accessRoles: UserRole[]
}

// -----------------------------------------------------------------------------
// Department config map
// -----------------------------------------------------------------------------

export const departmentConfig: Record<Department, DepartmentConfig> = {
  rig_operations: {
    label: 'Rig Operations',
    shortLabel: 'Rig Ops',
    icon: 'HardHat',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description:
      'Manage day-to-day rig activities including assets, personnel, materials, maintenance, and health services.',
    subModules: [
      {
        key: 'assets',
        label: 'Assets',
        path: '/rig-operations/assets',
        icon: 'Box',
      },
      {
        key: 'admin',
        label: 'Admin',
        path: '/rig-operations/admin',
        icon: 'Users',
      },
      {
        key: 'materials',
        label: 'Materials',
        path: '/rig-operations/materials',
        icon: 'Package',
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        path: '/rig-operations/maintenance',
        icon: 'Wrench',
      },
      {
        key: 'clinic',
        label: 'Clinic',
        path: '/rig-operations/clinic',
        icon: 'Stethoscope',
      },
      {
        key: 'hse',
        label: 'HSE',
        path: '/rig-operations/hse',
        icon: 'ShieldAlert',
      },
    ],
    accessRoles: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
  },

  quality: {
    label: 'Quality',
    shortLabel: 'Quality',
    icon: 'ShieldCheck',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description:
      'Oversee quality management processes including change management, non-conformances, corrective actions, and audits.',
    subModules: [
      {
        key: 'moc',
        label: 'MOC',
        path: '/quality/moc',
        icon: 'GitBranch',
      },
      {
        key: 'nco',
        label: 'NCO',
        path: '/quality/nco',
        icon: 'AlertTriangle',
      },
      {
        key: 'capa',
        label: 'CAPA',
        path: '/quality/capa',
        icon: 'RefreshCw',
      },
      {
        key: 'ims',
        label: 'IMS',
        path: '/quality/ims',
        icon: 'BookOpen',
      },
      {
        key: 'audits',
        label: 'Audits',
        path: '/quality/audits',
        icon: 'ClipboardList',
      },
      {
        key: 'inspections',
        label: 'Inspections',
        path: '/quality/inspections',
        icon: 'ClipboardCheck',
      },
    ],
    accessRoles: [
      'system_admin',
      'company_manager',
      'department_manager',
    ],
  },

  logistics: {
    label: 'Logistics',
    shortLabel: 'Logistics',
    icon: 'Truck',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description:
      'Coordinate transportation, rig moves, manifests, and supply chain operations.',
    subModules: [
      {
        key: 'transport',
        label: 'Transport',
        path: '/logistics/transport',
        icon: 'Truck',
      },
      {
        key: 'rig_moves',
        label: 'Rig Moves',
        path: '/logistics/rig-moves',
        icon: 'MoveRight',
      },
      {
        key: 'manifests',
        label: 'Manifests',
        path: '/logistics/manifests',
        icon: 'FileText',
      },
      {
        key: 'vendors',
        label: 'Vendors',
        path: '/logistics/vendors',
        icon: 'Building2',
      },
    ],
    accessRoles: [
      'system_admin',
      'company_manager',
      'department_manager',
    ],
  },

  asset_management: {
    label: 'Asset Management',
    shortLabel: 'Assets',
    icon: 'BarChart3',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    description:
      'Track and manage the full lifecycle of company assets including certifications, servicing schedules, and disposals.',
    subModules: [
      {
        key: 'register',
        label: 'Asset Register',
        path: '/asset-management/register',
        icon: 'Database',
      },
      {
        key: 'certifications',
        label: 'Certifications',
        path: '/asset-management/certifications',
        icon: 'BadgeCheck',
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        path: '/asset-management/maintenance',
        icon: 'Wrench',
      },
      {
        key: 'rentals',
        label: 'Rentals',
        path: '/asset-management/rentals',
        icon: 'CalendarRange',
      },
    ],
    accessRoles: [
      'system_admin',
      'company_manager',
      'department_manager',
    ],
  },

  warehouse: {
    label: 'Warehouse',
    shortLabel: 'Warehouse',
    icon: 'Warehouse',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description:
      'Manage inventory, stock levels, goods receipts, and warehouse operations across all rigs.',
    subModules: [
      {
        key: 'inventory',
        label: 'Inventory',
        path: '/warehouse/inventory',
        icon: 'PackageSearch',
      },
      {
        key: 'receiving',
        label: 'Receiving',
        path: '/warehouse/receiving',
        icon: 'PackageCheck',
      },
      {
        key: 'issuing',
        label: 'Issuing',
        path: '/warehouse/issuing',
        icon: 'PackageOpen',
      },
      {
        key: 'transfers',
        label: 'Transfers',
        path: '/warehouse/transfers',
        icon: 'ArrowLeftRight',
      },
    ],
    accessRoles: [
      'system_admin',
      'company_manager',
      'department_manager',
    ],
  },

  security: {
    label: 'Security',
    shortLabel: 'Security',
    icon: 'Shield',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description:
      'Control access, manage gate passes, track personnel check-in/out, and oversee rig security protocols.',
    subModules: [
      {
        key: 'gate_passes',
        label: 'Gate Passes',
        path: '/security/gate-passes',
        icon: 'DoorOpen',
      },
      {
        key: 'personnel_tracking',
        label: 'Personnel Tracking',
        path: '/security/personnel',
        icon: 'UserCheck',
      },
      {
        key: 'visitors',
        label: 'Visitors',
        path: '/security/visitors',
        icon: 'UserPlus',
      },
      {
        key: 'incidents',
        label: 'Incidents',
        path: '/security/incidents',
        icon: 'AlertOctagon',
      },
    ],
    accessRoles: [
      'system_admin',
      'company_manager',
      'department_manager',
    ],
  },
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns a flat list of all sub-module paths across all departments.
 */
export function getAllSubModulePaths(): string[] {
  return Object.values(departmentConfig).flatMap((dept) =>
    dept.subModules.map((m) => m.path)
  )
}

/**
 * Returns the departments accessible by a given role.
 */
export function getDepartmentsForRole(role: UserRole): Department[] {
  return (Object.keys(departmentConfig) as Department[]).filter((dept) =>
    departmentConfig[dept].accessRoles.includes(role)
  )
}

/**
 * Returns the sub-module config for a given path, or undefined if not found.
 */
export function getSubModuleByPath(
  path: string
): (SubModule & { department: Department }) | undefined {
  for (const [deptKey, deptValue] of Object.entries(departmentConfig)) {
    const subModule = deptValue.subModules.find((m) => m.path === path)
    if (subModule) {
      return { ...subModule, department: deptKey as Department }
    }
  }
  return undefined
}
