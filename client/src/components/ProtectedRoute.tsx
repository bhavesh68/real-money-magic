// !! Prototyping Protacted routes for frontend secure routes
// !! It seemns to work properly so this file is no longer used 
// and others taking it's place. !!

import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;