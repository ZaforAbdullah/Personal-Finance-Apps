import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { PrimeReactProvider } from 'primereact/api';
import { apolloClient } from '@/lib/apolloClient';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <PrimeReactProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PrimeReactProvider>
    </ApolloProvider>
  );
}
