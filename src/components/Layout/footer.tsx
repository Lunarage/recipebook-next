import Link from 'next/link';

export default function Footer() {
  return (
    <div className="container sticky-bottom">
      <footer className="py-3 py-md-5 my-4">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          <li className="nav-item">
            <Link className="nav-link px-2 text-body-secondary" href="/">
              Home
            </Link>
          </li>
        </ul>
        <p className="text-center text-body-secondary">Magne Halvorsen</p>
      </footer>
    </div>
  );
}
