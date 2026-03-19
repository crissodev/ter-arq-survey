/**
 * Home Page Component
 */

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, ListGroup, Modal } from "react-bootstrap";
import { useAppContext } from "../../app/store";
import { navigateToForm, navigateToResult } from "../../app/router";
import {
  createAssessment,
  listAssessments,
  deleteAssessment,
  getLastAssessmentId,
  loadAssessment,
  importAssessmentFromJSON,
  saveAssessment,
} from "../../utils/localStorageRepo";
import Header from "../components/Header";
import AlertBanner from "../components/AlertBanner";

export function HomePage() {
  const { loadAssessment: loadToContext, createAssessment: createInContext } =
    useAppContext();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssessments = () => {
      const saved = listAssessments();
      setAssessments(saved);
      setLoading(false);
    };

    loadAssessments();
  }, []);

  const handleNewAssessment = () => {
    const assessment = createAssessment();
    createInContext(assessment);
    navigateToForm(assessment.id);
  };

  const handleContinueLastAssessment = () => {
    const lastId = getLastAssessmentId();
    if (lastId) {
      const assessment = loadAssessment(lastId);
      if (assessment) {
        loadToContext(assessment);
        navigateToForm(assessment.id);
      }
    }
  };

  const handleOpenAssessment = (id: string) => {
    const assessment = loadAssessment(id);
    if (assessment) {
      loadToContext(assessment);
      if (assessment.computed) {
        navigateToResult(id);
      } else {
        navigateToForm(id);
      }
    }
  };

  const handleDeleteAssessment = (id: string) => {
    deleteAssessment(id);
    setAssessments(assessments.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const imported = importAssessmentFromJSON(jsonString);
        saveAssessment(imported);
        createInContext(imported);
        setAssessments([...assessments, imported]);
        setImportError(null);
      } catch (error) {
        setImportError(
          `Error al importar: ${error instanceof Error ? error.message : "Error desconocido"}`
        );
      }
    };
    reader.readAsText(file);
  };

  const lastId = getLastAssessmentId();
  const hasLastAssessment = lastId && assessments.some((a) => a.id === lastId);

  return (
    <>
      <Header onNavigateHome={() => {}} />

      <Container className="py-5">
        {/* Welcome Section */}
        <Row className="mb-5">
          <Col lg={8}>
            <div className="mb-4">
              <h1 className="display-4 fw-bold mb-3">PCRS Risk Assessment</h1>
              <p className="lead text-muted">
                Evaluador de riesgo tecnológico - Completar un wizard interactivo para
                determinar el perfil de riesgo, rango inherente y baseline de controles.
              </p>
            </div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-5">
          <Col lg={4} className="mb-3">
            <Card className="h-100 shadow-sm border-0 cursor-pointer hover-shadow">
              <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                <div className="fs-1 mb-3">📝</div>
                <Card.Title className="mb-2">Nueva Evaluación</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  Iniciar una nueva evaluación desde cero
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={handleNewAssessment}
                  className="mt-auto w-100"
                >
                  Crear
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {hasLastAssessment && (
            <Col lg={4} className="mb-3">
              <Card className="h-100 shadow-sm border-0 cursor-pointer hover-shadow">
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                  <div className="fs-1 mb-3">▶️</div>
                  <Card.Title className="mb-2">Continuar Última</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Reanudar la evaluación anterior
                  </Card.Text>
                  <Button
                    variant="info"
                    onClick={handleContinueLastAssessment}
                    className="mt-auto w-100"
                  >
                    Continuar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}

          <Col lg={4} className="mb-3">
            <Card className="h-100 shadow-sm border-0 cursor-pointer hover-shadow">
              <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                <div className="fs-1 mb-3">📥</div>
                <Card.Title className="mb-2">Importar JSON</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  Cargar una evaluación previamente exportada
                </Card.Text>
                <label className="mt-auto w-100">
                  <Button variant="outline-secondary" className="w-100" as="div">
                    Seleccionar
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    style={{ display: "none" }}
                  />
                </label>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {importError && (
          <AlertBanner
            type="danger"
            title="Error de importación"
            message={importError}
            onClose={() => setImportError(null)}
          />
        )}

        {/* Saved Assessments */}
        <Row>
          <Col>
            <h3 className="mb-4">📋 Mis Evaluaciones</h3>

            {loading ? (
              <p className="text-muted">Cargando evaluaciones...</p>
            ) : assessments.length === 0 ? (
              <Card bg="light" className="p-4 text-center">
                <p className="text-muted mb-0">
                  No hay evaluaciones guardadas. ¡Crea una nueva para comenzar!
                </p>
              </Card>
            ) : (
              <div className="row">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="col-md-6 mb-3">
                    <Card className="h-100 shadow-sm border-0">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title className="mb-0">
                            {assessment.name}
                          </Card.Title>
                          {assessment.riskProfile && (
                            <span className="badge bg-info">
                              {assessment.riskProfile}
                            </span>
                          )}
                        </div>
                        <Card.Text className="small text-muted mb-3">
                          Actualizado:{" "}
                          {new Date(assessment.updatedAt).toLocaleDateString()}
                        </Card.Text>
                        <div className="d-flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenAssessment(assessment.id)}
                            className="flex-grow-1"
                          >
                            Abrir
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteConfirmId(assessment.id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>

        {/* Delete Confirmation Modal */}
        <Modal
          show={deleteConfirmId !== null}
          onHide={() => setDeleteConfirmId(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Está seguro de que desea eliminar esta evaluación? Esta acción no se puede
            deshacer.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirmId && handleDeleteAssessment(deleteConfirmId)}
            >
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default HomePage;
