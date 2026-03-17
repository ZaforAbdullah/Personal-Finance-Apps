import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Budget, BudgetInput, CATEGORIES } from '@/types';
import ThemeColorPicker from '../shared/ThemeColorPicker';

interface BudgetFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (input: BudgetInput) => void;
  budget?: Budget | null;
  usedCategories?: string[];
  usedColors?: string[];
  loading?: boolean;
}

export default function BudgetForm({ visible, onHide, onSubmit, budget, usedCategories = [], usedColors = [], loading }: BudgetFormProps) {
  const [category, setCategory] = useState('');
  const [maximum, setMaximum] = useState<number | null>(null);
  const [theme, setTheme] = useState('#277C78');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setMaximum(budget.maximum);
      setTheme(budget.theme);
    } else {
      setCategory('');
      setMaximum(null);
      setTheme('#277C78');
    }
    setErrors({});
  }, [budget, visible]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!category) e.category = 'Category is required';
    if (!maximum || maximum <= 0) e.maximum = 'Maximum must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isEdit = !!budget;
  const availableCategories = CATEGORIES.filter(
    (c) => c !== 'All Transactions' && (!usedCategories.includes(c) || c === budget?.category)
  );

  return (
    <Dialog
      header={isEdit ? 'Edit Budget' : 'Add New Budget'}
      visible={visible}
      onHide={onHide}
      style={{ width: '32rem' }}
      modal
      footer={null}
    >
      <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem', marginBottom: '1.5rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
        {isEdit
          ? 'Update your budget spending limit and appearance.'
          : 'Choose a category to set a spending budget. These categories can help you monitor spending.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-field">
          <label className="form-label">Budget Category</label>
          <Dropdown
            value={category}
            options={availableCategories}
            onChange={(e) => { setCategory(e.value); setErrors((p) => ({ ...p, category: '' })); }}
            placeholder="Select a category"
            style={{ width: '100%' }}
            disabled={isEdit}
            className={errors.category ? 'p-invalid' : ''}
          />
          {errors.category && <small className="form-error">{errors.category}</small>}
        </div>
        <div className="form-field">
          <label className="form-label">Maximum Spend</label>
          <InputNumber
            value={maximum}
            onValueChange={(e) => { setMaximum(e.value ?? null); setErrors((p) => ({ ...p, maximum: '' })); }}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
            useGrouping={false}
            prefix="€ "
            style={{ width: '100%' }}
            min={0}
            placeholder="e.g. 500.00"
            className={errors.maximum ? 'p-invalid' : ''}
          />
          {errors.maximum && <small className="form-error">{errors.maximum}</small>}
        </div>
        <div className="form-field">
          <label className="form-label">Theme</label>
          <ThemeColorPicker value={theme} onChange={setTheme} usedColors={usedColors} />
        </div>
        <Button
          label={isEdit ? 'Save Changes' : 'Add Budget'}
          onClick={() => { if (validate()) onSubmit({ category, maximum: maximum ?? 0, theme }); }}
          loading={loading}
          className="modal-submit-btn"
        />
        <button onClick={onHide} disabled={loading} className="modal-cancel-link">
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
