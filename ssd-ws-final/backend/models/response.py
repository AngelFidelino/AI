from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, PlainSerializer

# Serialize Decimal as float in JSON output for API compatibility
JsonDecimal = Annotated[Decimal, PlainSerializer(lambda v: float(v), return_type=float)]


class Installment(BaseModel):
    """A single row in the amortization schedule."""

    payment_number: int
    payment_amount: JsonDecimal
    principal_portion: JsonDecimal
    interest_portion: JsonDecimal
    remaining_balance: JsonDecimal


class LoanResponse(BaseModel):
    """Complete calculation result returned to the consumer."""

    monthly_payment: JsonDecimal
    total_payment: JsonDecimal
    total_interest: JsonDecimal
    schedule: list[Installment]


class FieldError(BaseModel):
    """Per-field error detail."""

    field: str
    message: str


class ErrorResponse(BaseModel):
    """Structured error response for invalid inputs."""

    error: str
    details: list[FieldError]
