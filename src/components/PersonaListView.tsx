/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, AlertCircle, Sparkles, Brain, CheckSquare, ShieldCheck, Gauge } from "lucide-react";
import { FrictionPersona } from "../types";

interface PersonaListViewProps {
  personas: FrictionPersona[];
}

export default function PersonaListView({ personas }: PersonaListViewProps) {
  const [selectedId, setSelectedId] = useState<string>(personas[0]?.id || "");

  const activePersona = personas.find((p) => p.id === selectedId) || personas[0];

  const getStressColor = (level: number) => {
    if (level >= 8) return "text-rose-300 bg-rose-500/10 border-rose-500/30";
    if (level >= 5) return "text-amber-300 bg-amber-500/10 border-amber-500/30";
    return "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-rose-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mb-6" id="persona-list-view-container">
      <div className="flex items-center gap-2 mb-4" id="persona-list-header">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg" id="persona-icon-badge">
          <Users className="w-5 h-5 text-indigo-400" id="persona-icon" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-display" id="persona-list-title">
          Psychological Target Personas
        </h3>
      </div>

      <p className="text-xs text-slate-400 mb-6" id="persona-list-desc">
        These profiles simulate specific employee workloads and stress vectors during rush windows. Human-centered resilience analyzes their behavioral blind spots.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="persona-grid-split">
        {/* Left: Persona Selector Cards */}
        <div className="lg:col-span-4 space-y-3" id="persona-selector-column">
          {personas.map((persona) => {
            const isSelected = selectedId === persona.id;
            return (
              <div
                key={persona.id}
                id={`persona-card-${persona.id}`}
                onClick={() => setSelectedId(persona.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-white/10 shadow-md"
                    : "border-white/5 hover:border-indigo-500/30 bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between mb-1" id={`persona-top-row-${persona.id}`}>
                  <h4 className="text-sm font-bold text-slate-100" id={`persona-name-${persona.id}`}>
                    {persona.name}
                  </h4>
                  <span
                    className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full border ${getStressColor(
                      persona.stressLevel
                    )}`}
                    id={`persona-stress-badge-${persona.id}`}
                  >
                    STRESS: {persona.stressLevel}/10
                  </span>
                </div>
                
                <span className="text-xs text-slate-400 font-medium block mb-3" id={`persona-role-${persona.id}`}>
                  {persona.role}
                </span>

                <div className="flex flex-wrap gap-1 max-w-full" id={`persona-biases-micro-${persona.id}`}>
                  {persona.cognitiveBiases.slice(0, 2).map((bias, i) => (
                    <span
                      key={i}
                      id={`persona-bias-micro-${persona.id}-${i}`}
                      className="text-[9px] font-sans bg-white/5 border border-white/5 px-1.5 py-0.5 text-slate-400 rounded truncate max-w-full block"
                    >
                      {bias.split("(")[0].trim()}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Active Persona Details */}
        {activePersona && (
          <div className="lg:col-span-8 bg-slate-950/40 rounded-xl border border-white/5 p-5 space-y-5" id="active-persona-details">
            {/* Header Area */}
            <div className="flex flex-wrap justify-between items-start gap-3 pb-3 border-b border-white/10" id="active-p-header">
              <div id="active-p-title-details">
                <h4 className="text-base font-bold text-white font-display" id="active-p-name">
                  {activePersona.name}
                </h4>
                <p className="text-xs text-slate-400 font-sans" id="active-p-role-dept">
                  {activePersona.role} — <span className="font-semibold text-slate-350">{activePersona.department} Department</span>
                </p>
              </div>
              <div className="flex items-center gap-2" id="active-p-gauge-badges">
                <span className="flex items-center gap-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-350 border border-amber-500/30 px-2.5 py-1 rounded-lg" id="active-p-stress-badge">
                  <Gauge className="w-3.5 h-3.5" id="gauge-icon" /> Peak Stress Load: {activePersona.stressLevel}/10
                </span>
              </div>
            </div>

            {/* Workflows and Biases Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="active-p-work-biases-row">
              {/* Daily Workflows */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm" id="active-p-workflows-box">
                <div className="flex items-center gap-1.5 mb-2.5" id="workflows-subtitle-row">
                  <CheckSquare className="w-4 h-4 text-indigo-400" id="check-square-icon" />
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">Operational Workflows</span>
                </div>
                <ul className="space-y-1.5" id="workflows-list">
                  {activePersona.workflows.map((flow, idx) => (
                    <li key={idx} className="text-xs text-slate-300 leading-relaxed pl-3.5 relative" id={`workflow-item-${idx}`}>
                      <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" id={`work-dot-${idx}`}></span>
                      {flow}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cognitive Biases */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm" id="active-p-biases-box">
                <div className="flex items-center gap-1.5 mb-2.5" id="biases-subtitle-row">
                  <Brain className="w-4 h-4 text-indigo-400" id="brain-icon" />
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">Cognitive Vulnerability Traits</span>
                </div>
                <div className="space-y-2" id="biases-list">
                  {activePersona.cognitiveBiases.map((bias, idx) => (
                    <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-white/5" id={`bias-item-${idx}`}>
                      <h5 className="text-xs font-semibold text-white" id={`bias-name-${idx}`}>{bias.split("(")[0].trim()}</h5>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 leading-normal" id={`bias-desc-${idx}`}>
                        {bias.includes("(") ? bias.substring(bias.indexOf("(")) : "Workflow tunneling behavior induced by time pressure spikes and communication overhead."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Susceptibility Progress Bars */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm space-y-3.5" id="active-p-susceptibility-box">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">Vulnerability Vectors Probability Metrics</span>
              <div className="space-y-3" id="vectors-progress-list">
                {activePersona.vectorSusceptibilities.map((item, idx) => (
                  <div key={idx} className="space-y-1" id={`vector-susceptibility-row-${idx}`}>
                    <div className="flex justify-between items-center text-xs" id={`vector-ratio-${idx}`}>
                      <span className="font-semibold text-slate-350" id={`vector-name-p-${idx}`}>{item.vector}</span>
                      <span className="font-mono font-extrabold text-slate-200" id={`vector-score-p-${idx}`}>{item.score}% Risk</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden" id={`vector-bar-bg-${idx}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-350 ${getScoreColor(item.score)}`}
                        style={{ width: `${item.score}%` }}
                        id={`vector-bar-fill-${idx}`}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans" id={`vector-reason-p-${idx}`}>
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Friction Patch Badges */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20" id="recommended-friction-row">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" id="shield-check-icon" />
              <div id="remediation-recs-details">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 block">Recommended Cognitive Safeguards</span>
                <div className="flex flex-wrap gap-1.5 mt-1" id="remediations-badges">
                  {activePersona.remediationRequirements.map((reqId) => {
                    const mappedName = 
                      reqId === "patch_mfa" ? "Out-of-Band Double verification" :
                      reqId === "patch_cooldown" ? "10-Min Cooldown Delay" :
                      reqId === "patch_warning" ? "Semantic Warnings" :
                      reqId === "patch_buddy" ? "Dual-Signoff Check" :
                      "Advanced Auth Friction";
                    return (
                      <span
                        key={reqId}
                        id={`remediation-badge-${reqId}`}
                        className="text-[10px] font-sans px-2.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold uppercase tracking-wide"
                      >
                        {mappedName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
