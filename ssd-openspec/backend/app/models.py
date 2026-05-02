from pydantic import BaseModel
from typing import List


class LoanRequest(BaseModel):
    amount: float
    rate: float
    term: int


class Installment(BaseModel):
    period: int
    payment: float
    principal: float
    interest: float
    balance: float


class LoanResponse(BaseModel):
    monthlyPayment: float
    installments: List[Installment]
