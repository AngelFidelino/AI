"""Loan calculation route handler."""

from fastapi import APIRouter

from models.request import LoanRequest
from models.response import Installment, LoanResponse
from services.loan_calculator import calculate_loan, generate_schedule

router = APIRouter()


@router.post("/loans/calculate", response_model=LoanResponse)
def calculate(request: LoanRequest) -> LoanResponse:
    """Calculate monthly payment and generate amortization schedule for a loan."""
    result = calculate_loan(
        amount=request.amount,
        term_months=request.term_months,
        annual_rate=request.annual_rate,
    )

    schedule = generate_schedule(
        amount=request.amount,
        term_months=request.term_months,
        annual_rate=request.annual_rate,
        monthly_payment=result["monthly_payment"],
        total_interest=result["total_interest"],
    )

    return LoanResponse(
        monthly_payment=result["monthly_payment"],
        total_payment=result["total_payment"],
        total_interest=result["total_interest"],
        schedule=[Installment(**inst) for inst in schedule],
    )
