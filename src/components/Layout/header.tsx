import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <h1 className="me-md-auto">The Recipe Book</h1>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link className="nav-link" href="/">
              Home
            </Link>
          </li>
          {status === 'authenticated' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/recipe/create">
                  Create Recipe
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/login">
                  {session.user?.name}
                </Link>
              </li>
            </>
          )}
          {status === 'unauthenticated' && (
            <li className="nav-item">
              <Link className="nav-link" href="/login">
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}
