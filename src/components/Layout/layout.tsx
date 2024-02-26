import type { ReactElement } from 'react';
import Header from './header';
import Footer from './footer';

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );
}
