import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { useQuery, useMutation } from '@apollo/client';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { GET_POTS } from '@/graphql/queries';
import { CREATE_POT, UPDATE_POT, DELETE_POT, ADD_MONEY_TO_POT, WITHDRAW_FROM_POT } from '@/graphql/mutations';
import { Pot, PotInput } from '@/types';
import PotCard from '@/components/pots/PotCard';
import PotForm from '@/components/pots/PotForm';
import PotMoneyForm from '@/components/pots/PotMoneyForm';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';

export default function PotsPage() {
  const toast = useRef<Toast>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editPot, setEditPot] = useState<Pot | null>(null);
  const [moneyFormVisible, setMoneyFormVisible] = useState(false);
  const [moneyMode, setMoneyMode] = useState<'add' | 'withdraw'>('add');
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, loading } = useQuery<{ pots: Pot[] }>(GET_POTS, { fetchPolicy: 'cache-and-network' });
  const pots = data?.pots ?? [];
  const usedColors = pots.map((p) => p.theme);

  const refetch = [{ query: GET_POTS }];

  const [createPot, { loading: creating }] = useMutation(CREATE_POT, {
    refetchQueries: refetch,
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Pot created' }); setFormVisible(false); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [updatePot, { loading: updating }] = useMutation(UPDATE_POT, {
    refetchQueries: refetch,
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Pot updated' }); setFormVisible(false); setEditPot(null); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [deletePot, { loading: deleting }] = useMutation(DELETE_POT, {
    refetchQueries: refetch,
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Pot deleted' }); setDeleteTarget(null); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [addMoney, { loading: adding }] = useMutation(ADD_MONEY_TO_POT, {
    refetchQueries: refetch,
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Money added' }); setMoneyFormVisible(false); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const [withdrawMoney, { loading: withdrawing }] = useMutation(WITHDRAW_FROM_POT, {
    refetchQueries: refetch,
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Money withdrawn' }); setMoneyFormVisible(false); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const handleSubmit = async (input: PotInput) => {
    if (editPot) await updatePot({ variables: { id: editPot.id, input } });
    else await createPot({ variables: { input } });
  };

  const handleMoneySubmit = async (amount: number) => {
    if (!selectedPot) return;
    if (moneyMode === 'add') await addMoney({ variables: { id: selectedPot.id, amount } });
    else await withdrawMoney({ variables: { id: selectedPot.id, amount } });
  };

  if (loading && !data) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><ProgressSpinner /></div>;

  return (
    <>
      <Head><title>Pots | Finance App</title></Head>
      <Toast ref={toast} />
      <div className="page-header">
        <h1 className="page-title">Pots</h1>
        <Button label="+ Add New Pot" onClick={() => { setEditPot(null); setFormVisible(true); }} className="cta-btn" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {pots.map((pot) => (
          <PotCard
            key={pot.id}
            pot={pot}
            onEdit={(p) => { setEditPot(p); setFormVisible(true); }}
            onDelete={(id, name) => setDeleteTarget({ id, name })}
            onAddMoney={(p) => { setSelectedPot(p); setMoneyMode('add'); setMoneyFormVisible(true); }}
            onWithdraw={(p) => { setSelectedPot(p); setMoneyMode('withdraw'); setMoneyFormVisible(true); }}
          />
        ))}
        {pots.length === 0 && (
          <div className="finance-card" style={{ textAlign: 'center', padding: '3rem', color: '#98908B', gridColumn: '1 / -1' }}>
            <i className="pi pi-wallet" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }} />
            <p>No pots yet. Click &ldquo;Add New Pot&rdquo; to start saving!</p>
          </div>
        )}
      </div>
      <PotForm visible={formVisible} onHide={() => { setFormVisible(false); setEditPot(null); }} onSubmit={handleSubmit} pot={editPot} usedColors={usedColors} loading={creating || updating} />
      <PotMoneyForm visible={moneyFormVisible} onHide={() => setMoneyFormVisible(false)} onSubmit={handleMoneySubmit} pot={selectedPot} mode={moneyMode} loading={adding || withdrawing} />
      <DeleteConfirmModal
        visible={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deletePot({ variables: { id: deleteTarget.id } })}
        itemType="Pot"
        itemName={deleteTarget?.name ?? ''}
        loading={deleting}
      />
    </>
  );
}
