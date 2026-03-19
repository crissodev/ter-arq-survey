/**
 * Survey questions and sections configuration
 */

import { Section } from "../domain/types";

export const sections: Section[] = [
  {
    id: "general_identification",
    name: "Preguntas Generales / Identificación",
    description: "Información básica sobre la evaluación",
    questions: [
      {
        id: "q1_organization_name",
        section: "general_identification",
        question: "¿Cuál es el nombre de la organización?",
        type: "text",
        required: true,
        hint: "Nombre completo de la organización o proyecto",
      },
      {
        id: "q2_evaluation_date",
        section: "general_identification",
        question: "Fecha de evaluación",
        type: "text",
        required: true,
        hint: "Formato: DD/MM/YYYY",
      },
      {
        id: "q3_evaluator_name",
        section: "general_identification",
        question: "¿Quién realiza la evaluación?",
        type: "text",
        required: true,
        hint: "Nombre del evaluador o equipo",
      },
    ],
  },
  {
    id: "initial_characterization",
    name: "Caracterización Inicial (Gates Primarios)",
    description: "Determina las secciones condicionales que se mostrarán",
    questions: [
      {
        id: "q4_has_ai",
        section: "initial_characterization",
        question: "¿El sistema utiliza Inteligencia Artificial o Machine Learning?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
        hint: "Incluye datos generados, procesados o analizados por IA/ML",
      },
      {
        id: "q5_has_integrations",
        section: "initial_characterization",
        question: "¿El sistema integra datos con terceros?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
        hint: "APIs, webhooks, integraciones con otros sistemas",
      },
      {
        id: "q6_has_external_users",
        section: "initial_characterization",
        question: "¿El sistema tiene usuarios externos o acceso público?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
        hint: "Clientes, partners, público en general",
      },
      {
        id: "q7_has_iot_ot",
        section: "initial_characterization",
        question: "¿El sistema controla dispositivos IoT/OT (operacional)?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
        hint: "Sensores, actuadores, sistemas de control industrial",
      },
      {
        id: "q8_critical_business_impact",
        section: "initial_characterization",
        question: "¿El sistema es crítico para operaciones de negocio?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
        hint: "Impacto operacional o financiero significativo si cae",
      },
    ],
  },
  {
    id: "ai_section",
    name: "Sección: IA y Machine Learning",
    description: "Preguntas específicas para sistemas con IA/ML",
    conditional: [{ questionId: "q4_has_ai", value: "yes" }],
    questions: [
      {
        id: "q9_ai_data_sensitivity",
        section: "ai_section",
        question: "¿El modelo IA procesa datos sensibles o personales?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
      {
        id: "q10_ai_bias_risk",
        section: "ai_section",
        question: "¿Hay riesgo de sesgo o discriminación en decisiones IA?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
      {
        id: "q11_ai_model_training",
        section: "ai_section",
        question: "¿Se entrena el modelo con datos internos o externos?",
        type: "select",
        options: [
          { value: "internal", label: "Solo internos" },
          { value: "external", label: "Solo externos" },
          { value: "mixed", label: "Ambos" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "integrations_section",
    name: "Sección: Integraciones",
    description: "Preguntas específicas para sistemas integrados",
    conditional: [{ questionId: "q5_has_integrations", value: "yes" }],
    questions: [
      {
        id: "q12_integration_types",
        section: "integrations_section",
        question: "¿Qué tipo de integraciones existen?",
        type: "checkbox",
        options: [
          { value: "api_rest", label: "API REST" },
          { value: "webhooks", label: "Webhooks" },
          { value: "database", label: "Accesso directo a base de datos" },
          { value: "file_transfer", label: "Transferencia de archivos" },
          { value: "custom", label: "Protocolo personalizado" },
        ],
        required: true,
      },
      {
        id: "q13_integration_authentication",
        section: "integrations_section",
        question: "¿Cómo se autentican las integraciones?",
        type: "select",
        options: [
          { value: "api_key", label: "API Keys" },
          { value: "oauth", label: "OAuth 2.0" },
          { value: "mtls", label: "mTLS" },
          { value: "basic_auth", label: "Basic Auth" },
          { value: "none", label: "Sin autenticación" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "external_users_section",
    name: "Sección: Usuarios Externos",
    description: "Preguntas sobre acceso de usuarios externos",
    conditional: [{ questionId: "q6_has_external_users", value: "yes" }],
    questions: [
      {
        id: "q14_external_user_types",
        section: "external_users_section",
        question: "¿Qué tipos de usuarios externos acceden?",
        type: "checkbox",
        options: [
          { value: "customers", label: "Clientes" },
          { value: "partners", label: "Socios comerciales" },
          { value: "public", label: "Público general" },
          { value: "contractors", label: "Contratistas" },
        ],
        required: true,
      },
      {
        id: "q15_external_data_access",
        section: "external_users_section",
        question: "¿Los usuarios externos acceden a datos sensibles?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "iot_ot_section",
    name: "Sección: IoT/OT",
    description: "Preguntas sobre dispositivos IoT u operacionales",
    conditional: [{ questionId: "q7_has_iot_ot", value: "yes" }],
    questions: [
      {
        id: "q16_iot_device_types",
        section: "iot_ot_section",
        question: "¿Qué tipos de dispositivos IoT/OT se controlan?",
        type: "checkbox",
        options: [
          { value: "sensors", label: "Sensores" },
          { value: "actuators", label: "Actuadores" },
          { value: "plc", label: "PLC (Controladores Lógicos)" },
          { value: "scada", label: "SCADA" },
          { value: "embedded", label: "Sistemas embebidos" },
        ],
        required: true,
      },
      {
        id: "q17_iot_safety_impact",
        section: "iot_ot_section",
        question: "¿Fallo del sistema causaría daños a personas o ambiente?",
        type: "radio",
        options: [
          { value: "yes", label: "Sí" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
    ],
  },
];

/**
 * Get all visible sections based on answers
 */
export function getVisibleSections(answers: Record<string, any>): Section[] {
  return sections.filter((section) => {
    if (!section.conditional) {
      return true;
    }

    return section.conditional.every((condition) => {
      const answerValue = answers[condition.questionId]?.value;
      return answerValue === condition.value;
    });
  });
}

/**
 * Get all visible questions in a section
 */
export function getVisibleQuestions(
  sectionId: string,
  answers: Record<string, any>
) {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return [];

  return section.questions.filter((question) => {
    if (!question.conditional) {
      return true;
    }

    return question.conditional.every((condition) => {
      const answerValue = answers[condition.questionId]?.value;
      return answerValue === condition.value;
    });
  });
}
