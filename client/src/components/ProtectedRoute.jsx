import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const darkMode = localStorage.getItem('darkMode') === 'true';

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className={`w-full flex flex-col items-center justify-center min-h-screen
             ${darkMode ? 'bg-gray-950' : 'bg-gray-100'} flex items-center justify-center `}>
                <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>FU | GOALS</p>
                <p className={`text-xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>Loading...</p>
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
