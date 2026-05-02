from fastapi import APIRouter, HTTPException
from app.models import LoanRequest, LoanResponse
from app.services.calculator import LoanCalculator


router = APIRouter()

MIN_LOAN_AMOUNT = 1000  # Minimum loan amount in USD


@router.post("/api/calculate-loan", response_model=LoanResponse)
async def calculate_loan(loan_request: LoanRequest):
    """
    Calculate loan payment and generate amortization schedule
    """
    try:
        # Validate minimum loan amount
        if loan_request.amount < MIN_LOAN_AMOUNT:
            raise HTTPException(
                status_code=400,
                detail=f"Loan amount must be at least ${MIN_LOAN_AMOUNT:,}",
            )

        # Validate input ranges
        if loan_request.amount <= 0:
            raise HTTPException(status_code=400, detail="Loan amount must be positive")

        if loan_request.rate < 0 or loan_request.rate > 100:
            raise HTTPException(
                status_code=400, detail="Interest rate must be between 0 and 100"
            )

        if loan_request.term <= 0 or loan_request.term > 360:
            raise HTTPException(
                status_code=400, detail="Loan term must be between 1 and 360 months"
            )

        # Calculate monthly payment
        monthly_payment = LoanCalculator.calculate_monthly_payment(
            loan_request.amount, loan_request.rate, loan_request.term
        )

        # Generate amortization schedule
        schedule_data = LoanCalculator.generate_amortization_schedule(
            loan_request.amount, loan_request.rate, loan_request.term
        )

        # Convert to response model
        installments = [
            {
                "period": payment["period"],
                "payment": payment["payment"],
                "principal": payment["principal"],
                "interest": payment["interest"],
                "balance": payment["balance"],
            }
            for payment in schedule_data
        ]

        return LoanResponse(monthlyPayment=monthly_payment, installments=installments)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
