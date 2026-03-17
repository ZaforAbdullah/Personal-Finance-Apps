import React from 'react';
import { THEME_COLORS } from '@/types';
import { Dropdown } from 'primereact/dropdown';

interface ThemeColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  usedColors?: string[];
}

export default function ThemeColorPicker({ value, onChange, usedColors = [] }: ThemeColorPickerProps) {
  const options = THEME_COLORS.map((c) => ({
    ...c,
    disabled: usedColors.includes(c.value) && c.value !== value,
  }));

  const itemTemplate = (option: typeof options[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: option.disabled ? 0.4 : 1 }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: option.value, flexShrink: 0 }} />
      <span>{option.label}</span>
      {option.disabled && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#98908B' }}>Already used</span>}
    </div>
  );

  const valueTemplate = (option: typeof options[0] | null) => {
    if (!option) return <span>Select a color</span>;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: option.value }} />
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <Dropdown
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      optionLabel="label"
      optionValue="value"
      optionDisabled="disabled"
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
      placeholder="Select a color"
      className="w-full"
    />
  );
}
