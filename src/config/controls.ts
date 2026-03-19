/**
 * Control matrix baseline per risk profile
 */

import { RiskProfile, ControlRequirement, ControlDomain } from "../domain/types";

export type ControlMatrix = Record<RiskProfile, Record<ControlDomain, ControlRequirement[]>>;

export const controlMatrix: ControlMatrix = {
  LOW_TOOL: {
    Identidad: [
      {
        domain: "Identidad",
        controlId: "id_001",
        name: "Autenticación básica",
        required: true,
        description: "Usuario/contraseña con requisitos mínimos",
      },
    ],
    Datos: [
      {
        domain: "Datos",
        controlId: "dat_001",
        name: "Clasificación de datos básica",
        required: true,
        description: "Identificar datos públicos/privados",
      },
    ],
    Arquitectura: [
      {
        domain: "Arquitectura",
        controlId: "arc_001",
        name: "Documentación básica",
        required: true,
        description: "Diagrama de arquitectura simple",
      },
    ],
    Aplicación: [
      {
        domain: "Aplicación",
        controlId: "app_001",
        name: "Testing básico",
        required: true,
        description: "Pruebas manuales y/o unitarias",
      },
    ],
    Infraestructura: [
      {
        domain: "Infraestructura",
        controlId: "inf_001",
        name: "Parches de seguridad",
        required: true,
        description: "Actualizar sistema operativo y librerías",
      },
    ],
    Integraciones: [
      {
        domain: "Integraciones",
        controlId: "int_001",
        name: "Validación de entrada",
        required: false,
        description: "Revisar datos provenientes de integraciones",
      },
    ],
    Monitoreo: [
      {
        domain: "Monitoreo",
        controlId: "mon_001",
        name: "Logs básicos",
        required: false,
        description: "Registro de actividades principales",
      },
    ],
    Gobierno: [
      {
        domain: "Gobierno",
        controlId: "gov_001",
        name: "Política de acceso básica",
        required: true,
        description: "Documento con permisos por rol",
      },
    ],
    IA: [],
  },

  BUSINESS: {
    Identidad: [
      {
        domain: "Identidad",
        controlId: "id_001",
        name: "Autenticación básica",
        required: true,
      },
      {
        domain: "Identidad",
        controlId: "id_002",
        name: "Gestión centralizada de identidades",
        required: true,
        description: "LDAP, Active Directory o equivalente",
      },
      {
        domain: "Identidad",
        controlId: "id_003",
        name: "Autenticación multifactor para admins",
        required: true,
      },
    ],
    Datos: [
      {
        domain: "Datos",
        controlId: "dat_001",
        name: "Clasificación de datos",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_002",
        name: "Backup y recuperación",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_003",
        name: "Encriptación en tránsito",
        required: true,
      },
    ],
    Arquitectura: [
      {
        domain: "Arquitectura",
        controlId: "arc_001",
        name: "Documentación de arquitectura",
        required: true,
      },
      {
        domain: "Arquitectura",
        controlId: "arc_002",
        name: "Análisis de riesgos arquitectónico",
        required: true,
      },
      {
        domain: "Arquitectura",
        controlId: "arc_003",
        name: "Redundancia para disponibilidad",
        required: true,
      },
    ],
    Aplicación: [
      {
        domain: "Aplicación",
        controlId: "app_001",
        name: "SAST (análisis estático)",
        required: true,
      },
      {
        domain: "Aplicación",
        controlId: "app_002",
        name: "Testing automatizado",
        required: true,
      },
      {
        domain: "Aplicación",
        controlId: "app_003",
        name: "Validación de entrada",
        required: true,
      },
    ],
    Infraestructura: [
      {
        domain: "Infraestructura",
        controlId: "inf_001",
        name: "Parches de seguridad",
        required: true,
      },
      {
        domain: "Infraestructura",
        controlId: "inf_002",
        name: "Firewall y WAF",
        required: true,
      },
      {
        domain: "Infraestructura",
        controlId: "inf_003",
        name: "Hardening de servidores",
        required: true,
      },
    ],
    Integraciones: [
      {
        domain: "Integraciones",
        controlId: "int_001",
        name: "API Gateway",
        required: true,
      },
      {
        domain: "Integraciones",
        controlId: "int_002",
        name: "Validación y rate limiting",
        required: true,
      },
      {
        domain: "Integraciones",
        controlId: "int_003",
        name: "Auditoría de llamadas",
        required: true,
      },
    ],
    Monitoreo: [
      {
        domain: "Monitoreo",
        controlId: "mon_001",
        name: "Logging centralizado",
        required: true,
      },
      {
        domain: "Monitoreo",
        controlId: "mon_002",
        name: "Alertas de seguridad",
        required: true,
      },
      {
        domain: "Monitoreo",
        controlId: "mon_003",
        name: "SIEM básico",
        required: true,
      },
    ],
    Gobierno: [
      {
        domain: "Gobierno",
        controlId: "gov_001",
        name: "Política de acceso documentada",
        required: true,
      },
      {
        domain: "Gobierno",
        controlId: "gov_002",
        name: "Revisión de acceso anual",
        required: true,
      },
      {
        domain: "Gobierno",
        controlId: "gov_003",
        name: "Plan de incidentes",
        required: true,
      },
    ],
    IA: [],
  },

  EXTERNAL_PLATFORM: {
    Identidad: [
      {
        domain: "Identidad",
        controlId: "id_002",
        name: "Gestión centralizada de identidades",
        required: true,
      },
      {
        domain: "Identidad",
        controlId: "id_003",
        name: "OAuth 2.0 / OpenID Connect",
        required: true,
      },
      {
        domain: "Identidad",
        controlId: "id_004",
        name: "MFA para todos los usuarios",
        required: true,
      },
    ],
    Datos: [
      {
        domain: "Datos",
        controlId: "dat_002",
        name: "Backup con RTO/RPO definido",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_003",
        name: "Encriptación en tránsito y reposo",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_004",
        name: "DLP (Data Loss Prevention)",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_005",
        name: "GDPR/compliance controls",
        required: true,
      },
    ],
    Arquitectura: [
      {
        domain: "Arquitectura",
        controlId: "arc_002",
        name: "Threat modeling",
        required: true,
      },
      {
        domain: "Arquitectura",
        controlId: "arc_003",
        name: "HA y DR",
        required: true,
      },
      {
        domain: "Arquitectura",
        controlId: "arc_004",
        name: "Zero Trust Architecture",
        required: true,
      },
    ],
    Aplicación: [
      {
        domain: "Aplicación",
        controlId: "app_001",
        name: "SAST / DAST",
        required: true,
      },
      {
        domain: "Aplicación",
        controlId: "app_004",
        name: "Código review por pares",
        required: true,
      },
      {
        domain: "Aplicación",
        controlId: "app_005",
        name: "Gestión de dependencias",
        required: true,
      },
    ],
    Infraestructura: [
      {
        domain: "Infraestructura",
        controlId: "inf_002",
        name: "Firewall avanzado + IDS/IPS",
        required: true,
      },
      {
        domain: "Infraestructura",
        controlId: "inf_003",
        name: "Hardening y patching automatizado",
        required: true,
      },
      {
        domain: "Infraestructura",
        controlId: "inf_004",
        name: "Segmentación de red",
        required: true,
      },
    ],
    Integraciones: [
      {
        domain: "Integraciones",
        controlId: "int_002",
        name: "Rate limiting y throttling",
        required: true,
      },
      {
        domain: "Integraciones",
        controlId: "int_004",
        name: "Validación mutua de certificados",
        required: true,
      },
      {
        domain: "Integraciones",
        controlId: "int_005",
        name: "Auditoría detallada de integraciones",
        required: true,
      },
    ],
    Monitoreo: [
      {
        domain: "Monitoreo",
        controlId: "mon_002",
        name: "Alertas en tiempo real",
        required: true,
      },
      {
        domain: "Monitoreo",
        controlId: "mon_003",
        name: "SIEM con análisis avanzado",
        required: true,
      },
      {
        domain: "Monitoreo",
        controlId: "mon_004",
        name: "Incident Response automatizada",
        required: true,
      },
    ],
    Gobierno: [
      {
        domain: "Gobierno",
        controlId: "gov_002",
        name: "Revisión trimestral de acceso",
        required: true,
      },
      {
        domain: "Gobierno",
        controlId: "gov_003",
        name: "Plan de incidentes y crisis",
        required: true,
      },
      {
        domain: "Gobierno",
        controlId: "gov_004",
        name: "Cumplimiento de normativas",
        required: true,
      },
    ],
    IA: [],
  },

  CRITICAL: {
    Identidad: [
      {
        domain: "Identidad",
        controlId: "id_003",
        name: "OAuth 2.0 / OpenID Connect",
        required: true,
      },
      {
        domain: "Identidad",
        controlId: "id_004",
        name: "MFA para todos",
        required: true,
      },
      {
        domain: "Identidad",
        controlId: "id_005",
        name: "Biometría para operaciones críticas",
        required: true,
      },
    ],
    Datos: [
      {
        domain: "Datos",
        controlId: "dat_003",
        name: "Encriptación en tránsito y reposo",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_004",
        name: "DLP avanzado",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_005",
        name: "Compliance total",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_006",
        name: "Auditoría de acceso a datos",
        required: true,
      },
    ],
    Arquitectura: [
      {
        domain: "Arquitectura",
        controlId: "arc_004",
        name: "Zero Trust completo",
        required: true,
      },
      {
        domain: "Arquitectura",
        controlId: "arc_005",
        name: "Geo-redundancia",
        required: true,
      },
      {
        domain: "Arquitectura",
        controlId: "arc_006",
        name: "Revisión de arquitectura por terceros",
        required: true,
      },
    ],
    Aplicación: [
      {
        domain: "Aplicación",
        controlId: "app_006",
        name: "SAST + DAST + SCA",
        required: true,
      },
      {
        domain: "Aplicación",
        controlId: "app_007",
        name: "Pentesting regular",
        required: true,
      },
      {
        domain: "Aplicación",
        controlId: "app_008",
        name: "Revisión de arquitectura de seguridad",
        required: true,
      },
    ],
    Infraestructura: [
      {
        domain: "Infraestructura",
        controlId: "inf_004",
        name: "Segmentación y microsegmentación",
        required: true,
      },
      {
        domain: "Infraestructura",
        controlId: "inf_005",
        name: "Hardening extremo",
        required: true,
      },
      {
        domain: "Infraestructura",
        controlId: "inf_006",
        name: "Monitores de integridad",
        required: true,
      },
    ],
    Integraciones: [
      {
        domain: "Integraciones",
        controlId: "int_005",
        name: "Auditoría y validación completa",
        required: true,
      },
      {
        domain: "Integraciones",
        controlId: "int_006",
        name: "Proxy de integraciones de seguridad",
        required: true,
      },
      {
        domain: "Integraciones",
        controlId: "int_007",
        name: "Segregación de redes por integración",
        required: true,
      },
    ],
    Monitoreo: [
      {
        domain: "Monitoreo",
        controlId: "mon_004",
        name: "Response automatizada",
        required: true,
      },
      {
        domain: "Monitoreo",
        controlId: "mon_005",
        name: "Honeypots y detección avanzada",
        required: true,
      },
      {
        domain: "Monitoreo",
        controlId: "mon_006",
        name: "Threat hunting",
        required: true,
      },
    ],
    Gobierno: [
      {
        domain: "Gobierno",
        controlId: "gov_003",
        name: "Plan de incidentes avanzado",
        required: true,
      },
      {
        domain: "Gobierno",
        controlId: "gov_005",
        name: "Auditoría externa anual",
        required: true,
      },
      {
        domain: "Gobierno",
        controlId: "gov_006",
        name: "Junta de seguridad",
        required: true,
      },
    ],
    IA: [],
  },

  AI_SYSTEM: {
    Identidad: [
      {
        domain: "Identidad",
        controlId: "id_004",
        name: "MFA para todos",
        required: true,
      },
      {
        domain: "Identidad",
        controlId: "id_005",
        name: "Biometría",
        required: true,
      },
    ],
    Datos: [
      {
        domain: "Datos",
        controlId: "dat_003",
        name: "Encriptación total",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_004",
        name: "DLP avanzado",
        required: true,
      },
      {
        domain: "Datos",
        controlId: "dat_007",
        name: "Anonimización / Pseudonimización",
        required: true,
        description: "Para datos de entrenamiento",
      },
    ],
    Arquitectura: [
      {
        domain: "Arquitectura",
        controlId: "arc_004",
        name: "Zero Trust",
        required: true,
      },
      {
        domain: "Arquitectura",
        controlId: "arc_007",
        name: "Arquitectura de seguridad para IA",
        required: true,
      },
    ],
    Aplicación: [
      {
        domain: "Aplicación",
        controlId: "app_006",
        name: "SAST + DAST + SCA",
        required: true,
      },
      {
        domain: "Aplicación",
        controlId: "app_007",
        name: "Pentesting",
        required: true,
      },
    ],
    Infraestructura: [
      {
        domain: "Infraestructura",
        controlId: "inf_004",
        name: "Segmentación",
        required: true,
      },
      {
        domain: "Infraestructura",
        controlId: "inf_006",
        name: "Monitores de integridad",
        required: true,
      },
    ],
    Integraciones: [
      {
        domain: "Integraciones",
        controlId: "int_005",
        name: "Auditoría de datos de entrada",
        required: true,
      },
    ],
    Monitoreo: [
      {
        domain: "Monitoreo",
        controlId: "mon_004",
        name: "Monitoreo modelo IA",
        required: true,
      },
      {
        domain: "Monitoreo",
        controlId: "mon_007",
        name: "Detección de inferencias adversarias",
        required: true,
      },
    ],
    Gobierno: [
      {
        domain: "Gobierno",
        controlId: "gov_007",
        name: "Gobernanza IA",
        required: true,
        description: "Explicabilidad, auditabilidad, fairness",
      },
      {
        domain: "Gobierno",
        controlId: "gov_008",
        name: "Responsable de IA",
        required: true,
      },
    ],
    IA: [
      {
        domain: "IA",
        controlId: "ai_001",
        name: "Validación de sesgo",
        required: true,
      },
      {
        domain: "IA",
        controlId: "ai_002",
        name: "Explicabilidad del modelo",
        required: true,
      },
      {
        domain: "IA",
        controlId: "ai_003",
        name: "Monitoreo de drift",
        required: true,
      },
      {
        domain: "IA",
        controlId: "ai_004",
        name: "Auditoría de decisiones",
        required: true,
      },
    ],
  },
};

/**
 * Get baseline controls for a specific profile
 */
export function getControlsForProfile(profile: RiskProfile): ControlRequirement[] {
  const profileControls = controlMatrix[profile];
  const allControls: ControlRequirement[] = [];

  Object.values(profileControls).forEach((domainControls) => {
    allControls.push(...domainControls);
  });

  return allControls;
}

/**
 * Get controls by domain for a profile
 */
export function getControlsByDomain(
  profile: RiskProfile,
  domain: ControlDomain
): ControlRequirement[] {
  return controlMatrix[profile][domain] || [];
}
