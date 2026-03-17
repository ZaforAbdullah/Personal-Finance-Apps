import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { SORT_OPTIONS } from '@/types';

interface BillFiltersProps {
  search: string;
  sortBy: string;
  onSearchChange: (v: string) => void;
  onSortChange: (v: string) => void;
}

export default function BillFilters({ search, sortBy, onSearchChange, onSortChange }: BillFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
        <i className="pi pi-search" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#98908B', fontSize: '0.875rem', pointerEvents: 'none', zIndex: 1 }} />
        <InputText
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search bills"
          style={{ width: '100%', paddingLeft: '2.5rem', height: '2.875rem' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <span style={{ fontSize: '0.875rem', color: '#696868', whiteSpace: 'nowrap' }}>Sort by</span>
        <Dropdown value={sortBy} options={SORT_OPTIONS} onChange={(e) => onSortChange(e.value)} style={{ minWidth: 120, height: '2.875rem' }} />
      </div>
    </div>
  );
}
