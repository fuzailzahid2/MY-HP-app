// ============================================================
// QUALITY MODULE DUMMY DATA
// MOC, NCO, CAPA, Audits
// Oil & Gas Operations Management Platform — ADI
// ============================================================

// ────────────────────────────────────────────────────────────
// MOC — Management of Change
// ────────────────────────────────────────────────────────────

export type MocType = 'permanent' | 'temporary' | 'emergency';
export type MocStatus =
  | 'initiated'
  | 'under_review'
  | 'risk_assessment'
  | 'approved'
  | 'implementing'
  | 'verification'
  | 'closed'
  | 'rejected';
export type MocPriority = 'critical' | 'urgent' | 'high' | 'routine' | 'planned';

export interface MocRecord {
  id: string;
  title: string;
  type: MocType;
  status: MocStatus;
  priority: MocPriority;
  rigId: string | null;
  rigName: string | null;
  department: string;
  initiatedById: string;
  initiatedByName: string;
  initiatedByInitials: string;
  initiatedByAvatarColor: string;
  reviewedById?: string;
  reviewedByName?: string;
  approvedById?: string;
  approvedByName?: string;
  description: string;
  justification: string;
  safetyImpact: string;
  environmentalImpact: string;
  operationalImpact: string;
  temporaryDuration?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  initiatedDate: string;
  reviewDeadline: string;
  approvedDate?: string;
  implementationDate?: string;
  closedDate?: string;
  relatedDocuments: string[];
  affectedEquipment: string[];
  tags: string[];
}

export const MOC_RECORDS: MocRecord[] = [
  {
    id: 'MOC-2025-001',
    title: 'BOP Stack Configuration Change — Rig Alpha (Add Pipe Ram Preventer)',
    type: 'permanent',
    status: 'implementing',
    priority: 'high',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    initiatedById: 'USR-005',
    initiatedByName: 'Omar Hassan',
    initiatedByInitials: 'OH',
    initiatedByAvatarColor: '#00897B',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    approvedById: 'USR-013',
    approvedByName: 'James Cooper',
    description:
      'Addition of a 13-5/8" 10,000 PSI Shaffer Type U pipe ram preventer to the existing 4-ram BOP stack on Rig Alpha. The modification is required to comply with updated Saudi Aramco SAES-J-601 (Rev 2025) which mandates an additional pipe ram in the BOP stack configuration for wells with expected H2S above 200 ppm.',
    justification:
      'Saudi Aramco revised SAES-J-601 in Q1 2025 to require an additional pipe ram for sour service wells. Well ADB-47 geo-log confirms H2S up to 350 ppm in the target formation. Compliance deadline: 30 June 2025.',
    safetyImpact:
      'Improved well control capability. Additional ram provides redundancy during kick situations. HAZOP completed 14 Feb 2025 — no unacceptable residual risks identified.',
    environmentalImpact:
      'No negative environmental impact. Enhanced well control reduces blowout risk.',
    operationalImpact:
      'BOP stack height increases by 1.2m. Cellar depth sufficient. Rig down required for 4 days for stack reconfiguration. Well programme milestone shifted by 5 days.',
    riskLevel: 'high',
    initiatedDate: '2025-01-15',
    reviewDeadline: '2025-02-28',
    approvedDate: '2025-03-05',
    implementationDate: '2025-04-10',
    relatedDocuments: ['SAES-J-601 Rev 2025', 'ADI-OPS-PROC-028 Rev 5', 'BOP-STACK-DWG-AD201-Rev3'],
    affectedEquipment: ['AD-201-BOP-001', 'AD-201-BOP-002'],
    tags: ['BOP', 'Well Control', 'Saudi Aramco', 'SAES-J-601', 'Sour Service'],
  },
  {
    id: 'MOC-2025-002',
    title: 'Mud System Chemical Supplier Change — Rig Bravo WBM Programme',
    type: 'permanent',
    status: 'under_review',
    priority: 'routine',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Drilling Engineering',
    initiatedById: 'USR-014',
    initiatedByName: 'Nadia Petrova',
    initiatedByInitials: 'NP',
    initiatedByAvatarColor: '#AD1457',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    description:
      'Proposal to change Water-Based Mud (WBM) chemical supplier from Gulf Chemicals Ltd to Baroid Industrial Drilling Products (IDP) for Rig Bravo ongoing operations. All chemicals are equivalent-grade and have been lab-tested for compatibility with current formulation (12.2 ppg KCl/PHPA/Polymer WBM).',
    justification:
      'Baroid IDP offers equivalent products at 18% lower unit cost. Annual saving estimated at SAR 380,000. Baroid is Saudi Aramco approved vendor. Lab compatibility tests complete.',
    safetyImpact:
      'Chemical MSDS reviewed and equivalent hazard classification confirmed. No change to existing chemical handling procedures required.',
    environmentalImpact:
      'Environmental profiles of new chemicals reviewed. No change to environmental risk rating.',
    operationalImpact:
      'Transition to be performed on next mud system fresh-build. No impact to ongoing operations. System chemistry performance unchanged.',
    riskLevel: 'low',
    initiatedDate: '2025-02-20',
    reviewDeadline: '2025-03-31',
    relatedDocuments: ['ADI-DRILL-MUD-PROG-ADB52', 'Baroid-Product-Equivalency-Matrix-Feb2025.pdf'],
    affectedEquipment: ['AD-202-MDP-001', 'AD-202-MDP-002'],
    tags: ['Mud System', 'WBM', 'Supplier Change', 'Chemical', 'Cost Reduction'],
  },
  {
    id: 'MOC-2025-003',
    title: 'Drilling Fluid Recipe Modification — Increase KCl Concentration to 5% for Shale Inhibition',
    type: 'temporary',
    status: 'risk_assessment',
    priority: 'urgent',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Drilling Engineering',
    initiatedById: 'USR-014',
    initiatedByName: 'Nadia Petrova',
    initiatedByInitials: 'NP',
    initiatedByAvatarColor: '#AD1457',
    description:
      'Temporary increase in KCl concentration from 3% to 5% in the WBM system on Rig Alpha to counteract reactive shale swelling observed in the Wajid Formation at 2,800–3,100m. Cavings and borehole instability are causing connection losses and increased ECD.',
    justification:
      'Elevated KCl concentration required to stabilise reactive shale facies encountered at current depth. Without modification, continued borehole instability risks stuck pipe and significant non-productive time (NPT).',
    safetyImpact:
      'KCl is a saline solution — handling procedures remain unchanged. Increased waste water salt content to be managed per Environmental Management Plan.',
    environmentalImpact:
      'Higher KCl concentration increases produced cuttings salinity. Cuttings disposal contractor notified. Temporary measure — maximum duration 30 days.',
    operationalImpact:
      'KCl addition rate increased. Existing stock at rig site sufficient for 14 days. Resupply scheduled. System to revert to 3% upon completion of Wajid interval.',
    temporaryDuration: '30 days maximum',
    riskLevel: 'medium',
    initiatedDate: '2025-03-10',
    reviewDeadline: '2025-03-17',
    relatedDocuments: ['ADI-DRILL-MUD-PROG-ADB47', 'Wellbore-Stability-Report-ADB47-March2025.pdf'],
    affectedEquipment: ['AD-201-MDP-001', 'AD-201-MDP-002', 'AD-201-MDP-003'],
    tags: ['Drilling Fluid', 'WBM', 'KCl', 'Shale Inhibition', 'Temporary', 'Borehole Stability'],
  },
  {
    id: 'MOC-2026-004',
    title: 'Emergency Replacement of Failed Rotary Table Bearing — Rig Alpha',
    type: 'emergency',
    status: 'approved',
    priority: 'critical',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Maintenance',
    initiatedById: 'USR-008',
    initiatedByName: 'Khalid Mahmoud',
    initiatedByInitials: 'KM',
    initiatedByAvatarColor: '#0277BD',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    approvedById: 'USR-001',
    approvedByName: 'Hassan Al-Qahtani',
    description:
      'Emergency MOC for immediate replacement of failed primary radial bearing in the National 14-P-220 rotary table on Rig Alpha. The bearing failed at 03:15 hrs on 26 February 2026, causing abnormal rotary table vibration. OEM bearing part number NT-14P-BRG-001 is discontinued. Replacement with equivalent SKF 23256 CACK/W33 spherical roller bearing confirmed by OEM technical support as direct equivalent.',
    justification:
      'Emergency situation — rotary table cannot operate safely with failed bearing. Drilling operations suspended. SKF equivalent confirmed by National Oilwell Varco Field Engineering. Alternative: no other acceptable bearing available in-region.',
    safetyImpact:
      'LOTO procedure applied. Work area barriered. Lift plan reviewed for bearing removal (weight 38 kg). JSA completed. Risk: medium (mechanical hazard, controlled).',
    environmentalImpact: 'No environmental impact. Grease/oil containment in place.',
    operationalImpact:
      'Rig downtime: estimated 18 hours including bearing removal, installation, and rotary table recommission test. Drilling programme impact: 18 hours NPT.',
    riskLevel: 'critical',
    initiatedDate: '2026-02-26',
    reviewDeadline: '2026-02-26',
    approvedDate: '2026-02-26',
    relatedDocuments: ['NOV-14P220-Maint-Manual-Sec4', 'SKF-23256-CACK-Equivalency-Letter.pdf'],
    affectedEquipment: ['AD-201-RTB-001'],
    tags: ['Emergency', 'Rotary Table', 'Bearing', 'Replacement', 'OEM Equivalent', 'Rig Alpha'],
  },
  {
    id: 'MOC-2026-005',
    title: 'Upgrade Crown Block Safety System — Install Active Block Position Monitoring',
    type: 'permanent',
    status: 'initiated',
    priority: 'planned',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    initiatedById: 'USR-005',
    initiatedByName: 'Omar Hassan',
    initiatedByInitials: 'OH',
    initiatedByAvatarColor: '#00897B',
    description:
      'Installation of a Pason CrownSaver Active Block Position Monitoring system on Rig Alpha to provide real-time crown block and travelling block position data to the driller\'s console. System provides audible and visual alarms with automatic drawworks shutdown on crown-out approach.',
    justification:
      'Saudi Aramco GI 3.100 Rev 3 (2026) mandates active block position monitoring on all contract drilling rigs effective Q3 2026. Current Rig Alpha passive crown saver does not meet the active monitoring requirement. Compliance deadline: 1 August 2026.',
    safetyImpact:
      'Significant improvement in crown-out and floor-out prevention. High-potential dropped block events eliminated. Positive safety impact.',
    environmentalImpact: 'No environmental impact.',
    operationalImpact:
      'Installation during planned 3-day maintenance break in May 2026. No impact to current drilling operations.',
    riskLevel: 'low',
    initiatedDate: '2026-01-20',
    reviewDeadline: '2026-03-15',
    relatedDocuments: ['GI-3.100-Rev3-2026', 'Pason-CrownSaver-Technical-Spec.pdf'],
    affectedEquipment: ['AD-201-DWK-001', 'AD-201-MAS-001'],
    tags: ['Crown Block', 'Safety System', 'Pason', 'GI-3.100', 'Saudi Aramco Compliance'],
  },
  {
    id: 'MOC-2025-006',
    title: 'Change Drill Pipe Inspection Interval — Reduce from 12-month to 6-month for DS1 Category 3',
    type: 'permanent',
    status: 'verification',
    priority: 'high',
    rigId: null,
    rigName: null,
    department: 'Asset Management',
    initiatedById: 'USR-020',
    initiatedByName: 'Abdullah Qasim',
    initiatedByInitials: 'AQ',
    initiatedByAvatarColor: '#1A237E',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    approvedById: 'USR-001',
    approvedByName: 'Hassan Al-Qahtani',
    description:
      'Reduction of drill pipe MPI/UT inspection interval from 12 months to 6 months for all ADI drill string components classified DS1 Category 3 (premium used). Change driven by two NCOs in 2024 involving connection fatigue cracking in DS1 Cat 3 pipe that passed annual inspection but failed within 6 months.',
    justification:
      'Two NCOs (NCO-2024-035, NCO-2024-042) in 2024 identified fatigue cracks in DS1 Category 3 connections within 6 months of their annual inspection. Risk analysis indicates annual inspection interval is insufficient for high-cycle-fatigue conditions of extended-reach wells.',
    safetyImpact:
      'Significant reduction in drill string failure risk. Shorter inspection interval detects fatigue damage earlier.',
    environmentalImpact: 'No environmental impact.',
    operationalImpact:
      'Increased inspection cost (~SAR 120,000/year additional). 2 additional inspection mobilisations per year to rig sites. Inspection contractor (TÜV Rheinland) capacity confirmed.',
    riskLevel: 'high',
    initiatedDate: '2025-04-01',
    reviewDeadline: '2025-05-15',
    approvedDate: '2025-05-20',
    implementationDate: '2025-06-01',
    relatedDocuments: ['TH-Hill-DS1-Standard-5th-Ed', 'NCO-2024-035', 'NCO-2024-042', 'ADI-ASSET-PROC-004'],
    affectedEquipment: ['AD-201-DPS-001', 'AD-202-DPS-001', 'AD-203-DPS-001'],
    tags: ['Drill Pipe', 'Inspection Interval', 'DS1', 'MPI', 'Fatigue', 'Asset Management'],
  },
  {
    id: 'MOC-2025-007',
    title: 'New Casing Running Tool Procedure — Implement Dope-Free Premium Connection Protocol',
    type: 'permanent',
    status: 'closed',
    priority: 'routine',
    rigId: null,
    rigName: null,
    department: 'Quality',
    initiatedById: 'USR-002',
    initiatedByName: 'Emma Richards',
    initiatedByInitials: 'ER',
    initiatedByAvatarColor: '#E91E63',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    approvedById: 'USR-001',
    approvedByName: 'Hassan Al-Qahtani',
    description:
      'New procedure for running premium Vam Top premium connections without dope (thread lubricant), using only dry-film lubricant as specified by VAM connection OEM. Change eliminates inconsistent dope application as a source of connection failure and aligns with VAM connection installation manual requirements.',
    justification:
      'VAM connection manual requires dry-film only. Current procedure (API modified dope) has resulted in two torque shoulder anomalies in 2024. Procedure alignment with OEM eliminates this non-conformance source.',
    safetyImpact: 'Positive — reduced connection failure risk during casing running.',
    environmentalImpact: 'Reduced chemical usage (thread compound eliminated). Positive environmental impact.',
    operationalImpact:
      'Training required for casing crews (4 hrs). New procedure document issued. Dope applicators removed from casing running kit.',
    riskLevel: 'low',
    initiatedDate: '2025-07-01',
    reviewDeadline: '2025-07-31',
    approvedDate: '2025-08-05',
    implementationDate: '2025-08-15',
    closedDate: '2025-09-30',
    relatedDocuments: ['VAM-TOP-Connection-Install-Manual-Rev6', 'ADI-OPS-PROC-045 Rev 2'],
    affectedEquipment: [],
    tags: ['Casing', 'Premium Connection', 'VAM', 'Procedure', 'Thread Lubricant'],
  },
  {
    id: 'MOC-2026-008',
    title: 'Temporary Generator Substitution — Rig Charlie Main Gen #2 Overhaul',
    type: 'temporary',
    status: 'approved',
    priority: 'urgent',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    department: 'Maintenance',
    initiatedById: 'USR-019',
    initiatedByName: 'Sami Al-Otaibi',
    initiatedByInitials: 'SO',
    initiatedByAvatarColor: '#33691E',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    approvedById: 'USR-001',
    approvedByName: 'Hassan Al-Qahtani',
    description:
      'Main generator #2 (Caterpillar 3516B, 1800 kW) on Rig Charlie requires unscheduled major overhaul following high vibration alarm and bearing knock identified on 20 February 2026. Generator has been isolated. Rig operating on reduced power (2 of 3 generators). Temporary rental generator required to maintain full power redundancy during repair period.',
    justification:
      'Operating on 2 generators only reduces power redundancy below ADI operational requirements. Rental unit (same spec Caterpillar 3516B equivalent, 1800 kW) sourced from Al-Rashid Equipment Rental, Dammam. Available for delivery within 72 hours.',
    safetyImpact:
      'Rental generator must pass pre-use inspection. Electrical connection by qualified electrician. Temporary cable routing to be protected. No unacceptable residual risk.',
    environmentalImpact:
      'Rental generator uses same fuel type (diesel). No change to environmental management.',
    operationalImpact:
      'Rental gen in place for estimated 21 days while main gen undergoes overhaul at Caterpillar facility, Dammam.',
    temporaryDuration: '21 days',
    riskLevel: 'medium',
    initiatedDate: '2026-02-20',
    reviewDeadline: '2026-02-22',
    approvedDate: '2026-02-22',
    relatedDocuments: ['CAT-3516B-Maint-Manual', 'ADI-ELECT-PROC-006'],
    affectedEquipment: ['AD-203-GEN-002'],
    tags: ['Generator', 'Temporary', 'Power', 'Rental', 'Rig Charlie', 'Caterpillar'],
  },
  {
    id: 'MOC-2025-009',
    title: 'Update Driller Competency Requirements — Align with IADC WellSharp Programme',
    type: 'permanent',
    status: 'closed',
    priority: 'routine',
    rigId: null,
    rigName: null,
    department: 'Quality',
    initiatedById: 'USR-003',
    initiatedByName: 'Andrew Campbell',
    initiatedByInitials: 'AC',
    initiatedByAvatarColor: '#FF6D00',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    approvedById: 'USR-001',
    approvedByName: 'Hassan Al-Qahtani',
    description:
      'Update to ADI Driller Competency Standard to align minimum acceptable certifications with the IADC WellSharp Driller Level programme, replacing the previous requirement for IWCF Level 3 as the minimum. IADC WellSharp is now the industry standard accepted by Saudi Aramco and all major operators in the GCC.',
    justification:
      'Saudi Aramco GI 3.100 Rev 3 (2025) now specifies IADC WellSharp as the required certification standard. IWCF Level 3 is still valid but WellSharp acceptance needed as alternative. Competency standard update required for contract compliance.',
    safetyImpact: 'No reduction in safety standards. IADC WellSharp is equivalent or superior to IWCF.',
    environmentalImpact: 'No environmental impact.',
    operationalImpact:
      'Updated competency matrix for all drillers. Training roadmap issued. Existing IWCF certificates remain valid until expiry.',
    riskLevel: 'low',
    initiatedDate: '2025-08-01',
    reviewDeadline: '2025-09-01',
    approvedDate: '2025-09-10',
    implementationDate: '2025-10-01',
    closedDate: '2025-12-15',
    relatedDocuments: ['IADC-WellSharp-Curriculum', 'GI-3.100-Rev3-2025', 'ADI-HR-COMP-001 Rev 4'],
    affectedEquipment: [],
    tags: ['Competency', 'IADC WellSharp', 'IWCF', 'Driller', 'Training', 'Saudi Aramco'],
  },
  {
    id: 'MOC-2026-010',
    title: 'Replace Shale Shakers — Rig Charlie Upgrade to Derrick FLC 513 High-G Units',
    type: 'permanent',
    status: 'under_review',
    priority: 'routine',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    department: 'Rig Operations',
    initiatedById: 'USR-022',
    initiatedByName: 'Tom Bradshaw',
    initiatedByInitials: 'TB',
    initiatedByAvatarColor: '#006064',
    reviewedById: 'USR-001',
    reviewedByName: 'Hassan Al-Qahtani',
    description:
      'Replacement of existing 4x Derrick FLC 500 shale shakers on Rig Charlie with upgraded 4x Derrick FLC 513 High-G linear motion units. The FLC 513 provides 26% higher screen area and improved G-force (6.2G vs 4.8G) for better solids control performance when drilling larger-diameter surface hole sections.',
    justification:
      'Current FLC 500 units are struggling to maintain solids removal efficiency during 26" and 17½" hole sections on Rig Charlie. Elevated solids in active pits increasing drill solids percentage and causing increased mud weight. FLC 513 units resolve this.',
    safetyImpact: 'Screen replacement safety procedures apply. No significant hazard change.',
    environmentalImpact: 'Improved solids removal reduces disposal volumes. Positive environmental impact.',
    operationalImpact:
      'Replacement during scheduled 5-day rig maintenance window in April 2026. Screen compatibility: FLC 513 uses same API-standard screen panels. No screen inventory change required.',
    riskLevel: 'low',
    initiatedDate: '2026-01-10',
    reviewDeadline: '2026-03-01',
    relatedDocuments: ['Derrick-FLC513-Technical-Spec.pdf', 'ADI-MECH-PROC-012'],
    affectedEquipment: ['AD-203-SHA-001', 'AD-203-SHA-002', 'AD-203-SHA-003', 'AD-203-SHA-004'],
    tags: ['Shale Shaker', 'Solids Control', 'Rig Charlie', 'Derrick FLC', 'Equipment Upgrade'],
  },
];

