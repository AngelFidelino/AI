"""Validation tests for loan calculation endpoint (US3).

TDD: These tests are written FIRST and must FAIL before implementation.
All validation errors expect HTTP 400 with {"error": "validation_error", "details": [...]}.
"""

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


class TestValidationErrors:
    """Test validation error handling per contracts/api.md."""

    def _post(self, data):
        return client.post("/api/v1/loans/calculate", json=data)

    def _find_field_error(self, details: list, field: str) -> dict | None:
        for d in details:
            if d["field"] == field:
                return d
        return None

    # --- Amount validation ---

    def test_negative_amount(self):
        """Negative amount returns 'Loan amount must be greater than 0'."""
        response = self._post({"amount": -1000, "term_months": 12, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        assert data["error"] == "validation_error"
        err = self._find_field_error(data["details"], "amount")
        assert err is not None
        assert err["message"] == "Loan amount must be greater than 0"

    def test_zero_amount(self):
        """Zero amount returns 'Loan amount must be greater than 0'."""
        response = self._post({"amount": 0, "term_months": 12, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "amount")
        assert err is not None
        assert err["message"] == "Loan amount must be greater than 0"

    # --- Term validation ---

    def test_zero_term(self):
        """Zero term returns 'Term must be a positive integer'."""
        response = self._post({"amount": 10000, "term_months": 0, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "term_months")
        assert err is not None
        assert err["message"] == "Term must be a positive integer"

    def test_negative_term(self):
        """Negative term returns 'Term must be a positive integer'."""
        response = self._post({"amount": 10000, "term_months": -5, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "term_months")
        assert err is not None
        assert err["message"] == "Term must be a positive integer"

    def test_float_term(self):
        """Non-integer term (12.5) returns 'Term must be a positive integer'."""
        response = self._post({"amount": 10000, "term_months": 12.5, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "term_months")
        assert err is not None
        assert err["message"] == "Term must be a positive integer"

    # --- Rate validation ---

    def test_rate_over_100(self):
        """Rate > 100 returns 'Interest rate must be between 0 and 100'."""
        response = self._post({"amount": 10000, "term_months": 12, "annual_rate": 150})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "annual_rate")
        assert err is not None
        assert err["message"] == "Interest rate must be between 0 and 100"

    def test_negative_rate(self):
        """Negative rate returns 'Interest rate must be between 0 and 100'."""
        response = self._post({"amount": 10000, "term_months": 12, "annual_rate": -5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "annual_rate")
        assert err is not None
        assert err["message"] == "Interest rate must be between 0 and 100"

    # --- Missing fields ---

    def test_missing_amount(self):
        """Missing amount returns 'Field is required'."""
        response = self._post({"term_months": 12, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "amount")
        assert err is not None
        assert err["message"] == "Field is required"

    def test_missing_term(self):
        """Missing term returns 'Field is required'."""
        response = self._post({"amount": 10000, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "term_months")
        assert err is not None
        assert err["message"] == "Field is required"

    def test_missing_rate(self):
        """Missing rate returns 'Field is required'."""
        response = self._post({"amount": 10000, "term_months": 12})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "annual_rate")
        assert err is not None
        assert err["message"] == "Field is required"

    # --- Non-numeric values ---

    def test_non_numeric_amount(self):
        """Non-numeric amount returns 'Must be a valid number'."""
        response = self._post({"amount": "abc", "term_months": 12, "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "amount")
        assert err is not None
        assert err["message"] == "Must be a valid number"

    def test_non_numeric_term(self):
        """Non-numeric term returns 'Term must be a positive integer'."""
        response = self._post({"amount": 10000, "term_months": "abc", "annual_rate": 5})
        assert response.status_code == 400

        data = response.json()
        err = self._find_field_error(data["details"], "term_months")
        assert err is not None
        assert err["message"] == "Term must be a positive integer"

    # --- Multiple errors ---

    def test_multiple_invalid_fields(self):
        """Multiple invalid fields return multiple error details."""
        response = self._post({"amount": -1000, "term_months": 0, "annual_rate": 150})
        assert response.status_code == 400

        data = response.json()
        assert data["error"] == "validation_error"
        assert len(data["details"]) >= 3

        amount_err = self._find_field_error(data["details"], "amount")
        term_err = self._find_field_error(data["details"], "term_months")
        rate_err = self._find_field_error(data["details"], "annual_rate")

        assert amount_err is not None
        assert term_err is not None
        assert rate_err is not None

    def test_all_fields_missing(self):
        """Empty body returns errors for all required fields."""
        response = self._post({})
        assert response.status_code == 400

        data = response.json()
        assert data["error"] == "validation_error"
        assert len(data["details"]) == 3

    # --- Error structure ---

    def test_error_response_structure(self):
        """Error response matches contracts/api.md structure."""
        response = self._post({"amount": -1})
        assert response.status_code == 400

        data = response.json()
        assert "error" in data
        assert "details" in data
        assert data["error"] == "validation_error"
        for detail in data["details"]:
            assert "field" in detail
            assert "message" in detail
