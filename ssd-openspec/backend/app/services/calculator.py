class LoanCalculator:
    @staticmethod
    def calculate_monthly_payment(
        amount: float, annual_rate: float, term_months: int
    ) -> float:
        """
        Calculate monthly payment using standard loan formula:
        M = P * [r(1+r)^n] / [(1+r)^n-1]

        Where:
        M = monthly payment
        P = principal (amount)
        r = monthly interest rate (annual rate / 12 / 100)
        n = number of months (term)
        """
        if annual_rate == 0:
            return amount / term_months

        monthly_rate = annual_rate / 12 / 100
        monthly_payment = (
            amount
            * (monthly_rate * (1 + monthly_rate) ** term_months)
            / ((1 + monthly_rate) ** term_months - 1)
        )
        return round(monthly_payment, 2)

    @staticmethod
    def generate_amortization_schedule(
        amount: float, annual_rate: float, term_months: int
    ) -> list:
        """
        Generate complete amortization schedule
        Returns list of dictionaries with payment details for each period
        """
        monthly_payment = LoanCalculator.calculate_monthly_payment(
            amount, annual_rate, term_months
        )
        remaining_balance = amount
        monthly_rate = annual_rate / 12 / 100

        schedule = []

        for period in range(1, term_months + 1):
            interest_payment = remaining_balance * monthly_rate
            principal_payment = monthly_payment - interest_payment
            remaining_balance -= principal_payment

            # Handle final payment to avoid negative balance due to rounding
            if period == term_months:
                remaining_balance = 0
                principal_payment = amount - sum(p["principal"] for p in schedule)

            schedule.append(
                {
                    "period": period,
                    "payment": monthly_payment,
                    "principal": round(principal_payment, 2),
                    "interest": round(interest_payment, 2),
                    "balance": round(max(0, remaining_balance), 2),
                }
            )

        return schedule
