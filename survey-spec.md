1) Objetivo del producto (Frontend-only)
Construir una SPA (Single Page App) en TypeScript + Bootstrap que permita:

Completar un wizard con secciones:

Preguntas generales / identificación
Caracterización inicial (gates primarios)
Secciones condicionales (IA, Integraciones, Usuarios externos, IoT/OT, etc.) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]


Calcular automáticamente:

Perfil de riesgo tecnológico (5 perfiles)
Rango típico de riesgo inherente por perfil
Baseline mínimo de controles por perfil (8 dominios) [Logica_evaluación_v2 | Word]


Guardar y recuperar la evaluación desde localStorage (sin backend).
Exportar/importar JSON y generar vista imprimible (print/PDF vía navegador).


2) Alcance funcional (MVP)
2.1 Pantallas
A. Home

“Nueva evaluación”
“Continuar última evaluación”
“Mis evaluaciones guardadas” (lista)
“Importar JSON”
“Borrar todo”

B. Wizard / Formulario

Navegación: Anterior / Siguiente
Validación por sección
Progreso (ej. 10 secciones)
“Guardar borrador” (implícito: auto-save en localStorage)

C. Resultado

Perfil asignado + explicación de por qué (reglas disparadas)
Rango típico de riesgo inherente por perfil [Logica_evaluación_v2 | Word]
Baseline de controles por dominio (y controles IA si aplica) [Logica_evaluación_v2 | Word]
Alertas/gates (ej. “Security Architecture Review obligatoria cuando …”) [Logica_evaluación_v2 | Word]
Export JSON / Imprimir


3) Estructura del proyecto (propuesta técnica — recomendada)

Sugerencia (no es requisito del documento): Vite + TypeScript + Bootstrap 5 + Vitest para unit tests.

/src
  /app
    router.ts
    store.ts
  /config
    questions.ts        // definición secciones/preguntas + visibilidad
    controls.ts         // matriz baseline de controles por perfil
    thresholds.ts       // umbrales parametrizables (ej. dato “importante”)
  /domain
    types.ts
    rulesEngine.ts
    computeProfile.ts
    computeBaseline.ts
    computeFlags.ts
  /ui
    components/
      Wizard.ts
      QuestionRenderer.ts
      SummarySidebar.ts
      ResultsView.ts
    pages/
      Home.ts
      Form.ts
      Result.ts
  /utils
    localStorageRepo.ts
    exportImport.ts
/index.html


4) Modelo de datos (TypeScript)
4.1 Tipos base
TypeScriptexport type RiskProfile =  | "LOW_TOOL"  | "BUSINESS"  | "EXTERNAL_PLATFORM"  | "CRITICAL"  | "AI_SYSTEM";export interface Assessment {  id: string;              // uuid  version: number;         // schema version (para migraciones)  createdAt: string;       // ISO  updatedAt: string;       // ISO  answers: Record<string, any>;  computed: ComputedResult;}export interface ComputedResult {  riskProfile: RiskProfile;  inherentRiskRange: { min: number; max: number };  controlsBaseline: ControlRequirement[];  flags: {    securityArchitectureReviewRequired: boolean;    reasons: string[];  };  rationale: string[]; // trazabilidad de reglas (ej. "Q6=Sí => AI_SYSTEM")}export interface ControlRequirement {  domain:    | "Identidad"    | "Datos"    | "Arquitectura"    | "Aplicación"    | "Infraestructura"    | "Integraciones"    | "Monitoreo"    | "Gobierno"    | "IA";  controlId: string;  name: string;  required: boolean;}``Mostrar más líneas

5) Persistencia en localStorage (requisito)
5.1 Claves y formato
Definir un repositorio que use 3 keys:

pcrs.assessments.index → array de { id, updatedAt, name }
pcrs.assessment.<id> → el objeto Assessment completo
pcrs.lastAssessmentId → string

Ejemplo (index):
JSON[  { "id": "uuid-1", "updatedAt": "2026-03-18T16:10:00Z", "name": "Proyecto X" }]Mostrar más líneas
5.2 Reglas de guardado

Auto-save: al cambiar una respuesta → persistir evaluación (debounce 300–500ms).
Mantener updatedAt al guardar.
Límite sugerido: permitir borrar una evaluación y limpiar su key.

5.3 Versionado y migración

Assessment.version = 1 en MVP.
Implementar migrate(assessment) si en el futuro cambian IDs de preguntas o estructura.


6) Configuración “data-driven” (preguntas, secciones, visibilidad)
La app debe definir preguntas y secciones en config (TS o JSON), con condiciones para mostrar/ocultar secciones, replicando los “saltos” del árbol PCRS. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
6.1 Secciones mínimas (MVP) y origen
Estas secciones están explícitas en Logica_evaluación_v2:

