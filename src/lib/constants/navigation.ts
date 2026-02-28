// =============================================================================
// MY HP APP — Oil & Gas Operations Management Platform
// Sidebar Navigation Structure
// =============================================================================

import type { NavItem, UserRole } from '@/lib/types'

// -----------------------------------------------------------------------------
// Full navigation tree
// The `icon` field holds the lucide-react icon name as a string.
// Resolve the actual icon component at render-time using a lookup map.
// -----------------------------------------------------------------------------

export const navigationItems: NavItem[] = [
  // ---------------------------------------------------------------------------
  // Top-level pages
  // ---------------------------------------------------------------------------
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    roles: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
  },
  {
    label: 'Workspace',
    path: '/workspace',
    icon: 'Briefcase',
    roles: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
  },
  {
    label: 'Requests',
    path: '/requests',
    icon: 'InboxIcon',
    roles: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
  },

  // ---------------------------------------------------------------------------
  // Rig Operations
  // ---------------------------------------------------------------------------
  {
    label: 'Rig Operations',
    icon: 'HardHat',
    roles: [
      'system_admin',
      'company_manager',
      'rig_manager',
      'department_manager',
      'employee',
    ],
    children: [
      {
        label: 'Assets',
        path: '/rig-operations/assets',
        icon: 'Box',
        roles: [
          'system_admin',
          'company_manager',
          'rig_manager',
          'department_manager',
          'employee',
        ],
      },
      {
        label: 'Admin',
        path: '/rig-operations/admin',
        icon: 'Users',
        roles: [
          'system_admin',
          'company_manager',
          'rig_manager',
          'department_manager',
        ],
      },
      {
        label: 'Materials',
        path: '/rig-operations/materials',
        icon: 'Package',
        roles: [
          'system_admin',
          'company_manager',
          'rig_manager',
          'department_manager',
          'employee',
        ],
      },
      {
        label: 'Maintenance',
        path: '/rig-operations/maintenance',
        icon: 'Wrench',
        roles: [
          'system_admin',
          'company_manager',
          'rig_manager',
          'department_manager',
          'employee',
        ],
      },
      {
        label: 'Clinic',
        path: '/rig-operations/clinic',
        icon: 'Stethoscope',
        roles: [
          'system_admin',
          'company_manager',
          'rig_manager',
          'department_manager',
        ],
      },
      {
        label: 'HSE',
        path: '/rig-operations/hse',
        icon: 'ShieldAlert',
        roles: [
          'system_admin',
          'company_manager',
          'rig_manager',
          'department_manager',
          'employee',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Quality
  // ---------------------------------------------------------------------------
  {
    label: 'Quality',
    icon: 'ShieldCheck',
    roles: [
      'system_admin',
      'company_manager',
      'department_manager',
    ],
    children: [
      {
        label: 'MOC',
        path: '/quality/moc',
        icon: 'GitBranch',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'NCO',
        path: '/quality/nco',
        icon: 'AlertTriangle',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'CAPA',
        path: '/quality/capa',
        icon: 'RefreshCw',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'IMS',
        path: '/quality/ims',
        icon: 'BookOpen',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Audits',
        path: '/quality/audits',
        icon: 'ClipboardList',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Inspections',
        path: '/quality/inspections',
        icon: 'ClipboardCheck',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Logistics
  // ---------------------------------------------------------------------------
  {
    label: 'Logistics',
    icon: 'Truck',
    roles: ['system_admin', 'company_manager', 'department_manager'],
    children: [
      {
        label: 'Transport',
        path: '/logistics/transport',
        icon: 'Truck',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Rig Moves',
        path: '/logistics/rig-moves',
        icon: 'MoveRight',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Manifests',
        path: '/logistics/manifests',
        icon: 'FileText',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Vendors',
        path: '/logistics/vendors',
        icon: 'Building2',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Asset Management
  // ---------------------------------------------------------------------------
  {
    label: 'Asset Management',
    icon: 'BarChart3',
    roles: ['system_admin', 'company_manager', 'department_manager'],
    children: [
      {
        label: 'Asset Register',
        path: '/asset-management/register',
        icon: 'Database',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Certifications',
        path: '/asset-management/certifications',
        icon: 'BadgeCheck',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Maintenance',
        path: '/asset-management/maintenance',
        icon: 'Wrench',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Rentals',
        path: '/asset-management/rentals',
        icon: 'CalendarRange',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Warehouse
  // ---------------------------------------------------------------------------
  {
    label: 'Warehouse',
    icon: 'Warehouse',
    roles: ['system_admin', 'company_manager', 'department_manager'],
    children: [
      {
        label: 'Inventory',
        path: '/warehouse/inventory',
        icon: 'PackageSearch',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Receiving',
        path: '/warehouse/receiving',
        icon: 'PackageCheck',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Issuing',
        path: '/warehouse/issuing',
        icon: 'PackageOpen',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Transfers',
        path: '/warehouse/transfers',
        icon: 'ArrowLeftRight',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Security
  // ---------------------------------------------------------------------------
  {
    label: 'Security',
    icon: 'Shield',
    roles: ['system_admin', 'company_manager', 'department_manager'],
    children: [
      {
        label: 'Gate Passes',
        path: '/security/gate-passes',
        icon: 'DoorOpen',
        roles: [
          'system_admin',
          'company_manager',
          'department_manager',
          'employee',
        ],
      },
      {
        label: 'Personnel',
        path: '/security/personnel',
        icon: 'UserCheck',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Visitors',
        path: '/security/visitors',
        icon: 'UserPlus',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
      {
        label: 'Incidents',
        path: '/security/incidents',
        icon: 'AlertOctagon',
        roles: ['system_admin', 'company_manager', 'department_manager'],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Administration (system-level)
  // ---------------------------------------------------------------------------
  {
    label: 'Administration',
    icon: 'Settings2',
    roles: ['system_admin', 'company_manager'],
    children: [
      {
        label: 'Users',
        path: '/admin/users',
        icon: 'UserCog',
        roles: ['system_admin', 'company_manager'],
      },
      {
        label: 'Rigs',
        path: '/admin/rigs',
        icon: 'HardHat',
        roles: ['system_admin', 'company_manager'],
      },
      {
        label: 'Roles & Permissions',
        path: '/admin/roles',
        icon: 'KeyRound',
        roles: ['system_admin'],
      },
      {
        label: 'Audit Log',
        path: '/admin/audit-log',
        icon: 'ScrollText',
        roles: ['system_admin'],
      },
    ],
  },
]

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Filters the navigation tree to only include items accessible by a given role.
 * Children arrays are filtered recursively; parent items are hidden if they
 * have no visible children and no direct path.
 */
export function getNavigationForRole(role: UserRole): NavItem[] {
  function filterItem(item: NavItem): NavItem | null {
    // Check if the item itself is accessible
    const isAccessible = !item.roles || item.roles.includes(role)
    if (!isAccessible) return null

    // If the item has children, filter them recursively
    if (item.children && item.children.length > 0) {
      const filteredChildren = item.children
        .map(filterItem)
        .filter((c): c is NavItem => c !== null)

      // Hide parent if it has no accessible children and no direct path
      if (filteredChildren.length === 0 && !item.path) return null

      return { ...item, children: filteredChildren }
    }

    return item
  }

  return navigationItems.map(filterItem).filter((i): i is NavItem => i !== null)
}

/**
 * Flattens the navigation tree into a list of all leaf paths.
 */
export function getAllNavigationPaths(): string[] {
  function collectPaths(items: NavItem[]): string[] {
    return items.flatMap((item) => {
      const paths: string[] = []
      if (item.path) paths.push(item.path)
      if (item.children) paths.push(...collectPaths(item.children))
      return paths
    })
  }
  return collectPaths(navigationItems)
}

/**
 * Finds the nav item that matches the given pathname (exact or starts-with match).
 */
export function findNavItemByPath(
  pathname: string,
  items: NavItem[] = navigationItems
): NavItem | undefined {
  for (const item of items) {
    if (item.path && pathname === item.path) return item
    if (item.children) {
      const found = findNavItemByPath(pathname, item.children)
      if (found) return found
    }
  }
  return undefined
}

/**
 * Returns breadcrumb trail for a given pathname.
 */
export function getBreadcrumbs(
  pathname: string,
  items: NavItem[] = navigationItems,
  trail: NavItem[] = []
): NavItem[] {
  for (const item of items) {
    const currentTrail = [...trail, item]
    if (item.path === pathname) return currentTrail
    if (item.children) {
      const result = getBreadcrumbs(pathname, item.children, currentTrail)
      if (result.length > 0) return result
    }
  }
  return []
}
