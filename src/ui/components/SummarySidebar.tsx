/**
 * Summary Sidebar Component
 */

import React from "react";
import { Card, ListGroup, Badge, ProgressBar as BootstrapProgressBar } from "react-bootstrap";
import { Section, Answer } from "../../domain/types";
import { isSectionValid } from "../../domain/rulesEngine";

interface SummarySidebarProps {
  sections: Section[];
  answers: Record<string, Answer>;
  currentSectionId: string;
  onSelectSection: (sectionId: string) => void;
}

export function SummarySidebar({
  sections,
  answers,
  currentSectionId,
  onSelectSection,
}: SummarySidebarProps) {
  const completedSections = sections.filter((section) =>
    isSectionValid(section, answers)
  ).length;

  const completionPercentage = Math.round(
    (completedSections / sections.length) * 100
  );

  return (
    <Card className="position-sticky" style={{ top: "80px" }}>
      <Card.Body>
        <Card.Title className="mb-3">
          📋 Progreso
        </Card.Title>

        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <small className="fw-bold">Secciones completadas</small>
            <small className="text-muted">
              {completedSections}/{sections.length}
            </small>
          </div>
          <BootstrapProgressBar
            now={completionPercentage}
            variant="success"
            className="mb-2"
          />
          <small className="text-muted">{completionPercentage}%</small>
        </div>

        <hr />

        <Card.Subtitle className="mb-3">
          <small className="text-muted fw-bold">SECCIONES</small>
        </Card.Subtitle>

        <ListGroup variant="flush">
          {sections.map((section, index) => {
            const isValid = isSectionValid(section, answers);
            const isCurrent = section.id === currentSectionId;
            
            // Check if all previous sections are completed
            const allPreviousCompleted = index === 0 || 
              sections.slice(0, index).every((s) => isSectionValid(s, answers));
            
            // Section is accessible if it's current, all previous are done, or it's completed
            const isAccessible = isCurrent || allPreviousCompleted || isValid;

            return (
              <ListGroup.Item
                key={section.id}
                onClick={() => isAccessible && onSelectSection(section.id)}
                style={{
                  cursor: isAccessible ? "pointer" : "not-allowed",
                  backgroundColor: isCurrent ? "#f0f0f0" : "transparent",
                  borderLeft: isCurrent ? "4px solid #28a745" : "4px solid transparent",
                  opacity: isAccessible ? 1 : 0.5,
                }}
                className="py-2 px-3 d-flex justify-content-between align-items-center"
              >
                <span className="small">
                  {isValid && <span className="me-2">✅</span>}
                  {!isValid && <span className="me-2">⭕</span>}
                  {section.name}
                  {!isAccessible && !isValid && <span className="ms-2 text-muted" style={{ fontSize: "12px" }}>🔒</span>}
                </span>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default SummarySidebar;
