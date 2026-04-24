![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-2.0+-E92063?style=flat&logo=pydantic&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat&logo=vitest&logoColor=white)
![Pytest](https://img.shields.io/badge/Pytest-8+-0A9EDC?style=flat&logo=pytest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat&logo=eslint&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-latest-F69220?style=flat&logo=pnpm&logoColor=white)
![uv](https://img.shields.io/badge/uv-latest-DE5FE9?style=flat&logo=uv&logoColor=white)

# sdd-ws-speckit-1

Loan Simulator - A Spec-Driven Development (SDD) educational proof-of-concept demonstrating how loan payments are calculated and distributed between principal and interest using simple interest calculations.

## Overview

This project is a full-stack loan calculator application built with a **Python/FastAPI** backend and a **React/TypeScript** frontend. It follows a Spec-Driven Development methodology with Test-Driven Development (TDD) practices.

### Features

- Calculate monthly loan payments using simple interest formula
- Generate full amortization schedules with principal/interest breakdown
- Responsive UI with desktop, tablet, and mobile layouts
- Precise monetary calculations using Python `Decimal` with banker's rounding

## Project Structure

```text
sdd-ws-speckit-1/
├── backend/                # Python FastAPI backend
│   ├── main.py             # FastAPI app entry point
│   ├── models/             # Pydantic request/response models
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic (loan calculator)
│   ├── middleware/          # Request logging
│   └── tests/              # Backend tests (pytest)
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # UI components (LoanForm, PaymentDisplay, InstallmentTable)
│   │   ├── services/       # API client (Fetch API)
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Formatting and validation utilities
│   │   └── tests/          # Frontend tests (Vitest + Testing Library)
│   └── vite.config.ts      # Vite + Vitest configuration
├── specs/                  # SDD feature specifications
└── preparation/            # Project planning documents
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/loans/calculate` | Calculate loan schedule |
| `GET` | `/health` | Health check |

### Request

```json
{
  "amount": 10000,
  "term_months": 12,
  "annual_rate": 5.0
}
```

### Response

```json
{
  "monthly_payment": 856.07,
  "total_payment": 10272.84,
  "total_interest": 272.84,
  "schedule": [
    {
      "month": 1,
      "payment": 856.07,
      "principal_portion": 814.40,
      "interest_portion": 41.67,
      "remaining_balance": 9185.60
    }
  ]
}
```

## Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.12+ | Language |
| FastAPI | 0.115+ | Web framework |
| Pydantic | 2.0+ | Data validation |
| uvicorn | 0.34+ | ASGI server |
| pytest | 8.0+ | Testing |
| httpx | 0.27+ | Test HTTP client |
| uv | latest | Package manager |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 6.0 | Type safety (strict mode) |
| Vite | 8 | Build tool / dev server |
| Vitest | 4 | Unit testing |
| Testing Library | 16+ | Component testing |
| ESLint | 9 | Linting |
| pnpm | latest | Package manager |

## Getting Started

### Backend

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

Try: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Running Tests

```bash
# Backend
cd backend && uv run pytest

# Frontend
cd frontend && pnpm test
```

########
In /preparation/ you'll find the detailed instructions required by the AI agent. Those files will be created by devs, QA, designers, product owners, archs. More detailed files lead to better results.
For example, to create the Loan Calculation API feature we need to create the instruction file as detailed as we can.

/specs is automatically generated during the flow

Say we want to add some adjusment. We need to create the specification file, see the /preparation/5.styling-adjustment.md and then run "/speckit.specify @preparation/5.styling-adjustment.md"