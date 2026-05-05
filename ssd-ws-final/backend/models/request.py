from decimal import Decimal

from pydantic import BaseModel, Field


class LoanRequest(BaseModel):
    """Input parameters for a loan calculation."""

    amount: Decimal = Field(gt=0, description="Loan principal amount")
    term_months: int = Field(gt=0, description="Loan term in months")
    annual_rate: Decimal = Field(ge=0, le=100, description="Annual interest rate as percentage")
