from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from middleware.logging import RequestLoggingMiddleware
from routes.loans import router as loans_router

app = FastAPI(title="Loan Calculation API", version="0.1.0")

app.include_router(loans_router, prefix="/api/v1")

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


# Field-specific error message mapping per contracts/api.md
_ERROR_MESSAGES: dict[str, dict[str, str]] = {
    "amount": {
        "greater_than": "Loan amount must be greater than 0",
        "missing": "Field is required",
        "decimal_parsing": "Must be a valid number",
        "decimal_type": "Must be a valid number",
        "int_parsing": "Must be a valid number",
        "float_parsing": "Must be a valid number",
        "json_invalid": "Must be a valid number",
    },
    "term_months": {
        "greater_than": "Term must be a positive integer",
        "missing": "Field is required",
        "int_parsing": "Term must be a positive integer",
        "int_from_float": "Term must be a positive integer",
        "int_type": "Term must be a positive integer",
        "json_invalid": "Term must be a positive integer",
    },
    "annual_rate": {
        "greater_than_equal": "Interest rate must be between 0 and 100",
        "less_than_equal": "Interest rate must be between 0 and 100",
        "missing": "Field is required",
        "decimal_parsing": "Must be a valid number",
        "decimal_type": "Must be a valid number",
        "int_parsing": "Must be a valid number",
        "float_parsing": "Must be a valid number",
        "json_invalid": "Must be a valid number",
    },
}

# Default messages by error type
_DEFAULT_MESSAGES: dict[str, str] = {
    "missing": "Field is required",
    "greater_than": "Value must be greater than 0",
    "greater_than_equal": "Value must be greater than or equal to 0",
    "less_than_equal": "Value must be less than or equal to 100",
}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    details = []
    for error in exc.errors():
        loc = error.get("loc", ())
        # Field name is typically the last element in loc; skip 'body' prefix
        field = str(loc[-1]) if loc else "unknown"
        if field == "body":
            # Malformed JSON body - not a field-specific error
            field = "body"
            message = "Invalid request body"
        else:
            error_type = error.get("type", "")
            field_messages = _ERROR_MESSAGES.get(field, {})
            message = field_messages.get(
                error_type, _DEFAULT_MESSAGES.get(error_type, error.get("msg", "Invalid value"))
            )
        details.append({"field": field, "message": message})

    return JSONResponse(
        status_code=400,
        content={"error": "validation_error", "details": details},
    )


@app.get("/health")
def health_check():
    return {"status": "UP"}
