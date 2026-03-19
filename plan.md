# Implementation Plan: PCRS Risk Assessment Wizard

## Project Overview
Build a Single Page Application (SPA) in TypeScript + React + Bootstrap that implements a risk assessment wizard with conditional sections, automated risk profile computation, and localStorage persistence.

---

## Phase 1: Project Setup & Dependencies

### Step 1.1: Setup Project Structure
- [ ] Initialize basic TypeScript React project (already partially done)
- [ ] Install required dependencies:
  - `bootstrap` (v5.3+)
  - `react-bootstrap` (UI components)
  - `typescript` (already installed)
  - `uuid` (generate assessment IDs)
  - `lodash-es` (utility functions)
- [ ] Create folder structure:
  ```
  /src
    /app
    /config
    /domain
    /ui
      /components
      /pages
    /utils
  ```

### Step 1.2: Configure Bootstrap & React
- [ ] Import Bootstrap CSS in `index.css`
- [ ] Setup Bootstrap container layout
- [ ] Create base layout component (Header, Footer, Navigation)

---

## Phase 2: Data Model & Types

### Step 2.1: Define Core TypeScript Types
- [ ] Create `domain/types.ts` with:
  - `RiskProfile` type (LOW_TOOL | BUSINESS | EXTERNAL_PLATFORM | CRITICAL | AI_SYSTEM)
  - `Assessment` interface (id, version, createdAt, updatedAt, answers, computed)
  - `ComputedResult` interface (riskProfile, inherentRiskRange, controlsBaseline, flags, rationale)
  - `ControlRequirement` interface (domain, controlId, name, required)
  - `Question` interface (id, section, question, type, options, conditional logic)
  - `Section` interface (id, name, description, questions)

### Step 2.2: Define Configuration Files
- [ ] Create `config/questions.ts`:
  - Define all survey sections and questions
  - Include conditional visibility logic for each question
  - Sections: General/Identification, Initial Characterization (gates), then conditional sections (IA, Integrations, External Users, IoT/OT)
  
- [ ] Create `config/controls.ts`:
  - Define baseline control matrix (5 profiles × 8 domains)
  - Map each profile to required controls
  
- [ ] Create `config/thresholds.ts`:
  - Define decision thresholds for risk profile assignment
  - Define inherent risk ranges per profile
  - Define gate conditions (primary gates for conditional sections)

---

## Phase 3: Core Business Logic

### Step 3.1: Rules Engine
- [ ] Create `domain/rulesEngine.ts`:
  - Implement function to evaluate conditional visibility of questions/sections
  - Check gate conditions based on answers
  - Build rule evaluation chain
  - Track rules fired (for rationale)

### Step 3.2: Risk Profile Computation
- [ ] Create `domain/computeProfile.ts`:
  - Implement function to determine risk profile based on answers
  - Apply decision tree logic from survey-spec
  - Return assigned profile and rationale

### Step 3.3: Baseline Controls Computation
- [ ] Create `domain/computeBaseline.ts`:
  - Implement function to determine required controls per domain
  - Generate control baseline matrix based on assigned profile
  - Include profile-specific controls

### Step 3.4: Flags & Alerts Computation
- [ ] Create `domain/computeFlags.ts`:
  - Implement function to check mandatory conditions (security architecture review, etc.)
  - Generate alerts based on profile and answers
  - Build flag rationale

---

## Phase 4: State Management & Persistence

### Step 4.1: localStorage Repository
- [ ] Create `utils/localStorageRepo.ts`:
  - `createAssessment()` - create new assessment with uuid
  - `saveAssessment(assessment)` - persist to localStorage with debounce
  - `loadAssessment(id)` - retrieve assessment by id
  - `listAssessments()` - get all assessment summaries
  - `deleteAssessment(id)` - remove assessment
  - `getLastAssessmentId()` - retrieve last worked-on assessment
  - `setLastAssessmentId(id)` - save last assessment id

### Step 4.2: Application Store
- [ ] Create `app/store.ts` (Context or Zustand):
  - Global state for current assessment
  - State for computed results
  - Actions: loadAssessment, updateAnswer, computeResults, saveAssessment
  - Auto-save listener with 300-500ms debounce

---

## Phase 5: UI Components

### Step 5.1: Layout Components
- [ ] Create `ui/components/Header.tsx`:
  - Title, navigation breadcrumb
  
- [ ] Create `ui/components/SummarySidebar.tsx`:
  - Progress indicator
  - Section list with completion status
  - Quick navigation to sections

### Step 5.2: Form Components
- [ ] Create `ui/components/QuestionRenderer.tsx`:
  - Render different question types (text, select, radio, checkbox, textarea)
  - Handle answer changes
  - Show conditional help text
  
- [ ] Create `ui/components/Wizard.tsx`:
  - Section-by-section navigation
  - Display current section questions
  - Previous/Next buttons
  - Validation feedback

### Step 5.3: Results Components
- [ ] Create `ui/components/ResultsView.tsx`:
  - Display assigned risk profile
  - Show inherent risk range
  - Display baseline controls by domain
  - Show alerts/flags with explanations
  - Export and Print buttons

### Step 5.4: Utility Components
- [ ] Create `ui/components/ProgressBar.tsx`:
  - Visual progress through sections
  
