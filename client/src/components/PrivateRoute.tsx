import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  console.log('[🔒 PrivateRoute] token exists:', !!token);
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
