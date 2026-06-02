/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DollarSign, ShieldAlert, TrendingDown, Info, Calculator, Percent } from "lucide-react";
import { ThreatModelData } from "../types";

interface FinancialCalculatorProps {
  modelData: ThreatModelData;
}

export default function FinancialCalculator({ modelData }: FinancialCalculatorProps) {
  // Setup default values based on industry type
  const getIndustryVulnerabilityMultiplier = () => {
    return modelData.vulnerabilityScore / 100;
  };

  const getIndustryDefaultSLE = () => {
    const ind = modelData.industry.toLowerCase();
    if (ind.includes("finance") || ind.includes("wealth") || ind.includes("treasurer")) {
      return 5800000; // $5.8M average financial breach cost
    } else if (ind.includes("health") || ind.includes("clinical") || ind.includes("hospital")) {
      return 9200021; // $9.2M average healthcare breach cost
    } else if (ind.includes("soft") || ind.includes("tech") || ind.includes("cloud")) {
      return 4500000; // $4.5M tech breach cost
    } else {
      return 3800000; // $3.8M default generic breach cost
    }
  };

  const [sle, setSle] = useState<number>(getIndustryDefaultSLE());
  const [aro, setAro] = useState<number>(4); // default 4 social engineering campaigns per year
  const [estimatedTransactions, setEstimatedTransactions] = useState<number>(2500); // Year-round critical wire/system changes
  const [delayPerTxMinutes, setDelayPerTxMinutes] = useState<number>(10); // 10 minute cooldown hold
  const [averageHourlyWage, setAverageHourlyWage] = useState<number>(65); // Staff salary per hour

  const baseVulnerabilityRatio = getIndustryVulnerabilityMultiplier();
  // Average effectiveness of synthetic cognitive friction is ~85% reduction in successful bypasses
  const frictionEfficacyRatio = 0.85;

  // Mathematics
  const annualizedLossNoFriction = sle * aro * baseVulnerabilityRatio;
  
  // Risk with cognitive friction applied
  const remainingRiskRatio = baseVulnerabilityRatio * (1 - frictionEfficacyRatio);
  const annualizedLossWithFriction = sle * aro * remainingRiskRatio;

  // Calculate operational penalty cost of the delay (MNC Operational Drag)
  // staff time lost = (tx * delay_mins) / 60 hours
  const staffHoursLost = (estimatedTransactions * delayPerTxMinutes) / 60;
  const operationalDelayCost = staffHoursLost * averageHourlyWage;

  // Final Results
  const riskAvoided = annualizedLossNoFriction - annualizedLossWithFriction;
  const netSavings = riskAvoided - operationalDelayCost;
  const roiPercentage = ((netSavings - operationalDelayCost) / (operationalDelayCost || 1)) * 100;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mb-6" id="calculator-dashboard-container">
      <div className="flex items-center gap-2 mb-4" id="calculator-header">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg" id="calculator-badge">
          <Calculator className="w-5 h-5 text-indigo-400" id="calculator-icon" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-display" id="calculator-heading">
            Enterprise Cognitive ROI Simulator
          </h3>
          <p className="text-[10px] text-indigo-300 font-mono tracking-tight uppercase" id="calculator-subheading">
            Risk Avoided vs. Operational Drag Calculator
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6" id="calculator-desc">
        Evaluate the quantitative business case for cognitive friction. Big MNCs want to see the balance between operational delays and risk reduction. Adjust key variables to estimate net annualized savings.
      </p>

      {/* Split layout: Parameters & Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="calculator-split-layout">
        
        {/* Input Parameters (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-white/5" id="calculator-parameters-box">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Enterprise Pricing Parameters
          </span>

          {/* SLA Impact Per Occurrence */}
          <div id="param-sle-group">
            <div className="flex justify-between items-center text-xs mb-1.5" id="lbl-sle-row">
              <span className="text-slate-350 font-semibold flex items-center gap-1">
                Avg. Cost per Successful Breach (SLE)
              </span>
              <span className="text-indigo-300 font-bold font-mono">{formatCurrency(sle)}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={15000000}
              step={100000}
              value={sle}
              onChange={(e) => setSle(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              id="slider-sle"
            />
            <span className="text-[10px] text-slate-450 font-mono block mt-1">*Ind. Average: financial/healthcare data breach costs.</span>
          </div>

          {/* Social Engineering Campaigns (ARO) */}
          <div id="param-aro-group" className="pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-xs mb-1.5" id="lbl-aro-row">
              <span className="text-slate-350 font-semibold">Annual Attack Campaigns (ARO)</span>
              <span className="text-indigo-300 font-bold font-mono">{aro} Campaigns / Year</span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              step={1}
              value={aro}
              onChange={(e) => setAro(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              id="slider-aro"
            />
          </div>

          {/* Transactions impacted per year */}
          <div id="param-tx-group" className="pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-xs mb-1.5" id="lbl-tx-row">
              <span className="text-slate-350 font-semibold" title="Critical administrative procedures requiring friction">
                Protected Workflows / Year
              </span>
              <span className="text-indigo-300 font-bold font-mono">{estimatedTransactions} operations</span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={estimatedTransactions}
              onChange={(e) => setEstimatedTransactions(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              id="slider-tx"
            />
          </div>

          {/* Time delay length (10-min hold) */}
          <div id="param-delay-group" className="pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-xs mb-1.5" id="lbl-delay-row">
              <span className="text-slate-350 font-semibold">Procedural Friction Delay</span>
              <span className="text-indigo-300 font-bold font-mono">{delayPerTxMinutes} minutes</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={delayPerTxMinutes}
              onChange={(e) => setDelayPerTxMinutes(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              id="slider-delay"
            />
          </div>

          {/* Average Staff Hourly Salary */}
          <div id="param-wage-group" className="pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-xs mb-1.5" id="lbl-wage-row">
              <span className="text-slate-350 font-semibold">Avg. Staff Salary / hour</span>
              <span className="text-indigo-300 font-bold font-mono">{formatCurrency(averageHourlyWage)}/hr</span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={averageHourlyWage}
              onChange={(e) => setAverageHourlyWage(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              id="slider-wage"
            />
          </div>

        </div>

        {/* Output Metrics Panels (7 cols) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4" id="calculator-results-box">
          
          {/* Main Net Yearly Savings KPI Screen */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden" id="roi-kpi-screen">
            <div className="absolute top-0 right-0 p-8.5 opacity-5 select-none pointer-events-none" id="roi-watermark">
              <DollarSign className="w-36 h-36 text-indigo-400 font-black" />
            </div>
            <span className="text-[10px] font-mono font-extrabold uppercase bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded" id="roi-screen-badge">
              Projected Corporate Net Savings (Yearly)
            </span>
            <div className="mt-3" id="roi-screen-amount">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block tracking-tight">
                {formatCurrency(netSavings > 0 ? netSavings : 0)}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans" id="roi-screen-conclusion">
              Introducing corporate flow friction reduces cognitive bypass vulnerability to <strong>{(100 - baseVulnerabilityRatio * 100 * (1 - frictionEfficacyRatio)).toFixed(0)}% resilience cover</strong>, achieving a net profit after operational drag is fully priced.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="roi-comparison-cards">
            {/* Risk No Friction */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1" id="loss-nofriction-card">
              <span className="text-[10px] font-mono text-slate-450 block uppercase font-bold">Annual Risk Exposure (No Friction)</span>
              <span className="text-xl font-bold font-mono text-rose-400 block">{formatCurrency(annualizedLossNoFriction)}</span>
              <span className="text-[10px] text-slate-450 block font-mono">Based on {modelData.vulnerabilityScore}% baseline vulnerability</span>
            </div>

            {/* Risk With Friction */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1" id="loss-withfriction-card">
              <span className="text-[10px] font-mono text-slate-450 block uppercase font-bold">Risk Exposure (With Friction)</span>
              <span className="text-xl font-bold font-mono text-emerald-400 block">{formatCurrency(annualizedLossWithFriction)}</span>
              <span className="text-[10px] text-slate-450 block font-mono">Reduced by 85% efficacy</span>
            </div>
          </div>

          {/* Friction Operational Expense and ROI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="roi-finance-metadata">
            {/* Delay Penalty Cost */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1" id="drag-cost-card">
              <span className="text-[10px] font-mono text-slate-450 block uppercase font-bold">Operational Delay Costs (Drag)</span>
              <span className="text-xl font-bold font-mono text-amber-400 block">{formatCurrency(operationalDelayCost)}</span>
              <span className="text-[10px] text-slate-450 block font-sans">
                {staffHoursLost.toFixed(0)} aggregate staff hours delays / year
              </span>
            </div>

            {/* Total Return Ratio */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1" id="roi-percentage-card">
              <span className="text-[10px] font-mono text-slate-450 block uppercase font-bold">Friction ROI Rating</span>
              <span className="text-xl font-bold font-mono text-indigo-305 block flex items-center gap-1.5">
                <Percent className="w-4 h-4 shrink-0 text-indigo-400" /> {roiPercentage > 0 ? roiPercentage.toFixed(0) : 0}%
              </span>
              <span className="text-[10px] text-slate-450 block font-mono">Net return per dollar of drag cost</span>
            </div>
          </div>

          {/* Deep Insight Info Box */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex gap-2 text-[11px] text-slate-400" id="roi-calculator-insights">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              <strong>Big MNC Advisory:</strong> While compliance managers express concern over the "10-minute hold delay", this simulation establishes that human drag costs represent less than 2% of the enterprise expected Annual Risk Loss (ALE) exposure. Synthetic Friction converts structural bottlenecks into real defensive capabilities.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
