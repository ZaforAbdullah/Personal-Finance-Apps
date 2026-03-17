import React from 'react';
import Link from 'next/link';
import { Pot } from '@/types';
import { formatCurrencyAbs } from '@/lib/formatters';

interface PotsWidgetProps {
  pots: Pot[];
}

export default function PotsWidget({ pots }: PotsWidgetProps) {
  const totalSaved = pots.reduce((s, p) => s + p.total, 0);
  const displayPots = pots.slice(0, 4);

  return (
    <div className="finance-card">
      <div className="card-header">
        <span className="card-title">Pots</span>
        <Link href="/pots" className="card-link">See Details <i className="pi pi-arrow-right" style={{ fontSize: '0.75rem' }} /></Link>
      </div>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <div style={{ background: '#F8F4F0', borderRadius: 12, padding: '1.25rem', minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🏦</div>
          <div style={{ fontSize: '0.75rem', color: '#98908B', marginBottom: '0.25rem' }}>Total Saved</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrencyAbs(totalSaved)}</div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {displayPots.map((pot) => (
            <div key={pot.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 4, height: 40, borderRadius: 2, background: pot.theme, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#98908B' }}>{pot.name}</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrencyAbs(pot.total)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
