/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Check, FileText, RefreshCw, Printer, ShieldCheck, Settings } from "lucide-react";
import { ThreatModelData } from "../types";

interface EnterprisePolicyGeneratorProps {
  modelData: ThreatModelData;
}

export default function EnterprisePolicyGenerator({ modelData }: EnterprisePolicyGeneratorProps) {
  const [classification, setClassification] = useState<string>("STRICTLY CONFIDENTIAL");
  const [framework, setFramework] = useState<string>("ISO 27001 / SOC 2 Type II");
  const [version, setVersion] = useState<string>("v1.2.4 Draft");
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [policyText, setPolicyText] = useState<string>("");

  const handleCopy = () => {
    if (!policyText) return;
    navigator.clipboard.writeText(policyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the policy documentation.");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Security Governance Policy - ${modelData.orgName}</title>
          <style>
            body { font-family: 'Georgia', serif; line-height: 1.6; color: #111827; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { font-family: 'Helvetica', sans-serif; border-b: 2px solid #4f46e5; padding-bottom: 10px; color: #1e1b4b; }
            h2 { font-family: 'Helvetica', sans-serif; color: #312e81; margin-top: 30px; }
            h3 { font-family: 'Helvetica', sans-serif; color: #4338ca; }
            pre { background-color: #f3f4f6; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; }
            .header-info { font-family: 'Helvetica', sans-serif; font-size: 0.9em; color: #4b5563; margin-bottom: 40px; border-bottom: 1px dashed #d1d5db; padding-bottom: 15px; }
            .classification { color: #b91c1c; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header-info">
            <strong>COMPANY:</strong> ${modelData.orgName}<br/>
            <strong>REGULATORY COMPLIANCE FRAMEWORK:</strong> ${framework}<br/>
            <strong>CLASSIFICATION:</strong> <span class="classification">${classification}</span><br/>
            <strong>VERSION:</strong> ${version}<br/>
            <strong>DATE:</strong> ${new Date().toLocaleDateString()}<br/>
          </div>
          <h1>Enterprise Behavioral Resilience Policy</h1>
          <div style="white-space: pre-line;">${policyText.replace(/#/g, "")}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const triggerPolicyGeneration = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/enterprise/policy-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classification,
          framework,
          version,
          modelData
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPolicyText(data.policyMarkdown);
      }
    } catch (e) {
      console.error("Policy generation error: ", e);
    } finally {
      setGenerating(false);
    }
  };

  // Generate initial fallback policy text if empty on mount
  React.useEffect(() => {
    const generateLocalFallbackPolicy = () => {
      const org = modelData.orgName;
      // Deduce stress period dynamically or default gracefully to keep code robust
      const isFin = org.toLowerCase().includes("vanguard") || org.toLowerCase().includes("wealth") || modelData.industry.toLowerCase().includes("finance");
      const stressPeriod = isFin ? "End of Month Fiscal Closing" : "Peak Operational Stress Windows";
      
      const markdown = `# ENTERPRISE SECURITY GOVERNANCE DIRECTIVE
# COGNITIVE BEHAVIORAL RESILIENCE STANDARDS (CBRS)

### DOCUMENT IDENTIFICATION
- **Target Organization:** ${org}
- **Assessed Governance Framework:** ${framework}
- **System Classification:** ${classification}
- **Mandate Registry:** SYSTEM-BEHAVIORAL-VILN-M7
- **Version Release:** ${version}

---

## 1.0 INTRODUCTION & CONTEXT (OBJECTIVE)
Standard awareness models rely strictly on employee training compliance, creating systemic risks under pressure. During key organizational windows - primarily **"${stressPeriod}"** - cognitive tunnel-vision and urgency override security alerts. 

This directive establishes structural **"Synthetic Friction" checks** across ${org}'s core channels. Administrative procedures are restricted to guarantee cognitive pauses and out-of-band signoffs whenever sensitive overrides are triggered.

## 2.0 SCOPE OF ENFORCED WORKFLOW FRICTION 
The procedural blocks defined below are mandatory across the following administrative channels:
1. **Financial Operations:** Wire approvals, critical supplier routing number adjustments, and bulk payroll conversions.
2. **IT & SecOps:** Identity recovery requests, Active Directory exceptions, and SSL certificate bypasses.
3. **HR Systems:** Roster exports, direct deposit configuration changes, and onboarding access updates.

## 3.0 BEHAVIORAL SAFEGUARD PROCEDURES

### 3.1 Out-of-Band Double Verification Protocol (CBRS-MFA-01)
- **Friction Trigger:** Any request to adjust routing numbers, clear unverified ledger reconciliations, or bypass technical credentials received on Slack, Teams, or third-party web portals.
- **Enforced Loop:** The processing operator MUST verify the instruction via an Out-of-Band physical voice/video channel leveraging standard employee directory lookups. Standard messaging approval is strictly prohibited.
- **Cognitive Goal:** Breaks the focal tunnel vision, forcing a change of medium to restore objective evaluation.

### 3.2 Mandatory 10-Minute Cooldown Lock (CBRS-DELAY-02)
- **Friction Trigger:** Addition of new bank routing keys or system account configurations during **"${stressPeriod}"**.
- **Enforced Loop:** System workflows are hard-locked down for 10 minutes. Real-time automated notifications are dispatched simultaneously to the Compliance and Security Operations Center (SOC).
- **Cognitive Goal:** Defeats "Urgency Bias" by removing the capability for attackers to force instant motor completions.

### 3.3 Dual-Signoff Collaboration Check (CBRS-BUDDY-03)
- **Friction Trigger:** Admin certificate provisioning or massive payroll roster edits.
- **Enforced Loop:** Operations require simultaneous cryptographic confirmation keys from two separate team members.
- **Cognitive Goal:** Shares the cognitive load with an independent observer who is free from localized situational stress.

## 4.0 AUDIT, COMPLIANCE, AND ENFORCEMENT
Non-compliance with cognitive friction benchmarks triggers automatic supervisor audits. Training metrics must track simulated operational stress responses rather than generic knowledge multiple-choice scores.

---
*Authorized for immediate enterprise dissemination by the Global Information Security Council.*`;
      setPolicyText(markdown);
    };
    generateLocalFallbackPolicy();
  }, [modelData, classification, framework, version]);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mb-6" id="policy-generator-container">
      <div className="flex items-center gap-2 mb-4" id="policy-generator-header">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg" id="policy-badge">
          <FileText className="w-5 h-5 text-indigo-400" id="policy-icon" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-display" id="policy-heading">
            Behavioral Governance policy drafter
          </h3>
          <p className="text-[10px] text-indigo-300 font-mono tracking-tight uppercase" id="policy-subheading">
            AI-Powered Corporate Compliance Blueprint
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6" id="policy-desc">
        Draft audit-grade procedural policies explicitly designed for compliance frameworks and enterprise board reviews. Translate cognitive assessments into governance safeguards immediately.
      </p>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" id="policy-options-grid">
        {/* Classification Selection */}
        <div id="policy-option-classification">
          <label className="text-xs font-semibold text-slate-350 block mb-1.5" id="lbl-classification">
            Document Classification:
          </label>
          <select
            id="policy-select-classification"
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 hover:border-indigo-505 rounded-lg focus:outline-none focus:bg-white/10 text-slate-200 h-[38px] cursor-pointer"
          >
            <option className="bg-slate-900" value="RESTRICTED">Restricted Internal Use</option>
            <option className="bg-slate-900" value="INTERNAL SECURE">Internal Secure</option>
            <option className="bg-slate-900" value="STRICTLY CONFIDENTIAL">Strictly Confidential (MNC Board Tier)</option>
          </select>
        </div>

        {/* Regulatory Frame */}
        <div id="policy-option-framework">
          <label className="text-xs font-semibold text-slate-350 block mb-1.5" id="lbl-framework">
            Regulatory Framework Focus:
          </label>
          <select
            id="policy-select-framework"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 hover:border-indigo-505 rounded-lg focus:outline-none focus:bg-white/10 text-slate-200 h-[38px] cursor-pointer"
          >
            <option className="bg-slate-900" value="ISO 27001 / SOC 2 Type II">ISO 27001 / SOC 2 Compliance</option>
            <option className="bg-slate-900" value="NIST Cybersecurity Frame (CSF)">NIST CSF Focus</option>
            <option className="bg-slate-900" value="Sarbanes-Oxley (SOX) §404">SOX §404 Compliance</option>
          </select>
        </div>

        {/* Policy version control */}
        <div id="policy-option-version">
          <label className="text-xs font-semibold text-slate-350 block mb-1.5" id="lbl-version">
            Governance Document Version:
          </label>
          <input
            type="text"
            id="policy-input-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 hover:border-indigo-505 rounded-lg focus:outline-none focus:bg-white/10 text-slate-200 h-[38px] transition-all"
            placeholder="e.g. v1.0.0 Main Approval"
          />
        </div>
      </div>

      {/* Primary Action Row */}
      <div className="flex gap-3 justify-center mb-6" id="policy-actions-row">
        <button
          onClick={triggerPolicyGeneration}
          disabled={generating}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-505 disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold text-xs py-2 px-4 rounded-lg cursor-pointer transition-transform active:scale-95"
          id="btn-re-draft-policy"
        >
          {generating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Drafting Comprehensive Security directives...</span>
            </>
          ) : (
            <>
              <Settings className="w-3.5 h-3.5 text-white" />
              <span>Generate AI Policy Revision</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          disabled={!policyText}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-slate-100 font-semibold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors"
          id="btn-copy-policy"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied to clipboard" : "Copy Policy Markdown"}</span>
        </button>

        <button
          onClick={handlePrint}
          disabled={!policyText}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-slate-100 font-semibold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors"
          id="btn-print-policy"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Document</span>
        </button>
      </div>

      {/* Clean, off-black scrollable document view */}
      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-6 md:p-8 max-h-[380px] overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed font-sans shadow-inner selection:bg-indigo-550/30" id="policy-document-viewer">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4" id="policy-viewer-metadata">
          <div id="viewer-left-group">
            <span className="text-slate-500 uppercase block font-mono">Document Security Node</span>
            <span className="font-bold text-slate-200 block mt-0.5">{modelData.orgName} Compliance Center</span>
          </div>
          <div className="text-right" id="viewer-right-group">
            <span className="text-rose-450 uppercase block font-mono font-bold">{classification}</span>
            <span className="font-medium text-slate-400 block mt-0.5">{framework}</span>
          </div>
        </div>

        {generating ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3" id="policy-generating-indicator">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-400 animate-pulse">Consulting and drafting policy language via Gemini models...</p>
          </div>
        ) : (
          <div className="space-y-4 whitespace-pre-wrap select-text font-mono" id="rendered-policy-markdown">
            {policyText}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-450 justify-center" id="policy-compliance-tag">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Governance directive aligns smoothly with SOC 2 CC6.3 (Risk Assessments) and ISO 27002 A.12.</span>
      </div>

    </div>
  );
}
