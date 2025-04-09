import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  console.log('[🌐 PublicRoute] token exists:', !!token);
  return token ? <Navigate to="/profile" /> : children;
};

export default PublicRoute;