// ────────────────────────────────────────────────────────────
// NCO — Non-Conformance Orders
// ────────────────────────────────────────────────────────────

export type NcoSeverity = 'critical' | 'major' | 'minor' | 'observation';
export type NcoType =
  | 'equipment_failure'
  | 'procedure_deviation'
  | 'material_defect'
  | 'documentation'
  | 'personnel_competency'
  | 'environmental'
  | 'safety_observation';
export type NcoStatus =
  | 'open'
  | 'under_investigation'
  | 'containment_applied'
  | 'root_cause_identified'
  | 'disposition_pending'
  | 'capa_raised'
  | 'closed';
export type NcoDisposition = 'scrap' | 'rework' | 'use_as_is' | 'return_to_supplier' | 'conditional_use' | 'pending';

export interface NcoRecord {
  id: string;
  title: string;
  severity: NcoSeverity;
  type: NcoType;
  status: NcoStatus;
  rigId: string | null;
  rigName: string | null;
  department: string;
  raisedById: string;
  raisedByName: string;
  raisedByInitials: string;
  raisedByAvatarColor: string;
  assignedToId?: string;
  assignedToName?: string;
  raisedDate: string;
  dueDate: string;
  closedDate?: string;
  description: string;
  containmentAction?: string;
  rootCause?: string;
  disposition?: NcoDisposition;
  dispositionJustification?: string;
  estimatedCost?: number;
  actualCost?: number;
  relatedCapaId?: string;
  relatedDocuments: string[];
  affectedItems: string[];
  tags: string[];
}

