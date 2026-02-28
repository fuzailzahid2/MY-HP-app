// ============================================================
// DUMMY DATA — CENTRAL RE-EXPORT
// Oil & Gas Operations Management Platform — ADI
// ============================================================
// Import from this file for all dummy data needs during wireframing.
// Example:
//   import { USERS, RIGS, REQUESTS } from '@/lib/dummy-data'
//   import { MOC_RECORDS, NCO_RECORDS } from '@/lib/dummy-data'
// ============================================================

// ── USERS ───────────────────────────────────────────────────
export {
  USERS,
  CURRENT_USER,
  getUserById,
  getUsersByRig,
} from './users';
export type {
  User,
  UserRole,
  Department,
} from './users';

// ── RIGS ────────────────────────────────────────────────────
export {
  RIGS,
  getRigById,
} from './rigs';
export type {
  Rig,
  RigStatus,
  RigType,
  RigSpecifications,
} from './rigs';

// ── REQUESTS ────────────────────────────────────────────────
export {
  REQUESTS,
  INCOMING_QUEUE_REQUESTS,
  getRequestById,
  getRequestsByAssignee,
  getRequestsByStatus,
  getRequestsByRig,
  getRequestsByDepartment,
  getRequestsForUser,
  getTasksForUser,
} from './requests';
export type {
  Request,
  RequestType,
  RequestStatus,
  Priority,
  SlaStatus,
  SlaInfo,
  RequestComment,
  RequestAttachment,
} from './requests';

// ── QUALITY ─────────────────────────────────────────────────
export {
  // MOC
  MOC_RECORDS,
  getMocById,
  // NCO
  NCO_RECORDS,
  getNcoById,
  // CAPA
  CAPA_RECORDS,
  getCapaById,
  // Audits
  AUDIT_RECORDS,
  ANNUAL_AUDIT_PROGRAMME_2025,
  getAuditById,
} from './quality';
export type {
  // MOC
  MocRecord,
  MocType,
  MocStatus,
  MocPriority,
  // NCO
  NcoRecord,
  NcoSeverity,
  NcoType,
  NcoStatus,
  NcoDisposition,
  // CAPA
  CapaRecord,
  CapaType,
  CapaStatus,
  CapaAction,
  // Audits
  AuditRecord,
  AuditType,
  AuditStatus,
  AuditFinding,
  FindingSeverity,
  AuditProgrammeEntry,
} from './quality';

// ── ASSETS ──────────────────────────────────────────────────
export {
  ASSETS,
  getAssetById,
  getAssetsByRig,
  getAssetsByCategory,
  getAssetsByStatus,
} from './assets';
export type {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetSpecification,
  AssetCertificate,
  AssetInspectionRecord,
  AssetMaintenanceRecord,
  InspectionResult,
} from './assets';

// ── WAREHOUSE ───────────────────────────────────────────────
export {
  INVENTORY_ITEMS,
  WAREHOUSE_SUMMARY,
  getItemById,
  getItemsByCategory,
  getLowStockItems,
  getCriticalSpares,
} from './warehouse';
export type {
  InventoryItem,
  ItemCategory,
  StockStatus,
  UnitOfMeasure,
} from './warehouse';

// ── PERSONNEL ───────────────────────────────────────────────
export {
  PERSONNEL,
  POB_SUMMARY,
  getPersonnelById,
  getPersonnelByRig,
  getExpiringCertifications,
} from './personnel';
export type {
  PersonnelRecord,
  PersonnelType,
  PersonnelStatus,
  BloodGroup,
  MedicalInfo,
  Certification,
} from './personnel';

// ── NOTIFICATIONS ───────────────────────────────────────────
export {
  NOTIFICATIONS,
  UNREAD_COUNT,
  getNotificationsByUser,
  getUnreadNotifications,
  getNotificationsByType,
} from './notifications';
export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
} from './notifications';

// ── ONBOARDING ──────────────────────────────────────────────
export { ONBOARDING_RECORDS } from './onboarding';

// ── HR ACTIVITIES ────────────────────────────────────────────
export { LEAVE_REQUESTS, HR_ACTIONS } from './hr';

// ── MATERIAL ALLOCATIONS ─────────────────────────────────────
export { MATERIAL_ALLOCATIONS } from './material-allocations';

// ── MATERIAL ORDERS ──────────────────────────────────────────
export { MATERIAL_ORDERS } from './material-orders';

// ── HSE ─────────────────────────────────────────────────────
export {
  TRAINING_RECORDS,
  HSE_EVENTS,
} from './hse';
