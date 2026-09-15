# Health & Lab Intake Dashboard

A professional, responsive dashboard for a healthcare/admin user to manage patient
health & lab intakes — view analytics, create new intakes through a step-by-step
questionnaire, resume in-progress intakes, and review completed records. Built as
a frontend-only React application (no backend) with `localStorage` persistence.

## Features

- **Dashboard** — summary cards (Total Intakes, Completed, In Progress, Average
  BMI) and three Recharts visualizations (blood sugar distribution, gender
  distribution, intakes over time), all computed dynamically from intake data.
- **Intakes** — a searchable-by-eye table of all patients with Patient, Gender,
  Age, Status, Date, BMI, and an Action column (`View` for completed, `Resume`
  for in-progress).
- **Step-by-step questionnaire** — one question per screen, with a progress bar,
  Back/Continue navigation, and per-field validation.
- **Conditional questions** — "Medication Details" only appears if the patient
  answers "Yes" to taking medication, driven entirely by a configuration object
  (no hardcoded `if/else` chains in the UI).
- **BMI auto-calculation** — computed the moment both height and weight are
  known, with category (Underweight / Normal / Overweight / Obese), reused
  everywhere BMI is shown (table, details, dashboard average).
- **Resume in-progress intakes** — answers and current question position are
  persisted after every step, so closing the modal and resuming later restores
  exactly where the patient left off.
- **View intake** — a clean, medical-record-style read-only summary of a
  completed intake.
- **Integrations page** — live lookup against the free REST Countries API with
  loading, error, and not-found states.
- **Resilient localStorage persistence** — corrupted or missing data never
  crashes the app; it falls back to seeded mock data.

## Tech Stack

- React 19 + Vite
- React Router (client-side routing)
- Recharts (bar / pie / line charts)
- Plain CSS (CSS variables, no framework)
- `localStorage` for persistence — no backend

## Project Structure

```
src/
  components/
    Layout/          Sidebar + Header + <Outlet /> shell
    Sidebar/          Left navigation, highlights active route
    Header/           Top bar, page title, mobile menu toggle
    SummaryCard/       Reusable dashboard stat card
    IntakeTable/       Patient table (responsive -> stacked cards on mobile)
    IntakeModal/       Modal wrapper around the Questionnaire
    Questionnaire/     One-question-at-a-time engine (state, navigation, submit)
    QuestionRenderer/  Renders a single question by `type` (text/number/select)
    ProgressBar/       Progress indicator
    IntakeDetails/     Medical-record-style read-only summary (used by View
                       and by the questionnaire's final confirmation step)
    Charts/            BloodSugarBarChart, GenderPieChart, IntakesOverTimeChart
    EmptyState/        Reusable "nothing here" placeholder
    Loading/           Reusable spinner/message
    Modal/             Generic overlay + dialog shell
  pages/
    Dashboard/         Summary cards + charts
    Intakes/           Table + Start New Intake + View/Resume modals
    Integrations/      REST Countries search UI
  context/
    IntakesContext.jsx Global intake state, backed by localStorage
  data/
    questions.js        Configuration-driven question definitions
    mockIntakes.js       ~10 seeded mock patients
  utils/
    bmi.js               BMI + category calculation
    storage.js           localStorage read/write with corruption guards
    analytics.js         calculateAnalytics(intakes) -> dashboard numbers
    questionnaireEngine.js  shouldShowQuestion / getVisibleQuestions / validateAnswer
    id.js                 Unique ID generator
  App.jsx
  main.jsx
```

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## Build

```bash
npm run build
```

Output is written to `dist/`. Preview the production build with `npm run preview`.

## API Used

**[REST Countries](https://restcountries.com/)** (`v3.1/name/{name}`) — a free,
public API that requires no API key. Used on the Integrations page to search for
a country and display its name, capital, region, population, languages,
currencies, and flag. Handles loading, network/HTTP errors, and "not found"
(404) responses distinctly.

## localStorage

All intake data (both completed and in-progress) lives under a single key,
`hli_intakes_v1`, managed by `src/utils/storage.js`:

- On startup, the app tries to read and `JSON.parse` this key.
- If the key is missing, empty, or the parsed value isn't an array (corrupted
  data), the app silently falls back to the seeded mock dataset — it never
  throws or shows a blank screen.
- Every time the intake list changes (new intake started, draft answer saved,
  intake submitted), the full array is written back to `localStorage` via a
  `useEffect` in `IntakesContext`.
- Because in-progress intakes are stored in the same array as completed ones
  (just with `status: "In Progress"` and a `currentQuestionId` pointer), no
  separate "draft" store is needed — resuming just re-opens the questionnaire
  with that intake's saved answers and position.

## BMI Calculation

```
BMI = weight (kg) / (height (m))²
```

Implemented in `src/utils/bmi.js`:

- `calculateBMI(weightKg, heightCm)` — returns `null` until both values are
  present and valid; otherwise returns the BMI rounded to 1 decimal place.
- `getBMICategory(bmi)` — maps the number to **Underweight** (`< 18.5`),
  **Normal** (`18.5–24.9`), **Overweight** (`25–29.9`), or **Obese** (`>= 30`).

BMI is computed live inside the questionnaire (visible on the final review
step as soon as height & weight are answered) and is never hardcoded — the
same two functions back the Intakes table, the View/confirmation details, and
the Dashboard's "Average BMI" card.

## Conditional Questionnaire Implementation

Questions are defined once, declaratively, in `src/data/questions.js`. Each
question is a plain object with `id`, `question`, `type`, `required`, and
optionally `options`, `unit`, `min`/`max`, or a `condition`:

```js
{
  id: "medicationDetails",
  question: "Please list the medication(s) you are taking.",
  type: "text",
  required: true,
  condition: { field: "medication", equals: "Yes" },
}
```

`src/utils/questionnaireEngine.js` is the only place that interprets
`condition`:

```js
export function shouldShowQuestion(question, answers) {
  if (!question.condition) return true;
  const { field, equals } = question.condition;
  return answers[field] === equals;
}

export function getVisibleQuestions(questions, answers) {
  return questions.filter((q) => shouldShowQuestion(q, answers));
}
```

The `Questionnaire` component never branches on specific question IDs — it
recomputes `getVisibleQuestions(QUESTIONS, answers)` on every render and steps
through that list positionally. Adding a new conditional question later means
adding one object to `questions.js`; no component changes are required.
Validation is similarly centralized in `validateAnswer(question, value)`,
which required-checks, then applies type-specific rules (numeric bounds for
`number`, membership for `select`).

## Future Improvements

- Multi-user support with real authentication and a backend API instead of
  `localStorage`.
- Editing/deleting existing intakes from the table.
- Exporting intake records (PDF/CSV) for clinical record-keeping.
- Search/filter/sort controls on the Intakes table.
- Automated tests (unit tests for `bmi.js` / `analytics.js` / the
  questionnaire engine, and component tests for the questionnaire flow).
- Debounced/typeahead country search on the Integrations page.