export const NCO_RECORDS: NcoRecord[] = [
  {
    id: 'NCO-2024-042',
    title: 'Cracked Saver Sub Discovered During MPI Inspection — Rig Bravo Drill String',
    severity: 'major',
    type: 'material_defect',
    status: 'closed',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Quality',
    raisedById: 'USR-006',
    raisedByName: 'Ahmed Al-Rashid',
    raisedByInitials: 'AR',
    raisedByAvatarColor: '#F4511E',
    assignedToId: 'USR-001',
    assignedToName: 'Hassan Al-Qahtani',
    raisedDate: '2024-12-03',
    dueDate: '2024-12-17',
    closedDate: '2024-12-16',
    description:
      'During scheduled MPI (Magnetic Particle Inspection) of the 6-5/8" API IF drill string connections on Rig Bravo, one 6-5/8" NC-50 saver sub (Asset No. AD-202-SS-014, S/N: SAB-2022-7734) was found with a circumferential fatigue crack at the pin upset zone. Crack length approximately 180mm, penetrating 40% of wall thickness. The saver sub had passed its last annual MPI inspection conducted 7 months prior by TÜV Rheinland (Report No. TUV-ADI-2024-0881). This NCO is directly associated with MOC-2025-006 which proposes reducing drill string inspection intervals from 12 to 6 months.',
    containmentAction:
      'Saver sub immediately tagged with Red Non-Conforming tag and physically removed from all usable pipe racks. Item placed in locked Quarantine cage (Cage Q-2, Rig Bravo pipe deck). All remaining 6-5/8" saver subs (Qty: 4) subjected to emergency MPI re-inspection within 12 hours. No further cracks found in remaining subs. Drill string operations resumed using adjacent drill collar crossover sub as temporary alternative.',
    rootCause:
      'Root cause analysis identified high-cycle bending fatigue accelerated by (1) consistent use of this specific saver sub during directional drilling operations with doglegs exceeding 3°/30m over 4,200 rotating hours, and (2) inspection interval of 12 months being insufficient to detect early-stage fatigue cracking in high-bending-load service. Contributing factor: original inspection report did not note elevated bending fatigue risk score for this item despite high DLS exposure documented in well reports.',
    disposition: 'scrap',
    dispositionJustification:
      'Scrapped per ADI-QMS-PROC-005 §6.3. Circumferential crack geometry and depth (>25% wall thickness per API RP 7G) renders item non-repairable. Economic assessment: replacement cost SAR 28,000. Repair cost not viable. Item de-tagged from asset register and physically destroyed (cut with angle grinder, photographed).',
    estimatedCost: 45000,
    actualCost: 45000,
    relatedCapaId: 'CAPA-2025-001',
    relatedDocuments: ['TUV-ADI-2024-0881-MPI-Report.pdf', 'API-RP-7G-Section4', 'MOC-2025-006'],
    affectedItems: ['AD-202-SS-014'],
    tags: ['Drill String', 'Saver Sub', 'MPI', 'Fatigue Crack', 'Scrapped', 'DS1'],
  },
  {
    id: 'NCO-2024-043',
    title: 'BOP Accumulator Pre-Charge Below Minimum — Rig Alpha Weekly Test',
    severity: 'critical',
    type: 'equipment_failure',
    status: 'capa_raised',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Rig Operations',
    raisedById: 'USR-009',
    raisedByName: 'Ali Hassan',
    raisedByInitials: 'AH',
    raisedByAvatarColor: '#2E7D32',
    assignedToId: 'USR-001',
    assignedToName: 'Hassan Al-Qahtani',
    raisedDate: '2024-12-08',
    dueDate: '2024-12-22',
    closedDate: '2024-12-20',
    description:
      'During weekly BOP accumulator function test per ADI-OPS-PROC-028, accumulator pre-charge pressure recorded at 980 PSI against minimum required of 1,200 PSI per API 16A. Three of twelve accumulator bottles on BOP unit AD-201-BOP-001 showing low pre-charge. This represents a critical non-conformance as low pre-charge directly impacts BOP closing time and potentially renders BOP non-functional in emergency.',
    containmentAction:
      'BOP unit isolated and re-pressurised from surface system. Nitrogen pre-charge tested and topped up on all 12 bottles. Full BOP function test performed and passed before resuming drilling operations. 4-hour operational hold applied.',
    rootCause:
      'Bladder seal degradation in 3 accumulator bottles due to age and heat cycling. Bladder seals last replaced 18 months ago. Manufacturer recommends 12-month replacement interval in desert high-temperature service.',
    disposition: 'rework',
    dispositionJustification: 'All 12 accumulator bladders replaced. Full BOP test conducted and passed.',
    estimatedCost: 38000,
    actualCost: 41200,
    relatedCapaId: 'CAPA-2024-006',
    relatedDocuments: ['ADI-OPS-PROC-028', 'API-16A-Section-5', 'BOP-TestRecord-AD201-Dec2024.pdf'],
    affectedItems: ['AD-201-BOP-001'],
    tags: ['BOP', 'Accumulator', 'Pre-Charge', 'Critical', 'Well Control'],
  },
  {
    id: 'NCO-2024-044',
    title: 'Substandard PPE Batch — Helmet Chinstraps Fail Retention Test',
    severity: 'major',
    type: 'material_defect',
    status: 'closed',
    rigId: null,
    rigName: null,
    department: 'Warehouse',
    raisedById: 'USR-011',
    raisedByName: 'Yusuf Ibrahim',
    raisedByInitials: 'YI',
    raisedByAvatarColor: '#558B2F',
    raisedDate: '2024-12-10',
    dueDate: '2024-12-24',
    closedDate: '2024-12-22',
    description:
      'Incoming inspection of 200 safety helmets (MSA V-Gard, Batch No. MSA-2024-B447) revealed chinstrap retention system failing EN397 retention force test. 12 out of 20 sample units failed the 150N dynamic retention requirement. Entire batch quarantined pending supplier disposition.',
    containmentAction:
      'All 200 units quarantined at Dammam Base warehouse. Red non-conformance labels applied to all pallets. Existing issued helmets not affected (different batch). Immediate supplier notification.',
    rootCause: 'Manufacturing defect in chinstrap buckle injection moulding — confirmed by supplier quality investigation.',
    disposition: 'return_to_supplier',
    dispositionJustification:
      'Full batch of 200 units returned to MSA supplier for credit. Replacement batch (new batch No. MSA-2024-C102) received and fully passed incoming inspection.',
    estimatedCost: 15000,
    actualCost: 0,
    relatedDocuments: ['MSA-QA-Response-Dec2024.pdf', 'EN397-Test-Report-Batch-B447.pdf'],
    affectedItems: [],
    tags: ['PPE', 'Helmet', 'Incoming Inspection', 'Supplier Defect', 'EN397'],
  },
  {
    id: 'NCO-2024-045',
    title: 'Procedure Deviation — Cement Job Mixed Without Quality Witness on Rig Bravo',
    severity: 'major',
    type: 'procedure_deviation',
    status: 'capa_raised',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Quality',
    raisedById: 'USR-010',
    raisedByName: 'David Chen',
    raisedByInitials: 'DC',
    raisedByAvatarColor: '#C62828',
    raisedDate: '2024-12-12',
    dueDate: '2025-01-12',
    description:
      'Cementing job for 9-5/8" surface casing at Well ADB-52 was executed without a Quality Engineer witness present at the cement mixing unit. ADI-OPS-PROC-041 §4.2 requires QE witness during all primary casing cement jobs. Post-job slurry density records show minor deviation (0.2 ppg above design).',
    containmentAction:
      'Post-job cement evaluation logs reviewed. CBL/VDL confirms adequate cement bond. No re-cement required. Cement unit operator interviewed. Slurry density records preserved.',
    rootCause: 'Quality Engineer David Chen was attending a concurrent BOP test — scheduling conflict not identified in pre-job safety meeting. Pre-job QA checklist did not include confirmation of QE availability.',
    relatedCapaId: 'CAPA-2025-003',
    relatedDocuments: ['ADI-OPS-PROC-041', 'CBL-VDL-ADB52-9-58-Cement-Dec2024.pdf'],
    affectedItems: [],
    tags: ['Cementing', 'Procedure Deviation', 'Witness', 'Rig Bravo'],
  },
  {
    id: 'NCO-2024-046',
    title: 'Drill Bit Returned with Box Thread Damage — Rental PDC Not Inspected Pre-Run',
    severity: 'minor',
    type: 'material_defect',
    status: 'closed',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Quality',
    raisedById: 'USR-002',
    raisedByName: 'Emma Richards',
    raisedByInitials: 'ER',
    raisedByAvatarColor: '#E91E63',
    raisedDate: '2024-12-15',
    dueDate: '2024-12-29',
    closedDate: '2024-12-27',
    description:
      'Smith Bits SDi616 12-1/4" PDC bit returned from run with damaged box thread — 2 thread crests damaged. Bit run data acceptable otherwise (graded: 4-4-WT-A-X-I-BT-TD). Thread damage likely occurred during make-up, possibly due to cross-threading. Pre-run thread inspection not recorded on bit run report.',
    containmentAction:
      'Damaged bit returned to Halliburton under rental agreement. Damage claimed as in-service damage (no additional cost per contract terms). New bit issued for next run.',
    rootCause:
      'Pre-run thread inspection skipped — bit runner stated pressure to POOH quickly did not allow time. Bit run report does not require pre-run thread inspection sign-off as a mandatory field.',
    disposition: 'return_to_supplier',
    relatedDocuments: ['Halliburton-Bit-Run-Report-ADB47-Run14.pdf', 'ADI-OPS-PROC-052'],
    affectedItems: [],
    tags: ['Drill Bit', 'PDC', 'Thread Damage', 'Inspection'],
  },
  {
    id: 'NCO-2024-047',
    title: 'Missing MSDS Documentation for 3 Chemical Products in Rig Charlie Manifest',
    severity: 'minor',
    type: 'documentation',
    status: 'closed',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    department: 'HSE',
    raisedById: 'USR-016',
    raisedByName: 'Peter Okafor',
    raisedByInitials: 'PO',
    raisedByAvatarColor: '#00695C',
    raisedDate: '2024-12-18',
    dueDate: '2024-12-25',
    closedDate: '2024-12-24',
    description:
      'During HSE document control audit of Rig Charlie chemical register, 3 products found without current MSDS/SDS documents in the rig file: (1) Magcobar Barex 47 weighting agent, (2) Baker Hughes NOVA-Plus Plus lubricant, (3) Halliburton CFR-3 fluid loss additive.',
    containmentAction:
      'Products not in immediate use — stored in chemical shed. Chemical shed locked pending MSDS retrieval. Operations not impacted.',
    rootCause:
      'MSDS update cycle not completed for products received in November 2024. Document Controller process gap: new chemicals received without MSDS verification step in receiving checklist.',
    relatedDocuments: ['ADI-HSE-PROC-011', 'Chemical-Register-AD203-Dec2024.xlsx'],
    affectedItems: [],
    tags: ['MSDS', 'SDS', 'Documentation', 'Chemical', 'Rig Charlie', 'HSE'],
  },
  {
    id: 'NCO-2025-001',
    title: 'Failed Top Drive Filter Element — Unscheduled Oil Change Required Rig Alpha',
    severity: 'major',
    type: 'equipment_failure',
    status: 'closed',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Maintenance',
    raisedById: 'USR-008',
    raisedByName: 'Khalid Mahmoud',
    raisedByInitials: 'KM',
    raisedByAvatarColor: '#0277BD',
    raisedDate: '2025-01-08',
    dueDate: '2025-01-22',
    closedDate: '2025-01-20',
    description:
      'Varco TDS-11SA top drive gearbox filter element (P/N: 60220-0000) failed prematurely at 480 service hours against expected 1,000 hour service interval. High differential pressure alarm triggered. Oil analysis shows elevated iron particles (850 ppm vs normal <200 ppm) indicating gear wear.',
    containmentAction:
      'Top drive isolated. Emergency oil sample sent to Intertek Dammam for expedited analysis. Operations continued on kelly bushing as backup for 6 hours during repair.',
    rootCause:
      'Filter element failure linked to incorrect element specification installed during previous service — sub-spec element (7 micron vs required 5 micron absolute) used from non-OEM source.',
    disposition: 'rework',
    dispositionJustification:
      'Correct OEM filter element installed. Full oil flush performed. New oil charge (ISO VG 220 gear oil) installed. Top drive function test passed.',
    estimatedCost: 22000,
    actualCost: 24500,
    relatedDocuments: ['Varco-TDS11SA-Maint-Manual', 'Oil-Analysis-Report-Intertek-Jan2025.pdf'],
    affectedItems: ['AD-201-TDS-001'],
    tags: ['Top Drive', 'Filter', 'Oil Analysis', 'Gearbox', 'Rig Alpha'],
  },
  {
    id: 'NCO-2025-002',
    title: 'Substandard Weld on Rig Bravo Derrick Leg — Visual Inspection Finding',
    severity: 'major',
    type: 'material_defect',
    status: 'under_investigation',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Asset Management',
    raisedById: 'USR-020',
    raisedByName: 'Abdullah Qasim',
    raisedByInitials: 'AQ',
    raisedByAvatarColor: '#1A237E',
    raisedDate: '2025-01-15',
    dueDate: '2025-02-15',
    description:
      'During annual structural inspection of Rig Bravo derrick by Bureau Veritas, a substandard weld was identified on the secondary derrick leg brace at elevation 24m. Weld shows evidence of incomplete fusion (lack of fusion defect) over approximately 150mm. Derrick structural integrity assessment required before continued operation above 400 ton hookload.',
    containmentAction:
      'Hookload temporarily limited to 350 ton per structural engineer recommendation. Operations continuing within revised load limit. UT examination of weld region scheduled.',
    relatedDocuments: ['BV-Inspection-Report-AD202-Jan2025.pdf'],
    affectedItems: ['AD-202-MAS-001'],
    tags: ['Structural', 'Weld', 'Derrick', 'Bureau Veritas', 'Rig Bravo'],
  },
  {
    id: 'NCO-2025-003',
    title: 'Expired Fire Extinguisher Found in Rig Charlie Mud Logging Unit',
    severity: 'minor',
    type: 'safety_observation',
    status: 'closed',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    department: 'HSE',
    raisedById: 'USR-016',
    raisedByName: 'Peter Okafor',
    raisedByInitials: 'PO',
    raisedByAvatarColor: '#00695C',
    raisedDate: '2025-01-22',
    dueDate: '2025-02-05',
    closedDate: '2025-01-30',
    description:
      'During monthly HSE inspection walkdown, one 6kg CO2 fire extinguisher in the Exlog Mud Logging unit on Rig Charlie was found with expired service tag (last service: January 2024, expired: January 2025). Extinguisher had been missed in the monthly inspection schedule as the mud logging unit is a contractor-supplied unit.',
    containmentAction:
      'Extinguisher removed from service and tagged Non-Conforming. Replacement serviceable extinguisher sourced from rig fire equipment store and installed within 2 hours.',
    disposition: 'rework',
    dispositionJustification:
      'Extinguisher serviced by licensed contractor (Protec Fire & Safety) and returned to service with valid 12-month service certificate.',
    relatedDocuments: ['ADI-HSE-PROC-018', 'Fire-Equipment-Register-AD203-Jan2025.xlsx'],
    affectedItems: [],
    tags: ['Fire Extinguisher', 'HSE', 'Inspection', 'Expired Equipment', 'Rig Charlie'],
  },
  {
    id: 'NCO-2025-004',
    title: 'Non-Conforming Chemical: Wrong Biocide Delivered to Rig Alpha — Wrong Concentration',
    severity: 'major',
    type: 'material_defect',
    status: 'containment_applied',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Quality',
    raisedById: 'USR-002',
    raisedByName: 'Emma Richards',
    raisedByInitials: 'ER',
    raisedByAvatarColor: '#E91E63',
    raisedDate: '2025-02-10',
    dueDate: '2025-03-10',
    description:
      'Baker Hughes Biocide BWT-750 delivered to Rig Alpha with concentration of 25% vs the 50% concentration specified in the mud programme. This product was received at rig site and added to the mud system prior to incoming inspection. Mud system performance data being monitored for microbiological activity.',
    containmentAction:
      'All drums of the non-conforming batch (12 drums) tagged and quarantined in chemical shed. Mud system microbiological counts being monitored daily. Correct concentration product on expedited delivery from warehouse.',
    relatedDocuments: ['Delivery-Note-BH-BWT750-Feb2025.pdf', 'Mud-Programme-ADB47-Chemical-Spec.pdf'],
    affectedItems: [],
    tags: ['Biocide', 'Chemical', 'Wrong Specification', 'Mud System', 'Rig Alpha'],
  },
  {
    id: 'NCO-2025-005',
    title: 'Drill Collar Make-Up Torque Not Achieved — Connection Slipped During Tightening',
    severity: 'major',
    type: 'procedure_deviation',
    status: 'root_cause_identified',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Rig Operations',
    raisedById: 'USR-014',
    raisedByName: 'Nadia Petrova',
    raisedByInitials: 'NP',
    raisedByAvatarColor: '#AD1457',
    raisedDate: '2025-03-05',
    dueDate: '2025-04-05',
    description:
      '9.5" x 3" I.D. Non-magnetic drill collar connection make-up torque target of 65,000 ft-lb not achieved during BHA assembly — connection slipped at 58,000 ft-lb with no further torque increase. Possible thread damage or worn box connection.',
    containmentAction:
      'Connection re-broken. Both pin and box connections cleaned and visually inspected under magnification. Minor galling found on box last thread. Connection reworked by rig floor crew with new dope application. Second make-up attempt achieved target torque.',
    rootCause:
      'Thread galling on box connection caused by previous high-torque break-out without thread protector re-application. Rig floor procedure requires thread protector cleaning and new dope before each make-up — not followed for this connection.',
    relatedDocuments: ['ADI-OPS-PROC-050', 'BHA-Assembly-Sheet-ADB52-BHA7.pdf'],
    affectedItems: ['AD-202-DC-017'],
    tags: ['Drill Collar', 'Make-Up Torque', 'Thread Damage', 'BHA', 'Rig Bravo'],
  },
  {
    id: 'NCO-2025-006',
    title: 'Rig Charlie Diesel Fuel Sample Fails Quality Test — Water Contamination Detected',
    severity: 'major',
    type: 'material_defect',
    status: 'disposition_pending',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    department: 'Logistics',
    raisedById: 'USR-019',
    raisedByName: 'Sami Al-Otaibi',
    raisedByInitials: 'SO',
    raisedByAvatarColor: '#33691E',
    raisedDate: '2025-04-02',
    dueDate: '2025-04-16',
    description:
      'Routine diesel fuel quality test on Rig Charlie main fuel storage tank (capacity 80,000 litres) detected 0.12% water contamination (max acceptable 0.05% per EN590). Approximately 45,000 litres currently in tank. Water contamination detected via Karl Fischer titration. Source suspected to be condensation from uncovered tank vent.',
    containmentAction:
      'Fuel supply from contaminated tank suspended. Generators switched to emergency tank supply. Fuel sampling on all other tanks completed — all pass specification. Tank vent cover reinstalled.',
    relatedDocuments: ['Fuel-QC-Report-AD203-Apr2025.pdf', 'EN590-Diesel-Specification'],
    affectedItems: [],
    tags: ['Diesel Fuel', 'Water Contamination', 'Generator', 'Rig Charlie', 'Fuel Quality'],
  },
  {
    id: 'NCO-2025-007',
    title: 'MSME Thread Gauge Out of Calibration — All Rig Alpha Gauge Readings Suspect',
    severity: 'major',
    type: 'equipment_failure',
    status: 'closed',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Quality',
    raisedById: 'USR-002',
    raisedByName: 'Emma Richards',
    raisedByInitials: 'ER',
    raisedByAvatarColor: '#E91E63',
    raisedDate: '2025-05-10',
    dueDate: '2025-05-24',
    closedDate: '2025-05-22',
    description:
      'Annual calibration of API thread ring and plug gauges at Rig Alpha revealed 2 of 7 gauges (NC-50 ring gauge and 5" API IF ring gauge) are out of calibration tolerance. Gauges had been in use since last calibration in May 2024. All thread inspections using these gauges over the 12-month period are potentially unreliable.',
    containmentAction:
      'Both out-of-calibration gauges quarantined. Expedited recalibration arranged. Risk assessment of 12-month period of potentially non-conforming gauge readings conducted: 8 critical connections identified as having been gauged with suspect equipment, all re-inspected with certified gauges — all passed.',
    disposition: 'rework',
    dispositionJustification: 'Both gauges recalibrated by Weights & Measures certified lab. One gauge replaced (beyond adjustment tolerance).',
    estimatedCost: 8500,
    actualCost: 9200,
    relatedDocuments: ['Cal-Lab-Report-ThreadGauge-AD201-May2025.pdf', 'ADI-QMS-PROC-009'],
    affectedItems: [],
    tags: ['Calibration', 'Thread Gauge', 'Rig Alpha', 'Quality Control'],
  },
  {
    id: 'NCO-2025-008',
    title: 'Casing Centralizer Short-Run — Target Centralizer Spacing Not Achieved on 7" Liner',
    severity: 'minor',
    type: 'procedure_deviation',
    status: 'closed',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Quality',
    raisedById: 'USR-002',
    raisedByName: 'Emma Richards',
    raisedByInitials: 'ER',
    raisedByAvatarColor: '#E91E63',
    raisedDate: '2025-06-20',
    dueDate: '2025-07-04',
    closedDate: '2025-07-02',
    description:
      'Post-run centralizer tally for 7" production liner at Well ADB-47 shows 3 joints with centralizer spacing of 3 joints vs 2 joint spacing specified in casing design. Deviations are in the non-critical upper section of the liner (above 3,200m). Cement evaluation log confirms adequate standoff despite deviation.',
    containmentAction: 'Centralizer tally vs design comparison performed. Standoff modelling re-run with actual spacing — confirms cement design objectives met.',
    relatedDocuments: ['Casing-Design-7in-Liner-ADB47.pdf', 'CBL-Report-7in-Liner-ADB47.pdf'],
    affectedItems: [],
    tags: ['Casing', 'Centralizer', 'Liner', 'Cementing', 'Rig Alpha'],
  },
  {
    id: 'NCO-2025-009',
    title: 'Radiographic Test Failure — Manifold Weld on Rig Bravo Kill Line',
    severity: 'critical',
    type: 'material_defect',
    status: 'capa_raised',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Quality',
    raisedById: 'USR-010',
    raisedByName: 'David Chen',
    raisedByInitials: 'DC',
    raisedByAvatarColor: '#C62828',
    raisedDate: '2025-08-14',
    dueDate: '2025-08-28',
    description:
      'Radiographic test (RT) of a 3" 10,000 PSI kill line manifold weld at Rig Bravo surface wellhead revealed a cluster of gas porosity defects and a 25mm linear indication exceeding ASME B31.3 acceptance criteria for Class 3 process piping. Weld joint is in the critical high-pressure kill line circuit.',
    containmentAction:
      'Kill line section isolated and taken out of service. Bypass routing established using standby kill line. BOP stack operations continue with contingency kill line in service. Defective weld section to be cut out and re-welded.',
    rootCause:
      'Investigation ongoing. Initial findings indicate welder qualification issue — the welder who performed the joint is qualified for 6G position but the joint configuration required 6GR (restricted) qualification.',
    relatedCapaId: 'CAPA-2025-007',
    relatedDocuments: ['RT-Report-KillLine-AD202-Aug2025.pdf', 'ASME-B31.3-2022'],
    affectedItems: ['AD-202-KLN-001'],
    tags: ['Kill Line', 'Radiographic Test', 'Weld Defect', 'High Pressure', 'Rig Bravo', 'Critical'],
  },
];

