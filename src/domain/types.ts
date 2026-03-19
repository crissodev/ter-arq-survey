/**
 * Core TypeScript types for PCRS Risk Assessment Wizard
 */

export type RiskProfile =
  | "LOW_TOOL"
  | "BUSINESS"
  | "EXTERNAL_PLATFORM"
  | "CRITICAL"
  | "AI_SYSTEM";

export type ControlDomain =
  | "Identidad"
  | "Datos"
  | "Arquitectura"
  | "Aplicación"
  | "Infraestructura"
  | "Integraciones"
  | "Monitoreo"
  | "Gobierno"
  | "IA";

export type QuestionType =
  | "text"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "number";

/**
 * Individual answer in the assessment
 */
export interface Answer {
  questionId: string;
  value: string | string[] | number | boolean;
  timestamp: string;
}

/**
 * Question definition with conditional visibility
 */
export interface Question {
  id: string;
  section: string;
  question: string;
  type: QuestionType;
  options?: Array<{ value: string; label: string }>;
  required: boolean;
  hint?: string;
  conditional?: {
    questionId: string;
    value: string | string[] | number | boolean;
  }[];
}

/**
 * Section of the wizard
 */
export interface Section {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  conditional?: {
    questionId: string;
    value: string | string[] | number | boolean;
  }[];
}

/**
 * Control requirement for a specific domain
 */
export interface ControlRequirement {
  domain: ControlDomain;
  controlId: string;
  name: string;
  required: boolean;
  description?: string;
}

/**
 * Computed result of the assessment
 */
export interface ComputedResult {
  riskProfile: RiskProfile;
  inherentRiskRange: { min: number; max: number };
  controlsBaseline: ControlRequirement[];
  flags: {
    securityArchitectureReviewRequired: boolean;
    reasons: string[];
  };
  rationale: string[];
}

/**
 * Full assessment document
 */
export interface Assessment {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
  answers: Record<string, Answer>;
  computed?: ComputedResult;
}

/**
 * Summary of assessment for listing
 */
export interface AssessmentSummary {
  id: string;
  name: string;
  updatedAt: string;
  riskProfile?: RiskProfile;
}

/**
 * localStorage index structure
 */
export interface StorageIndex {
  assessments: AssessmentSummary[];
  lastAssessmentId?: string;
}
