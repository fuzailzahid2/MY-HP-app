// =============================================================================
// MY HP APP — Oil & Gas Operations Management Platform
// Status Display Configurations
// =============================================================================

import type {
  RequestStatus,
  MocStatus,
  NcoStatus,
  CapaStatus,
  AuditStatus,
  TaskStatus,
} from '@/lib/types'

// -----------------------------------------------------------------------------
// Shared config shape
// -----------------------------------------------------------------------------

export interface StatusConfig {
  label: string
  color: string
  bgColor: string
}

// -----------------------------------------------------------------------------
// REQUEST STATUS
// -----------------------------------------------------------------------------

export const requestStatusConfig: Record<RequestStatus, StatusConfig> = {
  submitted: {
    label: 'Submitted',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  pending_ack: {
    label: 'Pending Ack',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  acknowledged: {
    label: 'Acknowledged',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  in_review: {
    label: 'In Review',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  approved: {
    label: 'Approved',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-500',
    bgColor: 'bg-transparent',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
}

// -----------------------------------------------------------------------------
// TASK STATUS
// -----------------------------------------------------------------------------

export const taskStatusConfig: Record<TaskStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
  },
  accepted: {
    label: 'Accepted',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  started: {
    label: 'Started',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-500',
    bgColor: 'bg-transparent',
  },
}

// -----------------------------------------------------------------------------
// MOC STATUS
// -----------------------------------------------------------------------------

export const mocStatusConfig: Record<MocStatus, StatusConfig> = {
  initiated: {
    label: 'Initiated',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  risk_assessment: {
    label: 'Risk Assessment',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  approved: {
    label: 'Approved',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  implementing: {
    label: 'Implementing',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  verification: {
    label: 'Verification',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-500',
    bgColor: 'bg-transparent',
  },
}

// -----------------------------------------------------------------------------
// NCO STATUS
// -----------------------------------------------------------------------------

export const ncoStatusConfig: Record<NcoStatus, StatusConfig> = {
  submitted: {
    label: 'Submitted',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  acknowledged: {
    label: 'Acknowledged',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-500',
    bgColor: 'bg-transparent',
  },
}

// -----------------------------------------------------------------------------
// CAPA STATUS
// -----------------------------------------------------------------------------

export const capaStatusConfig: Record<CapaStatus, StatusConfig> = {
  action_planning: {
    label: 'Action Planning',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  rca_in_progress: {
    label: 'RCA In Progress',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  implementing: {
    label: 'Implementing',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  verifying: {
    label: 'Verifying',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  effectiveness_review: {
    label: 'Effectiveness Review',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-500',
    bgColor: 'bg-transparent',
  },
}

// -----------------------------------------------------------------------------
// AUDIT STATUS
// -----------------------------------------------------------------------------

export const auditStatusConfig: Record<AuditStatus, StatusConfig> = {
  planned: {
    label: 'Planned',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-500',
    bgColor: 'bg-transparent',
  },
}

// -----------------------------------------------------------------------------
// SLA STATUS (used across Request, Task, etc.)
// -----------------------------------------------------------------------------

export interface SlaStatusConfig {
  label: string
  color: string
  bgColor: string
  dotColor: string
}

export const slaStatusConfig: Record<
  'on_track' | 'at_risk' | 'overdue',
  SlaStatusConfig
> = {
  on_track: {
    label: 'On Track',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    dotColor: 'bg-green-500',
  },
  at_risk: {
    label: 'At Risk',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    dotColor: 'bg-amber-500',
  },
  overdue: {
    label: 'Overdue',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    dotColor: 'bg-red-500',
  },
}

// -----------------------------------------------------------------------------
// ASSET STATUS
// -----------------------------------------------------------------------------

export interface AssetStatusConfig {
  label: string
  color: string
  bgColor: string
}

export const assetStatusConfig: Record<
  'active' | 'inactive' | 'under_repair' | 'disposed',
  AssetStatusConfig
> = {
  active: {
    label: 'Active',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  inactive: {
    label: 'Inactive',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
  },
  under_repair: {
    label: 'Under Repair',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  disposed: {
    label: 'Disposed',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
}

// -----------------------------------------------------------------------------
// CERT STATUS
// -----------------------------------------------------------------------------

export interface CertStatusConfig {
  label: string
  color: string
  bgColor: string
}

export const certStatusConfig: Record<
  'valid' | 'expiring' | 'expired',
  CertStatusConfig
> = {
  valid: {
    label: 'Valid',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  expiring: {
    label: 'Expiring Soon',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  expired: {
    label: 'Expired',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
}

// -----------------------------------------------------------------------------
// STOCK STATUS
// -----------------------------------------------------------------------------

export interface StockStatusConfig {
  label: string
  color: string
  bgColor: string
}

export const stockStatusConfig: Record<
  'ok' | 'low' | 'critical',
  StockStatusConfig
> = {
  ok: {
    label: 'OK',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  low: {
    label: 'Low Stock',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
}

// -----------------------------------------------------------------------------
// PERSONNEL STATUS
// -----------------------------------------------------------------------------

export interface PersonnelStatusConfig {
  label: string
  color: string
  bgColor: string
  dotColor: string
}

export const personnelStatusConfig: Record<
  'checked_in' | 'checked_out',
  PersonnelStatusConfig
> = {
  checked_in: {
    label: 'Checked In',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    dotColor: 'bg-green-500',
  },
  checked_out: {
    label: 'Checked Out',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    dotColor: 'bg-slate-400',
  },
}