// ────────────────────────────────────────────────────────────
// CAPA — Corrective & Preventive Actions
// ────────────────────────────────────────────────────────────

export type CapaType = 'corrective' | 'preventive' | 'both';
export type CapaStatus =
  | 'open'
  | 'in_progress'
  | 'pending_verification'
  | 'effectiveness_review'
  | 'closed'
  | 'overdue';

export interface CapaAction {
  id: string;
  description: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
  dueDate: string;
  completedDate?: string;
  status: 'open' | 'in_progress' | 'completed' | 'overdue';
  evidence?: string;
}

export interface CapaRecord {
  id: string;
  title: string;
  type: CapaType;
  status: CapaStatus;
  priority: 'critical' | 'urgent' | 'high' | 'routine';
  rigId: string | null;
  rigName: string | null;
  department: string;
  raisedById: string;
  raisedByName: string;
  raisedByInitials: string;
  raisedByAvatarColor: string;
  assignedToId: string;
  assignedToName: string;
  sourceType: 'nco' | 'audit_finding' | 'incident' | 'management_review' | 'customer_feedback';
  sourceRecordId: string;
  problemStatement: string;
  rootCauseAnalysis: string;
  immediateActions: string;
  actions: CapaAction[];
  verificationMethod: string;
  verificationDate?: string;
  verifiedById?: string;
  verifiedByName?: string;
  effectivenessDate?: string;
  closedDate?: string;
  raisedDate: string;
  dueDate: string;
  tags: string[];
}

