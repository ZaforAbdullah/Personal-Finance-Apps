import React, { useRef } from 'react';
import { Pot } from '@/types';
import { formatCurrencyAbs } from '@/lib/formatters';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';

interface PotCardProps {
  pot: Pot;
  onEdit: (pot: Pot) => void;
  onDelete: (id: string, name: string) => void;
  onAddMoney: (pot: Pot) => void;
  onWithdraw: (pot: Pot) => void;
}

export default function PotCard({ pot, onEdit, onDelete, onAddMoney, onWithdraw }: PotCardProps) {
  const menu = useRef<Menu>(null);

  const menuItems = [
    { label: 'Edit Pot', icon: 'pi pi-pencil', command: () => onEdit(pot) },
    { separator: true },
    { label: 'Delete Pot', icon: 'pi pi-trash', command: () => onDelete(pot.id, pot.name), className: 'menu-item-danger' },
  ];

  return (
    <div className="finance-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: pot.theme }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{pot.name}</h3>
        </div>
        <Menu model={menuItems} popup ref={menu} />
        <Button icon="pi pi-ellipsis-h" rounded text onClick={(e) => menu.current?.toggle(e)} aria-label="Options" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#696868' }}>Total Saved</span>
        <span style={{ fontSize: '2rem', fontWeight: 700 }}>{formatCurrencyAbs(pot.total)}</span>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div className="budget-progress-bg">
          <div className="budget-progress-fill" style={{ width: `${pot.percentage}%`, background: pot.theme }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#696868' }}>{pot.percentage.toFixed(1)}%</span>
        <span style={{ fontSize: '0.75rem', color: '#98908B' }}>Target of {formatCurrencyAbs(pot.target)}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Button label="+ Add Money" onClick={() => onAddMoney(pot)} className="pot-add-btn" />
        <Button label="Withdraw" onClick={() => onWithdraw(pot)} className="pot-withdraw-btn" />
      </div>
    </div>
  );
}
