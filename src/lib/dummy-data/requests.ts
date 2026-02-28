// ============================================================
// REQUESTS DUMMY DATA
// Oil & Gas Operations Management Platform — ADI
// ============================================================

export type RequestType =
  | 'document_review'
  | 'document_approval'
  | 'moc_review'
  | 'moc_approval'
  | 'nco_review'
  | 'capa_review'
  | 'audit_schedule'
  | 'audit_finding'
  | 'asset_inspection'
  | 'maintenance_request'
  | 'material_request'
  | 'personnel_request'
  | 'training_request'
  | 'permit_request'
  | 'incident_report';

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
  | 'on_hold';

export type Priority = 'critical' | 'urgent' | 'high' | 'routine' | 'planned';

export type SlaStatus = 'on_track' | 'at_risk' | 'overdue';

export interface SlaInfo {
  status: SlaStatus;
  deadlineDate: string;
  hoursRemaining?: number;
  targetResponseHours: number;
}

export interface RequestComment {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorAvatarColor: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

export interface RequestAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface Request {
  id: string;
  title: string;
  type: RequestType;
  status: RequestStatus;
  priority: Priority;
  sla: SlaInfo;
  submittedById: string;
  submittedByName: string;
  submittedByInitials: string;
  submittedByAvatarColor: string;
  assignedToId: string | null;
  assignedToName: string | null;
  assignedToInitials: string | null;
  assignedToAvatarColor: string | null;
  rigId: string | null;
  rigName: string | null;
  department: string;
  description: string;
  relatedDocumentNumber?: string;
  relatedRecordId?: string;
  submittedDate: string;
  acknowledgedDate?: string;
  completedDate?: string;
  dueDate: string;
  comments: RequestComment[];
  attachments: RequestAttachment[];
  tags: string[];
}

// ============================================================
// PERSONA REFERENCE
// ============================================================
// usr-emp-001  | Ahmed Al-Rashid     | AA | #64748B | employee           | rig_operations | Driller
// usr-rm-001   | Emma Richards       | ER | #1E3A5F | rig_manager        | rig_operations | Rig Manager
// usr-dm-001   | Sarah Johnson       | SJ | #0E7490 | department_manager | quality        | Quality Manager
// usr-lm-001   | Khalid Al-Mansour   | KM | #0F766E | department_manager | logistics      | Logistics Manager
// usr-hse-001  | James Okonkwo       | JO | #C2410C | employee           | rig_operations | HSE Officer
// usr-med-001  | Dr. Fatima Al-Harbi | FA | #047857 | employee           | rig_operations | Rig Medic
// usr-cm-001   | David Okafor        | DO | #6D28D9 | company_manager    | rig_operations | Operations Director
// usr-sa-001   | Michael Torres      | MT | #991B1B | system_admin       | rig_operations | System Administrator
// usr-adm-001  | Nadia Petrova       | NP | #7C3AED | employee           | rig_operations | Rig Administrator
// usr-qs-001   | Omar Al-Faiz        | OF | #1D4ED8 | employee           | quality        | Quality Inspector

export const REQUESTS: Request[] = [
  // ════════════════════════════════════════════════════════════
  // GROUP A: SUBMITTED / PENDING_ACK (not yet accepted) — 10 requests
  // Appear in Incoming Queue of target dept AND My Submitted of originator.
  // assignedToId = null (nobody accepted yet)
  // ════════════════════════════════════════════════════════════

  // A1: Ahmed → Quality dept: Document review for BOP procedure
  {
    id: 'DRQ-2026-001',
    title: 'Document Review — BOP Test Procedure Rev 3 (ADI-RIG-PROC-017)',
    type: 'document_review',
    status: 'submitted',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-07',
      hoursRemaining: 168,
      targetResponseHours: 72,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Quality',
    description:
      'Updated BOP test procedure Rev 3 requires Quality department review prior to implementation. Changes include revised pressure test sequences for 13-5/8" Cameron Type U rams, updated test chart documentation requirements, and addition of function-test interval table per API RP 53.',
    relatedDocumentNumber: 'ADI-RIG-PROC-017',
    submittedDate: '2026-02-26T07:30:00Z',
    dueDate: '2026-03-07',
    comments: [],
    attachments: [],
    tags: ['Document Review', 'BOP', 'Procedure', 'Quality'],
  },

  // A2: Ahmed → Logistics dept: Material request for drill bits
  {
    id: 'DRQ-2026-002',
    title: 'Material Request — 12-1/4" PDC Drill Bits for Rig Alpha Section',
    type: 'material_request',
    status: 'submitted',
    priority: 'urgent',
    sla: {
      status: 'at_risk',
      deadlineDate: '2026-03-05',
      hoursRemaining: 72,
      targetResponseHours: 48,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Logistics',
    description:
      'Requesting 3x Smith Bits SDi616 12-1/4" PDC bits for upcoming intermediate section on Well ADB-52. Current bit inventory depleted after last run. Delivery to Rig Alpha required before 5 March. Rental basis from Halliburton.',
    submittedDate: '2026-02-27T06:00:00Z',
    dueDate: '2026-03-05',
    comments: [],
    attachments: [],
    tags: ['Material Request', 'Drill Bit', 'PDC', 'Rig Alpha'],
  },

  // A3: Emma → Quality dept: MOC review
  {
    id: 'DRQ-2026-003',
    title: 'MOC Review — Mud System Chemical Supplier Change (MOC-2026-004)',
    type: 'moc_review',
    status: 'pending_ack',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-15',
      hoursRemaining: 360,
      targetResponseHours: 168,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-bravo',
    rigName: 'Rig Bravo',
    department: 'Quality',
    description:
      'Management of Change review requested for switching WBM chemical supplier from Gulf Chemicals Ltd to Baroid IDP on Rig Bravo. Lab compatibility testing completed with equivalent performance confirmed. Estimated annual cost savings of SAR 380,000. Quality review and risk assessment required per ADI-QMS-PROC-012.',
    relatedRecordId: 'MOC-2026-004',
    submittedDate: '2026-02-25T10:00:00Z',
    dueDate: '2026-03-15',
    comments: [],
    attachments: [],
    tags: ['MOC', 'Mud System', 'Chemical', 'Supplier Change'],
  },

  // A4: Emma → Logistics dept: Equipment rental request
  {
    id: 'DRQ-2026-004',
    title: 'Material Request — Temporary Mud Pump Rental for Rig Alpha',
    type: 'material_request',
    status: 'submitted',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-10',
      hoursRemaining: 240,
      targetResponseHours: 72,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Logistics',
    description:
      'Mud pump #2 (National Oilwell 12-P-160) scheduled for liner replacement. Requesting temporary rental pump from NOV for 14-day period to maintain dual-pump capability during 12-1/4" section drilling. Delivery and rigup support required.',
    submittedDate: '2026-02-26T09:00:00Z',
    dueDate: '2026-03-10',
    comments: [],
    attachments: [],
    tags: ['Equipment Rental', 'Mud Pump', 'Rig Alpha'],
  },

  // A5: Sarah → Rig Operations dept: Inspection schedule request
  {
    id: 'DRQ-2026-005',
    title: 'Asset Inspection — Q1 2026 Rig Equipment Inspection Schedule',
    type: 'asset_inspection',
    status: 'submitted',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-12',
      hoursRemaining: 288,
      targetResponseHours: 120,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Quality department requires rig operations to coordinate the Q1 2026 scheduled equipment inspection plan for Rig Alpha. This covers lifting equipment, pressure-containing equipment, and safety-critical items per ADI-QMS-PROC-009. Rig ops to provide access windows and isolation requirements.',
    submittedDate: '2026-02-24T08:00:00Z',
    dueDate: '2026-03-12',
    comments: [],
    attachments: [],
    tags: ['Inspection', 'Q1 Schedule', 'Equipment', 'Rig Alpha'],
  },

  // A6: Khalid → Rig Operations dept: Delivery coordination notice
  {
    id: 'DRQ-2026-006',
    title: 'Material Request — Casing Delivery Coordination for Rig Bravo',
    type: 'material_request',
    status: 'pending_ack',
    priority: 'urgent',
    sla: {
      status: 'at_risk',
      deadlineDate: '2026-03-03',
      hoursRemaining: 48,
      targetResponseHours: 24,
    },
    submittedById: 'usr-lm-001',
    submittedByName: 'Khalid Al-Mansour',
    submittedByInitials: 'KM',
    submittedByAvatarColor: '#0F766E',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-bravo',
    rigName: 'Rig Bravo',
    department: 'Rig Operations',
    description:
      'Logistics has dispatched 9-5/8" L80 casing (127 joints) from Dammam warehouse. ETA at Rig Bravo location: 3 March 2026 0600 hrs. Rig operations must confirm crane availability, pipe rack space, and tally crew readiness for offloading.',
    submittedDate: '2026-02-27T14:00:00Z',
    dueDate: '2026-03-03',
    comments: [],
    attachments: [],
    tags: ['Casing', 'Delivery', 'Coordination', 'Rig Bravo'],
  },

  // A7: James → Quality dept: Stop card follow-up report
  {
    id: 'DRQ-2026-007',
    title: 'Incident Report — Stop Card Follow-Up: Unsecured Load on Catwalk',
    type: 'incident_report',
    status: 'submitted',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-06',
      hoursRemaining: 144,
      targetResponseHours: 48,
    },
    submittedById: 'usr-hse-001',
    submittedByName: 'James Okonkwo',
    submittedByInitials: 'JO',
    submittedByAvatarColor: '#C2410C',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Quality',
    description:
      'Stop card SC-2026-089 raised on 26 Feb 2026 for unsecured tubular load on Rig Alpha V-door catwalk. Immediate corrective action taken onsite. Quality department review required to determine if systemic issue exists and whether CAPA is warranted per ADI-QMS-PROC-005.',
    relatedRecordId: 'SC-2026-089',
    submittedDate: '2026-02-27T08:00:00Z',
    dueDate: '2026-03-06',
    comments: [],
    attachments: [],
    tags: ['Stop Card', 'HSE', 'Catwalk', 'Quality Review'],
  },

  // A8: Fatima → Logistics dept: Medical supply order
  {
    id: 'DRQ-2026-008',
    title: 'Material Request — Medical Supply Replenishment for Rig Alpha Clinic',
    type: 'material_request',
    status: 'submitted',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-14',
      hoursRemaining: 336,
      targetResponseHours: 72,
    },
    submittedById: 'usr-med-001',
    submittedByName: 'Dr. Fatima Al-Harbi',
    submittedByInitials: 'FA',
    submittedByAvatarColor: '#047857',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Logistics',
    description:
      'Monthly medical supply replenishment for Rig Alpha clinic. Items include: IV fluids (Normal Saline 1L x20, Ringers Lactate x10), wound care supplies, burn dressings, anti-venom stock, and prescription medications as per attached pharmacy list. Cold-chain items require temperature-controlled transport.',
    submittedDate: '2026-02-25T11:00:00Z',
    dueDate: '2026-03-14',
    comments: [],
    attachments: [],
    tags: ['Medical Supply', 'Clinic', 'Rig Alpha', 'Cold Chain'],
  },