export const CAPA_RECORDS: CapaRecord[] = [
  {
    id: 'CAPA-2024-006',
    title: 'BOP Accumulator Bladder Replacement Programme — All Active Rigs',
    type: 'corrective',
    status: 'closed',
    priority: 'critical',
    rigId: null,
    rigName: null,
    department: 'Rig Operations',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-008',
    assignedToName: 'Khalid Mahmoud',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2024-043',
    problemStatement:
      'BOP accumulator pre-charge failure on Rig Alpha (NCO-2024-043) revealed that accumulator bladder replacement is being performed at 18-month intervals but manufacturer specification for high-temperature desert service requires 12-month maximum interval. Review of all rigs confirms same non-compliant practice fleet-wide.',
    rootCauseAnalysis:
      '5-Why Analysis: (1) Accumulator failed → (2) Bladder degraded → (3) Bladder not replaced at correct interval → (4) Maintenance schedule used 18-month interval → (5) Original maintenance schedule set up without reference to manufacturer\'s high-temperature service amendment bulletin (NOV Service Bulletin SB-2021-043 issued June 2021). Systemic root cause: maintenance schedule not updated from OEM service bulletin.',
    immediateActions:
      'All 12 accumulator bladders on AD-201 replaced. Full BOP function test completed and passed. Rig Alpha operations resumed.',
    actions: [
      {
        id: 'CAPA-2024-006-A01',
        description: 'Replace all accumulator bladders on AD-202 (Rig Bravo) — 12 units',
        responsiblePersonId: 'USR-015',
        responsiblePersonName: 'Carlos Mendez',
        dueDate: '2025-01-15',
        completedDate: '2025-01-12',
        status: 'completed',
        evidence: 'BOP test records AD-202 Jan 2025 — all pass.',
      },
      {
        id: 'CAPA-2024-006-A02',
        description: 'Replace all accumulator bladders on AD-203 (Rig Charlie) — 12 units',
        responsiblePersonId: 'USR-022',
        responsiblePersonName: 'Tom Bradshaw',
        dueDate: '2025-01-30',
        completedDate: '2025-01-28',
        status: 'completed',
        evidence: 'BOP test records AD-203 Jan 2025 — all pass.',
      },
      {
        id: 'CAPA-2024-006-A03',
        description: 'Update PM schedule for all rigs to 12-month accumulator bladder replacement',
        responsiblePersonId: 'USR-008',
        responsiblePersonName: 'Khalid Mahmoud',
        dueDate: '2025-02-01',
        completedDate: '2025-01-25',
        status: 'completed',
        evidence: 'PM schedule updated in CMMS (Work Orders updated).',
      },
      {
        id: 'CAPA-2024-006-A04',
        description: 'Establish OEM service bulletin review process for all critical equipment',
        responsiblePersonId: 'USR-001',
        responsiblePersonName: 'Hassan Al-Qahtani',
        dueDate: '2025-03-01',
        completedDate: '2025-02-26',
        status: 'completed',
        evidence: 'ADI-MAINT-PROC-001 Rev 3 issued — includes quarterly OEM bulletin review.',
      },
    ],
    verificationMethod:
      'Review of updated PM schedule in CMMS, BOP test records post-bladder replacement showing compliant pre-charge pressures on all three rigs.',
    verificationDate: '2025-04-01',
    verifiedById: 'USR-002',
    verifiedByName: 'Emma Richards',
    effectivenessDate: '2025-07-01',
    closedDate: '2025-07-05',
    raisedDate: '2024-12-10',
    dueDate: '2025-03-01',
    tags: ['BOP', 'Accumulator', 'Maintenance', 'Fleet-Wide', 'PM Schedule', 'OEM Bulletin'],
  },
  {
    id: 'CAPA-2024-007',
    title: 'Drill Bit Pre-Run Inspection — Mandatory Thread Inspection Step Added to Bit Run Report',
    type: 'corrective',
    status: 'closed',
    priority: 'routine',
    rigId: null,
    rigName: null,
    department: 'Quality',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-004',
    assignedToName: 'Fatima Al-Subaie',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2024-046',
    problemStatement:
      'Drill bit pre-run thread inspection was not performed prior to bit run resulting in un-detected thread damage and subsequent damage on make-up. Bit run report form does not require pre-run thread inspection as a mandatory signed step.',
    rootCauseAnalysis:
      'Bit run report form design omits pre-run thread inspection sign-off. Without a mandatory hold point, inspection was skipped under operational time pressure.',
    immediateActions: 'Driller and bit runner briefed on pre-run inspection requirements.',
    actions: [
      {
        id: 'CAPA-2024-007-A01',
        description: 'Revise Bit Run Report form to include mandatory pre-run thread inspection sign-off hold point',
        responsiblePersonId: 'USR-004',
        responsiblePersonName: 'Fatima Al-Subaie',
        dueDate: '2025-01-20',
        completedDate: '2025-01-18',
        status: 'completed',
        evidence: 'Revised Bit Run Report Form ADI-OPS-FORM-018 Rev 3 issued 18 Jan 2025.',
      },
      {
        id: 'CAPA-2024-007-A02',
        description: 'Distribute revised form to all rigs and confirm implementation with Rig Managers',
        responsiblePersonId: 'USR-001',
        responsiblePersonName: 'Hassan Al-Qahtani',
        dueDate: '2025-02-01',
        completedDate: '2025-01-28',
        status: 'completed',
        evidence: 'Rig manager confirmation emails on file.',
      },
    ],
    verificationMethod: 'Review of 3 consecutive bit run reports from each rig confirming pre-run inspection sign-off field completed.',
    verificationDate: '2025-04-15',
    verifiedById: 'USR-002',
    verifiedByName: 'Emma Richards',
    closedDate: '2025-04-20',
    raisedDate: '2024-12-20',
    dueDate: '2025-02-01',
    tags: ['Drill Bit', 'Thread Inspection', 'Form Revision', 'Procedure Update'],
  },
  {
    id: 'CAPA-2024-008',
    title: 'Chemical Receiving Inspection — MSDS Verification Added to Receiving Checklist',
    type: 'corrective',
    status: 'effectiveness_review',
    priority: 'routine',
    rigId: null,
    rigName: null,
    department: 'Quality',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-011',
    assignedToName: 'Yusuf Ibrahim',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2024-047',
    problemStatement:
      'Missing MSDS documentation for 3 chemicals at Rig Charlie (NCO-2024-047) resulted from a gap in the receiving inspection process. Current receiving checklist does not include MSDS/SDS verification as a mandatory step for chemical products.',
    rootCauseAnalysis:
      'Receiving inspection checklist (ADI-LOG-FORM-004) was last revised in 2021 and does not reflect current chemical management requirements under ADI-HSE-PROC-011 (2023 revision). Process gap: form not updated when procedure was revised.',
    immediateActions: 'All chemical SDS documents retrieved and filed. Chemical register at Rig Charlie updated.',
    actions: [
      {
        id: 'CAPA-2024-008-A01',
        description: 'Revise receiving inspection checklist (ADI-LOG-FORM-004) to include SDS verification field for chemical items',
        responsiblePersonId: 'USR-004',
        responsiblePersonName: 'Fatima Al-Subaie',
        dueDate: '2025-02-01',
        completedDate: '2025-01-30',
        status: 'completed',
        evidence: 'ADI-LOG-FORM-004 Rev 4 issued.',
      },
      {
        id: 'CAPA-2024-008-A02',
        description: 'Train all warehouse and logistics personnel on revised chemical receiving procedure',
        responsiblePersonId: 'USR-011',
        responsiblePersonName: 'Yusuf Ibrahim',
        dueDate: '2025-02-28',
        completedDate: '2025-02-25',
        status: 'completed',
        evidence: 'Training attendance records on file.',
      },
    ],
    verificationMethod: 'Audit of 10 chemical receiving inspection records across 3 rigs confirming SDS field completed on all records.',
    effectivenessDate: '2025-06-01',
    raisedDate: '2024-12-25',
    dueDate: '2025-03-01',
    tags: ['MSDS', 'SDS', 'Receiving Inspection', 'Chemical Management', 'Warehouse'],
  },
  {
    id: 'CAPA-2025-001',
    title: 'Drill String Inspection Interval Reduction — DS1 Category 3 to 6-Month Cycle',
    type: 'corrective',
    status: 'in_progress',
    priority: 'high',
    rigId: null,
    rigName: null,
    department: 'Asset Management',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-020',
    assignedToName: 'Abdullah Qasim',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2024-042',
    problemStatement:
      'Fatigue crack discovered in DS1 Category 3 saver sub (NCO-2024-042) only 7 months after passing annual MPI inspection. Annual inspection interval is insufficient for high-cycle bending fatigue conditions encountered during extended-reach directional drilling.',
    rootCauseAnalysis:
      'API RP 7G-2 recommends 6-month inspection intervals for Category 3 components used in high-bending-load service. ADI interval of 12 months was not updated to reflect actual service conditions when well profiles became increasingly directional from 2022 onwards.',
    immediateActions: 'Cracked saver sub scrapped. All remaining saver subs on AD-202 emergency-inspected.',
    actions: [
      {
        id: 'CAPA-2025-001-A01',
        description: 'Raise MOC to formally change DS1 Cat 3 inspection interval to 6 months',
        responsiblePersonId: 'USR-020',
        responsiblePersonName: 'Abdullah Qasim',
        dueDate: '2025-02-01',
        completedDate: '2025-01-15',
        status: 'completed',
        evidence: 'MOC-2025-006 raised and approved.',
      },
      {
        id: 'CAPA-2025-001-A02',
        description: 'Schedule and complete 6-month MPI/UT inspection on all DS1 Cat 3 components fleet-wide',
        responsiblePersonId: 'USR-020',
        responsiblePersonName: 'Abdullah Qasim',
        dueDate: '2025-07-01',
        status: 'in_progress',
      },
      {
        id: 'CAPA-2025-001-A03',
        description: 'Update DS1 bending fatigue risk score matrix to include DLS exposure tracking',
        responsiblePersonId: 'USR-020',
        responsiblePersonName: 'Abdullah Qasim',
        dueDate: '2025-06-01',
        status: 'in_progress',
      },
    ],
    verificationMethod: 'Confirm 6-month inspection cycle in CMMS. First cycle completion inspections reviewed by QM.',
    raisedDate: '2025-01-10',
    dueDate: '2025-07-01',
    tags: ['Drill String', 'DS1', 'Inspection Interval', 'Fatigue', 'Asset Management'],
  },
  {
    id: 'CAPA-2025-002',
    title: 'Top Drive Oil Filter Specification Control — Mandate OEM Parts Only',
    type: 'corrective',
    status: 'closed',
    priority: 'high',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    department: 'Maintenance',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-008',
    assignedToName: 'Khalid Mahmoud',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2025-001',
    problemStatement:
      'Top drive filter element failure (NCO-2025-001) caused by installation of sub-specification non-OEM filter element. Sub-spec element (7 micron vs required 5 micron) allowed accelerated gear wear. Filter element was procured from non-approved supplier.',
    rootCauseAnalysis:
      'Purchase order for filter elements did not specify OEM part number — only generic description. Procurement purchased lowest-cost alternative without confirming specification equivalency. No approved supplier list for critical spares was in place.',
    immediateActions: 'Correct OEM filter elements installed. Oil flushed. Top drive returned to service.',
    actions: [
      {
        id: 'CAPA-2025-002-A01',
        description: 'Create critical spare parts approved supplier list (ASL) for all three rigs',
        responsiblePersonId: 'USR-012',
        responsiblePersonName: 'Khalid Al-Harbi',
        dueDate: '2025-04-01',
        completedDate: '2025-03-28',
        status: 'completed',
        evidence: 'ADI-SCM-ASL-001 Rev 1 issued — covers 245 critical spare part numbers.',
      },
      {
        id: 'CAPA-2025-002-A02',
        description: 'Update PO process to require OEM part number on all critical spare part orders',
        responsiblePersonId: 'USR-012',
        responsiblePersonName: 'Khalid Al-Harbi',
        dueDate: '2025-04-15',
        completedDate: '2025-04-10',
        status: 'completed',
        evidence: 'Procurement system updated. PO form Rev 5 requires OEM P/N field for critical items.',
      },
    ],
    verificationMethod: 'Review of 20 POs for critical spares confirming OEM P/N specified.',
    verificationDate: '2025-07-01',
    verifiedById: 'USR-002',
    verifiedByName: 'Emma Richards',
    closedDate: '2025-07-08',
    raisedDate: '2025-01-20',
    dueDate: '2025-04-15',
    tags: ['Top Drive', 'Filter', 'OEM Parts', 'Procurement', 'Approved Supplier List'],
  },
  {
    id: 'CAPA-2025-003',
    title: 'Cement Mixing Quality Assurance — Mandatory QE Witness Scheduling Protocol',
    type: 'corrective',
    status: 'effectiveness_review',
    priority: 'high',
    rigId: null,
    rigName: null,
    department: 'Quality',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-002',
    assignedToName: 'Emma Richards',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2024-045',
    problemStatement:
      'Cement job executed without mandatory QE witness (NCO-2024-045). Root cause: scheduling conflict not identified due to absence of a formal QE availability confirmation step in pre-job process.',
    rootCauseAnalysis:
      'Pre-job safety meeting checklist does not include a dedicated line item requiring confirmation of QE witness availability for casing cement jobs. QE attendance was assumed without formal confirmation.',
    immediateActions: 'Post-job cement evaluation confirmed adequate results. No operational impact.',
    actions: [
      {
        id: 'CAPA-2025-003-A01',
        description: 'Revise Pre-Job Safety Meeting checklist (ADI-QMS-FORM-003) to include QE witness confirmation for cement jobs',
        responsiblePersonId: 'USR-004',
        responsiblePersonName: 'Fatima Al-Subaie',
        dueDate: '2025-03-15',
        completedDate: '2025-03-12',
        status: 'completed',
        evidence: 'ADI-QMS-FORM-003 Rev 4 issued with QE witness confirmation field.',
      },
      {
        id: 'CAPA-2025-003-A02',
        description: 'Implement 48-hour advance QE scheduling notification for all casing cement jobs',
        responsiblePersonId: 'USR-002',
        responsiblePersonName: 'Emma Richards',
        dueDate: '2025-03-15',
        completedDate: '2025-03-10',
        status: 'completed',
        evidence: 'ADI-OPS-PROC-041 Rev 3 includes 48-hr QE notification requirement.',
      },
    ],
    verificationMethod: 'Review of all casing cement job records from April–June 2025 confirming QE witness present and signed off.',
    effectivenessDate: '2026-03-10',
    raisedDate: '2025-01-15',
    dueDate: '2025-03-15',
    tags: ['Cementing', 'QE Witness', 'Pre-Job Meeting', 'Procedure Update', 'Scheduling'],
  },
  {
    id: 'CAPA-2025-004',
    title: 'Welder Qualification Verification — Pre-Job Position Qualification Check',
    type: 'corrective',
    status: 'in_progress',
    priority: 'critical',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Quality',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-010',
    assignedToName: 'David Chen',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2025-009',
    problemStatement:
      'Radiographic test failure on kill line weld (NCO-2025-009) found to be performed by a welder lacking the required 6GR qualification. Welder qualification verification process did not confirm specific position qualification before job assignment.',
    rootCauseAnalysis:
      'Hot work permit process checks for valid welder qualification certificate (WPS compliance) but does not verify that the specific welding position qualification required for the joint configuration is covered by the welder\'s current qualification record. 6G and 6GR are distinct qualifications under ASME IX.',
    immediateActions: 'Defective weld section removed. Re-weld performed by 6GR-qualified welder. RT test passed.',
    actions: [
      {
        id: 'CAPA-2025-004-A01',
        description: 'Update Hot Work Permit to require position-specific qualification verification for pressure-containing welds',
        responsiblePersonId: 'USR-009',
        responsiblePersonName: 'Ali Hassan',
        dueDate: '2025-11-01',
        status: 'in_progress',
      },
      {
        id: 'CAPA-2025-004-A02',
        description: 'Audit all current welder qualification records fleet-wide against actual welding position requirements',
        responsiblePersonId: 'USR-010',
        responsiblePersonName: 'David Chen',
        dueDate: '2025-12-01',
        status: 'open',
      },
      {
        id: 'CAPA-2025-004-A03',
        description: 'Conduct additional 6GR welding qualification course for affected welders',
        responsiblePersonId: 'USR-013',
        responsiblePersonName: 'James Cooper',
        dueDate: '2026-01-31',
        status: 'open',
      },
    ],
    verificationMethod: 'Hot work permit audit confirming position qualification verified on 10 consecutive pressure-containing weld jobs.',
    raisedDate: '2025-08-20',
    dueDate: '2026-01-31',
    tags: ['Welder Qualification', 'Hot Work Permit', 'ASME IX', '6GR', 'Kill Line', 'Critical'],
  },
  {
    id: 'CAPA-2025-005',
    title: 'Thread Gauge Calibration — Implement Bi-Annual Calibration and OEM Bulletin Tracking',
    type: 'corrective',
    status: 'closed',
    priority: 'routine',
    rigId: null,
    rigName: null,
    department: 'Quality',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-002',
    assignedToName: 'Emma Richards',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2025-007',
    problemStatement:
      'Two thread gauges found out of calibration (NCO-2025-007) at 12-month interval. High-temperature desert service causes greater thermal expansion and wear than temperate climates, requiring more frequent calibration.',
    rootCauseAnalysis:
      'Calibration interval was set at 12 months at rig commissioning without adjustment for desert service conditions. API RP 7G-2 recommends 6-month calibration for gauges in high-temperature service.',
    immediateActions: 'Both gauges recalibrated. Suspect readings re-inspected.',
    actions: [
      {
        id: 'CAPA-2025-005-A01',
        description: 'Update calibration schedule for all thread gauges fleet-wide to 6-month interval',
        responsiblePersonId: 'USR-002',
        responsiblePersonName: 'Emma Richards',
        dueDate: '2025-08-01',
        completedDate: '2025-07-28',
        status: 'completed',
        evidence: 'Calibration register updated in QMS system.',
      },
    ],
    verificationMethod: 'Confirm 6-month calibration cycle completed on all gauges at next due date.',
    closedDate: '2025-11-01',
    raisedDate: '2025-05-15',
    dueDate: '2025-08-01',
    tags: ['Thread Gauge', 'Calibration', 'API RP 7G-2', 'Desert Service', 'Fleet-Wide'],
  },
  {
    id: 'CAPA-2025-006',
    title: 'Fuel Quality Incoming Inspection — Water Content Test Added to Receiving Procedure',
    type: 'corrective',
    status: 'in_progress',
    priority: 'high',
    rigId: null,
    rigName: null,
    department: 'Logistics',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-012',
    assignedToName: 'Khalid Al-Harbi',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2025-006',
    problemStatement:
      'Water contamination in diesel fuel at Rig Charlie (NCO-2025-006) was detected during routine in-service testing, not at receiving. Earlier detection would have prevented contaminated fuel entering the storage system.',
    rootCauseAnalysis:
      'Fuel receiving inspection checklist does not include water content test. Visual inspection and density check only are performed at delivery.',
    immediateActions: 'Contaminated tank isolated. Generators switched to clean fuel source.',
    actions: [
      {
        id: 'CAPA-2025-006-A01',
        description: 'Add Karl Fischer water content test to fuel receiving inspection for all fuel deliveries to rigs',
        responsiblePersonId: 'USR-017',
        responsiblePersonName: 'Tariq Nasser',
        dueDate: '2025-07-01',
        status: 'in_progress',
      },
      {
        id: 'CAPA-2025-006-A02',
        description: 'Procure portable fuel water test kits for all three rig sites',
        responsiblePersonId: 'USR-012',
        responsiblePersonName: 'Khalid Al-Harbi',
        dueDate: '2025-06-15',
        status: 'in_progress',
      },
    ],
    verificationMethod: 'Confirm water content test recorded on 10 consecutive fuel delivery inspection records across all rigs.',
    raisedDate: '2025-04-10',
    dueDate: '2025-07-01',
    tags: ['Fuel Quality', 'Diesel', 'Water Contamination', 'Receiving Inspection', 'Logistics'],
  },
  {
    id: 'CAPA-2025-007',
    title: 'Kill Line Weld Repair and High-Pressure Piping Inspection Programme',
    type: 'both',
    status: 'in_progress',
    priority: 'critical',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    department: 'Quality',
    raisedById: 'USR-001',
    raisedByName: 'Hassan Al-Qahtani',
    raisedByInitials: 'HQ',
    raisedByAvatarColor: '#1A73E8',
    assignedToId: 'USR-010',
    assignedToName: 'David Chen',
    sourceType: 'nco',
    sourceRecordId: 'NCO-2025-009',
    problemStatement:
      'Kill line weld failure (NCO-2025-009) with gas porosity and linear defects exceeding ASME B31.3 acceptance criteria. Risk of high-pressure failure during well control operations. Fleet-wide inspection of safety-critical welds required.',
    rootCauseAnalysis: 'See NCO-2025-009 and CAPA-2025-004 for detailed root cause.',
    immediateActions: 'Defective section removed and re-welded by qualified 6GR welder. RT test passed. Kill line returned to service.',
    actions: [
      {
        id: 'CAPA-2025-007-A01',
        description: 'Perform 100% RT inspection of all safety-critical high-pressure welds on Rig Bravo (kill/choke lines)',
        responsiblePersonId: 'USR-010',
        responsiblePersonName: 'David Chen',
        dueDate: '2025-10-31',
        status: 'in_progress',
      },
      {
        id: 'CAPA-2025-007-A02',
        description: 'Extend RT inspection programme to Rig Alpha and Rig Charlie kill/choke lines',
        responsiblePersonId: 'USR-002',
        responsiblePersonName: 'Emma Richards',
        dueDate: '2025-12-31',
        status: 'open',
      },
    ],
    verificationMethod: 'RT inspection reports for all safety-critical welds reviewed and accepted by Lead Auditor.',
    raisedDate: '2025-08-20',
    dueDate: '2025-12-31',
    tags: ['Kill Line', 'Weld Inspection', 'RT', 'High Pressure', 'Safety Critical', 'ASME B31.3'],
  },
];

