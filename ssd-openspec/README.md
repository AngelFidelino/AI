# Loan Calculator

A two-tier client-server application for calculating loan payments and generating amortization schedules. Built as an educational proof of concept demonstrating modern web development practices.

## Technology Stack

### Frontend
- **React 19.2+** with Vite 8.0+ for development and building
- **pnpm** package manager
- **JavaScript (JSX)** with CSS modules
- **ESLint** for code linting with React hooks and refresh plugins
- Runs on port 5173
- Hot reload enabled

### Backend
- **Python 3.9+** with FastAPI 0.128+ framework
- **uvicorn** ASGI server with hot reload
- **Pydantic v2** for data validation
- **black** and **flake8** for code formatting and linting
- **uv** package manager (alternative to pip)
- Runs on port 8000
- Hot reload enabled

### Communication
- **REST API** with JSON payloads
- **CORS** configured for localhost:5173
- **OpenAPI** documentation available at /docs

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── LoanForm.js    # Input form for loan parameters
│   │   │   ├── Results.js     # Results display with amortization table
│   │   │   └── ErrorMessage.js # Error handling component
│   │   ├── services/
│   │   │   └── api.js         # API communication layer
│   │   ├── App.jsx            # Main application component
│   │   └── App.css            # Global styles
│   ├── package.json
│   ├── .env.example           # Environment variables template
│   └── start.bat              # Windows startup script
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI application entry
│   │   ├── models.py          # Pydantic models
│   │   ├── routes.py          # API endpoints
│   │   └── services/
│   │       └── calculator.py  # Loan calculation logic
│   ├── .env.example           # Environment variables template
│   └── start.bat              # Windows startup script
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+ installed
- Node.js 18+ installed
- pnpm package manager installed (`npm install -g pnpm`)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Using uv (recommended):
   ```bash
   uv init
   uv add fastapi pydantic python-multipart uvicorn
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Or using pip:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   pip install fastapi pydantic python-multipart uvicorn
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. Quick start (Windows):
   ```bash
   start.bat
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies and start development server:
   ```bash
   pnpm install
   pnpm run dev
   ```

3. Quick start (Windows):
   ```bash
   start.bat
   ```

## API Documentation

When the backend server is running, you can access:
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Main Endpoint**: POST http://localhost:8000/api/calculate-loan

### API Endpoint

**POST /api/calculate-loan**

Request body:
```json
{
  "amount": 100000,
  "rate": 6.5,
  "term": 360
}
```

Response body:
```json
{
  "monthlyPayment": 632.07,
  "installments": [
    {
      "period": 1,
      "payment": 632.07,
      "principal": 91.40,
      "interest": 540.67,
      "balance": 99908.60
    },
    // ... more installments
  ]
}
```

## Development Workflow

1. **Start Backend**: Run `start.bat` in the `backend/` directory
2. **Start Frontend**: Run `start.bat` in the `frontend/` directory
3. **Access Application**: Open http://localhost:5173 in your browser
4. **Hot Reload**: Both frontend and backend support hot reload - changes will be reflected automatically

## Features

- ⚡ **Fast Development**: Hot reload on both frontend and backend
- 🎯 **Input Validation**: Comprehensive client and server-side validation
- 📊 **Amortization Schedule**: Complete payment breakdown over loan term
- 🛡️ **Error Handling**: User-friendly error messages and loading states
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔧 **Modern Tooling**: Uses latest versions of React, FastAPI, and development tools

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
HOST=localhost
PORT=8000
DEBUG=true
```

## Testing

Both frontend and backend include automatic documentation and validation:

- **Backend API Documentation**: Visit http://localhost:8000/docs
- **Interactive API Testing**: Use the built-in Swagger UI
- **Form Validation**: Test various input scenarios through the web interface

## Educational Value

This application demonstrates:
- Modern React development with hooks and functional components
- FastAPI with automatic OpenAPI documentation
- RESTful API design principles
- Client-server communication patterns
- Input validation and error handling
- Responsive web design
- Component-based architecture
- State management in React
- CORS configuration
- Development environment setup

## License

This project is for educational purposes only. Not intended for production use.

Files in /preparations are script definitions

Commands:

/opsx:propose @preparation/propose.md

/opsx:new  @preparation/formal-specs.md

/opsx:ff @preparation/task-plan.md

/opsx:apply system-architecture @preparation/deploy-task.md

/opsx:archive system-architecture

=======================================================================

/opsx:propose @preparation/ui-redesign-propose.md

/opsx:new @preparation/ui-redesign-formal-specs.md

/opsx:ff ui-redesign @preparation/ui-redesign-task-plan.md

/opsx:apply ui-redesign @preparation/ui-redesign-deploy-task.md

/opsx:archive ui-redesign
