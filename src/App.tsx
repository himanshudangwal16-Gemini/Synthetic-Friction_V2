/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, FileText, Lock, FileDown, ShieldCheck, Printer, ArrowRight, HelpCircle, Eye, Info, RefreshCw, Grid, Cpu, Globe, Calculator } from "lucide-react";
import OrgConfigPanel from "./components/OrgConfigPanel";
import VulnerabilityMapGrid from "./components/VulnerabilityMapGrid";
import PersonaListView from "./components/PersonaListView";
import ThreatSimulator from "./components/ThreatSimulator";
import FrictionPatchesInfo from "./components/FrictionPatchesInfo";
import EnterpriseRiskProfiler from "./components/EnterpriseRiskProfiler";
import FinancialCalculator from "./components/FinancialCalculator";
import EnterprisePolicyGenerator from "./components/EnterprisePolicyGenerator";
import { OrgProfile, ThreatModelData } from "./types";

// High-fidelity preloaded default model data (representing Vanguard Wealth Partners)
const DEFAULT_PRELOAD: ThreatModelData = {
  orgName: "Vanguard Wealth Partners",
  industry: "Financial Services",
  vulnerabilityScore: 71,
  resilienceRating: "D (Vulnerable to Urgency)",
  executiveSummary: "Vanguard Wealth Partners' workforce shows a concentrated behavioral risk profile around End-of-Month closings. Task tunneling and strong authority deference represent critical single points of failure in administrative pathways, primarily when exposed to high-pressure CEO-spoofing vectors or fast-paced supplier account adjustments.",
  vulnerabilityMap: [
    { role: "Senior Accountant", department: "Treasurer Operations", vector: "Executive Spoofing SMS", riskRating: "HIGH", score: 85, criticalTrigger: "Exploits high urgency bias during peak end-of-month reconciliations." },
    { role: "Senior Accountant", department: "Treasurer Operations", vector: "Priority Vendor Account Swap Guide", riskRating: "HIGH", score: 76, criticalTrigger: "Payment detail adjustment is approved while busy clearing backlog." },
    { role: "Senior Accountant", department: "Treasurer Operations", vector: "Urgent Domain Expiry Vishing", riskRating: "LOW", score: 35, criticalTrigger: "Usually ignores unsolicited domains unless spoofed as IT helpdesk." },
    
    { role: "IT Desk Technician", department: "Information Security", vector: "Executive Spoofing SMS", riskRating: "MEDIUM", score: 55, criticalTrigger: "Trusts text queries resembling CTO profile unless asking for credentials." },
    { role: "IT Desk Technician", department: "Information Security", vector: "Priority Vendor Account Swap Guide", riskRating: "LOW", score: 20, criticalTrigger: "Outside standard system operational tasks." },
    { role: "IT Desk Technician", department: "Information Security", vector: "Urgent Domain Expiry Vishing", riskRating: "HIGH", score: 82, criticalTrigger: "A panic call demanding immediate critical site restoration bypasses validation rules." },

    { role: "HR Operations Associate", department: "Human Resources", vector: "Executive Spoofing SMS", riskRating: "HIGH", score: 78, criticalTrigger: "Rushed text asking for immediate CSV payroll spreadsheet dump." },
    { role: "HR Operations Associate", department: "Human Resources", vector: "Priority Vendor Account Swap Guide", riskRating: "MEDIUM", score: 58, criticalTrigger: "Accepts fraudulent invoice masked as recruitment platform provider fee." },
    { role: "HR Operations Associate", department: "Human Resources", vector: "Urgent Domain Expiry Vishing", riskRating: "MEDIUM", score: 62, criticalTrigger: "Convinced to support applicant credential recovery under severe delays." }
  ],
  personas: [
    {
      id: "p_1",
      name: "Arthur Pendelton",
      role: "Senior Accountant",
      department: "Treasurer Operations",
      stressLevel: 8,
      workflows: ["Processing large supplier clearances", "Handling end-of-month reconciliation reports", "Approving wire instructions and ledger updates"],
      cognitiveBiases: [
        "Urgency Bias (Severe time framing override prompts instant motor actions)",
        "Task Tunneling (High focus on ledger zeroing overlooks email address spoofing markers)"
      ],
      vectorSusceptibilities: [
        { vector: "Executive Spoofing SMS", score: 85, reason: "When leadership demands immediate wire approvals during accounting close, deference overrides ledger safety checks." },
        { vector: "Priority Vendor Account Swap Guide", score: 76, reason: "Rushed processing loops cause quick checks of incoming routing number PDFs without secondary confirmation." },
        { vector: "Urgent Domain Expiry Vishing", score: 35, reason: "Skeptical of unsolicited phone queries; standard protocols are typically maintained." }
      ],
      remediationRequirements: ["patch_cooldown", "patch_mfa"]
    },
    {
      id: "p_2",
      name: "Marcus Brody",
      role: "IT Desk Technician",
      department: "Information Security",
      stressLevel: 7,
      workflows: ["Monitoring server security logs", "Provisioning guest network certificates", "Clearing high-volume tech support tickets"],
      cognitiveBiases: [
        "Information Overload (Reviewing multiple system feeds causes micro-errors)",
        "Authority Bias (Automatic cooperation with urgent executive-badged support requests)"
      ],
      vectorSusceptibilities: [
        { vector: "Executive Spoofing SMS", score: 55, reason: "Will verify standard SMS links, but high task urgency can lead to rapid guest log permissions." },
        { vector: "Priority Vendor Account Swap Guide", score: 20, reason: "Uninvolved with merchant invoices and invoice routing loops." },
        { vector: "Urgent Domain Expiry Vishing", score: 82, reason: "A vocal emergency call alleging server down-time triggers emergency authentication overrides." }
      ],
      remediationRequirements: ["patch_warning", "patch_buddy"]
    },
    {
      id: "p_3",
      name: "Sonia Glass",
      role: "HR Operations Associate",
      department: "Human Resources",
      stressLevel: 9,
      workflows: ["Coordinating volume onboarding campaigns", "Configuring benefits system databases", "Publishing team hierarchy lists"],
      cognitiveBiases: [
        "Empathy Bias (Predisposed to support applicants under severe technical stress)",
        "Decision Fatigue (Continuous bulk data entries trigger automatic approvals)"
      ],
      vectorSusceptibilities: [
        { vector: "Executive Spoofing SMS", score: 78, reason: "Tricked by text alerts mimicry of HR Director requesting urgent employee records extraction." },
        { vector: "Priority Vendor Account Swap Guide", score: 58, reason: "Invoices formatted like applicant portals escape rigid vetting cycles." },
        { vector: "Urgent Domain Expiry Vishing", score: 62, reason: "Eagerly resets profile security questions to assist fake candidates experiencing errors." }
      ],
      remediationRequirements: ["patch_cooldown", "patch_warning"]
    }
  ],
  topSystemicHotspots: [
    "Absence of Out-of-Band validation checks when confirming ledger bank details over Slack or SMS.",
    "Targeted role fatigue and high temporal stress during end-of-month closings overrides standard awareness training.",
    "Unchecked authority privilege allows single-point staff to execute overrides with no secondary approvals."
  ]
};

