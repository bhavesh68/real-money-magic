import { ReactNode } from 'react';
import Navbar from './NavBar';

const LayoutWithNavbar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default LayoutWithNavbar;
