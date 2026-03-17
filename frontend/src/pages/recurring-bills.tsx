import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { useQuery, useMutation } from '@apollo/client';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { GET_RECURRING_BILLS } from '@/graphql/queries';
import { CREATE_RECURRING_BILL, UPDATE_RECURRING_BILL, DELETE_RECURRING_BILL } from '@/graphql/mutations';
import { RecurringBill } from '@/types';
import BillList from '@/components/bills/BillList';
import BillFilters from '@/components/bills/BillFilters';
import RecurringBillForm from '@/components/bills/RecurringBillForm';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { formatCurrencyAbs } from '@/lib/formatters';

export default function RecurringBillsPage() {
  const toast = useRef<Toast>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [formVisible, setFormVisible] = useState(false);
  const [editingBill, setEditingBill] = useState<RecurringBill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecurringBill | null>(null);

  const { data, loading, error } = useQuery<{ recurringBills: RecurringBill[] }>(GET_RECURRING_BILLS, {
    variables: { search: search || undefined, sortBy },
    fetchPolicy: 'cache-and-network',
  });

  const refetchVars = { query: GET_RECURRING_BILLS, variables: { sortBy: 'latest' } };

  const [createBill, { loading: creating }] = useMutation(CREATE_RECURRING_BILL, {
    refetchQueries: [refetchVars],
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Bill added' }); setFormVisible(false); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [updateBill, { loading: updating }] = useMutation(UPDATE_RECURRING_BILL, {
    refetchQueries: [refetchVars],
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Bill updated' }); setEditingBill(null); setFormVisible(false); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [deleteBill, { loading: deleting }] = useMutation(DELETE_RECURRING_BILL, {
    refetchQueries: [refetchVars],
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Bill deleted' }); setDeleteTarget(null); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const handleEdit = (bill: RecurringBill) => { setEditingBill(bill); setFormVisible(true); };
  const handleHide = () => { setFormVisible(false); setEditingBill(null); };
  const handleSubmit = (input: any) => {
    if (editingBill) updateBill({ variables: { id: editingBill.id, input } });
    else createBill({ variables: { input } });
  };

  const bills = data?.recurringBills ?? [];
  const paid = bills.filter((b) => b.isPaid);
  const upcoming = bills.filter((b) => !b.isPaid);
  const dueSoon = bills.filter((b) => b.isDueSoon);

  const totalPaid = paid.reduce((s, b) => s + Math.abs(b.amount), 0);
  const totalUpcoming = upcoming.reduce((s, b) => s + Math.abs(b.amount), 0);
  const totalDueSoon = dueSoon.reduce((s, b) => s + Math.abs(b.amount), 0);

  return (
    <>
      <Head><title>Recurring Bills | Finance App</title></Head>
      <Toast ref={toast} />
      <div className="page-header">
        <h1 className="page-title">Recurring Bills</h1>
        <Button label="+ Add New Bill" onClick={() => { setEditingBill(null); setFormVisible(true); }} className="cta-btn" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left sidebar summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="finance-card-dark">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>💳</div>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Total Bills</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{formatCurrencyAbs(totalPaid + totalUpcoming)}</div>
          </div>
          <div className="finance-card">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Summary</h3>
            {[
              { label: 'Paid Bills', value: totalPaid, count: paid.length, color: '#277C78' },
              { label: 'Total Upcoming', value: totalUpcoming, count: upcoming.length, color: '#F2CDAC' },
              { label: 'Due Soon', value: totalDueSoon, count: dueSoon.length, color: '#C94736' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid #F2F2F2' }}>
                <span style={{ fontSize: '0.875rem', color: '#696868' }}>{item.label}</span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: item.color }}>{formatCurrencyAbs(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right: bill list */}
        <div className="finance-card">
          <BillFilters search={search} sortBy={sortBy} onSearchChange={setSearch} onSortChange={setSortBy} />
          {loading && !data && <div style={{ textAlign: 'center', padding: '2rem' }}><ProgressSpinner style={{ width: 40, height: 40 }} /></div>}
          {error && <Message severity="error" text={`Error: ${error.message}`} />}
          {data && <BillList bills={bills} onEdit={handleEdit} onDelete={(bill) => setDeleteTarget(bill)} />}
        </div>
      </div>
      <RecurringBillForm
        visible={formVisible}
        onHide={handleHide}
        onSubmit={handleSubmit}
        bill={editingBill}
        loading={creating || updating}
      />
      <DeleteConfirmModal
        visible={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteBill({ variables: { id: deleteTarget.id } })}
        itemType="Bill"
        itemName={deleteTarget?.name ?? ''}
        loading={deleting}
      />
    </>
  );
}