// ────────────────────────────────────────────────────────────
// AUDITS
// ────────────────────────────────────────────────────────────

export type AuditType =
  | 'internal_qms'
  | 'hse_rig'
  | 'iadc'
  | 'saudi_aramco'
  | 'management_review'
  | 'third_party_api'
  | 'bop_test_audit';

export type AuditStatus =
  | 'planned'
  | 'in_progress'
  | 'draft_report'
  | 'report_issued'
  | 'findings_open'
  | 'closed';

export type FindingSeverity = 'major' | 'minor' | 'observation' | 'opportunity_for_improvement';

export interface AuditFinding {
  id: string;
  severity: FindingSeverity;
  clauseReference: string;
  description: string;
  evidence: string;
  assignedToName: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'closed';
  closedDate?: string;
  closureEvidence?: string;
}

export interface AuditRecord {
  id: string;
  title: string;
  type: AuditType;
  status: AuditStatus;
  rigId: string | null;
  rigName: string | null;
  location: string;
  leadAuditorId: string;
  leadAuditorName: string;
  auditTeam: string[];
  scope: string;
  standardsApplicable: string[];
  plannedDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  reportIssuedDate?: string;
  closedDate?: string;
  findings: AuditFinding[];
  summaryScore?: number;
  summaryNotes?: string;
  tags: string[];
}

