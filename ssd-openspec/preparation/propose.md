Change name: system-architecture

I want to design the base architecture for a loan simulator application as a proof of concept (PoC).

## Context
- New application, no existing code
- Single developer
- No database requirements (stateless calculations)
- Educational purpose with an emphasis on clean architecture

## Restrictions
- The backend MUST be Python (loan calculation logic)
- The frontend MUST be React (user interface)
- Development environment: macOS with standard tools
- No authentication or persistence for the Proof of Concept (PoC)

## What I want to build
A two-tier client-server architecture where:
- The React frontend collects loan parameters (amount, interest rate, term), validates them, and displays the results
- The Python backend calculates the monthly payment and generates the amortization table (principal, interest, balance per period)
- Communication between layers is via REST API with JSON over HTTP
- The pattern is stateless request-response (each calculation is independent)

## Required capabilities
- Frontend architecture: A React SPA that handles user input, validation, API communication, and Visualization of results
- Backend architecture: Python server that manages loan calculations, validation, API endpoints, and response format
- API contract: REST API contract defining endpoints, request/response formats, and communication protocol
- Development environment: Development setup with frontend on port 5173 and backend on port 8000, including CORS configuration

## Non-goals
- Database integration or persistence
- Authentication or authorization
- Production configuration
- Microservices
- Real-time communication (WebSockets)
- Mobile application support