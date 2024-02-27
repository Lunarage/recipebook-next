import type { ReactElement } from 'react';
import Head from 'next/head';
import Header from './header';
import Footer from './footer';

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );
}
