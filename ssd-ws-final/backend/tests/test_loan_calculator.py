"""Unit tests for core loan calculation logic (US1).

TDD: These tests are written FIRST and must FAIL before implementation.

Formula: total_interest = principal x (annual_rate / 100) x (term_months / 12)
         monthly_payment = (principal + total_interest) / term_months
         total_payment = principal + total_interest
"""

from decimal import Decimal

import pytest

from services.loan_calculator import calculate_loan


class TestCalculateLoan:
    """Test the calculate_loan function with simple interest formula."""

    def test_standard_loan(self):
        """$10,000 / 12mo / 5%
        total_interest = 10000 * (5/100) * (12/12) = 500.00
        total_payment = 10000 + 500 = 10500.00
        monthly_payment = 10500 / 12 = 875.00
        """
        result = calculate_loan(
            amount=Decimal("10000"),
            term_months=12,
            annual_rate=Decimal("5"),
        )
        assert result["total_interest"] == Decimal("500.00")
        assert result["total_payment"] == Decimal("10500.00")
        assert result["monthly_payment"] == Decimal("875.00")

    def test_zero_interest(self):
        """$5,000 / 10mo / 0%
        total_interest = 5000 * 0 * (10/12) = 0.00
        monthly_payment = 5000 / 10 = 500.00
        """
        result = calculate_loan(
            amount=Decimal("5000"),
            term_months=10,
            annual_rate=Decimal("0"),
        )
        assert result["monthly_payment"] == Decimal("500.00")
        assert result["total_payment"] == Decimal("5000.00")
        assert result["total_interest"] == Decimal("0.00")

    def test_single_month(self):
        """$1,000 / 1mo / 12%
        total_interest = 1000 * (12/100) * (1/12) = 10.00
        monthly_payment = 1010 / 1 = 1010.00
        """
        result = calculate_loan(
            amount=Decimal("1000"),
            term_months=1,
            annual_rate=Decimal("12"),
        )
        assert result["monthly_payment"] == Decimal("1010.00")
        assert result["total_payment"] == Decimal("1010.00")
        assert result["total_interest"] == Decimal("10.00")

    def test_all_values_have_two_decimal_places(self):
        """All monetary values must have exactly 2 decimal places."""
        result = calculate_loan(
            amount=Decimal("10000"),
            term_months=12,
            annual_rate=Decimal("5"),
        )
        for key in ("monthly_payment", "total_payment", "total_interest"):
            value = result[key]
            assert value == value.quantize(Decimal("0.01"))

    def test_short_term_with_rate(self):
        """$10,000 / 6mo / 5%
        total_interest = 10000 * 0.05 * (6/12) = 250.00
        total_payment = 10250.00
        monthly_payment = 10250 / 6 = 1708.33 (rounded)
        """
        result = calculate_loan(
            amount=Decimal("10000"),
            term_months=6,
            annual_rate=Decimal("5"),
        )
        assert result["total_interest"] == Decimal("250.00")
        assert result["total_payment"] == Decimal("10250.00")
        assert result["monthly_payment"] == Decimal("1708.33")


