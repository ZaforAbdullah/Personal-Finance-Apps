import React from 'react';
import Link from 'next/link';
import { Budget } from '@/types';
import { formatCurrencyAbs } from '@/lib/formatters';

interface BudgetsWidgetProps {
  budgets: Budget[];
}

function DonutChart({ budgets }: { budgets: Budget[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 80;
  const innerR = 55;
  const totalMax = budgets.reduce((s, b) => s + b.maximum, 0);
  let currentAngle = -Math.PI / 2;

  const segments = budgets.map((b) => {
    const fraction = totalMax > 0 ? b.maximum / totalMax : 0;
    const angle = fraction * 2 * Math.PI;
    const startAngle = currentAngle;
    currentAngle += angle;
    const endAngle = currentAngle;

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    return { d, color: b.theme, key: b.id };
  });

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.maximum, 0);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg) => (
          <path key={seg.key} d={seg.d} fill={seg.color} />
        ))}
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '1.375rem' }}>{formatCurrencyAbs(totalSpent)}</div>
        <div style={{ fontSize: '0.75rem', color: '#98908B' }}>of {formatCurrencyAbs(totalLimit)} limit</div>
      </div>
    </div>
  );
}

export default function BudgetsWidget({ budgets }: BudgetsWidgetProps) {
  return (
    <div className="finance-card">
      <div className="card-header">
        <span className="card-title">Budgets</span>
        <Link href="/budgets" className="card-link">See Details <i className="pi pi-arrow-right" style={{ fontSize: '0.75rem' }} /></Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <DonutChart budgets={budgets} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {budgets.map((b) => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 4, height: 36, borderRadius: 2, background: b.theme }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#98908B' }}>{b.category}</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrencyAbs(b.spent)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
