// ============================================================
// NOTIFICATIONS DUMMY DATA
// Oil & Gas Operations Management Platform — ADI
// ============================================================

export type NotificationType =
  | 'request_submitted'
  | 'request_assigned'
  | 'request_acknowledged'
  | 'request_completed'
  | 'request_overdue'
  | 'sla_warning'
  | 'sla_breached'
  | 'moc_approved'
  | 'moc_review_required'
  | 'nco_raised'
  | 'nco_disposition_required'
  | 'capa_action_due'
  | 'capa_overdue'
  | 'capa_effectiveness_due'
  | 'audit_finding_open'
  | 'audit_scheduled'
  | 'asset_inspection_due'
  | 'asset_certification_expiry'
  | 'certification_expiring'
  | 'stock_low'
  | 'incident_reported'
  | 'system_alert'
  | 'personnel_change';

export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';

export type NotificationStatus = 'unread' | 'read' | 'dismissed' | 'actioned';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  recipientUserId: string;
  recipientName: string;
  title: string;
  message: string;
  relatedRecordId?: string;
  relatedRecordType?: string;
  relatedRecordTitle?: string;
  rigId?: string;
  rigName?: string;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  senderName?: string;
  senderInitials?: string;
  senderAvatarColor?: string;
  expiresAt?: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'NOTIF-001',
    type: 'sla_breached',
    priority: 'critical',
    status: 'unread',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'SLA Breached — DRQ-2026-002 Overdue by 18 Hours',
    message:
      'NCO Disposition Approval for substandard drill pipe (Rig Bravo) has breached its 24-hour SLA target by 18 hours. Immediate action required.',
    relatedRecordId: 'DRQ-2026-002',
    relatedRecordType: 'request',
    relatedRecordTitle: 'NCO Disposition Approval — Substandard Drill Pipe Discovered in Rig Bravo',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    timestamp: '2026-02-27T04:15:00Z',
    actionUrl: '/requests/DRQ-2026-002',
    actionLabel: 'Review Now',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#B71C1C',
  },
  {
    id: 'NOTIF-002',
    type: 'sla_warning',
    priority: 'high',
    status: 'unread',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'SLA At Risk — DRQ-2026-001 Expires in 8 Hours',
    message:
      'BOP Testing Procedure review request (DRQ-2026-001) from Rig Alpha is at risk — only 8 hours remain before SLA deadline (01 March 2026).',
    relatedRecordId: 'DRQ-2026-001',
    relatedRecordType: 'request',
    relatedRecordTitle: 'Review Revised BOP Testing Procedure — ADI-OPS-PROC-028 Rev 5',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-27T08:00:00Z',
    actionUrl: '/requests/DRQ-2026-001',
    actionLabel: 'Start Review',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#E65100',
  },
  {
    id: 'NOTIF-003',
    type: 'incident_reported',
    priority: 'high',
    status: 'unread',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'Incident Report Filed — Dropped Object Near-Miss, Rig Bravo (26 Feb)',
    message:
      'Peter Okafor has filed an initial incident report for a dropped object near-miss event on Rig Bravo. A 4.5 kg pipe wrench was dropped from 28m. No injuries. SIF potential. Investigation initiated.',
    relatedRecordId: 'DRQ-2026-007',
    relatedRecordType: 'request',
    relatedRecordTitle: 'Near-Miss Dropped Object Incident, Rig Bravo (26 Feb)',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    timestamp: '2026-02-26T05:05:00Z',
    actionUrl: '/requests/DRQ-2026-007',
    actionLabel: 'View Incident',
    senderName: 'Peter Okafor',
    senderInitials: 'PO',
    senderAvatarColor: '#00695C',
  },
  {
    id: 'NOTIF-004',
    type: 'request_submitted',
    priority: 'critical',
    status: 'unread',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'New MOC Approval Request — Emergency Rotary Table Bearing (Rig Alpha)',
    message:
      'Khalid Mahmoud has submitted MOC-2026-004 for emergency approval. Rotary table bearing failed at 03:15 hrs — drilling operations suspended pending QM approval. Response required within 48 hours.',
    relatedRecordId: 'DRQ-2026-003',
    relatedRecordType: 'request',
    relatedRecordTitle: 'MOC Approval — Emergency Rotary Table Bearing Replacement',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-26T14:02:00Z',
    actionUrl: '/requests/DRQ-2026-003',
    actionLabel: 'Review MOC',
    senderName: 'Khalid Mahmoud',
    senderInitials: 'KM',
    senderAvatarColor: '#0277BD',
  },
  {
    id: 'NOTIF-005',
    type: 'capa_effectiveness_due',
    priority: 'medium',
    status: 'unread',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'CAPA Effectiveness Review Due — CAPA-2025-003 (Cement Mixing QA)',
    message:
      'Emma Richards has submitted the effectiveness review evidence for CAPA-2025-003. Three post-CAPA cement jobs have been completed within specification. Your sign-off is required to formally close the CAPA.',
    relatedRecordId: 'CAPA-2025-003',
    relatedRecordType: 'capa',
    relatedRecordTitle: 'Cement Mixing Quality Assurance — Mandatory QE Witness Scheduling Protocol',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-25T13:05:00Z',
    actionUrl: '/quality/capa/CAPA-2025-003',
    actionLabel: 'Review CAPA',
    senderName: 'Emma Richards',
    senderInitials: 'ER',
    senderAvatarColor: '#E91E63',
  },
  {
    id: 'NOTIF-006',
    type: 'audit_finding_open',
    priority: 'high',
    status: 'unread',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'IADC Audit AUD-2025-004 — 3 Major Findings Past Deadline',
    message:
      'Three major findings from the IADC Annual Rig Audit (Rig Alpha, November 2025) are now past their 90-day close-out deadline. Findings relate to Driller KPI documentation, BOP maintenance log, and emergency response drill records.',
    relatedRecordId: 'AUD-2025-004',
    relatedRecordType: 'audit',
    relatedRecordTitle: 'IADC Annual Rig Audit — Rig Alpha',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-22T09:00:00Z',
    actionUrl: '/quality/audits/AUD-2025-004',
    actionLabel: 'View Findings',
    senderName: 'Andrew Campbell',
    senderInitials: 'AC',
    senderAvatarColor: '#FF6D00',
  },
  {
    id: 'NOTIF-007',
    type: 'asset_certification_expiry',
    priority: 'high',
    status: 'read',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'BOP Certification Expiry Warning — AD-201-BOP-001 (90 Days)',
    message:
      'The API 16A certification for BOP Stack AD-201-BOP-001 (Rig Alpha) expires on 31 August 2026 — 90 days from today. 5-year overhaul and recertification planning should commence. Estimated downtime: 21 days.',
    relatedRecordId: 'AD-201-BOP-001',
    relatedRecordType: 'asset',
    relatedRecordTitle: 'Shaffer 13-5/8" 10,000 PSI BOP Stack — Rig Alpha',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-06-02T08:00:00Z',
    actionUrl: '/assets/AD-201-BOP-001',
    actionLabel: 'View Asset',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#1A73E8',
  },
  {
    id: 'NOTIF-008',
    type: 'nco_raised',
    priority: 'critical',
    status: 'unread',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'Critical NCO Raised — Substandard Drill Pipe, Rig Bravo',
    message:
      'Carlos Mendez has raised a new NCO for 6 joints of substandard 5" drill pipe found on Rig Bravo (AD-202). Pipe wall thickness below API 5DP minimum. Items quarantined. Disposition decision required.',
    relatedRecordId: 'DRQ-2026-002',
    relatedRecordType: 'request',
    relatedRecordTitle: 'NCO Disposition — Substandard Drill Pipe, Rig Bravo',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    timestamp: '2026-02-25T06:18:00Z',
    actionUrl: '/requests/DRQ-2026-002',
    actionLabel: 'Action Required',
    senderName: 'Carlos Mendez',
    senderInitials: 'CM',
    senderAvatarColor: '#E65100',
  },
  {
    id: 'NOTIF-009',
    type: 'certification_expiring',
    priority: 'medium',
    status: 'read',
    recipientUserId: 'USR-013',
    recipientName: 'James Cooper',
    title: 'IWCF Certificates Expiring — 4 Rig Alpha Drillers (15 Mar – 10 Apr 2026)',
    message:
      'IWCF Supervisor Level certificates for 4 drillers on Rig Alpha are due to expire between 15 March and 10 April 2026. DRQ-2026-004 has been raised for enrollment. Please review and approve training request.',
    relatedRecordId: 'DRQ-2026-004',
    relatedRecordType: 'request',
    relatedRecordTitle: 'Training Certification Review — Well Control Refresher (IWCF) for 4 Personnel',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-20T10:05:00Z',
    actionUrl: '/requests/DRQ-2026-004',
    actionLabel: 'View Request',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#1A73E8',
  },
  {
    id: 'NOTIF-010',
    type: 'stock_low',
    priority: 'high',
    status: 'unread',
    recipientUserId: 'USR-012',
    recipientName: 'Khalid Al-Harbi',
    title: 'Critical Spare Low Stock — Mud Pump Liner Sets (AD-201 MDP-001)',
    message:
      'Current stock of National 12-P-160 6.5" liner & piston sets is 1 unit (minimum: 3). DRQ-2026-006 raised by Khalid Mahmoud — replacement needed by 02 March 2026. Immediate procurement action required.',
    relatedRecordId: 'WH-MEC-001',
    relatedRecordType: 'inventory',
    relatedRecordTitle: 'Mud Pump Liner & Piston Assembly — National 12-P-160, 6.5"',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-27T07:05:00Z',
    actionUrl: '/warehouse/WH-MEC-001',
    actionLabel: 'View Stock',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#E65100',
  },
  {
    id: 'NOTIF-011',
    type: 'moc_approved',
    priority: 'medium',
    status: 'read',
    recipientUserId: 'USR-008',
    recipientName: 'Khalid Mahmoud',
    title: 'MOC Approved — MOC-2026-004 (Emergency Rotary Table Bearing)',
    message:
      'Hassan Al-Qahtani has approved MOC-2026-004. Proceed with emergency replacement of the National 14-P-220 rotary table bearing using SKF 23256 CACK/W33. Ensure LOTO applied and work per approved JSA.',
    relatedRecordId: 'MOC-2026-004',
    relatedRecordType: 'moc',
    relatedRecordTitle: 'Emergency Replacement of Failed Rotary Table Bearing — Rig Alpha',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-26T15:30:00Z',
    actionUrl: '/quality/moc/MOC-2026-004',
    actionLabel: 'View MOC',
    senderName: 'Hassan Al-Qahtani',
    senderInitials: 'HQ',
    senderAvatarColor: '#1A73E8',
  },
  {
    id: 'NOTIF-012',
    type: 'request_assigned',
    priority: 'medium',
    status: 'read',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'Request Assigned to You — DRQ-2026-008 (CAPA Effectiveness Review)',
    message:
      'DRQ-2026-008 (CAPA-2025-003 Effectiveness Review — Cement Mixing QA) has been assigned to you for approval. Evidence package submitted by Emma Richards is attached.',
    relatedRecordId: 'DRQ-2026-008',
    relatedRecordType: 'request',
    relatedRecordTitle: 'CAPA Effectiveness Review — CAPA-2025-003',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-25T13:02:00Z',
    actionUrl: '/requests/DRQ-2026-008',
    actionLabel: 'View Request',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#1A73E8',
  },
  {
    id: 'NOTIF-013',
    type: 'capa_action_due',
    priority: 'medium',
    status: 'read',
    recipientUserId: 'USR-019',
    recipientName: 'Sami Al-Otaibi',
    title: 'CAPA Action Due — Update Hot Work Permit (CAPA-2025-004)',
    message:
      'Your assigned CAPA action for CAPA-2025-004 (Update Hot Work Permit to require position-specific qualification verification) is due on 01 November 2025. Please update progress.',
    relatedRecordId: 'CAPA-2025-004',
    relatedRecordType: 'capa',
    relatedRecordTitle: 'Welder Qualification Verification — Pre-Job Position Qualification Check',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    timestamp: '2025-10-25T08:00:00Z',
    actionUrl: '/quality/capa/CAPA-2025-004',
    actionLabel: 'Update CAPA',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#1A73E8',
  },
  {
    id: 'NOTIF-014',
    type: 'audit_scheduled',
    priority: 'low',
    status: 'read',
    recipientUserId: 'USR-022',
    recipientName: 'Tom Bradshaw',
    title: 'Audit Scheduled — Bi-Annual HSE Rig Audit, Rig Charlie (15 Oct 2025)',
    message:
      'Andrew Campbell will be conducting the bi-annual HSE Rig Audit on Rig Charlie from 15–17 October 2025. Please ensure rig HSE files, chemical registers, fire equipment records, and DROPS inspection logs are current.',
    relatedRecordId: 'AUD-2025-002',
    relatedRecordType: 'audit',
    relatedRecordTitle: 'Bi-Annual HSE Rig Audit — Rig Charlie',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    timestamp: '2025-10-08T09:00:00Z',
    actionUrl: '/quality/audits/AUD-2025-002',
    actionLabel: 'View Audit',
    senderName: 'Andrew Campbell',
    senderInitials: 'AC',
    senderAvatarColor: '#FF6D00',
  },
  {
    id: 'NOTIF-015',
    type: 'nco_disposition_required',
    priority: 'high',
    status: 'unread',
    recipientUserId: 'USR-006',
    recipientName: 'Ahmed Al-Rashid',
    title: 'NCO Disposition Required — Cement Slurry Density Deviation (NCO-2025-018)',
    message:
      'NCO-2025-018 (Substandard cement slurry density on 13-3/8" casing at Well ADB-52) requires formal disposition decision. CBL/VDL evaluation in progress. Disposition options: (1) Accept as-is with engineering justification, (2) Remedial squeeze cement job.',
    relatedRecordId: 'REQ-2025-178',
    relatedRecordType: 'request',
    relatedRecordTitle: 'NCO Review — Substandard Cement Slurry Density (ADB-52)',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    timestamp: '2026-02-24T08:00:00Z',
    actionUrl: '/requests/REQ-2025-178',
    actionLabel: 'Review NCO',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#E65100',
  },
  {
    id: 'NOTIF-016',
    type: 'asset_inspection_due',
    priority: 'medium',
    status: 'read',
    recipientUserId: 'USR-020',
    recipientName: 'Abdullah Qasim',
    title: 'Asset Inspection Due — AD-202-MAS-001 Derrick Annual Inspection (15 Jan 2026)',
    message:
      'Annual structural inspection for Rig Bravo derrick (AD-202-MAS-001) by Bureau Veritas is due on 15 January 2026. Note: previous inspection found a substandard weld (NCO-2025-002) — weld repair must be completed and verified before this inspection.',
    relatedRecordId: 'AD-202-MAS-001',
    relatedRecordType: 'asset',
    relatedRecordTitle: 'Rig Bravo Derrick / Mast Structure',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    timestamp: '2026-01-01T08:00:00Z',
    actionUrl: '/assets/AD-202-MAS-001',
    actionLabel: 'View Asset',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#1A73E8',
  },
  {
    id: 'NOTIF-017',
    type: 'moc_review_required',
    priority: 'low',
    status: 'read',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'MOC Under Review — Shale Shaker Upgrade (MOC-2026-010, Rig Charlie)',
    message:
      'MOC-2026-010 (Replace Shale Shakers on Rig Charlie with Derrick FLC 513 units) has been submitted for review. Your technical review and approval required. Risk assessment completed. Implementation planned for April 2026 maintenance window.',
    relatedRecordId: 'MOC-2026-010',
    relatedRecordType: 'moc',
    relatedRecordTitle: 'Replace Shale Shakers — Rig Charlie Upgrade to FLC 513',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    timestamp: '2026-01-12T10:00:00Z',
    actionUrl: '/quality/moc/MOC-2026-010',
    actionLabel: 'Review MOC',
    senderName: 'Tom Bradshaw',
    senderInitials: 'TB',
    senderAvatarColor: '#006064',
  },
  {
    id: 'NOTIF-018',
    type: 'request_completed',
    priority: 'low',
    status: 'read',
    recipientUserId: 'USR-015',
    recipientName: 'Carlos Mendez',
    title: 'Request Completed — REQ-2024-165 (Shale Shaker Screen Replacement, Rig Charlie)',
    message:
      'REQ-2024-165 (Shale Shaker Screen Replacement — Rig Charlie) has been marked completed. 20 replacement screen panels installed on all 4 Derrick FLC 500 units on 14 December 2024.',
    relatedRecordId: 'REQ-2024-165',
    relatedRecordType: 'request',
    relatedRecordTitle: 'Maintenance Request — Shale Shaker Screen Replacement AD-203',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    timestamp: '2024-12-14T15:30:00Z',
    actionUrl: '/requests/REQ-2024-165',
    actionLabel: 'View Request',
    senderName: 'Sami Al-Otaibi',
    senderInitials: 'SO',
    senderAvatarColor: '#33691E',
  },
  {
    id: 'NOTIF-019',
    type: 'system_alert',
    priority: 'low',
    status: 'dismissed',
    recipientUserId: 'USR-001',
    recipientName: 'Hassan Al-Qahtani',
    title: 'System Maintenance — MY HP App Update Scheduled (28 Feb 2026 02:00–04:00 AST)',
    message:
      'MY HP App will undergo scheduled system maintenance on 28 February 2026 from 02:00 to 04:00 Arabia Standard Time. The platform will be unavailable during this window. No data will be affected.',
    timestamp: '2026-02-25T12:00:00Z',
    expiresAt: '2026-02-28T04:00:00Z',
    senderName: 'System Administrator',
    senderInitials: 'SA',
    senderAvatarColor: '#546E7A',
  },
  {
    id: 'NOTIF-020',
    type: 'personnel_change',
    priority: 'medium',
    status: 'read',
    recipientUserId: 'USR-013',
    recipientName: 'James Cooper',
    title: 'Personnel — NOV Field Engineer Mobilising to Rig Alpha (24 Feb)',
    message:
      'Ricardo Santos (NOV Top Drive Field Service Engineer) is mobilising to Rig Alpha on 24 February 2026 for TDS-11SA inspection work related to NCO-2025-001 follow-up. Estimated demob: 10 March 2026. POB updated.',
    relatedRecordId: 'PER-008',
    relatedRecordType: 'personnel',
    relatedRecordTitle: 'Ricardo Santos — NOV Field Service Engineer',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    timestamp: '2026-02-23T09:00:00Z',
    actionUrl: '/personnel/PER-008',
    actionLabel: 'View Personnel',
    senderName: 'System Alert',
    senderInitials: 'SY',
    senderAvatarColor: '#1A73E8',
  },
];

// Unread count for current user (Hassan Al-Qahtani)
export const UNREAD_COUNT = NOTIFICATIONS.filter(
  (n) => n.recipientUserId === 'USR-001' && n.status === 'unread'
).length;

export const getNotificationsByUser = (userId: string): Notification[] =>
  NOTIFICATIONS.filter((n) => n.recipientUserId === userId);

export const getUnreadNotifications = (userId: string): Notification[] =>
  NOTIFICATIONS.filter((n) => n.recipientUserId === userId && n.status === 'unread');

export const getNotificationsByType = (type: NotificationType): Notification[] =>
  NOTIFICATIONS.filter((n) => n.type === type);
