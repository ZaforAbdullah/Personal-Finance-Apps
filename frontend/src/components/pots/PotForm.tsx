import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Pot, PotInput } from '@/types';
import ThemeColorPicker from '../shared/ThemeColorPicker';

interface PotFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (input: PotInput) => void;
  pot?: Pot | null;
  usedColors?: string[];
  loading?: boolean;
}

export default function PotForm({ visible, onHide, onSubmit, pot, usedColors = [], loading }: PotFormProps) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState<number | null>(null);
  const [theme, setTheme] = useState('#277C78');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pot) { setName(pot.name); setTarget(pot.target); setTheme(pot.theme); }
    else { setName(''); setTarget(null); setTheme('#277C78'); }
    setErrors({});
  }, [pot, visible]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Pot name is required';
    if (name.length > 30) e.name = 'Pot name must be 30 characters or fewer';
    if (!target || target <= 0) e.target = 'Target amount must be greater than 0';
    if (!theme) e.theme = 'Theme color is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <Dialog
      header={pot ? 'Edit Pot' : 'Add New Pot'}
      visible={visible}
      onHide={onHide}
      style={{ width: '32rem' }}
      modal
      footer={null}
    >
      <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem', marginBottom: '1.5rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
        {pot ? 'Update your pot details and savings target.' : 'Create a pot to set money aside for a specific goal.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-field">
          <label className="form-label">
            Pot Name
            <span style={{ color: '#98908B', fontWeight: 400, marginLeft: '0.5rem' }}>({name.length}/30 characters)</span>
          </label>
          <InputText
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
            placeholder="e.g. Rainy Days"
            style={{ width: '100%' }}
            maxLength={30}
            className={errors.name ? 'p-invalid' : ''}
          />
          {errors.name && <small className="form-error">{errors.name}</small>}
        </div>
        <div className="form-field">
          <label className="form-label">Target Amount</label>
          <InputNumber
            value={target}
            onValueChange={(e) => { setTarget(e.value ?? null); setErrors((p) => ({ ...p, target: '' })); }}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
            useGrouping={false}
            prefix="€ "
            style={{ width: '100%' }}
            min={0}
            placeholder="e.g. 2000.00"
            className={errors.target ? 'p-invalid' : ''}
          />
          {errors.target && <small className="form-error">{errors.target}</small>}
        </div>
        <div className="form-field">
          <label className="form-label">Theme</label>
          <ThemeColorPicker value={theme} onChange={setTheme} usedColors={usedColors} />
        </div>
        <Button
          label={pot ? 'Save Changes' : 'Add Pot'}
          onClick={() => { if (validate()) onSubmit({ name, target: target ?? 0, theme }); }}
          loading={loading}
          className="modal-submit-btn"
        />
        <button onClick={onHide} disabled={loading} className="modal-cancel-link">Cancel</button>
      </div>
    </Dialog>
  );
}
