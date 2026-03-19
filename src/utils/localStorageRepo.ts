/**
 * localStorage repository for assessment persistence
 */

import { v4 as uuidv4 } from "uuid";
import { Assessment, AssessmentSummary, StorageIndex } from "../domain/types";

const STORAGE_PREFIX = "pcrs";
const INDEX_KEY = `${STORAGE_PREFIX}.assessments.index`;
const ASSESSMENT_KEY_PREFIX = `${STORAGE_PREFIX}.assessment`;
const LAST_ID_KEY = `${STORAGE_PREFIX}.lastAssessmentId`;

/**
 * Create a new assessment
 */
export function createAssessment(name?: string): Assessment {
  return {
    id: uuidv4(),
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: name || `Assessment ${new Date().toLocaleDateString()}`,
    answers: {},
  };
}

/**
 * Save assessment to localStorage
 */
export function saveAssessment(assessment: Assessment): void {
  const key = `${ASSESSMENT_KEY_PREFIX}.${assessment.id}`;
  localStorage.setItem(key, JSON.stringify(assessment));

  // Update index
  const index = loadIndex();
  const existingIndex = index.assessments.findIndex((a) => a.id === assessment.id);

  const summary: AssessmentSummary = {
    id: assessment.id,
    name: assessment.name || "Sin nombre",
    updatedAt: assessment.updatedAt,
    riskProfile: assessment.computed?.riskProfile,
  };

  if (existingIndex >= 0) {
    index.assessments[existingIndex] = summary;
  } else {
    index.assessments.push(summary);
  }

  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

/**
 * Load assessment by ID
 */
export function loadAssessment(id: string): Assessment | null {
  const key = `${ASSESSMENT_KEY_PREFIX}.${id}`;
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to parse assessment ${id}:`, error);
    return null;
  }
}

/**
 * List all assessments
 */
export function listAssessments(): AssessmentSummary[] {
  const index = loadIndex();
  return index.assessments;
}

/**
 * Delete assessment by ID
 */
export function deleteAssessment(id: string): void {
  const key = `${ASSESSMENT_KEY_PREFIX}.${id}`;
  localStorage.removeItem(key);

  // Update index
  const index = loadIndex();
  index.assessments = index.assessments.filter((a) => a.id !== id);
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));

  // Clear last ID if deleting last assessment
  if (localStorage.getItem(LAST_ID_KEY) === id) {
    localStorage.removeItem(LAST_ID_KEY);
  }
}

/**
 * Get last worked assessment ID
 */
export function getLastAssessmentId(): string | null {
  return localStorage.getItem(LAST_ID_KEY);
}

/**
 * Set last worked assessment ID
 */
export function setLastAssessmentId(id: string): void {
  localStorage.setItem(LAST_ID_KEY, id);
}

/**
 * Clear all assessments and data
 */
export function clearAllAssessments(): void {
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Load or initialize index
 */
function loadIndex(): StorageIndex {
  const data = localStorage.getItem(INDEX_KEY);

  if (!data) {
    return { assessments: [] };
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse index:", error);
    return { assessments: [] };
  }
}

/**
 * Search assessments by name
 */
export function searchAssessments(query: string): AssessmentSummary[] {
  const all = listAssessments();
  const lowerQuery = query.toLowerCase();

  return all.filter((assessment) =>
    assessment.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Export assessment to JSON string
 */
export function exportAssessmentToJSON(assessment: Assessment): string {
  return JSON.stringify(assessment, null, 2);
}

/**
 * Import assessment from JSON string
 */
export function importAssessmentFromJSON(jsonString: string): Assessment {
  const data = JSON.parse(jsonString);

  // Validate required fields
  if (!data.answers || typeof data.answers !== "object") {
    throw new Error("Invalid assessment format: missing answers");
  }

  // Create new assessment with imported data
  const assessment: Assessment = {
    id: uuidv4(),
    version: data.version || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: `${data.name || "Imported"} (${new Date().toLocaleDateString()})`,
    answers: data.answers,
    computed: data.computed,
  };

  return assessment;
}

/**
 * Get storage usage stats
 */
export function getStorageStats(): {
  assessmentCount: number;
  totalSize: number;
  estimatedPercentage: number;
} {
  const index = loadIndex();
  let totalSize = 0;

  // Calculate total size
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(STORAGE_PREFIX)) {
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += data.length * 2; // Approximate bytes (UTF-16)
      }
    }
  });

  // Estimate percentage of localStorage limit (~5-10MB)
  const estimatedLimit = 5 * 1024 * 1024;
  const estimatedPercentage = Math.round((totalSize / estimatedLimit) * 100);

  return {
    assessmentCount: index.assessments.length,
    totalSize,
    estimatedPercentage,
  };
}
