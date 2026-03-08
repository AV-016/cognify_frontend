"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id?: string;
    email?: string;
    name?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('cognify_token');
            const storedUser = localStorage.getItem('cognify_user');

            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Failed to parse stored user', e);
                }
            }

            if (token) {
                try {
                    // Refresh user data silently
                    const freshUser = await api.getMe();
                    if (freshUser) {
                        setUser(freshUser);
                        localStorage.setItem('cognify_user', JSON.stringify(freshUser));
                    }
                } catch (e) {
                    console.error('Failed to refresh user data', e);
                    // If auth fails completely (401), the api handles token removal
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('cognify_token', token);
        localStorage.setItem('cognify_user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('cognify_token');
        localStorage.removeItem('cognify_user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
