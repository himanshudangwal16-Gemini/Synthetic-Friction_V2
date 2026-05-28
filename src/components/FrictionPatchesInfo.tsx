/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, Clock, AlertTriangle, Users, HelpCircle } from "lucide-react";
import { FrictionPatch } from "../types";

export const FRICTION_PATCHES: FrictionPatch[] = [
  {
    id: "patch_mfa",
    name: "Out-of-Band Validation Lock",
    category: "PROCESS",
    description: "Enforces verifying sensitive transaction detail overrides exclusively through a second distinct physical channel (e.g., standard voice calls or out-of-band administrative codes).",
    stretchesCognitiveTunnel: "Forces employees to transition from chat/email, breaking their localized focus-tunnel and allowing standard critical verification."
  },
  {
    id: "patch_cooldown",
    name: "Mandatory 10-Min Cooldown Delay",
    category: "COGNITIVE",
    description: "Introduces a structural lock duration on critical workflow adjustments (like swapping client wiring instructions) where processing halts for 10 minutes while background logging alerts key staff.",
    stretchesCognitiveTunnel: "Directly combats the urgency bias. Because the task cannot physically be rushed, the social engineer's high-pressure leverage is neutralized."
  },
  {
    id: "patch_warning",
    name: "Semantic Context Banners",
    category: "TECH",
    description: "Employs client-side alerts highlighting high-tempo semantic traits inside direct messages or mail (e.g., detecting keywords like 'ASAP', 'OVER-THE-COUNTER WIRE', 'CONFIDENTIAL TRANSFER').",
    stretchesCognitiveTunnel: "Triggers a high-contrast visual pause that immediately signals the conscious mind of a potential scam scenario before motor reactions take over."
  },
  {
    id: "patch_buddy",
    name: "Dual-Signoff Collaboration Friction",
    category: "PROCESS",
    description: "Critical data modifications require simultaneous cryptographically checked approvals from two separate department officers.",
    stretchesCognitiveTunnel: "Spreads cognitive accountability and brings in an external peer who is completely decoupled from the first person's active tasks and stress focus."
  }
];

export default function FrictionPatchesInfo() {
  const getIcon = (id: string) => {
    switch (id) {
      case "patch_mfa":
        return <Shield className="w-5 h-5 text-indigo-500" id={`icon-${id}`} />;
      case "patch_cooldown":
        return <Clock className="w-5 h-5 text-amber-500" id={`icon-${id}`} />;
      case "patch_warning":
        return <AlertTriangle className="w-5 h-5 text-rose-500" id={`icon-${id}`} />;
      case "patch_buddy":
        return <Users className="w-5 h-5 text-teal-500" id={`icon-${id}`} />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-500" id={`icon-${id}`} />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mb-6" id="friction-patches-info-container">
      <div className="flex items-center gap-2 mb-4" id="friction-patches-header">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg" id="shield-icon-badge">
          <Shield className="w-5 h-5 text-indigo-400" id="shield-header-icon" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-display" id="friction-patches-title">
          Standard Cognitive Friction Patches
        </h3>
      </div>
      
      <p className="text-xs text-slate-400 mb-6" id="friction-patches-description">
        Traditional security blames human error. Cognitive Friction corrects the workflow itself by introducing deliberate, active checkpoints to break focus tunneling and redirect critical thinking.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="patches-grid">
        {FRICTION_PATCHES.map((patch) => (
          <div
            key={patch.id}
            id={`patch-card-${patch.id}`}
            className="p-4 rounded-xl border border-white/5 hover:border-indigo-505/30 hover:bg-white/10 transition-all duration-200 bg-white/5 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-2" id={`patch-title-row-${patch.id}`}>
              {getIcon(patch.id)}
              <h4 className="text-xs font-bold text-slate-100 font-sans" id={`patch-name-${patch.id}`}>
                {patch.name}
              </h4>
              <span 
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ml-auto font-bold ${
                  patch.category === 'PROCESS' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' :
                  patch.category === 'COGNITIVE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                  'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}
                id={`patch-badge-${patch.id}`}
              >
                {patch.category}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-3" id={`patch-desc-${patch.id}`}>
              {patch.description}
            </p>
            
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5" id={`patch-inner-${patch.id}`}>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-450 block mb-0.5" id={`patch-stretch-label-${patch.id}`}>
                Psychological Stretch Vector:
              </span>
              <p className="text-xs text-slate-450 line-clamp-2" id={`patch-stretch-desc-${patch.id}`}>
                {patch.stretchesCognitiveTunnel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
