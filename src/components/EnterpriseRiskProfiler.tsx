/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Globe, Building2, ShieldAlert, CheckCircle, Info, MapPin, BarChart3, Users } from "lucide-react";
import { ThreatModelData } from "../types";

interface EnterpriseRiskProfilerProps {
  modelData: ThreatModelData;
}

interface RegionRisk {
  name: string;
  code: string;
  score: number;
  grade: string;
  peakWindow: string;
  primaryVector: string;
  remediationStatus: "PENDING" | "MITIGATED" | "WARNING";
}

interface DeptRisk {
  name: string;
  score: number;
  staffCount: number;
  coreSystem: string;
  criticalBias: string;
  vulnerabilityText: string;
}

export default function EnterpriseRiskProfiler({ modelData }: EnterpriseRiskProfilerProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("AMER");
  const [selectedDept, setSelectedDept] = useState<string>("Treasury / Finance");

  // Dynamic values aligned to modelData
  const baseScore = modelData.vulnerabilityScore;

  const regions: RegionRisk[] = [
    {
      name: "North America (AMER)",
      code: "AMER",
      score: Math.min(95, Math.max(20, baseScore + 4)),
      grade: baseScore + 4 > 75 ? "D- (Critical)" : "C (Fragile)",
      peakWindow: modelData.orgName === "Vanguard Wealth Partners" ? "End-of-Month Close (UTC-5)" : "Quarterly Releases",
      primaryVector: "Targeted CEO-Spoofing & SMS Urgency",
      remediationStatus: "WARNING"
    },
    {
      name: "Europe, Middle East, Africa (EMEA)",
      code: "EMEA",
      score: Math.min(95, Math.max(20, baseScore - 6)),
      grade: baseScore - 6 > 70 ? "C- (Fragile)" : "B (Stable)",
      peakWindow: "Vat/Tax Audit Cycle (UTC+1)",
      primaryVector: "Vendor Routing Number Detail Swaps via PDF",
      remediationStatus: "PENDING"
    },
    {
      name: "Asia Pacific (APAC)",
      code: "APAC",
      score: Math.min(95, Math.max(20, baseScore + 2)),
      grade: baseScore + 2 > 75 ? "D (Vulnerable)" : "C+ (Moderate)",
      peakWindow: "Fiscal Year End Audits (UTC+8)",
      primaryVector: "Spear-Phishing / Executive Token Spoofing",
      remediationStatus: "WARNING"
    }
  ];

  const departments: DeptRisk[] = [
    {
      name: "Treasury / Finance",
      score: Math.min(98, Math.max(10, baseScore + 12)),
      staffCount: modelData.orgName === "Vanguard Wealth Partners" ? 18 : 34,
      coreSystem: "Central ERP Gateway (SAP / Oracle)",
      criticalBias: "Urgency Bias & Focal Tunneling under Closing stress",
      vulnerabilityText: "Highest transactional exposure. Susceptible to sudden payment instruction swaps and high-pressure wire commands from spoofed C-level vectors."
    },
    {
      name: "Human Resources / Payroll",
      score: Math.min(98, Math.max(10, baseScore + 5)),
      staffCount: modelData.orgName === "Vanguard Wealth Partners" ? 12 : 24,
      coreSystem: "HRIS SaaS / ADP Payroll Portal",
      criticalBias: "Empathy Bias & Candidate-Stress Co-dependence",
      vulnerabilityText: "At high risk during open enrollment or hiring cycles. Attackers impersonate candidates or legal entities to force credential recovery overrides."
    },
    {
      name: "IT Infrastructure & Security Ops",
      score: Math.min(98, Math.max(10, baseScore - 15)),
      staffCount: modelData.orgName === "Vanguard Wealth Partners" ? 8 : 15,
      coreSystem: "AWS Developer Console & Active Directory",
      criticalBias: "Authority Deference & Restoration Anxiety",
      vulnerabilityText: "Vulnerable to urgent, vocals-backed vishing claims alleging severe database outages or broken employee connections that trigger temporary bypass overrides."
    },
    {
      name: "Executive Strategy (C-Suite / VPs)",
      score: Math.min(98, Math.max(10, baseScore - 5)),
      staffCount: 14,
      coreSystem: "Gmail / Slack Exchange Node",
      criticalBias: "Availability Heuristic & Delegated Authority Bypass",
      vulnerabilityText: "Highly targeted. Often bypassed entirely via secondary assistants; secondary staff processing executive requests have lower validation checkpoints."
    },
    {
      name: "Customer Operations & Support",
      score: Math.min(98, Math.max(10, baseScore + 10)),
      staffCount: 120,
      coreSystem: "Zendesk ticket stack",
      criticalBias: "Escalation Avoidance & Time-to-Resolve SLA Panic",
      vulnerabilityText: "High volume, low individual friction. Attackers leverage simulated angry customers to convince tiers 1 & 2 to bypass strict authentication guidelines."
    }
  ];

  const activeRegionData = regions.find(r => r.code === selectedRegion) || regions[0];
  const activeDeptData = departments.find(d => d.name === selectedDept) || departments[0];

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mb-6" id="enterprise-risk-profiler-container">
      {/* Tab Header wrapper */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2" id="enterprise-profiler-header">
        <div className="flex items-center gap-2" id="enterprise-title-group">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg" id="enterprise-badge">
            <Globe className="w-5 h-5 text-indigo-400" id="enterprise-icon" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-display" id="enterprise-heading">
              Global MNC Risk Profiler
            </h3>
            <p className="text-[10px] text-indigo-300 font-mono tracking-tight uppercase" id="enterprise-subheading">
              Multi-Region & Departmental Security Assessment
            </p>
          </div>
        </div>
        <div className="text-right" id="enterprise-scope-badge">
          <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold uppercase" id="scope-pill">
            Enterprise Tier Active
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6" id="enterprise-desc">
        Large corporations present highly complex attack surfaces. View and stress-test global nodes across international departments and geographic offices to identify regional behavioral stress thresholds.
      </p>

      {/* Grid: Global Regions Comparison & Regional Interactive Drilldown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6" id="enterprise-global-layout">
        
        {/* Geographic Selection Block (5 cols) */}
        <div className="md:col-span-5 space-y-3" id="geographic-selection-col">
          <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5" id="geo-header">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Geographic Regions
          </h4>
          
          <div className="space-y-2" id="region-buttons-stack">
            {regions.map((r) => (
              <button
                key={r.code}
                id={`region-btn-${r.code}`}
                onClick={() => setSelectedRegion(r.code)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedRegion === r.code
                    ? "bg-indigo-600/10 border-indigo-505/50 shadow-md ring-1 ring-indigo-500/20"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300"
                }`}
              >
                <div>
                  <span className="text-xs font-bold block text-slate-100">{r.name}</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5 font-mono">{r.peakWindow}</span>
                </div>
                <div className="text-right" id={`region-score-grp-${r.code}`}>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    r.score > 75 ? "bg-rose-500/15 text-rose-300" : "bg-amber-500/15 text-amber-300"
                  }`}>
                    {r.score}% Risk
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Regional Detail Box */}
          {activeRegionData && (
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-2" id="regional-drilldown-box">
              <span className="text-[9px] font-mono font-extrabold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.0 py-0.5 rounded uppercase" id="drilldown-badge">
                {activeRegionData.code} Risk Profile
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1" id="drilldown-data-grid">
                <div>
                  <span className="text-slate-450 text-[10px] block font-mono">Assessed Resilience:</span>
                  <span className="font-bold text-slate-200 block">{activeRegionData.grade}</span>
                </div>
                <div>
                  <span className="text-slate-455 text-[10px] block font-mono">Top Threat Vector:</span>
                  <span className="font-bold text-slate-200 block truncate" title={activeRegionData.primaryVector}>
                    {activeRegionData.primaryVector}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between" id="drilldown-remediation-status">
                <span className="text-[10px] text-slate-400 font-mono">Cognitive Friction Cover:</span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                  activeRegionData.remediationStatus === "PENDING" ? "bg-amber-500/15 text-amber-300 border border-amber-500/20" :
                  activeRegionData.remediationStatus === "WARNING" ? "bg-rose-500/15 text-rose-300 border border-rose-500/20 animate-pulse" :
                  "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                }`}>
                  {activeRegionData.remediationStatus === "WARNING" ? "ACTION REQUIRED" : `${activeRegionData.remediationStatus}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Global Departments Matrix (7 cols) */}
        <div className="md:col-span-7 space-y-3" id="departments-matrix-col">
          <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5" id="dept-header">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Internal Global Departments
          </h4>

          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3" id="departmental-matrix-box">
            <div className="max-h-[210px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin" id="dept-items-scroller">
              {departments.map((d) => (
                <div
                  key={d.name}
                  onClick={() => setSelectedDept(d.name)}
                  id={`dept-row-${d.name.replace(/\s+/g, "")}`}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedDept === d.name
                      ? "bg-white/10 border-white/20 scale-[1.01] shadow-inner text-white"
                      : "bg-white/5 hover:bg-white/8 border-transparent text-slate-300"
                  }`}
                  style={{ contentVisibility: 'auto' }}
                >
                  <div className="flex items-center gap-3" id={`dept-meta-${d.name.replace(/\s+/g, "")}`}>
                    <div className="p-1.5 bg-slate-900 rounded-lg border border-white/10 shrink-0 text-slate-400" id={`dept-icon-box-${d.name.replace(/\s+/g, "")}`}>
                      <Users className="w-3.5 h-3.5" id={`dept-users-${d.name.replace(/\s+/g, "")}`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{d.name}</span>
                      <span className="text-[10px] text-slate-450 block font-mono">{d.staffCount} Global Staff Nodes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4" id={`dept-risk-${d.name.replace(/\s+/g, "")}`}>
                    <div className="text-right shrink-0" id={`dept-indicator-grp-${d.name.replace(/\s+/g, "")}`}>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                        d.score > 80 ? "bg-rose-500/15 text-rose-300" :
                        d.score > 60 ? "bg-amber-500/15 text-amber-300" :
                        "bg-emerald-500/15 text-emerald-300"
                      }`}>
                        {d.score}% Exposure
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Department Details Pane */}
            {activeDeptData && (
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2 mt-4" id="dept-drilldown-pane">
                <div className="flex items-center justify-between gap-2" id="dept-pane-header">
                  <span className="text-xs font-bold font-display text-white">{activeDeptData.name} Risk Metrics</span>
                  <span className="text-[9px] font-mono text-slate-400">CORE SYSTEM: {activeDeptData.coreSystem}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans" id="dept-pane-vulnerability">
                  {activeDeptData.vulnerabilityText}
                </p>
                <div className="pt-2 border-t border-white/5 flex items-start gap-1 text-[10px]" id="dept-pane-biases-row">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-slate-400">Critical Cognitive Trap: </span>
                    <span className="text-slate-200 font-medium">{activeDeptData.criticalBias}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Systemic Overview Panel of MNC Scale */}
      <div className="bg-amber-950/20 border border-amber-500/10 rounded-xl p-4 flex gap-3 text-xs" id="mnc-scale-warning">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" id="info-icon" />
        <div className="space-y-1" id="warning-text-box">
          <span className="font-mono font-extrabold uppercase text-amber-300 block tracking-wider text-[10px]">
            Enterprise Vulnerability Vector Amplification (Scale Notice)
          </span>
          <p className="text-slate-305 leading-relaxed font-sans">
            MNC scale multiplies administrative trust loops. With offices across multiple time zones, high-tempo approvals bypass key personnel who are offline, shifting focus to junior triage staff. To safely neutralize this scale risk, organizations must institute uniform <strong>Central Cognitive Friction Standards</strong> globally.
          </p>
        </div>
      </div>
    </div>
  );
}
