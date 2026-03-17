import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { useQuery, useMutation } from '@apollo/client';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { GET_BUDGETS } from '@/graphql/queries';
import { CREATE_BUDGET, UPDATE_BUDGET, DELETE_BUDGET } from '@/graphql/mutations';
import { Budget, BudgetInput } from '@/types';
import BudgetCard from '@/components/budgets/BudgetCard';
import BudgetForm from '@/components/budgets/BudgetForm';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';

export default function BudgetsPage() {
  const toast = useRef<Toast>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, loading } = useQuery<{ budgets: Budget[] }>(GET_BUDGETS, { fetchPolicy: 'cache-and-network' });
  const budgets = data?.budgets ?? [];
  const usedCategories = budgets.map((b) => b.category);
  const usedColors = budgets.map((b) => b.theme);

  const [createBudget, { loading: creating }] = useMutation(CREATE_BUDGET, {
    refetchQueries: [{ query: GET_BUDGETS }],
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Budget created' }); setFormVisible(false); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [updateBudget, { loading: updating }] = useMutation(UPDATE_BUDGET, {
    refetchQueries: [{ query: GET_BUDGETS }],
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Budget updated' }); setFormVisible(false); setEditBudget(null); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [deleteBudget, { loading: deleting }] = useMutation(DELETE_BUDGET, {
    refetchQueries: [{ query: GET_BUDGETS }],
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Budget deleted' }); setDeleteTarget(null); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const handleSubmit = async (input: BudgetInput) => {
    if (editBudget) await updateBudget({ variables: { id: editBudget.id, input } });
    else await createBudget({ variables: { input } });
  };

  const handleEdit = (budget: Budget) => { setEditBudget(budget); setFormVisible(true); };
  const handleAdd = () => { setEditBudget(null); setFormVisible(true); };

  if (loading && !data) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><ProgressSpinner /></div>;

  return (
    <>
      <Head><title>Budgets | Finance App</title></Head>
      <Toast ref={toast} />
      <div className="page-header">
        <h1 className="page-title">Budgets</h1>
        <Button label="+ Add New Budget" onClick={handleAdd} className="cta-btn" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Donut summary */}
        <div className="finance-card" style={{ position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.5rem' }}>Spending Summary</h3>
          {budgets.length > 0 && (() => {
            const size = 240;
            const cx = size / 2; const cy = size / 2;
            const outerR = 100; const innerR = 68;
            const total = budgets.reduce((s, b) => s + b.maximum, 0);
            let angle = -Math.PI / 2;
            const segs = budgets.map((b) => {
              const frac = total > 0 ? b.maximum / total : 0;
              const da = frac * 2 * Math.PI;
              const start = angle; angle += da; const end = angle;
              const x1 = cx + outerR * Math.cos(start); const y1 = cy + outerR * Math.sin(start);
              const x2 = cx + outerR * Math.cos(end); const y2 = cy + outerR * Math.sin(end);
              const x3 = cx + innerR * Math.cos(end); const y3 = cy + innerR * Math.sin(end);
              const x4 = cx + innerR * Math.cos(start); const y4 = cy + innerR * Math.sin(start);
              const la = da > Math.PI ? 1 : 0;
              return { d: `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${la} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${la} 0 ${x4} ${y4} Z`, color: b.theme, id: b.id };
            });
            const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
            const totalLimit = budgets.reduce((s, b) => s + b.maximum, 0);
            return (
              <>
                <div style={{ position: 'relative', width: size, height: size, margin: '0 auto 1.5rem' }}>
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{segs.map(s => <path key={s.id} d={s.d} fill={s.color} />)}</svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.375rem' }}>€{totalSpent.toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#98908B' }}>of €{totalLimit.toFixed(2)} limit</div>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Spending Summary</h4>
                  {budgets.map((b) => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F2F2F2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 4, height: 24, borderRadius: 2, background: b.theme }} />
                        <span style={{ fontSize: '0.875rem', color: '#696868' }}>{b.category}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        <span style={{ fontWeight: 700 }}>€{b.spent.toFixed(2)}</span>
                        <span style={{ color: '#98908B' }}> of €{b.maximum.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
          {budgets.length === 0 && <p style={{ color: '#98908B', textAlign: 'center' }}>No budgets yet</p>}
        </div>
        {/* Right: Budget cards */}
        <div>
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={(id, category) => setDeleteTarget({ id, name: category })}
            />
          ))}
          {budgets.length === 0 && (
            <div className="finance-card" style={{ textAlign: 'center', padding: '3rem', color: '#98908B' }}>
              <i className="pi pi-chart-pie" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }} />
              <p>No budgets yet. Click &ldquo;Add New Budget&rdquo; to get started.</p>
            </div>
          )}
        </div>
      </div>
      <BudgetForm
        visible={formVisible}
        onHide={() => { setFormVisible(false); setEditBudget(null); }}
        onSubmit={handleSubmit}
        budget={editBudget}
        usedCategories={usedCategories}
        usedColors={usedColors}
        loading={creating || updating}
      />
      <DeleteConfirmModal
        visible={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteBudget({ variables: { id: deleteTarget.id } })}
        itemType="Budget"
        itemName={deleteTarget?.name ?? ''}
        loading={deleting}
      />
    </>
  );
}
