export interface LoanFormState {
  amount: string;
  term: string;
  rate: string;
}

export interface LoanCalculateRequest {
  amount: number;
  term_months: number;
  annual_rate: number;
}

export interface LoanResult {
  monthly_payment: number;
  total_payment: number;
  total_interest: number;
  schedule: Installment[];
}

export interface Installment {
  payment_number: number;
  payment_amount: number;
  principal_portion: number;
  interest_portion: number;
  remaining_balance: number;
}

export type ValidationErrors = Record<string, string>;

export interface ApiError {
  error: string;
  details: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface LoanFormProps {
  onCalculate: (result: LoanResult, principal: number) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: string | null) => void;
}

export interface PaymentDisplayData {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
}

export interface PaymentDisplayProps {
  data: PaymentDisplayData | null;
}

export interface InstallmentTableProps {
  installments: Installment[] | null;
  originalLoanAmount: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}
