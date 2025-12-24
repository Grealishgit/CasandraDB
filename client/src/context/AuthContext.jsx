import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            setUser(response.data); // Backend returns { success, data: user }
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            setUser(response.data); // Backend returns { success, message, data: user }
            setIsAuthenticated(true);
            toast.success('Account created successfully!');
            return { success: true, user: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            setUser(response.data); // Backend returns { success, message, data: user }
            setIsAuthenticated(true);
            toast.success('Login successful!');
            return { success: true, user: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const forgotPassword = async (email) => {
        try {
            await authAPI.forgotPassword(email);
            toast.success('Password reset email sent!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset email';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        forgotPassword,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};