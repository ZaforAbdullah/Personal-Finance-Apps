import React from 'react';
import Link from 'next/link';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import Avatar from '../shared/Avatar';

interface TransactionsWidgetProps {
  transactions: Transaction[];
}

export default function TransactionsWidget({ transactions }: TransactionsWidgetProps) {
  return (
    <div className="finance-card">
      <div className="card-header">
        <span className="card-title">Transactions</span>
        <Link href="/transactions" className="card-link">View All <i className="pi pi-arrow-right" style={{ fontSize: '0.75rem' }} /></Link>
      </div>
      {transactions.map((t) => (
        <div key={t.id} className="transaction-item">
          <div className="transaction-info">
            <Avatar name={t.name} avatarUrl={t.avatarUrl} />
            <div>
              <div className="transaction-name">{t.name}</div>
              <div className="transaction-category">{t.category}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={`transaction-amount ${t.amount > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(t.amount)}
            </div>
            <div className="transaction-date">{formatDate(t.date)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
