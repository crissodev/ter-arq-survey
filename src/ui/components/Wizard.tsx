/**
 * Wizard Component - Form Navigation and Question Display
 */

import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Section, Answer } from "../../domain/types";
import { getVisibleQuestions, isSectionValid, getUnansweredQuestions } from "../../domain/rulesEngine";
import QuestionRenderer from "./QuestionRenderer";
import SummarySidebar from "./SummarySidebar";
import AlertBanner from "./AlertBanner";

interface WizardProps {
  sections: Section[];
  answers: Record<string, Answer>;
  onAnswerChange: (questionId: string, value: any) => void;
  onComplete: () => void;
}

export function Wizard({
  sections,
  answers,
  onAnswerChange,
  onComplete,
}: WizardProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showValidationError, setShowValidationError] = useState(false);

  const currentSection = sections[currentSectionIndex];
  const visibleQuestions = getVisibleQuestions(currentSection, answers);
  const unansweredQuestions = getUnansweredQuestions(currentSection, answers);
  const sectionIsValid = isSectionValid(currentSection, answers);

  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleNext = () => {
    if (!sectionIsValid) {
      setShowValidationError(true);
      return;
    }

    if (isLastSection) {
      onComplete();
    } else {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setShowValidationError(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setShowValidationError(false);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index >= 0) {
      setCurrentSectionIndex(index);
      setShowValidationError(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <Container className="py-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row className="g-4">
          {/* Sidebar */}
          <Col lg={3} className="d-none d-lg-block ps-lg-2">
            <SummarySidebar
              sections={sections}
              answers={answers}
              currentSectionId={currentSection.id}
              onSelectSection={handleSectionClick}
            />
          </Col>

          {/* Main Content */}
          <Col xs={12} lg={9} className="pe-lg-2">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              {/* Progress indicator */}
              <div className="mb-4">
                <small className="text-muted">
                  Sección {currentSectionIndex + 1} de {sections.length}
                </small>
                <div className="progress mt-2" style={{ height: "6px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${((currentSectionIndex + 1) / sections.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Section Header */}
              <div className="mb-4">
                <h3 className="mb-2">{currentSection.name}</h3>
                <p className="text-muted">{currentSection.description}</p>
              </div>

              {/* Validation Error */}
              {showValidationError && unansweredQuestions.length > 0 && (
                <AlertBanner
                  type="danger"
                  title="Validación requerida"
                  message={`Por favor responda los siguientes campos obligatorios: ${unansweredQuestions
                    .map((q) => q.question)
                    .join(", ")}`}
                />
              )}

              {/* Questions */}
              <div className="mb-4">
                {visibleQuestions.length === 0 ? (
                  <p className="text-muted">No hay preguntas visibles en esta sección.</p>
                ) : (
                  visibleQuestions.map((question) => (
                    <QuestionRenderer
                      key={question.id}
                      question={question}
                      answer={answers[question.id]}
                      onChange={(value) => onAnswerChange(question.id, value)}
                      invalid={
                        showValidationError &&
                        question.required &&
                        !answers[question.id]?.value
                      }
                      errorMessage="Este campo es obligatorio"
                    />
                  ))
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex gap-2 mt-5 pt-3 border-top">
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={isFirstSection}
                  className="w-100"
                >
                  ← Anterior
                </Button>

                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="w-100"
                >
                  {isLastSection ? "✅ Completar" : "Siguiente →"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Wizard;
