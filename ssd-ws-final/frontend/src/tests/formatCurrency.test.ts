import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats standard currency value correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats zero value as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats large value with comma separators', () => {
    expect(formatCurrency(999999.99)).toBe('$999,999.99');
  });

  it('pads single decimal place to two decimal places', () => {
    expect(formatCurrency(850.1)).toBe('$850.10');
  });

  it('formats minimum non-zero value', () => {
    expect(formatCurrency(0.01)).toBe('$0.01');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(1234.567)).toBe('$1,234.57');
  });

  it('formats whole number with .00', () => {
    expect(formatCurrency(10000)).toBe('$10,000.00');
  });

  it('formats typical monthly payment value', () => {
    expect(formatCurrency(856.07)).toBe('$856.07');
  });

  it('formats typical total payment value', () => {
    expect(formatCurrency(10272.84)).toBe('$10,272.84');
  });
});
