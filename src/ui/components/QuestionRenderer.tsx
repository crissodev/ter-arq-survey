/**
 * Question Renderer Component
 */

import React from "react";
import { Form } from "react-bootstrap";
import { Question, Answer } from "../../domain/types";

interface QuestionRendererProps {
  question: Question;
  answer?: Answer;
  onChange: (value: any) => void;
  invalid?: boolean;
  errorMessage?: string;
}

export function QuestionRenderer({
  question,
  answer,
  onChange,
  invalid = false,
  errorMessage,
}: QuestionRendererProps) {
  const value = answer?.value ?? "";

  const renderQuestion = () => {
    switch (question.type) {
      case "text":
        return (
          <Form.Control
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={invalid}
            placeholder="Ingrese la respuesta"
            className="mb-2"
          />
        );

      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={4}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={invalid}
            placeholder="Ingrese la respuesta"
            className="mb-2"
          />
        );

      case "number":
        return (
          <Form.Control
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : "")}
            isInvalid={invalid}
            placeholder="Ingrese un número"
            className="mb-2"
          />
        );

      case "radio":
        return (
          <Form.Group className="mb-3">
            {question.options?.map((option) => (
              <Form.Check
                key={option.value}
                type="radio"
                id={`${question.id}_${option.value}`}
                name={question.id}
                label={option.label}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
              />
            ))}
            {invalid && <Form.Control.Feedback className="d-block text-danger">
              {errorMessage || "Este campo es obligatorio"}
            </Form.Control.Feedback>}
          </Form.Group>
        );

      case "select":
        return (
          <Form.Select
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={invalid}
            className="mb-2"
          >
            <option value="">-- Seleccione una opción --</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case "checkbox":
        const checkboxValue = Array.isArray(value) ? value : [];
        return (
          <Form.Group className="mb-3">
            {question.options?.map((option) => (
              <Form.Check
                key={option.value}
                type="checkbox"
                id={`${question.id}_${option.value}`}
                label={option.label}
                checked={checkboxValue.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...checkboxValue, option.value]);
                  } else {
                    onChange(
                      checkboxValue.filter((v) => v !== option.value)
                    );
                  }
                }}
              />
            ))}
            {invalid && <Form.Control.Feedback className="d-block text-danger">
              {errorMessage || "Seleccione al menos una opción"}
            </Form.Control.Feedback>}
          </Form.Group>
        );

      default:
        return <p className="text-muted">Tipo de pregunta no soportado</p>;
    }
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label className="fw-bold fs-5 mb-3">
        {question.question}
        {question.required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      {question.hint && (
        <Form.Text className="d-block mb-2 text-muted">
          💡 {question.hint}
        </Form.Text>
      )}
      {renderQuestion()}
      {invalid && errorMessage && question.type !== "radio" && question.type !== "checkbox" && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export default QuestionRenderer;
