import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Budget, Transaction } from '@/types';
import { formatCurrencyAbs, formatDate } from '@/lib/formatters';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import Avatar from '../shared/Avatar';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string, category: string) => void;
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const menu = useRef<Menu>(null);
  const pct = Math.min(100, (budget.spent / budget.maximum) * 100);

  const menuItems = [
    { label: 'Edit Budget', icon: 'pi pi-pencil', command: () => onEdit(budget) },
    { separator: true },
    { label: 'Delete Budget', icon: 'pi pi-trash', command: () => onDelete(budget.id, budget.category), className: 'menu-item-danger' },
  ];

  const latestTxns = budget.transactions.slice(0, 3);

  return (
    <div className="finance-card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: budget.theme }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{budget.category}</h3>
        </div>
        <Menu model={menuItems} popup ref={menu} />
        <Button icon="pi pi-ellipsis-h" rounded text onClick={(e) => menu.current?.toggle(e)} aria-label="Options" />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#696868' }}>Maximum of {formatCurrencyAbs(budget.maximum)}</span>
        </div>
        <div className="budget-progress-bg">
          <div className="budget-progress-fill" style={{ width: `${pct}%`, background: budget.theme }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#98908B', marginBottom: '0.25rem' }}>Spent</div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrencyAbs(budget.spent)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#98908B', marginBottom: '0.25rem' }}>Remaining</div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrencyAbs(budget.remaining)}</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#F8F4F0', borderRadius: 12, padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Latest Spending</span>
          <Link href="/transactions" style={{ fontSize: '0.75rem', color: '#696868', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
            See All <i className="pi pi-arrow-right" style={{ fontSize: '0.625rem' }} />
          </Link>
        </div>
        {latestTxns.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#98908B', textAlign: 'center' }}>No transactions this month</p>
        ) : (
          latestTxns.map((t: Transaction) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #E5E5E5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Avatar name={t.name} avatarUrl={t.avatarUrl} size={32} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{formatCurrencyAbs(t.amount)}</div>
                <div style={{ fontSize: '0.625rem', color: '#98908B' }}>{formatDate(t.date)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
