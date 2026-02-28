// =============================================================================
// MY HP APP — Oil & Gas Operations Management Platform
// Domain Model Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// USER & AUTH
// -----------------------------------------------------------------------------

export type UserRole =
  | 'system_admin'
  | 'company_manager'
  | 'rig_manager'
  | 'department_manager'
  | 'employee'

export type Department =
  | 'rig_operations'
  | 'quality'
  | 'logistics'
  | 'asset_management'
  | 'warehouse'
  | 'security'

export interface User {
  id: string
  name: string
  initials: string
  email: string
  role: UserRole
  department: Department
  rigAssignment?: string
  avatarColor: string
  jobTitle: string
}

// -----------------------------------------------------------------------------
// REQUESTS
// -----------------------------------------------------------------------------

export type RequestType =
  | 'equipment'
  | 'material'
  | 'service'
  | 'rental'
  | 'rig_move'
  | 'inspection'
  | 'document_review'
  | 'manpower'
  | 'qc_support'
  | 'moc'
  | 'nco'
  | 'hr'
  | 'logistics'
  | 'maintenance'
  | 'gate_pass'

export type RequestStatus =
  | 'submitted'
  | 'pending_ack'
  | 'acknowledged'
  | 'in_progress'
  | 'in_review'
  | 'approved'
  | 'completed'
  | 'closed'
  | 'rejected'

export type Priority =
  | 'critical'
  | 'urgent'
  | 'high'
  | 'routine'
  | 'planned'

export type SlaStatus =
  | 'on_track'
  | 'at_risk'
  | 'overdue'

export interface Request {
  id: string
  type: RequestType
  title: string
  description: string
  source: string
  priority: Priority
  status: RequestStatus
  rigId: string
  submittedBy: User
  assignedTo?: User
  requestedDate: string
  requiredDate: string
  slaStatus: SlaStatus
  department: Department
}

// -----------------------------------------------------------------------------
// TASKS
// -----------------------------------------------------------------------------

export type TaskStatus =
  | 'pending'
  | 'accepted'
  | 'started'
  | 'completed'
  | 'closed'

export interface Task {
  id: string
  requestId: string
  title: string
  type: RequestType
  status: TaskStatus
  priority: Priority
  assignedTo: User
  requestedBy: User
  dueDate: string
  slaStatus: SlaStatus
  startedAt?: string
  completedAt?: string
  completionNote?: string
}

// -----------------------------------------------------------------------------
// QUALITY — MOC (Management of Change)
// -----------------------------------------------------------------------------

export type MocType =
  | 'permanent'
  | 'temporary'
  | 'emergency'

export type MocStatus =
  | 'initiated'
  | 'under_review'
  | 'risk_assessment'
  | 'approved'
  | 'implementing'
  | 'verification'
  | 'closed'

export interface MOC {
  id: string
  title: string
  type: MocType
  status: MocStatus
  priority: Priority
  location: string
  requestedBy: User
  requestDate: string
  targetDate: string
  category: string
  description: string
  justification: string
  revertPlan: string
  impactAreas: string[]
  linkedDocuments: string[]
  linkedAssets: string[]
}

// -----------------------------------------------------------------------------
// QUALITY — NCO (Non-Conformance)
// -----------------------------------------------------------------------------

export type NcoSeverity =
  | 'critical'
  | 'major'
  | 'minor'

export type NcoType =
  | 'process'
  | 'product'
  | 'supplier'
  | 'system'
  | 'documentation'

export type NcoStatus =
  | 'submitted'
  | 'acknowledged'
  | 'in_progress'
  | 'completed'
  | 'closed'

export interface NCO {
  id: string
  title: string
  severity: NcoSeverity
  type: NcoType
  status: NcoStatus
  location: string
  reportedBy: User
  reportDate: string
  dueDate: string
  department: Department
  assignedTo: User
  description: string
  containmentAction: string
  rootCause: string
  dispositionType: string
  dispositionDetail: string
  costImpact: number
  hasCapa: boolean
  capaId?: string
}

// -----------------------------------------------------------------------------
// QUALITY — CAPA (Corrective and Preventive Action)
// -----------------------------------------------------------------------------

