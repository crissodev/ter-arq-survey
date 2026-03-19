/**
 * Rules engine for evaluating conditional logic
 */

import { Answer, Question, Section } from "../domain/types";

/**
 * Evaluate if a condition is met based on current answers
 */
export function evaluateCondition(
  condition: { questionId: string; value: string | string[] | number | boolean }[],
  answers: Record<string, Answer>
): boolean {
  if (!condition || condition.length === 0) {
    return true;
  }

  return condition.every((cond) => {
    const answer = answers[cond.questionId];
    if (!answer) {
      return false;
    }

    // Support array values (checkbox)
    if (Array.isArray(cond.value)) {
      return Array.isArray(answer.value) &&
        cond.value.every((v) => (answer.value as string[]).includes(v as string));
    }

    return answer.value === cond.value;
  });
}

/**
 * Get all visible questions in a section based on current answers
 */
export function getVisibleQuestions(
  section: Section,
  answers: Record<string, Answer>
): Question[] {
  return section.questions.filter((question) => {
    if (!question.conditional) {
      return true;
    }
    return evaluateCondition(question.conditional, answers);
  });
}

/**
 * Get all visible sections based on current answers
 */
export function getVisibleSections(
  sections: Section[],
  answers: Record<string, Answer>
): Section[] {
  return sections.filter((section) => {
    if (!section.conditional) {
      return true;
    }
    return evaluateCondition(section.conditional, answers);
  });
}

/**
 * Get all questions across visible sections
 */
export function getAllVisibleQuestions(
  sections: Section[],
  answers: Record<string, Answer>
): Question[] {
  const visibleSections = getVisibleSections(sections, answers);
  const allQuestions: Question[] = [];

  visibleSections.forEach((section) => {
    const visibleQuestions = getVisibleQuestions(section, answers);
    allQuestions.push(...visibleQuestions);
  });

  return allQuestions;
}

/**
 * Check if all required questions in a section are answered
 */
export function isSectionValid(
  section: Section,
  answers: Record<string, Answer>
): boolean {
  const visibleQuestions = getVisibleQuestions(section, answers);

  return visibleQuestions.every((question) => {
    if (!question.required) {
      return true;
    }

    const answer = answers[question.id];
    if (!answer || answer.value === undefined || answer.value === null) {
      return false;
    }

    if (typeof answer.value === "string" && answer.value.trim() === "") {
      return false;
    }

    if (Array.isArray(answer.value) && answer.value.length === 0) {
      return false;
    }

    return true;
  });
}

/**
 * Get all unanswered required questions in a section
 */
export function getUnansweredQuestions(
  section: Section,
  answers: Record<string, Answer>
): Question[] {
  const visibleQuestions = getVisibleQuestions(section, answers);

  return visibleQuestions.filter((question) => {
    if (!question.required) {
      return false;
    }

    const answer = answers[question.id];
    if (!answer || answer.value === undefined || answer.value === null) {
      return true;
    }

    if (typeof answer.value === "string" && answer.value.trim() === "") {
      return true;
    }

    if (Array.isArray(answer.value) && answer.value.length === 0) {
      return true;
    }

    return false;
  });
}

/**
 * Check the completion percentage of all sections
 */
export function calculateCompletionPercentage(
  sections: Section[],
  answers: Record<string, Answer>
): number {
  const allVisibleQuestions = getAllVisibleQuestions(sections, answers);
  if (allVisibleQuestions.length === 0) {
    return 0;
  }

  const answeredQuestions = allVisibleQuestions.filter((question) => {
    const answer = answers[question.id];
    if (!answer || answer.value === undefined || answer.value === null) {
      return false;
    }

    if (typeof answer.value === "string" && answer.value.trim() === "") {
      return false;
    }

    if (Array.isArray(answer.value) && answer.value.length === 0) {
      return false;
    }

    return true;
  }).length;

  return Math.round((answeredQuestions / allVisibleQuestions.length) * 100);
}

/**
 * Trace which rules fired to assign a profile
 */
export function traceRulesFired(
  rules: Array<{
    name: string;
    condition: (answers: Record<string, any>) => boolean;
    rationale: string;
  }>,
  answers: Record<string, Answer>
): string[] {
  const answerMap: Record<string, any> = {};
  Object.entries(answers).forEach(([key, answer]) => {
    answerMap[key] = answer;
  });

  const firedRules: string[] = [];

  for (const rule of rules) {
    if (rule.condition(answerMap)) {
      firedRules.push(rule.rationale);
      break; // Usually only one rule fires for profile assignment
    }
  }

  return firedRules;
}
