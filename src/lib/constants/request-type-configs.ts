// =============================================================================
// MY HP APP — Oil & Gas Operations Management Platform
// Request Type Display Configurations
// =============================================================================

import type { RequestType, UserRole, Department } from '@/lib/types'

// -----------------------------------------------------------------------------
// Config shape
// -----------------------------------------------------------------------------

export interface RequestTypeConfig {
  label: string
  shortLabel: string
  color: string
  bgColor: string
  icon: string
  /** Roles that can CREATE this request type */
  visibility: UserRole[]
  /** Department this request type is primarily owned/processed by */
  ownerDepartment: Department
  /** Whether this request type creates a Quality workflow record */
  createsQualityRecord: boolean
}

// -----------------------------------------------------------------------------
// Request type config map
// -----------------------------------------------------------------------------

export const requestTypeConfig: Record<RequestType, RequestTypeConfig> = {
  equipment: {
    label: 'Equipment Request',
    shortLabel: 'Equipment',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: 'Wrench',
    visibility: ['rig_manager', 'department_manager'],
    ownerDepartment: 'rig_operations',
    createsQualityRecord: false,
  },
  material: {
    label: 'Material Request',
    shortLabel: 'Material',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    icon: 'Package',
    visibility: ['rig_manager', 'department_manager', 'employee'],
    ownerDepartment: 'warehouse',
    createsQualityRecord: false,
  },
  service: {
    label: 'Service Request',
    shortLabel: 'Service',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    icon: 'ConciergeBell',
    visibility: ['rig_manager', 'department_manager'],
    ownerDepartment: 'rig_operations',
    createsQualityRecord: false,
  },
  rental: {
    label: 'Rental Request',
    shortLabel: 'Rental',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    icon: 'CalendarRange',
    visibility: ['rig_manager', 'department_manager'],
    ownerDepartment: 'asset_management',
    createsQualityRecord: false,
  },
  rig_move: {
    label: 'Rig Move',
    shortLabel: 'Rig Move',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    icon: 'Truck',
    visibility: ['company_manager', 'rig_manager'],
    ownerDepartment: 'logistics',
    createsQualityRecord: false,
  },
  inspection: {
    label: 'Inspection Request',
    shortLabel: 'Inspection',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    icon: 'ClipboardCheck',
    visibility: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
    ],
    ownerDepartment: 'quality',
    createsQualityRecord: true,
  },
  document_review: {
    label: 'Document Review',
    shortLabel: 'Doc Review',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    icon: 'FileSearch',
    visibility: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
    ownerDepartment: 'quality',
    createsQualityRecord: false,
  },
  manpower: {
    label: 'Manpower Request',
    shortLabel: 'Manpower',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    icon: 'Users',
    visibility: ['rig_manager', 'department_manager'],
    ownerDepartment: 'rig_operations',
    createsQualityRecord: false,
  },
  qc_support: {
    label: 'QC Support',
    shortLabel: 'QC Support',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    icon: 'ShieldCheck',
    visibility: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
    ],
    ownerDepartment: 'quality',
    createsQualityRecord: true,
  },
  moc: {
    label: 'Management of Change',
    shortLabel: 'MOC',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: 'GitBranch',
    visibility: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
    ],
    ownerDepartment: 'quality',
    createsQualityRecord: true,
  },
  nco: {
    label: 'Non-Conformance',
    shortLabel: 'NCO',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: 'AlertTriangle',
    visibility: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
    ownerDepartment: 'quality',
    createsQualityRecord: true,
  },
  hr: {
    label: 'HR Request',
    shortLabel: 'HR',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    icon: 'UserCog',
    visibility: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
    ownerDepartment: 'rig_operations',
    createsQualityRecord: false,
  },
  logistics: {
    label: 'Logistics Request',
    shortLabel: 'Logistics',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    icon: 'PackageOpen',
    visibility: ['rig_manager', 'department_manager'],
    ownerDepartment: 'logistics',
    createsQualityRecord: false,
  },
  maintenance: {
    label: 'Maintenance Request',
    shortLabel: 'Maintenance',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: 'Settings',
    visibility: [
      'rig_manager',
      'department_manager',
      'employee',
    ],
    ownerDepartment: 'rig_operations',
    createsQualityRecord: false,
  },
  gate_pass: {
    label: 'Gate Pass',
    shortLabel: 'Gate Pass',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    icon: 'DoorOpen',
    visibility: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
    ownerDepartment: 'security',
    createsQualityRecord: false,
  },
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns the list of request types visible to a given role.
 */
export function getRequestTypesForRole(role: UserRole): RequestType[] {
  return (Object.keys(requestTypeConfig) as RequestType[]).filter((type) =>
    requestTypeConfig[type].visibility.includes(role)
  )
}

/**
 * Returns request types grouped by owner department.
 */
export function getRequestTypesByDepartment(): Record<
  Department,
  RequestType[]
> {
  const result: Partial<Record<Department, RequestType[]>> = {}

  ;(Object.keys(requestTypeConfig) as RequestType[]).forEach((type) => {
    const dept = requestTypeConfig[type].ownerDepartment
    if (!result[dept]) result[dept] = []
    result[dept]!.push(type)
  })

  return result as Record<Department, RequestType[]>
}
