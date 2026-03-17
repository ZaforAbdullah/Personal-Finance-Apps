import React, { useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useQuery, useMutation } from '@apollo/client';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { GET_TRANSACTIONS } from '@/graphql/queries';
import { CREATE_TRANSACTION } from '@/graphql/mutations';
import { TransactionPage } from '@/types';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionForm from '@/components/transactions/TransactionForm';

export default function TransactionsPage() {
  const toast = useRef<Toast>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Transactions');
  const [sortBy, setSortBy] = useState('latest');
  const limit = 10;

  const { data, loading, error } = useQuery<{ transactions: TransactionPage }>(GET_TRANSACTIONS, {
    variables: { page, limit, search: search || undefined, category: category === 'All Transactions' ? undefined : category, sortBy },
    fetchPolicy: 'cache-and-network',
  });

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS, variables: { page: 1, limit, sortBy: 'latest' } }],
    onCompleted: () => { toast.current?.show({ severity: 'success', summary: 'Transaction added' }); setFormVisible(false); },
    onError: (e) => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message }),
  });

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);
  const handleCategory = useCallback((v: string) => { setCategory(v); setPage(1); }, []);
  const handleSort = useCallback((v: string) => { setSortBy(v); setPage(1); }, []);

  return (
    <>
      <Head><title>Transactions | Finance App</title></Head>
      <Toast ref={toast} />
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <Button label="+ Add Transaction" onClick={() => setFormVisible(true)} className="cta-btn" />
      </div>
      <div className="finance-card">
        <TransactionFilters search={search} category={category} sortBy={sortBy} onSearchChange={handleSearch} onCategoryChange={handleCategory} onSortChange={handleSort} />
        {loading && !data && <div style={{ textAlign: 'center', padding: '2rem' }}><ProgressSpinner style={{ width: 40, height: 40 }} /></div>}
        {error && <Message severity="error" text={`Error: ${error.message}`} />}
        {data && <TransactionList transactions={data.transactions.transactions} />}
        {data && data.transactions.totalPages > 1 && (
          <Paginator
            first={(page - 1) * limit}
            rows={limit}
            totalRecords={data.transactions.total}
            onPageChange={(e: PaginatorPageChangeEvent) => setPage(e.page + 1)}
            style={{ marginTop: '1.5rem', background: 'transparent' }}
          />
        )}
      </div>
      <TransactionForm
        visible={formVisible}
        onHide={() => setFormVisible(false)}
        onSubmit={(input) => createTransaction({ variables: { input } })}
        loading={creating}
      />
    </>
  );
}
