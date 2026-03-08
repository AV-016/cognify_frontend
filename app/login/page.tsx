"use client";

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('user@cognify.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();
    const { login: contextLogin } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await api.login(email, password);
            if (res.token) {
                // API returns { token, userProfile: { userId, name, email, age } }
                const userData = res.userProfile || res.user || { email };
                contextLogin(res.token, userData);
                toast.success("Welcome back!");
            } else {
                throw new Error("Invalid token received");
            }
        } catch (e: any) {
            console.error(e);
            setErrorMsg(e.response?.data?.message || e.response?.data?.error || e.message || "Login failed. Please check your credentials.");
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-light-blue)] to-white flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 w-full max-w-md shadow-lg shadow-blue-100/50 border border-white transition-all duration-500 hover:shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-soft-blue)] rounded-full mb-5 shadow-sm transform transition hover:scale-105">
                        <Activity size={32} className="text-white stroke-[2.5px]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">Cognify</h1>
                    <p className="text-gray-500 mt-2 text-center text-sm font-medium">Your intelligent health context</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center justify-center">
                            {errorMsg}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all shadow-inner"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden group bg-[var(--color-primary-blue)] text-white font-semibold text-lg py-4 rounded-2xl hover:bg-blue-700 transition-all duration-300 hover:shadow-lg disabled:opacity-70 mt-6"
                    >
                        <span className="relative z-10">{loading ? "Authenticating..." : "Sign In"}</span>
                        <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                    </button>

                    <div className="mt-4 text-center">
                        <Link href="/forgot-password" className="text-sm font-medium text-[var(--color-primary-blue)] hover:text-blue-800 hover:underline transition-colors mt-2 block w-max mx-auto">
                            Forgot Password?
                        </Link>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-[var(--color-primary-blue)] hover:underline font-bold">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
