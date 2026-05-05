const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class APIService {
  async calculateLoan(amount, rate, term) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/calculate-loan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          rate: parseFloat(rate),
          term: parseInt(term)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error calculating loan');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        const newError = new Error('Server error: Invalid response format');
        newError.cause = error;
        throw newError;
      }
      throw error;
    }
  }
}

export default new APIService();