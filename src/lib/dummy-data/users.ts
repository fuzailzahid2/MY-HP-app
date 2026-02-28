// ============================================================
// USERS DUMMY DATA
// Oil & Gas Operations Management Platform — ADI
// ============================================================

export type UserRole =
  | 'quality_manager'
  | 'quality_engineer'
  | 'lead_auditor'
  | 'document_controller'
  | 'rig_manager'
  | 'maintenance_manager'
  | 'hse_officer'
  | 'hse_coordinator'
  | 'warehouse_supervisor'
  | 'warehouse_clerk'
  | 'supply_chain_manager'
  | 'rig_superintendent'
  | 'drilling_engineer'
  | 'well_control_specialist'
  | 'mechanical_supervisor'
  | 'asset_manager'
  | 'admin';

export type Department =
  | 'Quality'
  | 'Rig Operations'
  | 'HSE'
  | 'Logistics'
  | 'Warehouse'
  | 'Asset Management'
  | 'Supply Chain'
  | 'Drilling Engineering'
  | 'Maintenance'
  | 'Security';

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  department: Department;
  jobTitle: string;
  rigAssignment?: 'AD-201' | 'AD-202' | 'AD-203' | null;
  avatarColor: string;
  phone?: string;
  isActive: boolean;
  location: string;
}

