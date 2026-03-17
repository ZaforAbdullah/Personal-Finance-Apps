import React from 'react';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import Avatar from '../shared/Avatar';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#98908B' }}>
        <i className="pi pi-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }} />
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #F2F2F2', color: '#98908B', fontSize: '0.75rem', fontWeight: 500 }}>
        <span>Recipient / Sender</span>
        <span>Category</span>
        <span>Transaction Date</span>
        <span style={{ textAlign: 'right' }}>Amount</span>
      </div>
      {transactions.map((t) => (
        <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #F2F2F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Avatar name={t.name} avatarUrl={t.avatarUrl} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
              {t.recurring && <div style={{ fontSize: '0.75rem', color: '#277C78', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><i className="pi pi-refresh" style={{ fontSize: '0.625rem' }} />Recurring</div>}
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#696868' }}>{t.category}</div>
          <div style={{ fontSize: '0.875rem', color: '#696868' }}>{formatDate(t.date)}</div>
          <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: t.amount > 0 ? '#277C78' : '#201F24' }}>
            {formatCurrency(t.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
