/**
 * Result Page Component
 */

import React, { useEffect } from "react";
import { useAppContext } from "../../app/store";
import { navigateToHome, navigateToForm } from "../../app/router";
import ResultsView from "../components/ResultsView";
import Header from "../components/Header";
import { loadAssessment, exportAssessmentToJSON } from "../../utils/localStorageRepo";

export function ResultPage() {
  const { state, loadAssessment: loadToContext } = useAppContext();
  const { currentAssessment } = state;

  useEffect(() => {
    // Load assessment from URL or context
    if (!currentAssessment) {
      const urlPath = window.location.pathname;
      const assessmentId = urlPath.split("/").pop();

      if (assessmentId && assessmentId !== "result") {
        const loaded = loadAssessment(assessmentId);
        if (loaded) {
          loadToContext(loaded);
        } else {
          navigateToHome();
        }
      }
    }
  }, []);

  if (!currentAssessment) {
    return <div className="text-center p-5">Cargando resultados...</div>;
  }

  const handleExport = () => {
    const json = exportAssessmentToJSON(currentAssessment);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assessment_${currentAssessment.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackHome = () => {
    navigateToHome();
  };

  const handleEditAssessment = () => {
    navigateToForm(currentAssessment.id);
  };

  return (
    <>
      <Header onNavigateHome={() => navigateToHome()} />
      <ResultsView
        assessment={currentAssessment}
        onExport={handleExport}
        onPrint={handlePrint}
        onBackHome={handleBackHome}
      />
      <div className="text-center pb-4">
        <button
          className="btn btn-outline-primary"
          onClick={handleEditAssessment}
        >
          ✏️ Editar Evaluación
        </button>
      </div>
    </>
  );
}

export default ResultPage;
