/**
 * Risk profile computation
 */

import { Answer, Assessment, ComputedResult, RiskProfile } from "../domain/types";
import {
  getProfileForAnswers,
  getProfileRationale,
  inherentRiskRanges,
  calculateInherentRiskScore,
  getApplicableFlags,
} from "../config/thresholds";
import { getControlsForProfile } from "../config/controls";

/**
 * Compute the complete result for an assessment
 */
export function computeAssessmentResult(
  assessment: Assessment
): ComputedResult {
  const profile = computeProfile(assessment.answers);
  const inherentRiskRange = inherentRiskRanges[profile];
  const controlsBaseline = getControlsForProfile(profile);
  const flags = getApplicableFlags(assessment.answers, profile);
  const rationale = getProfileRationale(assessment.answers, profile);

  return {
    riskProfile: profile,
    inherentRiskRange,
    controlsBaseline,
    flags,
    rationale,
  };
}

/**
 * Determine risk profile based on answers
 */
export function computeProfile(
  answers: Record<string, Answer | any>
): RiskProfile {
  // Convert Answer objects to simple values for the decision rules
  const answerValues: Record<string, any> = {};
  Object.entries(answers).forEach(([key, value]) => {
    if (typeof value === "object" && "value" in value) {
      answerValues[key] = value; // Keep as is for evaluator
    } else {
      answerValues[key] = { value };
    }
  });

  return getProfileForAnswers(answerValues);
}

/**
 * Update assessment with computed results
 */
export function updateAssessmentWithResults(
  assessment: Assessment
): Assessment {
  return {
    ...assessment,
    computed: computeAssessmentResult(assessment),
    updatedAt: new Date().toISOString(),
  };
}
