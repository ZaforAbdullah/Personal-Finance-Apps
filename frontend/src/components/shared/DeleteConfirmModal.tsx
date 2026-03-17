import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface DeleteConfirmModalProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  itemType: string;
  itemName: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({ visible, onHide, onConfirm, itemType, itemName, loading }: DeleteConfirmModalProps) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      style={{ width: '28rem' }}
      modal
      footer={null}
      header={`Delete ${itemType}?`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0.5rem 0 1.25rem' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#FEF2F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          <i className="pi pi-trash" style={{ fontSize: '1.375rem', color: 'var(--red)' }} />
        </div>
        <p style={{ color: 'var(--grey-500)', fontSize: '0.875rem', lineHeight: 1.7 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--grey-900)' }}>&ldquo;{itemName}&rdquo;</strong>?
          <br />This action cannot be undone.
        </p>
      </div>
      <Button
        label={`Delete ${itemType}`}
        onClick={onConfirm}
        loading={loading}
        className="modal-delete-btn"
      />
      <button onClick={onHide} disabled={loading} className="modal-cancel-link">
        Keep {itemType}
      </button>
    </Dialog>
  );
}
