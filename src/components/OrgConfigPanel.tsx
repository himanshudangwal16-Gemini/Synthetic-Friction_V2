/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Building2, Layers, Briefcase, Zap, AlertTriangle, Play, RefreshCw } from "lucide-react";
import { OrgProfile } from "../types";

interface OrgConfigPanelProps {
  onGenerate: (profile: OrgProfile) => void;
  isLoading: boolean;
}

const DEFAULT_TOOLS = [
  "Slack/Teams",
  "Email (Outlook/GSuite)",
  "SaaS Accounting Dashboard",
  "HR Payroll Portal",
  "AWS/Cloud Infrastructure Console",
  "Central ERP Gateway (SAP/Oracle)",
  "Electronic Health Records (EHR) Module"
];

export default function OrgConfigPanel({ onGenerate, isLoading }: OrgConfigPanelProps) {
  const [profile, setProfile] = useState<OrgProfile>({
    orgName: "Vanguard Wealth Partners",
    industry: "Financial Services",
    size: "Medium (50-500 employees)",
    stressPeriod: "End of Month Fiscal Closing",
    tools: ["Slack/Teams", "Email (Outlook/GSuite)", "SaaS Accounting Dashboard"]
  });

  const [presets, setPresets] = useState<any[]>([]);
  const [fetchingPresets, setFetchingPresets] = useState(false);

  // Fetch presets on mount
  useEffect(() => {
    let active = true;
    const loadPresets = async () => {
      setFetchingPresets(true);
      try {
        const res = await fetch("/api/config-presets");
        if (res.ok && active) {
          const data = await res.json();
          setPresets(data);
        }
      } catch (err) {
        console.error("Failed to load presets: ", err);
      } finally {
        if (active) setFetchingPresets(false);
      }
    };
    loadPresets();
    return () => { active = false; };
  }, []);

  const handlePresetSelect = (preset: any) => {
    setProfile({
      orgName: preset.orgName,
      industry: preset.industry,
      size: "Medium (50-500 employees)",
      stressPeriod: preset.stressPeriod,
      tools: preset.tools
    });
  };

  const toggleTool = (tool: string) => {
    if (profile.tools.includes(tool)) {
      setProfile({ ...profile, tools: profile.tools.filter((t) => t !== tool) });
    } else {
      setProfile({ ...profile, tools: [...profile.tools, tool] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(profile);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm h-full" id="config-panel-container">
      <div className="flex items-center gap-2 mb-4" id="config-panel-header">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg" id="building-badge">
          <Building2 className="w-5 h-5 text-indigo-400" id="building-icon" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-display" id="config-panel-title">
          Organizational Environment
        </h3>
      </div>

      <p className="text-xs text-slate-400 mb-6" id="config-panel-desc">
        Define your workflow parameters below. These stress criteria and tools shape the behavior of your simulated employees during social engineering runs.
      </p>

      {/* Preset Buttons */}
      <div className="mb-6" id="presets-section">
        <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-2" id="presets-label">
          Quick Structural Templates:
        </label>
        <div className="flex flex-wrap gap-2" id="preset-buttons-container">
          {presets.map((preset, index) => (
            <button
              key={index}
              id={`preset-btn-${index}`}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                profile.orgName === preset.orgName
                  ? "bg-white/15 border-white/20 text-white font-semibold"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
              }`}
            >
              {preset.industry}
            </button>
          ))}
          {fetchingPresets && (
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono animate-pulse" id="presets-loading">
              <RefreshCw className="w-3 h-3 animate-spin" /> Fetching presets...
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="config-form">
        {/* Org Name */}
        <div id="form-group-orgname">
          <label className="text-xs font-semibold text-slate-350 block mb-1.5" id="orgname-label">
            Organization Identity / Name
          </label>
          <div className="relative" id="orgname-input-wrapper">
            <input
              type="text"
              id="orgname-input"
              value={profile.orgName}
              onChange={(e) => setProfile({ ...profile, orgName: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white/10 text-slate-100 placeholder-slate-500 font-medium transition-all"
              placeholder="e.g. Acme Fintech Corp"
              required
            />
          </div>
        </div>

        {/* Industry */}
        <div id="form-group-industry">
          <label className="text-xs font-semibold text-slate-350 block mb-1.5" id="industry-label">
            Primary Industry Sector
          </label>
          <input
            type="text"
            id="industry-input"
            value={profile.industry}
            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white/10 text-slate-100 placeholder-slate-505 transition-all"
            placeholder="e.g. Critical Infrastructure"
            required
          />
        </div>

        {/* Org Size */}
        <div id="form-group-size">
          <label className="text-xs font-semibold text-slate-350 block mb-1.5" id="size-label">
            Structural Size Scale
          </label>
          <select
            id="size-select"
            value={profile.size}
            onChange={(e) => setProfile({ ...profile, size: e.target.value })}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white/10 text-slate-100 transition-all cursor-pointer"
          >
            <option className="bg-slate-900 text-slate-100">Small Enterprise (&lt;50 staff)</option>
            <option className="bg-slate-900 text-slate-100">Medium (50-500 employees)</option>
            <option className="bg-slate-900 text-slate-100">Enterprise (500+ global nodes)</option>
          </select>
        </div>

        {/* High Stress Windows */}
        <div id="form-group-stress">
          <label className="text-xs font-semibold text-slate-350 block mb-1.5" id="stress-label">
            High-Stress Operational Windows
          </label>
          <div className="relative" id="stress-input-wrapper">
            <input
              type="text"
              id="stress-input"
              value={profile.stressPeriod}
              onChange={(e) => setProfile({ ...profile, stressPeriod: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white/10 text-slate-100 placeholder-slate-500 transition-all font-display font-medium"
              placeholder="e.g. Annual Audit or Product Release"
              required
            />
            <div className="absolute right-2.5 top-2.5" id="warning-icon-wrapper">
              <AlertTriangle className="w-4 h-4 text-amber-500" id="stress-warning-icon" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1" id="stress-hint">
            *This peak timeframe causes behavioral tunneling, which vectors utilize.
          </p>
        </div>

        {/* Systems & Portals */}
        <div id="form-group-tools">
          <label className="text-xs font-semibold text-slate-350 block mb-2" id="tools-label">
            Channels & Systems
          </label>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto border border-white/5 p-2.5 rounded-xl bg-slate-950/40" id="tools-checkboxes">
            {DEFAULT_TOOLS.map((tool) => (
              <label
                key={tool}
                id={`tool-label-${tool.replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 p-1.5 rounded hover:bg-white/5 cursor-pointer text-xs text-slate-300 transition-colors"
                style={{ contentVisibility: 'auto' }}
              >
                <input
                  type="checkbox"
                  id={`tool-checkbox-${tool.replace(/\s+/g, "")}`}
                  checked={profile.tools.includes(tool)}
                  onChange={() => toggleTool(tool)}
                  className="rounded text-indigo-500 h-3.5 w-3.5 focus:ring-indigo-500 border-white/10 bg-white/5 cursor-pointer"
                />
                <span className="select-none font-sans" id={`tool-span-${tool.replace(/\s+/g, "")}`}>{tool}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          id="generate-threat-model-btn"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 disabled:text-slate-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer active:scale-95 shadow-lg shadow-indigo-500/10"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" id="loading-spinner" />
              <span>Analyzing Cognitive Traps...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-white fill-white" id="play-icon" />
              <span>Generate Resilience Map</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
