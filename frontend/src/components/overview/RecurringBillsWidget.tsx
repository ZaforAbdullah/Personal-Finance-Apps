import React from 'react';
import Link from 'next/link';
import { BillsSummary } from '@/types';
import { formatCurrencyAbs } from '@/lib/formatters';

interface RecurringBillsWidgetProps {
  billsSummary: BillsSummary;
}

export default function RecurringBillsWidget({ billsSummary }: RecurringBillsWidgetProps) {
  const items = [
    { label: 'Paid Bills', amount: billsSummary.totalPaid, color: '#277C78' },
    { label: 'Total Upcoming', amount: billsSummary.totalUpcoming, color: '#F2CDAC' },
    { label: 'Due Soon', amount: billsSummary.dueSoon, color: '#C94736' },
  ];
  return (
    <div className="finance-card">
      <div className="card-header">
        <span className="card-title">Recurring Bills</span>
        <Link href="/recurring-bills" className="card-link">See Details <i className="pi pi-arrow-right" style={{ fontSize: '0.75rem' }} /></Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8F4F0', borderRadius: 8, borderLeft: `4px solid ${item.color}` }}>
            <span style={{ fontSize: '0.875rem', color: '#696868' }}>{item.label}</span>
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrencyAbs(item.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
