import React from 'react';
import { RecurringBill } from '@/types';
import { formatCurrencyAbs, formatDueDay } from '@/lib/formatters';

interface BillListProps {
  bills: RecurringBill[];
  onEdit?: (bill: RecurringBill) => void;
  onDelete?: (bill: RecurringBill) => void;
}

export default function BillList({ bills, onEdit, onDelete }: BillListProps) {
  if (bills.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#98908B' }}>
        <i className="pi pi-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }} />
        <p>No bills found</p>
      </div>
    );
  }

  const hasActions = !!(onEdit || onDelete);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: hasActions ? '2fr 1fr 1fr auto' : '2fr 1fr 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #F2F2F2', color: '#98908B', fontSize: '0.75rem', fontWeight: 500 }}>
        <span>Bill Title</span>
        <span>Due Date</span>
        <span style={{ textAlign: 'right' }}>Amount</span>
        {hasActions && <span />}
      </div>
      {bills.map((bill) => (
        <div key={bill.id} style={{ display: 'grid', gridTemplateColumns: hasActions ? '2fr 1fr 1fr auto' : '2fr 1fr 1fr', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #F2F2F2' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{bill.name}</div>
          <div>
            <div style={{ fontSize: '0.875rem', color: bill.isDueSoon ? '#C94736' : bill.isPaid ? '#277C78' : '#696868', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {formatDueDay(bill.dueDay)}
              {bill.isDueSoon && <i className="pi pi-exclamation-triangle" style={{ fontSize: '0.75rem' }} />}
              {bill.isPaid && <i className="pi pi-check-circle" style={{ fontSize: '0.75rem' }} />}
            </div>
            {bill.isPaid && <div style={{ fontSize: '0.625rem', color: '#277C78', marginTop: '0.1rem' }}>Paid</div>}
            {bill.isDueSoon && !bill.isPaid && <div style={{ fontSize: '0.625rem', color: '#C94736', marginTop: '0.1rem' }}>Due Soon</div>}
          </div>
          <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: '#C94736' }}>
            {formatCurrencyAbs(bill.amount)}
          </div>
          {hasActions && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {onEdit && (
                <button
                  onClick={() => onEdit(bill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#696868', padding: '0.25rem' }}
                  title="Edit"
                >
                  <i className="pi pi-pencil" style={{ fontSize: '0.875rem' }} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(bill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C94736', padding: '0.25rem' }}
                  title="Delete"
                >
                  <i className="pi pi-trash" style={{ fontSize: '0.875rem' }} />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