export const USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Hassan Al-Qahtani',
    initials: 'HQ',
    email: 'h.alqahtani@adi-drilling.com',
    role: 'quality_manager',
    department: 'Quality',
    jobTitle: 'Quality Manager',
    rigAssignment: null,
    avatarColor: '#1A73E8',
    phone: '+966-50-123-4501',
    isActive: true,
    location: 'Dammam Headquarters',
  },
  {
    id: 'USR-002',
    name: 'Emma Richards',
    initials: 'ER',
    email: 'e.richards@adi-drilling.com',
    role: 'quality_engineer',
    department: 'Quality',
    jobTitle: 'Quality Engineer',
    rigAssignment: 'AD-201',
    avatarColor: '#E91E63',
    phone: '+966-50-123-4502',
    isActive: true,
    location: 'Well ADB-47 / Dammam Base',
  },
  {
    id: 'USR-003',
    name: 'Andrew Campbell',
    initials: 'AC',
    email: 'a.campbell@adi-drilling.com',
    role: 'lead_auditor',
    department: 'Quality',
    jobTitle: 'Lead Auditor',
    rigAssignment: null,
    avatarColor: '#FF6D00',
    phone: '+966-50-123-4503',
    isActive: true,
    location: 'Dammam Headquarters',
  },
  {
    id: 'USR-004',
    name: 'Fatima Al-Subaie',
    initials: 'FS',
    email: 'f.alsubaie@adi-drilling.com',
    role: 'document_controller',
    department: 'Quality',
    jobTitle: 'Document Controller',
    rigAssignment: null,
    avatarColor: '#9C27B0',
    phone: '+966-50-123-4504',
    isActive: true,
    location: 'Dammam Headquarters',
  },
  {
    id: 'USR-005',
    name: 'Omar Hassan',
    initials: 'OH',
    email: 'o.hassan@adi-drilling.com',
    role: 'rig_manager',
    department: 'Rig Operations',
    jobTitle: 'Rig Manager',
    rigAssignment: 'AD-201',
    avatarColor: '#00897B',
    phone: '+966-50-123-4505',
    isActive: true,
    location: 'Well ADB-47',
  },
  {
    id: 'USR-006',
    name: 'Ahmed Al-Rashid',
    initials: 'AR',
    email: 'a.alrashid@adi-drilling.com',
    role: 'quality_manager',
    department: 'Quality',
    jobTitle: 'Quality Manager',
    rigAssignment: 'AD-202',
    avatarColor: '#F4511E',
    phone: '+966-50-123-4506',
    isActive: true,
    location: 'Well ADB-52',
  },
  {
    id: 'USR-007',
    name: 'Sarah Mitchell',
    initials: 'SM',
    email: 's.mitchell@adi-drilling.com',
    role: 'quality_manager',
    department: 'Quality',
    jobTitle: 'Quality Manager',
    rigAssignment: 'AD-203',
    avatarColor: '#7B1FA2',
    phone: '+966-50-123-4507',
    isActive: true,
    location: 'Well ADB-61',
  },
  {
    id: 'USR-008',
    name: 'Khalid Mahmoud',
    initials: 'KM',
    email: 'k.mahmoud@adi-drilling.com',
    role: 'maintenance_manager',
    department: 'Maintenance',
    jobTitle: 'Maintenance Manager',
    rigAssignment: 'AD-201',
    avatarColor: '#0277BD',
    phone: '+966-50-123-4508',
    isActive: true,
    location: 'Well ADB-47',
  },
  {
    id: 'USR-009',
    name: 'Ali Hassan',
    initials: 'AH',
    email: 'a.hassan@adi-drilling.com',
    role: 'hse_officer',
    department: 'HSE',
    jobTitle: 'HSE Officer',
    rigAssignment: 'AD-201',
    avatarColor: '#2E7D32',
    phone: '+966-50-123-4509',
    isActive: true,
    location: 'Well ADB-47',
  },
  {
    id: 'USR-010',
    name: 'David Chen',
    initials: 'DC',
    email: 'd.chen@adi-drilling.com',
    role: 'quality_engineer',
    department: 'Quality',
    jobTitle: 'Quality Engineer',
    rigAssignment: 'AD-202',
    avatarColor: '#C62828',
    phone: '+966-50-123-4510',
    isActive: true,
    location: 'Well ADB-52',
  },
  {
    id: 'USR-011',
    name: 'Yusuf Ibrahim',
    initials: 'YI',
    email: 'y.ibrahim@adi-drilling.com',
    role: 'warehouse_supervisor',
    department: 'Warehouse',
    jobTitle: 'Warehouse Supervisor',
    rigAssignment: null,
    avatarColor: '#558B2F',
    phone: '+966-50-123-4511',
    isActive: true,
    location: 'Dammam Base',
  },
  {
    id: 'USR-012',
    name: 'Khalid Al-Harbi',
    initials: 'KH',
    email: 'k.alharbi@adi-drilling.com',
    role: 'supply_chain_manager',
    department: 'Supply Chain',
    jobTitle: 'Supply Chain Manager',
    rigAssignment: null,
    avatarColor: '#6A1B9A',
    phone: '+966-50-123-4512',
    isActive: true,
    location: 'Dammam Headquarters',
  },
  {
    id: 'USR-013',
    name: 'James Cooper',
    initials: 'JC',
    email: 'j.cooper@adi-drilling.com',
    role: 'rig_superintendent',
    department: 'Rig Operations',
    jobTitle: 'Rig Superintendent',
    rigAssignment: null,
    avatarColor: '#1565C0',
    phone: '+966-50-123-4513',
    isActive: true,
    location: 'Dammam Headquarters',
  },
  {
    id: 'USR-014',
    name: 'Nadia Petrova',
    initials: 'NP',
    email: 'n.petrova@adi-drilling.com',
    role: 'drilling_engineer',
    department: 'Drilling Engineering',
    jobTitle: 'Drilling Engineer',
    rigAssignment: 'AD-202',
    avatarColor: '#AD1457',
    phone: '+966-50-123-4514',
    isActive: true,
    location: 'Well ADB-52',
  },
  {
    id: 'USR-015',
    name: 'Carlos Mendez',
    initials: 'CM',
    email: 'c.mendez@adi-drilling.com',
    role: 'rig_manager',
    department: 'Rig Operations',
    jobTitle: 'Rig Manager',
    rigAssignment: 'AD-202',
    avatarColor: '#E65100',
    phone: '+966-50-123-4515',
    isActive: true,
    location: 'Well ADB-52',
  },
  {
    id: 'USR-016',
    name: 'Peter Okafor',
    initials: 'PO',
    email: 'p.okafor@adi-drilling.com',
    role: 'hse_coordinator',
    department: 'HSE',
    jobTitle: 'HSE Coordinator',
    rigAssignment: 'AD-203',
    avatarColor: '#00695C',
    phone: '+966-50-123-4516',
    isActive: true,
    location: 'Well ADB-61',
  },
  {
    id: 'USR-017',
    name: 'Tariq Nasser',
    initials: 'TN',
    email: 't.nasser@adi-drilling.com',
    role: 'warehouse_clerk',
    department: 'Warehouse',
    jobTitle: 'Warehouse Clerk',
    rigAssignment: null,
    avatarColor: '#4527A0',
    phone: '+966-50-123-4517',
    isActive: true,
    location: 'Dammam Base',
  },
  {
    id: 'USR-018',
    name: 'Mohammed Al-Dosari',
    initials: 'MD',
    email: 'm.aldosari@adi-drilling.com',
    role: 'well_control_specialist',
    department: 'Drilling Engineering',
    jobTitle: 'Well Control Specialist',
    rigAssignment: 'AD-201',
    avatarColor: '#BF360C',
    phone: '+966-50-123-4518',
    isActive: true,
    location: 'Well ADB-47',
  },
  {
    id: 'USR-019',
    name: 'Sami Al-Otaibi',
    initials: 'SO',
    email: 's.alotaibi@adi-drilling.com',
    role: 'mechanical_supervisor',
    department: 'Maintenance',
    jobTitle: 'Mechanical Supervisor',
    rigAssignment: 'AD-203',
    avatarColor: '#33691E',
    phone: '+966-50-123-4519',
    isActive: true,
    location: 'Well ADB-61',
  },
  {
    id: 'USR-020',
    name: 'Abdullah Qasim',
    initials: 'AQ',
    email: 'a.qasim@adi-drilling.com',
    role: 'asset_manager',
    department: 'Asset Management',
    jobTitle: 'Asset Manager',
    rigAssignment: null,
    avatarColor: '#1A237E',
    phone: '+966-50-123-4520',
    isActive: true,
    location: 'Dammam Headquarters',
  },
  {
    id: 'USR-021',
    name: 'Rania Al-Ghamdi',
    initials: 'RG',
    email: 'r.alghamdi@adi-drilling.com',
    role: 'document_controller',
    department: 'Quality',
    jobTitle: 'Junior Document Controller',
    rigAssignment: 'AD-202',
    avatarColor: '#880E4F',
    phone: '+966-50-123-4521',
    isActive: true,
    location: 'Well ADB-52',
  },
  {
    id: 'USR-022',
    name: 'Tom Bradshaw',
    initials: 'TB',
    email: 't.bradshaw@adi-drilling.com',
    role: 'rig_manager',
    department: 'Rig Operations',
    jobTitle: 'Rig Manager',
    rigAssignment: 'AD-203',
    avatarColor: '#006064',
    phone: '+966-50-123-4522',
    isActive: true,
    location: 'Well ADB-61',
  },
];

// Helper to get user by id
export const getUserById = (id: string): User | undefined =>
  USERS.find((u) => u.id === id);

// Helper to get users by rig
export const getUsersByRig = (rigId: string): User[] =>
  USERS.filter((u) => u.rigAssignment === rigId);

// Current logged-in user (for wireframe purposes)
export const CURRENT_USER: User = USERS[0]; // Hassan Al-Qahtani
