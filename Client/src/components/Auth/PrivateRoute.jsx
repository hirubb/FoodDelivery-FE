import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children, roles }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If roles are specified, check user role
    if (roles && roles.length > 0) {
        if (!user || !roles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // If authenticated and role is authorized, render children
    return children;
}