  // A9: Nadia → Logistics dept: Catering supply request
  {
    id: 'DRQ-2026-009',
    title: 'Material Request — Catering & Camp Supply Order for Rig Charlie',
    type: 'material_request',
    status: 'submitted',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-10',
      hoursRemaining: 240,
      targetResponseHours: 72,
    },
    submittedById: 'usr-adm-001',
    submittedByName: 'Nadia Petrova',
    submittedByInitials: 'NP',
    submittedByAvatarColor: '#7C3AED',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-charlie',
    rigName: 'Rig Charlie',
    department: 'Logistics',
    description:
      'Bi-weekly catering and camp supply order for Rig Charlie. Current POB: 68 personnel. Dry goods, fresh produce, dairy, and cleaning supplies as per attached requisition form RIG-C-CAT-026-04. Delivery requested by 10 March.',
    submittedDate: '2026-02-26T12:00:00Z',
    dueDate: '2026-03-10',
    comments: [],
    attachments: [],
    tags: ['Catering', 'Camp Supply', 'Rig Charlie'],
  },

  // A10: Omar → Rig Operations dept: Vendor quality alert
  {
    id: 'DRQ-2026-010',
    title: 'Document Review — Vendor Quality Alert: Non-Conforming Drill Collar Threads',
    type: 'document_review',
    status: 'pending_ack',
    priority: 'critical',
    sla: {
      status: 'at_risk',
      deadlineDate: '2026-03-02',
      hoursRemaining: 36,
      targetResponseHours: 24,
    },
    submittedById: 'usr-qs-001',
    submittedByName: 'Omar Al-Faiz',
    submittedByInitials: 'OF',
    submittedByAvatarColor: '#1D4ED8',
    assignedToId: null,
    assignedToName: null,
    assignedToInitials: null,
    assignedToAvatarColor: null,
    rigId: 'rig-bravo',
    rigName: 'Rig Bravo',
    department: 'Rig Operations',
    description:
      'Quality inspection of newly received 8" drill collars (Batch DC-2026-B12) from Tenaris revealed thread profile deviations on 3 of 15 joints. API spec 7-2 tolerance exceeded on pitch diameter. Rig operations must quarantine affected joints immediately and confirm no affected collars are in the active string.',
    relatedRecordId: 'VQA-2026-003',
    submittedDate: '2026-02-27T15:00:00Z',
    dueDate: '2026-03-02',
    comments: [],
    attachments: [],
    tags: ['Vendor Alert', 'Drill Collar', 'Thread', 'Non-Conformance'],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP B: ACKNOWLEDGED / IN_PROGRESS (accepted, being worked on) — 14 requests
  // Appear in My Tasks for assignee AND My Requests for originator.
  // ════════════════════════════════════════════════════════════

  // B11: Ahmed → Logistics, assigned to Khalid: Material reorder
  {
    id: 'DRQ-2026-011',
    title: 'Material Request — Drilling Mud Additives Reorder (Bentonite & Barite)',
    type: 'material_request',
    status: 'acknowledged',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-12',
      hoursRemaining: 288,
      targetResponseHours: 72,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: 'usr-lm-001',
    assignedToName: 'Khalid Al-Mansour',
    assignedToInitials: 'KM',
    assignedToAvatarColor: '#0F766E',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Logistics',
    description:
      'Current mud additive stock at Rig Alpha below minimum operating level. Requesting: 200 sacks Wyoming Bentonite (API Grade), 150 sacks API Barite (4.2 SG), 50 sacks PAC-R polymer. Delivery priority: standard 10-day window.',
    submittedDate: '2026-02-22T07:00:00Z',
    acknowledgedDate: '2026-02-23T09:30:00Z',
    dueDate: '2026-03-12',
    comments: [],
    attachments: [],
    tags: ['Material Request', 'Mud Additives', 'Bentonite', 'Barite'],
  },

  // B12: Ahmed → Quality, assigned to Sarah: NCO investigation
  {
    id: 'DRQ-2026-012',
    title: 'NCO Review — Drill String MPI Non-Conformance (NCO-2026-007)',
    type: 'nco_review',
    status: 'in_progress',
    priority: 'urgent',
    sla: {
      status: 'at_risk',
      deadlineDate: '2026-03-04',
      hoursRemaining: 48,
      targetResponseHours: 48,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: 'usr-dm-001',
    assignedToName: 'Sarah Johnson',
    assignedToInitials: 'SJ',
    assignedToAvatarColor: '#0E7490',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Quality',
    description:
      'MPI inspection of 5" S-135 drill pipe revealed transverse crack indications on 2 tool joints during routine string inspection. NCO raised per ADI-QMS-PROC-005. Affected joints tagged out and quarantined. Root cause investigation in progress — possible fatigue cracking from high-DLS wellbore geometry.',
    relatedRecordId: 'NCO-2026-007',
    submittedDate: '2026-02-24T14:00:00Z',
    acknowledgedDate: '2026-02-25T08:00:00Z',
    dueDate: '2026-03-04',
    comments: [],
    attachments: [],
    tags: ['NCO', 'MPI', 'Drill String', 'Root Cause'],
  },

  // B13: Emma → Quality, assigned to Omar: Audit finding review
  {
    id: 'DRQ-2026-013',
    title: 'Audit Finding — ADI Internal Audit AUD-2026-001 Corrective Action Review',
    type: 'audit_finding',
    status: 'acknowledged',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-20',
      hoursRemaining: 480,
      targetResponseHours: 168,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: 'usr-qs-001',
    assignedToName: 'Omar Al-Faiz',
    assignedToInitials: 'OF',
    assignedToAvatarColor: '#1D4ED8',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Quality',
    description:
      'Three minor findings from January 2026 internal audit (AUD-2026-001) require corrective action review. Finding 1: Incomplete torque records for BHA connections. Finding 2: Overdue calibration on weight indicator. Finding 3: Missing sign-off on daily mud check sheets for 4 consecutive days.',
    relatedRecordId: 'AUD-2026-001',
    submittedDate: '2026-02-20T09:00:00Z',
    acknowledgedDate: '2026-02-21T10:00:00Z',
    dueDate: '2026-03-20',
    comments: [],
    attachments: [],
    tags: ['Audit', 'Corrective Action', 'AUD-2026-001'],
  },

  // B14: Emma → Logistics, assigned to Khalid: Rig move logistics
  {
    id: 'DRQ-2026-014',
    title: 'Material Request — Rig Charlie Skidding Equipment & Logistics',
    type: 'material_request',
    status: 'in_progress',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-08',
      hoursRemaining: 192,
      targetResponseHours: 96,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: 'usr-lm-001',
    assignedToName: 'Khalid Al-Mansour',
    assignedToInitials: 'KM',
    assignedToAvatarColor: '#0F766E',
    rigId: 'rig-charlie',
    rigName: 'Rig Charlie',
    department: 'Logistics',
    description:
      'Rig Charlie inter-well skid planned for 8 March 2026. Logistics coordination required for: hydraulic skidding jacks (4 units), skid beams, crane mats for cellar area, and 2x Liebherr LTM 1300 cranes. Transport permits for oversize loads to be arranged.',
    submittedDate: '2026-02-22T08:00:00Z',
    acknowledgedDate: '2026-02-23T11:00:00Z',
    dueDate: '2026-03-08',
    comments: [],
    attachments: [],
    tags: ['Rig Move', 'Skidding', 'Logistics', 'Rig Charlie'],
  },

  // B15: Sarah → Rig Ops, assigned to Emma: Quality audit prep
  {
    id: 'DRQ-2026-015',
    title: 'Audit Schedule — Q1 2026 Quality Audit Preparation for Rig Alpha',
    type: 'audit_schedule',
    status: 'acknowledged',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-18',
      hoursRemaining: 432,
      targetResponseHours: 168,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: 'usr-rm-001',
    assignedToName: 'Emma Richards',
    assignedToInitials: 'ER',
    assignedToAvatarColor: '#1E3A5F',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Quality department has scheduled the Q1 2026 audit for Rig Alpha from 18-20 March. Rig Manager to ensure all departmental records, permits, certifications, and training records are current and accessible. Pre-audit checklist ADI-QMS-AUD-CHK-001 to be completed.',
    submittedDate: '2026-02-18T08:00:00Z',
    acknowledgedDate: '2026-02-19T09:00:00Z',
    dueDate: '2026-03-18',
    comments: [],
    attachments: [],
    tags: ['Audit', 'Q1 2026', 'Preparation', 'Rig Alpha'],
  },

  // B16: Sarah → Rig Ops, assigned to James: HSE training audit
  {
    id: 'DRQ-2026-016',
    title: 'Training Request — HSE Training Records Audit & Gap Analysis',
    type: 'training_request',
    status: 'in_progress',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-10',
      hoursRemaining: 240,
      targetResponseHours: 96,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: 'usr-hse-001',
    assignedToName: 'James Okonkwo',
    assignedToInitials: 'JO',
    assignedToAvatarColor: '#C2410C',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Quality department requires comprehensive HSE training records audit for all Rig Alpha personnel. HSE Officer to compile training matrix, identify expired certifications, and provide gap analysis. Focus areas: IWCF well control, H2S awareness, first aid, and working at heights.',
    submittedDate: '2026-02-20T10:00:00Z',
    acknowledgedDate: '2026-02-21T07:00:00Z',
    dueDate: '2026-03-10',
    comments: [],
    attachments: [],
    tags: ['Training', 'HSE', 'Audit', 'Gap Analysis'],
  },

  // B17: Khalid → Rig Ops, assigned to Ahmed: Cargo offload coordination
  {
    id: 'DRQ-2026-017',
    title: 'Material Request — Cargo Offload Coordination for Rig Alpha Delivery',
    type: 'material_request',
    status: 'in_progress',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-04',
      hoursRemaining: 96,
      targetResponseHours: 48,
    },
    submittedById: 'usr-lm-001',
    submittedByName: 'Khalid Al-Mansour',
    submittedByInitials: 'KM',
    submittedByAvatarColor: '#0F766E',
    assignedToId: 'usr-emp-001',
    assignedToName: 'Ahmed Al-Rashid',
    assignedToInitials: 'AA',
    assignedToAvatarColor: '#64748B',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Logistics has arranged delivery of 40 joints 5" S-135 drill pipe and miscellaneous BHA components to Rig Alpha. Ahmed to coordinate rig floor crew for cargo offloading, pipe racking, and tally verification. Delivery ETA: 4 March 0500 hrs. Banksman and rigger required.',
    submittedDate: '2026-02-26T13:00:00Z',
    acknowledgedDate: '2026-02-27T06:00:00Z',
    dueDate: '2026-03-04',
    comments: [],
    attachments: [],
    tags: ['Cargo', 'Offload', 'Drill Pipe', 'Rig Alpha'],
  },

  // B18: James → Rig Ops, assigned to Nadia: Safety equipment request
  {
    id: 'DRQ-2026-018',
    title: 'Material Request — PPE & Safety Equipment Replenishment',
    type: 'material_request',
    status: 'acknowledged',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-14',
      hoursRemaining: 336,
      targetResponseHours: 72,
    },
    submittedById: 'usr-hse-001',
    submittedByName: 'James Okonkwo',
    submittedByInitials: 'JO',
    submittedByAvatarColor: '#C2410C',
    assignedToId: 'usr-adm-001',
    assignedToName: 'Nadia Petrova',
    assignedToInitials: 'NP',
    assignedToAvatarColor: '#7C3AED',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'PPE stock replenishment required: 50x 3M SecureFit safety glasses, 200x disposable foam earplugs, 20x 3M Peltor X4A earmuffs, 30x chemical-resistant nitrile gloves (XL), 10x full-face respirators with organic vapor cartridges. Admin to raise PO through procurement system.',
    submittedDate: '2026-02-24T08:00:00Z',
    acknowledgedDate: '2026-02-25T09:00:00Z',
    dueDate: '2026-03-14',
    comments: [],
    attachments: [],
    tags: ['PPE', 'Safety Equipment', 'Replenishment'],
  },

  // B19: Fatima → Rig Ops, assigned to Nadia: Medical supply log update
  {
    id: 'DRQ-2026-019',
    title: 'Document Review — Medical Supply Inventory Log Update & Reconciliation',
    type: 'document_review',
    status: 'in_progress',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-10',
      hoursRemaining: 240,
      targetResponseHours: 72,
    },
    submittedById: 'usr-med-001',
    submittedByName: 'Dr. Fatima Al-Harbi',
    submittedByInitials: 'FA',
    submittedByAvatarColor: '#047857',
    assignedToId: 'usr-adm-001',
    assignedToName: 'Nadia Petrova',
    assignedToInitials: 'NP',
    assignedToAvatarColor: '#7C3AED',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Clinic medical supply inventory log requires reconciliation with procurement records. Admin to cross-reference physical stock count (completed by Rig Medic) against purchase orders and delivery receipts for February 2026. Discrepancies to be documented and resolved. Controlled substance log to be verified separately.',
    submittedDate: '2026-02-25T14:00:00Z',
    acknowledgedDate: '2026-02-26T08:00:00Z',
    dueDate: '2026-03-10',
    comments: [],
    attachments: [],
    tags: ['Medical Supply', 'Inventory', 'Reconciliation', 'Admin'],
  },

  // B20: Nadia → Quality, assigned to Omar: Document compliance check
  {
    id: 'DRQ-2026-020',
    title: 'Document Review — Rig Alpha Document Control Compliance Check',
    type: 'document_review',
    status: 'acknowledged',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-15',
      hoursRemaining: 360,
      targetResponseHours: 120,
    },
    submittedById: 'usr-adm-001',
    submittedByName: 'Nadia Petrova',
    submittedByInitials: 'NP',
    submittedByAvatarColor: '#7C3AED',
    assignedToId: 'usr-qs-001',
    assignedToName: 'Omar Al-Faiz',
    assignedToInitials: 'OF',
    assignedToAvatarColor: '#1D4ED8',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Quality',
    description:
      'Rig Admin has compiled the Rig Alpha controlled document register for February 2026 review. Quality Inspector to verify all documents are current revision, obsolete copies removed from rig site, and distribution lists up to date per ADI-QMS-PROC-001.',
    submittedDate: '2026-02-21T10:00:00Z',
    acknowledgedDate: '2026-02-22T08:00:00Z',
    dueDate: '2026-03-15',
    comments: [],
    attachments: [],
    tags: ['Document Control', 'Compliance', 'Register Review'],
  },

  // B21: Omar → Rig Ops, assigned to Emma: Inspection follow-up
  {
    id: 'DRQ-2026-021',
    title: 'Asset Inspection — Third-Party Crane Inspection Follow-Up Actions',
    type: 'asset_inspection',
    status: 'in_progress',
    priority: 'high',
    sla: {
      status: 'at_risk',
      deadlineDate: '2026-03-05',
      hoursRemaining: 96,
      targetResponseHours: 72,
    },
    submittedById: 'usr-qs-001',
    submittedByName: 'Omar Al-Faiz',
    submittedByInitials: 'OF',
    submittedByAvatarColor: '#1D4ED8',
    assignedToId: 'usr-rm-001',
    assignedToName: 'Emma Richards',
    assignedToInitials: 'ER',
    assignedToAvatarColor: '#1E3A5F',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Bureau Veritas third-party crane inspection on Rig Alpha main crane (AD-CRN-001) identified 2 observations: worn sheave groove on block and excessive wire rope fleet angle. Rig Manager to schedule corrective maintenance and provide evidence of rectification before next lift operation.',
    submittedDate: '2026-02-24T11:00:00Z',
    acknowledgedDate: '2026-02-25T07:00:00Z',
    dueDate: '2026-03-05',
    comments: [],
    attachments: [],
    tags: ['Crane Inspection', 'Bureau Veritas', 'Follow-Up', 'Rig Alpha'],
  },

  // B22: David → Quality, assigned to Sarah: Annual audit schedule
  {
    id: 'DRQ-2026-022',
    title: 'Audit Schedule — 2026 Annual Quality Audit Program Approval',
    type: 'audit_schedule',
    status: 'in_progress',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-15',
      hoursRemaining: 360,
      targetResponseHours: 168,
    },
    submittedById: 'usr-cm-001',
    submittedByName: 'David Okafor',
    submittedByInitials: 'DO',
    submittedByAvatarColor: '#6D28D9',
    assignedToId: 'usr-dm-001',
    assignedToName: 'Sarah Johnson',
    assignedToInitials: 'SJ',
    assignedToAvatarColor: '#0E7490',
    rigId: null,
    rigName: null,
    department: 'Quality',
    description:
      'Operations Director requires finalized 2026 annual quality audit program covering all three rigs, base operations, and supply chain. Quality Manager to compile audit schedule, assign lead auditors, and confirm client audit windows with Saudi Aramco PSCM.',
    submittedDate: '2026-02-15T09:00:00Z',
    acknowledgedDate: '2026-02-16T10:00:00Z',
    dueDate: '2026-03-15',
    comments: [],
    attachments: [],
    tags: ['Audit Program', '2026 Annual', 'Quality'],
  },

  // B23: Ahmed → Rig Ops, assigned to James: HSE induction request
  {
    id: 'DRQ-2026-023',
    title: 'Training Request — HSE Induction for New Crew Members (Hitch Change)',
    type: 'training_request',
    status: 'acknowledged',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-03',
      hoursRemaining: 72,
      targetResponseHours: 24,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: 'usr-hse-001',
    assignedToName: 'James Okonkwo',
    assignedToInitials: 'JO',
    assignedToAvatarColor: '#C2410C',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Hitch change on 3 March — 4 new crew members arriving for B-crew rotation on Rig Alpha. HSE Officer to conduct rig-specific safety induction, site orientation, emergency muster drill familiarization, and H2S awareness brief prior to crew mobilization to drill floor.',
    submittedDate: '2026-02-27T09:00:00Z',
    acknowledgedDate: '2026-02-27T11:00:00Z',
    dueDate: '2026-03-03',
    comments: [],
    attachments: [],
    tags: ['HSE Induction', 'Training', 'Hitch Change', 'New Crew'],
  },

  // B24: Emma → Rig Ops, assigned to Fatima: Medical clearance check
  {
    id: 'DRQ-2026-024',
    title: 'Personnel Request — Medical Fitness Clearance for Returning Crew',
    type: 'personnel_request',
    status: 'in_progress',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-03',
      hoursRemaining: 72,
      targetResponseHours: 48,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: 'usr-med-001',
    assignedToName: 'Dr. Fatima Al-Harbi',
    assignedToInitials: 'FA',
    assignedToAvatarColor: '#047857',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Two crew members returning from medical leave require fit-for-duty assessment before resuming rig floor duties. Rig Medic to conduct medical fitness evaluation, review treating physician clearance letters, and issue return-to-work certificates per ADI-MED-PROC-003.',
    submittedDate: '2026-02-26T07:00:00Z',
    acknowledgedDate: '2026-02-26T10:00:00Z',
    dueDate: '2026-03-03',
    comments: [],
    attachments: [],
    tags: ['Medical Clearance', 'Fit for Duty', 'Return to Work'],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP C: IN_REVIEW (awaiting manager approval) — 6 requests
  // Appear in My Approvals for dept managers AND My Tasks for assignee.
  // ════════════════════════════════════════════════════════════

  // C25: Ahmed → Quality, assigned to Omar: Doc review → in_review (Sarah approves)
  {
    id: 'DRQ-2026-025',
    title: 'Document Review — Well Control Equipment Maintenance Procedure Rev 5',
    type: 'document_review',
    status: 'in_review',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-08',
      hoursRemaining: 192,
      targetResponseHours: 96,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: 'usr-qs-001',
    assignedToName: 'Omar Al-Faiz',
    assignedToInitials: 'OF',
    assignedToAvatarColor: '#1D4ED8',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Quality',
    description:
      'Revised well control equipment maintenance procedure (Rev 5) reviewed by Quality Inspector. Changes include updated BOP function test frequency, revised annular preventer element inspection criteria, and new choke manifold valve greasing schedule. Awaiting Quality Manager approval.',
    relatedDocumentNumber: 'ADI-RIG-PROC-022-Rev5',
    submittedDate: '2026-02-18T08:00:00Z',
    acknowledgedDate: '2026-02-19T09:00:00Z',
    dueDate: '2026-03-08',
    comments: [],
    attachments: [],
    tags: ['Document Review', 'Well Control', 'Procedure', 'In Review'],
  },

  // C26: James → Quality, assigned to Sarah: Stop card analysis → in_review (Sarah approves)
  {
    id: 'DRQ-2026-026',
    title: 'Incident Report — Monthly Stop Card Trend Analysis (February 2026)',
    type: 'incident_report',
    status: 'in_review',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-10',
      hoursRemaining: 240,
      targetResponseHours: 120,
    },
    submittedById: 'usr-hse-001',
    submittedByName: 'James Okonkwo',
    submittedByInitials: 'JO',
    submittedByAvatarColor: '#C2410C',
    assignedToId: 'usr-dm-001',
    assignedToName: 'Sarah Johnson',
    assignedToInitials: 'SJ',
    assignedToAvatarColor: '#0E7490',
    rigId: null,
    rigName: null,
    department: 'Quality',
    description:
      'February 2026 stop card trend analysis compiled across all three rigs. Total: 47 stop cards (12 unsafe acts, 35 unsafe conditions). Key trends: housekeeping issues on Rig Charlie (+40% vs January), dropped object near-misses on Rig Alpha. Recommended actions drafted. Quality Manager review and approval required.',
    submittedDate: '2026-02-26T10:00:00Z',
    acknowledgedDate: '2026-02-27T08:00:00Z',
    dueDate: '2026-03-10',
    comments: [],
    attachments: [],
    tags: ['Stop Card', 'Trend Analysis', 'Monthly Report', 'HSE'],
  },

  // C27: Sarah → Rig Ops, assigned to James: HSE compliance check → in_review (Emma approves)
  {
    id: 'DRQ-2026-027',
    title: 'Asset Inspection — HSE Compliance Verification for Rig Bravo PTW System',
    type: 'asset_inspection',
    status: 'in_review',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-07',
      hoursRemaining: 168,
      targetResponseHours: 72,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: 'usr-hse-001',
    assignedToName: 'James Okonkwo',
    assignedToInitials: 'JO',
    assignedToAvatarColor: '#C2410C',
    rigId: 'rig-bravo',
    rigName: 'Rig Bravo',
    department: 'Rig Operations',
    description:
      'Quality Manager requested verification of Rig Bravo Permit to Work system compliance. HSE Officer completed audit of PTW register, isolation verification logs, and gas test records for February 2026. 2 minor findings documented. Report awaiting Rig Manager review and approval.',
    submittedDate: '2026-02-20T08:00:00Z',
    acknowledgedDate: '2026-02-21T07:00:00Z',
    dueDate: '2026-03-07',
    comments: [],
    attachments: [],
    tags: ['HSE Compliance', 'PTW', 'Rig Bravo', 'Audit'],
  },

  // C28: Khalid → Rig Ops, assigned to Ahmed: Equipment verification → in_review (Emma approves)
  {
    id: 'DRQ-2026-028',
    title: 'Asset Inspection — Received Equipment Verification & Tally Report',
    type: 'asset_inspection',
    status: 'in_review',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-06',
      hoursRemaining: 144,
      targetResponseHours: 72,
    },
    submittedById: 'usr-lm-001',
    submittedByName: 'Khalid Al-Mansour',
    submittedByInitials: 'KM',
    submittedByAvatarColor: '#0F766E',
    assignedToId: 'usr-emp-001',
    assignedToName: 'Ahmed Al-Rashid',
    assignedToInitials: 'AA',
    assignedToAvatarColor: '#64748B',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Logistics dispatched 25 joints of 9-5/8" L80 casing to Rig Alpha. Driller completed physical tally, thread inspection, and drift verification. All joints tallied and racked. Tally report submitted for Rig Manager review before acceptance sign-off to Logistics.',
    submittedDate: '2026-02-23T06:00:00Z',
    acknowledgedDate: '2026-02-24T07:00:00Z',
    dueDate: '2026-03-06',
    comments: [],
    attachments: [],
    tags: ['Equipment Verification', 'Casing', 'Tally', 'Rig Alpha'],
  },

  // C29: Omar → Logistics, assigned to Khalid: Shipment verification → in_review (Khalid self-reviews)
  {
    id: 'DRQ-2026-029',
    title: 'Material Request — Outbound Shipment Verification for Return-to-Base Equipment',
    type: 'material_request',
    status: 'in_review',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-08',
      hoursRemaining: 192,
      targetResponseHours: 72,
    },
    submittedById: 'usr-qs-001',
    submittedByName: 'Omar Al-Faiz',
    submittedByInitials: 'OF',
    submittedByAvatarColor: '#1D4ED8',
    assignedToId: 'usr-lm-001',
    assignedToName: 'Khalid Al-Mansour',
    assignedToInitials: 'KM',
    assignedToAvatarColor: '#0F766E',
    rigId: 'rig-bravo',
    rigName: 'Rig Bravo',
    department: 'Logistics',
    description:
      'Quality Inspector flagged 8 joints of drill pipe from Rig Bravo as requiring factory re-inspection (thread wear beyond API limits). Logistics Manager to arrange backload manifest, transport documentation, and vendor notification for return shipment to Dammam pipe yard. Verification of packing and labeling completed.',
    submittedDate: '2026-02-22T09:00:00Z',
    acknowledgedDate: '2026-02-23T10:00:00Z',
    dueDate: '2026-03-08',
    comments: [],
    attachments: [],
    tags: ['Shipment', 'Backload', 'Drill Pipe', 'Re-Inspection'],
  },

  // C30: Nadia → Rig Ops, assigned to Ahmed: Admin task review → in_review (Emma approves)
  {
    id: 'DRQ-2026-030',
    title: 'Document Review — Daily Operational Report Template Update Verification',
    type: 'document_review',
    status: 'in_review',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-09',
      hoursRemaining: 216,
      targetResponseHours: 96,
    },
    submittedById: 'usr-adm-001',
    submittedByName: 'Nadia Petrova',
    submittedByInitials: 'NP',
    submittedByAvatarColor: '#7C3AED',
    assignedToId: 'usr-emp-001',
    assignedToName: 'Ahmed Al-Rashid',
    assignedToInitials: 'AA',
    assignedToAvatarColor: '#64748B',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Updated daily operational report (DOR) template with revised KPI fields, NPT classification codes, and well status summary format. Driller reviewed and verified all operational data fields are accurate and align with IADC daily drilling report standards. Awaiting Rig Manager final approval.',
    relatedDocumentNumber: 'ADI-RIG-FORM-DOR-Rev3',
    submittedDate: '2026-02-23T11:00:00Z',
    acknowledgedDate: '2026-02-24T08:00:00Z',
    dueDate: '2026-03-09',
    comments: [],
    attachments: [],
    tags: ['DOR', 'Template', 'Document Review', 'Admin'],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP D: APPROVED — 4 requests
  // Appear in My Requests for originator.
  // ════════════════════════════════════════════════════════════

  // D31: Ahmed → Quality, assigned to Sarah: CAPA review → approved
  {
    id: 'DRQ-2026-031',
    title: 'CAPA Review — Corrective Action for Recurring Mud Weight Deviations (CAPA-2026-003)',
    type: 'capa_review',
    status: 'approved',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-01',
      targetResponseHours: 96,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: 'usr-dm-001',
    assignedToName: 'Sarah Johnson',
    assignedToInitials: 'SJ',
    assignedToAvatarColor: '#0E7490',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Quality',
    description:
      'CAPA raised for recurring mud weight deviations (>0.2 ppg from programmed) on Rig Alpha during 12-1/4" section. Root cause: inconsistent mixing procedures during crew change. Corrective actions include revised mixing SOP, mandatory derrickman competency verification, and installation of automated density monitoring alarm. Quality Manager approved all corrective actions.',
    relatedRecordId: 'CAPA-2026-003',
    submittedDate: '2026-02-14T09:00:00Z',
    acknowledgedDate: '2026-02-15T08:00:00Z',
    dueDate: '2026-03-01',
    comments: [],
    attachments: [],
    tags: ['CAPA', 'Mud Weight', 'Corrective Action', 'Approved'],
  },

  // D32: Emma → Logistics, assigned to Khalid: Rig move approved
  {
    id: 'DRQ-2026-032',
    title: 'Material Request — Rig Bravo Inter-Well Move Logistics Package Approved',
    type: 'material_request',
    status: 'approved',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-10',
      targetResponseHours: 120,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: 'usr-lm-001',
    assignedToName: 'Khalid Al-Mansour',
    assignedToInitials: 'KM',
    assignedToAvatarColor: '#0F766E',
    rigId: 'rig-bravo',
    rigName: 'Rig Bravo',
    department: 'Logistics',
    description:
      'Complete logistics package for Rig Bravo inter-well move approved. Includes: transport permits (oversize loads), crane hire (2x Liebherr LTM 1500), escort vehicle arrangements, road survey clearance, and Saudi Aramco site access permits for new well location ADB-55. Mobilization date confirmed: 10 March 2026.',
    submittedDate: '2026-02-10T08:00:00Z',
    acknowledgedDate: '2026-02-11T09:00:00Z',
    dueDate: '2026-03-10',
    comments: [],
    attachments: [],
    tags: ['Rig Move', 'Logistics', 'Approved', 'Rig Bravo'],
  },

  // D33: Sarah → Rig Ops, assigned to Emma: Procedure update → approved
  {
    id: 'DRQ-2026-033',
    title: 'Document Approval — Rig Alpha Operating Procedures Manual Update Rev 12',
    type: 'document_approval',
    status: 'approved',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-03-01',
      targetResponseHours: 168,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: 'usr-rm-001',
    assignedToName: 'Emma Richards',
    assignedToInitials: 'ER',
    assignedToAvatarColor: '#1E3A5F',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Rig Alpha operating procedures manual Rev 12 update approved by Rig Manager. Key changes: updated tripping procedures for high-angle wellbores, revised kick detection response flowchart, new section on managed pressure drilling operations, and updated emergency contacts and escalation matrix.',
    relatedDocumentNumber: 'ADI-RIG-OPM-001-Rev12',
    submittedDate: '2026-02-08T09:00:00Z',
    acknowledgedDate: '2026-02-09T10:00:00Z',
    dueDate: '2026-03-01',
    comments: [],
    attachments: [],
    tags: ['Document Approval', 'Operating Procedures', 'Rig Alpha', 'Approved'],
  },

  // D34: David → Rig Ops, assigned to Emma: Operations review → approved
  {
    id: 'DRQ-2026-034',
    title: 'Document Approval — Q4 2025 Rig Operations Performance Review',
    type: 'document_approval',
    status: 'approved',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-28',
      targetResponseHours: 168,
    },
    submittedById: 'usr-cm-001',
    submittedByName: 'David Okafor',
    submittedByInitials: 'DO',
    submittedByAvatarColor: '#6D28D9',
    assignedToId: 'usr-rm-001',
    assignedToName: 'Emma Richards',
    assignedToInitials: 'ER',
    assignedToAvatarColor: '#1E3A5F',
    rigId: null,
    rigName: null,
    department: 'Rig Operations',
    description:
      'Q4 2025 operations performance review covering all three rigs. Key metrics: 97.2% rig uptime (target 95%), 3.1 days/1000ft (benchmark 3.5), zero LTIs, 12 NPT events totaling 38 hours. Rig Manager reviewed and approved the report with comments on Rig Charlie mud system NPT reduction plan.',
    submittedDate: '2026-02-05T09:00:00Z',
    acknowledgedDate: '2026-02-06T10:00:00Z',
    dueDate: '2026-02-28',
    comments: [],
    attachments: [],
    tags: ['Performance Review', 'Q4 2025', 'Operations', 'Approved'],
  },

  // ════════════════════════════════════════════════════════════
  // GROUP E: COMPLETED / CLOSED — 11 requests
  // Appear in Completed Tasks for assignee.
  // ════════════════════════════════════════════════════════════

  // E35: Emma submitted → Rig Ops, assigned to Ahmed, completed: Drill string check
  {
    id: 'DRQ-2026-035',
    title: 'Asset Inspection — 5" Drill String Visual & MPI Inspection',
    type: 'asset_inspection',
    status: 'completed',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-22',
      targetResponseHours: 72,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: 'usr-emp-001',
    assignedToName: 'Ahmed Al-Rashid',
    assignedToInitials: 'AA',
    assignedToAvatarColor: '#64748B',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Complete visual and MPI inspection of 5" S-135 drill string (180 joints) prior to 8-1/2" production section. All connections inspected, hardbanding measured, and tool joint OD verified. 2 joints rejected (sub-minimum OD). Inspection report filed.',
    submittedDate: '2026-02-16T06:00:00Z',
    completedDate: '2026-02-21T16:00:00Z',
    dueDate: '2026-02-22',
    comments: [],
    attachments: [],
    tags: ['Drill String', 'Inspection', 'MPI', 'Completed'],
  },

  // E36: Sarah submitted → Quality, assigned to Ahmed, closed: Well control test
  {
    id: 'DRQ-2026-036',
    title: 'Asset Inspection — Well Control Equipment Pressure Test Certification',
    type: 'asset_inspection',
    status: 'closed',
    priority: 'critical',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-20',
      targetResponseHours: 48,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: 'usr-emp-001',
    assignedToName: 'Ahmed Al-Rashid',
    assignedToInitials: 'AA',
    assignedToAvatarColor: '#64748B',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Full BOP stack pressure test to 10,000 psi per API RP 53 requirements. All ram preventers, annular preventer, choke and kill lines tested satisfactorily. Test charts recorded and filed. Third-party witness by Saudi Aramco drilling supervisor confirmed. Certificate issued.',
    submittedDate: '2026-02-15T05:00:00Z',
    completedDate: '2026-02-19T14:00:00Z',
    dueDate: '2026-02-20',
    comments: [],
    attachments: [],
    tags: ['BOP Test', 'Well Control', 'Pressure Test', 'Closed'],
  },

  // E37: David submitted → Rig Ops, assigned to Emma, completed: Safety audit
  {
    id: 'DRQ-2026-037',
    title: 'Audit Schedule — Company Safety Leadership Audit for Rig Alpha',
    type: 'audit_schedule',
    status: 'completed',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-25',
      targetResponseHours: 120,
    },
    submittedById: 'usr-cm-001',
    submittedByName: 'David Okafor',
    submittedByInitials: 'DO',
    submittedByAvatarColor: '#6D28D9',
    assignedToId: 'usr-rm-001',
    assignedToName: 'Emma Richards',
    assignedToInitials: 'ER',
    assignedToAvatarColor: '#1E3A5F',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Operations Director conducted safety leadership audit on Rig Alpha. Rig Manager facilitated site tour, crew interviews, and documentation review. Audit covered: safety observation program, PTW compliance, emergency preparedness, and leadership engagement. Report submitted with 1 commendation and 2 recommendations.',
    submittedDate: '2026-02-12T08:00:00Z',
    completedDate: '2026-02-24T17:00:00Z',
    dueDate: '2026-02-25',
    comments: [],
    attachments: [],
    tags: ['Safety Audit', 'Leadership', 'Completed', 'Rig Alpha'],
  },

  // E38: Omar submitted → Quality, assigned to Sarah, completed: NCO closure
  {
    id: 'DRQ-2026-038',
    title: 'NCO Review — Closure of Cementing Non-Conformance (NCO-2026-003)',
    type: 'nco_review',
    status: 'completed',
    priority: 'urgent',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-24',
      targetResponseHours: 72,
    },
    submittedById: 'usr-qs-001',
    submittedByName: 'Omar Al-Faiz',
    submittedByInitials: 'OF',
    submittedByAvatarColor: '#1D4ED8',
    assignedToId: 'usr-dm-001',
    assignedToName: 'Sarah Johnson',
    assignedToInitials: 'SJ',
    assignedToAvatarColor: '#0E7490',
    rigId: 'rig-bravo',
    rigName: 'Rig Bravo',
    department: 'Quality',
    description:
      'NCO-2026-003 raised for cement slurry density deviation of 0.3 ppg below design on Rig Bravo 13-3/8" casing job. Root cause: batch mixer calibration drift. Corrective actions completed: mixer recalibrated, densitometer cross-checked, and revised pre-job checklist implemented. Quality Manager verified and closed NCO.',
    relatedRecordId: 'NCO-2026-003',
    submittedDate: '2026-02-15T14:00:00Z',
    completedDate: '2026-02-23T15:00:00Z',
    dueDate: '2026-02-24',
    comments: [],
    attachments: [],
    tags: ['NCO', 'Cementing', 'Closure', 'Completed'],
  },

  // E39: Emma submitted → Logistics, assigned to Khalid, completed: Material dispatch
  {
    id: 'DRQ-2026-039',
    title: 'Material Request — Emergency Mud Motor Dispatch to Rig Alpha',
    type: 'material_request',
    status: 'completed',
    priority: 'critical',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-18',
      targetResponseHours: 12,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: 'usr-lm-001',
    assignedToName: 'Khalid Al-Mansour',
    assignedToInitials: 'KM',
    assignedToAvatarColor: '#0F766E',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Logistics',
    description:
      'Emergency dispatch of replacement 9-5/8" mud motor after downhole failure on Rig Alpha. Motor sourced from Dammam base stock. Hot-shot transport arranged with armed escort. Delivered to rig within 8 hours of request. Rig back on bottom within 14 hours total.',
    submittedDate: '2026-02-17T02:00:00Z',
    completedDate: '2026-02-17T16:00:00Z',
    dueDate: '2026-02-18',
    comments: [],
    attachments: [],
    tags: ['Emergency', 'Mud Motor', 'Hot-Shot', 'Completed'],
  },

  // E40: Sarah submitted → Rig Ops, assigned to James, completed: Training session
  {
    id: 'DRQ-2026-040',
    title: 'Training Request — H2S Awareness Refresher Course for Rig Alpha Crew',
    type: 'training_request',
    status: 'completed',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-22',
      targetResponseHours: 120,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: 'usr-hse-001',
    assignedToName: 'James Okonkwo',
    assignedToInitials: 'JO',
    assignedToAvatarColor: '#C2410C',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'H2S awareness refresher training for all Rig Alpha personnel (68 POB). Training conducted over 3 sessions to cover both day and night shifts. Included classroom theory, SCBA donning drill, and cascade system operation. All personnel certified. Training records updated in HR system.',
    submittedDate: '2026-02-10T08:00:00Z',
    completedDate: '2026-02-21T17:00:00Z',
    dueDate: '2026-02-22',
    comments: [],
    attachments: [],
    tags: ['Training', 'H2S', 'Refresher', 'Completed'],
  },

  // E41: Ahmed submitted → Rig Ops, assigned to James, closed: Fire drill coordination
  {
    id: 'DRQ-2026-041',
    title: 'Permit Request — Rig Alpha Emergency Muster & Fire Drill Exercise',
    type: 'permit_request',
    status: 'closed',
    priority: 'high',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-15',
      targetResponseHours: 48,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: 'usr-hse-001',
    assignedToName: 'James Okonkwo',
    assignedToInitials: 'JO',
    assignedToAvatarColor: '#C2410C',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Quarterly emergency muster and fire drill exercise conducted on Rig Alpha. All crew mustered within 4 minutes (target: 5 minutes). Fire pump tested, hose reels deployed, and SCBA checks completed. Two crew members required re-training on SCBA donning. Drill report filed and closed.',
    submittedDate: '2026-02-10T06:00:00Z',
    completedDate: '2026-02-14T18:00:00Z',
    dueDate: '2026-02-15',
    comments: [],
    attachments: [],
    tags: ['Fire Drill', 'Muster', 'Emergency', 'Closed'],
  },

  // E42: Emma submitted → Rig Ops, assigned to Fatima, completed: Medical clearance
  {
    id: 'DRQ-2026-042',
    title: 'Personnel Request — Pre-Mobilization Medical Screening for New Hires',
    type: 'personnel_request',
    status: 'completed',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-20',
      targetResponseHours: 72,
    },
    submittedById: 'usr-rm-001',
    submittedByName: 'Emma Richards',
    submittedByInitials: 'ER',
    submittedByAvatarColor: '#1E3A5F',
    assignedToId: 'usr-med-001',
    assignedToName: 'Dr. Fatima Al-Harbi',
    assignedToInitials: 'FA',
    assignedToAvatarColor: '#047857',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Pre-mobilization medical screening completed for 3 new hire personnel joining Rig Alpha. Full OGUK-equivalent medical conducted including audiometry, spirometry, vision test, drug & alcohol screening, and physical fitness assessment. All 3 candidates cleared fit for duty. Medical certificates issued and filed.',
    submittedDate: '2026-02-14T09:00:00Z',
    completedDate: '2026-02-19T15:00:00Z',
    dueDate: '2026-02-20',
    comments: [],
    attachments: [],
    tags: ['Medical Screening', 'New Hire', 'Fit for Duty', 'Completed'],
  },

  // E43: James submitted → Rig Ops, assigned to Nadia, completed: POB reconciliation
  {
    id: 'DRQ-2026-043',
    title: 'Document Review — February 2026 POB Reconciliation & Manning Report',
    type: 'document_review',
    status: 'completed',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-26',
      targetResponseHours: 72,
    },
    submittedById: 'usr-hse-001',
    submittedByName: 'James Okonkwo',
    submittedByInitials: 'JO',
    submittedByAvatarColor: '#C2410C',
    assignedToId: 'usr-adm-001',
    assignedToName: 'Nadia Petrova',
    assignedToInitials: 'NP',
    assignedToAvatarColor: '#7C3AED',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    description:
      'Monthly Personnel on Board reconciliation for Rig Alpha — February 2026. Admin verified T-card system matches digital POB register, confirmed all personnel have valid rig access badges, and reconciled accommodation assignments. Max POB during month: 72 (capacity: 80). Report filed to HSE.',
    submittedDate: '2026-02-22T10:00:00Z',
    completedDate: '2026-02-25T16:00:00Z',
    dueDate: '2026-02-26',
    comments: [],
    attachments: [],
    tags: ['POB', 'Reconciliation', 'Manning', 'Completed'],
  },

  // E44: Sarah submitted → Quality, assigned to Omar, completed: Document verification
  {
    id: 'DRQ-2026-044',
    title: 'Document Review — Controlled Document Distribution Verification (Q4 2025)',
    type: 'document_review',
    status: 'completed',
    priority: 'planned',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-18',
      targetResponseHours: 120,
    },
    submittedById: 'usr-dm-001',
    submittedByName: 'Sarah Johnson',
    submittedByInitials: 'SJ',
    submittedByAvatarColor: '#0E7490',
    assignedToId: 'usr-qs-001',
    assignedToName: 'Omar Al-Faiz',
    assignedToInitials: 'OF',
    assignedToAvatarColor: '#1D4ED8',
    rigId: null,
    rigName: null,
    department: 'Quality',
    description:
      'Quarterly verification that all controlled documents across three rigs and base are at current revision. Quality Inspector verified 247 controlled documents, confirmed 3 obsolete copies removed from Rig Charlie, and updated the master distribution matrix. Full compliance achieved.',
    submittedDate: '2026-02-05T09:00:00Z',
    completedDate: '2026-02-17T17:00:00Z',
    dueDate: '2026-02-18',
    comments: [],
    attachments: [],
    tags: ['Document Control', 'Verification', 'Q4 2025', 'Completed'],
  },

  // E45: Ahmed submitted → Logistics, assigned to Khalid, closed: Backload processing
  {
    id: 'DRQ-2026-045',
    title: 'Material Request — Rig Alpha Backload Processing (Used BHA Components)',
    type: 'material_request',
    status: 'closed',
    priority: 'routine',
    sla: {
      status: 'on_track',
      deadlineDate: '2026-02-20',
      targetResponseHours: 72,
    },
    submittedById: 'usr-emp-001',
    submittedByName: 'Ahmed Al-Rashid',
    submittedByInitials: 'AA',
    submittedByAvatarColor: '#64748B',
    assignedToId: 'usr-lm-001',
    assignedToName: 'Khalid Al-Mansour',
    assignedToInitials: 'KM',
    assignedToAvatarColor: '#0F766E',
    rigId: 'rig-alpha',
    rigName: 'Rig Alpha',
    department: 'Logistics',
    description:
      'Backload processing for used BHA components from completed 12-1/4" section: 2x stabilizers, 1x near-bit reamer, 3x drill collars, 1x MWD/LWD tool string. All items cleaned, tagged, and manifested. Transport arranged to Dammam pipe yard for inspection and reconditioning. Vendor pickup confirmed and completed.',
    submittedDate: '2026-02-14T07:00:00Z',
    completedDate: '2026-02-19T14:00:00Z',
    dueDate: '2026-02-20',
    comments: [],
    attachments: [],
    tags: ['Backload', 'BHA', 'Completed', 'Closed'],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getRequestById = (id: string): Request | undefined =>
  REQUESTS.find((r) => r.id === id);

export const getRequestsByAssignee = (userId: string): Request[] =>
  REQUESTS.filter((r) => r.assignedToId === userId);

export const getRequestsByStatus = (status: RequestStatus): Request[] =>
  REQUESTS.filter((r) => r.status === status);

export const getRequestsByRig = (rigId: string): Request[] =>
  REQUESTS.filter((r) => r.rigId === rigId);

export const INCOMING_QUEUE_REQUESTS = REQUESTS.filter((r) =>
  ['submitted', 'pending_ack', 'acknowledged'].includes(r.status)
);

export const getRequestsByDepartment = (department: string): Request[] =>
  REQUESTS.filter((r) => r.department.toLowerCase().replace(/\s+/g, '_') === department.toLowerCase().replace(/\s+/g, '_'));

export const getRequestsForUser = (user: { role: string; department: string; id?: string }): Request[] => {
  // Company managers and system admins see all requests
  if (user.role === 'company_manager' || user.role === 'system_admin') {
    return REQUESTS;
  }
  // Department managers see their department's requests
  // Map department enum values to the department strings used in request data
  const deptMapping: Record<string, string[]> = {
    'rig_operations': ['Rig Operations', 'Maintenance'],
    'quality': ['Quality', 'Drilling Engineering'],
    'logistics': ['Logistics'],
    'asset_management': ['Asset Management'],
    'warehouse': ['Warehouse'],
    'security': ['Security'],
  };
  const deptNames = deptMapping[user.department] ?? [user.department];
  return REQUESTS.filter((r) => deptNames.some(d => r.department.toLowerCase() === d.toLowerCase()));
};

export const getTasksForUser = (user: { role: string; department: string; id?: string; jobTitle?: string }): Request[] => {
  // For HSE Officer - show HSE department requests + any training tasks assigned to them
  if (user.jobTitle === 'HSE Officer') {
    return REQUESTS.filter((r) =>
      r.department === 'HSE' ||
      (r.assignedToId === user.id)
    );
  }
  // For Rig Medic - show clinic-related and any medical tasks assigned to them
  if (user.jobTitle === 'Rig Medic') {
    return REQUESTS.filter((r) => r.assignedToId === user.id);
  }
  return getRequestsForUser(user);
};
