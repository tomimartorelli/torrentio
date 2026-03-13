import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = 'admin', allowedRoles = [] }) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar si el usuario tiene alguno de ellos
  if (allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some(role => hasRole(role));
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    // Si no se especifican roles permitidos, usar el rol requerido único
    if (!hasRole(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 