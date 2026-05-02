Continue implementing the system-architecture change.

Take the next pending task from tasks.md and execute it.

## Technology Stack
- Backend: Python 3.8+, FastAPI, uvicorn, Pydantic v2
- Frontend: React 18+, Vite, JavaScript (JSX), CSS modules
- Package managers: pnpm (frontend), uv (backend)
- Communication: HTTP/JSON via native fetch

## Project Conventions
- Backend structure: backend/app/main.py, models.py, routes.py, services/calculator.py
- Frontend structure: frontend/src/components/, frontend/src/services/api.js
- Backend runs on port 8000, frontend on port 5173
- CORS configured for http://localhost:5173
- Environment variables in .env files (using .env.example as a template)

## Implementation Rules
- Minimal changes focused on the current task
- Mark the task as completed: `- [ ]` → `- [x]` in tasks.md upon completion
- If a task is ambiguous, pause and ask before deploying
- If a design issue is discovered, pause and notify
- Continue with the next task without waiting for confirmation (unless there is a blocker)

## Artifact Context
Read before deploying:
- openspec/changes/system-architecture/proposal.md
- openspec/changes/system-architecture/design.md
- openspec/changes/system-architecture/specs/**/*.md
- openspec/changes/system-architecture/tasks.md