class TestGenerateSchedule:
    """Test the amortization schedule generation (US2).

    TDD: These tests are written FIRST and must FAIL before implementation.
    """

    def test_twelve_month_produces_twelve_installments(self):
        """12-month loan produces exactly 12 installments with sequential payment_numbers 1-12."""
        from services.loan_calculator import generate_schedule

        monthly_payment = Decimal("875.00")
        schedule = generate_schedule(
            amount=Decimal("10000"),
            term_months=12,
            annual_rate=Decimal("5"),
            monthly_payment=monthly_payment,
        )
        assert len(schedule) == 12
        for i, inst in enumerate(schedule, 1):
            assert inst["payment_number"] == i

    def test_sum_principal_equals_amount(self):
        """Sum of all principal_portions equals original amount."""
        from services.loan_calculator import generate_schedule

        amount = Decimal("10000")
        monthly_payment = Decimal("875.00")
        schedule = generate_schedule(
            amount=amount,
            term_months=12,
            annual_rate=Decimal("5"),
            monthly_payment=monthly_payment,
        )
        total_principal = sum(inst["principal_portion"] for inst in schedule)
        assert total_principal == amount

    def test_sum_interest_equals_total_interest(self):
        """Sum of all interest_portions equals total_interest."""
        from services.loan_calculator import generate_schedule, calculate_loan

        result = calculate_loan(
            amount=Decimal("10000"),
            term_months=12,
            annual_rate=Decimal("5"),
        )
        schedule = generate_schedule(
            amount=Decimal("10000"),
            term_months=12,
            annual_rate=Decimal("5"),
            monthly_payment=result["monthly_payment"],
            total_interest=result["total_interest"],
        )
        total_interest_from_schedule = sum(inst["interest_portion"] for inst in schedule)
        assert total_interest_from_schedule == result["total_interest"]

    def test_final_balance_is_zero(self):
        """Final installment remaining_balance is exactly $0.00."""
        from services.loan_calculator import generate_schedule

        schedule = generate_schedule(
            amount=Decimal("10000"),
            term_months=12,
            annual_rate=Decimal("5"),
            monthly_payment=Decimal("875.00"),
        )
        assert schedule[-1]["remaining_balance"] == Decimal("0.00")

    def test_all_monetary_values_two_decimal_places(self):
        """All monetary values have 2 decimal places."""
        from services.loan_calculator import generate_schedule

        schedule = generate_schedule(
            amount=Decimal("10000"),
            term_months=12,
            annual_rate=Decimal("5"),
            monthly_payment=Decimal("875.00"),
        )
        two_places = Decimal("0.01")
        for inst in schedule:
            for key in ("payment_amount", "principal_portion", "interest_portion", "remaining_balance"):
                assert inst[key] == inst[key].quantize(two_places)

    def test_zero_interest_equal_installments(self):
        """0% interest produces equal installments with $0.00 interest portions."""
        from services.loan_calculator import generate_schedule

        schedule = generate_schedule(
            amount=Decimal("5000"),
            term_months=10,
            annual_rate=Decimal("0"),
            monthly_payment=Decimal("500.00"),
        )
        for inst in schedule:
            assert inst["interest_portion"] == Decimal("0.00")
            assert inst["principal_portion"] == Decimal("500.00")
            assert inst["payment_amount"] == Decimal("500.00")


class TestEdgeCases:
    """Edge case tests for loan calculation (T022)."""

    def test_large_loan_precision(self):
        """$200,000 / 360 months maintains precision and completes quickly."""
        import time

        start = time.perf_counter()
        result = calculate_loan(
            amount=Decimal("200000"),
            term_months=360,
            annual_rate=Decimal("6.5"),
        )
        from services.loan_calculator import generate_schedule

        schedule = generate_schedule(
            amount=Decimal("200000"),
            term_months=360,
            annual_rate=Decimal("6.5"),
            monthly_payment=result["monthly_payment"],
            total_interest=result["total_interest"],
        )
        elapsed = time.perf_counter() - start

        assert elapsed < 1.0, f"Took {elapsed:.2f}s, expected < 1s"
        assert len(schedule) == 360
        assert schedule[-1]["remaining_balance"] == Decimal("0.00")

        # Verify precision on all installments
        two_places = Decimal("0.01")
        for inst in schedule:
            for key in ("payment_amount", "principal_portion", "interest_portion", "remaining_balance"):
                assert inst[key] == inst[key].quantize(two_places)

    def test_single_month_produces_single_installment(self):
        """1-month term produces a single installment."""
        from services.loan_calculator import generate_schedule

        result = calculate_loan(
            amount=Decimal("1000"),
            term_months=1,
            annual_rate=Decimal("12"),
        )
        schedule = generate_schedule(
            amount=Decimal("1000"),
            term_months=1,
            annual_rate=Decimal("12"),
            monthly_payment=result["monthly_payment"],
            total_interest=result["total_interest"],
        )
        assert len(schedule) == 1
        assert schedule[0]["remaining_balance"] == Decimal("0.00")
        assert schedule[0]["principal_portion"] == Decimal("1000")

    def test_360_installments_two_decimal_places(self):
        """All monetary values in 360-installment schedule have exactly 2 decimal places."""
        result = calculate_loan(
            amount=Decimal("200000"),
            term_months=360,
            annual_rate=Decimal("6.5"),
        )
        from services.loan_calculator import generate_schedule

        schedule = generate_schedule(
            amount=Decimal("200000"),
            term_months=360,
            annual_rate=Decimal("6.5"),
            monthly_payment=result["monthly_payment"],
            total_interest=result["total_interest"],
        )
        two_places = Decimal("0.01")
        for inst in schedule:
            for key in ("payment_amount", "principal_portion", "interest_portion", "remaining_balance"):
                assert inst[key] == inst[key].quantize(two_places), (
                    f"Installment {inst['payment_number']}, {key}={inst[key]} not 2dp"
                )
