import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Pot } from '@/types';
import { formatCurrencyAbs } from '@/lib/formatters';

interface PotMoneyFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (amount: number) => void;
  pot: Pot | null;
  mode: 'add' | 'withdraw';
  loading?: boolean;
}

export default function PotMoneyForm({ visible, onHide, onSubmit, pot, mode, loading }: PotMoneyFormProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState('');

  const isAdd = mode === 'add';
  const maxAddable = pot ? pot.target - pot.total : 0;
  const maxWithdrawable = pot ? pot.total : 0;

  const newTotal = pot
    ? isAdd
      ? Math.min(pot.target, pot.total + (amount || 0))
      : Math.max(0, pot.total - (amount || 0))
    : 0;

  const pct = pot && pot.target > 0 ? Math.min(100, (newTotal / pot.target) * 100) : 0;

  const validate = () => {
    if (!amount || amount <= 0) { setError('Amount must be greater than 0'); return false; }
    if (isAdd && amount > maxAddable) { setError(`Cannot exceed target. Max: ${formatCurrencyAbs(maxAddable)}`); return false; }
    if (!isAdd && amount > maxWithdrawable) { setError(`Cannot withdraw more than ${formatCurrencyAbs(maxWithdrawable)}`); return false; }
    return true;
  };

  const handleSubmit = () => {
    setError('');
    if (validate()) onSubmit(amount!);
  };

  if (!pot) return null;

  return (
    <Dialog
      header={isAdd ? `Add to '${pot.name}'` : `Withdraw from '${pot.name}'`}
      visible={visible}
      onHide={onHide}
      style={{ width: '32rem' }}
      modal
      footer={null}
    >
      <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem', marginBottom: '1.25rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
        {isAdd
          ? `Add money to your pot to bring you closer to your goal.`
          : `Withdraw money from your pot for any reason you need.`}
      </p>

      {/* Live progress preview */}
      <div style={{ background: '#F8F4F0', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#696868' }}>New Amount</span>
          <span style={{ fontWeight: 700, fontSize: '1.375rem' }}>{formatCurrencyAbs(newTotal)}</span>
        </div>
        <div className="budget-progress-bg">
          <div className="budget-progress-fill" style={{ width: `${pct}%`, background: pot.theme, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: pct >= 100 ? '#277C78' : '#201F24' }}>{pct.toFixed(1)}%</span>
          <span style={{ fontSize: '0.75rem', color: '#98908B' }}>Target of {formatCurrencyAbs(pot.target)}</span>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#98908B' }}>
          {isAdd ? `Max you can add: ${formatCurrencyAbs(maxAddable)}` : `Available to withdraw: ${formatCurrencyAbs(maxWithdrawable)}`}
        </div>
      </div>

      <div className="form-field" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label">Amount to {isAdd ? 'Add' : 'Withdraw'}</label>
        <InputNumber
          value={amount}
          onValueChange={(e) => { setAmount(e.value ?? null); setError(''); }}
          mode="decimal"
          minFractionDigits={2}
          maxFractionDigits={2}
          useGrouping={false}
          prefix="€ "
          style={{ width: '100%' }}
          min={0}
          placeholder="e.g. 100.00"
          className={error ? 'p-invalid' : ''}
          autoFocus
        />
        {error && <small className="form-error">{error}</small>}
      </div>

      <Button
        label={isAdd ? 'Confirm Addition' : 'Confirm Withdrawal'}
        onClick={handleSubmit}
        loading={loading}
        className="modal-submit-btn"
      />
      <button onClick={onHide} disabled={loading} className="modal-cancel-link">Cancel</button>
    </Dialog>
  );
}
