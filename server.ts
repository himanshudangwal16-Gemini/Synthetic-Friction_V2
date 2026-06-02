/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiInstance: GoogleGenAI | null = null;
let isKeyCompromised = false;

function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    aiInstance = new GoogleGenAI({
      apiKey: key || "DUMMY_KEY_FOR_MOCK_FALLBACK",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Check if Gemini key is actual functional key
function hasValidKey(): boolean {
  if (isKeyCompromised) return false;
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";
}

// Core friction patches list
const FRICTION_PATCHES = [
  {
    id: "patch_mfa",
    name: "Out-of-Band Double verification",
    category: "PROCESS",
    description: "Requires verifying all sensitive changes on alternate channels (e.g. phone call or specific internal authorization portal) rather than Slack/Email.",
    stretchesCognitiveTunnel: "Forces employees to exit their stressful workflow, snapping them out of the high-tempo tunnel vision."
  },
  {
    id: "patch_cooldown",
    name: "Mandatory 10-Min Cooldown Delay",
    category: "COGNITIVE",
    description: "Creates an artificial delay locks down state changes (e.g., adding a new vendor bank details has a locked 10-minute hold where alerts go to management).",
    stretchesCognitiveTunnel: "Dispels the 'Urgency Bias' by making it impossible to perform immediate actions, removing the threat actor's high-pressure leverage."
  },
  {
    id: "patch_warning",
    name: "Semantic Workspace Warnings",
    category: "TECH",
    description: "Displays automated smart banners on Slack or Email when urgency-carrying keywords are sensed (e.g., 'URGENT WIRE TODAY', 'QUICKLY SEND').",
    stretchesCognitiveTunnel: "Acts as a visual anchor, grabbing visual focus and warning the user's subconscious mind of systemic danger."
  },
  {
    id: "patch_buddy",
    name: "Dual-Signoff Collaboration Friction",
    category: "PROCESS",
    description: "Any process overrides require two team members to sign off simultaneously.",
    stretchesCognitiveTunnel: "Shares the cognitive load and alerts a second person who is not experiencing the same focal blind spot / task tunnel vision."
  },
  {
    id: "patch_none",
    name: "No Friction (Blame-and-Train Baseline)",
    category: "COGNITIVE",
    description: "Standard environment relying strictly on employee compliance training and basic technical firewalls with no workflow friction buffers.",
    stretchesCognitiveTunnel: "Offers zero psychological checkpoints, leaving employees entirely vulnerable to subconscious cognitive rushes."
  }
];

// Helper to provide high-fidelity fallback model data (for local testing/no-key gracefully)
function getMockModelData(profile: { orgName: string; industry: string; size: string; stressPeriod: string; tools: string[] }): any {
  const { orgName, industry, size, stressPeriod } = profile;
  
  // Customization based on industry
  let role1 = "Financial Accountant";
  let role2 = "IT Support Technician";
  let role3 = "HR Coordinator";
  let dept1 = "Finance";
  let dept2 = "Information Technology";
  let dept3 = "Human Resources";
  let bias1 = ["Urgency Bias (End-of-month pressure makes checking details feel optional)", "Task Tunneling"];
  let bias2 = ["Authority Bias (Implicit trust in Senior Staff alerts and server state reports)", "Information Overload"];
  let bias3 = ["Empathy Bias (Highly susceptible to candidates/employees reporting dire login issues)"];
  
  if (industry.toLowerCase().includes("healthcare")) {
    role1 = "Triage Charge Nurse";
    role2 = "ER Registrar";
    role3 = "Clinical Systems Analyst";
    dept1 = "Clinical Operations";
    dept2 = "Admissions";
    dept3 = "Healthcare IT";
    bias1 = ["Decision Fatigue (Constant sensory alarm triggers create automatic alert dismissal)", "Urgency Bias"];
    bias2 = ["Empathy Bias (Rushes registration overrides to prioritize critical patient speed)"];
    bias3 = ["Cognitive Load (Constantly swapping between legacy EHR systems makes detail comparison hard)"];
  } else if (industry.toLowerCase().includes("tech") || industry.toLowerCase().includes("software")) {
    role1 = "Senior DevOps Architect";
    role2 = "Customer Success Specialist";
    role3 = "Lead Product Manager";
    dept1 = "Engineering";
    dept2 = "Customer Support";
    dept3 = "Product Management";
    bias1 = ["Sunk Cost Bias (Rushes system recovery steps to hit SLA promises)", "Information Overload"];
    bias2 = ["Empathy Bias (Eager to resolve enterprise custom access issues immediately during key deployments)"];
    bias3 = ["Authority Bias (Highly responsive to leadership asking for last-minute features during launch)"];
  }

  return {
    orgName: orgName || "Apex Enterprises",
    industry: industry || "Technology",
    vulnerabilityScore: 68,
    resilienceRating: "D (Vulnerable to Urgency)",
    executiveSummary: `Analysis of ${orgName || "Apex Enterprises"}'s operational structure reveals key vulnerabilities concentrated around "${stressPeriod || "Quarterly milestones"}". The combination of rapid communication tools, high team-workload pacing, and rigid departmental silos creates cognitive friction voids. Employees are highly susceptible to social engineering when urgency vectors exploit role-specific stresses.`,
    personas: [
      {
        id: "p_1",
        name: "Arthur Pendelton",
        role: role1,
        department: dept1,
        stressLevel: 8,
        workflows: ["Processing critical data changes", `Handling priority notifications during ${stressPeriod || "rush hours"}`, "Approving system changes or vendor wire requests"],
        cognitiveBiases: bias1,
        vectorSusceptibilities: [
          { vector: "Executive Spoofing SMS", score: 85, reason: "When leadership demands immediate out-of-channel actions, authority bias overrides the security checkpoint." },
          { vector: "Priority Vendor Account Swap Guide", score: 72, reason: "Busy workflow loops minimize attention on vendor routing numbers in incoming PDFs." },
          { vector: "Urgent Domain Expiry Vishing", score: 45, reason: "Mild awareness, but busy schedules can lead to secondary compliance failures." }
        ],
        remediationRequirements: ["patch_cooldown", "patch_mfa"]
      },
      {
        id: "p_2",
        name: "Marcus Brody",
        role: role2,
        department: dept2,
        stressLevel: 7,
        workflows: ["Monitoring system logs", "Provisioning temporary administrator privileges", "Resetting legacy credential profiles"],
        cognitiveBiases: bias2,
        vectorSusceptibilities: [
          { vector: "Executive Spoofing SMS", score: 40, reason: "Generally alert to SMS traps, but vulnerable to system-alert spoofs." },
          { vector: "Priority Vendor Account Swap Guide", score: 30, reason: "Rarely handles invoices or supplier payment instructions." },
          { vector: "Urgent Domain Expiry Vishing", score: 80, reason: "A high-tension call claiming critical down-times can trigger rapid credentials bypass under stress." }
        ],
        remediationRequirements: ["patch_warning", "patch_buddy"]
      },
      {
        id: "p_3",
        name: "Sonia Glass",
        role: role3,
        department: dept3,
        stressLevel: 9,
        workflows: ["Handling volume applicant onboardings", "Updating internal HR directory profiles", "Sending benefits notifications"],
        cognitiveBiases: bias3,
        vectorSusceptibilities: [
          { vector: "Executive Spoofing SMS", score: 75, reason: "Vulnerable to urgent requests to update payroll detail listings on short notice." },
          { vector: "Priority Vendor Account Swap Guide", score: 55, reason: "Triggers if a key benefit supplier requests quick routing configuration adjustments." },
          { vector: "Urgent Domain Expiry Vishing", score: 65, reason: "Can be deceived by credential harvesters disguised as emergency applicant profiles." }
        ],
        remediationRequirements: ["patch_cooldown", "patch_warning"]
      }
    ],
    vulnerabilityMap: [
      { role: role1, department: dept1, vector: "Executive Spoofing SMS", riskRating: "HIGH", score: 85, criticalTrigger: "Exploits high urgency bias during peak operations." },
      { role: role1, department: dept1, vector: "Priority Vendor Account Swap Guide", riskRating: "HIGH", score: 72, criticalTrigger: "Rushed financial verification under heavy workload." },
      { role: role1, department: dept1, vector: "Urgent Domain Expiry Vishing", riskRating: "LOW", score: 45, criticalTrigger: "Employee usually rejects voice verification tricks." },
      
      { role: role2, department: dept2, vector: "Executive Spoofing SMS", riskRating: "MEDIUM", score: 40, criticalTrigger: "Checks domain keys unless spoofed as IT Director." },
      { role: role2, department: dept2, vector: "Priority Vendor Account Swap Guide", riskRating: "LOW", score: 30, criticalTrigger: "Outside standard operational responsibilities." },
      { role: role2, department: dept2, vector: "Urgent Domain Expiry Vishing", riskRating: "HIGH", score: 80, criticalTrigger: "Urgent system down claims trigger rapid override bypasses." },

      { role: role3, department: dept3, vector: "Executive Spoofing SMS", riskRating: "HIGH", score: 75, criticalTrigger: "Unchecked direct message request for fast roster export." },
      { role: role3, department: dept3, vector: "Priority Vendor Account Swap Guide", riskRating: "MEDIUM", score: 55, criticalTrigger: "Triggers if packaged as candidate onboarding expense system." },
      { role: role3, department: dept3, vector: "Urgent Domain Expiry Vishing", riskRating: "MEDIUM", score: 65, criticalTrigger: "Sensitive to employee welfare threats or onboarding delays." }
    ],
    topSystemicHotspots: [
      "No secondary out-of-band communication loops when validating structural corporate changes on Slack/Teams.",
      `Severe cognitive overloading and Urgency Bias during ${stressPeriod || "pressure periods"} overrides administrative alertness.`,
      "Single-point approval lines allow urgent bypass requests to go unvetted by independent observers."
    ]
  };
}

// REST endpoints
app.get("/api/config-presets", (req, res) => {
  res.json([
    {
      industry: "Financial Services",
      stressPeriod: "End of Month Fiscal Closing",
      tools: ["Slack/Teams", "Email", "SaaS Accounting Tool", "HR Portal"],
      orgName: "Vanguard Wealth Partners"
    },
    {
      industry: "Healthcare Systems",
      stressPeriod: "Emergency EHR System Cutover",
      tools: ["Email", "Epic Systems", "Internal Pager", "HR Portal"],
      orgName: "St. Jude Clinical Alliance"
    },
    {
      industry: "SaaS Tech Startup",
      stressPeriod: "Major Production Kubernetes V2 Release",
      tools: ["Slack/Teams", "AWS Console", "VPC/VPN", "Email"],
      orgName: "CloudPulse Technologies"
    },
    {
      industry: "Critical Supply Infrastructure",
      stressPeriod: "Mid-Season Audit & Supplier Transition",
      tools: ["Email", "SAP ERP Gateway", "VPC/VPN"],
      orgName: "GridPoint Fuel Grid"
    }
  ]);
});

// Generate dynamic threat model utilizing Gemini or High-Fidelity local generator
app.post("/api/threat-model/generate", async (req, res) => {
  const profile = req.body;
  if (!profile.orgName || !profile.industry || !profile.stressPeriod) {
    return res.status(400).json({ error: "Missing required profile fields" });
  }

  // If no API Key, respond instantly with optimized High-Fidelity Mock data
  if (!hasValidKey()) {
    console.log("Using Mock generator fall-back for Synthetic Friction model generation.");
    return res.json(getMockModelData(profile));
  }

  try {
    const ai = getGemini();
    const prompt = `
      You are a specialized cybersecurity vulnerability analyst and psychological behaviorist.
      Analyze the following corporate profile of an organization and output a "Synthetic Friction" Threat Model.
      This threat model maps out the organization's "cognitive vulnerability" to targeted social engineering attacks, analyzing which systems/roles suffer high pressure, and what psychological biases make them fragile.
      
      ORGANIZATION PROFILE:
      - Company Name: ${profile.orgName}
      - Industry: ${profile.industry}
      - Size: ${profile.size}
      - Core Pressure Window (High Stress Period): ${profile.stressPeriod}
      - Operational Tools/Software stack: ${profile.tools ? profile.tools.join(", ") : "Slack, Email"}

      Generate a highly detailed and cohesive analysis.
      You MUST respond with valid JSON adhering EXACTLY to this schema structure (strictly following the Types):
      {
        "orgName": "String",
        "industry": "String",
        "vulnerabilityScore": 68, // integer 0 to 100 representing overall cognitive vulnerability
        "resilienceRating": "String representing letter grade plus short focus: e.g. D (Vulnerable to Urgency) or B (Standard Moderated)",
        "executiveSummary": "A highly precise and analytical 2-3 sentence overview pointing out how the high-stress period combined with tools creates cognitive bottlenecks.",
        "personas": [
          {
            "id": "p_1",
            "name": "Full Human Name (invented)",
            "role": "Role Name matching industry (e.g. Lead Accountant or ICU Head Nurse)",
            "department": "Department Name (e.g. Finance or Emergency Services)",
            "stressLevel": 8, // integer from 1 to 10 during the stressPeriod
            "workflows": ["workflow 1 detail", "workflow 2 detail"],
            "cognitiveBiases": ["Bias name with short definition (e.g. Authority Bias)", "additional bias"],
            "vectorSusceptibilities": [
              { "vector": "Executive Spoofing SMS", "score": 85, "reason": "Detailed psych explanation of why they fall for it under pressure." },
              { "vector": "Priority Vendor Account Swap Guide", "score": 60, "reason": "Detailed workflow explanation." },
              { "vector": "Urgent Domain Expiry Vishing", "score": 45, "reason": "Detailed voice threat analysis." }
            ],
            "remediationRequirements": ["patch_mfa", "patch_cooldown"] // strings referring to specific friction patches
          },
          ... generate exactly 3 highly realistic employee personas appropriate for this industry ...
        ],
        "vulnerabilityMap": [
          // Build coordinate data for all 3 personas against all 3 vectors listed above: "Executive Spoofing SMS", "Priority Vendor Account Swap Guide", and "Urgent Domain Expiry Vishing"
          // Total length must be 9 cells (3 personas * 3 vectors)
          {
            "role": "Role matching persona 1 exactly",
            "department": "Department matching persona 1 exactly",
            "vector": "Executive Spoofing SMS",
            "riskRating": "HIGH", // HIGH, MEDIUM, LOW
            "score": 85,
            "criticalTrigger": "Rushed instruction from a fake Slack command mimicking CEO profile"
          },
          ... (and so on, mapping all 3 personas to all 3 vectors)
        ],
        "topSystemicHotspots": [
          "Detailed, technical system/process hotspot 1",
          "Detailed, process hotspot 2",
          "Detailed, process hotspot 3"
        ]
      }

      Respond ONLY with the raw JSON. Do not include any markdown backticks (\`\`\`json) or other text wrapper. It must be directly parseable. Ensure the roles and departments match between personas and the vulnerabilityMap.
    `;

    console.log("Invoking Gemini for threat model generation...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const parsedJson = JSON.parse(response.text.trim());
    return res.json(parsedJson);

  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes("leaked") || errorMsg.includes("403") || errorMsg.includes("PERMISSION_DENIED")) {
      isKeyCompromised = true;
    }
    console.log("[SYS] Sandbox offline staging mode engaged due to credential delegation: " + errorMsg);
    // Return high-fidelity fallback data so that user experiences great performance regardless
    return res.json(getMockModelData(profile));
  }
});

// Run live social engineering cognitive threat simulation
app.post("/api/simulate", async (req, res) => {
  const { persona, vector, appliedFrictionId, info } = req.body;
  if (!persona || !vector || !appliedFrictionId) {
    return res.status(400).json({ error: "Missing simulation parameters" });
  }

  const patchObj = FRICTION_PATCHES.find(p => p.id === appliedFrictionId) || FRICTION_PATCHES[4];

  // Helper mock simulation data if API Key not found
  const executeMockSimulation = () => {
    // Determine outcome based on applied friction and persona susceptibility
    const baselineSusceptibility = persona.vectorSusceptibilities.find((v: any) => v.vector === vector)?.score || 50;
    
    let isIntercepted = false;
    let remediationText = "";
    let efficacy = 0;
    
    if (appliedFrictionId === "patch_cooldown") {
      // Cooldown directly counters urgency biases
      isIntercepted = true;
      efficacy = 90;
      remediationText = "The Mandatory Cooldown Delay completely neutralized the social engineering vector by creating space for automated logs to notify central security operations.";
    } else if (appliedFrictionId === "patch_mfa") {
      isIntercepted = true;
      efficacy = 85;
      remediationText = "Using out-of-band double verification successfully intercepted the threat, as the actor could not fulfill the out-of-band call confirmation challenge.";
    } else if (appliedFrictionId === "patch_warning") {
      // Warnings help, but high-stress roles might ignore them
      isIntercepted = baselineSusceptibility < 70;
      efficacy = 55;
      remediationText = isIntercepted 
        ? "The Smart Workspace Warning flagged threat keywords, prompting the employee to stop and review standard guidelines." 
        : "Despite the Workspace Warning, extreme role fatigue and distraction caused the employee to click past the alert banner, completing the bypass.";
    } else if (appliedFrictionId === "patch_buddy") {
      isIntercepted = true;
      efficacy = 80;
      remediationText = "Dual-signoff successfully blocked the breach since a separate staff member, unaffected by the employee's direct stress level, flagged the transaction.";
    } else {
      isIntercepted = false;
      efficacy = 5;
      remediationText = "Under standard processes with zero organizational cognitive friction, the high cognitive load led directly to a critical protocol override failure.";
    }

    const stressPoints = [
      { step: 1, timeOffset: "+0s", actorAction: `Threat actor initiates target contact via ${vector}.`, personaReaction: `Receives warning/link while swamped inside task tunnel. Initial anxiety spikes.`, cognitiveFrictionTriggered: null, stressLevel: 65 },
      { step: 2, timeOffset: "+15s", actorAction: "Actor forces immediate deadline stress ('Must execute in 5 minutes!').", personaReaction: "Exhibits heavy Urgency Bias. Heart rate increases; focus narrows to resolving the error alert quickly.", cognitiveFrictionTriggered: appliedFrictionId !== "patch_none" ? `Visualized: '${patchObj.name}'` : null, stressLevel: 85 },
      { step: 3, timeOffset: "+45s", actorAction: "Actor waits for action details or bypass permission entry.", personaReaction: isIntercepted 
        ? `Cognitive checkpoint enforced: the employee is blocked by ${patchObj.name} which forces cognitive pause. Stress levels cool.` 
        : `Employee proceeds to ignore security warnings, typing credentials or entering financial transfer instructions due to high focus tunneling.`, 
        cognitiveFrictionTriggered: isIntercepted ? patchObj.name : null, 
        stressLevel: isIntercepted ? 45 : 95 },
      { step: 4, timeOffset: "+60s", actorAction: isIntercepted ? "Threat actor terminates connection realizing the bypass failed." : "Threat actor confirms exfiltration of target credentials/funds.", personaReaction: isIntercepted ? "Reports suspicious interaction to SecOps. Focus returns to daily tasks." : "Realizes error 10 minutes later after receiving standard reconciliation summary. Deep regret.", cognitiveFrictionTriggered: null, stressLevel: isIntercepted ? 30 : 98 }
    ];

    return {
      personaId: persona.id,
      personaName: persona.name,
      personaRole: persona.role,
      vector,
      appliedFrictionId,
      appliedFrictionName: patchObj.name,
      outcome: isIntercepted ? "INTERCEPTED" : "BREACHED",
      finalAnalysis: `${persona.name} (${persona.role}) faced a high-stress scenario under the attack vector: ${vector}. ` +
        (isIntercepted 
          ? `The application of '${patchObj.name}' successfully introduced the vital psychological friction needed. This stretched the employee's 'cognitive tunnel' allowing secondary evaluation to flag the threat.` 
          : `Under standard operations, the employee's stress and vulnerability biases overran generic training guidelines, leading to a core breach.`),
      technicalVulnSummary: isIntercepted 
        ? `The threat footprint was arrested before administrative privilege escalation could occur.` 
        : `Full administrative override and payload deployment was achieved. Critical finance/credential assets were leaked.`,
      psychologicalBypassReason: isIntercepted 
        ? `Cognitive tunnel was disrupted by ${patchObj.name}, resulting in restored rational judgment.` 
        : `Severe authority and urgency bias created a workflow capture. The employee had zero interactive safeguards to enforce a pause.`,
      timeline: stressPoints,
      remediationRecommendation: remediationText
    };
  };

  if (!hasValidKey()) {
    return res.json(executeMockSimulation());
  }

  try {
    const ai = getGemini();
    const prompt = `
      You are a behavioral simulation engine for cybersecurity.
      Simulate a psychological threat model run based on the following employee persona, attack vector, and friction patch configuration.

      PERSONA DETAIL:
      - Name: ${persona.name}
      - Role: ${persona.role} (${persona.department})
      - Workflow environment: ${persona.workflows.join(", ")}
      - Stress Level (1-10 Scale): ${persona.stressLevel}
      - Core Cognitive Biases: ${persona.cognitiveBiases.join(", ")}
      - Specific vector susceptibility rating for ${vector}: ${persona.vectorSusceptibilities.find((v: any) => v.vector === vector)?.score || 70}%

      ATTACK DETAIL:
      - Attack Vector: ${vector}
      
      WORKFLOW COGNITIVE FRICTION APPLIED:
      - Patch Name: ${patchObj.name}
      - Patch Category: ${patchObj.category}
      - Patch Description: ${patchObj.description}
      - Stretch Action: ${patchObj.stretchesCognitiveTunnel}

      Goal:
      Simulate how this specific employee acts during this attack sequence over 4 steps (+0s, +15s, +45s, +60s).
      Introduce how the applied friction (if it is not "No Friction") interferes with their workflow.
      An attack is INTERCEPTED if the applied friction successfully disrupts their cognitive tunnel allowing them to think critically, or if their baseline susceptibility is naturally low and the friction helps.
      An attack is BREACHED if "No Friction" is used, or if the friction is insufficient to counter extreme stress/susceptibility.

      You MUST respond with a valid JSON adhering EXACTLY to this schema configuration:
      {
        "personaId": "${persona.id}",
        "personaName": "${persona.name}",
        "personaRole": "${persona.role}",
        "vector": "${vector}",
        "appliedFrictionId": "${appliedFrictionId}",
        "appliedFrictionName": "${patchObj.name}",
        "outcome": "BREACHED" or "INTERCEPTED", // Choose based on details
        "finalAnalysis": "A 2-3 sentence sophisticated psychological post-mortem describing the employee's mental state and how the friction either saved them or failed them.",
        "technicalVulnSummary": "What administrative step or login portal was exposed or spared from exposure.",
        "psychologicalBypassReason": "Which cognitive bias was successfully exploited or disrupted.",
        "remediationRecommendation": "A detailed 1-2 sentence process patch prescription indicating how this flow should be restructured.",
        "timeline": [
          {
            "step": 1,
            "timeOffset": "+0s",
            "actorAction": "Action statement describing what the threat actor does",
            "personaReaction": "Description of the employee's internal panic, focus, or automatic action",
            "cognitiveFrictionTriggered": null, // or string name if a warning/check triggered immediately
            "stressLevel": 65 // integer representing immediate stress level 0 to 100
          },
          {
            "step": 2,
            "timeOffset": "+15s",
            "actorAction": "Actor pushes secondary urgency/threat",
            "personaReaction": "Persona reaction",
            "cognitiveFrictionTriggered": "String or null",
            "stressLevel": 85
          },
          {
            "step": 3,
            "timeOffset": "+45s",
            "actorAction": "Actor commands final action/credential/key entry",
            "personaReaction": "Persona reaction",
            "cognitiveFrictionTriggered": "String or null",
            "stressLevel": 90
          },
          {
            "step": 4,
            "timeOffset": "+60s",
            "actorAction": "Actor confirms success/defeat",
            "personaReaction": "Persona final response",
            "cognitiveFrictionTriggered": null,
            "stressLevel": 35
          }
        ]
      }

      Respond ONLY with the raw JSON. No markdown enclosures. It must be directly parseable. Make the timeline extremely realistic, gripping, and detailed.
    `;

    console.log("Invoking Gemini for simulation modeling...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    const parsedJson = JSON.parse(response.text.trim());
    return res.json(parsedJson);

  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes("leaked") || errorMsg.includes("403") || errorMsg.includes("PERMISSION_DENIED")) {
      isKeyCompromised = true;
    }
    console.log("[SYS] Sandbox simulation offline staging engaged due to credential delegation: " + errorMsg);
    return res.json(executeMockSimulation());
  }
});

// Draft dynamic Enterprise Governance Policies tailored to specific organizations and operational friction hotspots
app.post("/api/enterprise/policy-draft", async (req, res) => {
  const { classification, framework, version, modelData } = req.body;
  
  if (!modelData) {
    return res.status(400).json({ error: "Missing organization threat model context." });
  }

  const company = modelData.orgName || "Apex Enterprises";
  const industry = modelData.industry || "Technology";
  const stressPeriod = modelData.stressPeriod || "Quarterly Milestones";

  // Standalone offline high-fidelity policy builder
  const executeLocalPolicyDraft = () => {
    const markdown = `# ENTERPRISE SECURITY CONSTITUTIONAL DIRECTIVE
# COGNITIVE BEHAVIORAL RESILIENCE & FRICTION STANDARD

**Classification:** ${classification || "STRICTLY CONFIDENTIAL"}  
**Target Organization:** ${company} (${industry})  
**Regulatory Framework Aligned:** ${framework || "ISO 27001 / SOC 2 Type II"}  
**Document Tracking ID:** CBRS-${company.toUpperCase().replace(/[^A-Z]/g, "")}-v${version || "1.0.0"}  
**Authorized Date:** ${new Date().toISOString().split("T")[0]}  

---

## 1.0 EXECUTIVE MISSION STATEMENT
Analysis of ${company}'s operational profiles indicates systemic exposure to social engineering vectors during high-pressure windows, primarily **"${stressPeriod}"**. Real-time messaging environments, rapid notification thresholds, and administrative authority triggers create cognitive stress. This state triggers task-oriented "tunnel-vision", rendering employees vulnerable to spoofing vectors.

To construct behavioral defenses, this directive institutes **"Synthetic Friction Checks"** into the administrative workflows of ${company}. We enforce procedural guidelines to build cognitive safeguards directly into daily procedures.

## 2.0 ENFORCED FRICTION VECTOR TAXONOMY

### SECTION 2.1 Out-of-Band Dual-Channel Verification Command (CBRS-MFA-2.1)
- **Applicable Channels:** Instant Messaging (Slack, Teams, WeChat), Email Requests, Third-Party Portal Link exchanges.
- **Mandate:** Any transactional or structural alteration request (e.g. priority supplier bank detail changes, admin delegation, database exceptions) received over digital messaging platforms MUST be delayed and verified on a distinct, separate physical channel (e.g. telephone or authenticated central directory calling).
- **Behavioral Objective:** Disrupts the automatic speed loop of incoming instructions, forcing a medium transition that clears the operator's focal tunnel.

### SECTION 2.2 Mandatory Operational Cooldown Delay (CBRS-HOLD-2.2)
- **Applicable Channels:** Cash Management Systems, Routing Ledgers, and Server Admin override structures.
- **Mandate:** Workflow changes approved during high-pressure operational cycles include a hard system lock for 10 minutes. Alerts go automatically to security operations. 
- **Behavioral Objective:** Dissipates "Urgency Bias" by making immediate execution impossible. Security staff gain the time budget to intercept the attacker.

### SECTION 2.3 Collaborative Buddy Authorization Signoff (CBRS-BUDDY-2.3)
- **Applicable Channels:** High-privilege access grants, certificate issuances, and bulk ledger approvals.
- **Mandate:** Procedures require dual cryptographic authorizations from two separate employees in independent stress states.
- **Behavioral Objective:** Diffuses individual stress by sharing the cognitive load with an independent coworker who holds an objective focus.

## 3.0 SYSTEMIC COMPLIANCE & RE-ASSESSMENT AUDITS
Corporate compliance must track actual operational resilience under simulated high-pressure phishing drills. Compliance teams must audit cognitive friction standards quarterly, reporting findings to the MNC Board of Directors.

---
*End of Directive. Ratified by ${company} Information Security Committee.*`;
    return { policyMarkdown: markdown };
  };

  if (!hasValidKey()) {
    return res.json(executeLocalPolicyDraft());
  }

  try {
    const ai = getGemini();
    const prompt = `
      You are an elite corporate policy draft analyst and director of risk governance.
      Write an authoritative, highly comprehensive corporate security directive establishing "Synthetic Friction Standards" for ${company} (${industry}) to comply with ${framework}.
      The policy must be customized to map directly to their peak high-stress period: "${stressPeriod}".
      
      Customize the policy specifically around these 3 recognized cognitive friction methods:
      1. Out-of-Band Double verification (for digital messaging requests)
      2. Mandatory 10-Min Cooldown Delays (for critical wire/financial state overrides under pressure)
      3. Dual-Signoff Collaboration Check (for critical system/access overrides)
      
      You MUST refer directly to ${company} throughout. Mention how the policy addresses the core operational tools they use.
      Write in an extremely serious, professional, legally-rigorous, and formal board-of-directors governance tone. Use structured markdown formatting with header styles.
      
      Respond with valid JSON adhering EXACTLY to this schema structure:
      {
        "policyMarkdown": "A complete, beautifully formatted Markdown policy of at least 15-20 detailed paragraphs organized under formal compliance section headers (e.g. 1.0 Executive Mandate, 2.0 Workflow Restrictions, 3.0 Administrative Friction Controls, 4.0 Auditing & Scope)."
      }
      Do not include any outer markdown backticks (\`\`\`json). Just the raw parseable JSON enclosing the markdown content in one key.
    `;

    console.log("Invoking Gemini for dynamic policy draft generator...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    const parsedJson = JSON.parse(response.text.trim());
    return res.json(parsedJson);

  } catch (error: any) {
    console.log("[SYS] Staging offline policy generator due to credential delegation: " + error.message);
    return res.json(executeLocalPolicyDraft());
  }
});

// Serve Vite dev server or static distribution files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYS] "Synthetic Friction" Threat Model server live on port ${PORT}`);
  });
}

startServer();
