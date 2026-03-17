import React from 'react';
import { Balance } from '@/types';
import { formatCurrencyAbs } from '@/lib/formatters';

interface BalanceCardsProps {
  balance: Balance;
}

export default function BalanceCards({ balance }: BalanceCardsProps) {
  return (
    <div className="balance-grid">
      <div className="balance-card current">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">{formatCurrencyAbs(balance.current)}</div>
      </div>
      <div className="balance-card income">
        <div className="balance-label" style={{ color: '#696868' }}>Income</div>
        <div className="balance-amount">{formatCurrencyAbs(balance.income)}</div>
      </div>
      <div className="balance-card expenses">
        <div className="balance-label" style={{ color: '#696868' }}>Expenses</div>
        <div className="balance-amount">{formatCurrencyAbs(balance.expenses)}</div>
      </div>
    </div>
  );
}