export type CapaStatus =
  | 'action_planning'
  | 'rca_in_progress'
  | 'implementing'
  | 'verifying'
  | 'effectiveness_review'
  | 'closed'

export type CapaSource =
  | 'nco'
  | 'audit'
  | 'customer_complaint'
  | 'management_review'

export interface CAPA {
  id: string
  title: string
  status: CapaStatus
  priority: Priority
  source: CapaSource
  sourceId: string
  rootCauseCategory: string
  location: string
  initiatedBy: User
  initiatedDate: string
  assignedTo: User
  targetDate: string
  description: string
  actionsCompleted: number
  actionsTotal: number
  effectiveness: string
}

// -----------------------------------------------------------------------------
// QUALITY — AUDITS
// -----------------------------------------------------------------------------

export type AuditType =
  | 'internal'
  | 'external'
  | 'management_review'

export type AuditStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'closed'

export interface AuditFinding {
  id: string
  description: string
  type: 'minor' | 'major' | 'observation' | 'opportunity_for_improvement'
  clause: string
  status: 'open' | 'in_progress' | 'closed'
  assignedTo: User
  dueDate: string
  linkedCapaId?: string
}

export interface Audit {
  id: string
  title: string
  type: AuditType
  status: AuditStatus
  standard: string
  scope: string
  location: string
  scheduledDate: string
  completedDate?: string
  leadAuditor: User
  auditTeam: User[]
  conclusion: string
  findings: AuditFinding[]
}

// -----------------------------------------------------------------------------
// ASSETS
// -----------------------------------------------------------------------------

export type AssetCriticality = 'A' | 'B' | 'C'

export type AssetStatus =
  | 'active'
  | 'inactive'
  | 'under_repair'
  | 'disposed'

export type CertStatus =
  | 'valid'
  | 'expiring'
  | 'expired'

export type AssetCategory =
  | 'well_control'
  | 'rotating'
  | 'hoisting'
  | 'circulating'
  | 'power'
  | 'safety'
  | 'tubulars'

export interface Asset {
  id: string
  tagNumber: string
  name: string
  description: string
  category: AssetCategory
  type: string
  manufacturer: string
  model: string
  serialNumber: string
  location: string
  status: AssetStatus
  criticality: AssetCriticality
  certStatus: CertStatus
  certExpiryCount: number
  installDate: string
  lastService: string
  nextServiceDue: string
  specifications: Record<string, string>
}

export interface Rig {
  id: string
  name: string
  code: string
  location: string
  status: 'active' | 'standby' | 'maintenance' | 'decommissioned'
  personnelCount: number
}

// -----------------------------------------------------------------------------
// WAREHOUSE & INVENTORY
// -----------------------------------------------------------------------------

export type InventoryCategory =
  | 'ppe'
  | 'spares'
  | 'capital_goods'
  | 'tools'

export type StockStatus =
  | 'ok'
  | 'low'
  | 'critical'

export interface InventoryItem {
  id: string
  name: string
  partNumber: string
  category: InventoryCategory
  quantity: number
  unit: string
  location: string
  minStockLevel: number
  status: StockStatus
  rigId?: string
}

// -----------------------------------------------------------------------------
// PERSONNEL
// -----------------------------------------------------------------------------

export type PersonnelStatus =
  | 'checked_in'
  | 'checked_out'

export interface Personnel {
  id: string
  name: string
  role: string
  company: string
  rigId: string
  status: PersonnelStatus
  checkInTime?: string
  roomNumber?: string
  department: Department
}

// -----------------------------------------------------------------------------
// NOTIFICATIONS
// -----------------------------------------------------------------------------

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  linkTo?: string
}

// -----------------------------------------------------------------------------
// TIMELINE
// -----------------------------------------------------------------------------

export interface TimelineEvent {
  id: string
  action: string
  actor: User
  timestamp: string
  details?: string
}

// -----------------------------------------------------------------------------
// NAVIGATION (used in navigation constants)
// -----------------------------------------------------------------------------

