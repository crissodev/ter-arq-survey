/**
 * Form Page Component
 */

import React, { useEffect } from "react";
import { useAppContext } from "../../app/store";
import { navigateToResult, navigateToHome } from "../../app/router";
import { sections } from "../../config/questions";
import { getVisibleSections } from "../../domain/rulesEngine";
import Wizard from "../components/Wizard";
import Header from "../components/Header";
import { loadAssessment, saveAssessment } from "../../utils/localStorageRepo";

export function FormPage() {
  const { state, updateAnswer, loadAssessment: loadToContext } = useAppContext();
  const { currentAssessment } = state;

  useEffect(() => {
    // Load assessment from URL or context
    if (!currentAssessment) {
      const urlPath = window.location.pathname;
      const assessmentId = urlPath.split("/").pop();

      if (assessmentId && assessmentId !== "form") {
        const loaded = loadAssessment(assessmentId);
        if (loaded) {
          loadToContext(loaded);
        } else {
          navigateToHome();
        }
      }
    }
  }, [currentAssessment, loadToContext]);

  if (!currentAssessment) {
    return <div className="text-center p-5">Cargando evaluación...</div>;
  }

  const visibleSections = getVisibleSections(sections, currentAssessment.answers);

  const handleComplete = () => {
    // Save assessment
    saveAssessment(currentAssessment);

    // Navigate to results
    navigateToResult(currentAssessment.id);
  };

  return (
    <>
      <Header onNavigateHome={() => navigateToHome()} />
      <Wizard
        sections={visibleSections}
        answers={currentAssessment.answers}
        onAnswerChange={updateAnswer}
        onComplete={handleComplete}
      />
    </>
  );
}

export default FormPage;
