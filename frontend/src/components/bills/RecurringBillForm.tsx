import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { RecurringBill, CATEGORIES } from '@/types';

interface RecurringBillInput {
  name: string;
  category: string;
  amount: number;
  dueDay: number;
}

interface RecurringBillFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (input: RecurringBillInput) => void;
  bill?: RecurringBill | null;
  loading?: boolean;
}

const availableCategories = CATEGORIES.filter((c) => c !== 'All Transactions');
const DUE_DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => ({ label: `${i + 1}${ordinal(i + 1)} of month`, value: i + 1 }));

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default function RecurringBillForm({ visible, onHide, onSubmit, bill, loading }: RecurringBillFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [dueDay, setDueDay] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bill) {
      setName(bill.name);
      setCategory(bill.category);
      setAmount(Math.abs(bill.amount));
      setDueDay(bill.dueDay);
    } else {
      setName(''); setCategory(''); setAmount(null); setDueDay(1);
    }
    setErrors({});
  }, [bill, visible]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Bill name is required';
    if (!category) e.category = 'Category is required';
    if (!amount || amount <= 0) e.amount = 'Amount must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim(), category, amount: -Math.abs(amount!), dueDay });
  };

  const isEdit = !!bill;

  return (
    <Dialog
      header={isEdit ? 'Edit Recurring Bill' : 'Add Recurring Bill'}
      visible={visible}
      onHide={onHide}
      style={{ width: '32rem' }}
      modal
      footer={null}
    >
      <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem', marginBottom: '1.5rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
        {isEdit ? 'Update the details for this recurring bill.' : 'Track a bill that repeats monthly on a set day.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-field">
          <label className="form-label">Bill Name</label>
          <InputText
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
            placeholder="e.g. Netflix Subscription"
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-field">
            <label className="form-label">Monthly Amount</label>
            <InputNumber
              value={amount}
              onValueChange={(e) => { setAmount(e.value ?? null); setErrors((p) => ({ ...p, amount: '' })); }}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              useGrouping={false}
              prefix="€ "
              style={{ width: '100%' }}
              min={0}
              placeholder="e.g. 9.99"
              className={errors.amount ? 'p-invalid' : ''}
            />
            {errors.amount && <small className="form-error">{errors.amount}</small>}
          </div>
          <div className="form-field">
            <label className="form-label">Due Day</label>
            <Dropdown
              value={dueDay}
              options={DUE_DAY_OPTIONS}
              onChange={(e) => setDueDay(e.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <Button
          label={isEdit ? 'Save Changes' : 'Add Bill'}
          onClick={handleSubmit}
          loading={loading}
          className="modal-submit-btn"
        />
        <button onClick={onHide} disabled={loading} className="modal-cancel-link">Cancel</button>
      </div>
    </Dialog>
  );
}
