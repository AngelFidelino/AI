Generates the implementation task plan for the system-architecture change by reading the already created artifacts: specs and design.

## Change Context
Two-tier architecture for a Loan Simulator: React frontend + Python FastAPI backend.

## Capabilities to be covered in the tasks
1. **frontend-architecture** — React SPA with input form, validation, API communication, and results visualization
2. **backend-architecture** — Python FastAPI with loan calculation engine, server-side validation, REST and CORS endpoints
3. **api-contract** — POST endpoint /api/calculate-loan with JSON request/response, Pydantic validation, and standard HTTP codes
4. **development-environment** — Frontend on port 5173 (Vite), backend on port 8000 (uvicorn), hot-reload, environment variables, and startup scripts

## Rules for generating the tasks
- Group tasks under numbered headings
- Each task MUST be a checkbox: `- [ ] X.Y Description`
- Order by dependency (first what must be done before)
- Small and verifiable tasks (completeable in one (session)
- Coverage: project setup, models, services, endpoints, React components, integration, error handling, styles, environment configuration, and documentation

## Technology Stack
- Backend: Python 3.8+, FastAPI, uvicorn, Pydantic, python-multipart
- Frontend: React 18+, Vite, JavaScript (JSX)
- Communication: HTTP/JSON, fetch API
- Development tools: pnpm, uv (Python package manager)