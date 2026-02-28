// ============================================================
// RIGS DUMMY DATA
// Oil & Gas Operations Management Platform — ADI
// ============================================================

export type RigStatus = 'active' | 'standby' | 'maintenance' | 'cold_stacked';

export type RigType =
  | 'land_rig'
  | 'jack_up'
  | 'semi_submersible'
  | 'drillship';

export interface RigSpecifications {
  maxHookload_ton: number;
  drawworksHP: number;
  topDriveHP: number;
  mudPumpQty: number;
  mudPumpHP: number;
  riserCapacity_m?: number;
  maxWaterDepth_m?: number;
  derrickHeight_m: number;
  ratingDepth_m: number;
  bopStackPSI: number;
}

export interface Rig {
  id: string;
  name: string;
  assetNumber: string;
  type: RigType;
  status: RigStatus;
  currentLocation: string;
  wellName: string;
  operatorCompany: string;
  rigManagerId: string;
  rigManagerName: string;
  contractorName: string;
  spudDate: string;
  targetTD_m: number;
  currentDepth_m: number;
  currentPhase: string;
  hseStats: {
    ltifr: number;
    trifr: number;
    daysWithoutLTI: number;
    lastIncidentDate: string | null;
  };
  crew: {
    totalOnboard: number;
    companyMen: number;
    contractors: number;
    maxPOB: number;
  };
  specifications: RigSpecifications;
  certificationExpiry: string;
  lastInspectionDate: string;
  nextScheduledPM: string;
}

export const RIGS: Rig[] = [
  {
    id: 'AD-201',
    name: 'Rig Alpha',
    assetNumber: 'AD-201',
    type: 'land_rig',
    status: 'active',
    currentLocation: 'Rub Al Khali Desert Block — Sector 7',
    wellName: 'Well ADB-47',
    operatorCompany: 'Saudi Aramco',
    rigManagerId: 'USR-005',
    rigManagerName: 'Omar Hassan',
    contractorName: 'ADI Drilling LLC',
    spudDate: '2025-09-14',
    targetTD_m: 4850,
    currentDepth_m: 3240,
    currentPhase: '12¼" Hole Section — Intermediate Casing Run',
    hseStats: {
      ltifr: 0.0,
      trifr: 0.42,
      daysWithoutLTI: 312,
      lastIncidentDate: null,
    },
    crew: {
      totalOnboard: 68,
      companyMen: 22,
      contractors: 46,
      maxPOB: 80,
    },
    specifications: {
      maxHookload_ton: 450,
      drawworksHP: 2000,
      topDriveHP: 1100,
      mudPumpQty: 3,
      mudPumpHP: 1600,
      derrickHeight_m: 54.8,
      ratingDepth_m: 6000,
      bopStackPSI: 10000,
    },
    certificationExpiry: '2026-08-31',
    lastInspectionDate: '2025-08-15',
    nextScheduledPM: '2026-03-01',
  },
  {
    id: 'AD-202',
    name: 'Rig Bravo',
    assetNumber: 'AD-202',
    type: 'land_rig',
    status: 'active',
    currentLocation: 'Rub Al Khali Desert Block — Sector 12',
    wellName: 'Well ADB-52',
    operatorCompany: 'Saudi Aramco',
    rigManagerId: 'USR-015',
    rigManagerName: 'Carlos Mendez',
    contractorName: 'ADI Drilling LLC',
    spudDate: '2025-10-02',
    targetTD_m: 5100,
    currentDepth_m: 2870,
    currentPhase: '17½" Hole Section — Directional Drilling',
    hseStats: {
      ltifr: 0.0,
      trifr: 0.58,
      daysWithoutLTI: 187,
      lastIncidentDate: '2025-08-24',
    },
    crew: {
      totalOnboard: 72,
      companyMen: 24,
      contractors: 48,
      maxPOB: 80,
    },
    specifications: {
      maxHookload_ton: 500,
      drawworksHP: 2200,
      topDriveHP: 1250,
      mudPumpQty: 3,
      mudPumpHP: 1600,
      derrickHeight_m: 57.9,
      ratingDepth_m: 7000,
      bopStackPSI: 10000,
    },
    certificationExpiry: '2026-11-30',
    lastInspectionDate: '2025-11-10',
    nextScheduledPM: '2026-04-15',
  },
  {
    id: 'AD-203',
    name: 'Rig Charlie',
    assetNumber: 'AD-203',
    type: 'land_rig',
    status: 'active',
    currentLocation: 'Rub Al Khali Desert Block — Sector 3',
    wellName: 'Well ADB-61',
    operatorCompany: 'Saudi Aramco',
    rigManagerId: 'USR-022',
    rigManagerName: 'Tom Bradshaw',
    contractorName: 'ADI Drilling LLC',
    spudDate: '2025-11-18',
    targetTD_m: 4400,
    currentDepth_m: 1650,
    currentPhase: '26" Hole Section — Surface Casing Setting',
    hseStats: {
      ltifr: 0.0,
      trifr: 0.31,
      daysWithoutLTI: 94,
      lastIncidentDate: '2025-11-24',
    },
    crew: {
      totalOnboard: 65,
      companyMen: 20,
      contractors: 45,
      maxPOB: 80,
    },
    specifications: {
      maxHookload_ton: 420,
      drawworksHP: 1800,
      topDriveHP: 1000,
      mudPumpQty: 2,
      mudPumpHP: 1600,
      derrickHeight_m: 52.4,
      ratingDepth_m: 5500,
      bopStackPSI: 10000,
    },
    certificationExpiry: '2027-02-28',
    lastInspectionDate: '2025-01-10',
    nextScheduledPM: '2026-05-01',
  },
];

export const getRigById = (id: string): Rig | undefined =>
  RIGS.find((r) => r.id === id);