export interface NavItem {
  label: string
  path?: string
  icon: string
  children?: NavItem[]
  badge?: number
  roles?: UserRole[]
}

// -----------------------------------------------------------------------------
// SHARED / UTILITY
// -----------------------------------------------------------------------------

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
  success: boolean
}

export interface SelectOption<T extends string = string> {
  label: string
  value: T
}

// -----------------------------------------------------------------------------
// ONBOARDING (Admin Check-In Flow)
// -----------------------------------------------------------------------------

export type OnboardingStatus =
  | 'pending_info'
  | 'info_submitted'
  | 'tasks_created'
  | 'training_complete'
  | 'medical_complete'
  | 'ready_for_checkin'
  | 'checked_in'

export interface OnboardingRecord {
  id: string
  name: string
  company: string
  role: string
  nationality: string
  passportNumber: string
  emergencyContact: string
  emergencyPhone: string
  arrivalDate: string
  status: OnboardingStatus
  trainingTaskId: string | null
  trainingStatus: 'not_created' | 'pending' | 'in_progress' | 'completed'
  trainingAssignedTo: string | null
  medicalTaskId: string | null
  medicalStatus: 'not_created' | 'pending' | 'in_progress' | 'completed'
  medicalAssignedTo: string | null
  rigId: string
}

// -----------------------------------------------------------------------------
// ROOM ALLOCATION
// -----------------------------------------------------------------------------

export type RoomType = 'single' | 'double' | 'quad'

export interface RoomOccupant {
  name: string
  initials: string
  color: string
  personnelId: string
}

export interface Room {
  number: string
  type: RoomType
  beds: number
  deck: string
  occupants: RoomOccupant[]
}

// -----------------------------------------------------------------------------
// MATERIAL ALLOCATION & ORDERING
// -----------------------------------------------------------------------------

export type AllocationStatus = 'active' | 'returned' | 'lost'

export interface MaterialAllocation {
  id: string
  itemId: string
  itemName: string
  partNumber: string
  allocatedToId: string
  allocatedToName: string
  quantity: number
  unit: string
  allocatedDate: string
  returnDate: string | null
  status: AllocationStatus
  notes: string
}

export type OrderStatus = 'draft' | 'submitted' | 'approved' | 'ordered' | 'shipped' | 'received'

export interface OrderItem {
  itemId: string
  itemName: string
  partNumber: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface MaterialOrder {
  id: string
  orderNumber: string
  items: OrderItem[]
  requestedBy: string
  requestDate: string
  status: OrderStatus
  supplier: string
  expectedDelivery: string
  totalAmount: number
  notes: string
  rigId: string
}

// -----------------------------------------------------------------------------
// TRAINING & HSE EVENTS
// -----------------------------------------------------------------------------

export type TrainingStatus = 'valid' | 'expiring' | 'expired'

export interface TrainingRecord {
  id: string
  personnelId: string
  personnelName: string
  trainingName: string
  provider: string
  completedDate: string
  expiryDate: string
  status: TrainingStatus
  certificateNumber: string
  department: Department
  rigId: string
}

export type HseEventType =
  | 'safety_meeting'
  | 'drill'
  | 'inspection'
  | 'training_session'
  | 'toolbox_talk'

export interface HseEvent {
  id: string
  type: HseEventType
  title: string
  date: string
  time: string
  location: string
  conductor: string
  attendeeCount: number
  notes: string
  status: 'scheduled' | 'completed' | 'cancelled'
  rigId: string
}

// -----------------------------------------------------------------------------
// HR ACTIVITIES
// -----------------------------------------------------------------------------

export type LeaveType = 'annual' | 'sick' | 'emergency' | 'compassionate' | 'unpaid'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  approvedBy: string | null
  submittedDate: string
  rigId: string
}

export type HrActionType = 'promotion' | 'demotion' | 'transfer' | 'termination' | 'warning'

export interface HrAction {
  id: string
  employeeId: string
  employeeName: string
  actionType: HrActionType
  effectiveDate: string
  description: string
  fromPosition: string
  toPosition: string
  status: 'pending' | 'approved' | 'completed'
  initiatedBy: string
  initiatedDate: string
  rigId: string
}