export const AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'AUD-2024-001',
    title: 'Q1 2024 Internal QMS Audit — Rig Alpha Operations',
    type: 'internal_qms',
    status: 'closed',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    location: 'Well ADB-31 / Rig Alpha',
    leadAuditorId: 'USR-003',
    leadAuditorName: 'Andrew Campbell',
    auditTeam: ['Andrew Campbell', 'Emma Richards'],
    scope: 'ISO 9001:2015 §§ 6, 7, 8, 9, 10 — Operations planning, competency, resource management, drilling procedure compliance, NCO management.',
    standardsApplicable: ['ISO 9001:2015', 'ADI-QMS-PROC-001'],
    plannedDate: '2024-02-15',
    actualStartDate: '2024-02-15',
    actualEndDate: '2024-02-17',
    reportIssuedDate: '2024-02-25',
    closedDate: '2024-05-10',
    findings: [
      {
        id: 'AUD-2024-001-F01',
        severity: 'minor',
        clauseReference: 'ISO 9001:2015 § 7.5.3',
        description: 'Drill floor job card forms for 3 connections found with incomplete entries (no supervisor signature).',
        evidence: 'Review of 15 job cards from January 2024 — 3 of 15 unsigned.',
        assignedToName: 'Omar Hassan',
        dueDate: '2024-04-01',
        status: 'closed',
        closedDate: '2024-03-28',
        closureEvidence: 'All outstanding cards signed. Toolbox talk issued on form completion requirements.',
      },
    ],
    summaryScore: 88,
    summaryNotes: 'Overall QMS compliance satisfactory. Minor documentation gaps addressed.',
    tags: ['Internal Audit', 'QMS', 'Rig Alpha', 'Q1 2024'],
  },
  {
    id: 'AUD-2024-002',
    title: 'IADC RigPass HSE Audit — Rig Bravo (AD-202)',
    type: 'iadc',
    status: 'closed',
    rigId: 'AD-202',
    rigName: 'Rig Bravo',
    location: 'Well ADB-41 / Rig Bravo',
    leadAuditorId: 'USR-003',
    leadAuditorName: 'Andrew Campbell',
    auditTeam: ['Andrew Campbell', 'David Chen', 'IADC External Auditor'],
    scope: 'IADC HSE Case for Drilling Contractors — Personnel competency, wellsite HSE management, emergency response readiness, PTW system.',
    standardsApplicable: ['IADC HSE Case Guidelines', 'API RP 75', 'SAUDIARAMCO GI 3.100'],
    plannedDate: '2024-04-10',
    actualStartDate: '2024-04-10',
    actualEndDate: '2024-04-12',
    reportIssuedDate: '2024-04-25',
    closedDate: '2024-07-15',
    findings: [
      {
        id: 'AUD-2024-002-F01',
        severity: 'major',
        clauseReference: 'IADC HSE Case § 5.4 — Emergency Response',
        description: 'Emergency response muster drill records for Rig Bravo incomplete — only 2 of required 4 drills recorded in Q4 2023.',
        evidence: 'Drill records review: Q4 2023 register shows 2 drills; ADI requirement is monthly (4 minimum in Q4).',
        assignedToName: 'Carlos Mendez',
        dueDate: '2024-05-31',
        status: 'closed',
        closedDate: '2024-05-28',
        closureEvidence: 'Monthly drill schedule reinstated. April and May 2024 drills completed and recorded. Process owner defined.',
      },
      {
        id: 'AUD-2024-002-F02',
        severity: 'observation',
        clauseReference: 'IADC HSE Case § 4.2 — Competency',
        description: 'No formal competency gap analysis completed for 2 newly promoted Drillers on Rig Bravo.',
        evidence: 'Review of personnel files for recently promoted Drillers — no written competency gap assessment found.',
        assignedToName: 'James Cooper',
        dueDate: '2024-06-30',
        status: 'closed',
        closedDate: '2024-06-25',
      },
    ],
    summaryScore: 82,
    summaryNotes: 'Emergency response drill records were the primary gap. Positive observations on PTW system and chemical management.',
    tags: ['IADC', 'HSE Audit', 'Rig Bravo', 'Emergency Response'],
  },
  {
    id: 'AUD-2024-003',
    title: 'Third-Party QMS Internal Audit — Dammam HQ & Rig Alpha',
    type: 'third_party_api',
    status: 'closed',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    location: 'Dammam Headquarters / Well ADB-42 Rig Alpha',
    leadAuditorId: 'USR-003',
    leadAuditorName: 'Andrew Campbell',
    auditTeam: ['Andrew Campbell', 'Emma Richards', 'Hassan Al-Qahtani (auditee/observer)'],
    scope:
      'ISO 9001:2015 full scope surveillance audit — Document control, management review, competency management, supplier qualification, non-conformance management, CAPA effectiveness, internal audit programme.',
    standardsApplicable: ['ISO 9001:2015', 'API Q2:2015'],
    plannedDate: '2024-06-12',
    actualStartDate: '2024-06-12',
    actualEndDate: '2024-06-14',
    reportIssuedDate: '2024-06-28',
    closedDate: '2024-12-10',
    findings: [
      {
        id: 'AUD-2024-003-F01',
        severity: 'major',
        clauseReference: 'ISO 9001:2015 § 8.4.1 — Control of externally provided processes',
        description:
          'ADI supplier qualification register does not include 8 active suppliers who are providing safety-critical goods (mud chemicals, drill bits, BOP components). These suppliers have not been formally evaluated and approved per ADI-QMS-PROC-006.',
        evidence:
          'Approved Supplier List (ASL) reviewed: 8 suppliers invoiced in 2023-2024 for safety-critical items are not on the ASL. Procurement records confirm purchases made from these unapproved suppliers.',
        assignedToName: 'Khalid Al-Harbi',
        dueDate: '2024-09-30',
        status: 'closed',
        closedDate: '2024-09-25',
        closureEvidence: 'All 8 suppliers evaluated and added to ASL. ADI-SCM-ASL-001 Rev 1 issued.',
      },
      {
        id: 'AUD-2024-003-F02',
        severity: 'minor',
        clauseReference: 'ISO 9001:2015 § 9.3 — Management Review',
        description:
          'Management Review minutes for Q1 2024 do not include a review of CAPA status as required by ADI-QMS-PROC-002 §4.4. Two open CAPAs from 2023 not discussed.',
        evidence: 'Q1 2024 Management Review minutes reviewed — CAPA agenda item absent.',
        assignedToName: 'Hassan Al-Qahtani',
        dueDate: '2024-10-31',
        status: 'closed',
        closedDate: '2024-10-28',
        closureEvidence: 'Q2 and Q3 2024 Management Review minutes include CAPA status review. Q3 minutes attached.',
      },
      {
        id: 'AUD-2024-003-F03',
        severity: 'minor',
        clauseReference: 'ISO 9001:2015 § 7.5.2 — Creating and updating documented information',
        description: 'Document revision history on 4 rig-level procedures does not include change description column — only revision number and date recorded.',
        evidence: 'Sample of 10 rig procedures reviewed: 4 of 10 do not include change description in revision history table per ADI-QMS-PROC-001 §5.3.',
        assignedToName: 'Fatima Al-Subaie',
        dueDate: '2024-11-30',
        status: 'closed',
        closedDate: '2024-11-25',
        closureEvidence: 'All 4 procedures updated with full revision history. Document Control Procedure reminder issued.',
      },
      {
        id: 'AUD-2024-003-F04',
        severity: 'observation',
        clauseReference: 'ISO 9001:2015 § 6.1 — Actions to address risks and opportunities',
        description: 'Operational risk register has not been formally reviewed since March 2023. Significant operational changes (addition of Rig Charlie, new Saudi Aramco contract scope) not reflected in current risk register.',
        evidence: 'Risk register last review date: March 2023. Rig Charlie commenced operations November 2023.',
        assignedToName: 'Hassan Al-Qahtani',
        dueDate: '2024-12-31',
        status: 'closed',
        closedDate: '2024-12-15',
        closureEvidence: 'Risk register reviewed and updated December 2024.',
      },
    ],
    summaryScore: 79,
    summaryNotes:
      'Supplier qualification was the key systemic gap identified. CAPA and management review processes strengthened. Overall QMS foundations sound. Recommended for continued ISO 9001 registration.',
    tags: ['ISO 9001', 'Third Party Audit', 'Surveillance', 'Supplier Qualification', 'Rig Alpha', 'HQ'],
  },
  {
    id: 'AUD-2024-004',
    title: 'Saudi Aramco Contractor HSE Performance Audit — ADI Drilling',
    type: 'saudi_aramco',
    status: 'closed',
    rigId: null,
    rigName: null,
    location: 'Dammam Headquarters / All Active Rigs',
    leadAuditorId: 'USR-003',
    leadAuditorName: 'Andrew Campbell',
    auditTeam: ['Andrew Campbell', 'Ali Hassan', 'Saudi Aramco CSD Auditors'],
    scope: 'Saudi Aramco Contractor HSE Management System Assessment — GI 3.100 compliance, incident reporting, HSE performance metrics, site conditions.',
    standardsApplicable: ['Saudi Aramco GI 3.100', 'SAES-J-601', 'Saudi Aramco CPCM'],
    plannedDate: '2024-11-05',
    actualStartDate: '2024-11-05',
    actualEndDate: '2024-11-08',
    reportIssuedDate: '2024-11-20',
    closedDate: '2025-02-28',
    findings: [
      {
        id: 'AUD-2024-004-F01',
        severity: 'major',
        clauseReference: 'GI 3.100 § 7.3 — Competency and Training Records',
        description: 'IWCF certificate records for 3 drillers on Rig Alpha are not maintained in the site safety management system — certificates are held only by individuals and not uploaded to the ADI training matrix.',
        evidence: 'Rig Alpha training matrix: 3 driller IWCF certificates not uploaded. Certificates confirmed valid (held by personnel) but not accessible in system.',
        assignedToName: 'James Cooper',
        dueDate: '2024-12-15',
        status: 'closed',
        closedDate: '2024-12-12',
      },
      {
        id: 'AUD-2024-004-F02',
        severity: 'minor',
        clauseReference: 'GI 3.100 § 8.1 — BOP Testing and Records',
        description: 'Rig Bravo BOP test records for October 2024 show 2 test entries with the test pressure recorded in kPa rather than PSI as required by ADI-OPS-PROC-028 §6.2.',
        evidence: 'BOP test log AD-202: entries 14 Oct and 21 Oct 2024 — pressure in kPa. All other entries in PSI.',
        assignedToName: 'Carlos Mendez',
        dueDate: '2025-01-31',
        status: 'closed',
        closedDate: '2025-01-20',
      },
    ],
    summaryScore: 85,
    summaryNotes: 'Overall compliance satisfactory. ADI received "Satisfactory" rating from Saudi Aramco CSD. Training records gap was the primary finding.',
    tags: ['Saudi Aramco', 'HSE Audit', 'GI 3.100', 'Competency', 'BOP Records'],
  },
  {
    id: 'AUD-2025-001',
    title: 'Q1 2025 Internal BOP Test Audit — Rig Alpha',
    type: 'bop_test_audit',
    status: 'closed',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    location: 'Well ADB-47',
    leadAuditorId: 'USR-002',
    leadAuditorName: 'Emma Richards',
    auditTeam: ['Emma Richards'],
    scope: 'Review of all BOP pressure test records for Q1 2025. Verify test frequency, pressures, hold times, and record completeness per ADI-OPS-PROC-028 and Saudi Aramco SAES-J-601.',
    standardsApplicable: ['ADI-OPS-PROC-028 Rev 5', 'SAES-J-601', 'API 16A'],
    plannedDate: '2025-04-02',
    actualStartDate: '2025-04-02',
    actualEndDate: '2025-04-02',
    reportIssuedDate: '2025-04-10',
    closedDate: '2025-05-15',
    findings: [
      {
        id: 'AUD-2025-001-F01',
        severity: 'observation',
        clauseReference: 'ADI-OPS-PROC-028 § 5.3',
        description: 'One BOP test record (7 March 2025) missing the name of the company man witness. All other records complete.',
        evidence: 'BOP test log review: record dated 07/03/2025 — company man witness field blank.',
        assignedToName: 'Omar Hassan',
        dueDate: '2025-04-30',
        status: 'closed',
        closedDate: '2025-04-22',
        closureEvidence: 'Record corrected and initialled by company man. No recurrence in subsequent records.',
      },
    ],
    summaryScore: 97,
    summaryNotes: 'Excellent BOP record compliance. One minor observation, no findings of significance.',
    tags: ['BOP Audit', 'Internal', 'Rig Alpha', 'Q1 2025'],
  },
  {
    id: 'AUD-2025-002',
    title: 'Bi-Annual HSE Rig Audit — Rig Charlie Operational Readiness',
    type: 'hse_rig',
    status: 'findings_open',
    rigId: 'AD-203',
    rigName: 'Rig Charlie',
    location: 'Well ADB-61',
    leadAuditorId: 'USR-003',
    leadAuditorName: 'Andrew Campbell',
    auditTeam: ['Andrew Campbell', 'Peter Okafor'],
    scope: 'Full wellsite HSE audit — fire safety, chemical management, PPE compliance, dropped objects prevention, confined space management, electrical safety, first aid readiness.',
    standardsApplicable: ['ADI-HSE-PROC-002', 'Saudi Aramco SAES-B-058', 'NFPA 10'],
    plannedDate: '2025-10-15',
    actualStartDate: '2025-10-15',
    actualEndDate: '2025-10-17',
    reportIssuedDate: '2025-10-28',
    findings: [
      {
        id: 'AUD-2025-002-F01',
        severity: 'major',
        clauseReference: 'ADI-HSE-PROC-002 § 8 — Dropped Objects Prevention',
        description: 'DROPS inspection records for derrick internals (crown block area) show last inspection was 8 months ago — ADI requirement is quarterly. 4 inspections overdue.',
        evidence: 'DROPS register for Rig Charlie: last entry dated February 2025.',
        assignedToName: 'Tom Bradshaw',
        dueDate: '2025-12-31',
        status: 'in_progress',
      },
      {
        id: 'AUD-2025-002-F02',
        severity: 'minor',
        clauseReference: 'NFPA 10 § 7.3',
        description: '2 fire extinguishers on the cellar deck are overdue for annual service by 3 months.',
        evidence: 'Fire extinguisher service tags: 2 units show service date January 2025 (overdue as of October 2025).',
        assignedToName: 'Peter Okafor',
        dueDate: '2025-11-30',
        status: 'in_progress',
      },
    ],
    summaryScore: 76,
    summaryNotes: 'DROPS programme requires immediate attention. Fire equipment maintenance gap identified. Other areas (chemical management, PPE, first aid) were fully compliant.',
    tags: ['HSE Audit', 'Rig Charlie', 'DROPS', 'Fire Safety', '2025'],
  },
  {
    id: 'AUD-2025-003',
    title: 'ISO 9001 Recertification Audit — ADI Management System',
    type: 'internal_qms',
    status: 'report_issued',
    rigId: null,
    rigName: null,
    location: 'Dammam Headquarters',
    leadAuditorId: 'USR-003',
    leadAuditorName: 'Andrew Campbell',
    auditTeam: ['Andrew Campbell', 'External TÜV Rheinland Auditor'],
    scope: 'Full ISO 9001:2015 recertification audit of ADI Management System. Context of organization, leadership, planning, support, operations, performance evaluation, improvement.',
    standardsApplicable: ['ISO 9001:2015'],
    plannedDate: '2025-11-10',
    actualStartDate: '2025-11-10',
    actualEndDate: '2025-11-13',
    reportIssuedDate: '2025-12-01',
    findings: [
      {
        id: 'AUD-2025-003-F01',
        severity: 'minor',
        clauseReference: 'ISO 9001:2015 § 10.2.1',
        description: 'CAPA-2025-004 effectiveness review date has passed without formal effectiveness assessment being recorded.',
        evidence: 'CAPA register shows effectiveness review due date 15 October 2025 — no entry in effectiveness review field.',
        assignedToName: 'Hassan Al-Qahtani',
        dueDate: '2026-01-31',
        status: 'open',
      },
    ],
    summaryScore: 91,
    summaryNotes: 'ISO 9001:2015 certification recommended for renewal. One minor finding to be addressed within 90 days. Management system maturity significantly improved since 2024 audit.',
    tags: ['ISO 9001', 'Recertification', 'TÜV Rheinland', 'Management System', '2025'],
  },
  {
    id: 'AUD-2025-004',
    title: 'IADC Rig Audit — Rig Alpha (AD-201) Annual',
    type: 'iadc',
    status: 'findings_open',
    rigId: 'AD-201',
    rigName: 'Rig Alpha',
    location: 'Well ADB-47',
    leadAuditorId: 'USR-003',
    leadAuditorName: 'Andrew Campbell',
    auditTeam: ['Andrew Campbell', 'IADC External Auditor', 'Emma Richards'],
    scope: 'IADC Annual Rig Audit — Equipment and facility condition, competency, HSE management, operations documentation, well control capability.',
    standardsApplicable: ['IADC Drilling Manual', 'IADC HSE Case Guidelines', 'API RP 59'],
    plannedDate: '2025-11-20',
    actualStartDate: '2025-11-20',
    actualEndDate: '2025-11-22',
    reportIssuedDate: '2025-12-05',
    findings: [
      {
        id: 'AUD-2025-004-F01',
        severity: 'major',
        clauseReference: 'IADC Drilling Manual Ch. 7 — Driller KPI Documentation',
        description: 'Driller KPI documentation for September and October 2025 is incomplete — performance records for 4 of 6 drillers on Rig Alpha not filled in for these months.',
        evidence: 'Driller KPI register for AD-201: September KPIs: 2 of 6 complete. October KPIs: 2 of 6 complete.',
        assignedToName: 'Omar Hassan',
        dueDate: '2026-02-20',
        status: 'in_progress',
      },
      {
        id: 'AUD-2025-004-F02',
        severity: 'major',
        clauseReference: 'IADC HSE Case — BOP Maintenance Records',
        description: 'BOP maintenance log shows a 6-week gap in preventive maintenance entries from 3 September to 15 October 2025 — no PM activities recorded during this period.',
        evidence: 'BOP PM log: no entries between 03 Sep and 15 Oct 2025 (42 days). PM schedule requires bi-weekly entries minimum.',
        assignedToName: 'Khalid Mahmoud',
        dueDate: '2026-03-01',
        status: 'in_progress',
      },
      {
        id: 'AUD-2025-004-F03',
        severity: 'major',
        clauseReference: 'IADC HSE Case § 5.4 — Emergency Response Drill Records',
        description: 'Emergency response drill records for Q3 2025 missing from Rig Alpha HSE files. 3 drills conducted but records not filed in the HSE document management system.',
        evidence: 'Rig Alpha HSE file: Q3 2025 drill records absent. Crew confirmed drills were performed but not documented.',
        assignedToName: 'Ali Hassan',
        dueDate: '2026-02-28',
        status: 'in_progress',
      },
    ],
    summaryScore: 72,
    summaryNotes: 'Three major findings relate to documentation and records management rather than actual operational gaps. Operations and equipment condition scored well. Documentation culture improvement required.',
    tags: ['IADC', 'Rig Alpha', 'Annual Audit', 'KPI', 'BOP Records', 'Emergency Response'],
  },
];

