/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OrgProfile {
  orgName: string;
  industry: string;
  size: string;
  stressPeriod: string;
  tools: string[];
}

export interface VectorScore {
  vector: string;
  score: number; // 0 - 100
  reason: string;
}

export interface FrictionPersona {
  id: string;
  name: string;
  role: string;
  department: string;
  stressLevel: number; // 1 - 10
  workflows: string[];
  cognitiveBiases: string[]; // e.g. "Urgency Bias", "Authority Bias"
  vectorSusceptibilities: VectorScore[];
  remediationRequirements: string[];
}

export interface StressPoint {
  timeOffset: string; // e.g. "+0s", "+15s"
  stressLevel: number; // 0 - 100
  actionSummary: string;
}

export interface SimulationStep {
  step: number;
  timeOffset: string;
  actorAction: string;
  personaReaction: string;
  cognitiveFrictionTriggered: string | null;
  stressLevel: number; // 0 - 100
}

export interface SimulationResult {
  personaId: string;
  personaName: string;
  personaRole: string;
  vector: string;
  appliedFrictionId: string;
  appliedFrictionName: string;
  outcome: "BREACHED" | "INTERCEPTED";
  finalAnalysis: string;
  technicalVulnSummary: string;
  psychologicalBypassReason: string;
  timeline: SimulationStep[];
  remediationRecommendation: string;
}

export interface VulnerabilityMapCell {
  role: string;
  department: string;
  vector: string;
  riskRating: "HIGH" | "MEDIUM" | "LOW";
  score: number; // 0 - 100
  criticalTrigger: string;
}

export interface ThreatModelData {
  orgName: string;
  industry: string;
  vulnerabilityScore: number; // Overall risk rating 0-100 (where 0 stands for impenetrable, 100 for high exposure)
  resilienceRating: string; // e.g. "C (Fragile)", "A (Robust)"
  executiveSummary: string;
  personas: FrictionPersona[];
  vulnerabilityMap: VulnerabilityMapCell[];
  topSystemicHotspots: string[];
}

export interface FrictionPatch {
  id: string;
  name: string;
  category: "PROCESS" | "TECH" | "COGNITIVE";
  description: string;
  stretchesCognitiveTunnel: string; // How it expands reaction time or creates mental space
}
