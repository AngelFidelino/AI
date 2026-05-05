#!/usr/bin/env python3
"""Test script to validate loan calculation accuracy"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.calculator import LoanCalculator

def test_loan_scenarios():
    """Test against known loan calculation scenarios"""
    
    test_cases = [
        {
            "name": "Standard 30-year mortgage",
            "amount": 200000,
            "rate": 6.5,
            "term": 360,
            "expected_payment": 1264.14
        },
        {
            "name": "15-year loan",
            "amount": 150000,
            "rate": 4.5,
            "term": 180,
            "expected_payment": 1147.49
        },
        {
            "name": "Zero interest rate",
            "amount": 120000,
            "rate": 0,
            "term": 360,
            "expected_payment": 333.33
        },
        {
            "name": "Short term 5-year loan",
            "amount": 50000,
            "rate": 7.0,
            "term": 60,
            "expected_payment": 990.05
        },
        {
            "name": "Small loan",
            "amount": 5000,
            "rate": 5.0,
            "term": 36,
            "expected_payment": 149.85
        }
    ]
    
    print("Testing loan calculation accuracy...")
    print("-" * 50)
    
    all_passed = True
    
    for test in test_cases:
        calculated = LoanCalculator.calculate_monthly_payment(
            test["amount"], test["rate"], test["term"]
        )
        
        difference = abs(calculated - test["expected_payment"])
        tolerance = 0.05  # Allow $0.05 tolerance for rounding
        
        if difference <= tolerance:
            status = "PASS"
        else:
            status = "FAIL"
            all_passed = False
            
        print(f"{test['name']}: {status}")
        print(f"  Expected: ${test['expected_payment']:.2f}")
        print(f"  Calculated: ${calculated:.2f}")
        print(f"  Difference: ${difference:.2f}")
        print()
    
    # Test amortization schedule
    print("Testing amortization schedule generation...")
    schedule = LoanCalculator.generate_amortization_schedule(100000, 6.5, 360)
    
    # Verify schedule properties
    assert len(schedule) == 360, f"Schedule should have 360 payments, got {len(schedule)}"
    assert schedule[0]["period"] == 1, "First period should be 1"
    assert schedule[-1]["period"] == 360, "Last period should be 360"
    assert schedule[-1]["balance"] == 0, "Final balance should be 0"
    
    # Verify principal + interest = payment
    for payment in schedule[:6]:  # Check first 6 payments
        assert abs(payment["principal"] + payment["interest"] - payment["payment"]) < 0.01, \
            f"Payment {payment['period']}: Principal + interest != payment"
    
    print("Amortization schedule validation passed")
    
    if all_passed:
        print("\nAll tests passed!")
        return True
    else:
        print("\nSome tests failed!")
        return False

if __name__ == "__main__":
    success = test_loan_scenarios()
    sys.exit(0 if success else 1)