- [ ] Create `ui/components/AlertBanner.tsx`:
  - Display validation errors, warnings, or mandatory requirements

---

## Phase 6: Pages

### Step 6.1: Home Page
- [ ] Create `ui/pages/Home.tsx`:
  - "New Assessment" button → create assessment, start wizard
  - "Continue Last Assessment" → load last assessment, resume wizard
  - "My Saved Assessments" → list all with edit/delete options
  - "Import JSON" → file upload handler
  - "Delete All" → clear all with confirmation

### Step 6.2: Form/Wizard Page
- [ ] Create `ui/pages/Form.tsx`:
  - Load Wizard component
  - Load SummarySidebar component
  - Layout with sidebar + main form area
  - Handle navigation between sections
  - Auto-save on answer changes

### Step 6.3: Results Page
- [ ] Create `ui/pages/Result.tsx`:
  - Load ResultsView component
  - Show risk profile assignment
  - Display baseline controls
  - Show alerts
  - Export/Print functionality

---

## Phase 7: Routing

### Step 7.1: Application Router
- [ ] Create `app/router.ts`:
  - Route definitions:
    - `/` → Home
    - `/form/:id` → Form page (or `/form` with assessment from store)
    - `/result/:id` → Result page
    - `/404` → Not found
  - Implement route guards (e.g., assessment must exist)

### Step 7.2: Navigation
- [ ] Create Navigation component with links to pages
- [ ] Implement browser history handling

---

## Phase 8: Export/Import & Persistence

### Step 8.1: Export Functionality
- [ ] Create `utils/exportImport.ts`:
  - `exportToJSON(assessment)` - download assessment as JSON file
  - `prepareForPrint(assessment)` - format for browser print/PDF
  - `generatePrintView()` - HTML layout for printing

### Step 8.2: Import Functionality
- [ ] Implement file upload handler
- [ ] Validate imported JSON structure
- [ ] Generate new ID, preserve data
- [ ] Auto-compute results for imported assessment

---

## Phase 9: Validation & Error Handling

### Step 9.1: Form Validation
- [ ] Implement section-level validation (all required fields filled)
- [ ] Show validation errors before allowing next section
- [ ] Display helpful error messages

### Step 9.2: Error Boundaries
- [ ] Wrap major sections with error boundaries
- [ ] Implement graceful error handling for localStorage failures
- [ ] Add user-friendly error messages

---

## Phase 10: Styling & UX Polish

### Step 10.1: Bootstrap Integration
- [ ] Apply Bootstrap classes (Button, Form, Container, Row, Col, etc.)
- [ ] Implement consistent spacing and sizing
- [ ] Create custom CSS for specific styling needs

### Step 10.2: Responsive Design
- [ ] Ensure wizard works on mobile (sidebar collapsible)
- [ ] Test form layout on different screen sizes
- [ ] Optimize touch interactions for mobile

### Step 10.3: User Feedback
- [ ] Add loading states (during computation, saving)
- [ ] Add success notifications (assessment saved, exported)
- [ ] Add confirmation dialogs for destructive actions

---

## Phase 11: Testing

### Step 11.1: Unit Tests
- [ ] Test rules engine logic
- [ ] Test profile computation
- [ ] Test baseline controls computation
- [ ] Test flags/alerts generation

### Step 11.2: Integration Tests
- [ ] Test store actions (create, save, load, delete)
- [ ] Test localStorage persistence
- [ ] Test question visibility conditions

### Step 11.3: Component Tests
- [ ] Test form validation
- [ ] Test navigation between sections
- [ ] Test export/import functionality

---

## Phase 12: Deployment

### Step 12.1: Build & Optimization
- [ ] Verify production build works (`npm run build`)
- [ ] Test bundle size
- [ ] Optimize assets

### Step 12.2: Browser Testing
- [ ] Test localStorage functionality
- [ ] Test on multiple browsers
- [ ] Verify print/PDF export works

---

## Implementation Order (Recommended Sequence)

1. **Setup & Types** (Phases 1-2) - Foundation
2. **Business Logic** (Phase 3) - Core computation
3. **Store & Persistence** (Phase 4) - Data management
4. **Pages** (Phase 6) - Container pages first
5. **Components** (Phase 5) - Build up from atomic components
6. **Routing** (Phase 7) - Connect pages
7. **Export/Import** (Phase 8) - Data portability
8. **Validation** (Phase 9) - Input safety
9. **Styling** (Phase 10) - Polish
10. **Testing** (Phase 11) - Quality assurance
11. **Deployment** (Phase 12) - Release

---

## Key Decisions Pending

- [ ] Use React Context + useReducer or Zustand for state management?
- [ ] Use React Router for navigation?
- [ ] Include unit tests from start or after MVP?
- [ ] Print page layout strategy (custom CSS or HTML template)?
- [ ] localStorage size limit handling (when too many assessments)?

---

## Success Criteria

- All wizard sections render correctly
- Conditional sections appear/hide based on gate answers
- Risk profile assignment matches decision tree
- Auto-save works without user action
- Export/import preserves assessment data
- Results page displays all required information
- Mobile/responsive design works
- No errors in browser console

