/**
 * Thresholds and decision rules for risk profile assignment
 */

import { RiskProfile } from "../domain/types";

/**
 * Inherent risk range per profile (on a 1-100 scale)
 */
export const inherentRiskRanges: Record<RiskProfile, { min: number; max: number }> = {
  LOW_TOOL: { min: 10, max: 30 },
  BUSINESS: { min: 40, max: 60 },
  EXTERNAL_PLATFORM: { min: 65, max: 80 },
  CRITICAL: { min: 85, max: 95 },
  AI_SYSTEM: { min: 80, max: 100 },
};

/**
 * Decision tree rules to assign risk profile
 * Evaluated in order, returns first matching profile
 */
export const profileAssignmentRules = [
  {
    name: "AI System Detection",
    profile: "AI_SYSTEM" as RiskProfile,
    condition: (answers: Record<string, any>) => {
      return answers["q4_has_ai"]?.value === "yes";
    },
    rationale:
      "El sistema utiliza IA/ML, lo que requiere controles especializados de seguridad en IA",
  },
  {
    name: "Critical Business System",
    profile: "CRITICAL" as RiskProfile,
    condition: (answers: Record<string, any>) => {
      const isCritical = answers["q8_critical_business_impact"]?.value === "yes";
      const hasExternal = answers["q6_has_external_users"]?.value === "yes";
      return isCritical && hasExternal;
    },
    rationale:
      "Sistema crítico con usuarios externos requiere máximo nivel de seguridad",
  },
  {
    name: "External Platform",
    profile: "EXTERNAL_PLATFORM" as RiskProfile,
    condition: (answers: Record<string, any>) => {
      return answers["q6_has_external_users"]?.value === "yes";
    },
    rationale:
      "Presencia de usuarios externos incrementa el riesgo de exposición de datos",
  },
  {
    name: "Business Application",
    profile: "BUSINESS" as RiskProfile,
    condition: (answers: Record<string, any>) => {
      const hasIntegrations = answers["q5_has_integrations"]?.value === "yes";
      const isCritical = answers["q8_critical_business_impact"]?.value === "yes";
      return hasIntegrations || isCritical;
    },
    rationale:
      "Sistema con integraciones o criticidad empresarial requiere controles estándar",
  },
  {
    name: "Low Risk Tool",
    profile: "LOW_TOOL" as RiskProfile,
    condition: () => true,
    rationale:
      "Sistema simple sin factores complejos. Requiere solo controles básicos",
  },
];

/**
 * Mandatory flags based on answers
 */
export const mandatoryFlags = [
  {
    name: "Security Architecture Review Required",
    condition: (answers: Record<string, any>, profile: RiskProfile) => {
      // Security arch review required for critical and AI systems
      return profile === "CRITICAL" || profile === "AI_SYSTEM";
    },
    reason:
      "Sistemas críticos y de IA requieren revisión de arquitectura de seguridad por expertos",
  },
  {
    name: "Data Protection Impact Assessment Required",
    condition: (answers: Record<string, any>) => {
      // DPIA required if processing personal data (EU/GDPR)
      return answers["q9_ai_data_sensitivity"]?.value === "yes" || false;
    },
    reason:
      "Procesamiento de datos personales o sensibles requiere DPIA bajo GDPR",
  },
  {
    name: "External Audit Required",
    condition: (answers: Record<string, any>, profile: RiskProfile) => {
      return profile === "CRITICAL" || profile === "AI_SYSTEM";
    },
    reason: "Auditoría externa anual obligatoria para sistemas críticos y IA",
  },
  {
    name: "Penetration Testing Required",
    condition: (answers: Record<string, any>, profile: RiskProfile) => {
      return profile === "EXTERNAL_PLATFORM" || profile === "CRITICAL";
    },
    reason: "Plataformas externas y sistemas críticos necesitan pentesting regular",
  },
  {
    name: "Compliance Assessment Required",
    condition: (answers: Record<string, any>) => {
      return answers["q6_has_external_users"]?.value === "yes";
    },
    reason:
      "Plataformas con usuarios externos deben cumplir normativas (GDPR, SOC2, etc.)",
  },
];

/**
 * Weights for different factors in risk calculation
 * Used for inherent risk scoring
 */
export const riskFactorWeights = {
  hasAI: 0.25,
  hasExternalUsers: 0.2,
  hasCriticalImpact: 0.2,
  hasIntegrations: 0.15,
  hasIOT: 0.2,
};

/**
 * Calculate inherent risk score (1-100)
 * This is a simplified scoring; can be enhanced with more sophisticated rules
 */
export function calculateInherentRiskScore(
  answers: Record<string, any>
): number {
  let score = 20; // baseline

  if (answers["q4_has_ai"]?.value === "yes") score += 25;
  if (answers["q6_has_external_users"]?.value === "yes") score += 20;
  if (answers["q8_critical_business_impact"]?.value === "yes") score += 20;
  if (answers["q5_has_integrations"]?.value === "yes") score += 15;
  if (answers["q7_has_iot_ot"]?.value === "yes") score += 20;

  // AI-specific risk factors
  if (answers["q9_ai_data_sensitivity"]?.value === "yes") score += 10;
  if (answers["q10_ai_bias_risk"]?.value === "yes") score += 10;

  return Math.min(score, 100);
}

/**
 * Get profile for given answers
 */
export function getProfileForAnswers(
  answers: Record<string, any>
): RiskProfile {
  for (const rule of profileAssignmentRules) {
    if (rule.condition(answers)) {
      return rule.profile;
    }
  }
  return "LOW_TOOL";
}

/**
 * Get rationale for assigned profile
 */
export function getProfileRationale(
  answers: Record<string, any>,
  profile: RiskProfile
): string[] {
  const reasons: string[] = [];

  for (const rule of profileAssignmentRules) {
    if (rule.profile === profile && rule.condition(answers)) {
      reasons.push(rule.rationale);
      break;
    }
  }

  return reasons;
}

/**
 * Get applicable mandatory flags for a profile and answers
 */
export function getApplicableFlags(
  answers: Record<string, any>,
  profile: RiskProfile
): { securityArchitectureReviewRequired: boolean; reasons: string[] } {
  const reasons: string[] = [];

  for (const flag of mandatoryFlags) {
    if (flag.condition(answers, profile)) {
      reasons.push(flag.reason);
    }
  }

  return {
    securityArchitectureReviewRequired:
      profile === "CRITICAL" || profile === "AI_SYSTEM",
    reasons,
  };
}
