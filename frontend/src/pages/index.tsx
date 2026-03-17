import React from 'react';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { GET_OVERVIEW } from '@/graphql/queries';
import { Overview } from '@/types';
import BalanceCards from '@/components/overview/BalanceCards';
import PotsWidget from '@/components/overview/PotsWidget';
import TransactionsWidget from '@/components/overview/TransactionsWidget';
import BudgetsWidget from '@/components/overview/BudgetsWidget';
import RecurringBillsWidget from '@/components/overview/RecurringBillsWidget';

export default function OverviewPage() {
  const { data, loading, error } = useQuery<{ overview: Overview }>(GET_OVERVIEW);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><ProgressSpinner /></div>;
  if (error) return <Message severity="error" text={`Failed to load overview: ${error.message}`} />;
  if (!data) return null;

  const { overview } = data;

  return (
    <>
      <Head><title>Overview | Finance App</title></Head>
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
      </div>
      <BalanceCards balance={overview.balance} />
      <div className="overview-grid">
        <div className="overview-left">
          <PotsWidget pots={overview.pots} />
          <TransactionsWidget transactions={overview.transactions} />
        </div>
        <div className="overview-right">
          <BudgetsWidget budgets={overview.budgets} />
          <RecurringBillsWidget billsSummary={overview.billsSummary} />
        </div>
      </div>
    </>
  );
}
