"""API contract tests for the loan calculation endpoint (US1).

TDD: These tests are written FIRST and must FAIL before implementation.
"""

from decimal import Decimal

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


class TestCalculateEndpointUS1:
    """Test POST /api/v1/loans/calculate returns correct response structure."""

    def test_standard_loan_returns_200(self):
        """Standard loan parameters return HTTP 200 with correct values."""
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 10000, "term_months": 12, "annual_rate": 5.0},
        )
        assert response.status_code == 200

        data = response.json()
        assert "monthly_payment" in data
        assert "total_payment" in data
        assert "total_interest" in data
        assert "schedule" in data

    def test_standard_loan_correct_values(self):
        """Verify calculated values match simple interest formula.

        Formula: total_interest = principal * (rate/100) * (term/12)
        For $10,000 / 12mo / 5%:
          total_interest = 10000 * 0.05 * 1 = 500.00
          total_payment = 10500.00
          monthly_payment = 875.00
        """
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 10000, "term_months": 12, "annual_rate": 5.0},
        )
        data = response.json()

        assert float(data["monthly_payment"]) == pytest.approx(875.00, abs=0.01)
        assert float(data["total_payment"]) == pytest.approx(10500.00, abs=0.01)
        assert float(data["total_interest"]) == pytest.approx(500.00, abs=0.01)

    def test_response_json_structure(self):
        """Response JSON matches contracts/api.md structure."""
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 5000, "term_months": 10, "annual_rate": 0},
        )
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data["monthly_payment"], (int, float))
        assert isinstance(data["total_payment"], (int, float))
        assert isinstance(data["total_interest"], (int, float))
        assert isinstance(data["schedule"], list)

    def test_content_type_is_json(self):
        """Response Content-Type is application/json."""
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 10000, "term_months": 12, "annual_rate": 5.0},
        )
        assert "application/json" in response.headers["content-type"]


class TestScheduleInResponseUS2:
    """Test POST /api/v1/loans/calculate response includes schedule (US2).

    TDD: These tests are written FIRST and must FAIL before implementation.
    """

    def test_schedule_array_present_with_correct_length(self):
        """Schedule array has length equal to term_months."""
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 10000, "term_months": 12, "annual_rate": 5.0},
        )
        data = response.json()
        assert len(data["schedule"]) == 12

    def test_schedule_installment_structure(self):
        """Each installment has required fields per contracts/api.md."""
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 10000, "term_months": 12, "annual_rate": 5.0},
        )
        data = response.json()

        for installment in data["schedule"]:
            assert "payment_number" in installment
            assert "payment_amount" in installment
            assert "principal_portion" in installment
            assert "interest_portion" in installment
            assert "remaining_balance" in installment

    def test_schedule_final_balance_is_zero(self):
        """Final installment remaining_balance is 0.00 via API."""
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 10000, "term_months": 12, "annual_rate": 5.0},
        )
        data = response.json()
        assert data["schedule"][-1]["remaining_balance"] == 0.00

    def test_schedule_installment_count_matches_term(self):
        """Schedule count matches term for different term values."""
        response = client.post(
            "/api/v1/loans/calculate",
            json={"amount": 5000, "term_months": 6, "annual_rate": 3.0},
        )
        data = response.json()
        assert len(data["schedule"]) == 6


class TestHealthEndpoint:
    """Test GET /health endpoint (T023)."""

    def test_health_returns_200(self):
        """GET /health returns HTTP 200 with {"status": "UP"}."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "UP"}

    def test_health_content_type(self):
        """Health endpoint returns application/json."""
        response = client.get("/health")
        assert "application/json" in response.headers["content-type"]


class TestLoggingMiddleware:
    """Test logging middleware produces structured log entries (T024)."""

    def test_request_logging_contains_required_fields(self, caplog):
        """Verify logging produces entries with method, path, status_code, response_time_ms."""
        import json
        import logging

        with caplog.at_level(logging.INFO, logger="loan_api"):
            client.get("/health")

        # Find the JSON log entry
        log_found = False
        for record in caplog.records:
            if record.name == "loan_api":
                log_data = json.loads(record.message)
                assert "method" in log_data
                assert "path" in log_data
                assert "status_code" in log_data
                assert "response_time_ms" in log_data
                assert log_data["method"] == "GET"
                assert log_data["path"] == "/health"
                assert log_data["status_code"] == 200
                assert isinstance(log_data["response_time_ms"], (int, float))
                log_found = True
                break

        assert log_found, "No structured log entry found from loan_api logger"

    def test_post_request_logging(self, caplog):
        """POST requests are logged with correct method and path."""
        import json
        import logging

        with caplog.at_level(logging.INFO, logger="loan_api"):
            client.post(
                "/api/v1/loans/calculate",
                json={"amount": 10000, "term_months": 12, "annual_rate": 5.0},
            )

        log_found = False
        for record in caplog.records:
            if record.name == "loan_api":
                log_data = json.loads(record.message)
                if log_data["method"] == "POST":
                    assert log_data["path"] == "/api/v1/loans/calculate"
                    assert log_data["status_code"] == 200
                    log_found = True
                    break

        assert log_found, "No POST log entry found"
