import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-900">
                <div className="text-xl text-[#6634E2]">Loading...</div>
            </div>
        );
    }

    // Redirect to landing page if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Render children (which will be the Layout with Outlet)
    return children;
};

export default ProtectedRoute;
