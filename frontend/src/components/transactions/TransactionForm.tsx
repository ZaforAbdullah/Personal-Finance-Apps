import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { CATEGORIES } from '@/types';

interface TransactionInput {
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

interface TransactionFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (input: TransactionInput) => void;
  loading?: boolean;
}

const availableCategories = CATEGORIES.filter((c) => c !== 'All Transactions');

export default function TransactionForm({ visible, onHide, onSubmit, loading }: TransactionFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<number | null>(null);
  const [isExpense, setIsExpense] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setName(''); setCategory(''); setDate(new Date());
      setAmount(null); setIsExpense(true); setRecurring(false); setErrors({});
    }
  }, [visible]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Recipient / sender name is required';
    if (!category) e.category = 'Category is required';
    if (!amount || amount <= 0) e.amount = 'Amount must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      category,
      date: date.toISOString(),
      amount: isExpense ? -Math.abs(amount!) : Math.abs(amount!),
      recurring,
    });
  };

  return (
    <Dialog
      header="Add New Transaction"
      visible={visible}
      onHide={onHide}
      style={{ width: '32rem' }}
      modal
      footer={null}
    >
      <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem', marginBottom: '1.5rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
        Record a new income or expense transaction.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-field">
          <label className="form-label">Recipient / Sender</label>
          <InputText
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
            placeholder="e.g. Emma Richardson"
            style={{ width: '100%' }}
            className={errors.name ? 'p-invalid' : ''}
          />
          {errors.name && <small className="form-error">{errors.name}</small>}
        </div>

        <div className="form-field">
          <label className="form-label">Category</label>
          <Dropdown
            value={category}
            options={availableCategories}
            onChange={(e) => { setCategory(e.value); setErrors((p) => ({ ...p, category: '' })); }}
            placeholder="Select a category"
            style={{ width: '100%' }}
            className={errors.category ? 'p-invalid' : ''}
          />
          {errors.category && <small className="form-error">{errors.category}</small>}
        </div>

        <div className="form-field">
          <label className="form-label">Transaction Date</label>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value as Date)}
            showIcon
            dateFormat="dd M yy"
            maxDate={new Date()}
            style={{ width: '100%' }}
            inputStyle={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-field">
            <label className="form-label">Amount</label>
            <InputNumber
              value={amount ?? null}
              onValueChange={(e) => { setAmount(e.value ?? null); setErrors((p) => ({ ...p, amount: '' })); }}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              useGrouping={false}
              prefix="€ "
              style={{ width: '100%' }}
              min={0}
              placeholder="0.00"
              className={errors.amount ? 'p-invalid' : ''}
            />
            {errors.amount && <small className="form-error">{errors.amount}</small>}
          </div>
          <div className="form-field">
            <label className="form-label">Type</label>
            <Dropdown
              value={isExpense}
              options={[
                { label: 'Expense (−)', value: true },
                { label: 'Income (+)', value: false },
              ]}
              onChange={(e) => setIsExpense(e.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Checkbox
            inputId="recurring"
            checked={recurring}
            onChange={(e) => setRecurring(e.checked ?? false)}
          />
          <label htmlFor="recurring" style={{ fontSize: '0.875rem', color: '#696868', cursor: 'pointer' }}>
            This is a recurring transaction
          </label>
        </div>

        <Button
          label="Add Transaction"
          onClick={handleSubmit}
          loading={loading}
          className="modal-submit-btn"
        />
        <button onClick={onHide} disabled={loading} className="modal-cancel-link">Cancel</button>
      </div>
    </Dialog>
  );
}