// ────────────────────────────────────────────────────────────
// ANNUAL AUDIT PROGRAMME
// ────────────────────────────────────────────────────────────

export interface AuditProgrammeEntry {
  month: string;
  auditId?: string;
  title: string;
  type: AuditType;
  rigId: string | null;
  scheduledDate: string;
  status: 'planned' | 'completed' | 'overdue' | 'in_progress';
  auditorName: string;
}

export const ANNUAL_AUDIT_PROGRAMME_2025: AuditProgrammeEntry[] = [
  { month: 'January', auditId: undefined, title: 'Q1 BOP Test Audit — Rig Bravo', type: 'bop_test_audit', rigId: 'AD-202', scheduledDate: '2025-01-15', status: 'completed', auditorName: 'Emma Richards' },
  { month: 'February', auditId: undefined, title: 'Internal QMS Audit — Rig Charlie', type: 'internal_qms', rigId: 'AD-203', scheduledDate: '2025-02-18', status: 'completed', auditorName: 'Andrew Campbell' },
  { month: 'March', auditId: undefined, title: 'HSE Rig Audit — Rig Alpha', type: 'hse_rig', rigId: 'AD-201', scheduledDate: '2025-03-10', status: 'completed', auditorName: 'Andrew Campbell' },
  { month: 'April', auditId: 'AUD-2025-001', title: 'Q1 BOP Test Audit — Rig Alpha', type: 'bop_test_audit', rigId: 'AD-201', scheduledDate: '2025-04-02', status: 'completed', auditorName: 'Emma Richards' },
  { month: 'May', auditId: undefined, title: 'Internal QMS Audit — Rig Bravo', type: 'internal_qms', rigId: 'AD-202', scheduledDate: '2025-05-20', status: 'completed', auditorName: 'Andrew Campbell' },
  { month: 'June', auditId: undefined, title: 'Management Review — Q2 2025', type: 'management_review', rigId: null, scheduledDate: '2025-06-30', status: 'completed', auditorName: 'Hassan Al-Qahtani' },
  { month: 'July', auditId: undefined, title: 'HSE Rig Audit — Rig Bravo', type: 'hse_rig', rigId: 'AD-202', scheduledDate: '2025-07-14', status: 'completed', auditorName: 'Andrew Campbell' },
  { month: 'August', auditId: undefined, title: 'Internal QMS Audit — HQ Document Control', type: 'internal_qms', rigId: null, scheduledDate: '2025-08-11', status: 'completed', auditorName: 'Emma Richards' },
  { month: 'September', auditId: undefined, title: 'IADC RigPass Audit — Rig Bravo', type: 'iadc', rigId: 'AD-202', scheduledDate: '2025-09-08', status: 'completed', auditorName: 'Andrew Campbell' },
  { month: 'October', auditId: 'AUD-2025-002', title: 'Bi-Annual HSE Audit — Rig Charlie', type: 'hse_rig', rigId: 'AD-203', scheduledDate: '2025-10-15', status: 'completed', auditorName: 'Andrew Campbell' },
  { month: 'November', auditId: 'AUD-2025-003', title: 'ISO 9001 Recertification Audit — HQ', type: 'internal_qms', rigId: null, scheduledDate: '2025-11-10', status: 'completed', auditorName: 'Andrew Campbell' },
  { month: 'November', auditId: 'AUD-2025-004', title: 'IADC Annual Rig Audit — Rig Alpha', type: 'iadc', rigId: 'AD-201', scheduledDate: '2025-11-20', status: 'in_progress', auditorName: 'Andrew Campbell' },
  { month: 'December', auditId: undefined, title: 'Management Review — Q4 2025 Annual', type: 'management_review', rigId: null, scheduledDate: '2025-12-15', status: 'planned', auditorName: 'Hassan Al-Qahtani' },
];

// ── Helpers ─────────────────────────────────────────────────
export const getMocById = (id: string) => MOC_RECORDS.find((m) => m.id === id);
export const getNcoById = (id: string) => NCO_RECORDS.find((n) => n.id === id);
export const getCapaById = (id: string) => CAPA_RECORDS.find((c) => c.id === id);
export const getAuditById = (id: string) => AUDIT_RECORDS.find((a) => a.id === id);
