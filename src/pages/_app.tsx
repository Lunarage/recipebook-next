import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import type { Metadata } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout/layout';

export const metadata: Metadata = {
  title: 'Recipe Book',
  description: 'For food',
};

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
