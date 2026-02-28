// =============================================================================
// MY HP APP — Oil & Gas Operations Management Platform
// Priority Display Configurations
// =============================================================================

import type { Priority } from '@/lib/types'

// -----------------------------------------------------------------------------
// Config shape
// -----------------------------------------------------------------------------

export interface PriorityConfig {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
}

// -----------------------------------------------------------------------------
// Priority config map
// The `icon` field holds the lucide-react icon name as a string.
// Resolve it at the component level with a lookup map to keep this
// file free of React / component imports.
// -----------------------------------------------------------------------------

export const priorityConfig: Record<Priority, PriorityConfig> = {
  critical: {
    label: 'Critical',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: 'Flame',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: 'Clock',
  },
  high: {
    label: 'High',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: 'ArrowUp',
  },
  routine: {
    label: 'Routine',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: 'Minus',
  },
  planned: {
    label: 'Planned',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: 'CalendarClock',
  },
}

// -----------------------------------------------------------------------------
// Ordered list (highest → lowest) — useful for filter dropdowns & sort logic
// -----------------------------------------------------------------------------

export const priorityOrder: Priority[] = [
  'critical',
  'urgent',
  'high',
  'routine',
  'planned',
]

// -----------------------------------------------------------------------------
// Numeric weight map — use for sorting (higher number = higher priority)
// -----------------------------------------------------------------------------

export const priorityWeight: Record<Priority, number> = {
  critical: 5,
  urgent: 4,
  high: 3,
  routine: 2,
  planned: 1,
}
