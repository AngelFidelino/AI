## Context

This is a new loan simulator application being built from scratch as an educational proof of concept. The application will demonstrate a clean two-tier architecture with a React frontend and Python backend for financial calculations. The system must be stateless with no database persistence, focusing on educational value and architectural best practices.

## Goals / Non-Goals

**Goals:**
- Create a clean, maintainable two-tier architecture
- Implement accurate loan calculations with amortization schedules
- Demonstrate proper separation of concerns between frontend and backend
- Establish a clear API contract with proper validation
- Enable educational learning about client-server communication

**Non-Goals:**
- Database integration or data persistence
- User authentication or authorization
- Production deployment optimization
- Mobile application support
- Real-time features or WebSockets
- Complex financial products beyond basic loans

## Decisions

**Frontend Framework: React**
- Rationale: Component-based architecture, strong ecosystem, excellent for educational purposes
- Alternative considered: Vue.js (simpler learning curve but smaller ecosystem)

**Backend Framework: Python with FastAPI**
- Rationale: Modern API framework with automatic documentation, type hints, better developer experience for API-first development
- Alternative considered: Flask (less DX for API-first, no auto-docs)

**Communication: REST API with JSON**
- Rationale: Stateless protocol matches requirements, universal support, easy to debug
- Alternative considered: GraphQL (unnecessary complexity for limited query needs)

**Development Ports: Frontend 5173, Backend 8000**
- Rationale: Standard development ports, avoid conflicts, clear separation
- Alternative considered: Same port with proxy (added complexity for PoC)

**Frontend Build Tool: Vite + React 18**
- Rationale: Fast development server, optimized build, modern tooling
- Alternative considered: Create React App (slower server, more complex configuration)

**Backend Server: Uvicorn**
- Rationale: ASGI server for FastAPI, provides auto-reload for development
- Alternative considered: Gunicorn (better for production, more setup complexity)

**CORS Configuration: Permissive for localhost**
- Rationale: Simplify development workflow for single developer
- Alternative considered: Strict origin policy (unnecessary overhead for educational project)

**Stateless Design**
- Rationale: Matches PoC requirements, eliminates database complexity
- Alternative considered: Session storage (adds unnecessary state management)

## Risks / Trade-offs

**Performance Risk: Python startup time** → Mitigation: Use FastAPI with uvicorn for optimal performance
**Cross-platform Risk: macOS-specific assumptions** → Mitigation: Use standard tools that work across platforms
**Educational Complexity Risk: Too much architecture for beginner** → Mitigation: Clear documentation, modular design
**API Security Risk: No authentication** → Acceptable for PoC scope, clearly documented as non-production
**Validation Risk: Input validation gaps** → Comprehensive validation on both frontend and backend