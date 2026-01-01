import dynamic from 'next/dynamic';
import MainNavbar from './MainNavbar';

const Footer = dynamic(() => import('./Footer'), { ssr: false });

export default function Layout({ children }) {
  return (
    <div className="app">
      <MainNavbar />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <Footer />
    </div>
  );
}