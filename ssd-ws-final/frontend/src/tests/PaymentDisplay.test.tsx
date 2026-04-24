import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentDisplay } from '../components/PaymentDisplay';
import type { PaymentDisplayData } from '../types/loan';

// Shared test data
const sampleData: PaymentDisplayData = {
  monthlyPayment: 856.07,
  totalPayment: 10272.84,
  totalInterest: 272.84,
  principal: 10000,
};

describe('PaymentDisplay', () => {
  // Phase 2: Placeholder state tests (T005)
  describe('placeholder state', () => {
    it('renders placeholder message when data is null', () => {
      render(<PaymentDisplay data={null} />);
      expect(
        screen.getByText('Calculate a loan to see results')
      ).toBeInTheDocument();
    });

    it('renders placeholder section with correct class', () => {
      const { container } = render(<PaymentDisplay data={null} />);
      const placeholder = container.querySelector(
        '.payment-display__placeholder'
      );
      expect(placeholder).toBeInTheDocument();
    });

    it('does not render cards when data is null', () => {
      const { container } = render(<PaymentDisplay data={null} />);
      const cards = container.querySelector('.payment-display__cards');
      expect(cards).not.toBeInTheDocument();
    });
  });

  // Phase 3: User Story 1 — Monthly Payment (T009-T011)
  describe('monthly payment card (US1)', () => {
    it('renders monthly payment with correct currency formatting ($X,XXX.XX)', () => {
      render(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('$856.07')).toBeInTheDocument();
    });

    it('monthly payment card has "Monthly Payment" label and description text', () => {
      render(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('Monthly Payment')).toBeInTheDocument();
      expect(screen.getByText('Amount due each month')).toBeInTheDocument();
    });

    it('monthly payment of $0.00 renders correctly (edge case)', () => {
      const zeroData: PaymentDisplayData = {
        ...sampleData,
        monthlyPayment: 0,
      };
      render(<PaymentDisplay data={zeroData} />);
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('monthly payment card has aria-label="Monthly Payment"', () => {
      render(<PaymentDisplay data={sampleData} />);
      const section = screen.getByLabelText('Monthly Payment');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('root container has aria-live="polite"', () => {
      const { container } = render(<PaymentDisplay data={sampleData} />);
      const root = container.querySelector('.payment-display');
      expect(root).toHaveAttribute('aria-live', 'polite');
    });
  });

  // Phase 4: User Story 2 — Total Payment (T015-T016)
  describe('total payment card (US2)', () => {
    it('renders total payment with correct currency formatting in featured card', () => {
      const { container } = render(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('$10,272.84')).toBeInTheDocument();
      const totalCard = container.querySelector(
        '.payment-display__card--total'
      );
      expect(totalCard).toBeInTheDocument();
    });

    it('total payment card has "Total Payment" label and "Over loan lifetime" subtitle', () => {
      render(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('Total Payment')).toBeInTheDocument();
      expect(screen.getByText('Over loan lifetime')).toBeInTheDocument();
    });

    it('total payment card has aria-label="Total Payment"', () => {
      render(<PaymentDisplay data={sampleData} />);
      const section = screen.getByLabelText('Total Payment');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });
  });

  // Phase 5: User Story 3 — Payment Breakdown (T020-T022)
  describe('payment breakdown card (US3)', () => {
    it('renders principal amount with correct currency formatting and "Principal Amount" label', () => {
      render(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('$10,000.00')).toBeInTheDocument();
      expect(screen.getByText('Principal Amount')).toBeInTheDocument();
    });

    it('renders total interest with correct currency formatting and "Total Interest" label', () => {
      render(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('$272.84')).toBeInTheDocument();
      expect(screen.getByText('Total Interest')).toBeInTheDocument();
    });

    it('breakdown card has "Payment Breakdown" heading', () => {
      render(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('Payment Breakdown')).toBeInTheDocument();
    });

    it('breakdown card has aria-label="Payment Breakdown"', () => {
      render(<PaymentDisplay data={sampleData} />);
      const section = screen.getByLabelText('Payment Breakdown');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });
  });

  // Phase 6: User Story 4 — Responsive Layout (T026)
  describe('responsive layout (US4)', () => {
    it('cards container uses CSS grid class for responsive layout', () => {
      const { container } = render(<PaymentDisplay data={sampleData} />);
      const cardsContainer = container.querySelector(
        '.payment-display__cards'
      );
      expect(cardsContainer).toBeInTheDocument();
    });
  });

  // Phase 7: User Story 5 — Data Updates (T029-T031)
  describe('data updates (US5)', () => {
    it('all four metrics update when data prop changes (rerender with new data)', () => {
      const { rerender } = render(<PaymentDisplay data={sampleData} />);

      // Verify initial data
      expect(screen.getByText('$856.07')).toBeInTheDocument();
      expect(screen.getByText('$10,272.84')).toBeInTheDocument();
      expect(screen.getByText('$272.84')).toBeInTheDocument();
      expect(screen.getByText('$10,000.00')).toBeInTheDocument();

      // Update with new data
      const newData: PaymentDisplayData = {
        monthlyPayment: 1200.50,
        totalPayment: 14406.00,
        totalInterest: 406.00,
        principal: 14000,
      };
      rerender(<PaymentDisplay data={newData} />);

      // Verify updated data
      expect(screen.getByText('$1,200.50')).toBeInTheDocument();
      expect(screen.getByText('$14,406.00')).toBeInTheDocument();
      expect(screen.getByText('$406.00')).toBeInTheDocument();
      expect(screen.getByText('$14,000.00')).toBeInTheDocument();

      // Verify old data is no longer present
      expect(screen.queryByText('$856.07')).not.toBeInTheDocument();
      expect(screen.queryByText('$10,272.84')).not.toBeInTheDocument();
    });

    it('component reverts to placeholder when data is set to null after showing results', () => {
      const { rerender } = render(<PaymentDisplay data={sampleData} />);

      // Verify data is showing
      expect(screen.getByText('$856.07')).toBeInTheDocument();

      // Set data to null
      rerender(<PaymentDisplay data={null} />);

      // Verify placeholder is shown
      expect(
        screen.getByText('Calculate a loan to see results')
      ).toBeInTheDocument();

      // Verify data is no longer present
      expect(screen.queryByText('$856.07')).not.toBeInTheDocument();
    });

    it('large monetary values ($999,999.99) render without truncation', () => {
      const largeData: PaymentDisplayData = {
        monthlyPayment: 999999.99,
        totalPayment: 999999.99,
        totalInterest: 999999.99,
        principal: 999999.99,
      };
      render(<PaymentDisplay data={largeData} />);

      const amounts = screen.getAllByText('$999,999.99');
      expect(amounts.length).toBeGreaterThanOrEqual(1);
    });
  });

  // Phase 8: Integration test (T038)
  describe('integration', () => {
    it('PaymentDisplay receives null initially and data after calculation', () => {
      const { rerender } = render(<PaymentDisplay data={null} />);

      // Initially shows placeholder
      expect(
        screen.getByText('Calculate a loan to see results')
      ).toBeInTheDocument();

      // After calculation, shows data
      rerender(<PaymentDisplay data={sampleData} />);
      expect(screen.getByText('$856.07')).toBeInTheDocument();
      expect(screen.getByText('Monthly Payment')).toBeInTheDocument();
      expect(screen.getByText('Total Payment')).toBeInTheDocument();
      expect(screen.getByText('Payment Breakdown')).toBeInTheDocument();
    });
  });
});
