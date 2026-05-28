/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Cpu, RefreshCw, Layers, TrendingUp, Sparkles, Send, Flame } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { FrictionPersona, SimulationResult, SimulationStep } from "../types";

interface ThreatSimulatorProps {
  personas: FrictionPersona[];
}

const APPLIED_PATCHES = [
  { id: "patch_none", name: "No Friction (Blame-and-Train Baseline)", category: "NONE", detail: "Standard environment relying on compliance checklists." },
  { id: "patch_mfa", name: "Out-of-Band Double verification", category: "TECH", detail: "Second physical channel verification required." },
  { id: "patch_cooldown", name: "Mandatory 10-Min Cooldown Delay", category: "COGNITIVE", detail: "Locks override changes to dissipate urgency bias." },
  { id: "patch_warning", name: "Semantic Workspace Warnings", category: "PROCESS", detail: "Active highlighting of urgency cues." },
  { id: "patch_buddy", name: "Dual-Signoff Collaboration Friction", category: "PROCESS", detail: "Distributed authority via independent manager check." }
];

export default function ThreatSimulator({ personas }: ThreatSimulatorProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(personas[0]?.id || "");
  const [selectedVector, setSelectedVector] = useState<string>("Executive Spoofing SMS");
  const [appliedFrictionId, setAppliedFrictionId] = useState<string>("patch_none");
  const [simulating, setSimulating] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simMsg, setSimMsg] = useState<string>("");

  const triggerSimulation = async () => {
    const currentPersona = personas.find((p) => p.id === selectedPersonaId);
    if (!currentPersona) return;

    setSimulating(true);
    setResult(null);

    const messages = [
      "Constructing human stress-load environment...",
      "Mapping cognitive tunnel parameters...",
      "Calculating temporal probability overrides...",
      "Executing dynamic simulation pathways..."
    ];

    let msgIdx = 0;
    setSimMsg(messages[0]);
    const timer = setInterval(() => {
      msgIdx++;
      if (msgIdx < messages.length) {
        setSimMsg(messages[msgIdx]);
      }
    }, 800);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: currentPersona,
          vector: selectedVector,
          appliedFrictionId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error("Simulation failed:", e);
    } finally {
      clearInterval(timer);
      setSimulating(false);
    }
  };

  const getPersonaVectors = () => {
    const currentPersona = personas.find((p) => p.id === selectedPersonaId);
    if (currentPersona) {
      return currentPersona.vectorSusceptibilities.map((v) => v.vector);
    }
    return ["Executive Spoofing SMS", "Priority Vendor Account Swap Guide", "Urgent Domain Expiry Vishing"];
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mb-6" id="simulator-container">
      <div className="flex items-center gap-2 mb-4" id="simulator-header">
        <div className="p-1.5 bg-rose-500/10 rounded-lg" id="cpu-badge">
          <Cpu className="w-5 h-5 text-rose-400" id="cpu-icon" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-display" id="simulator-title">
          Cognitive Stress Simulation Suite
        </h3>
      </div>

      <p className="text-xs text-slate-400 mb-6" id="simulator-desc">
        Launch simulated social engineering attacks against specified organizational personas. Observe how the implementation of specialized flow checks intercepts or fails to resolve the attack vector.
      </p>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" id="simulator-inputs-grid">
        {/* Persona Selector */}
        <div id="sim-input-persona">
          <label className="text-xs font-semibold text-slate-450 block mb-1.5" id="sim-persona-label">
            Target Employee Profile:
          </label>
          <select
            id="sim-persona-select"
            value={selectedPersonaId}
            onChange={(e) => {
              setSelectedPersonaId(e.target.value);
              // Reset vector option to first valid if needed
              const firstVector = personas.find(p => p.id === e.target.value)?.vectorSusceptibilities[0]?.vector;
              if (firstVector) setSelectedVector(firstVector);
            }}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 hover:border-indigo-505 rounded-lg focus:outline-none focus:bg-white/10 text-slate-100 font-semibold h-[38px] cursor-pointer"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                {p.name} ({p.role})
              </option>
            ))}
          </select>
        </div>

        {/* Vector Selector */}
        <div id="sim-input-vector">
          <label className="text-xs font-semibold text-slate-450 block mb-1.5" id="sim-vector-label">
            Attack Vector Method:
          </label>
          <select
            id="sim-vector-select"
            value={selectedVector}
            onChange={(e) => setSelectedVector(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 hover:border-indigo-505 rounded-lg focus:outline-none focus:bg-white/10 text-slate-100 font-semibold h-[38px] cursor-pointer"
          >
            {getPersonaVectors().map((v) => (
              <option key={v} value={v} className="bg-slate-900 text-slate-100">
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Active Friction Patch Selector */}
        <div id="sim-input-patch">
          <label className="text-xs font-semibold text-slate-450 block mb-1.5" id="sim-patch-label">
            Applied Friction Safeguard:
          </label>
          <select
            id="sim-patch-select"
            value={appliedFrictionId}
            onChange={(e) => setAppliedFrictionId(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 hover:border-indigo-505 rounded-lg focus:outline-none focus:bg-white/10 text-slate-100 font-bold h-[38px] cursor-pointer"
          >
            {APPLIED_PATCHES.map((patch) => (
              <option key={patch.id} value={patch.id} className="bg-slate-900 text-slate-100">
                {patch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Execute Trigger */}
      <div className="flex justify-center mb-8" id="sim-run-trigger-row">
        <button
          onClick={triggerSimulation}
          disabled={simulating}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold text-xs py-2.5 px-6 rounded-lg shadow-lg shadow-indigo-500/10 cursor-pointer transition-transform active:scale-95"
          id="trigger-sim-button"
        >
          {simulating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" id="sim-loader-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-orange-300 fill-orange-300" id="flame-icon-sim" />
              <span>Execute Cognitive Breach Test</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Screen Indicator */}
      {simulating && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center animate-pulse backdrop-blur-md" id="simulation-loading-card">
          <div className="flex justify-center mb-3" id="loader-spinner-group">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" id="big-sim-spinner" />
          </div>
          <p className="text-sm font-semibold text-slate-105 font-display" id="simulating-toast-header">
            Modeling Human Behavior Under Pressure
          </p>
          <p className="text-xs text-slate-400 font-mono mt-1" id="sim-dynamic-message">
            {simMsg}
          </p>
        </div>
      )}

      {/* Simulation Result Area */}
      {result && !simulating && (
        <div className="space-y-6" id="sim-result-dashboard">
          
          {/* Main Outcome banner card */}
          <div 
            className={`p-4.5 rounded-xl border flex items-center justify-between gap-4 ${
              result.outcome === "INTERCEPTED" 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-250" 
                : "bg-rose-500/10 border-rose-500/30 text-rose-250"
            }`}
            id="simulation-outcome-banner"
          >
            <div className="flex items-center gap-3" id="outcome-label-meta">
              {result.outcome === "INTERCEPTED" ? (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400" id="shield-ok-badge">
                  <ShieldCheck className="w-6 h-6 animate-bounce" id="shield-check-anim" />
                </div>
              ) : (
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-450 animate-pulse" id="shield-alert-badge">
                  <ShieldAlert className="w-6 h-6" id="shield-alert-anim" />
                </div>
              )}
              <div id="outcome-details">
                <span className="text-[10px] font-mono tracking-wider bg-white/10 border border-white/20 px-2 py-0.5 rounded font-extrabold text-white" id="outcome-category-label">
                  SIMULATION OUTCOME
                </span>
                <h4 className="text-base font-extrabold font-display uppercase tracking-tight mt-1.5" id="outcome-status-txt">
                  ATTACK SEQUENCE: {result.outcome}
                </h4>
              </div>
            </div>
            <div className="text-right shrink-0" id="applied-patch-meta-box">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold leading-none">Guard Configuration:</span>
              <span className="text-xs font-extrabold font-display block mt-1" id="metadata-friction-applied">{result.appliedFrictionName}</span>
            </div>
          </div>

          {/* Explanation Post-Mortem Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="sim-analysis-cards">
            {/* Cognitive Analysis */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-2.5 shadow-sm" id="analysis-cognitive-box">
              <span className="text-[10px] uppercase font-mono font-bold text-indigo-455 block">Psychological Post-Mortem</span>
              <p className="text-xs text-slate-300 leading-relaxed" id="summary-final-analysis">
                {result.finalAnalysis}
              </p>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5" id="bypass-sub-box">
                <span className="text-[9px] font-mono uppercase font-bold text-slate-450 block">Cognitive Override Point:</span>
                <p className="text-xs italic text-slate-400 font-sans" id="summary-bypass-reason">{result.psychologicalBypassReason}</p>
              </div>
            </div>

            {/* Risk Impact Mitigation */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-2.5 shadow-sm" id="analysis-remed-box">
              <span className="text-[10px] uppercase font-mono font-bold text-indigo-455 block">Mitigation & Workflow Remediations</span>
              <p className="text-xs text-slate-300 leading-relaxed" id="remediation-rec-text">
                {result.remediationRecommendation}
              </p>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5" id="exposure-sub-box">
                <span className="text-[9px] font-mono uppercase font-bold text-slate-455 block">Technical Exposure Risk:</span>
                <p className="text-xs text-slate-400 font-sans font-medium" id="summary-technical-vuln">{result.technicalVulnSummary}</p>
              </div>
            </div>
          </div>

          {/* Timeline and Chart Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sim-charts-split">
            {/* Timeline Steps (7 columns) */}
            <div className="lg:col-span-7 space-y-4" id="timeline-column">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-450 mb-3 block" id="timeline-column-header">
                Chronological Attack timeline Logs
              </h4>
              <div className="space-y-4 relative pl-3.5 border-l border-white/10" id="timeline-step-list">
                {result.timeline.map((step) => (
                  <div key={step.step} id={`timeline-step-item-${step.step}`} className="relative space-y-1" style={{ contentVisibility: "auto" }}>
                    {/* Timestamp Dot */}
                    <div 
                      className={`absolute -left-[20.5px] top-1.5 w-3 h-3 rounded-full border-2 bg-slate-950 ${
                        step.cognitiveFrictionTriggered 
                          ? "border-emerald-500 scale-125" 
                          : step.stressLevel > 80 
                            ? "border-rose-500" 
                            : "border-slate-650"
                      }`}
                      id={`timeline-dot-${step.step}`}
                    ></div>
                    
                    <div className="flex items-center gap-2" id={`timeline-time-meta-${step.step}`}>
                      <span className="text-[10px] font-mono font-extrabold bg-white/5 text-slate-400 px-1.5 py-0.5 rounded" id={`step-offset-val-${step.step}`}>
                        {step.timeOffset}
                      </span>
                      {step.cognitiveFrictionTriggered && (
                        <span 
                          className="text-[9px] bg-emerald-555/15 border border-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded uppercase font-mono font-extrabold"
                          id={`step-friction-alert-${step.step}`}
                        >
                          🛡️ Intercepted: {step.cognitiveFrictionTriggered}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-450 font-mono ml-auto" id={`step-stress-lbl-${step.step}`}>
                        Cognitive Stress: {step.stressLevel}%
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-200" id={`step-actor-action-${step.step}`}>
                      <span className="font-mono text-rose-450 font-bold animate-pulse" id={`step-lbl-act-${step.step}`}>Actor:</span> {step.actorAction}
                    </p>
                    
                    <p className="text-xs text-slate-400 pb-2 border-b border-dashed border-white/5" id={`step-persona-reaction-${step.step}`}>
                      <span className="font-mono text-indigo-400 font-semibold" id={`step-lbl-esp-${step.step}`}>Recipient:</span> {step.personaReaction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress Graph (5 columns) */}
            <div className="lg:col-span-5 flex flex-col" id="chart-column">
              <div className="flex items-center gap-1 mb-3" id="chart-section-title-row">
                <TrendingUp className="w-4 h-4 text-indigo-405" id="trending-up-icon" />
                <h4 className="text-xs font-mono uppercase font-bold text-slate-450" id="chart-section-header">
                  Employee Cognitive Load (Stress Curve)
                </h4>
              </div>
              <div className="bg-white/5 p-4 border border-white/10 rounded-2xl h-[240px] flex items-center justify-center shrink-0 shadow-sm backdrop-blur-md" id="stress-chart-wrapper">
                <ResponsiveContainer width="100%" height={210} id="stress-chart-response-container">
                  <LineChart data={result.timeline} margin={{ top: 10, right: 10, bottom: 5, left: -25 }} id="stress-reline-chart">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" id="chart-grid" />
                    <XAxis dataKey="timeOffset" tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748b" id="chart-xaxis" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748b" id="chart-yaxis" />
                    <Tooltip 
                      contentStyle={{ fontSize: 11, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(12px)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stressLevel" 
                      name="Cognitive Stress"
                      stroke={result.outcome === "INTERCEPTED" ? "#10b981" : "#f43f5e"} 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                      id="chart-line"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-450 mt-2 text-center" id="chart-caption">
                *Stretches reflect systemic cognitive overrides. Pauses under friction successfully drop adrenaline/panic triggers.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
