import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- The FIX is here

const PrivateRoute = () => {
  const { token } = useAuth(); // <-- And here

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;