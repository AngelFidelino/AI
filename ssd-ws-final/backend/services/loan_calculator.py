"""Core loan calculation logic using simple interest formula.

All monetary calculations use Python Decimal for precision.
Rounding: ROUND_HALF_EVEN (banker's rounding) per research.md decision #3.
"""

from decimal import Decimal, ROUND_HALF_EVEN

TWO_PLACES = Decimal("0.01")


def calculate_loan(
    amount: Decimal, term_months: int, annual_rate: Decimal
) -> dict:
    """Calculate loan payment using simple interest formula.

    Formula:
        total_interest = principal x (annual_rate / 100) x (term_months / 12)
        total_payment = principal + total_interest
        monthly_payment = total_payment / term_months

    Args:
        amount: Loan principal amount (Decimal, > 0)
        term_months: Loan term in months (int, > 0)
        annual_rate: Annual interest rate as percentage (Decimal, 0-100)

    Returns:
        dict with monthly_payment, total_payment, total_interest (all Decimal, 2dp)
    """
    total_interest = (
        amount * (annual_rate / Decimal("100")) * (Decimal(term_months) / Decimal("12"))
    ).quantize(TWO_PLACES, rounding=ROUND_HALF_EVEN)

    total_payment = (amount + total_interest).quantize(TWO_PLACES, rounding=ROUND_HALF_EVEN)

    monthly_payment = (total_payment / Decimal(term_months)).quantize(
        TWO_PLACES, rounding=ROUND_HALF_EVEN
    )

    return {
        "monthly_payment": monthly_payment,
        "total_payment": total_payment,
        "total_interest": total_interest,
    }


def generate_schedule(
    amount: Decimal,
    term_months: int,
    annual_rate: Decimal,
    monthly_payment: Decimal,
    total_interest: Decimal | None = None,
) -> list[dict]:
    """Generate amortization schedule for a loan.

    Per-installment breakdown:
        interest_portion = remaining_balance x (annual_rate / 100 / 12)
        principal_portion = monthly_payment - interest_portion
        Final installment adjusts to zero balance (FR-006).
        Final installment's interest_portion is adjusted so that
        sum(interest_portions) == total_interest (SC-003).

    Args:
        amount: Loan principal amount
        term_months: Loan term in months
        annual_rate: Annual interest rate as percentage
        monthly_payment: Pre-computed monthly payment amount
        total_interest: Pre-computed total interest for invariant enforcement

    Returns:
        List of installment dicts with payment_number, payment_amount,
        principal_portion, interest_portion, remaining_balance
    """
    monthly_rate = annual_rate / Decimal("100") / Decimal("12")
    remaining_balance = amount
    schedule = []

    for i in range(1, term_months + 1):
        interest_portion = (remaining_balance * monthly_rate).quantize(
            TWO_PLACES, rounding=ROUND_HALF_EVEN
        )

        if i == term_months:
            # Final installment: adjust principal to zero out balance
            principal_portion = remaining_balance

            # Adjust interest to ensure SC-003 invariant:
            # sum(interest_portions) == total_interest
            if total_interest is not None:
                interest_so_far = sum(inst["interest_portion"] for inst in schedule)
                interest_portion = (total_interest - interest_so_far).quantize(
                    TWO_PLACES, rounding=ROUND_HALF_EVEN
                )

            payment_amount = (principal_portion + interest_portion).quantize(
                TWO_PLACES, rounding=ROUND_HALF_EVEN
            )
            remaining_balance = Decimal("0.00")
        else:
            principal_portion = (monthly_payment - interest_portion).quantize(
                TWO_PLACES, rounding=ROUND_HALF_EVEN
            )
            payment_amount = monthly_payment
            remaining_balance = (remaining_balance - principal_portion).quantize(
                TWO_PLACES, rounding=ROUND_HALF_EVEN
            )

        schedule.append({
            "payment_number": i,
            "payment_amount": payment_amount,
            "principal_portion": principal_portion,
            "interest_portion": interest_portion,
            "remaining_balance": remaining_balance,
        })

    return schedule