export default function App() {
  const [modelData, setModelData] = useState<ThreatModelData | null>(DEFAULT_PRELOAD);
  const [generating, setGenerating] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"mapping" | "simulator" | "enterprise" | "roi" | "policy">("mapping");

  const handleGenerateModel = async (profile: OrgProfile) => {
    setGenerating(true);
    setErrorText("");
    try {
      const res = await fetch("/api/threat-model/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const data = await res.json();
        setModelData(data);
      } else {
        const err = await res.json();
        setErrorText(err.error || "Generation query failed.");
      }
    } catch (err: any) {
      console.error("Failed model build:", err);
      setErrorText("Communication mismatch. Reconnecting to local environment...");
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    if (!modelData) return;
    const blob = new Blob([JSON.stringify(modelData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${modelData.orgName.replace(/\s+/g, "_")}_Synthetic_Friction_Threat_Model.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 pb-16 print:bg-white print:text-slate-950 print:pb-0 relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_60%)]" id="app-root-container">
      
      {/* Upper Navigation Rail */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 print:hidden" id="navigation-rail">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4" id="nav-inner">
          <div className="flex items-center gap-3" id="brand-group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md flex items-center justify-center shrink-0" id="brand-logo-badge">
              <Lock className="w-5 h-5" id="lock-brand-icon" />
            </div>
            <div id="brand-text-block">
              <h1 className="text-md sm:text-lg font-black tracking-tight text-white font-display flex items-center gap-1.5" id="brand-title">
                SYNTHETIC FRICTION
                <span className="text-[10px] font-mono font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded uppercase" id="beta-pill">
                  Threat Model V1.2
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono" id="brand-subtitle">COGNITIVE CYBERSECURITY RESILIENCE DASHBOARD</p>
            </div>
          </div>

          {modelData && (
            <div className="flex items-center gap-2" id="action-buttons-group">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                id="btn-print-model"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Assessment</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 cursor-pointer active:scale-95"
                id="btn-download-json"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export JSON Report</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8" id="main-content-layout">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="layout-grid">
          
          {/* Left Column: Environmental Inputs (4 cols) */}
          <section className="lg:col-span-4 space-y-6 print:hidden" id="inputs-left-column">
            <OrgConfigPanel onGenerate={handleGenerateModel} isLoading={generating} />
            
            {/* Context/Explainer Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-md relative overflow-hidden" id="explainer-card">
              <div className="absolute top-0 right-0 p-8 opacity-5 shrink-0 select-none pointer-events-none" id="watermark-bg">
                <BrainIcon className="w-48 h-48 text-indigo-50" />
              </div>
              
              <div className="flex items-center gap-2 mb-3 z-10 relative" id="explainer-header">
                <span className="text-[9px] font-mono tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-extrabold uppercase" id="concept-label">
                  The Innovation Guide
                </span>
              </div>
              
              <h4 className="text-md sm:text-lg font-bold font-display tracking-tight text-white z-10 relative" id="explainer-title">
                What is Structural "Synthetic Friction"?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2.5 z-10 relative" id="explainer-body">
                Standard awareness models tell humans "not to click" but ignore the intense workloads and administrative bottlenecks employees experience daily. 
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2.5 z-10 relative" id="explainer-body-two">
                <strong>Synthetic Friction</strong> introduces active, deliberate procedural delay structures designed to stretch focus intervals, break high-tempo tunnel vision, and restore rational, objective judgment before a protocol override is finalized.
              </p>
            </div>
          </section>

          {/* Right Column: Key Dashboard Outputs (8 cols) -- Includes PRINT visibility */}
          <section className="lg:col-span-8 space-y-6 print:col-span-12 print:-mt-6" id="dashboard-right-column">
            
            {generating ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-16 text-center shadow-sm space-y-4 animate-pulse flex flex-col items-center justify-center min-h-[450px]" id="loading-overlay">
                <div className="p-4 bg-indigo-500/10 rounded-full animate-spin flex items-center justify-center shrink-0" id="loader-bg">
                  <RefreshCw className="w-10 h-10 text-indigo-400" id="loader-icon" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-display" id="loading-title">Compiling Cognitive Threat Analysis</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed" id="loading-subtitle">
                  Vetting primary role triggers, estimating stress-level parameters, and establishing optimal procedural remedies using Gemini LLM reasoning models...
                </p>
              </div>
            ) : errorText ? (
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-8 text-center shadow-xs text-rose-200" id="error-alert">
                <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" id="error-icon" />
                <h4 className="text-base font-bold font-display" id="error-heading">Threat Modeling Disruption</h4>
                <p className="text-xs text-rose-400 mt-1" id="error-msg">{errorText}</p>
                <button
                  onClick={() => setModelData(DEFAULT_PRELOAD)}
                  className="mt-4 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 px-4 py-2 rounded-lg"
                  id="error-reset-btn"
                >
                  Reload Vanguard Wealth Partners Preset Staging
                </button>
              </div>
            ) : modelData ? (
              <div className="space-y-6" id="model-dashboard-present">
                
                {/* Executive Summary overview */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm relative overflow-hidden" id="exec-summary-panel">
                  
                  {/* Top Header Grid with metric indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-5 border-b border-white/10" id="summary-header">
                    <div className="md:col-span-8" id="summary-headline">
                      <span className="text-[10px] font-mono uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-indigo-300 rounded font-bold" id="summary-badge-title">
                        Resilience Assessment Overview
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2 font-display" id="summary-company-title">
                        {modelData.orgName}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1" id="summary-industry-tag">
                        Operational Sector: <span className="font-semibold text-slate-300">{modelData.industry}</span>
                      </p>
                    </div>

                    <div className="md:col-span-4 flex justify-between md:justify-end gap-6 items-center" id="summary-metrics">
                      {/* resilienceGrade Gauge */}
                      <div className="text-right shrink-0" id="summary-gauge-card">
                        <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Resilience Grade:</span>
                        <span className="text-xl sm:text-2xl font-black font-display text-rose-400 block mt-1 tracking-tight" id="badge-resilience-rating">
                          {modelData.resilienceRating}
                        </span>
                      </div>
                      
                      {/* numerical rating */}
                      <div className="text-right shrink-0" id="summary-score-card">
                        <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Overall Vuln Score:</span>
                        <span className="text-xl sm:text-2xl font-black font-mono text-slate-100 block mt-1" id="badge-vuln-score">
                          {modelData.vulnerabilityScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary paragraph */}
                  <div className="pt-4 space-y-4" id="summary-body">
                    <div id="summary-paragraph">
                      <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1.5" id="summary-paragraph-title">
                        Executive Threat Posture:
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans" id="summary-executive-text">
                        {modelData.executiveSummary}
                      </p>
                    </div>

                    {/* Top Systemic Hotspots */}
                    <div id="summary-hotspots">
                      <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2.5 flex items-center gap-1.5" id="hotspots-header">
                        <ShieldAlert className="w-4 h-4 text-rose-450" id="hotspots-icon" /> Top Systemic Hotspots
                      </h4>
                      <ul className="space-y-2 pl-4" id="hotspots-list">
                        {modelData.topSystemicHotspots.map((spot, i) => (
                          <li key={i} className="text-xs text-slate-300 leading-relaxed list-decimal font-medium pl-1" id={`hotspot-item-${i}`}>
                            {spot}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Enterprise Dashboard Navigation Tabs */}
                <div className="border-b border-white/10 flex items-center overflow-x-auto flex-nowrap gap-1.5 pb-px mb-6 scrollbar-none scroll-smooth shrink-0 print:hidden" id="enterprise-tab-bar">
                  <button
                    onClick={() => setActiveTab("mapping")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold leading-none uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
                      activeTab === "mapping"
                        ? "border-indigo-500 text-indigo-400 bg-indigo-500/5 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                    id="tab-mapping"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Cognitive Mapping</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("simulator")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold leading-none uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
                      activeTab === "simulator"
                        ? "border-indigo-500 text-indigo-400 bg-indigo-500/5 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                    id="tab-simulator"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Threat Simulator</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("enterprise")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold leading-none uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
                      activeTab === "enterprise"
                        ? "border-indigo-500 text-indigo-400 bg-indigo-500/5 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                    id="tab-enterprise"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>MNC Risk Profiler</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("roi")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold leading-none uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
                      activeTab === "roi"
                        ? "border-indigo-505 text-indigo-400 bg-indigo-500/5 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                    id="tab-roi"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Cognitive ROI</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("policy")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold leading-none uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
                      activeTab === "policy"
                        ? "border-indigo-505 text-indigo-400 bg-indigo-500/5 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                    id="tab-policy"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>AI Compliance Policy</span>
                  </button>
                </div>

                {/* Tab content frames */}
                <div id="tab-content-container">
                  {/* Print optimization: render all critical specs on print, but respect activeTab for normal interactive views */}
                  {(activeTab === "mapping" || window.matchMedia("print").matches) && (
                    <div className="space-y-6 print:space-y-8" id="mapping-view">
                      <VulnerabilityMapGrid cells={modelData.vulnerabilityMap} />
                      <PersonaListView personas={modelData.personas} />
                      <FrictionPatchesInfo />
                    </div>
                  )}

                  {(activeTab === "simulator" && !window.matchMedia("print").matches) && (
                    <div id="simulator-view">
                      <ThreatSimulator personas={modelData.personas} />
                    </div>
                  )}

                  {(activeTab === "enterprise" && !window.matchMedia("print").matches) && (
                    <div id="enterprise-view">
                      <EnterpriseRiskProfiler modelData={modelData} />
                    </div>
                  )}

                  {(activeTab === "roi" && !window.matchMedia("print").matches) && (
                    <div id="roi-view">
                      <FinancialCalculator modelData={modelData} />
                    </div>
                  )}

                  {(activeTab === "policy" && !window.matchMedia("print").matches) && (
                    <div id="policy-view">
                      <EnterprisePolicyGenerator modelData={modelData} />
                    </div>
                  )}
                </div>

              </div>
            ) : (
              // Empty conceptual state
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[450px]" id="empty-state">
                <div className="p-4 bg-indigo-550/10 rounded-full mb-3" id="empty-icon-bg">
                  <Lock className="w-10 h-10 text-indigo-400" id="empty-icon" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-display" id="empty-title">Assess Organizational Behavior Under Pressure</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed" id="empty-description">
                  Use the environment configuration tool on the left to set up organizational parameters. Generate a highly detailed predictive cognitive vulnerability mapping and human behavioral threat model to begin.
                </p>
              </div>
            )}
            
          </section>

        </div>
      </main>
    </div>
  );
}

// Decorative visual vectors fallback
function BrainIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M12 5v14" />
      <path d="M12 11h6" />
      <path d="M12 11H6" />
    </svg>
  );
}
