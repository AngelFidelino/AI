import React, { useState } from 'react';
import { formatCurrency, formatNumber } from './Field.jsx';

const PaymentTable = ({ installments = [], animKey }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 12;

  if (!installments || installments.length === 0) {
    return <div />; // Empty when no data
  }

  const totalPages = Math.ceil(installments.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = installments.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const calculateProgress = (currentBalance, originalLoanAmount) => {
    if (!originalLoanAmount || parseFloat(originalLoanAmount) === 0) return 0;
    const principalPaid = parseFloat(originalLoanAmount) - parseFloat(currentBalance);
    return Math.min(Math.max((principalPaid / parseFloat(originalLoanAmount)) * 100, 0), 100);
  };

  // Get original loan amount from first installment
  const originalLoanAmount = installments[0]?.balance;

  return (
    <div key={animKey} className="anim3">
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: '0 0 16px 0'
      }}>
        Payment Schedule
      </h3>

      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Table */}
        <div style={{
          overflowX: 'auto',
          minWidth: '600px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#45556c',
                  borderBottom: '1px solid var(--border)'
                }}>
                  Period
                </th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#45556c',
                  borderBottom: '1px solid var(--border)'
                }}>
                  Principal
                </th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#45556c',
                  borderBottom: '1px solid var(--border)'
                }}>
                  Interest
                </th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#45556c',
                  borderBottom: '1px solid var(--border)'
                }}>
                  Balance
                </th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#45556c',
                  borderBottom: '1px solid var(--border)'
                }}>
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => {
                const isLastRow = index === currentRows.length - 1 && currentPage === totalPages - 1;
                const progress = calculateProgress(row.balance, originalLoanAmount);

                return (
                  <tr
                    key={startIndex + index}
                    style={{
                      backgroundColor: isLastRow ? 'linear-gradient(90deg,#f8fafc,#eef2ff)' : 'transparent',
                      transition: 'background-color 100ms ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLastRow) {
                        e.currentTarget.style.backgroundColor = '#fafbff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLastRow) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}>
                      {startIndex + index + 1}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}>
                      {formatCurrency(row.principal)}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid var(--border)',
                      textAlign: 'right'
                    }}>
                      {isLastRow ? (
                        <span style={{
                          backgroundColor: 'var(--badge-total-bg)',
                          color: 'var(--badge-total-text)',
                          fontWeight: '700',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '12px'
                        }}>
                          {formatCurrency(row.interest)}
                        </span>
                      ) : (
                        <span style={{
                          backgroundColor: 'var(--badge-interest-bg)',
                          color: 'var(--badge-interest-text)',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '12px'
                        }}>
                          {formatCurrency(row.interest)}
                        </span>
                      )}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      borderBottom: '1px solid var(--border)',
                      color: isLastRow ? 'var(--badge-total-text)' : 'var(--text-primary)',
                      fontWeight: isLastRow ? '700' : 'normal'
                    }}>
                      {formatCurrency(row.balance)}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid var(--border)',
                      verticalAlign: 'middle'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '64px',
                          height: '6px',
                          backgroundColor: '#f3f3f5',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: progress + '%',
                            height: '100%',
                            backgroundColor: 'var(--purple)',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          minWidth: '35px',
                          textAlign: 'right'
                        }}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                backgroundColor: currentPage === 0 ? '#f8fafc' : 'var(--white)',
                color: currentPage === 0 ? 'var(--text-placeholder)' : 'var(--text-primary)',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Previous
            </button>

            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                backgroundColor: currentPage === totalPages - 1 ? '#f8fafc' : 'var(--white)',
                color: currentPage === totalPages - 1 ? 'var(--text-placeholder)' : 'var(--text-primary)',
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTable;