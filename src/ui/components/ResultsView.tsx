/**
 * Results View Component
 */

import React from "react";
import { Container, Row, Col, Card, Badge, ListGroup, Button } from "react-bootstrap";
import { Assessment, RiskProfile } from "../../domain/types";

const profileColors: Record<RiskProfile, string> = {
  LOW_TOOL: "success",
  BUSINESS: "info",
  EXTERNAL_PLATFORM: "warning",
  CRITICAL: "danger",
  AI_SYSTEM: "danger",
};

const profileEmojis: Record<RiskProfile, string> = {
  LOW_TOOL: "🟢",
  BUSINESS: "🟡",
  EXTERNAL_PLATFORM: "🟠",
  CRITICAL: "🔴",
  AI_SYSTEM: "🔴",
};

const profileNames: Record<RiskProfile, string> = {
  LOW_TOOL: "Herramienta Básica",
  BUSINESS: "Aplicación de Negocios",
  EXTERNAL_PLATFORM: "Plataforma Externa",
  CRITICAL: "Sistema Crítico",
  AI_SYSTEM: "Sistema de IA",
};

interface ResultsViewProps {
  assessment: Assessment;
  onExport?: () => void;
  onPrint?: () => void;
  onBackHome?: () => void;
}

export function ResultsView({
  assessment,
  onExport,
  onPrint,
  onBackHome,
}: ResultsViewProps) {
  const computed = assessment.computed;

  if (!computed) {
    return (
      <Container className="py-5">
        <div className="alert alert-warning">
          No hay resultados computados. Por favor, complete la evaluación.
        </div>
      </Container>
    );
  }

  // Group controls by domain
  const controlsByDomain = computed.controlsBaseline.reduce(
    (acc, control) => {
      if (!acc[control.domain]) {
        acc[control.domain] = [];
      }
      acc[control.domain].push(control);
      return acc;
    },
    {} as Record<string, typeof computed.controlsBaseline>
  );

  return (
    <Container className="py-4">
      {/* Risk Profile Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col lg={6}>
              <h4 className="mb-3">Perfil de Riesgo Asignado</h4>
              <div className="display-flex gap-3">
                <div>
                  <div className="fs-1 mb-2">
                    {profileEmojis[computed.riskProfile]}
                  </div>
                  <h3 className="mb-2">
                    {profileNames[computed.riskProfile]}
                  </h3>
                  <Badge bg={profileColors[computed.riskProfile]} className="fs-6">
                    {computed.riskProfile}
                  </Badge>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <h5 className="mb-3">Rango de Riesgo Inherente</h5>
              <Card bg="light" className="p-3">
                <h2 className="mb-0 text-center">
                  {computed.inherentRiskRange.min} - {computed.inherentRiskRange.max}
                </h2>
                <p className="text-muted text-center mb-0">(Escala 1-100)</p>
              </Card>
            </Col>
          </Row>

          {computed.rationale.length > 0 && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="mb-2">📋 Razones de la Asignación:</h6>
              <ul className="mb-0">
                {computed.rationale.map((reason, idx) => (
                  <li key={idx} className="small">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Alerts Section */}
      {computed.flags.reasons.length > 0 && (
        <Card className="mb-4 border-0 shadow-sm border-start border-danger">
          <Card.Body className="p-4">
            <h5 className="mb-3">⚠️ Alertas y Requisitos Obligatorios</h5>
            <ListGroup variant="flush">
              {computed.flags.reasons.map((reason, idx) => (
                <ListGroup.Item key={idx} className="border-0 py-2">
                  <span className="text-danger">●</span> {reason}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* Controls Baseline Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <h5 className="mb-4">🛡️ Baseline de Controles Requeridos</h5>
          <Row>
            {Object.entries(controlsByDomain).map(([domain, controls]) => (
              <Col lg={6} className="mb-4" key={domain}>
                <Card bg="light" className="h-100">
                  <Card.Body>
                    <Card.Title className="fs-6 mb-3">{domain}</Card.Title>
                    <ListGroup variant="flush">
                      {controls.map((control) => (
                        <ListGroup.Item
                          key={control.controlId}
                          className="border-0 bg-light py-2 px-0 small"
                        >
                          <span className={control.required ? "text-danger" : "text-muted"}>
                            {control.required ? "🔴" : "⚪"}
                          </span>{" "}
                          {control.name}
                          {control.description && (
                            <div className="text-muted small mt-1">
                              {control.description}
                            </div>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Assessment Info */}
      <Card className="mb-4 border-0 shadow-sm" bg="light">
        <Card.Body className="p-3">
          <Row className="small">
            <Col md={3}>
              <strong>ID de evaluación:</strong>
              <div className="text-muted font-monospace" style={{ fontSize: "11px" }}>
                {assessment.id}
              </div>
            </Col>
            <Col md={3}>
              <strong>Fecha de creación:</strong>
              <div className="text-muted">
                {new Date(assessment.createdAt).toLocaleDateString()}
              </div>
            </Col>
            <Col md={3}>
              <strong>Última actualización:</strong>
              <div className="text-muted">
                {new Date(assessment.updatedAt).toLocaleDateString()}
              </div>
            </Col>
            <Col md={3}>
              <strong>Nombre:</strong>
              <div className="text-muted">{assessment.name || "Sin nombre"}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="d-flex gap-2 justify-content-center pb-4">
        {onExport && (
          <Button variant="outline-primary" onClick={onExport}>
            📥 Exportar JSON
          </Button>
        )}
        {onPrint && (
          <Button variant="outline-secondary" onClick={onPrint}>
            🖨️ Imprimir / PDF
          </Button>
        )}
        {onBackHome && (
          <Button variant="primary" onClick={onBackHome}>
            🏠 Volver al Inicio
          </Button>
        )}
      </div>
    </Container>
  );
}

export default ResultsView;
