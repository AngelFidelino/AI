## 1. Project Setup

- [x] 1.1 Create project root directory structure with frontend and backend folders
- [x] 1.2 Initialize React 18+ frontend project with Vite on port 5173 using pnpm
- [x] 1.3 Initialize Python 3.8+ FastAPI backend project on port 8000 using uv package manager
- [x] 1.4 Configure FastAPI with uvicorn for development auto-reload
- [x] 1.5 Configure CORS in FastAPI for localhost:5173
- [x] 1.6 Install required dependencies: FastAPI, Pydantic, python-multipart, uvicorn
- [x] 1.7 Create .env.example files for frontend and backend
- [x] 1.8 Create startup scripts for both frontend and backend
- [x] 1.9 Create development README with setup and run instructions

## 2. Backend Models and Services

- [x] 2.1 Set up FastAPI application structure with proper routing
- [x] 2.2 Create Pydantic models for request (LoanRequest with amount, rate, term) and response (LoanResponse with monthlyPayment, installments)
- [x] 2.3 Implement loan calculation engine with standard loan formula separate from routing logic
- [x] 2.4 Implement amortization schedule generation service class
- [x] 2.5 Add comprehensive input validation using FastAPI/Pydantic for loan parameters (amount, rate, term)
- [x] 2.6 Implement minimum loan amount validation logic

## 3. Backend API Endpoints

- [x] 3.1 Create /api/calculate-loan POST endpoint with JSON request/response handling
- [x] 3.2 Add error handling and proper HTTP status codes (200, 400, 500)
- [x] 3.3 Implement server-side validation with detailed error messages
- [x] 3.4 Configure uvicorn server with auto-reload for development
- [x] 3.5 Add CORS middleware for localhost:5173

## 4. Frontend Components

- [x] 4.1 Create React component structure (App, LoanForm, Results, ErrorMessage)
- [x] 4.2 Build loan input form component with amount, rate, term fields
- [x] 4.3 Implement client-side validation with error messages for form fields
- [x] 4.4 Create results display component with monthly payment and amortization table
- [x] 4.5 Add error message component for backend errors and connection issues
- [x] 4.6 Style components with clean, educational interface using CSS modules or styled-components

## 5. Frontend API Communication

- [x] 5.1 Create API service layer using fetch API for backend communication
- [x] 5.2 Implement environment variable support for backend URL configuration
- [x] 5.3 Build loading states and error handling for API calls
- [x] 5.4 Handle network failures, server errors, and connection issues
- [x] 5.5 Integrate API service with React components for form submission and results display

## 6. Integration and Testing

- [x] 6.1 Test end-to-end flow from form submission to results display
- [x] 6.2 Verify API contract compliance with updated schemas (amount/rate/term, monthlyPayment/installments)
- [x] 6.3 Test error scenarios (invalid inputs, missing parameters, data type errors, server errors)
- [x] 6.4 Validate calculation accuracy against known loan scenarios
- [x] 6.5 Test CORS configuration and cross-origin requests
- [x] 6.6 Test minimum loan amount validation

## 7. Development Environment and Documentation

- [x] 7.1 Configure ESLint and code formatting for frontend with Vite
- [x] 7.2 Set up Python linting tools for FastAPI backend
- [x] 7.3 Verify pnpm run dev starts frontend on port 5173
- [x] 7.4 Verify uvicorn --reload starts backend on port 8000
- [x] 7.5 Test hot reloading works for both frontend (Vite) and backend (uvicorn --reload)
- [x] 7.6 Verify environment variable configuration works for API URL
- [x] 7.7 Add debugging configurations for both frontend and backend
- [x] 7.8 Update documentation with technology stack details (pnpm, uv, React 18+, Python 3.8+)