Identificación del proyecto (Q1–Q2) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Caracterización Inicial / gates primarios (Q3–Q7) [Logica_evaluación_v2 | Word]
Contexto de negocio y regulación (Q8–Q9) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Arquitectura de acceso (Q10 + subpreguntas condicionales) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Integraciones (Q11 + 5A Q12–Q14) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Usuarios (Q15–Q16 + 6A Q17) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Sourcing (Q18) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
IA (Q19–Q20) solo si aplica [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
IoT/OT (Q21–Q22) solo si aplica [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Impactos (Q23–Q26) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]

6.2 Reglas de visibilidad (obligatorias)
Implementar exactamente los “saltos” descritos:

Si IA = No ⇒ no preguntar ISO 42001, tipo IA ni “decisiones sobre personas” (en MVP: ocultar sección IA). [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Si IoT/OT = No aplica ⇒ ocultar módulo IoT/OT. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Si Integraciones = Ninguna ⇒ ocultar detalle (tipo/dirección/sensibilidad). [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Si Usuarios = solo internos ⇒ ocultar identidad externa. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Si Tipo de solución = SaaS ⇒ forzar foco en tercero/sourcing (en MVP: mostrar warning si sourcing no es “SaaS operado por tercero”). [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]


7) Motor de reglas (branching) + Re-cálculo dinámico
7.1 Evaluación de expresiones
Implementar un evaluador simple (AND/OR/NOT + comparadores EQ/IN/GT, etc.) para visibilityRule.
7.2 Re-cálculo en vivo
Cada vez que cambia una respuesta:

recalcular perfil
recalcular rango
recalcular baseline de controles
recalcular flags (gates)
persistir en localStorage


8) Cálculos (lógica de negocio)
8.1 Perfil de riesgo tecnológico (árbol simplificado)
Implementar la prioridad definida:

Si usa IA → AI-Driven System [Logica_evaluación_v2 | Word]
Si es crítico para operación → Critical Infrastructure [Logica_evaluación_v2 | Word]
Si tiene usuarios externos o acceso web → External Digital Platform [Logica_evaluación_v2 | Word]
Si maneja datos internos importantes → Business System [Logica_evaluación_v2 | Word]
Caso contrario → Low-Risk Digital Tool [Logica_evaluación_v2 | Word]


Nota: “usuarios externos” se responde en Q15 y “acceso web” en Q10, por lo que el perfil debe recalcularse al completar esas secciones. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]

8.2 Rango típico de riesgo inherente (por perfil)
Mapeo directo:

Low tool: 0–25 [Logica_evaluación_v2 | Word]
Business: 20–45 [Logica_evaluación_v2 | Word]
External: 40–70 [Logica_evaluación_v2 | Word]
Critical: 60–85 [Logica_evaluación_v2 | Word]
AI: 65–90 [Logica_evaluación_v2 | Word]

(El documento menciona “cálculo riesgo inherente”, pero no detalla fórmula numérica; en MVP se usa el rango típico por perfil como salida.) [Logica_evaluación_v2 | Word], [PCRS_PGRSI...uia_de_Uso | Word]
8.3 Baseline mínimo de controles (por perfil)

Implementar matriz por dominio y perfil basada en la “Matriz de controles mínimos … (8 dominios)” [Logica_evaluación_v2 | Word]
Si IA aplica, incluir controles específicos IA (trazabilidad, datasets, sesgos, explicabilidad, supervisión humana). [Logica_evaluación_v2 | Word]

8.4 Flags/Gates de “Security Architecture Review obligatoria”
Mostrar alerta si aplica cualquiera condición explicitada:

Riesgo inherente > 70 [Logica_evaluación_v2 | Word]
IA que toma decisiones sobre personas [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Datos confidenciales nivel máximo [Logica_evaluación_v2 | Word]
Integraciones críticas con terceros [Logica_evaluación_v2 | Word]


9) UI/UX (Bootstrap) — requisitos concretos
9.1 Wizard

Un “stepper” o lista de secciones a la izquierda (con estado: pendiente / ok)
Panel central con preguntas
Panel derecho opcional “Resumen en vivo” (perfil + flags)

9.2 Validaciones

Requeridos: no permitir “Siguiente” si faltan
Tipos:

numérico: solo números, rango 1–5 en impactos (Q23–Q26) [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
texto: límites sugeridos (no obligatorio)



9.3 Acciones

Botón “Guardar” (opcional, porque auto-save)
“Reiniciar evaluación”
“Exportar JSON”
“Imprimir”


10) Export/Import (Frontend-only)
10.1 Export

Descargar assessment.json con:

answers + computed + timestamps + version



10.2 Import

Validar schema version
Importar como nueva evaluación (nuevo id) o reemplazar (según opción)


11) Criterios de aceptación (QA testable)
Branching (saltos)

Q6=No ⇒ no aparece Sección IA. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Q7=No aplica ⇒ no aparece Sección IoT/OT. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Q11=Ninguna ⇒ no aparece Sección 5A. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Q15=Solo internos ⇒ no aparece Sección 6A. [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]

Perfil

IA=Sí ⇒ perfil AI_SYSTEM. [Logica_evaluación_v2 | Word]
IA=No + Criticidad=Crítico ⇒ perfil CRITICAL. [Logica_evaluación_v2 | Word]
IA=No + no crítico + Usuarios=externos ⇒ perfil EXTERNAL_PLATFORM. [Logica_evaluación_v2 | Word]

Rango inherente

Perfil AI_SYSTEM ⇒ rango 65–90. [Logica_evaluación_v2 | Word]

Persistencia

Cambiar una respuesta ⇒ al recargar página, el valor se recupera desde localStorage.


12) Entregables concretos para el agente

Repositorio con SPA (TS + Bootstrap)
Config de preguntas con IDs estables (Q1…Q26) según Logica_evaluación_v2 [Logica_evaluación_v2 | Word], [Logica_evaluación_v2 | Word]
Motor de reglas para visibilidad (saltos)
Funciones puras:

computeRiskProfile()
computeInherentRange()
computeControlsBaseline()
computeFlags()


localStorageRepo (index + CRUD evaluaciones + migración)
Vista de resultados + export/import + print styles
Unit tests mínimos de reglas/perfil/branching