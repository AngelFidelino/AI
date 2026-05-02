Change Name: system-architecture


## Proposal (Executive Summary)
Design a two-tier client-server architecture with a React frontend and a Python backend communicating via REST API over HTTP.

## Capabilities to Specify

### 1. frontend-architecture
React SPA handling user input, client-side validation, API communication, and results display.

Requirements:
- The app MUST be implemented as a React SPA
- It MUST provide a form with the following fields: loan amount, interest rate, term
- It MUST validate client-side inputs before sending to the API
- WHEN the user sends valid parameters, THEN the frontend sends a POST request to the backend with JSON
- WHEN the backend returns results, THEN it displays the monthly payment and amortization table
- WHEN the backend returns an error, THEN it displays a user-friendly error message
- WHEN a network failure occurs, THEN it displays a connection error message
- It MUST run on port 5173 using Vite in development mode

### 2. Backend Architecture
Python server that manages loan calculations, server-side validation, API endpoints, and response formatting.

Requirements:
- The backend MUST be implemented in Python 3.8+
- It MUST implement the monthly payment calculation algorithm
- It MUST generate a complete amortization table (principal, interest, balance per period)
- When it receives invalid parameters, it MUST return a validation error with details
- When it receives incorrect data types, it MUST return a 400 Bad Request
- When a POST request reaches /api/calculate-loan, it MUST process and return the results
- When the calculation is successful, it MUST return JSON with the monthlyPayment and installments array
- When the loan amount is below the minimum, it MUST reject the request with a validation error
- It MUST run on port 8000 with auto-reload in development mode
- It MUST enable CORS to accept requests from the frontend server

### 3. api-contract
REST API contract that defines endpoints, request/response formats, and the communication protocol between layers.

Requirements:
- The API MUST follow REST principles
- The API MUST use JSON for all payloads
- It MUST expose the POST endpoint `/api/calculate-loan`
- WHEN the client sends a request with `amount`, `rate`, and `term`, THEN the backend accepts and processes it
- WHEN a required parameter is missing, THEN it returns a 400 Bad Request with error details
- WHEN the calculation is successful, THEN the response includes `monthlyPayment` and an array of installments
- WHEN the calculation is successful, THEN each installment includes: `period`, `principal`, `interest`, and `balance`
- WHEN the calculation completes successfully, THEN it returns an HTTP 200
- WHEN validation fails, THEN it returns an HTTP 400
- WHEN an unexpected error occurs, THEN it returns an HTTP 500
- WHEN an error occurs, THEN the response includes an error field with a descriptive message
- Each calculation request is independent (no session state)

### 4. Development Environment
Development setup with Frontend on port 5173 and backend on port 8000, including CORS configuration.

Requirements:
- The environment MUST run separate servers for frontend and backend
- Frontend MUST run on port 5173 using Vite
- Backend MUST run on port 8000 using uvicorn
- WHEN frontend makes a request to the backend under development, THEN backend includes CORS headers
- Backend MUST allow requests from http://localhost:5173
- MUST support hot reload on both frontend (Vite) and backend (uvicorn --reload)
- The base API URL MUST be read from an environment variable on the frontend
- WHEN `npm run dev` is executed, THEN frontend starts on port 5173
- WHEN the backend command is executed, THEN server starts on port 8000
- MUST provide .env.example files for frontend and backend
- MUST provide simple startup scripts for both servers

## Design Decisions
- **Architecture**: Two-tier client-server (React + Python) — discarded alternatives: monolithic Flask + Jinja2 (doesn't meet React requirements), Pure React client-side (doesn't meet Python backend requirements)
- **Backend framework**: FastAPI — discarded alternative: Flask (less DX for API-first, no auto-docs)
- **Frontend build tool**: Vite + React 18 — discarded alternative: CRA (slower server, more complex configuration)
- **Communication pattern**: Stateless request-response — reason: no session management, scalable, testable in isolation